import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSystemDefinitionRuntimeProjection, type CompilerSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

function projection(): CompilerSystemDefinitionRuntimeProjection {
  return {
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
}

test("Construction B runtime projection canonicalizes service descriptors deterministically", () => {
  const first = normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", projection());
  const source = projection();
  const second = normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", {
    ...source,
    environmentRequirements: [...(source.environmentRequirements ?? [])].reverse(),
    jobs: [...(source.jobs ?? [])].reverse(),
    events: [...(source.events ?? [])].reverse(),
    files: (source.files ?? []).map((file) => ({ ...file, operations: [...file.operations].reverse() })),
    integrations: [...(source.integrations ?? [])].reverse(),
  });
  assert.deepEqual(first, second);
  assert.deepEqual(first.files?.[0]?.operations, ["delete", "get", "put"]);
});

test("Construction B projection fails closed on unknown actions and bindings", () => {
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", { ...projection(), jobs: [{ id: "job:bad", trigger: { kind: "interval", intervalMs: 1 }, actionRef: "action:missing", recordId: "ticket-1" }] }), /UNKNOWN_JOB_ACTION/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", { ...projection(), files: [{ id: "files:bad", bindingRef: "storage:missing", operations: ["get"] }] }), /UNKNOWN_BINDING_REFERENCE/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", { ...projection(), files: [{ id: "files:bad", bindingRef: "service:notify", operations: ["get"] }] }), /INCOMPATIBLE_BINDING/);
});

test("Construction B projection rejects malformed schedules and integration paths without resolving values", () => {
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", { ...projection(), jobs: [{ id: "job:bad", trigger: { kind: "interval", intervalMs: 0 }, actionRef: "action:update", recordId: "ticket-1" }] }), /INVALID_JOB_TRIGGER/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", { ...projection(), integrations: [{ id: "integration:bad", invocation: { kind: "http", method: "POST", path: "https://resolved.example", bindingRef: "service:notify" } }] }), /INVALID_INTEGRATION_PATH/);
  const normalized = normalizeSystemDefinitionRuntimeProjection("system-definition:p13:b", projection());
  assert.equal(JSON.stringify(normalized).includes("resolved.example"), false);
});
