import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

function buildCatalog() {
  const registry = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) registry.register(record);
  return registry;
}

function executeFactory(definition = factorySystemDefinition, analysis = factoryAnalysis) {
  const registry = buildCatalog();
  const assembly = assembleSystemDefinition(
    definition,
    "system-definition:e2e:1",
    (request) => resolveCatalogCandidates(registry, request),
  );
  if (!assembly.ok) return { stage: "assembly" as const, assembly };

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis,
    definition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "factory-e2e", status: "PASS", evidenceRefs: ["test:factory-e2e"] }],
  });
  if (validation.decision !== "PASS") {
    return { stage: "validation" as const, assembly, validation };
  }

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: factoryEnvironmentSchema,
  });
  return { stage: "compiled" as const, assembly, validation, compilation };
}

test("factory E2E reaches reproducible ReleaseArtifact through actual module APIs", () => {
  const first = executeFactory();
  const second = executeFactory();

  assert.equal(first.stage, "compiled");
  assert.equal(second.stage, "compiled");
  if (first.stage !== "compiled" || second.stage !== "compiled") return;

  assert.equal(first.assembly.plan.contentHash, second.assembly.plan.contentHash);
  assert.equal(first.validation.evidenceHash, second.validation.evidenceHash);
  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.deepEqual(first.compilation.artifact, second.compilation.artifact);
});

test("factory E2E stops at Assembly when a required capability cannot resolve", () => {
  const brokenDefinition = {
    ...factorySystemDefinition,
    capabilities: [
      ...factorySystemDefinition.capabilities.slice(0, 1),
      { id: "cap-missing", capability: "storage.blob", requirementRefs: ["REQ-2"] },
    ],
  };
  const result = executeFactory(brokenDefinition);

  assert.equal(result.stage, "assembly");
  if (result.stage !== "assembly") return;
  assert.equal(result.assembly.ok, false);
});

test("factory E2E stops at Validation when requirement traceability is broken", () => {
  const brokenAnalysis = { findings: [{ recipeRequirementRefs: ["REQ-1"] }] };
  const result = executeFactory(factorySystemDefinition, brokenAnalysis);

  assert.equal(result.stage, "validation");
  if (result.stage !== "validation") return;
  assert.equal(result.validation.decision, "FAIL");
  assert.ok(
    result.validation.checks
      .find((check) => check.id === "traceability:REQ-2")
      ?.evidenceRefs?.includes("missing:analysis:REQ-2"),
  );
});
