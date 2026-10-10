import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, listEditorCatalog, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { createEditorHistory, applyEditorHistoryEdit, moveEditorHistory, EDITOR_HISTORY_LIMIT,
  createEditorSetSpanIntent, projectEditorLayers, projectEditorInspector, projectEditorPreview,
  acceptEditorDraft, discardEditorDraft, createCompositionArtifact, decodeCompositionArtifact,
  type EditorHistory, type EditorHistoryResult } from "../../packages/station-editor/index.js";

function setup(ref = "composition:example") {
  const initial = initializeCatalogEditorSession(ref, "session:history-proof");
  assert.equal(initial.accepted, true);
  if (!initial.accepted) throw Error("catalog");
  const nodeRef = initial.session.transaction.draft.nodes[1]!.ref;
  return { history: createEditorHistory(initial.session), entry: initial.entry, selection: { selectedRef: nodeRef } };
}
function ok(result: EditorHistoryResult): EditorHistory {
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("history rejected");
  return result.history;
}
function edit(history: EditorHistory, columns: number, ref = "composition:example") {
  const { entry, selection } = setup(ref);
  const proposal = createEditorSetSpanIntent(history.session, selection, history.session.draftRevision, { columnSpan: columns, rowSpan: 1 });
  assert.equal(proposal.accepted, true);
  if (!proposal.accepted) throw Error("intent");
  return applyEditorHistoryEdit(history, selection, proposal.intent, entry.registry);
}
function move(history: EditorHistory, direction: "undo" | "redo", ref = "composition:example") {
  return moveEditorHistory(history, direction, history.session.draftRevision, setup(ref).entry.registry);
}
function columns(history: EditorHistory) { return history.session.transaction.draft.nodes[1]!.placement!.columnSpan; }
function unchanged(result: EditorHistoryResult, history: EditorHistory) {
  assert.equal(result.accepted, false); assert.strictEqual(result.history, history);
}
for (const { compositionRef } of listEditorCatalog()) {
  test(`TASK-658 ${compositionRef} real projections converge through immutable undo/redo`, () => {
    const { history: original, entry, selection } = setup(compositionRef);
    let h = ok(edit(original, 3, compositionRef));
    const applied = h;
    h = ok(move(h, "undo", compositionRef));
    assert.equal(columns(h), 2); assert.equal(h.session.transaction.dirty, false);
    assert.equal(h.session.draftRevision, original.session.draftRevision + 2);
    h = ok(move(h, "redo", compositionRef));
    assert.equal(columns(h), 3); assert.equal(h.session.transaction.dirty, true);
    assert.equal(h.session.draftRevision, original.session.draftRevision + 3);
    assert.strictEqual(h.session.base, original.session.base);
    assert.strictEqual(h.session.transaction.base, original.session.transaction.base);
    assert.equal(columns(original), 2); assert.equal(columns(applied), 3);
    assert.equal(projectEditorLayers(h.session).accepted, true);
    const inspector = projectEditorInspector(h.session, selection, h.session.draftRevision);
    assert.equal(inspector.accepted, true);
    if (inspector.accepted && inspector.snapshot.kind === "node") assert.equal(inspector.snapshot.placement?.columnSpan, 3);
    const preview = projectEditorPreview(h.session, entry.registry, selection);
    assert.equal(preview.accepted, true);
    if (preview.accepted) assert.equal(preview.snapshot.nodes.find(n => n.nodeRef === selection.selectedRef)?.columnSpan, 3);
    for (const value of [h, h.past, h.future, h.past[0], h.past[0]?.nodes, h.past[0]?.nodes[1]?.placement]) assert.equal(Object.isFrozen(value), true);
  });
}
test("TASK-658 redo survives no-op/rejected/stale edits and clears on changed branching", () => {
  let h = ok(move(ok(edit(setup().history, 3)), "undo"));
  assert.equal(h.future.length, 1);
  assert.strictEqual(ok(edit(h, 2)), h);
  unchanged(edit(h, 999), h);
  const { entry, selection } = setup();
  const stale = createEditorSetSpanIntent(h.session, selection, h.session.draftRevision, { columnSpan: 3, rowSpan: 1 });
  if (!stale.accepted) throw Error("intent");
  unchanged(applyEditorHistoryEdit(h, selection, { ...stale.intent, expectedDraftRevision: h.session.draftRevision - 1 }, entry.registry), h);
  h = ok(edit(h, 4)); assert.equal(h.future.length, 0); assert.equal(columns(h), 4);
  assert.strictEqual(ok(move(h, "redo")), h);
});
test("TASK-658 49/50/51 changed-edit boundary evicts exactly one oldest snapshot", () => {
  let h = setup().history;
  for (let count = 1; count <= 51; count++) {
    h = ok(edit(h, count % 2 ? 3 : 2));
    if (count >= 49) assert.equal(h.past.length, Math.min(count, EDITOR_HISTORY_LIMIT));
  }
  const firstRetained = h.past[0];
  assert.equal(firstRetained?.nodes[1]?.placement?.columnSpan, 3);
  const startRevision = h.session.draftRevision;
  for (let count = 0; count < 50; count++) h = ok(move(h, "undo"));
  assert.equal(h.past.length, 0); assert.equal(h.future.length, 50);
  assert.equal(columns(h), 3); assert.equal(h.session.draftRevision, startRevision + 50);
  assert.strictEqual(ok(move(h, "undo")), h);
  for (let count = 0; count < 50; count++) h = ok(move(h, "redo"));
  assert.equal(columns(h), 3); assert.equal(h.future.length, 0); assert.equal(h.past.length, 50);
});
test("TASK-658 empty/stale/overflow transitions fail without partial mutation", () => {
  const initial = setup();
  assert.strictEqual(ok(move(initial.history, "undo")), initial.history);
  assert.strictEqual(ok(move(initial.history, "redo")), initial.history);
  const h = ok(edit(initial.history, 3)); const before = structuredClone(h);
  unchanged(moveEditorHistory(h, "undo", h.session.draftRevision - 1, initial.entry.registry), h);
  const max = { ...h, session: { ...h.session, draftRevision: Number.MAX_SAFE_INTEGER } };
  unchanged(moveEditorHistory(max, "undo", Number.MAX_SAFE_INTEGER, initial.entry.registry), max);
  assert.deepEqual(h, before);
});
test("TASK-658 malformed, oversized, invalid, foreign topology history rejected", () => {
  const { history: original, entry } = setup();
  const h = ok(edit(original, 3));
  const baseline = structuredClone(original.session.transaction.draft);
  const altered = { ...baseline, nodes: baseline.nodes.map((n, i) => i === 1 ? { ...n, placement: { ...n.placement!, columnSpan: 999 } } : n) };
  const foreign = { ...baseline, nodes: baseline.nodes.map((n, i) => i === 1 ? { ...n, placement: { ...n.placement!, slotRef: "foreign" } } : n) };
  const unknown = { ...baseline, unknown: true };
  const candidates = [{ ...h, past: Array(51).fill(baseline) }, { ...h, past: [altered] },
    { ...h, past: [foreign] }, { ...h, past: [unknown] }, { ...h, future: null },
    { ...h, extra: true }, { ...h, past: [null] }];
  for (const candidate of candidates) {
    const before = structuredClone(candidate);
    unchanged(moveEditorHistory(candidate as unknown as EditorHistory, "undo", h.session.draftRevision, entry.registry), candidate as unknown as EditorHistory);
    assert.deepEqual(candidate, before);
  }
});
test("TASK-658 set-placement is rejected even if the predecessor API supports it", () => {
  const { history: h, entry, selection } = setup();
  unchanged(applyEditorHistoryEdit(h, selection, { type: "set-placement", sessionRef: h.session.sessionRef,
    compositionRef: h.session.base.compositionRef, nodeRef: selection.selectedRef,
    expectedDraftRevision: h.session.draftRevision, parentRef: h.session.transaction.draft.rootRef,
    slotRef: "content", columnSpan: 3, rowSpan: 1 }, entry.registry), h);
});
test("TASK-658 checkpoint reset is explicit; baseline, graph codec and inputs preserved", () => {
  const { history: initial, entry } = setup(); let h = ok(edit(initial, 3));
  const saved = acceptEditorDraft(h.session, h.session.draftRevision, entry.registry);
  if (!saved.accepted) throw Error("save");
  h = createEditorHistory(saved.session); assert.equal(h.past.length + h.future.length, 0);
  h = ok(edit(h, 4)); h = ok(move(h, "undo"));
  assert.equal(columns(h), 3); assert.equal(h.session.transaction.dirty, false);
  h = ok(move(h, "redo"));
  const discarded = discardEditorDraft(h.session, h.session.draftRevision, entry.registry);
  if (!discarded.accepted) throw Error("discard");
  h = createEditorHistory(discarded.session); assert.equal(columns(h), 3); assert.equal(h.past.length + h.future.length, 0);
  const encoded = createCompositionArtifact(h.session.transaction.draft, entry, { artifactId: "urn:uuid:history-proof", artifactVersion: "1.0.0",
    provenance: { createdAt: "2026-10-10T19:00:00Z", producer: { id: "urn:system-builder:history-proof", version: "1.0.0" }, inputs: [] } });
  assert.equal(encoded.accepted, true);
  if (!encoded.accepted) return;
  const decoded = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry);
  assert.equal(decoded.accepted, true);
  if (decoded.accepted) assert.deepEqual(decoded.document.payload.graph, h.session.transaction.draft);
  const payload = JSON.parse(encoded.text).payload;
  assert.deepEqual(Object.keys(payload).sort(), ["applicationRef", "baseRevision", "compositionRef", "graph"]);
  assert.equal(encoded.text.includes('"past"'), false); assert.equal(encoded.text.includes('"future"'), false);
  assert.equal(columns(initial), 2);
});
