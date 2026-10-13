import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { EditorDialogPreview } from "../../apps/station/web/app/station-editor-dialog-preview.js";
import { validDialogProperties, type DialogProperties } from "../../packages/station-composition/index.js";
import { applyEditorHistoryStructure, createEditorHistory, moveEditorHistory, createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact, type EditorHistory, type EditorStructureIntent } from "../../packages/station-editor/index.js";
function setup() { const r = initializeCatalogEditorSession("composition:example", "session:dialog"); assert.ok(r.accepted); if (!r.accepted) throw Error(); return { h: createEditorHistory(r.session), entry: r.entry }; }
function act(h: EditorHistory, fields: Record<string, unknown>) { return applyEditorHistoryStructure(h, { sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef, expectedDraftRevision: h.session.draftRevision, ...fields } as EditorStructureIntent, setup().entry.registry); }
function inserted() { const s = setup(); const r = act(s.h, { type: "add-node", nodeRef: "node:dialog", componentRef: "component:dialog", parentRef: "node:root", slotRef: "content" }); assert.ok(r.accepted); return { ...s, h: r.history }; }
const props: DialogProperties = { kind: "dialog", title: "<Review>", description: "Plain description", disabled: false };
const metadata = { artifactId: "urn:dialog:proof", artifactVersion: "1.0.0", provenance: { createdAt: "2026-10-13T00:00:00Z", producer: { id: "station", version: "1.0.0" }, inputs: [] } };
test("Dialog actual source trigger and content slot roundtrip under explicit8", () => {
  const s = inserted(); const minimal = createCompositionArtifact(s.h.session.transaction.draft, s.entry, metadata); assert.ok(minimal.accepted); if (minimal.accepted) assert.equal(minimal.document.schema.version, "8.0.0");
  const named = act(s.h, { type: "set-text", nodeRef: "node:dialog", text: "<Details>" }); assert.ok(named.accepted);
  const applied = act(named.history, { type: "set-properties", nodeRef: "node:dialog", properties: props }); assert.ok(applied.accepted);
  const child = act(applied.history, { type: "add-node", nodeRef: "node:dialog-button", componentRef: "component:button", parentRef: "node:dialog", slotRef: "content" }); assert.ok(child.accepted);
  const encoded = createCompositionArtifact(child.history.session.transaction.draft, s.entry, metadata); assert.ok(encoded.accepted); if (!encoded.accepted) return;
  const decoded = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry); assert.ok(decoded.accepted); if (decoded.accepted) assert.deepEqual(decoded.document.payload.graph, child.history.session.transaction.draft);
  for (const version of ["1.0.0", "2.0.0", "3.0.0", "4.0.0", "5.0.0", "6.0.0", "7.0.0"]) assert.equal(encodeCompositionArtifact({ ...encoded.document, schema: { ...encoded.document.schema, version } }, resolveEditorCatalogEntry).accepted, false);
  const html = renderToStaticMarkup(createElement(EditorDialogPreview, { label: "<Details>", properties: props }));
  assert.match(html, /data-slot="button"/); assert.match(html, /aria-haspopup="dialog"/); assert.match(html, /aria-expanded="false"/); assert.match(html, /&lt;Details&gt;/); assert.doesNotMatch(html, /<Details>/);
  assert.equal(act(applied.history, { type: "add-node", nodeRef: "node:wrong-slot", componentRef: "component:button", parentRef: "node:dialog", slotRef: "trigger" }).accepted, false);
});
test("Dialog exact ownership/bounds/hostile shapes reject atomically", () => {
  const s = inserted(); const before = JSON.stringify(s.h); let getterCalls = 0;
  const getter = { kind: "dialog", title: "Review", get description() { getterCalls++; return "bad"; }, disabled: false };
  assert.equal(validDialogProperties({ ...props, title: "🐱".repeat(256), description: "🐱".repeat(512) }), true);
  for (const value of [{ ...props, title: "" }, { ...props, title: "a".repeat(257) }, { ...props, description: "a".repeat(513) }, { ...props, description: "\n" }, { ...props, title: "\ud800" }, { ...props, disabled: "false" }, { ...props, open: true }, { ...props, defaultOpen: true }, { ...props, onOpenChange: "run" }, getter, { ...props, [Symbol("extra")]: true }]) {
    assert.equal(validDialogProperties(value), false); const r = act(s.h, { type: "set-properties", nodeRef: "node:dialog", properties: value }); assert.equal(r.accepted, false); assert.equal(JSON.stringify(s.h), before);
  }
  assert.equal(getterCalls, 0);
  assert.equal(act(s.h, { type: "set-properties", nodeRef: "node:button-1", properties: props }).accepted, false);
  assert.equal(act(s.h, { type: "set-properties", nodeRef: "node:dialog", properties: { variant: "ghost", disabled: false } }).accepted, false);
});
test("Dialog immutable/no-op/history/reset and mixed predecessor presentation preserve profiles", () => {
  const s = inserted(); const caller = { ...props }; const r = act(s.h, { type: "set-properties", nodeRef: "node:dialog", properties: caller }); assert.ok(r.accepted); caller.title = "Changed elsewhere";
  assert.equal(r.history.session.transaction.draft.nodes.find(n => n.ref === "node:dialog")?.properties?.kind, "dialog");
  const retained = r.history.session.transaction.draft.nodes.find(n => n.ref === "node:dialog")?.properties;
  assert.ok(validDialogProperties(retained)); if (validDialogProperties(retained)) assert.equal(retained.title, "<Review>");
  const noOp = act(r.history, { type: "set-properties", nodeRef: "node:dialog", properties: { disabled: false, description: "Plain description", title: "<Review>", kind: "dialog" } }); assert.ok(noOp.accepted); assert.equal(noOp.changed, false);
  const undo = moveEditorHistory(r.history, "undo", r.history.session.draftRevision, s.entry.registry); assert.ok(undo.accepted); const redo = moveEditorHistory(undo.history, "redo", undo.history.session.draftRevision, s.entry.registry); assert.ok(redo.accepted); assert.deepEqual(redo.history.session.transaction.draft, r.history.session.transaction.draft);
  const reset = act(redo.history, { type: "reset-properties", nodeRef: "node:dialog" }); assert.ok(reset.accepted); assert.equal(reset.history.session.transaction.draft.nodes.find(n => n.ref === "node:dialog")?.properties, undefined);
  let h = r.history;
  for (const [nodeRef, componentRef, properties] of [["node:input", "component:input", { kind: "input", inputType: "email", placeholder: "mail", readOnly: true, disabled: false }], ["node:check", "component:checkbox", { kind: "checkbox", defaultChecked: true, disabled: false }]] as const) { const add = act(h, { type: "add-node", nodeRef, componentRef, parentRef: "node:dialog", slotRef: "content" }); assert.ok(add.accepted); const apply = act(add.history, { type: "set-properties", nodeRef, properties }); assert.ok(apply.accepted); h = apply.history; }
  const encoded = createCompositionArtifact(h.session.transaction.draft, s.entry, metadata); assert.ok(encoded.accepted); if (encoded.accepted) { assert.equal(encoded.document.schema.version, "8.0.0"); assert.ok(decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry).accepted); }
});
