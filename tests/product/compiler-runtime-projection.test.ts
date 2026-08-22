import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSystemDefinitionRuntimeProjection, type CompilerSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

function projection(): CompilerSystemDefinitionRuntimeProjection {
  return {
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: "system-definition:p13:1",
    entities: [
      { id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] },
      { id: "entity:user", fields: [{ name: "name", type: "string" }] },
    ],
    actions: [{ id: "action:close", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
    processes: [{ id: "process:ticket", states: ["closed", "open"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close" }] }],
  };
}

test("runtime projection binds exact SystemDefinition identity and canonicalizes ordering", () => {
  const first = normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", projection());
  const reversed = projection();
  const second = normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", { ...reversed, entities: [...reversed.entities].reverse(), actions: [...reversed.actions].reverse(), processes: reversed.processes.map((process) => ({ ...process, states: [...process.states].reverse() })) });
  assert.deepEqual(first, second);
  assert.deepEqual(first.entities.map((entity) => entity.id), ["entity:ticket", "entity:user"]);
  assert.deepEqual(first.processes[0]?.states, ["closed", "open"]);
  assert.equal(first.processes[0]?.initialState, "open");
});

test("runtime projection fails closed on identity, initial state and transition references", () => {
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:other", projection()), /COMPILER_RUNTIME_PROJECTION_REFERENCE_MISMATCH/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", { ...projection(), entities: [...projection().entities, projection().entities[0]!] }), /COMPILER_RUNTIME_PROJECTION_DUPLICATE_ENTITY/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", { ...projection(), actions: [{ id: "action:bad", effect: { kind: "entity.delete", entityRef: "entity:missing" } }] }), /COMPILER_RUNTIME_PROJECTION_UNKNOWN_ACTION_ENTITY/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", { ...projection(), processes: [{ id: "process:bad", states: ["open"], transitions: [{ id: "transition:bad", from: "open", to: "open" }] }] }), /COMPILER_RUNTIME_PROJECTION_INITIAL_STATE_REQUIRED/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", { ...projection(), processes: [{ id: "process:bad", states: ["open"], initialState: "missing", transitions: [{ id: "transition:bad", from: "open", to: "open" }] }] }), /COMPILER_RUNTIME_PROJECTION_UNKNOWN_INITIAL_STATE/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:1", { ...projection(), processes: [{ id: "process:bad", states: ["open"], initialState: "open", transitions: [{ id: "transition:bad", from: "open", to: "missing" }] }] }), /COMPILER_RUNTIME_PROJECTION_UNKNOWN_TRANSITION_STATE/);
});
