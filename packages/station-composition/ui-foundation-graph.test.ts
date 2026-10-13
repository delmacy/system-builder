import assert from "node:assert/strict";
import test from "node:test";
import { ComponentRegistry } from "./registry.js";
import { normalizeComponentDescriptor } from "./validation.js";
import { UI_FOUNDATION_DESCRIPTORS } from "./ui-foundation-descriptors.js";
import { validateCompositionGraph } from "./graph-validation.js";
import { defineCompositionGraph } from "./graph.js";

const root = normalizeComponentDescriptor({
  id: "test:foundation-grid", family: "layout-container", layout: "grid",
  layoutOwnership: "self", childPolicy: "multiple",
  constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12,
    minRows: 1, maxRows: 12, recommendedRows: 4 },
  slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: ["atomic"] }],
});
const registry = new ComponentRegistry([root, ...UI_FOUNDATION_DESCRIPTORS]);
const cases = [
  { id: "ui:color-field", properties: { label: "Accent", value: "#ABCDEF", disabled: false } },
  { id: "ui:property-picker", properties: { label: "Theme", value: "light", disabled: false,
    choices: [{ id: "light", label: "Light", disabled: false }] } },
  { id: "ui:document-text-field", properties: { label: "Notes", value: "Hello", rows: 4,
    maxLength: 200, disabled: false, readOnly: false } },
] as const;
function graph(id: string, properties: unknown) {
  return defineCompositionGraph({ rootRef: "root", nodes: [
    { ref: "root", componentRef: root.id },
    { ref: "field", componentRef: id, placement: { parentRef: "root", slotRef: "content", columnSpan: 2, rowSpan: 2 }, properties },
  ] });
}
test("Construction G canonical graph admits typed fields and rejects malformed overrides", () => {
  for (const item of cases) {
    assert.deepEqual(validateCompositionGraph(graph(item.id, item.properties), registry), []);
    const invalid = { ...item.properties, unknown: "not supported" };
    assert.ok(validateCompositionGraph(graph(item.id, invalid), registry).some(f => f.code === "invalid-button-properties"));
  }
  assert.ok(validateCompositionGraph(graph("ui:color-field", cases[1].properties), registry).some(f => f.code === "invalid-button-properties"));
});
