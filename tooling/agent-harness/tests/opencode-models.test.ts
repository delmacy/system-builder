import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  normalizeOpenCodeModels,
  OpenCodeModelError,
  OpenCodeModelResolver,
  ZenOpenCodeModelCatalogClient,
  type OpenCodeAvailableModel,
} from "../src/opencode-models.js";

const at = "2026-08-14T12:00:00.000Z";
const config = { schema_version: 1 as const, endpoint: "https://opencode.ai/zen/v1/models", timeout_seconds: 10, cache_ttl_seconds: 300 };

function response(ids: Array<string | { id: string; free: boolean }>): unknown {
  return { object: "list", data: ids.map((value) => ({
    id: typeof value === "string" ? value : value.id,
    object: "model", owned_by: "opencode", created: 1,
    ...(typeof value === "string" ? {} : { free: value.free }),
  })) };
}

function normalized(ids = ["deepseek-v4-flash-free", "mimo-v2.5-free", "nemotron-3-ultra-free", "claude-opus-5"]): OpenCodeAvailableModel[] {
  return normalizeOpenCodeModels(response(ids));
}

function resolver(models = normalized(), options: { now?: string; cachePath?: string; calls?: string[] } = {}): OpenCodeModelResolver {
  return new OpenCodeModelResolver({ listModels: () => { options.calls?.push("api"); return models; } }, {
    cachePath: options.cachePath ?? join(mkdtempSync(join(tmpdir(), "sb-models-")), "catalog.json"),
    cacheTtlSeconds: 300,
    now: () => options.now ?? at,
  });
}

function expectCode(operation: () => unknown, code: OpenCodeModelError["code"], retryable: boolean): void {
  assert.throws(operation, (error) => error instanceof OpenCodeModelError && error.code === code && error.retryable === retryable);
}

describe("OpenCode model discovery and selection", () => {
  it("1 normalizes a valid API list into stable provider models", () => {
    assert.deepEqual(normalized(["mimo-v2.5-free", "deepseek-v4-flash-free"]).map((item) => item.id), ["deepseek-v4-flash-free", "mimo-v2.5-free"]);
  });

  it("2 identifies the free suffix explicitly", () => {
    assert.equal(normalized(["deepseek-v4-flash-free"])[0]!.free, true);
  });

  it("3 gives an official free boolean priority over the suffix heuristic", () => {
    assert.equal(normalizeOpenCodeModels(response([{ id: "claimed-free", free: false }]))[0]!.free, false);
    assert.equal(normalizeOpenCodeModels(response([{ id: "official-model", free: true }]))[0]!.free, true);
  });

  it("4 never accepts a non-free model for free-only selection", () => {
    expectCode(() => resolver(normalized(["claude-opus-5"])).resolve({ selector: { free: true } }), "MODEL_NOT_AVAILABLE", false);
  });

  it("5 finds deepseek through a literal name filter", () => {
    assert.equal(resolver().resolve({ selector: { free: true, name_contains: "deepseek" } }).selected_model, "deepseek-v4-flash-free");
  });

  it("6 matches name filters case-insensitively", () => {
    assert.equal(resolver().resolve({ selector: { free: true, name_contains: "DeepSeek" } }).selected_model, "deepseek-v4-flash-free");
  });

  it("7 falls through preferences deterministically", () => {
    assert.equal(resolver(normalized(["mimo-v2.5-free", "nemotron-3-ultra-free"])).resolve({ selector: { free: true, preference: ["deepseek", "mimo", "nemotron"] } }).selected_model, "mimo-v2.5-free");
  });

  it("8 ignores arbitrary API response order", () => {
    const selector = { free: true, preference: ["nemotron"] };
    const first = resolver(normalized(["nemotron-3.5-lightning-free", "nemotron-3-ultra-free"])).resolve({ selector });
    const second = resolver(normalized(["nemotron-3-ultra-free", "nemotron-3.5-lightning-free"])).resolve({ selector });
    assert.equal(first.selected_model, second.selected_model);
    assert.equal(first.selected_model, "nemotron-3-ultra-free");
  });

  it("9 blocks when no model is compatible", () => {
    expectCode(() => resolver().resolve({ selector: { free: true, name_contains: "absent" } }), "MODEL_NOT_AVAILABLE", false);
  });

  it("10 accepts an existing explicit compatible model", () => {
    assert.equal(resolver().resolve({ selector: { free: true }, explicitModel: "mimo-v2.5-free" }).selected_model, "mimo-v2.5-free");
  });

  it("11 blocks an explicit model absent from the catalog", () => {
    expectCode(() => resolver().resolve({ selector: { free: true }, explicitModel: "missing-free" }), "MODEL_NOT_AVAILABLE", false);
  });

  it("12 blocks an explicit paid model under free-only policy", () => {
    expectCode(() => resolver().resolve({ selector: { free: true }, explicitModel: "claude-opus-5" }), "MODEL_POLICY_CONFLICT", false);
  });

  it("13 classifies an API timeout as retryable", () => {
    const client = new ZenOpenCodeModelCatalogClient(config, () => { throw new Error("request timed out"); });
    expectCode(() => client.listModels(), "OPENCODE_MODEL_API_TIMEOUT", true);
  });

  it("14 classifies API 5xx as retryable", () => {
    const client = new ZenOpenCodeModelCatalogClient(config, () => ({ status: 503, body: "down" }));
    expectCode(() => client.listModels(), "OPENCODE_MODEL_API_5XX", true);
  });

  it("15 classifies API rate limits as retryable", () => {
    const client = new ZenOpenCodeModelCatalogClient(config, () => ({ status: 429, body: "slow" }));
    expectCode(() => client.listModels(), "OPENCODE_MODEL_API_RATE_LIMIT", true);
  });

  it("16 fails closed on a malformed API response", () => {
    const client = new ZenOpenCodeModelCatalogClient(config, () => ({ status: 200, body: '{"object":"list","data":[{"id":3}]}' }));
    expectCode(() => client.listModels(), "INVALID_MODEL_API_RESPONSE", false);
  });

  it("17 uses a valid cache without consulting the API", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-model-cache-"));
    const path = join(root, "catalog.json");
    writeFileSync(path, JSON.stringify({ schema_version: 1, fetched_at: at, models: normalized(["mimo-v2.5-free"]) }));
    const calls: string[] = [];
    const result = resolver(normalized(["deepseek-v4-flash-free"]), { cachePath: path, calls }).resolve({ selector: { free: true } });
    assert.equal(result.selected_model, "mimo-v2.5-free");
    assert.equal(result.source, "cache");
    assert.deepEqual(calls, []);
  });

  it("18 never uses an expired cache silently when refresh fails", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-model-expired-"));
    const path = join(root, "catalog.json");
    writeFileSync(path, JSON.stringify({ schema_version: 1, fetched_at: "2026-08-14T11:00:00.000Z", models: normalized(["mimo-v2.5-free"]) }));
    const subject = new OpenCodeModelResolver({ listModels: () => { throw new OpenCodeModelError("OPENCODE_MODEL_API_UNAVAILABLE", "down", true); } }, { cachePath: path, cacheTtlSeconds: 300, now: () => at });
    expectCode(() => subject.resolve({ selector: { free: true } }), "OPENCODE_MODEL_API_UNAVAILABLE", true);
  });

  it("19 rejects operator regex in a selector", () => {
    expectCode(() => resolver().resolve({ selector: { free: true, name_contains: ".*" } }), "INVALID_MODEL_SELECTOR", false);
  });

  it("20 derives a conservative normalized family", () => {
    assert.equal(normalized(["DeepSeek-v4-flash-free"])[0]!.family, "deepseek");
  });

  it("21 validates an operator override and records its source", () => {
    const result = resolver().resolve({ selector: { free: true }, overrideModel: "mimo-v2.5-free" });
    assert.equal(result.selected_model, "mimo-v2.5-free");
    assert.equal(result.source, "explicit_override");
  });

  it("22 blocks an operator override that conflicts with a planned concrete model", () => {
    expectCode(() => resolver().resolve({ selector: { free: true }, explicitModel: "mimo-v2.5-free", overrideModel: "deepseek-v4-flash-free" }), "MODEL_POLICY_CONFLICT", false);
  });
});
