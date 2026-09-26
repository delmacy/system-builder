import assert from "node:assert/strict";
import test from "node:test";

import {
  ComponentRegistry,
  createCompositionEditorState,
  mutateCompositionEditor,
  projectCompositionEditorPreview,
  selectCompositionEditorNode,
  validateCompositionGraph,
} from "../../packages/station-composition/index.js";

const atomic = { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] } as const;
const layout = { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: ["atomic", "collection", "semantic-composite", "layout-container"] }] } as const;
const registry = new ComponentRegistry([layout, atomic]);
const base = { rootRef: "node:root", nodes: [{ ref: "node:root", componentRef: "component:grid" }, { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } }] } as const;

test("unknown selection fails closed without inventing semantic identity", () => {
  const state = createCompositionEditorState(base, registry);
  const selected = selectCompositionEditorNode(state, "node:missing");
  assert.equal(selected.selectedNodeRef, undefined);
  assert.equal(selected.transaction, state.transaction);
});

test("invalid target rejection preserves editor state and preview across repeated attempts", () => {
  const selected = selectCompositionEditorNode(createCompositionEditorState(base, registry), "node:button");
  const previewBefore = projectCompositionEditorPreview(selected);
  const first = mutateCompositionEditor(selected, { type: "remove-node", nodeRef: "node:root" }, registry);
  assert.equal(first.ok, false);
  if (first.ok) return;
  assert.equal(first.state, selected);
  assert.deepEqual(projectCompositionEditorPreview(first.state), previewBefore);
  const second = mutateCompositionEditor(first.state, { type: "remove-node", nodeRef: "node:root" }, registry);
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.state, selected);
  assert.deepEqual(projectCompositionEditorPreview(second.state), previewBefore);
});

test("incompatible slot/span mutation is rejected without corrupting selection or draft", () => {
  const selected = selectCompositionEditorNode(createCompositionEditorState(base, registry), "node:button");
  const result = mutateCompositionEditor(selected, { type: "replace-node", node: { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "missing", columnSpan: 99, rowSpan: 1 } } }, registry);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.state, selected);
  assert.equal(result.state.selectedNodeRef, "node:button");
  assert.equal(result.state.transaction.dirty, false);
  assert.ok(result.findings.length > 0);
});

test("duplicate and dangling graph references fail safely and deterministically", () => {
  const malformed = {
    rootRef: "node:root",
    nodes: [
      { ref: "node:root", componentRef: "component:grid" },
      { ref: "node:duplicate", componentRef: "component:button", placement: { parentRef: "node:missing", slotRef: "content", columnSpan: 1, rowSpan: 1 } },
      { ref: "node:duplicate", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 } },
    ],
  } as const;
  const first = validateCompositionGraph(malformed, registry);
  const second = validateCompositionGraph(malformed, registry);
  assert.deepEqual(first, second);
  assert.ok(first.some((finding) => finding.code === "duplicate-node-ref" && finding.nodeRef === "node:duplicate"));
  assert.ok(first.some((finding) => finding.code === "dangling-parent-ref" && finding.nodeRef === "node:duplicate"));
});
