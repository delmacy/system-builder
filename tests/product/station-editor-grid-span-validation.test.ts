import assert from "node:assert/strict";
import test from "node:test";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import {
  applyEditorStructuralEditIntent, createEditorSetPlacementIntent, createEditorSetSpanIntent,
  emptyLayersSelection, initializeEditorSession, projectEditorInspector, projectEditorLayers, selectEditorLayer,
  type EditorSession, type EditorStructuralEditIntent, type LayersSelection,
} from "../../packages/station-editor/index.js";

const registry = new ComponentRegistry([
  { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple",
    constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 },
    slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] },
  { id: "component:button", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] },
]);
const root = { ref: "node:root", componentRef: "component:grid" };
const panel = { ref: "node:panel", componentRef: "component:grid", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 4, rowSpan: 3 } };
const inner = { ref: "node:inner", componentRef: "component:grid", placement: { parentRef: "node:panel", slotRef: "content", columnSpan: 2, rowSpan: 2 } };
const a = { ref: "node:a", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } };
const b = { ref: "node:b", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 } };

function session(): EditorSession {
  const result = initializeEditorSession({
    sessionRef: "session:edit",
    base: { applicationRef: "app:demo", compositionRef: "composition:demo", revision: 7, currentness: "current" },
    composition: defineCompositionGraph({ rootRef: root.ref, nodes: [root, panel, inner, a, b] }),
  }, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("invalid fixture");
  return result.session;
}
function selection(editor: EditorSession, ref: string | null): LayersSelection {
  const result = selectEditorLayer(projectEditorLayers(editor), emptyLayersSelection(), ref);
  assert.equal(result.accepted, true);
  return result.selection;
}
function span(editor: EditorSession, selected: LayersSelection, columns: number, rows: number): EditorStructuralEditIntent {
  const proposal = createEditorSetSpanIntent(editor, selected, editor.draftRevision, { columnSpan: columns, rowSpan: rows });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) throw Error("invalid proposal");
  return proposal.intent;
}
function placement(editor: EditorSession, selected: LayersSelection, parentRef: string, slotRef = "content"): EditorStructuralEditIntent {
  const proposal = createEditorSetPlacementIntent(editor, selected, editor.draftRevision, {
    parentRef, slotRef, columnSpan: 1, rowSpan: 1,
  });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) throw Error("invalid proposal");
  return proposal.intent;
}
function rejected(editor: EditorSession, selected: LayersSelection, intent: unknown): void {
  const before = structuredClone(editor.transaction.draft);
  const result = applyEditorStructuralEditIntent(editor, selected, intent as EditorStructuralEditIntent, registry);
  assert.equal(result.accepted, false);
  assert.strictEqual(result.session, editor);
  assert.deepEqual(editor.transaction.draft, before);
}

test("TASK-639 valid span edit changes one node and converges Inspector/Layers on the same draft", () => {
  const original = session();
  const selected = selection(original, "node:a");
  const proposal = span(original, selected, 3, 2);
  const result = applyEditorStructuralEditIntent(original, selected, proposal, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) return;
  assert.equal(result.changed, true);
  assert.equal(result.session.draftRevision, 8);
  assert.equal(result.session.base.revision, 7);
  assert.equal(result.session.transaction.dirty, true);
  assert.strictEqual(original.transaction.draft.nodes.find((node) => node.ref === "node:a")?.placement?.columnSpan, 2);
  assert.deepEqual(result.session.transaction.draft.nodes.filter((node) => node.ref !== "node:a"),
    original.transaction.draft.nodes.filter((node) => node.ref !== "node:a"));
  const inspector = projectEditorInspector(result.session, selected, 8);
  assert.equal(inspector.accepted, true);
  if (inspector.accepted && inspector.snapshot.kind === "node") {
    assert.equal(inspector.snapshot.placement?.columnSpan, 3);
    assert.equal(inspector.snapshot.placement?.rowSpan, 2);
  }
  assert.equal(projectEditorLayers(result.session).accepted, true);
  assert.strictEqual(selected.selectedRef, "node:a");
  assert.equal("focusedRef" in selected, false);
  assert.equal("activeRef" in selected, false);
  assert.equal("expandedRefs" in selected, false);
});

test("TASK-639 valid placement preserves identity, component and other nodes", () => {
  const original = session();
  const selected = selection(original, "node:a");
  const result = applyEditorStructuralEditIntent(original, selected, placement(original, selected, "node:panel"), registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) return;
  assert.equal(result.changed, true);
  const moved = result.session.transaction.draft.nodes.find((node) => node.ref === "node:a");
  assert.equal(moved?.ref, "node:a");
  assert.equal(moved?.componentRef, "component:button");
  assert.equal(moved?.placement?.parentRef, "node:panel");
  assert.equal(moved?.placement?.slotRef, "content");
  assert.equal(projectEditorLayers(result.session).accepted, true);
  assert.deepEqual(result.session.transaction.draft.nodes.filter((node) => node.ref !== "node:a"),
    original.transaction.draft.nodes.filter((node) => node.ref !== "node:a"));
});

test("TASK-639 stale, wrong identity, root, unknown selection and invalid spans reject unchanged", () => {
  const editor = session();
  const selected = selection(editor, "node:a");
  const intent = span(editor, selected, 3, 1);
  rejected(editor, selected, { ...intent, expectedDraftRevision: 6 });
  rejected(editor, selected, { ...intent, sessionRef: "session:other" });
  rejected(editor, selected, { ...intent, compositionRef: "composition:other" });
  rejected(editor, selected, { ...intent, nodeRef: "node:b" });
  rejected(editor, emptyLayersSelection(), intent);
  rejected(editor, { selectedRef: "node:missing" }, { ...intent, nodeRef: "node:missing" });
  rejected(editor, selection(editor, "node:root"), { ...intent, nodeRef: "node:root" });
  for (const value of [0, -1, 1.5, Number.NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, "2"]) {
    rejected(editor, selected, { ...intent, columnSpan: value });
    rejected(editor, selected, { ...intent, rowSpan: value });
  }
});

test("TASK-639 forged, incompatible, unknown and cyclic placement rejects fail-closed", () => {
  const editor = session();
  const selected = selection(editor, "node:a");
  const intent = span(editor, selected, 3, 1);
  rejected(editor, selected, { ...intent, type: "unknown" });
  rejected(editor, selected, { ...intent, extra: "forged" });
  rejected(editor, selected, null);
  rejected(editor, selected, { ...intent, expectedDraftRevision: Number.NaN });
  rejected(editor, selected, { ...intent, columnSpan: 5 });
  const move = placement(editor, selected, "node:panel");
  rejected(editor, selected, { ...move, parentRef: "node:missing" });
  rejected(editor, selected, { ...move, parentRef: "node:a" });
  rejected(editor, selected, { ...move, parentRef: "node:b" });
  rejected(editor, selected, { ...move, slotRef: "unknown" });
  const panelSelection = selection(editor, "node:panel");
  const panelMove = placement(editor, panelSelection, "node:root");
  rejected(editor, panelSelection, { ...panelMove, parentRef: "node:inner" });
  const broken = { ...editor, transaction: { ...editor.transaction,
    draft: { ...editor.transaction.draft, nodes: editor.transaction.draft.nodes.map((node) =>
      node.ref === "node:a" ? { ...node, componentRef: "component:missing" } : node) } } } as EditorSession;
  rejected(broken, selected, intent);
  const disconnected = { ...editor, transaction: { ...editor.transaction,
    draft: { ...editor.transaction.draft, nodes: editor.transaction.draft.nodes.map((node) =>
      node.ref === "node:panel" ? { ...node, placement: { ...node.placement!, parentRef: "node:inner" } } : node) } } } as EditorSession;
  rejected(disconnected, selected, intent);
});

test("TASK-639 rejection recovery, replay stale and deterministic no-op", () => {
  const editor = session();
  const selected = selection(editor, "node:a");
  const intent = span(editor, selected, 3, 2);
  rejected(editor, selected, { ...intent, columnSpan: 0 });
  const accepted = applyEditorStructuralEditIntent(editor, selected, intent, registry);
  assert.equal(accepted.accepted, true);
  if (!accepted.accepted) return;
  assert.equal(accepted.changed, true);
  rejected(accepted.session, selected, intent);
  const same = span(accepted.session, selected, 3, 2);
  const noop = applyEditorStructuralEditIntent(accepted.session, selected, same, registry);
  assert.equal(noop.accepted, true);
  if (!noop.accepted) return;
  assert.equal(noop.changed, false);
  assert.strictEqual(noop.session, accepted.session);
  assert.equal(noop.session.draftRevision, 8);
});

test("TASK-639 revision ceiling rejects changed edit without unsafe increment and preserves no-op", () => {
  const original = session();
  const high = { ...original, draftRevision: Number.MAX_SAFE_INTEGER } as EditorSession;
  const selected = selection(high, "node:a");
  const proposal = { ...span(original, selected, 3, 2), expectedDraftRevision: Number.MAX_SAFE_INTEGER };
  const before = structuredClone(high.transaction.draft);
  const rejectedEdit = applyEditorStructuralEditIntent(high, selected, proposal, registry);
  assert.equal(rejectedEdit.accepted, false);
  if (!rejectedEdit.accepted) assert.equal(rejectedEdit.reason, "invalid-session");
  assert.strictEqual(rejectedEdit.session, high);
  assert.deepEqual(high.transaction.draft, before);
  assert.equal(high.draftRevision, Number.MAX_SAFE_INTEGER);

  const unchanged = { ...proposal, columnSpan: 2, rowSpan: 1 };
  const noop = applyEditorStructuralEditIntent(high, selected, unchanged, registry);
  assert.equal(noop.accepted, true);
  if (noop.accepted) {
    assert.equal(noop.changed, false);
    assert.strictEqual(noop.session, high);
    assert.equal(noop.session.draftRevision, Number.MAX_SAFE_INTEGER);
  }

  const recovery = applyEditorStructuralEditIntent(original, selected, span(original, selected, 3, 2), registry);
  assert.equal(recovery.accepted, true);
  if (recovery.accepted) assert.equal(recovery.session.draftRevision, 8);
});
