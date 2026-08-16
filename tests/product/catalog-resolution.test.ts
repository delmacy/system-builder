import assert from "node:assert/strict";
import test from "node:test";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";

function makeCatalog(order: "ab" | "ba"): SoftwareCatalogRegistry {
  const catalog = new SoftwareCatalogRegistry();
  const records = [
    {
      capability: "workflow.engine",
      provider: "provider-a",
      version: "1.0.0",
      compatibility: { runtime: "node24" },
    },
    {
      capability: "workflow.engine",
      provider: "provider-b",
      version: "1.0.0",
      compatibility: { runtime: "node24" },
    },
  ] as const;
  for (const index of order === "ab" ? [0, 1] : [1, 0]) catalog.register(records[index]!);
  return catalog;
}

test("catalog resolution is provider-neutral and deterministic across registration order", () => {
  const first = resolveCatalogCandidates(makeCatalog("ab"), {
    capability: "workflow.engine",
    version: "1.0.0",
    compatibility: { runtime: "node24" },
  });
  const second = resolveCatalogCandidates(makeCatalog("ba"), {
    capability: "workflow.engine",
    version: "1.0.0",
    compatibility: { runtime: "node24" },
  });

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;
  assert.deepEqual(first.candidates.map((candidate) => candidate.provider), ["provider-a", "provider-b"]);
  assert.deepEqual(first, second);
});

test("catalog resolution reports missing capability explicitly", () => {
  const result = resolveCatalogCandidates(makeCatalog("ab"), { capability: "storage.blob" });
  assert.deepEqual(result, {
    ok: false,
    diagnostic: { code: "CAPABILITY_NOT_FOUND", capability: "storage.blob" },
  });
});

test("catalog resolution reports incompatible constraints explicitly", () => {
  const result = resolveCatalogCandidates(makeCatalog("ab"), {
    capability: "workflow.engine",
    version: "2.0.0",
  });
  assert.deepEqual(result, {
    ok: false,
    diagnostic: {
      code: "NO_COMPATIBLE_PROVIDER",
      capability: "workflow.engine",
      requestedVersion: "2.0.0",
    },
  });
});
