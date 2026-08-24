import assert from "node:assert/strict";
import test from "node:test";
import { materializeRuntimeGeneratedViewBindings } from "../../packages/runtime-core/generated-view-bindings.js";

function model() {
  return {
    entities: [
      { id: "entity:ticket", fields: [
        { name: "title", type: "string", required: true },
        { name: "priority", type: "number", required: false },
      ] },
    ],
    actions: [
      { id: "action:update-ticket", effect: { kind: "entity.update", entityRef: "entity:ticket" } },
      { id: "action:delete-ticket", effect: { kind: "entity.delete", entityRef: "entity:ticket" } },
    ],
    views: [
      { id: "view:ticket-form", binding: { entityRef: "entity:ticket", fieldRefs: ["title", "priority"], actionRefs: ["action:update-ticket"] } },
    ],
  } as const;
}

test("materializes deterministic renderer-agnostic bindings from explicit references", () => {
  const result = materializeRuntimeGeneratedViewBindings(model());
  assert.deepEqual(result, {
    kind: "RuntimeGeneratedViewBindings",
    bindings: [{
      viewRef: "view:ticket-form",
      entityRef: "entity:ticket",
      fields: [
        { fieldRef: "priority", type: "number", required: false },
        { fieldRef: "title", type: "string", required: true },
      ],
      actions: [{ actionRef: "action:update-ticket" }],
    }],
  });
  assert.equal(JSON.stringify(result).includes("component"), false);
  assert.equal(JSON.stringify(result).includes("framework"), false);
});

test("declaration order does not affect generated bindings", () => {
  const first = model();
  const second = {
    entities: [{ id: "entity:ticket", fields: [...first.entities[0].fields].reverse() }],
    actions: [...first.actions].reverse(),
    views: [{ id: "view:ticket-form", binding: { entityRef: "entity:ticket", fieldRefs: ["priority", "title"], actionRefs: ["action:update-ticket"] } }],
  } as const;
  assert.deepEqual(
    materializeRuntimeGeneratedViewBindings(first),
    materializeRuntimeGeneratedViewBindings(second),
  );
});

test("unbound views do not acquire inferred bindings", () => {
  const result = materializeRuntimeGeneratedViewBindings({ ...model(), views: [{ id: "view:ticket-form" }] });
  assert.deepEqual(result.bindings, []);
});

test("unknown entity field and action references fail closed", () => {
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), views: [{ id: "view:x", binding: { entityRef: "entity:missing" } }] }),
    /RUNTIME_GENERATED_BINDING_UNKNOWN_ENTITY:view:x:entity:missing/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), views: [{ id: "view:x", binding: { entityRef: "entity:ticket", fieldRefs: ["missing"] } }] }),
    /RUNTIME_GENERATED_BINDING_UNKNOWN_FIELD:view:x:entity:ticket:missing/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), views: [{ id: "view:x", binding: { entityRef: "entity:ticket", actionRefs: ["action:missing"] } }] }),
    /RUNTIME_GENERATED_BINDING_UNKNOWN_ACTION:view:x:action:missing/,
  );
});

test("ambiguous declarations and duplicate binding references fail closed", () => {
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), entities: [...model().entities, model().entities[0]] }),
    /RUNTIME_GENERATED_BINDING_AMBIGUOUS_ENTITY:entity:ticket/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), views: [model().views[0], model().views[0]] }),
    /RUNTIME_GENERATED_BINDING_AMBIGUOUS_VIEW:view:ticket-form/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), views: [{ id: "view:x", binding: { entityRef: "entity:ticket", fieldRefs: ["title", "title"] } }] }),
    /RUNTIME_GENERATED_BINDING_AMBIGUOUS_FIELD_REFERENCE:view:x:title/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({ ...model(), views: [{ id: "view:x", binding: { entityRef: "entity:ticket", actionRefs: ["action:update-ticket", "action:update-ticket"] } }] }),
    /RUNTIME_GENERATED_BINDING_AMBIGUOUS_ACTION_REFERENCE:view:x:action:update-ticket/,
  );
});
