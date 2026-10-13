import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { ComponentRegistry, normalizeComponentDescriptor, validInputProperties, type InputProperties } from "../../packages/station-composition/index.js";
import { applyEditorStructure, createEditorHistory, applyEditorHistoryStructure, moveEditorHistory,
  createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact, projectEditorInspector,
  type EditorSession, type EditorStructureIntent } from "../../packages/station-editor/index.js";
function setup() {
  const r = initializeCatalogEditorSession("composition:example", "session:input"); assert.ok(r.accepted); if (!r.accepted) throw Error();
  const descriptor = normalizeComponentDescriptor({ id: "component:input", family: "atomic", layout: "none", childPolicy: "none", slots: [],
    constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 4, minRows: 1, maxRows: 2, recommendedRows: 1 } });
  const registry = new ComponentRegistry([...r.entry.registry.list().filter(item => item.id !== descriptor.id), descriptor]);
  const source = { ...r.entry, registry }; return { session: r.session, registry, source };
}
const metadata = { artifactId: "urn:input:proof", artifactVersion: "1.0.0", provenance: { createdAt: "2026-10-12T00:00:00Z", producer: { id: "station", version: "1.0.0" }, inputs: [] } };
const properties: InputProperties = { kind: "input", inputType: "email", placeholder: "name@example.test", disabled: false, readOnly: true };
function edit(session: EditorSession, data: Record<string, unknown>) {
  const r = applyEditorStructure(session, { sessionRef: session.sessionRef, compositionRef: session.base.compositionRef,
    expectedDraftRevision: session.draftRevision, ...data } as EditorStructureIntent, setup().registry);
  assert.ok(r.accepted); if (!r.accepted) throw Error(); return r.session;
}
function insert() { const s = setup(); return { ...s, session: edit(s.session, { type: "add-node", nodeRef: "node:input", componentRef: "component:input", parentRef: "node:root", slotRef: "content" }) }; }
test("Input default and typed label/properties use explicit6 and roundtrip without business values", () => {
  const s = insert(); const plain = createCompositionArtifact(s.session.transaction.draft, s.source, metadata); assert.ok(plain.accepted); if (!plain.accepted) return;
  assert.equal(plain.document.schema.version, "6.0.0");
  const named = edit(s.session, { type: "set-text", nodeRef: "node:input", text: "Email <work>" });
  const authored = edit(named, { type: "set-properties", nodeRef: "node:input", properties });
  const encoded = createCompositionArtifact(authored.transaction.draft, s.source, metadata); assert.ok(encoded.accepted); if (!encoded.accepted) return;
  const resolve = () => s.source; const reopened = decodeCompositionArtifact(encoded.text, resolve); assert.ok(reopened.accepted);
  if (reopened.accepted) assert.deepEqual(reopened.document.payload.graph, authored.transaction.draft);
  for (const version of ["1.0.0", "2.0.0", "3.0.0", "4.0.0", "5.0.0"])
    assert.equal(encodeCompositionArtifact({ ...encoded.document, schema: { ...encoded.document.schema, version } }, resolve).accepted, false);
  const inspector = projectEditorInspector(authored, { selectedRef: "node:input" }, authored.draftRevision);
  assert.ok(inspector.accepted); if (inspector.accepted && inspector.snapshot.kind === "node") assert.deepEqual(inspector.snapshot.properties, properties);
  assert.ok(Object.isFrozen(authored.transaction.draft.nodes.at(-1)!.properties));
});
test("Input shape, Unicode boundaries, cross-component and getters reject atomically", () => {
  const s = insert(); let reads = 0;
  const getter = { ...properties, get placeholder() { reads++; return "bad"; } };
  for (const p of [null, {}, getter, { ...properties, value: "domain truth" }, { ...properties, inputType: "file" },
    { ...properties, disabled: "false" }, { ...properties, placeholder: "x".repeat(257) }, { ...properties, placeholder: "\ud800" },
    { ...properties, placeholder: "a\nb" }, { ...properties, [Symbol("extra")]: true }, { variant: "outline", disabled: false }]) {
    const r = applyEditorStructure(s.session, { type: "set-properties", nodeRef: "node:input", properties: p as InputProperties,
      sessionRef: s.session.sessionRef, compositionRef: s.session.base.compositionRef, expectedDraftRevision: s.session.draftRevision }, s.registry);
    assert.equal(r.accepted, false); assert.strictEqual(r.session, s.session);
  }
  assert.equal(reads, 0); assert.ok(validInputProperties({ ...properties, placeholder: "😀".repeat(256) }));
  const wrong = applyEditorStructure(s.session, { type: "set-properties", nodeRef: "node:button-1", properties,
    sessionRef: s.session.sessionRef, compositionRef: s.session.base.compositionRef, expectedDraftRevision: s.session.draftRevision }, s.registry);
  assert.equal(wrong.accepted, false);
});
test("Input edits, no-op, reset and undo/redo retain one history and immutable caller data", () => {
  const s = insert(); const caller = { ...properties }; let h = createEditorHistory(s.session);
  const apply = (type: "set-properties" | "reset-properties") => applyEditorHistoryStructure(h, { type, nodeRef: "node:input",
    ...(type === "set-properties" ? { properties: caller } : {}), sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef,
    expectedDraftRevision: h.session.draftRevision } as EditorStructureIntent, s.registry);
  const r = apply("set-properties"); assert.ok(r.accepted); h = r.history;
  const noOp = apply("set-properties"); assert.ok(noOp.accepted); assert.strictEqual(noOp.history, h);
  caller.placeholder = "changed caller"; assert.equal(h.session.transaction.draft.nodes.at(-1)!.properties!.placeholder, properties.placeholder);
  const reset = apply("reset-properties"); assert.ok(reset.accepted); h = reset.history;
  assert.equal(h.session.transaction.draft.nodes.at(-1)!.properties, undefined);
  const undo = moveEditorHistory(h, "undo", h.session.draftRevision, s.registry); assert.ok(undo.accepted);
  assert.deepEqual(undo.history.session.transaction.draft.nodes.at(-1)!.properties, properties);
  const redo = moveEditorHistory(undo.history, "redo", undo.history.session.draftRevision, s.registry); assert.ok(redo.accepted);
  assert.equal(redo.history.session.transaction.draft.nodes.at(-1)!.properties, undefined);
});
