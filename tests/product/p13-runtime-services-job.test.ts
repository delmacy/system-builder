import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

function compileJob() {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:job", components: [], sourceRefs: ["source:p13"] };
  const assemblyPlan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileRuntimeModelRelease({
    assemblyPlan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: assemblyPlan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: assemblyPlan.contentHash }) },
    compilerVersion: "0.1.0", runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: "system-definition:p13:job",
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string" }] }],
      actions: [{ id: "action:update", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
      processes: [],
      jobs: [{ id: "job:update", trigger: { kind: "interval", intervalMs: 25 }, actionRef: "action:update", recordId: "ticket-1" }],
    },
  });
}

test("generated Runtime embeds bounded interval job execution and shutdown cleanup", () => {
  const result = compileJob();
  const entry = result.files.find((file) => file.path === "runtime-entry.mjs")?.content ?? "";
  const model = result.files.find((file) => file.path === "runtime-model.json")?.content ?? "";
  assert.match(entry, /runtimeStartJobs/);
  assert.match(entry, /setInterval/);
  assert.match(entry, /clearInterval/);
  assert.match(entry, /runtimeExecuteDeclaredAction/);
  assert.match(model, /job:update/);
  assert.equal(entry.includes("builder"), false);
});
