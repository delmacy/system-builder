import assert from "node:assert/strict";
import test from "node:test";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import {
  acceptEditorDraft, discardEditorDraft, applyEditorStructuralEditIntent,
  createEditorSetSpanIntent, emptyLayersSelection, initializeEditorSession,
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
const graph = defineCompositionGraph({ rootRef: "node:root", nodes: [
  { ref: "node:root", componentRef: "component:grid" },
  { ref: "node:button", componentRef: "component:button",
    placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
] });
function start(): EditorSession {
  const result = initializeEditorSession({
    sessionRef: "session:641", base: { applicationRef: "app:demo", compositionRef: "composition:demo",
      revision: 7, currentness: "current" }, composition: graph,
  }, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("fixture");
  return result.session;
}
function selection(session: EditorSession) {
  const result = selectEditorLayer(projectEditorLayers(session), emptyLayersSelection(), "node:button");
  assert.equal(result.accepted, true);
  return result.selection;
}
function edit(session: EditorSession, columns = 3): EditorSession {
  const selected = selection(session);
  const intent = createEditorSetSpanIntent(session, selected, session.draftRevision,
    { columnSpan: columns, rowSpan: 1 });
  assert.equal(intent.accepted, true);
  if (!intent.accepted) throw Error("intent");
  const result = applyEditorStructuralEditIntent(session, selected, intent.intent, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("edit");
  return result.session;
}
function column(session: EditorSession): number | undefined {
  return session.transaction.draft.nodes[1]?.placement?.columnSpan;
}
function convergence(session: EditorSession, expected: number) {
  const selected = selection(session);
  const layers = projectEditorLayers(session);
  const inspector = projectEditorInspector(session, selected, session.draftRevision);
  const preview = projectEditorPreview(session, registry, selected);
  assert.equal(layers.accepted, true);
  assert.equal(inspector.accepted, true);
  assert.equal(preview.accepted, true);
  if (inspector.accepted && inspector.snapshot.kind === "node") {
    assert.equal(inspector.snapshot.placement?.columnSpan, expected);
  }
  if (preview.accepted) {
    assert.equal(preview.snapshot.nodes.find((node) => node.nodeRef === "node:button")?.columnSpan, expected);
    assert.equal(preview.snapshot.baseRevision, 7);
    assert.equal(preview.snapshot.draftRevision, session.draftRevision);
  }
}
function rejectBoth(session: EditorSession, expected = session.draftRevision,
                    usingRegistry = registry): void {
  const before = structuredClone(session);
  for (const result of [
    acceptEditorDraft(session, expected, usingRegistry),
    discardEditorDraft(session, expected, usingRegistry),
  ]) {
    assert.equal(result.accepted, false);
    assert.strictEqual(result.session, session);
    assert.equal("acceptedComposition" in result, false);
  }
  assert.deepEqual(session, before);
}

test("TASK-641 save returns separately immutable accepted graph, clean local baseline and unchanged canonical revision", () => {
  const original = start();
  const changed = edit(original);
  const saved = acceptEditorDraft(changed, 8, registry);
  assert.equal(saved.accepted, true);
  if (!saved.accepted) return;
  assert.equal(saved.changed, true);
  assert.equal(saved.session.draftRevision, 9);
  assert.equal(saved.session.base.revision, 7);
  assert.strictEqual(saved.session.base, changed.base);
  assert.equal(saved.session.transaction.dirty, false);
  assert.deepEqual(saved.session.transaction.base, saved.session.transaction.draft);
  assert.deepEqual(saved.acceptedComposition, changed.transaction.draft);
  assert.notStrictEqual(saved.acceptedComposition, saved.session.transaction.draft);
  assert.equal(Object.isFrozen(saved.acceptedComposition), true);
  assert.equal(Object.isFrozen(saved.acceptedComposition.nodes), true);
  assert.equal(saved.acceptedComposition.nodes.every((node) =>
    Object.isFrozen(node) && (node.placement === undefined || Object.isFrozen(node.placement))), true);
  assert.equal(column(original), 2);
  convergence(saved.session, 3);
  const repeated = acceptEditorDraft(saved.session, 9, registry);
  assert.equal(repeated.accepted, true);
  if (repeated.accepted) {
    assert.equal(repeated.changed, false);
    assert.strictEqual(repeated.session, saved.session);
  }
});

test("TASK-641 discard restores prior Station baseline and all projections converge", () => {
  const original = start();
  const changed = edit(original);
  const discarded = discardEditorDraft(changed, 8, registry);
  assert.equal(discarded.accepted, true);
  if (!discarded.accepted) return;
  assert.equal(discarded.changed, true);
  assert.equal(discarded.session.draftRevision, 9);
  assert.equal(discarded.session.base.revision, 7);
  assert.equal(discarded.session.transaction.dirty, false);
  assert.deepEqual(discarded.session.transaction.draft, original.transaction.draft);
  assert.notStrictEqual(discarded.session.transaction.draft, original.transaction.draft);
  assert.equal(column(changed), 3);
  convergence(discarded.session, 2);
  const repeat = discardEditorDraft(discarded.session, 9, registry);
  assert.equal(repeat.accepted, true);
  if (repeat.accepted) {
    assert.equal(repeat.changed, false);
    assert.strictEqual(repeat.session, discarded.session);
  }
});

test("TASK-641 stale revision, unknown/stale currentness, registry mismatch and invalid identity reject", () => {
  const dirty = edit(start());
  for (const expected of [7, 9, -1, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) rejectBoth(dirty, expected);
  rejectBoth(dirty, 8, new ComponentRegistry());
  for (const broken of [
    { ...dirty, sessionRef: dirty.base.applicationRef },
    { ...dirty, base: { ...dirty.base, currentness: "stale" } },
    { ...dirty, base: { ...dirty.base, currentness: "unknown" } },
    { ...dirty, draftCurrentness: "unknown" },
    { ...dirty, draftRevision: Number.NaN },
    { ...dirty, authority: "core" },
    { ...dirty, transaction: { ...dirty.transaction, findings: [{}] } },
    { ...dirty, transaction: { ...dirty.transaction, dirty: false } },
    { ...dirty, transaction: { ...dirty.transaction, dirty: true,
      base: dirty.transaction.draft } },
  ]) rejectBoth(broken as EditorSession);
});

test("TASK-641 forged graph, duplicate/cyclic/disconnected nodes, invalid spans and extra fields fail closed", () => {
  const dirty = edit(start());
  const badGraphs: unknown[] = [
    { ...dirty.transaction.draft, nodes: [...dirty.transaction.draft.nodes,
      dirty.transaction.draft.nodes[1]] },
    { ...dirty.transaction.draft, nodes: dirty.transaction.draft.nodes.map((node) =>
      node.ref === "node:button" ? { ...node, placement: { ...node.placement!, parentRef: "node:button" } } : node) },
    { ...dirty.transaction.draft, nodes: dirty.transaction.draft.nodes.map((node) =>
      node.ref === "node:button" ? { ...node, placement: { ...node.placement!, parentRef: "node:missing" } } : node) },
    { ...dirty.transaction.draft, nodes: dirty.transaction.draft.nodes.map((node) =>
      node.ref === "node:button" ? { ...node, placement: { ...node.placement!, columnSpan: 1.5 } } : node) },
    { ...dirty.transaction.draft, nodes: dirty.transaction.draft.nodes.map((node) =>
      node.ref === "node:button" ? { ...node, extra: "injected" } : node) },
    { ...dirty.transaction.draft, nodes: [null, ...dirty.transaction.draft.nodes] },
    { ...dirty.transaction.draft, unexpected: "extra" },
  ];
  for (const draft of badGraphs) {
    const forged = { ...dirty, transaction: { ...dirty.transaction, draft } } as EditorSession;
    assert.doesNotThrow(() => rejectBoth(forged));
  }
  rejectBoth(null as unknown as EditorSession);
  rejectBoth({ ...dirty, draftRevision: Number.MAX_SAFE_INTEGER,
    transaction: dirty.transaction } as EditorSession);
});

test("TASK-641 rejection recovery and old intent replay after boundary increment", () => {
  const original = start();
  const selected = selection(original);
  const proposal = createEditorSetSpanIntent(original, selected, 7, { columnSpan: 3, rowSpan: 1 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) return;
  const dirty = edit(original);
  rejectBoth(dirty, 7);
  const saved = acceptEditorDraft(dirty, 8, registry);
  assert.equal(saved.accepted, true);
  if (!saved.accepted) return;
  const stale = applyEditorStructuralEditIntent(saved.session, selected, proposal.intent, registry);
  assert.equal(stale.accepted, false);
  const editedAgain = edit(saved.session, 4);
  const discarded = discardEditorDraft(editedAgain, 10, registry);
  assert.equal(discarded.accepted, true);
  if (discarded.accepted) {
    assert.equal(discarded.session.draftRevision, 11);
    convergence(discarded.session, 3);
  }
});
