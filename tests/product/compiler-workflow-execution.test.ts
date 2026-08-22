import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileWorkflowRuntimeRelease } from "../../packages/compiler/workflow-runtime.js";

function compile() {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:workflow", components: [], sourceRefs: [] };
  const plan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileWorkflowRuntimeRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ plan: plan.contentHash, decision: "PASS" }) },
    compilerVersion: "0.1.0", runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [{ id: "action:close", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
      processes: [{ id: "process:ticket", states: ["closed", "open"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close" }] }],
    },
  });
}

test("Compiler materializes durable workflow state and explicit transition execution", () => {
  const result = compile();
  const entrypoint = result.files.find((file) => file.path === "runtime-entry.mjs");
  const model = result.files.find((file) => file.path === "runtime-model.json");
  const migration = result.files.find((file) => file.path === "migrations/runtime-workflows/001-workflow-state.sql");
  assert.ok(entrypoint);
  assert.ok(model);
  assert.ok(migration);
  assert.match(entrypoint.content, /RUNTIME_WORKFLOW_INVALID_TRANSITION/);
  assert.match(entrypoint.content, /sb_runtime_workflow_state/);
  assert.match(entrypoint.content, /runtimeWorkflowAction/);
  assert.equal(entrypoint.content.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(JSON.parse(model.content).processes[0].initialState, "open");
  assert.ok(result.artifact.manifest.files.includes(migration.path));
  assert.ok(result.artifact.manifest.files.includes("runtime-entry.mjs"));
});
