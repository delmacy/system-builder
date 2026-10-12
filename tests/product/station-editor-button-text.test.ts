import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { projectResponsiveComposition } from "../../packages/station-composition/index.js";
import { applyEditorHistoryStructure, applyEditorHistoryEdit, createEditorHistory, moveEditorHistory,
  projectEditorLayers, projectEditorInspector, projectEditorPreview, createEditorSetSpanIntent, createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact,
  acceptEditorDraft, discardEditorDraft, initializeEditorSession,
  type EditorHistory, type EditorHistoryResult, type EditorStructureIntent } from "../../packages/station-editor/index.js";
const metadata = { artifactId: "urn:uuid:wp7-test", artifactVersion: "1.0.0", provenance: {
  createdAt: "2026-10-11T00:00:00Z", producer: { id: "urn:system-builder:wp7", version: "1.0.0" }, inputs: [] } };
function setup(ref = "composition:example") {
  const initial = initializeCatalogEditorSession(ref, "session:wp7");
  if (!initial.accepted) throw Error("catalog");
  return { entry: initial.entry, h: createEditorHistory(initial.session) };
}
function ok(r: EditorHistoryResult): EditorHistory { assert.equal(r.accepted, true); if (!r.accepted) throw Error("rejected"); return r.history; }
function act(h: EditorHistory, value: Record<string, unknown>) {
  return applyEditorHistoryStructure(h, { sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef,
    expectedDraftRevision: h.session.draftRevision, ...value } as EditorStructureIntent,
  resolveEditorCatalogEntry(h.session.base.compositionRef)!.registry);
}
const text = (h: EditorHistory, value: unknown, nodeRef = "node:button-1") => act(h, { type: "set-text", nodeRef, text: value });
const value = (h: EditorHistory) => h.session.transaction.draft.nodes.find(n => n.ref === "node:button-1")?.text;
const move = (h: EditorHistory, direction: "undo" | "redo") => ok(moveEditorHistory(h, direction, h.session.draftRevision, setup().entry.registry));
function rejected(r: EditorHistoryResult, h: EditorHistory) { assert.equal(r.accepted, false); assert.strictEqual(r.history, h); }

test("WP7 actual installed text survives mixed span/structure history, checkpoints and v3 fresh session", () => {
  const { entry, h: initial } = setup();
  let h = ok(text(initial, "  Confirmar ação 🧭  "));
  const selection = { selectedRef: "node:button-1" };
  const layers = projectEditorLayers(h.session); assert.ok(layers.accepted);
  if (layers.accepted) assert.equal(layers.root.children[0]?.text, value(h));
  const inspector = projectEditorInspector(h.session, selection, h.session.draftRevision); assert.ok(inspector.accepted);
  if (inspector.accepted && inspector.snapshot.kind === "node") assert.equal(inspector.snapshot.text, value(h));
  const preview = projectEditorPreview(h.session, entry.registry, selection); assert.ok(preview.accepted);
  if (preview.accepted) assert.equal(preview.snapshot.nodes[1]?.text, value(h));
  const intent = createEditorSetSpanIntent(h.session, { selectedRef: "node:button-1" }, h.session.draftRevision, { columnSpan: 3, rowSpan: 1 });
  assert.ok(intent.accepted); if (!intent.accepted) return;
  h = ok(applyEditorHistoryEdit(h, { selectedRef: "node:button-1" }, intent.intent, entry.registry));
  h = ok(act(h, { type: "add-node", nodeRef: "node:new", componentRef: "component:button", parentRef: "node:root", slotRef: "content" }));
  h = move(move(h, "undo"), "undo"); assert.equal(value(h), "  Confirmar ação 🧭  ");
  h = move(h, "undo"); assert.equal(value(h), undefined); assert.equal(h.session.transaction.dirty, false);
  h = move(move(move(h, "redo"), "redo"), "redo");
  const encoded = createCompositionArtifact(h.session.transaction.draft, entry, metadata);
  assert.ok(encoded.accepted); if (!encoded.accepted) return;
  assert.equal(encoded.document.schema.version, "3.0.0");
  const decoded = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry);
  assert.ok(decoded.accepted); if (!decoded.accepted) return;
  const fresh = initializeEditorSession({ sessionRef: "session:fresh-wp7", base: h.session.base, composition: decoded.document.payload.graph }, entry.registry);
  assert.ok(fresh.accepted); if (!fresh.accepted) return;
  assert.equal(value(createEditorHistory(fresh.session)), value(h));
  assert.equal(projectResponsiveComposition(fresh.session.transaction.draft, entry.registry, 600, []).nodes[1]?.text, value(h));
  const saved = acceptEditorDraft(h.session, h.session.draftRevision, entry.registry); assert.ok(saved.accepted);
  if (!saved.accepted) return;
  const changed = ok(text(createEditorHistory(saved.session), "Different"));
  const discarded = discardEditorDraft(changed.session, changed.session.draftRevision, entry.registry); assert.ok(discarded.accepted);
  if (discarded.accepted) assert.equal(value(createEditorHistory(discarded.session)), value(h));
});

test("WP7 reset omits text, chooses legacy schema and undo restores it; no-op preserves redo", () => {
  const { entry, h: initial } = setup();
  const changed = ok(text(initial, "Confirm"));
  const reset = ok(act(changed, { type: "reset-text", nodeRef: "node:button-1" }));
  assert.equal(value(reset), undefined);
  const encoded = createCompositionArtifact(reset.session.transaction.draft, entry, metadata); assert.ok(encoded.accepted);
  if (encoded.accepted) assert.equal(encoded.document.schema.version, "1.0.0");
  const undone = move(reset, "undo"); assert.equal(value(undone), "Confirm");
  assert.strictEqual(ok(text(undone, "Confirm")), undone);
  assert.equal(undone.future.length, 1);
  assert.strictEqual(ok(act(initial, { type: "reset-text", nodeRef: "node:button-1" })), initial);
});

test("WP7 both installed button families accept text; root, container and unknown refs reject atomically", () => {
  const { h } = setup();
  for (const node of ["node:root", "node:missing"]) rejected(text(h, "Title", node), h);
  const container = ok(act(h, { type: "add-node", nodeRef: "node:grid", componentRef: "component:grid", parentRef: "node:root", slotRef: "content" }));
  rejected(text(container, "Not a button", "node:grid"), container);
  const grouped = setup("composition:button-group");
  assert.ok(act(grouped.h, { type: "set-text", nodeRef: "layer:button-1", text: "Group action" }).accepted);
});

test("WP7 exact Unicode limit and inert markup; invalid strings/types preserve prior history", () => {
  const { h } = setup();
  for (const value of ["", "   ", "a\nb", "a\tb", "\u0000", "\u007f", "\ud800", "x".repeat(257), "🧭".repeat(257), null, undefined, 1, {}]) rejected(text(h, value), h);
  for (const value of ["x".repeat(256), "🧭".repeat(256), '<img src=x onerror="alert(1)">']) assert.ok(text(h, value).accepted);
});

test("WP7 stale, foreign identity, unknown/symbol/accessor fields and overflow reject without mutation", () => {
  const { h, entry } = setup();
  const command = { type: "set-text", nodeRef: "node:button-1", text: "Confirm" };
  for (const extra of [{ expectedDraftRevision: 6 }, { sessionRef: "session:foreign" }, { compositionRef: "composition:foreign" }, { extra: true }]) rejected(act(h, { ...command, ...extra }), h);
  rejected(act(h, { ...command, [Symbol("extra")]: true }), h);
  let reads = 0;
  const intent = { sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef, expectedDraftRevision: h.session.draftRevision,
    type: "set-text", nodeRef: "node:button-1", get text() { reads++; return "Hidden"; } } as EditorStructureIntent;
  rejected(applyEditorHistoryStructure(h, intent, entry.registry), h); assert.equal(reads, 0);
  const overflow = createEditorHistory({ ...h.session, draftRevision: Number.MAX_SAFE_INTEGER });
  rejected(text(overflow, "Confirm"), overflow);
});

test("WP7 text is rejected in legacy payloads and malformed v3; tampered snapshots cannot inherit cache proof", () => {
  const { h: initial, entry } = setup();
  const h = ok(text(initial, "Confirm"));
  const encoded = createCompositionArtifact(h.session.transaction.draft, entry, metadata); assert.ok(encoded.accepted);
  if (!encoded.accepted) return;
  for (const version of ["1.0.0", "2.0.0", "3.0.1", "7.0.0"]) assert.equal(encodeCompositionArtifact({ ...encoded.document, schema: { ...encoded.document.schema, version } }, resolveEditorCatalogEntry).accepted, false);
  for (const invalid of ["", "x".repeat(257), 7, null]) {
    const graph: typeof encoded.document.payload.graph = { ...encoded.document.payload.graph, nodes: encoded.document.payload.graph.nodes.map(n => n.ref === "node:button-1" ? { ...n, text: invalid as string } : n) };
    assert.equal(encodeCompositionArtifact({ ...encoded.document, payload: { ...encoded.document.payload, graph } }, resolveEditorCatalogEntry).accepted, false);
    const bad = { ...h, past: [graph] } as unknown as EditorHistory;
    rejected(moveEditorHistory(bad, "undo", h.session.draftRevision, entry.registry), bad);
  }
});

test("WP7 v3 consumer accepts optional text omission while producer keeps minimum version", () => {
  const { entry, h } = setup();
  const produced = createCompositionArtifact(h.session.transaction.draft, entry, metadata); assert.ok(produced.accepted);
  if (!produced.accepted) return;
  assert.equal(produced.document.schema.version, "1.0.0");
  const v3 = encodeCompositionArtifact({ ...produced.document, schema: { ...produced.document.schema, version: "3.0.0" } }, resolveEditorCatalogEntry);
  assert.ok(v3.accepted); if (!v3.accepted) return;
  const read = decodeCompositionArtifact(v3.text, resolveEditorCatalogEntry); assert.ok(read.accepted);
  if (read.accepted) assert.deepEqual(read.document.payload.graph, entry.composition);
});
