import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { z } from "zod";

const literalFilter = z.string().trim().min(1).max(128).refine((value) => !/[\\^$.*+?()[\]{}|]/.test(value), "must be a literal substring, not a regular expression");

export const openCodeModelCatalogConfigSchema = z.object({
  schema_version: z.literal(1),
  endpoint: z.url().refine((value) => new URL(value).protocol === "https:", "endpoint must use HTTPS"),
  timeout_seconds: z.number().int().positive().max(60),
  cache_ttl_seconds: z.number().int().positive().max(3600),
}).strict();

export const openCodeAvailableModelSchema = z.object({
  id: z.string().trim().min(1),
  provider: z.literal("opencode"),
  free: z.boolean(),
  family: z.string().nullable(),
  raw_id: z.string().trim().min(1),
}).strict();

export const openCodeModelSelectorSchema = z.object({
  free: z.boolean().optional(),
  name_contains: literalFilter.nullable().optional(),
  preference: z.array(literalFilter).max(20).default([]),
}).strict().superRefine((value, context) => {
  if (value.free === undefined && !value.name_contains && value.preference.length === 0) {
    context.addIssue({ code: "custom", message: "selector must declare free, name_contains or preference" });
  }
});

export const openCodeModelResolutionSchema = z.object({
  requested_selector: openCodeModelSelectorSchema,
  selected_model: z.string().min(1),
  source: z.enum(["api", "cache", "explicit_override"]),
  resolved_at: z.iso.datetime({ offset: true }),
}).strict();

const rawModelSchema = z.object({
  id: z.string().trim().min(1),
  object: z.literal("model"),
  owned_by: z.literal("opencode"),
  created: z.number().int().nonnegative().optional(),
  free: z.boolean().optional(),
}).passthrough();

const responseSchema = z.object({ object: z.literal("list"), data: z.array(rawModelSchema) }).passthrough();
const cacheSchema = z.object({
  schema_version: z.literal(1),
  fetched_at: z.iso.datetime({ offset: true }),
  models: z.array(openCodeAvailableModelSchema),
}).strict();

export type OpenCodeModelCatalogConfig = z.infer<typeof openCodeModelCatalogConfigSchema>;
export type OpenCodeAvailableModel = z.infer<typeof openCodeAvailableModelSchema>;
export type OpenCodeModelSelector = z.infer<typeof openCodeModelSelectorSchema>;
export type OpenCodeModelResolution = z.infer<typeof openCodeModelResolutionSchema>;

export class OpenCodeModelError extends Error {
  constructor(
    readonly code: "OPENCODE_MODEL_API_TIMEOUT" | "OPENCODE_MODEL_API_UNAVAILABLE" | "OPENCODE_MODEL_API_RATE_LIMIT" | "OPENCODE_MODEL_API_5XX" | "MODEL_NOT_AVAILABLE" | "MODEL_POLICY_CONFLICT" | "INVALID_MODEL_SELECTOR" | "INVALID_MODEL_API_RESPONSE",
    message: string,
    readonly retryable: boolean,
  ) { super(`${code}: ${message}`); this.name = "OpenCodeModelError"; }
}

export interface OpenCodeModelCatalogClient { listModels(): OpenCodeAvailableModel[]; }

export type OpenCodeHttpTransport = (endpoint: string, timeoutMs: number) => { status: number; body: string };

export class ZenOpenCodeModelCatalogClient implements OpenCodeModelCatalogClient {
  constructor(
    private readonly config: OpenCodeModelCatalogConfig,
    private readonly transport: OpenCodeHttpTransport = nodeFetchTransport,
  ) {}

  listModels(): OpenCodeAvailableModel[] {
    let response: { status: number; body: string };
    try { response = this.transport(this.config.endpoint, this.config.timeout_seconds * 1000); }
    catch (error) {
      if (error instanceof OpenCodeModelError) throw error;
      const message = error instanceof Error ? error.message : String(error);
      const timeout = /timeout|timed out|abort/i.test(message);
      throw new OpenCodeModelError(timeout ? "OPENCODE_MODEL_API_TIMEOUT" : "OPENCODE_MODEL_API_UNAVAILABLE", message, true);
    }
    if (response.status === 429) throw new OpenCodeModelError("OPENCODE_MODEL_API_RATE_LIMIT", "catalog returned HTTP 429", true);
    if (response.status >= 500) throw new OpenCodeModelError("OPENCODE_MODEL_API_5XX", `catalog returned HTTP ${response.status}`, true);
    if (response.status < 200 || response.status >= 300) throw new OpenCodeModelError("OPENCODE_MODEL_API_UNAVAILABLE", `catalog returned HTTP ${response.status}`, true);
    try { return normalizeOpenCodeModels(JSON.parse(response.body)); }
    catch (error) {
      if (error instanceof OpenCodeModelError) throw error;
      throw new OpenCodeModelError("INVALID_MODEL_API_RESPONSE", error instanceof Error ? error.message : String(error), false);
    }
  }
}

export type OpenCodeModelResolverOptions = {
  cachePath: string;
  cacheTtlSeconds: number;
  now?: () => string;
};

export class OpenCodeModelResolver {
  private readonly now: () => string;
  constructor(private readonly client: OpenCodeModelCatalogClient, private readonly options: OpenCodeModelResolverOptions) {
    this.now = options.now ?? (() => new Date().toISOString());
  }

  resolve(input: { selector: unknown; explicitModel?: string | null; overrideModel?: string | null }): OpenCodeModelResolution {
    const parsed = openCodeModelSelectorSchema.safeParse(input.selector);
    if (!parsed.success) throw new OpenCodeModelError("INVALID_MODEL_SELECTOR", parsed.error.issues.map((issue) => issue.message).join("; "), false);
    const selector = parsed.data;
    const { models, source } = this.catalog();
    const override = normalizeOptional(input.overrideModel);
    const explicit = normalizeOptional(input.explicitModel);
    if (override && explicit && override !== explicit) {
      throw new OpenCodeModelError("MODEL_POLICY_CONFLICT", `override ${override} conflicts with planned model ${explicit}`, false);
    }
    const requested = override ?? explicit;
    let selected: OpenCodeAvailableModel | undefined;
    if (requested) {
      selected = models.find((model) => model.id === requested);
      if (!selected) throw new OpenCodeModelError("MODEL_NOT_AVAILABLE", `model ${requested} is absent from the current catalog`, false);
      if (!matchesPolicy(selected, selector)) throw new OpenCodeModelError("MODEL_POLICY_CONFLICT", `model ${requested} does not satisfy the selector`, false);
    } else {
      const eligible = models.filter((model) => matchesPolicy(model, selector));
      for (const preference of selector.preference) {
        selected = eligible.filter((model) => includesLiteral(model.id, preference)).sort(byId)[0];
        if (selected) break;
      }
      selected ??= eligible.sort(byId)[0];
      if (!selected) throw new OpenCodeModelError("MODEL_NOT_AVAILABLE", "no catalog model satisfies the selector", false);
    }
    return openCodeModelResolutionSchema.parse({
      requested_selector: selector,
      selected_model: selected.id,
      source: override ? "explicit_override" : source,
      resolved_at: this.now(),
    });
  }

  private catalog(): { models: OpenCodeAvailableModel[]; source: "api" | "cache" } {
    const cached = readCache(this.options.cachePath);
    if (cached && Date.parse(this.now()) - Date.parse(cached.fetched_at) <= this.options.cacheTtlSeconds * 1000) {
      return { models: cached.models, source: "cache" };
    }
    const models = this.client.listModels();
    writeCache(this.options.cachePath, { schema_version: 1, fetched_at: this.now(), models });
    return { models, source: "api" };
  }
}

export function normalizeOpenCodeModels(input: unknown): OpenCodeAvailableModel[] {
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success) throw new OpenCodeModelError("INVALID_MODEL_API_RESPONSE", parsed.error.issues.map((issue) => issue.message).join("; "), false);
  const seen = new Set<string>();
  const models = parsed.data.data.map((raw) => {
    if (seen.has(raw.id)) throw new OpenCodeModelError("INVALID_MODEL_API_RESPONSE", `duplicate model id ${raw.id}`, false);
    seen.add(raw.id);
    const family = raw.id.match(/^([a-z0-9]+)(?:-|$)/i)?.[1]?.toLowerCase() ?? null;
    return openCodeAvailableModelSchema.parse({
      id: raw.id,
      provider: "opencode",
      free: raw.free ?? raw.id.toLowerCase().endsWith("-free"),
      family,
      raw_id: raw.id,
    });
  });
  return models.sort(byId);
}

function matchesPolicy(model: OpenCodeAvailableModel, selector: OpenCodeModelSelector): boolean {
  if (selector.free !== undefined && model.free !== selector.free) return false;
  return !selector.name_contains || includesLiteral(model.id, selector.name_contains);
}

function includesLiteral(value: string, filter: string): boolean { return value.toLocaleLowerCase("en-US").includes(filter.toLocaleLowerCase("en-US")); }
function byId(a: OpenCodeAvailableModel, b: OpenCodeAvailableModel): number { return a.id.localeCompare(b.id, "en-US"); }
function normalizeOptional(value: string | null | undefined): string | undefined { const normalized = value?.trim(); return normalized || undefined; }

function readCache(path: string): z.infer<typeof cacheSchema> | undefined {
  if (!existsSync(path)) return undefined;
  try { return cacheSchema.parse(JSON.parse(readFileSync(path, "utf8"))); } catch { return undefined; }
}

function writeCache(path: string, value: z.infer<typeof cacheSchema>): void {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, `${JSON.stringify(cacheSchema.parse(value), null, 2)}\n`, { flag: "wx" });
    renameSync(temporary, path);
  } finally { if (existsSync(temporary)) rmSync(temporary); }
}

function nodeFetchTransport(endpoint: string, timeoutMs: number): { status: number; body: string } {
  const script = `const [u,t]=process.argv.slice(1);try{const r=await fetch(u,{signal:AbortSignal.timeout(Number(t))});const b=await r.text();process.stdout.write(JSON.stringify({status:r.status,body:b}))}catch(e){process.stderr.write(String(e?.name||e)+': '+String(e?.message||e));process.exit(2)}`;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", script, endpoint, String(timeoutMs)], {
    encoding: "utf8", shell: false, windowsHide: true, timeout: timeoutMs + 1000,
  });
  if ((result.error as NodeJS.ErrnoException | undefined)?.code === "ETIMEDOUT" || /TimeoutError|timed out/i.test(result.stderr)) {
    throw new OpenCodeModelError("OPENCODE_MODEL_API_TIMEOUT", result.stderr || "catalog request timed out", true);
  }
  if (result.error || result.status !== 0) throw new OpenCodeModelError("OPENCODE_MODEL_API_UNAVAILABLE", result.error?.message || result.stderr || `catalog client exited ${result.status}`, true);
  try { return z.object({ status: z.number().int(), body: z.string() }).strict().parse(JSON.parse(result.stdout)); }
  catch (error) { throw new OpenCodeModelError("INVALID_MODEL_API_RESPONSE", error instanceof Error ? error.message : String(error), false); }
}

export function loadOpenCodeModelCatalogConfig(root = process.cwd()): OpenCodeModelCatalogConfig {
  const path = resolve(root, "tooling/agent-harness/policies/OPENCODE_MODELS.json");
  return openCodeModelCatalogConfigSchema.parse(JSON.parse(readFileSync(path, "utf8")));
}
