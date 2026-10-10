import assert from "node:assert/strict";
import test from "node:test";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import {
  acceptEditorDraft, applyEditorStructuralEditIntent, createEditorSetSpanIntent,
  discardEditorDraft, emptyLayersSelection, initializeEditorSession,
  projectEditorInspector, projectEditorLayers, projectEditorPreview, selectEditorLayer,
  type EditorSession,
} from "../../packages/station-editor/index.js";

const registry = new ComponentRegistry([
  { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self",
    childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12,
      minRows: 1, maxRows: 12, recommendedRows: 4 },
    slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] },
  { id: "component:button", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2,
      minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] },
]);
const composition = defineCompositionGraph({ rootRef: "node:root", nodes: [
  { ref: "node:root", componentRef: "component:grid" },
  { ref: "node:button", componentRef: "component:button",
    placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
] });

function begin(): EditorSession {
  const result = initializeEditorSession({
    sessionRef: "session:journey", base: { applicationRef: "app:demo",
      compositionRef: "composition:demo", revision: 7, currentness: "current" },
    composition,
  }, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("fixture");
  return result.session;
}
function selected(session: EditorSession) {
  const result = selectEditorLayer(projectEditorLayers(session), emptyLayersSelection(), "node:button");
  assert.equal(result.accepted, true);
  return result.selection;
}
function setSpan(session: EditorSession, columns: number) {
  const selection = selected(session);
  const proposal = createEditorSetSpanIntent(session, selection, session.draftRevision,
    { columnSpan: columns, rowSpan: 1 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) throw Error("fixture intent");
  return applyEditorStructuralEditIntent(session, selection, proposal.intent, registry);
}
function proveProjection(session: EditorSession, columns: number): void {
  const selection = selected(session);
  const layers = projectEditorLayers(session);
  const inspector = projectEditorInspector(session, selection, session.draftRevision);
  const preview = projectEditorPreview(session, registry, selection);
  assert.equal(layers.accepted, true);
  if (layers.accepted) {
    assert.deepEqual(layers.nodeRefs, ["node:button", "node:root"]);
    assert.equal(layers.root.nodeRef, "node:root");
    assert.equal(layers.root.componentRef, "component:grid");
    assert.equal(layers.root.parentRef, null);
    assert.equal(layers.root.children.length, 1);
    assert.equal(layers.root.children[0]?.nodeRef, "node:button");
    assert.equal(layers.root.children[0]?.componentRef, "component:button");
    assert.equal(layers.root.children[0]?.parentRef, "node:root");
    assert.deepEqual(layers.root.children[0]?.children, []);
  }
  assert.equal(inspector.accepted, true);
  assert.equal(preview.accepted, true);
  if (inspector.accepted && inspector.snapshot.kind === "node") {
    assert.equal(inspector.snapshot.placement?.columnSpan, columns);
  } else assert.fail("Inspector projection missing selected node");
  if (preview.accepted) {
    assert.equal(preview.snapshot.nodes.find(node => node.nodeRef === "node:button")?.columnSpan, columns);
    assert.equal(preview.snapshot.draftRevision, session.draftRevision);
    assert.equal(preview.snapshot.baseRevision, 7);
  }
  assert.equal(session.base.revision, 7);
}

test("TASK-642 integrated positive journey: one draft converges through save, subsequent edit and discard", () => {
  const initial = begin();
  proveProjection(initial, 2);
  const firstEdit = setSpan(initial, 3);
  assert.equal(firstEdit.accepted, true);
  if (!firstEdit.accepted) return;
  assert.equal(firstEdit.session.draftRevision, initial.draftRevision + 1);
  proveProjection(firstEdit.session, 3);

  const saved = acceptEditorDraft(firstEdit.session, firstEdit.session.draftRevision, registry);
  assert.equal(saved.accepted, true);
  if (!saved.accepted) return;
  assert.equal(saved.changed, true);
  assert.equal(saved.session.transaction.dirty, false);
  assert.equal(saved.session.draftRevision, firstEdit.session.draftRevision + 1);
  assert.deepEqual(saved.acceptedComposition, firstEdit.session.transaction.draft);
  proveProjection(saved.session, 3);

  const secondEdit = setSpan(saved.session, 4);
  assert.equal(secondEdit.accepted, true);
  if (!secondEdit.accepted) return;
  proveProjection(secondEdit.session, 4);
  const discarded = discardEditorDraft(secondEdit.session, secondEdit.session.draftRevision, registry);
  assert.equal(discarded.accepted, true);
  if (!discarded.accepted) return;
  assert.equal(discarded.changed, true);
  assert.equal(discarded.session.transaction.dirty, false);
  assert.equal(discarded.session.draftRevision, secondEdit.session.draftRevision + 1);
  proveProjection(discarded.session, 3);
  assert.deepEqual(discarded.session.transaction.draft, saved.acceptedComposition);
  assert.equal(initial.transaction.draft.nodes[1]?.placement?.columnSpan, 2);
});

test("TASK-642 stale edit rejects without mutation; valid recovery converges", () => {
  const initial = begin();
  const selection = selected(initial);
  const proposal = createEditorSetSpanIntent(initial, selection, initial.draftRevision,
    { columnSpan: 4, rowSpan: 1 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) return;
  const changed = setSpan(initial, 3);
  assert.equal(changed.accepted, true);
  if (!changed.accepted) return;
  const before = structuredClone(changed.session);
  const rejected = applyEditorStructuralEditIntent(changed.session, selection, proposal.intent, registry);
  assert.equal(rejected.accepted, false);
  assert.strictEqual(rejected.session, changed.session);
  assert.deepEqual(changed.session, before);
  const recovered = setSpan(changed.session, 4);
  assert.equal(recovered.accepted, true);
  if (recovered.accepted) proveProjection(recovered.session, 4);
});

test("TASK-642 stale save rejects fail-closed; original session remains usable", () => {
  const initial = begin();
  const edited = setSpan(initial, 3);
  assert.equal(edited.accepted, true);
  if (!edited.accepted) return;
  const snapshot = structuredClone(edited.session);
  const rejected = acceptEditorDraft(edited.session, edited.session.draftRevision - 1, registry);
  assert.equal(rejected.accepted, false);
  assert.strictEqual(rejected.session, edited.session);
  assert.deepEqual(edited.session, snapshot);
  const accepted = acceptEditorDraft(edited.session, edited.session.draftRevision, registry);
  assert.equal(accepted.accepted, true);
  if (accepted.accepted) proveProjection(accepted.session, 3);
});

test("TASK-642 adversarial unknown selection, incompatible span and forged intent reject atomically", () => {
  const initial = begin();
  const selection = selected(initial);
  const proposed = createEditorSetSpanIntent(initial, selection, initial.draftRevision,
    { columnSpan: 3, rowSpan: 1 });
  assert.equal(proposed.accepted, true);
  if (!proposed.accepted) return;
  const before = structuredClone(initial);
  const rejected = [
    applyEditorStructuralEditIntent(initial, { selectedRef: "node:missing" },
      proposed.intent, registry),
    applyEditorStructuralEditIntent(initial, selection,
      { ...proposed.intent, type: "unknown" } as never, registry),
    applyEditorStructuralEditIntent(initial, selection,
      { ...proposed.intent, columnSpan: 999 } as never, registry),
  ];
  for (const result of rejected) {
    assert.equal(result.accepted, false);
    assert.strictEqual(result.session, initial);
  }
  assert.deepEqual(initial, before);
  const recovered = setSpan(initial, 3);
  assert.equal(recovered.accepted, true);
  if (recovered.accepted) proveProjection(recovered.session, 3);
});

test("TASK-642 orthogonal selection and idempotent clean save/discard do not manufacture UI state", () => {
  const initial = begin();
  const selection = selected(initial);
  assert.equal(selection.selectedRef, "node:button");
  for (const key of ["focusedRef", "activeRef", "expandedRefs"]) {
    assert.equal(key in selection, false);
  }
  const before = structuredClone(initial);
  const saved = acceptEditorDraft(initial, initial.draftRevision, registry);
  const discarded = discardEditorDraft(initial, initial.draftRevision, registry);
  for (const result of [saved, discarded]) {
    assert.equal(result.accepted, true);
    if (result.accepted) {
      assert.equal(result.changed, false);
      assert.strictEqual(result.session, initial);
    }
  }
  assert.deepEqual(initial, before);
  proveProjection(initial, 2);
});

test("TASK-642 malformed span and foreign identities reject without partial mutation and recover", () => {
  const initial = begin();
  const selection = selected(initial);
  const proposal = createEditorSetSpanIntent(initial, selection, initial.draftRevision,
    { columnSpan: 3, rowSpan: 1 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) return;
  const before = structuredClone(initial);
  const invalid = [
    { ...proposal.intent, columnSpan: 1.5 },
    { ...proposal.intent, rowSpan: 0 },
    { ...proposal.intent, columnSpan: Number.NaN },
    { ...proposal.intent, columnSpan: "3" },
    { ...proposal.intent, sessionRef: "session:foreign" },
    { ...proposal.intent, compositionRef: "composition:foreign" },
    { ...proposal.intent, arbitraryPixels: 240 },
  ];
  for (const intent of invalid) {
    const rejected = applyEditorStructuralEditIntent(initial, selection, intent as never, registry);
    assert.equal(rejected.accepted, false);
    assert.strictEqual(rejected.session, initial);
    assert.deepEqual(initial, before);
    proveProjection(initial, 2);
  }
  const recovered = setSpan(initial, 3);
  assert.equal(recovered.accepted, true);
  if (!recovered.accepted) return;
  assert.equal(recovered.session.draftRevision, initial.draftRevision + 1);
  proveProjection(recovered.session, 3);
  const saved = acceptEditorDraft(recovered.session, recovered.session.draftRevision, registry);
  assert.equal(saved.accepted, true);
  if (saved.accepted) proveProjection(saved.session, 3);
});