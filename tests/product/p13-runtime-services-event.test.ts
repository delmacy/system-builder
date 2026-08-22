import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

function compileEvent() {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:event", components: [], sourceRefs: ["source:p13"] };
  const assemblyPlan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileRuntimeModelRelease({
    assemblyPlan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: assemblyPlan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: assemblyPlan.contentHash }) },
    compilerVersion: "0.1.0", runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: "system-definition:p13:event",
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string" }] }],
      actions: [{ id: "action:update", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
      processes: [],
      events: [{ id: "event:update", source: { kind: "runtime-http" }, actionRef: "action:update" }],
    },
  });
}

test("generated Runtime embeds declared runtime-http event dispatch", () => {
  const result = compileEvent();
  const entry = result.files.find((file) => file.path === "runtime-entry.mjs")?.content ?? "";
  const model = result.files.find((file) => file.path === "runtime-model.json")?.content ?? "";
  assert.match(entry, /runtimeHandleEventRequest/);
  assert.match(entry, /RUNTIME_EVENT_INVALID_BODY/);
  assert.match(entry, /runtimeExecuteDeclaredAction/);
  assert.match(entry, /\/events\\\//);
  assert.match(model, /event:update/);
  assert.match(model, /runtime-http/);
});
