import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { validButtonProperties, type ButtonProperties } from "../../packages/station-composition/index.js";
import { applyEditorHistoryStructure, createEditorHistory, moveEditorHistory, createCompositionArtifact,
  decodeCompositionArtifact, encodeCompositionArtifact, projectEditorInspector, type EditorHistory } from "../../packages/station-editor/index.js";
function setup() { const r = initializeCatalogEditorSession("composition:example", "session:icons"); assert.ok(r.accepted); if (!r.accepted) throw Error(); return { h: createEditorHistory(r.session), entry: r.entry }; }
const props = (): ButtonProperties => ({ variant: "outline", disabled: false,
  presentation: { mode: "icon", placement: "end", icon: { catalogVersion: "1.0.0", assetRef: "glyph:save" } } });
function set(h: EditorHistory, properties: unknown) { return applyEditorHistoryStructure(h, { type: "set-properties", nodeRef: "node:button-1", properties: properties as ButtonProperties, sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef, expectedDraftRevision: h.session.draftRevision }, setup().entry.registry); }
const value = (h: EditorHistory) => h.session.transaction.draft.nodes[1]!.properties!;
const metadata = { artifactId: "urn:icons:portable", artifactVersion: "1.0.0", provenance: { createdAt: "2026-10-12T00:00:00Z", producer: { id: "station", version: "1.0.0" }, inputs: [] } };
test("portable presentation v5 roundtrip, history, immutable nested reference and no-op", () => {
  const { h, entry } = setup(); const caller = props(); const r = set(h, caller); assert.ok(r.accepted); if (!r.accepted) return;
  assert.deepEqual(value(r.history), caller);
  assert.ok(Object.isFrozen(value(r.history).presentation!.icon));
  (caller.presentation!.icon as { assetRef: string }).assetRef = "glyph:folder";
  assert.equal(value(r.history).presentation!.icon.assetRef, "glyph:save");
  const noOp = set(r.history, props()); assert.ok(noOp.accepted); assert.strictEqual(noOp.history, r.history);
  const undone = moveEditorHistory(r.history, "undo", r.history.session.draftRevision, entry.registry); assert.ok(undone.accepted);
  assert.equal(undone.history.session.transaction.draft.nodes[1]!.properties, undefined);
  const redone = moveEditorHistory(undone.history, "redo", undone.history.session.draftRevision, entry.registry); assert.ok(redone.accepted);
  assert.deepEqual(value(redone.history), props());
  const inspector = projectEditorInspector(r.history.session, { selectedRef: "node:button-1" }, r.history.session.draftRevision);
  assert.ok(inspector.accepted); if (inspector.accepted && inspector.snapshot.kind === "node") assert.ok(Object.isFrozen(inspector.snapshot.properties!.presentation!.icon));
  const encoded = createCompositionArtifact(r.history.session.transaction.draft, entry, metadata); assert.ok(encoded.accepted); if (!encoded.accepted) return;
  assert.equal(encoded.document.schema.version, "5.0.0");
  const reopened = decodeCompositionArtifact(encoded.text, resolveEditorCatalogEntry); assert.ok(reopened.accepted);
  if (reopened.accepted) assert.deepEqual(reopened.document.payload.graph, r.history.session.transaction.draft);
  for (const version of ["1.0.0", "2.0.0", "3.0.0", "4.0.0"]) assert.equal(encodeCompositionArtifact({ ...encoded.document, schema: { ...encoded.document.schema, version } }, resolveEditorCatalogEntry).accepted, false);
});
test("hostile presentation rejects atomically without getters; unavailable references remain portable", () => {
  const { h } = setup(); let reads = 0;
  for (const presentation of [undefined, null, {}, { ...props().presentation, mode: "script" }, { ...props().presentation, placement: "middle" },
    { ...props().presentation, icon: { assetRef: "https://evil", catalogVersion: "1.0.0" } },
    { ...props().presentation, icon: { get assetRef() { reads++; return "glyph:save"; }, catalogVersion: "1.0.0" } },
    { ...props().presentation, [Symbol("extra")]: true }, { ...props().presentation, command: "execute" }]) {
    const candidate = { variant: "default", disabled: false, presentation };
    assert.equal(validButtonProperties(candidate), false); const r = set(h, candidate); assert.equal(r.accepted, false); assert.strictEqual(r.history, h);
  }
  assert.equal(reads, 0);
  for (const icon of [{ assetRef: "glyph:not-installed", catalogVersion: "1.0.0" }, { assetRef: "glyph:save", catalogVersion: "9.0.0" }]) {
    const r = set(h, { ...props(), presentation: { ...props().presentation, icon } }); assert.ok(r.accepted);
    if (r.accepted) assert.deepEqual(value(r.history).presentation!.icon, icon);
  }
});
