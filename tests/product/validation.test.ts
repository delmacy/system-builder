import assert from "node:assert/strict";
import test from "node:test";
import { validateTraceability } from "../../packages/validation/index.js";

const recipe = {
  modules: [{ requirementIds: ["REQ-2", "REQ-1"] }],
  rules: [{ requirementIds: ["REQ-1"] }],
  responsibilities: [],
  exceptions: [],
};

const analysis = {
  findings: [
    { recipeRequirementRefs: ["REQ-2"] },
    { recipeRequirementRefs: ["REQ-1"] },
  ],
};

const definition = {
  entities: [{ requirementRefs: ["REQ-1"] }],
  processes: [{ requirementRefs: ["REQ-2"] }],
  actions: [],
  capabilities: [
    { capability: "workflow.engine", requirementRefs: ["REQ-2"] },
    { capability: "auth.basic", requirementRefs: ["REQ-1"] },
  ],
  views: [],
  policies: [],
  integrations: [],
};

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  contentHash: `sha256:${"a".repeat(64)}`,
  components: [
    { capability: "workflow.engine" },
    { capability: "auth.basic" },
  ],
};

test("validation emits deterministic PASS evidence for complete traceability", () => {
  const first = validateTraceability({
    recipe,
    analysis,
    definition,
    assemblyPlan,
    assemblyPlanRef: assemblyPlan.contentHash,
    declaredChecks: [{ id: "unit-tests", status: "PASS", evidenceRefs: ["test:unit"] }],
  });
  const reordered = validateTraceability({
    recipe: { ...recipe, modules: [{ requirementIds: ["REQ-1", "REQ-2"] }] },
    analysis: { findings: [...analysis.findings].reverse() },
    definition: { ...definition, capabilities: [...definition.capabilities].reverse() },
    assemblyPlan: { ...assemblyPlan, components: [...assemblyPlan.components].reverse() },
    assemblyPlanRef: assemblyPlan.contentHash,
    declaredChecks: [{ id: "unit-tests", status: "PASS", evidenceRefs: ["test:unit"] }],
  });

  assert.equal(first.decision, "PASS");
  assert.deepEqual(first, reordered);
  assert.match(first.evidenceHash, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(first.checks.map((check) => check.id), [
    "declared:unit-tests",
    "traceability:REQ-1",
    "traceability:REQ-2",
  ]);
});

test("validation emits FAIL with explicit missing traceability evidence", () => {
  const result = validateTraceability({
    recipe,
    analysis: { findings: [{ recipeRequirementRefs: ["REQ-1"] }] },
    definition,
    assemblyPlan,
    assemblyPlanRef: assemblyPlan.contentHash,
  });

  assert.equal(result.decision, "FAIL");
  const check = result.checks.find((candidate) => candidate.id === "traceability:REQ-2");
  assert.equal(check?.status, "FAIL");
  assert.ok(check?.evidenceRefs?.includes("missing:analysis:REQ-2"));
});

test("validation emits FAIL when a declared test/check fails", () => {
  const result = validateTraceability({
    recipe,
    analysis,
    definition,
    assemblyPlan,
    assemblyPlanRef: assemblyPlan.contentHash,
    declaredChecks: [{ id: "integration-tests", status: "FAIL", evidenceRefs: ["test:integration"] }],
  });

  assert.equal(result.decision, "FAIL");
  assert.deepEqual(
    result.checks.find((check) => check.id === "declared:integration-tests"),
    { id: "declared:integration-tests", status: "FAIL", evidenceRefs: ["test:integration"] },
  );
});

test("validation does not mutate upstream artifacts", () => {
  const before = JSON.stringify({ recipe, analysis, definition, assemblyPlan });
  validateTraceability({ recipe, analysis, definition, assemblyPlan, assemblyPlanRef: assemblyPlan.contentHash });
  assert.equal(JSON.stringify({ recipe, analysis, definition, assemblyPlan }), before);
});
