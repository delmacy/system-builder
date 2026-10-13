import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { createEditorHistory, applyEditorHistoryStructure, moveEditorHistory,
  createCompositionArtifact, decodeCompositionArtifact, type EditorHistory, type EditorStructureIntent } from "../../packages/station-editor/index.js";

const fields = [
  { id: "ui:color-field", properties: { label: "Accent", value: "#AABBCC", disabled: false } },
  { id: "ui:property-picker", properties: { label: "Theme", value: "day", disabled: false,
    choices: [{ id: "day", label: "Day", disabled: false }, { id: "night", label: "Night", disabled: true }] } },
  { id: "ui:document-text-field", properties: { label: "Notes", value: "A document", rows: 4,
    maxLength: 500, disabled: false, readOnly: false } },
] as const;
function setup() {
  const result = initializeCatalogEditorSession("composition:example", "session:foundation-properties");
  if (!result.accepted) throw Error("missing catalog");
  return { history: createEditorHistory(result.session), entry: result.entry };
}
function act(history: EditorHistory, operation: Record<string, unknown>, registry: ReturnType<typeof setup>["entry"]["registry"]) {
  return applyEditorHistoryStructure(history, {
    sessionRef: history.session.sessionRef, compositionRef: history.session.base.compositionRef,
    expectedDraftRevision: history.session.draftRevision, ...operation,
  } as EditorStructureIntent, registry);
}
test("Construction G canonical Editor history accepts typed fields with undo/redo and portable roundtrip", () => {
  for (const field of fields) {
    const { history, entry } = setup();
    const added = act(history, { type: "add-node", nodeRef: "node:field", componentRef: field.id,
      parentRef: "node:root", slotRef: "content" }, entry.registry);
    assert.ok(added.accepted);
    if (!added.accepted) continue;
    const edited = act(added.history, { type: "set-properties", nodeRef: "node:field", properties: field.properties }, entry.registry);
    assert.ok(edited.accepted);
    if (!edited.accepted) continue;
    const node = () => edited.history.session.transaction.draft.nodes.find(n => n.ref === "node:field");
    assert.deepEqual(node()?.properties, field.properties);
    const repeat = act(edited.history, { type: "set-properties", nodeRef: "node:field",
      properties: { ...field.properties } }, entry.registry);
    assert.ok(repeat.accepted && !repeat.changed);
    const undone = moveEditorHistory(edited.history, "undo", edited.history.session.draftRevision, entry.registry);
    assert.ok(undone.accepted);
    if (undone.accepted) {
      assert.equal(undone.history.session.transaction.draft.nodes.find(n => n.ref === "node:field")?.properties, undefined);
      const redone = moveEditorHistory(undone.history, "redo", undone.history.session.draftRevision, entry.registry);
      assert.ok(redone.accepted);
      if (redone.accepted) assert.deepEqual(redone.history.session.transaction.draft.nodes.find(n => n.ref === "node:field")?.properties, field.properties);
    }
    const metadata = { artifactId: "urn:uuid:construction-g-properties", artifactVersion: "1.0.0",
      provenance: { createdAt: "2026-10-13T00:00:00Z", producer: { id: "urn:system-builder:station", version: "1.0.0" }, inputs: [] } };
    const encoded = createCompositionArtifact(edited.history.session.transaction.draft, entry, metadata);
    assert.ok(encoded.accepted);
    if (encoded.accepted) {
      const decoded = decodeCompositionArtifact(encoded.text, ref => ref === entry.compositionRef ? entry : null);
      assert.ok(decoded.accepted);
      if (decoded.accepted) assert.deepEqual(decoded.document.payload.graph.nodes.find(n => n.ref === "node:field")?.properties, field.properties);
    }
    const invalid = act(edited.history, { type: "set-properties", nodeRef: "node:field",
      properties: { ...field.properties, unexpected: true } }, entry.registry);
    assert.equal(invalid.accepted, false);
    const reset = act(edited.history, { type: "reset-properties", nodeRef: "node:field" }, entry.registry);
    assert.ok(reset.accepted);
    if (reset.accepted) assert.equal(reset.history.session.transaction.draft.nodes.find(n => n.ref === "node:field")?.properties, undefined);
  }
});
