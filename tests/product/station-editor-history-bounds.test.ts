import assert from "node:assert/strict";
import test from "node:test";
import { ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { initializeEditorSession, createEditorHistory, createEditorSetSpanIntent, applyEditorHistoryEdit,
  applyEditorHistoryStructure, moveEditorHistory, acceptEditorDraft, createCompositionArtifact, decodeCompositionArtifact,
  type EditorHistory, type EditorHistoryResult } from "../../packages/station-editor/index.js";
function ok(result: EditorHistoryResult): EditorHistory { if (!result.accepted) throw Error("history rejected"); return result.history; }
function edit(history: EditorHistory, registry: ComponentRegistry, selectedRef: string, columns: number) {
  const selection = { selectedRef };
  const proposal = createEditorSetSpanIntent(history.session, selection, history.session.draftRevision, { columnSpan: columns, rowSpan: 1 });
  if (!proposal.accepted) throw Error("intent");
  return applyEditorHistoryEdit(history, selection, proposal.intent, registry);
}
function large(shape: "children" | "chain") {
  const entry = resolveEditorCatalogEntry("composition:example"); if (!entry) throw Error("catalog");
  const graph = defineCompositionGraph({ rootRef: "node:root", nodes: [
    { ref: "node:root", componentRef: "component:grid" },
    ...Array.from({ length: 255 }, (_, i) => ({ ref: `node:n-${i + 1}`,
      componentRef: shape === "chain" && i < 254 ? "component:grid" : "component:button",
      placement: { parentRef: shape === "chain" && i > 0 ? `node:n-${i}` : "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } })),
  ] });
  const result = initializeEditorSession({ sessionRef: "session:wp6-bounds", base: {
    applicationRef: entry.applicationRef, compositionRef: entry.compositionRef, revision: entry.revision, currentness: "current" }, composition: graph }, entry.registry);
  if (!result.accepted) throw Error("fixture");
  let history = createEditorHistory(result.session);
  for (let i = 0; i < 51; i++) history = ok(edit(history, entry.registry, "node:n-255", i % 2 ? 2 : 3));
  return { history, entry };
}
for (const shape of ["children", "chain"] as const) {
  test(`WP6 ${shape}: actual 256-node/51-edit history retains exactly 50 reversible snapshots`, () => {
    const initial = large(shape); let history = initial.history; const before = structuredClone(history);
    const revision = history.session.draftRevision;
    assert.equal(history.past.length, 50); assert.equal(history.session.transaction.draft.nodes.length, 256);
    for (let i = 0; i < 50; i++) history = ok(moveEditorHistory(history, "undo", history.session.draftRevision, initial.entry.registry));
    assert.equal(history.past.length, 0); assert.equal(history.future.length, 50);
    assert.equal(history.session.draftRevision, revision + 50);
    assert.strictEqual(ok(moveEditorHistory(history, "undo", history.session.draftRevision, initial.entry.registry)), history);
    for (let i = 0; i < 50; i++) history = ok(moveEditorHistory(history, "redo", history.session.draftRevision, initial.entry.registry));
    assert.deepEqual(history.session.transaction.draft, initial.history.session.transaction.draft);
    assert.deepEqual(initial.history, before);
  });
}
test("WP6 cold max-bound history validates every snapshot, including oldest non-target tampering", () => {
  const { history, entry } = large("children");
  const copy = structuredClone(history);
  assert.equal(moveEditorHistory(copy, "undo", copy.session.draftRevision, entry.registry).accepted, true);
  Object.defineProperty(copy.past[0]!.nodes[1]!.placement!, "columnSpan", { value: 999, enumerable: true, writable: true });
  const before = structuredClone(copy);
  const result = moveEditorHistory(copy, "undo", copy.session.draftRevision, entry.registry);
  assert.equal(result.accepted, false); assert.strictEqual(result.history, copy); assert.deepEqual(copy, before);
});
test("WP6 warmed past-only descriptor remains subject to replaced prototype authority and recovery", () => {
  const initial = initializeCatalogEditorSession("composition:example", "session:wp6-prototype"); if (!initial.accepted) throw Error("catalog");
  const registry = initial.entry.registry; const descriptor = registry.get("component:button"); if (!descriptor) throw Error("descriptor");
  registry.register({ ...descriptor, id: "component:past-only" });
  let history = createEditorHistory(initial.session);
  history = ok(applyEditorHistoryStructure(history, { type: "add-node", nodeRef: "node:past-only",
    componentRef: "component:past-only", parentRef: "node:root", slotRef: "content", sessionRef: history.session.sessionRef,
    compositionRef: history.session.base.compositionRef, expectedDraftRevision: history.session.draftRevision }, registry));
  history = ok(edit(history, registry, "node:button-1", 3));
  history = ok(applyEditorHistoryStructure(history, { type: "remove-subtree", nodeRef: "node:past-only",
    sessionRef: history.session.sessionRef, compositionRef: history.session.base.compositionRef, expectedDraftRevision: history.session.draftRevision }, registry));
  // An accepted no-op validates the retained stack while preserving that exact wrapper.
  assert.strictEqual(ok(edit(history, registry, "node:button-1", 3)), history);
  const get = ComponentRegistry.prototype.get;
  try {
    ComponentRegistry.prototype.get = function (id: string) { return id === "component:past-only" ? null : get.call(this, id); };
    const result = moveEditorHistory(history, "undo", history.session.draftRevision, registry);
    assert.equal(result.accepted, false); assert.strictEqual(result.history, history);
  } finally { ComponentRegistry.prototype.get = get; }
  history = ok(moveEditorHistory(history, "undo", history.session.draftRevision, registry));
  assert.equal(history.session.transaction.draft.nodes.some(n => n.ref === "node:past-only"), true);
});
for (const ref of ["composition:example", "composition:button-group"]) {
  test(`WP6 ${ref}: warm checkpoint -> codec -> fresh session has no retained history or authority`, () => {
    const initial = initializeCatalogEditorSession(ref, "session:wp6-portable"); if (!initial.accepted) throw Error("catalog");
    let history = createEditorHistory(initial.session); const selected = history.session.transaction.draft.nodes[1]!.ref;
    for (let i = 0; i < 8; i++) history = ok(edit(history, initial.entry.registry, selected, i % 2 ? 4 : 3));
    const saved = acceptEditorDraft(history.session, history.session.draftRevision, initial.entry.registry); if (!saved.accepted) throw Error("save");
    const checkpoint = createEditorHistory(saved.session); assert.equal(checkpoint.past.length + checkpoint.future.length, 0);
    const encoded = createCompositionArtifact(saved.acceptedComposition, initial.entry, { artifactId: "urn:uuid:wp6-proof", artifactVersion: "1.0.0",
      provenance: { createdAt: "2026-10-11T00:00:00Z", producer: { id: "urn:system-builder:wp6", version: "1.0.0" }, inputs: [] } });
    if (!encoded.accepted) throw Error("codec");
    const decoded = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry); if (!decoded.accepted) throw Error("decode");
    const reopened = initializeEditorSession({ sessionRef: "session:wp6-reopened", base: initial.session.base, composition: decoded.document.payload.graph }, initial.entry.registry);
    if (!reopened.accepted) throw Error("reopen");
    const fresh = createEditorHistory(reopened.session);
    assert.strictEqual(ok(moveEditorHistory(fresh, "undo", fresh.session.draftRevision, initial.entry.registry)), fresh);
    assert.deepEqual(fresh.session.transaction.draft, saved.acceptedComposition);
    assert.equal(encoded.text.includes("certificates"), false); assert.equal(encoded.text.includes('"past"'), false);
  });
}
