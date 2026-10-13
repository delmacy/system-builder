import assert from "node:assert/strict";
import test from "node:test";
import { BUTTON_GROUP_DESCRIPTOR } from "./button-group.js";
import { ComponentRegistry } from "./registry.js";
import { UI_FOUNDATION_DESCRIPTORS } from "./ui-foundation-descriptors.js";
import { createCompositionEditorState } from "./editor-engine.js";
import { insertEditorComponent } from "./editor-insertion.js";
import { defineCompositionGraph } from "./graph.js";

function fixture() {
  const registry = new ComponentRegistry([BUTTON_GROUP_DESCRIPTOR, ...UI_FOUNDATION_DESCRIPTORS]);
  const state = createCompositionEditorState(defineCompositionGraph({
    rootRef: "root", nodes: [{ ref: "root", componentRef: BUTTON_GROUP_DESCRIPTOR.id }],
  }), registry);
  return { registry, state };
}

test("G-B inserts a real foundation component through the Editor draft, without mutating base", () => {
  const { registry, state } = fixture();
  const first = insertEditorComponent(state, registry, { ref: "field-1", componentRef: "ui:color-field", parentRef: "root", slotRef: "button-1", columnSpan: 2, rowSpan: 1 });
  assert.equal(first.ok, true);
  if (!first.ok) return;
  assert.equal(first.state.transaction.draft.nodes[1]?.componentRef, "ui:color-field");
  assert.equal(first.state.transaction.base.nodes.length, 1);
  assert.equal(first.state.transaction.dirty, true);
  const duplicate = insertEditorComponent(first.state, registry, { ref: "field-2", componentRef: "ui:property-picker", parentRef: "root", slotRef: "button-1", columnSpan: 2, rowSpan: 1 });
  assert.equal(duplicate.ok, false);
  if (!duplicate.ok) assert.match(duplicate.reason, /occupied/);
  assert.strictEqual(duplicate.state, first.state);
  const second = insertEditorComponent(first.state, registry, { ref: "field-2", componentRef: "ui:property-picker", parentRef: "root", slotRef: "button-2", columnSpan: 2, rowSpan: 1 });
  assert.equal(second.ok, true);
});

test("G-B rejects unknown, duplicate and invalid placements without draft side effects", () => {
  const { registry, state } = fixture();
  for (const input of [
    { ref: "missing", componentRef: "ui:unknown", parentRef: "root", slotRef: "button-1", columnSpan: 2, rowSpan: 1 },
    { ref: "root", componentRef: "ui:color-field", parentRef: "root", slotRef: "button-1", columnSpan: 2, rowSpan: 1 },
    { ref: "wrong", componentRef: "ui:color-field", parentRef: "root", slotRef: "wrong", columnSpan: 2, rowSpan: 1 },
    { ref: "huge", componentRef: "ui:color-field", parentRef: "root", slotRef: "button-1", columnSpan: 12, rowSpan: 1 },
  ]) {
    const result = insertEditorComponent(state, registry, input);
    assert.equal(result.ok, false);
    assert.strictEqual(result.state, state);
  }
});
