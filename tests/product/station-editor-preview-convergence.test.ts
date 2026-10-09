import assert from "node:assert/strict";
import test from "node:test";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import {
  applyEditorStructuralEditIntent, createEditorSetPlacementIntent, createEditorSetSpanIntent,
  emptyLayersSelection, initializeEditorSession, projectEditorInspector, projectEditorLayers,
  projectEditorPreview, selectEditorLayer,
  type EditorSession, type LayersSelection,
} from "../../packages/station-editor/index.js";

const registry = new ComponentRegistry([
  { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple",
    constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 },
    slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] },
  { id: "component:button", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] },
]);
const root = { ref: "node:root", componentRef: "component:grid" };
const panel = { ref: "node:panel", componentRef: "component:grid",
  placement: { parentRef: "node:root", slotRef: "content", columnSpan: 4, rowSpan: 3 } };
const inner = { ref: "node:inner", componentRef: "component:grid",
  placement: { parentRef: "node:panel", slotRef: "content", columnSpan: 2, rowSpan: 2 } };
const a = { ref: "node:a", componentRef: "component:button",
  placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } };
const b = { ref: "node:b", componentRef: "component:button",
  placement: { parentRef: "node:root", slotRef: "content", columnSpan: 1, rowSpan: 1 } };

function session(nodes = [root, panel, inner, a, b]): EditorSession {
  const result = initializeEditorSession({
    sessionRef: "session:preview",
    base: { applicationRef: "app:demo", compositionRef: "composition:demo", revision: 7, currentness: "current" },
    composition: defineCompositionGraph({ rootRef: root.ref, nodes }),
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
function accepted(editor: EditorSession, selected?: LayersSelection) {
  const result = projectEditorPreview(editor, registry, selected);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("preview rejected fixture");
  return result.snapshot;
}
function forged(editor: EditorSession, nodes: unknown[]): EditorSession {
  return { ...editor, transaction: { ...editor.transaction,
    draft: { ...editor.transaction.draft, nodes } } } as EditorSession;
}

test("TASK-640 deterministic root-first Preview matches Layers across graph array order", () => {
  const first = session();
  const reordered = session([b, inner, root, a, panel]);
  const left = accepted(first);
  const right = accepted(reordered);
  assert.deepEqual(left, right);
  assert.deepEqual(left.nodes.map((node) => node.nodeRef),
    ["node:root", "node:a", "node:b", "node:panel", "node:inner"]);
  assert.equal(left.draftRevision, 7);
  assert.equal(left.baseRevision, 7);
  assert.equal(left.nodes[0]?.kind, "root");
  assert.equal(left.nodes[0]?.columnSpan, null);
  assert.equal(left.selectedRef, null);
  assert.equal(left.nodes.every((node) => !node.selected), true);
  assert.equal(Object.isFrozen(left), true);
  assert.equal(Object.isFrozen(left.nodes), true);
  assert.equal(left.nodes.every(Object.isFrozen), true);
});

test("TASK-640 accepted WP1-D span edit converges Preview, Layers and Inspector without mutating input", () => {
  const original = session();
  const selected = selection(original, "node:a");
  const before = accepted(original, selected);
  const proposal = createEditorSetSpanIntent(original, selected, 7, { columnSpan: 3, rowSpan: 2 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) return;
  const result = applyEditorStructuralEditIntent(original, selected, proposal.intent, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) return;
  assert.equal(result.changed, true);
  const after = accepted(result.session, selected);
  const node = after.nodes.find((item) => item.nodeRef === "node:a");
  assert.equal(node?.columnSpan, 3);
  assert.equal(node?.rowSpan, 2);
  assert.equal(node?.selected, true);
  assert.equal(after.draftRevision, 8);
  assert.equal(after.baseRevision, 7);
  assert.equal(after.sessionRef, original.sessionRef);
  assert.equal(after.compositionRef, original.base.compositionRef);
  assert.deepEqual(after.nodes.filter((item) => item.nodeRef !== "node:a"),
    before.nodes.filter((item) => item.nodeRef !== "node:a"));
  const inspector = projectEditorInspector(result.session, selected, 8);
  assert.equal(inspector.accepted, true);
  if (inspector.accepted && inspector.snapshot.kind === "node") {
    assert.equal(inspector.snapshot.nodeRef, node?.nodeRef);
    assert.equal(inspector.snapshot.placement?.columnSpan, node?.columnSpan);
    assert.equal(inspector.snapshot.placement?.rowSpan, node?.rowSpan);
  }
  assert.equal(projectEditorLayers(result.session).accepted, true);
  assert.deepEqual(accepted(original, selected), before);
  assert.strictEqual(selected.selectedRef, "node:a");
  assert.equal("focusedRef" in selected, false);
  assert.equal("activeRef" in selected, false);
  assert.equal("expandedRefs" in selected, false);
});

test("TASK-640 accepted placement edit preserves identities and converges structural ancestry", () => {
  const editor = session();
  const selected = selection(editor, "node:a");
  const proposal = createEditorSetPlacementIntent(editor, selected, 7,
    { parentRef: "node:panel", slotRef: "content", columnSpan: 1, rowSpan: 1 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) return;
  const result = applyEditorStructuralEditIntent(editor, selected, proposal.intent, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) return;
  const preview = accepted(result.session, selected);
  const moved = preview.nodes.find((node) => node.nodeRef === "node:a");
  assert.equal(moved?.componentRef, "component:button");
  assert.equal(moved?.parentRef, "node:panel");
  assert.equal(moved?.slotRef, "content");
  assert.equal(moved?.columnSpan, 1);
  assert.equal(moved?.selected, true);
  assert.deepEqual(preview.nodes.map((node) => node.nodeRef),
    ["node:root", "node:b", "node:panel", "node:a", "node:inner"]);
  assert.equal(projectEditorLayers(result.session).accepted, true);
});

test("TASK-640 explicit empty selection, unknown and forged selections fail closed", () => {
  const editor = session();
  const none = accepted(editor, emptyLayersSelection());
  assert.equal(none.selectedRef, null);
  assert.equal(none.nodes.some((node) => node.selected), false);
  const rootSelection = accepted(editor, selection(editor, "node:root"));
  assert.equal(rootSelection.nodes[0]?.selected, true);
  for (const selected of [{ selectedRef: "node:missing" }, { selectedRef: "" },
    { selectedRef: 3 }, { selectedRef: "node:a", focusedRef: "node:b" }, null]) {
    const result = projectEditorPreview(editor, registry, selected as LayersSelection);
    assert.equal(result.accepted, false);
    if (!result.accepted) assert.equal(result.reason, "invalid-selection");
  }
  assert.deepEqual(accepted(editor, emptyLayersSelection()), none);
});

test("TASK-640 stale, malformed, unknown registry and adversarial graph reject without exception", () => {
  const editor = session();
  const before = structuredClone(editor.transaction.draft);
  const badSessions = [
    { ...editor, base: { ...editor.base, currentness: "stale" } },
    { ...editor, draftCurrentness: "unknown" },
    { ...editor, draftRevision: Number.NaN },
    { ...editor, draftRevision: 6 },
    { ...editor, base: { ...editor.base, compositionRef: editor.sessionRef } },
    { ...editor, transaction: { ...editor.transaction, findings: [{}] } },
  ];
  for (const broken of badSessions) {
    const result = projectEditorPreview(broken as EditorSession, registry);
    assert.equal(result.accepted, false);
  }
  const incompatible = projectEditorPreview(editor, new ComponentRegistry());
  assert.equal(incompatible.accepted, false);
  const graphCases: unknown[][] = [
    [...editor.transaction.draft.nodes, a],
    editor.transaction.draft.nodes.map((node) => node.ref === "node:a"
      ? { ...node, componentRef: "component:missing" } : node),
    editor.transaction.draft.nodes.map((node) => node.ref === "node:panel"
      ? { ...node, placement: { ...node.placement!, parentRef: "node:inner" } } : node),
    editor.transaction.draft.nodes.map((node) => node.ref === "node:a"
      ? { ...node, placement: { ...node.placement!, columnSpan: Number.NaN } } : node),
    editor.transaction.draft.nodes.map((node) => node.ref === "node:a"
      ? { ...node, placement: { ...node.placement!, columnSpan: 1.5 } } : node),
    editor.transaction.draft.nodes.map((node) => node.ref === "node:a"
      ? { ...node, placement: { ...node.placement!, parentRef: "node:missing" } } : node),
    editor.transaction.draft.nodes.map((node) => node.ref === "node:a"
      ? { ...node, injected: "forged" } : node),
    [null, ...editor.transaction.draft.nodes],
  ];
  for (const nodes of graphCases) {
    assert.doesNotThrow(() => projectEditorPreview(forged(editor, nodes), registry));
    assert.equal(projectEditorPreview(forged(editor, nodes), registry).accepted, false);
  }
  assert.deepEqual(editor.transaction.draft, before);
  assert.equal(accepted(editor).nodes.length, 5);
});

test("TASK-640 rejected edit recovery, stale replay and accepted no-op remain deterministic", () => {
  const editor = session();
  const selected = selection(editor, "node:a");
  const before = accepted(editor, selected);
  const intent = createEditorSetSpanIntent(editor, selected, 7, { columnSpan: 3, rowSpan: 2 });
  assert.equal(intent.accepted, true);
  if (!intent.accepted) return;
  const invalid = applyEditorStructuralEditIntent(editor, selected,
    { ...intent.intent, columnSpan: 0 }, registry);
  assert.equal(invalid.accepted, false);
  assert.deepEqual(accepted(editor, selected), before);
  const valid = applyEditorStructuralEditIntent(editor, selected, intent.intent, registry);
  assert.equal(valid.accepted, true);
  if (!valid.accepted) return;
  const after = accepted(valid.session, selected);
  const replay = applyEditorStructuralEditIntent(valid.session, selected, intent.intent, registry);
  assert.equal(replay.accepted, false);
  assert.deepEqual(accepted(valid.session, selected), after);
  const same = createEditorSetSpanIntent(valid.session, selected, 8, { columnSpan: 3, rowSpan: 2 });
  assert.equal(same.accepted, true);
  if (!same.accepted) return;
  const noop = applyEditorStructuralEditIntent(valid.session, selected, same.intent, registry);
  assert.equal(noop.accepted, true);
  if (noop.accepted) {
    assert.equal(noop.changed, false);
    assert.strictEqual(noop.session, valid.session);
    assert.deepEqual(accepted(noop.session, selected), after);
  }
});
