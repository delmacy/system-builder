import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { projectResponsiveComposition, validButtonProperties, validateCompositionGraph, type ButtonProperties } from "../../packages/station-composition/index.js";
import { applyEditorHistoryStructure, applyEditorHistoryEdit, createEditorHistory, moveEditorHistory,
  projectEditorLayers, projectEditorInspector, projectEditorPreview, createEditorSetSpanIntent,
  createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact, initializeEditorSession,
  acceptEditorDraft, discardEditorDraft, type EditorHistory, type EditorHistoryResult, type EditorStructureIntent } from "../../packages/station-editor/index.js";
const metadata = { artifactId: "urn:uuid:wp8", artifactVersion: "1.0.0", provenance: {
  createdAt: "2026-10-11T00:00:00Z", producer: { id: "urn:system-builder:wp8", version: "1.0.0" }, inputs: [] } };
function setup(ref = "composition:example") {
  const r = initializeCatalogEditorSession(ref, "session:wp8"); if (!r.accepted) throw Error("catalog");
  return { entry: r.entry, h: createEditorHistory(r.session) };
}
function ok(r: EditorHistoryResult) { assert.ok(r.accepted); if (!r.accepted) throw Error("rejected"); return r.history; }
function act(h: EditorHistory, fields: Record<string, unknown>) {
  return applyEditorHistoryStructure(h, { sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef,
    expectedDraftRevision: h.session.draftRevision, ...fields } as EditorStructureIntent,
  resolveEditorCatalogEntry(h.session.base.compositionRef)!.registry);
}
const set = (h: EditorHistory, properties: unknown, nodeRef = "node:button-1") => act(h, { type: "set-properties", nodeRef, properties });
const value = (h: EditorHistory) => h.session.transaction.draft.nodes.find(n => n.ref === "node:button-1")?.properties;
const move = (h: EditorHistory, direction: "undo" | "redo") => ok(moveEditorHistory(h, direction, h.session.draftRevision, setup().entry.registry));
function reject(r: EditorHistoryResult, h: EditorHistory) { assert.equal(r.accepted, false); assert.strictEqual(r.history, h); }

test("WP8 typed properties converge actual projections and responsive portable fresh-session roundtrip", () => {
  const { h: initial, entry } = setup(); const props: ButtonProperties = { variant: "outline", disabled: true };
  const h = ok(set(initial, props)); const selection = { selectedRef: "node:button-1" };
  const layers = projectEditorLayers(h.session); assert.ok(layers.accepted);
  if (layers.accepted) assert.deepEqual(layers.root.children[0]!.properties, props);
  const inspector = projectEditorInspector(h.session, selection, h.session.draftRevision); assert.ok(inspector.accepted);
  if (inspector.accepted && inspector.snapshot.kind === "node") assert.deepEqual(inspector.snapshot.properties, props);
  const preview = projectEditorPreview(h.session, entry.registry, selection); assert.ok(preview.accepted);
  if (preview.accepted) assert.deepEqual(preview.snapshot.nodes[1]!.properties, props);
  assert.deepEqual(projectResponsiveComposition(h.session.transaction.draft, entry.registry, 600, []).nodes[1]!.properties, props);
  const encoded = createCompositionArtifact(h.session.transaction.draft, entry, metadata); assert.ok(encoded.accepted); if (!encoded.accepted) return;
  assert.equal(encoded.document.schema.version, "4.0.0");
  const decoded = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry); assert.ok(decoded.accepted); if (!decoded.accepted) return;
  const fresh = initializeEditorSession({ sessionRef: "session:wp8-fresh", base: h.session.base, composition: decoded.document.payload.graph }, entry.registry);
  assert.ok(fresh.accepted); if (fresh.accepted) assert.deepEqual(value(createEditorHistory(fresh.session)), props);
});

test("WP8 properties/text/span/structure share history and removal undo restores properties", () => {
  const { h: initial, entry } = setup(); let h = ok(set(initial, { variant: "ghost", disabled: false }));
  h = ok(act(h, { type: "set-text", nodeRef: "node:button-1", text: "Confirmar" }));
  const selection = { selectedRef: "node:button-1" };
  const proposal = createEditorSetSpanIntent(h.session, selection, h.session.draftRevision, { columnSpan: 3, rowSpan: 1 });
  assert.ok(proposal.accepted); if (!proposal.accepted) return;
  h = ok(applyEditorHistoryEdit(h, selection, proposal.intent, entry.registry));
  h = ok(act(h, { type: "remove-subtree", nodeRef: "node:button-1" })); assert.equal(value(h), undefined);
  h = move(h, "undo"); assert.deepEqual(value(h), { variant: "ghost", disabled: false });
  assert.equal(h.session.transaction.draft.nodes[1]!.text, "Confirmar");
  h = move(move(move(h, "undo"), "undo"), "undo"); assert.equal(value(h), undefined); assert.equal(h.session.transaction.dirty, false);
  h = move(h, "redo"); assert.equal(((value(h) as ButtonProperties | undefined)?.variant), "ghost");
});

test("WP8 identical application preserves redo; reset omits only properties and selects minimal schema", () => {
  const { h: initial, entry } = setup(); const changed = ok(set(initial, { variant: "outline", disabled: false }));
  const reset = ok(act(changed, { type: "reset-properties", nodeRef: "node:button-1" })); assert.equal(value(reset), undefined);
  const undone = move(reset, "undo"); assert.strictEqual(ok(set(undone, { variant: "outline", disabled: false })), undone);
  assert.equal(undone.future.length, 1); assert.strictEqual(ok(act(initial, { type: "reset-properties", nodeRef: "node:button-1" })), initial);
  const encoded = createCompositionArtifact(reset.session.transaction.draft, entry, metadata); assert.ok(encoded.accepted);
  if (encoded.accepted) assert.equal(encoded.document.schema.version, "1.0.0");
  const text = ok(act(changed, { type: "set-text", nodeRef: "node:button-1", text: "Label" }));
  const cleared = ok(act(text, { type: "reset-properties", nodeRef: "node:button-1" }));
  const e = createCompositionArtifact(cleared.session.transaction.draft, entry, metadata); assert.ok(e.accepted);
  if (e.accepted) assert.equal(e.document.schema.version, "3.0.0"); assert.equal(cleared.session.transaction.draft.nodes[1]!.text, "Label");
});

test("WP8 strict enum/boolean/shape rejects coercion and nested hostile fields without reading accessors", () => {
  const { h } = setup(); let reads = 0;
  const accessor = { get variant() { reads++; return "outline"; }, disabled: false };
  const hidden = Object.defineProperty({ disabled: false }, "variant", { value: "outline" });
  for (const props of [null, undefined, [], {}, { variant: "outline" }, { variant: "OUTLINE", disabled: false },
    { variant: "outline", disabled: "false" }, { variant: "outline", disabled: 0 }, { variant: "outline", disabled: null },
    { variant: "outline", disabled: false, action: "execute" }, { variant: "outline", disabled: false, [Symbol("extra")]: 1 },
    accessor, hidden, Object.create({ variant: "outline", disabled: false })]) {
    assert.equal(validButtonProperties(props), false); reject(set(h, props), h);
  }
  assert.equal(reads, 0);
  for (const variant of ["default", "outline", "ghost"]) for (const disabled of [true, false]) assert.ok(set(h, { variant, disabled }).accepted);
});

test("WP8 root/container/unknown/stale/foreign/extra commands reject atomically; both installed families work", () => {
  const { h } = setup(); const props = { variant: "outline", disabled: true };
  for (const ref of ["node:root", "node:missing"]) reject(set(h, props, ref), h);
  const grid = ok(act(h, { type: "add-node", nodeRef: "node:grid", componentRef: "component:grid", parentRef: "node:root", slotRef: "content" }));
  reject(set(grid, props, "node:grid"), grid);
  for (const extra of [{ expectedDraftRevision: 6 }, { sessionRef: "session:foreign" }, { compositionRef: "composition:foreign" }, { extra: true }])
    reject(act(h, { type: "set-properties", nodeRef: "node:button-1", properties: props, ...extra }), h);
  const group = setup("composition:button-group"); assert.ok(set(group.h, props, "layer:button-1").accepted);
  const overflow = createEditorHistory({ ...h.session, draftRevision: Number.MAX_SAFE_INTEGER }); reject(set(overflow, props), overflow);
});

test("WP8 owned nested snapshots isolate caller mutation and remain deeply frozen through history", () => {
  const { h } = setup(); const caller = { variant: "outline" as const, disabled: false }; const changed = ok(set(h, caller));
  assert.equal(Object.isFrozen(caller), false); caller.disabled = true;
  assert.equal(value(changed)!.disabled, false); assert.ok(Object.isFrozen(value(changed)));
  const next = ok(set(changed, { variant: "ghost", disabled: true })); const undone = move(next, "undo");
  assert.deepEqual(value(undone), { variant: "outline", disabled: false }); assert.ok(Object.isFrozen(value(undone)));
});

test("WP8 v4 accepts omission; older/unknown schemas and malformed imported properties reject", () => {
  const { h, entry } = setup(); const changed = ok(set(h, { variant: "outline", disabled: true }));
  const encoded = createCompositionArtifact(changed.session.transaction.draft, entry, metadata); assert.ok(encoded.accepted); if (!encoded.accepted) return;
  for (const version of ["1.0.0", "2.0.0", "3.0.0", "4.0.1", "5.0.0"]) assert.equal(encodeCompositionArtifact({ ...encoded.document, schema: { ...encoded.document.schema, version } }, resolveEditorCatalogEntry).accepted, false);
  for (const properties of [{ variant: "bad", disabled: false }, null, { variant: "outline", disabled: "true" }]) {
    const graph: unknown = { ...encoded.document.payload.graph, nodes: encoded.document.payload.graph.nodes.map(n => n.ref === "node:button-1" ? { ...n, properties } : n) };
    assert.equal(encodeCompositionArtifact({ ...encoded.document, payload: { ...encoded.document.payload, graph } }, resolveEditorCatalogEntry).accepted, false);
    assert.ok(validateCompositionGraph(graph as typeof entry.composition, entry.registry).length > 0);
  }
  const plain = createCompositionArtifact(h.session.transaction.draft, entry, metadata); assert.ok(plain.accepted); if (!plain.accepted) return;
  assert.ok(encodeCompositionArtifact({ ...plain.document, schema: { ...plain.document.schema, version: "4.0.0" } }, resolveEditorCatalogEntry).accepted);
});

test("WP8 tampered nested history cannot reuse owned validation; checkpoint/discard restore baseline", () => {
  const { h, entry } = setup(); const changed = ok(set(h, { variant: "outline", disabled: true }));
  const badGraph = { ...changed.session.transaction.draft, nodes: changed.session.transaction.draft.nodes.map(n => n.ref === "node:button-1" ? { ...n, properties: { variant: "unknown", disabled: true } } : n) };
  const forged = { ...changed, past: [badGraph] } as unknown as EditorHistory;
  reject(moveEditorHistory(forged, "undo", forged.session.draftRevision, entry.registry), forged);
  const saved = acceptEditorDraft(changed.session, changed.session.draftRevision, entry.registry); assert.ok(saved.accepted); if (!saved.accepted) return;
  const edited = ok(set(createEditorHistory(saved.session), { variant: "ghost", disabled: false }));
  const discarded = discardEditorDraft(edited.session, edited.session.draftRevision, entry.registry); assert.ok(discarded.accepted);
  if (discarded.accepted) assert.deepEqual(value(createEditorHistory(discarded.session)), { variant: "outline", disabled: true });
});
