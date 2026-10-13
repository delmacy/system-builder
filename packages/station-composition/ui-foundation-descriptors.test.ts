import assert from "node:assert/strict";
import test from "node:test";
import { ComponentRegistry } from "./registry.js";
import { UI_FOUNDATION_DESCRIPTORS } from "./ui-foundation-descriptors.js";
import { createComponentEditorState } from "./component-editor.js";
import { defineCompositionGraph } from "./graph.js";

test("Construction G admits unique foundation editor-fields to the canonical registry", () => {
  const registry = new ComponentRegistry(UI_FOUNDATION_DESCRIPTORS);
  assert.deepEqual(registry.list().map(item => item.id), [
    "ui:color-field", "ui:document-text-field", "ui:property-picker",
  ]);
  assert.throws(() => registry.register(UI_FOUNDATION_DESCRIPTORS[0]), /duplicate/);
  for (const descriptor of UI_FOUNDATION_DESCRIPTORS) {
    assert.equal(descriptor.childPolicy, "none");
    assert.equal(descriptor.family, "atomic");
    assert.deepEqual(descriptor.slots, []);
    const graph = defineCompositionGraph({ rootRef: "root", nodes: [{ ref: "root", componentRef: descriptor.id }] });
    const state = createComponentEditorState({ descriptor, variants: ["default"] }, graph, registry);
    assert.equal(state.composition.transaction.draft.nodes[0]?.componentRef, descriptor.id);
    assert.equal(state.composition.transaction.dirty, false);
  }
});
