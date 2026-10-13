import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { EditorCheckboxPreview } from "../../apps/station/web/app/station-editor-checkbox-preview.js";
import { validCheckboxProperties, type CheckboxProperties } from "../../packages/station-composition/index.js";
import { applyEditorHistoryStructure, createEditorHistory, moveEditorHistory, createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact, type EditorHistory, type EditorStructureIntent } from "../../packages/station-editor/index.js";
function setup() { const r = initializeCatalogEditorSession("composition:example", "session:checkbox"); assert.ok(r.accepted); if (!r.accepted) throw Error(); return { h: createEditorHistory(r.session), entry: r.entry }; }
function act(h: EditorHistory, fields: Record<string, unknown>) { return applyEditorHistoryStructure(h, { sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef, expectedDraftRevision: h.session.draftRevision, ...fields } as EditorStructureIntent, setup().entry.registry); }
function inserted() { const s = setup(); const r = act(s.h, { type: "add-node", nodeRef: "node:checkbox", componentRef: "component:checkbox", parentRef: "node:root", slotRef: "content" }); assert.ok(r.accepted); return { ...s, h: r.history }; }
const properties: CheckboxProperties = { kind: "checkbox", defaultChecked: true, disabled: true };
const metadata = { artifactId: "urn:checkbox:proof", artifactVersion: "1.0.0", provenance: { createdAt: "2026-10-13T00:00:00Z", producer: { id: "station", version: "1.0.0" }, inputs: [] } };
test("Checkbox exact initial presentation, source anatomy and explicit7 roundtrip", () => {
  const s = inserted(); const plain = createCompositionArtifact(s.h.session.transaction.draft, s.entry, metadata); assert.ok(plain.accepted); if (plain.accepted) assert.equal(plain.document.schema.version, "7.0.0");
  const named = act(s.h, { type: "set-text", nodeRef: "node:checkbox", text: "<Remember>" }); assert.ok(named.accepted);
  const r = act(named.history, { type: "set-properties", nodeRef: "node:checkbox", properties }); assert.ok(r.accepted);
  const encoded = createCompositionArtifact(r.history.session.transaction.draft, s.entry, metadata); assert.ok(encoded.accepted); if (!encoded.accepted) return;
  const decoded = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry); assert.ok(decoded.accepted); if (decoded.accepted) assert.deepEqual(decoded.document.payload.graph, r.history.session.transaction.draft);
  for (const version of ["1.0.0", "2.0.0", "3.0.0", "4.0.0", "5.0.0", "6.0.0"]) assert.equal(encodeCompositionArtifact({ ...encoded.document, schema: { ...encoded.document.schema, version } }, resolveEditorCatalogEntry).accepted, false);
  const html = renderToStaticMarkup(createElement(EditorCheckboxPreview, { label: "<Remember>", properties }));
  assert.match(html, /data-slot="checkbox"/); assert.match(html, /data-slot="label"/); assert.match(html, /checked=""/); assert.match(html, /disabled=""/); assert.match(html, /&lt;Remember&gt;/); assert.match(html, /tabindex="-1"/); assert.match(html, /aria-hidden="true"/);
});
test("Checkbox rejects current business state, coercion, getters, cross-component and stale edits atomically", () => {
  const s = inserted(); let reads = 0;
  for (const value of [null, {}, { ...properties, checked: true }, { ...properties, value: "truth" }, { ...properties, defaultChecked: "true" }, { ...properties, disabled: 1 },
    { ...properties, get defaultChecked() { reads++; return true; } }, { ...properties, [Symbol("extra")]: true }, { variant: "outline", disabled: false }]) {
    assert.equal(validCheckboxProperties(value), false); const r = act(s.h, { type: "set-properties", nodeRef: "node:checkbox", properties: value }); assert.equal(r.accepted, false); assert.strictEqual(r.history, s.h);
  }
  assert.equal(reads, 0); assert.equal(act(s.h, { type: "set-properties", nodeRef: "node:button-1", properties }).accepted, false);
  assert.equal(act(s.h, { type: "set-properties", nodeRef: "node:checkbox", properties, expectedDraftRevision: 0 }).accepted, false);
});
test("Checkbox caller copy, no-op, reset, undo/redo and mixed Input/icon predecessor coexist in7", () => {
  const s = inserted(); const caller = { ...properties }; const r = act(s.h, { type: "set-properties", nodeRef: "node:checkbox", properties: caller }); assert.ok(r.accepted); let h = r.history;
  caller.defaultChecked = false; assert.equal(h.session.transaction.draft.nodes.at(-1)!.properties!.kind, "checkbox"); assert.ok(Object.isFrozen(h.session.transaction.draft.nodes.at(-1)!.properties));
  const noOp = act(h, { type: "set-properties", nodeRef: "node:checkbox", properties }); assert.ok(noOp.accepted); assert.strictEqual(noOp.history, h);
  const reset = act(h, { type: "reset-properties", nodeRef: "node:checkbox" }); assert.ok(reset.accepted);
  const undo = moveEditorHistory(reset.history, "undo", reset.history.session.draftRevision, s.entry.registry); assert.ok(undo.accepted); assert.deepEqual(undo.history.session.transaction.draft.nodes.at(-1)!.properties, properties);
  const redo = moveEditorHistory(undo.history, "redo", undo.history.session.draftRevision, s.entry.registry); assert.ok(redo.accepted); assert.equal(redo.history.session.transaction.draft.nodes.at(-1)!.properties, undefined);
  const input = act(h, { type: "add-node", nodeRef: "node:input", componentRef: "component:input", parentRef: "node:root", slotRef: "content" }); assert.ok(input.accepted); h = input.history;
  const icon = act(h, { type: "set-properties", nodeRef: "node:button-1", properties: { variant: "ghost", disabled: false, presentation: { mode: "icon", placement: "end", icon: { catalogVersion: "1.0.0", assetRef: "glyph:save" } } } }); assert.ok(icon.accepted);
  const encoded = createCompositionArtifact(icon.history.session.transaction.draft, s.entry, metadata); assert.ok(encoded.accepted); if (encoded.accepted) { assert.equal(encoded.document.schema.version, "7.0.0"); assert.ok(decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry).accepted); }
});
