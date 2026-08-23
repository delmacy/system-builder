import assert from "node:assert/strict";
import test from "node:test";
import { materializeRuntimeModel } from "../../packages/compiler/runtime-model.js";
import type { CompilerSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

const projection: CompilerSystemDefinitionRuntimeProjection = {
  kind: "SystemDefinitionRuntimeProjection",
  systemDefinitionRef: "system-definition:p13:b",
  entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string" }] }],
  actions: [{ id: "action:update", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
  processes: [],
  environmentRequirements: [
    { name: "storage:files", kind: "storage", required: true },
    { name: "service:notify", kind: "external-service", required: true },
  ],
  jobs: [{ id: "job:update", trigger: { kind: "interval", intervalMs: 1000 }, actionRef: "action:update", recordId: "ticket-1" }],
  events: [{ id: "event:update", source: { kind: "runtime-http" }, actionRef: "action:update" }],
  files: [{ id: "files:attachments", bindingRef: "storage:files", operations: ["put", "get", "delete"] }],
  integrations: [{ id: "integration:notify", invocation: { kind: "http", method: "POST", path: "/notify", bindingRef: "service:notify" } }],
};

test("RuntimeModel materializes Construction B descriptors as immutable reference-only data", () => {
  const result = materializeRuntimeModel("system-definition:p13:b", projection);
  assert.equal(result.model.jobs[0]?.id, "job:update");
  assert.equal(result.model.events[0]?.source.kind, "runtime-http");
  assert.equal(result.model.files[0]?.bindingRef, "storage:files");
  assert.equal(result.model.integrations[0]?.invocation?.bindingRef, "service:notify");
  assert.deepEqual(result.model.environmentRequirements.map(({ name, kind }) => ({ name, kind })), [
    { name: "service:notify", kind: "external-service" },
    { name: "storage:files", kind: "storage" },
  ]);
  const serialized = JSON.stringify(result.model);
  assert.equal(serialized.includes("https://resolved.example"), false);
  assert.equal(serialized.includes("/resolved/storage/root"), false);
});

test("RuntimeModel keeps historical projections compatible with empty Construction B collections", () => {
  const result = materializeRuntimeModel("system-definition:p13:legacy", {
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: "system-definition:p13:legacy",
    entities: [], actions: [], processes: [],
  });
  assert.deepEqual(result.model.jobs, []);
  assert.deepEqual(result.model.events, []);
  assert.deepEqual(result.model.files, []);
  assert.deepEqual(result.model.integrations, []);
  assert.deepEqual(result.model.environmentRequirements, []);
});
