import assert from "node:assert/strict";
import test from "node:test";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import {
  createEditorSetPlacementIntent,
  createEditorSetSpanIntent,
  emptyLayersSelection,
  initializeEditorSession,
  projectEditorInspector,
  projectEditorLayers,
  selectEditorLayer,
} from "../../packages/station-editor/index.js";

const registry = new ComponentRegistry([
  { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] },
  { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] },
]);
const root = { ref: "node:root", componentRef: "component:grid" };
const a = { ref: "node:a", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } };
const b = { ref: "node:b", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 } };
function session(nodes = [root, a, b]) {
  const result = initializeEditorSession({
    sessionRef: "session:inspector", base: { applicationRef: "app:demo", compositionRef: "composition:demo", revision: 7, currentness: "current" },
    composition: defineCompositionGraph({ rootRef: root.ref, nodes }),
  }, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("invalid fixture");
  return result.session;
}
function selected(editor: ReturnType<typeof session>, ref: string | null) {
  const result = selectEditorLayer(projectEditorLayers(editor), emptyLayersSelection(), ref);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("invalid selection");
  return result.selection;
}

test("TASK-638 Inspector is deterministic across graph order and returns immutable selected-node properties", () => {
  const first = session();
  const reordered = session([b, root, a]);
  const snapshot = projectEditorInspector(first, selected(first, "node:a"), 7);
  assert.deepEqual(snapshot, projectEditorInspector(reordered, selected(reordered, "node:a"), 7));
  assert.equal(snapshot.accepted, true);
  if (!snapshot.accepted || snapshot.snapshot.kind !== "node") return;
  assert.equal(snapshot.snapshot.nodeRef, "node:a");
  assert.equal(snapshot.snapshot.componentRef, "component:button");
  assert.equal(snapshot.snapshot.placement?.columnSpan, 2);
  assert.equal(snapshot.snapshot.editable, true);
  assert.equal(Object.isFrozen(snapshot.snapshot), true);
  assert.equal(Object.isFrozen(snapshot.snapshot.placement), true);
});

test("TASK-638 empty selection is explicit; root inspection is read-only and never an implicit selection", () => {
  const editor = session();
  assert.deepEqual(projectEditorInspector(editor, emptyLayersSelection(), 7), {
    accepted: true, snapshot: { kind: "empty", draftRevision: 7 },
  });
  const rootResult = projectEditorInspector(editor, selected(editor, "node:root"), 7);
  assert.equal(rootResult.accepted, true);
  if (rootResult.accepted && rootResult.snapshot.kind === "node") {
    assert.equal(rootResult.snapshot.editable, false);
    assert.equal(rootResult.snapshot.placement, null);
  }
  assert.deepEqual(createEditorSetSpanIntent(editor, emptyLayersSelection(), 7, { columnSpan: 2, rowSpan: 1 }), { accepted: false, reason: "no-selection" });
  assert.deepEqual(createEditorSetSpanIntent(editor, selected(editor, "node:root"), 7, { columnSpan: 2, rowSpan: 1 }), { accepted: false, reason: "root-not-editable" });
});

test("TASK-638 typed span and placement intents bind session, composition, selected node and exact draft revision without mutation", () => {
  const editor = session();
  const selection = selected(editor, "node:a");
  const before = structuredClone(editor.transaction.draft);
  const span = createEditorSetSpanIntent(editor, selection, 7, { columnSpan: 3, rowSpan: 2 });
  assert.deepEqual(span, { accepted: true, intent: { type: "set-span", sessionRef: "session:inspector", compositionRef: "composition:demo", nodeRef: "node:a", expectedDraftRevision: 7, columnSpan: 3, rowSpan: 2 } });
  const placement = { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 };
  const move = createEditorSetPlacementIntent(editor, selection, 7, placement);
  assert.deepEqual(move, { accepted: true, intent: { type: "set-placement", sessionRef: "session:inspector", compositionRef: "composition:demo", nodeRef: "node:a", expectedDraftRevision: 7, ...placement } });
  assert.deepEqual(editor.transaction.draft, before);
  assert.deepEqual(placement, { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 });
  assert.equal(editor.transaction.dirty, false);
  assert.equal("focusedRef" in selection, false);
  assert.equal("activeRef" in selection, false);
  assert.equal("expandedRefs" in selection, false);
  if (span.accepted) assert.equal("apply" in span.intent, false);
});

test("TASK-638 stale, invalid and unknown refs fail closed without changing selection or draft", () => {
  const editor = session();
  const selection = selected(editor, "node:a");
  const before = structuredClone(editor.transaction.draft);
  assert.deepEqual(projectEditorInspector(editor, selection, 6), { accepted: false, reason: "stale-draft-revision" });
  assert.deepEqual(createEditorSetSpanIntent(editor, selection, 6, { columnSpan: 1, rowSpan: 1 }), { accepted: false, reason: "stale-draft-revision" });
  assert.deepEqual(projectEditorInspector(editor, selection, Number.NaN), { accepted: false, reason: "invalid-revision" });
  assert.deepEqual(projectEditorInspector(editor, { selectedRef: "node:unknown" }, 7), { accepted: false, reason: "unknown-node" });
  assert.deepEqual(createEditorSetSpanIntent(editor, { selectedRef: "node:unknown" }, 7, { columnSpan: 1, rowSpan: 1 }), { accepted: false, reason: "unknown-node" });
  assert.deepEqual(editor.transaction.draft, before);
  assert.equal(selection.selectedRef, "node:a");
});

test("TASK-638 rejects fractional, zero, unsafe and non-finite spans, unknown parents and cycles", () => {
  const editor = session();
  const selection = selected(editor, "node:a");
  for (const value of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
    assert.deepEqual(createEditorSetSpanIntent(editor, selection, 7, { columnSpan: value, rowSpan: 1 }), { accepted: false, reason: "invalid-span" });
    assert.deepEqual(createEditorSetPlacementIntent(editor, selection, 7, { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: value }), { accepted: false, reason: "invalid-span" });
  }
  assert.deepEqual(createEditorSetPlacementIntent(editor, selection, 7, { parentRef: "node:missing", slotRef: "content", columnSpan: 1, rowSpan: 1 }), { accepted: false, reason: "invalid-placement" });
  assert.deepEqual(createEditorSetPlacementIntent(editor, selection, 7, { parentRef: "node:a", slotRef: "content", columnSpan: 1, rowSpan: 1 }), { accepted: false, reason: "invalid-placement" });
  assert.deepEqual(createEditorSetPlacementIntent(editor, selection, 7, { parentRef: "node:root", slotRef: "", columnSpan: 1, rowSpan: 1 }), { accepted: false, reason: "invalid-placement" });
});

test("TASK-638 malformed draft or unknown currentness cannot project a false Inspector; valid recovery succeeds", () => {
  const editor = session();
  const selection = selected(editor, "node:a");
  const malformed = { ...editor, transaction: { ...editor.transaction, draft: { rootRef: "node:root", nodes: [root, { ...a, placement: { ...a.placement, parentRef: "node:missing" } }] } } };
  assert.deepEqual(projectEditorInspector(malformed, selection, 7), { accepted: false, reason: "invalid-hierarchy" });
  const brokenSpan = { ...editor, transaction: { ...editor.transaction, draft: { rootRef: "node:root", nodes: [root, { ...a, placement: { ...a.placement, columnSpan: 0 } }] } } };
  assert.deepEqual(projectEditorInspector(brokenSpan, selection, 7), { accepted: false, reason: "invalid-hierarchy" });
  const unknown = { ...editor, base: { ...editor.base, currentness: "unknown" as const } };
  assert.deepEqual(projectEditorInspector(unknown, selection, 7), { accepted: false, reason: "invalid-session" });
  const recovered = projectEditorInspector(editor, selection, 7);
  assert.equal(recovered.accepted, true);
  assert.equal(createEditorSetSpanIntent(editor, selection, 7, { columnSpan: 2, rowSpan: 1 }).accepted, true);
});
