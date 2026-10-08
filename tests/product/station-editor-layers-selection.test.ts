import assert from "node:assert/strict";
import test from "node:test";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import { emptyLayersSelection, initializeEditorSession, projectEditorLayers, selectEditorLayer } from "../../packages/station-editor/index.js";

const registry = new ComponentRegistry([
  { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] },
  { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] },
]);
const root = { ref: "node:root", componentRef: "component:grid" };
const a = { ref: "node:a", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 } };
const b = { ref: "node:b", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } };
function session(nodes = [root, a, b]) {
  const result = initializeEditorSession({ sessionRef: "session:1", base: { applicationRef: "app:1", compositionRef: "composition:1", revision: 1, currentness: "current" }, composition: defineCompositionGraph({ rootRef: root.ref, nodes }) }, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("invalid fixture");
  return result.session;
}
test("TASK-637 deterministic Layers hierarchy independent of node array order", () => {
  const first = projectEditorLayers(session());
  const reordered = projectEditorLayers(session([b, root, a]));
  assert.deepEqual(first, reordered);
  assert.equal(first.accepted, true);
  if (!first.accepted) return;
  assert.deepEqual(first.root.children.map(child => child.nodeRef), ["node:a", "node:b"]);
  assert.equal(first.root.children[0]?.parentRef, root.ref);
});
test("TASK-637 empty, select, clear, unknown and idempotent selection preserve editor draft", () => {
  const editor = session();
  const before = structuredClone(editor.transaction.draft);
  const projection = projectEditorLayers(editor);
  const empty = emptyLayersSelection();
  const selected = selectEditorLayer(projection, empty, "node:a");
  assert.equal(selected.accepted, true);
  if (!selected.accepted) return;
  assert.equal(selected.selection.selectedRef, "node:a");
  assert.strictEqual(selectEditorLayer(projection, selected.selection, "node:a").selection, selected.selection);
  const rejected = selectEditorLayer(projection, selected.selection, "node:missing");
  assert.equal(rejected.accepted, false);
  assert.strictEqual(rejected.selection, selected.selection);
  const cleared = selectEditorLayer(projection, selected.selection, null);
  assert.equal(cleared.accepted, true);
  assert.equal(cleared.selection.selectedRef, null);
  assert.deepEqual(editor.transaction.draft, before);
  assert.equal("focusedRef" in selected.selection, false);
  assert.equal("activeRef" in selected.selection, false);
  assert.equal("expandedRefs" in selected.selection, false);
});
test("TASK-637 fail-closed malformed graph cannot fabricate hierarchy or selection", () => {
  const editor = session();
  const malformed = { ...editor, transaction: { ...editor.transaction, draft: { rootRef: "node:root", nodes: [root, { ...a, placement: { ...a.placement, parentRef: "node:missing" } }] } } };
  const result = projectEditorLayers(malformed);
  assert.deepEqual(result, { accepted: false, reason: "invalid-hierarchy" });
  const empty = emptyLayersSelection();
  assert.deepEqual(selectEditorLayer(result, empty, "node:a"), { accepted: false, reason: "unknown-node", selection: empty });
});
