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

test("TASK-642 malformed input rejects fail-closed; original session remains usable", () => {
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
