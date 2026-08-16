import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";

function catalogResolver() {
  const catalog = new SoftwareCatalogRegistry();
  catalog.register({ capability: "workflow.engine", provider: "provider-b", version: "1.0.0" });
  catalog.register({ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" });
  catalog.register({
    capability: "auth.basic",
    provider: "provider-auth",
    version: "1.0.0",
    dependencies: ["storage.session"],
  });
  return (request: Readonly<{ capability: string }>) => resolveCatalogCandidates(catalog, request);
}

const definition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:fixture:1",
  recipeRef: "recipe:fixture:1",
  capabilities: [
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
    { id: "cap-auth", capability: "auth.basic", requirementRefs: ["REQ-1"] },
  ],
};

test("assembly resolves SystemDefinition capabilities into deterministic AssemblyPlan", () => {
  const first = assembleSystemDefinition(definition, "system-definition:fixture:1", catalogResolver());
  const reversed = assembleSystemDefinition(
    { ...definition, capabilities: [...definition.capabilities].reverse() },
    "system-definition:fixture:1",
    catalogResolver(),
  );

  assert.equal(first.ok, true);
  assert.equal(reversed.ok, true);
  if (!first.ok || !reversed.ok) return;
  assert.deepEqual(first.plan, reversed.plan);
  assert.match(first.plan.contentHash, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(first.plan.components, [
    {
      capability: "auth.basic",
      provider: "provider-auth",
      version: "1.0.0",
      dependencies: ["storage.session"],
    },
    {
      capability: "workflow.engine",
      provider: "provider-a",
      version: "1.0.0",
    },
  ]);
});

test("assembly returns explicit diagnostic and no plan when a capability is missing", () => {
  const result = assembleSystemDefinition(
    {
      ...definition,
      capabilities: [{ id: "cap-missing", capability: "storage.blob", requirementRefs: ["REQ-3"] }],
    },
    "system-definition:fixture:missing",
    catalogResolver(),
  );

  assert.deepEqual(result, {
    ok: false,
    diagnostics: [
      {
        code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
        capability: "storage.blob",
        reason: "CAPABILITY_NOT_FOUND",
      },
    ],
  });
});

test("assembly propagates incompatible provider diagnostics deterministically", () => {
  const result = assembleSystemDefinition(
    definition,
    "system-definition:fixture:incompatible",
    ({ capability }) => ({
      ok: false,
      diagnostic: { code: "NO_COMPATIBLE_PROVIDER", capability },
    }),
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(
    result.diagnostics.map((diagnostic) => [diagnostic.capability, diagnostic.reason]),
    [
      ["auth.basic", "NO_COMPATIBLE_PROVIDER"],
      ["workflow.engine", "NO_COMPATIBLE_PROVIDER"],
    ],
  );
});
