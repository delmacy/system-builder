import assert from "node:assert/strict";
import test from "node:test";

import { ComponentRegistry } from "./registry.js";
import { defineCompositionGraph } from "./graph.js";
import { createComponentEditorState, mutateComponentEditorContract } from "./component-editor.js";
import type { ComponentDescriptor } from "./types.js";

const descriptor: ComponentDescriptor = {
  id: "station.card",
  family: "semantic-composite",
  layout: "grid",
  layoutOwnership: "self",
  childPolicy: "multiple",
  constraints: { minColumns: 2, maxColumns: 8, recommendedColumns: 4, minRows: 1, maxRows: 6, recommendedRows: 2 },
  slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: ["atomic", "collection"] }],
};

function fixture() {
  const registry = new ComponentRegistry([descriptor]);
  const graph = defineCompositionGraph({ rootRef: "root", nodes: [{ ref: "root", componentRef: descriptor.id }] });
  return createComponentEditorState({ descriptor, variants: ["default", "compact"] }, graph, registry);
}

test("component editor specializes the shared composition state without application identity", () => {
  const state = fixture();
  assert.equal(state.definition.descriptor.id, "station.card");
  assert.deepEqual(state.definition.variants, ["default", "compact"]);
  assert.equal(state.composition.transaction.draft.rootRef, "root");
  assert.equal("appManifest" in state.definition, false);
});

test("component contract mutations remain constrained to presentation composition metadata", () => {
  const state = fixture();
  const result = mutateComponentEditorContract(state, { kind: "set-variants", variants: ["default", "dense"] });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.state.definition.variants, ["default", "dense"]);
  assert.strictEqual(result.state.composition, state.composition);
});

test("cumulative component contract editing preserves composition and discrete layout authority", () => {
  const state = fixture();
  const policy = mutateComponentEditorContract(state, { kind: "set-child-policy", childPolicy: "single" });
  assert.equal(policy.ok, true);
  if (!policy.ok) return;

  const slots = mutateComponentEditorContract(policy.state, {
    kind: "set-slots",
    slots: [{ id: "body", childPolicy: "single", acceptsFamilies: ["atomic"] }],
  });
  assert.equal(slots.ok, true);
  if (!slots.ok) return;

  const constraints = mutateComponentEditorContract(slots.state, {
    kind: "set-constraints",
    constraints: { minColumns: 2, maxColumns: 8, recommendedColumns: 6, minRows: 1, maxRows: 6, recommendedRows: 2 },
  });
  assert.equal(constraints.ok, true);
  if (!constraints.ok) return;

  assert.equal(constraints.state.definition.descriptor.childPolicy, "single");
  assert.deepEqual(constraints.state.definition.descriptor.slots.map((slot) => slot.id), ["body"]);
  assert.equal(constraints.state.definition.descriptor.constraints.recommendedColumns, 6);
  assert.strictEqual(constraints.state.composition, state.composition);
  assert.equal("appManifest" in constraints.state.definition, false);
  assert.equal("windowGeometry" in constraints.state.definition, false);
});

test("invalid specialization input fails deterministically without corrupting editor state", () => {
  const state = fixture();
  const first = mutateComponentEditorContract(state, { kind: "set-variants", variants: ["default", "default"] });
  const second = mutateComponentEditorContract(state, { kind: "set-variants", variants: ["default", "default"] });
  assert.equal(first.ok, false);
  assert.equal(second.ok, false);
  if (first.ok || second.ok) return;
  assert.strictEqual(first.state, state);
  assert.strictEqual(second.state, state);
  assert.equal(first.error, second.error);
  assert.deepEqual(state.definition.variants, ["default", "compact"]);
});

test("invalid named-slot edits are rejected without changing contract or composition draft", () => {
  const state = fixture();
  const result = mutateComponentEditorContract(state, {
    kind: "set-slots",
    slots: [...state.definition.descriptor.slots, { id: "", childPolicy: "single", acceptsFamilies: ["atomic"] }],
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.strictEqual(result.state, state);
  assert.strictEqual(result.state.composition, state.composition);
  assert.deepEqual(result.state.definition.descriptor.slots, state.definition.descriptor.slots);
});
