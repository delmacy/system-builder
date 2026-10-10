import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { applyEditorHistoryStructure, applyEditorHistoryEdit, createEditorHistory, moveEditorHistory,
  repairEditorSelection, projectEditorLayers, projectEditorPreview, projectEditorInspector,
  createEditorSetSpanIntent, createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact,
  acceptEditorDraft, discardEditorDraft, initializeEditorSession, ARTIFACT_LIMITS,
  type EditorHistory, type EditorHistoryResult, type EditorStructureIntent } from "../../packages/station-editor/index.js";
const metadata = { artifactId: "urn:uuid:wp5-test", artifactVersion: "1.0.0", provenance: {
  createdAt: "2026-10-10T21:00:00Z", producer: { id: "urn:system-builder:wp5", version: "1.0.0" }, inputs: [] } };
function setup(ref = "composition:example") {
  const initial = initializeCatalogEditorSession(ref, "session:wp5");
  if (!initial.accepted) throw Error("catalog");
  return { entry: initial.entry, h: createEditorHistory(initial.session) };
}
function ok(r: EditorHistoryResult): EditorHistory { assert.equal(r.accepted, true); if (!r.accepted) throw Error("rejected"); return r.history; }
function command(h: EditorHistory, value: Record<string, unknown>): EditorStructureIntent {
  return { sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef,
    expectedDraftRevision: h.session.draftRevision, ...value } as EditorStructureIntent;
}
function act(h: EditorHistory, value: Record<string, unknown>) {
  return applyEditorHistoryStructure(h, command(h, value), resolveEditorCatalogEntry(h.session.base.compositionRef)!.registry);
}
const add = (h: EditorHistory, nodeRef: string, componentRef = "component:button", parentRef = "node:root", slotRef = "content") =>
  act(h, { type: "add-node", nodeRef, componentRef, parentRef, slotRef });
const move = (h: EditorHistory, direction: "undo" | "redo") =>
  ok(moveEditorHistory(h, direction, h.session.draftRevision, resolveEditorCatalogEntry(h.session.base.compositionRef)!.registry));
function reject(r: EditorHistoryResult, h: EditorHistory) { assert.equal(r.accepted, false); assert.strictEqual(r.history, h); }

test("WP5 actual catalog add/reorder/remove converges projections and portable v2 round trip", () => {
  const { h: original, entry } = setup(); let h = ok(add(original, "node:new"));
  assert.equal(h.session.draftRevision, 8); assert.equal(original.session.transaction.draft.nodes.length, 3);
  h = ok(act(h, { type: "reorder-node", nodeRef: "node:new", direction: "before" }));
  const selection = { selectedRef: "node:new" };
  const layers = projectEditorLayers(h.session); assert.ok(layers.accepted);
  if (layers.accepted) assert.deepEqual(layers.root.children.map(n => n.nodeRef), ["node:button-1", "node:new", "node:button-2"]);
  const preview = projectEditorPreview(h.session, entry.registry, selection); assert.ok(preview.accepted);
  if (preview.accepted) assert.deepEqual(preview.snapshot.nodes.map(n => n.nodeRef), h.session.transaction.draft.nodes.map(n => n.ref));
  const inspector = projectEditorInspector(h.session, selection, h.session.draftRevision); assert.ok(inspector.accepted);
  const exported = createCompositionArtifact(h.session.transaction.draft, entry, metadata); assert.ok(exported.accepted);
  if (!exported.accepted) throw Error("export rejected");
  assert.equal(exported.document.schema.version, "2.0.0");
  const decoded = decodeCompositionArtifact(exported.text, resolveEditorCatalogEntry); assert.ok(decoded.accepted);
  if (!decoded.accepted) throw Error("decode rejected");
  assert.deepEqual(decoded.document.payload.graph, h.session.transaction.draft);
  assert.deepEqual(encodeCompositionArtifact(decoded.document, resolveEditorCatalogEntry), exported);
  const fresh = initializeEditorSession({ sessionRef: "session:wp5-reopen", base: h.session.base, composition: decoded.document.payload.graph }, entry.registry);
  assert.ok(fresh.accepted); assert.equal(exported.text.includes('"past"'), false);
  h = ok(act(h, { type: "remove-subtree", nodeRef: "node:new" }));
  assert.equal(h.session.transaction.draft.nodes.length, 3); assert.equal(h.session.transaction.dirty, false);
});
test("WP5 nested subtree removal is atomic/reversible and deleted selection repairs to parent", () => {
  let h = ok(add(setup().h, "node:container", "component:grid"));
  h = ok(add(h, "node:child", "component:button", "node:container"));
  const before = h.session.transaction.draft;
  h = ok(act(h, { type: "remove-subtree", nodeRef: "node:container" }));
  assert.equal(h.session.transaction.draft.nodes.length, 3);
  assert.equal(repairEditorSelection(before, h.session.transaction.draft, "node:child"), "node:root");
  assert.equal(repairEditorSelection(before, h.session.transaction.draft, "node:button-1"), "node:button-1");
  h = move(h, "undo"); assert.deepEqual(h.session.transaction.draft, before);
  h = move(h, "redo"); assert.equal(h.session.transaction.draft.nodes.length, 3);
});
test("WP5 root/unknown/duplicate/foreign slot/atomic parent/extra fields fail without mutation", () => {
  const { h, entry } = setup(); const before = structuredClone(h);
  for (const value of [
    { type: "remove-subtree", nodeRef: "node:root" }, { type: "remove-subtree", nodeRef: "missing" },
    { type: "reorder-node", nodeRef: "node:root", direction: "before" },
    { type: "reorder-node", nodeRef: "node:button-1", direction: "other" },
    { type: "add-node", nodeRef: "node:button-1", componentRef: "component:button", parentRef: "node:root", slotRef: "content" },
    { type: "add-node", nodeRef: "new", componentRef: "foreign", parentRef: "node:root", slotRef: "content" },
    { type: "add-node", nodeRef: "new", componentRef: "component:button", parentRef: "node:button-1", slotRef: "content" },
    { type: "add-node", nodeRef: "new", componentRef: "component:button", parentRef: "node:root", slotRef: "bad" },
    { type: "remove-subtree", nodeRef: "node:button-1", unknown: true },
  ]) reject(act(h, value), h);
  reject(applyEditorHistoryStructure(h, { ...command(h, { type: "remove-subtree", nodeRef: "node:button-1" }), sessionRef: "foreign" }, entry.registry), h);
  assert.deepEqual(h, before);
});
test("WP5 typed single-child group slots reject occupied or incompatible additions and permit empty slot", () => {
  let { h } = setup("composition:button-group");
  reject(add(h, "new", "component:lab-button", "layer:button-group", "button-1"), h);
  reject(add(h, "new", "component:button-group", "layer:button-group", "button-3"), h);
  h = ok(add(h, "new", "component:lab-button", "layer:button-group", "button-3"));
  assert.equal(h.session.transaction.draft.nodes.length, 4);
  assert.strictEqual(ok(act(h, { type: "reorder-node", nodeRef: "new", direction: "before" })), h);
  const source = resolveEditorCatalogEntry("composition:button-group")!;
  assert.equal(createCompositionArtifact(h.session.transaction.draft, source, metadata).accepted, true);
});
test("WP5 stale/overflow/no-op transitions and branching retain correct history", () => {
  const { h: initial, entry } = setup(); let h = ok(add(initial, "new"));
  reject(applyEditorHistoryStructure(h, { ...command(h, { type: "remove-subtree", nodeRef: "new" }), expectedDraftRevision: 7 }, entry.registry), h);
  const max = { ...h, session: { ...h.session, draftRevision: Number.MAX_SAFE_INTEGER } };
  reject(add(max, "overflow"), max);
  h = move(h, "undo"); assert.equal(h.future.length, 1);
  assert.strictEqual(ok(act(h, { type: "reorder-node", nodeRef: "node:button-1", direction: "before" })), h);
  reject(add(h, "new", "foreign"), h); assert.equal(h.future.length, 1);
  h = ok(add(h, "branch")); assert.equal(h.future.length, 0);
});
test("WP5 structural/span history mixes safely, bounded 50 entries and immutable snapshots", () => {
  const { entry } = setup(); let h = ok(add(setup().h, "new"));
  const selection = { selectedRef: "new" }; const proposal = createEditorSetSpanIntent(h.session, selection, h.session.draftRevision, { columnSpan: 3, rowSpan: 1 });
  if (!proposal.accepted) throw Error("span"); h = ok(applyEditorHistoryEdit(h, selection, proposal.intent, entry.registry));
  h = move(h, "undo"); assert.equal(h.session.transaction.draft.nodes.at(-1)?.placement?.columnSpan, 2);
  h = move(h, "undo"); assert.equal(h.session.transaction.draft.nodes.length, 3); assert.equal(h.session.transaction.dirty, false);
  h = move(move(h, "redo"), "redo");
  assert.equal(h.session.transaction.draft.nodes.at(-1)?.placement?.columnSpan, 3);
  for (let i = 0; i < 51; i++) h = ok(act(h, { type: "reorder-node", nodeRef: "new", direction: i % 2 ? "after" : "before" }));
  assert.equal(h.past.length, 50); assert.ok(Object.isFrozen(h.past[0]?.nodes));
  for (let i = 0; i < 50; i++) h = move(h, "undo"); assert.equal(h.past.length, 0);
});
test("WP5 save/discard checkpoints accept authored baseline and preserve source root", () => {
  const { entry } = setup(); let h = ok(add(setup().h, "new"));
  const accepted = acceptEditorDraft(h.session, h.session.draftRevision, entry.registry); if (!accepted.accepted) throw Error("save");
  h = createEditorHistory(accepted.session); h = ok(act(h, { type: "remove-subtree", nodeRef: "new" }));
  h = move(h, "undo"); assert.equal(h.session.transaction.dirty, false);
  h = move(h, "redo"); const discarded = discardEditorDraft(h.session, h.session.draftRevision, entry.registry);
  if (!discarded.accepted) throw Error("discard"); assert.equal(discarded.session.transaction.draft.nodes.length, 4);
});
test("WP5 v1 unchanged readable; v1 rejects new topology; v2 root/cycle/cardinality and versions reject", () => {
  const { h, entry } = setup(); const original = createCompositionArtifact(h.session.transaction.draft, entry, metadata);
  if (!original.accepted) throw Error("codec"); assert.equal(original.document.schema.version, "1.0.0");
  assert.ok(decodeCompositionArtifact(original.text, resolveEditorCatalogEntry).accepted);
  const graph = ok(add(h, "new")).session.transaction.draft;
  const v1 = { ...original.document, payload: { ...original.document.payload, graph } };
  assert.equal(encodeCompositionArtifact(v1, resolveEditorCatalogEntry).accepted, false);
  const v2 = { ...v1, schema: { ...v1.schema, version: "2.0.0" } };
  assert.ok(encodeCompositionArtifact(v2, resolveEditorCatalogEntry).accepted);
  for (const version of ["2.0.1", "2.1.0", "3.0.0"]) assert.equal(encodeCompositionArtifact({ ...v2, schema: { ...v2.schema, version } }, resolveEditorCatalogEntry).accepted, false);
  const changedRoot = { ...graph, nodes: graph.nodes.map(n => n.ref === graph.rootRef ? { ...n, componentRef: "component:button" } : n) };
  assert.equal(encodeCompositionArtifact({ ...v2, payload: { ...v2.payload, graph: changedRoot } }, resolveEditorCatalogEntry).accepted, false);
  const cycle = { ...graph, nodes: graph.nodes.map(n => n.ref === "new" ? { ...n, placement: { ...n.placement!, parentRef: "new" } } : n) };
  assert.equal(encodeCompositionArtifact({ ...v2, payload: { ...v2.payload, graph: cycle } }, resolveEditorCatalogEntry).accepted, false);
});
test("WP5 actual node acceptance 255/256 and 257 rejection; token boundary", () => {
  const { h, entry } = setup();
  for (const count of [255, 256, 257]) {
    const graph = { rootRef: "node:root", nodes: [entry.composition.nodes[0]!, ...Array.from({ length: count - 1 }, (_, i) => ({
      ref: `node:n-${i}`, componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 },
    }))] };
    const result = createCompositionArtifact(graph, entry, metadata); assert.equal(result.accepted, count <= ARTIFACT_LIMITS.nodes);
    if (count === 256 && result.accepted) {
      const initialized = initializeEditorSession({ sessionRef: "session:limit", base: h.session.base, composition: result.document.payload.graph }, entry.registry);
      if (!initialized.accepted) throw Error("initialize"); const full = createEditorHistory(initialized.session);
      reject(add(full, "overflow"), full);
    }
  }
  assert.ok(add(h, "x".repeat(256)).accepted); reject(add(h, "x".repeat(257)), h);
});
