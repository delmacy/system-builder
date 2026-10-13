import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, listEditorCatalog, resolveEditorCatalogEntry, validateEditorCatalogDefinition } from "../../apps/station/web/app/station-editor-catalog.js";
import { validateCompositionGraph, projectResponsiveComposition } from "../../packages/station-composition/index.js";
import { createEditorHistory, applyEditorHistoryStructure, moveEditorHistory, projectEditorLayers, projectEditorInspector,
  projectEditorPreview, initializeEditorSession, saveStoredArtifact, openStoredArtifact,
  type EditorHistory, type EditorHistoryResult, type EditorStructureIntent } from "../../packages/station-editor/index.js";
import { prepareEditorArtifact, readEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
const ref = "composition:action-panel";
function setup(sessionRef = "session:wp9") { const r = initializeCatalogEditorSession(ref, sessionRef); assert.ok(r.accepted); if (!r.accepted) throw Error("catalog"); return { entry: r.entry, h: createEditorHistory(r.session) }; }
function ok(r: EditorHistoryResult) { assert.ok(r.accepted); if (!r.accepted) throw Error("history"); return r.history; }
function act(h: EditorHistory, fields: Record<string, unknown>) { return applyEditorHistoryStructure(h, { sessionRef: h.session.sessionRef,
  compositionRef: ref, expectedDraftRevision: h.session.draftRevision, ...fields } as EditorStructureIntent, setup().entry.registry); }
const operation = { artifactId: "urn:uuid:wp9-proof", createdAt: "2026-10-11T10:00:00Z" };
test("WP9 real nested installation converges owning projections and responsive layout", () => {
  const { h, entry } = setup(); assert.deepEqual(validateCompositionGraph(entry.composition, entry.registry), []);
  const layers = projectEditorLayers(h.session); assert.ok(layers.accepted); if (!layers.accepted) return;
  assert.equal(layers.root.children[0]!.nodeRef, "panel:container");
  assert.equal(layers.root.children[0]!.children[0]!.children[0]!.nodeRef, "panel:primary");
  const changed = ok(act(h, { type: "set-properties", nodeRef: "panel:primary", properties: { variant: "outline", disabled: true } }));
  const selection = { selectedRef: "panel:primary" }; const inspector = projectEditorInspector(changed.session, selection, changed.session.draftRevision);
  assert.ok(inspector.accepted); if (inspector.accepted && inspector.snapshot.kind === "node") assert.equal((inspector.snapshot.properties && "variant" in inspector.snapshot.properties ? inspector.snapshot.properties.variant : undefined), "outline");
  const preview = projectEditorPreview(changed.session, entry.registry, selection); assert.ok(preview.accepted);
  if (preview.accepted) assert.equal(preview.snapshot.nodes.find(n => n.nodeRef === selection.selectedRef)?.properties?.disabled, true);
  assert.equal((projectResponsiveComposition(changed.session.transaction.draft, entry.registry, 390, []).nodes.find(n => n.ref === "panel:primary")?.properties as { variant?: string } | undefined)?.variant, "outline");
});
test("WP9 typed panel and row reject incompatible installed families/layouts/slots and unknown refs atomically", () => {
  const { h } = setup(); const before = JSON.stringify(h);
  for (const [componentRef, parentRef, slotRef] of [["component:action-panel", "panel:actions", "actions"],
    ["component:grid", "panel:container", "content"], ["component:action-panel", "panel:container", "content"],
    ["component:button", "panel:actions", "content"], ["component:unknown", "panel:actions", "actions"],
    ["component:button", "panel:missing", "actions"]]) {
    const r = act(h, { type: "add-node", nodeRef: "node:negative", componentRef, parentRef, slotRef });
    assert.equal(r.accepted, false); assert.strictEqual(r.history, h); assert.equal(JSON.stringify(h), before);
  }
  for (const [componentRef, parentRef, slotRef] of [["component:button", "panel:actions", "actions"],
    ["component:action-row", "panel:container", "content"], ["component:action-panel", "panel:root", "content"]])
    assert.ok(act(h, { type: "add-node", nodeRef: "node:positive", componentRef, parentRef, slotRef }).accepted);
  assert.equal(resolveEditorCatalogEntry("composition:action-panel/unknown"), null);
});
test("WP9 independent installations and immutable sources isolate mixed history edits", () => {
  const { h, entry } = setup(); const other = setup("session:independent"); const source = JSON.stringify(entry.composition);
  let changed = ok(act(h, { type: "set-text", nodeRef: "panel:primary", text: "Confirmar" }));
  changed = ok(act(changed, { type: "set-properties", nodeRef: "panel:primary", properties: { variant: "ghost", disabled: false } }));
  changed = ok(act(changed, { type: "remove-subtree", nodeRef: "panel:container" })); assert.equal(changed.session.transaction.draft.nodes.length, 1);
  changed = ok(moveEditorHistory(changed, "undo", changed.session.draftRevision, entry.registry));
  assert.equal(changed.session.transaction.draft.nodes.find(n => n.ref === "panel:primary")?.text, "Confirmar");
  assert.deepEqual(other.h.session.transaction.draft, entry.composition); assert.equal(JSON.stringify(entry.composition), source);
  assert.ok(Object.isFrozen(entry.composition.nodes[1]!.placement));
});
test("WP9 actual file/local codec roundtrip preserves identity/nested edits in fresh session", async () => {
  const { h, entry } = setup(); const edited = ok(act(h, { type: "set-text", nodeRef: "panel:secondary", text: "Voltar" }));
  const prepared = prepareEditorArtifact(ref, edited.session.transaction.draft, null, operation); assert.ok(prepared.accepted); if (!prepared.accepted) return;
  assert.equal(prepared.document.schema.version, "3.0.0");
  const read = await readEditorArtifact({ size: new TextEncoder().encode(prepared.text).length, text: async () => prepared.text }); assert.ok(read.accepted);
  const values = new Map<string, string>(); const store = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  assert.ok(saveStoredArtifact(store, prepared.document, null, resolveEditorCatalogEntry).accepted);
  const opened = openStoredArtifact(store, ref, resolveEditorCatalogEntry); assert.ok(opened.accepted); if (!opened.accepted) return;
  assert.equal(opened.document.artifactId, prepared.document.artifactId); assert.deepEqual(opened.document.payload.graph, edited.session.transaction.draft);
  const fresh = initializeEditorSession({ sessionRef: "session:reopened", base: h.session.base, composition: opened.document.payload.graph }, entry.registry);
  assert.ok(fresh.accepted); if (fresh.accepted) assert.equal(fresh.session.transaction.draft.nodes.find(n => n.ref === "panel:secondary")?.text, "Voltar");
});
test("WP9 malformed source/imported nested slots reject without replacing installed truth", async () => {
  const { h, entry } = setup(); const before = JSON.stringify(entry.composition);
  const prepared = prepareEditorArtifact(ref, h.session.transaction.draft, null, operation); assert.ok(prepared.accepted); if (!prepared.accepted) return;
  for (const replacement of [{ componentRef: "component:unknown" }, { placement: { parentRef: "panel:actions", slotRef: "missing", columnSpan: 2, rowSpan: 1 } },
    { placement: { parentRef: "panel:primary", slotRef: "content", columnSpan: 2, rowSpan: 1 } }]) {
    const graph = { ...entry.composition, nodes: entry.composition.nodes.map(n => n.ref === "panel:primary" ? { ...n, ...replacement } : n) };
    assert.equal(validateEditorCatalogDefinition({ ...entry, composition: graph }), false);
    const text: string = JSON.stringify({ ...prepared.document, payload: { ...prepared.document.payload, graph } });
    assert.equal((await readEditorArtifact({ size: text.length, text: async () => text })).accepted, false);
  }
  assert.equal(JSON.stringify(entry.composition), before); assert.deepEqual(setup().h.session.transaction.draft, entry.composition);
});


test("WP9 installed navigation filters literal title/ref without changing catalog truth", () => {
  const before = listEditorCatalog();
  assert.deepEqual(listEditorCatalog("  ACTION PANEL ").map(n => n.compositionRef), [ref]);
  assert.deepEqual(listEditorCatalog("COMPOSITION:ACTION-PANEL").map(n => n.compositionRef), [ref]);
  for (const query of ["not-installed", "../", "<script>"]) assert.deepEqual(listEditorCatalog(query), []);
  assert.deepEqual(listEditorCatalog(), before); assert.ok(Object.isFrozen(listEditorCatalog("panel")));
});
