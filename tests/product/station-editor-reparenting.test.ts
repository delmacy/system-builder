import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { projectResponsiveComposition, type CompositionGraph } from "../../packages/station-composition/index.js";
import { applyEditorHistoryStructure, createEditorHistory, moveEditorHistory, projectEditorLayers, projectEditorInspector, projectEditorPreview,
  initializeEditorSession, acceptEditorDraft, discardEditorDraft, saveStoredArtifact, openStoredArtifact,
  type EditorHistory, type EditorHistoryResult, type EditorStructureIntent } from "../../packages/station-editor/index.js";
import { prepareEditorArtifact, readEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
function setup(ref = "composition:example") { const r = initializeCatalogEditorSession(ref, "session:wp10"); assert.ok(r.accepted); if (!r.accepted) throw Error("catalog"); return { entry: r.entry, h: createEditorHistory(r.session) }; }
function act(h: EditorHistory, fields: Record<string, unknown>) { return applyEditorHistoryStructure(h, {
  sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef, expectedDraftRevision: h.session.draftRevision, ...fields,
} as EditorStructureIntent, resolveEditorCatalogEntry(h.session.base.compositionRef)!.registry); }
function ok(r: EditorHistoryResult) { assert.ok(r.accepted); if (!r.accepted) throw Error("history"); return r.history; }
function move(h: EditorHistory, nodeRef: string, parentRef: string, slotRef = "content") { return act(h, { type: "reparent-node", nodeRef, parentRef, slotRef }); }
function reject(r: EditorHistoryResult, h: EditorHistory) { assert.equal(r.accepted, false); assert.strictEqual(r.history, h); }
function nested() { const { entry, h } = setup(); return { entry, h: ok(act(h, { type: "add-node", nodeRef: "node:container", componentRef: "component:grid", parentRef: "node:root", slotRef: "content" })) }; }
const graph = (h: EditorHistory) => h.session.transaction.draft;
const node = (h: EditorHistory, ref: string) => graph(h).nodes.find(n => n.ref === ref)!;
const operation = { artifactId: "urn:uuid:wp10-proof", createdAt: "2026-10-11T11:00:00Z" };
test("WP10 leaf movement preserves identity/presentation/span/order and converges real projections", () => {
  const { h: start, entry } = nested(); let h = ok(act(start, { type: "set-text", nodeRef: "node:button-1", text: "Confirmar" }));
  h = ok(act(h, { type: "set-properties", nodeRef: "node:button-1", properties: { variant: "outline", disabled: true } }));
  const before = node(h, "node:button-1"); const changed = ok(move(h, before.ref, "node:container"));
  assert.deepEqual(graph(changed).nodes.map(n => n.ref), graph(h).nodes.map(n => n.ref));
  assert.deepEqual(node(changed, before.ref), { ...before, placement: { ...before.placement!, parentRef: "node:container" } });
  assert.equal(changed.session.draftRevision, h.session.draftRevision + 1); assert.equal(changed.past.length, h.past.length + 1);
  const selection = { selectedRef: before.ref }; const layers = projectEditorLayers(changed.session); assert.ok(layers.accepted);
  if (layers.accepted) assert.equal(layers.root.children.find(n => n.nodeRef === "node:container")?.children[0]?.nodeRef, before.ref);
  const inspector = projectEditorInspector(changed.session, selection, changed.session.draftRevision); assert.ok(inspector.accepted);
  if (inspector.accepted && inspector.snapshot.kind === "node") assert.equal(inspector.snapshot.placement?.parentRef, "node:container");
  const preview = projectEditorPreview(changed.session, entry.registry, selection); assert.ok(preview.accepted);
  if (preview.accepted) assert.equal(preview.snapshot.nodes.find(n => n.nodeRef === before.ref)?.parentRef, "node:container");
  assert.equal(projectResponsiveComposition(graph(changed), entry.registry, 390, []).nodes.find(n => n.ref === before.ref)?.placement?.parentRef, "node:container");
  assert.equal(node(h, before.ref).placement?.parentRef, "node:root"); assert.ok(Object.isFrozen(node(changed, before.ref).properties));
});
test("WP10 container movement carries unchanged descendants and undo/redo restores exact topology", () => {
  const { h: original, entry } = setup("composition:action-panel"); const added = ok(act(original, { type: "add-node", nodeRef: "panel:other", componentRef: "component:action-panel", parentRef: "panel:root", slotRef: "content" }));
  const changed = ok(move(added, "panel:actions", "panel:other"));
  for (const ref of ["panel:primary", "panel:secondary"]) assert.deepEqual(node(changed, ref), node(added, ref));
  assert.equal(node(changed, "panel:actions").placement?.parentRef, "panel:other");
  const undone = ok(moveEditorHistory(changed, "undo", changed.session.draftRevision, entry.registry)); assert.deepEqual(graph(undone), graph(added));
  const redone = ok(moveEditorHistory(undone, "redo", undone.session.draftRevision, entry.registry)); assert.deepEqual(graph(redone), graph(changed));
  assert.equal(graph(redone).nodes.length, 6);
});
test("WP10 no-op keeps redo/revision/order; changed branching and checkpoint/discard retain lifecycle", () => {
  const { h, entry } = nested(); const changed = ok(move(h, "node:button-1", "node:container"));
  const undone = ok(moveEditorHistory(changed, "undo", changed.session.draftRevision, entry.registry));
  assert.strictEqual(ok(move(undone, "node:button-1", "node:root")), undone); assert.equal(undone.future.length, 1);
  reject(move(undone, "node:button-1", "node:button-2"), undone); assert.equal(undone.future.length, 1);
  const branch = ok(move(undone, "node:button-2", "node:container")); assert.equal(branch.future.length, 0);
  const accepted = acceptEditorDraft(branch.session, branch.session.draftRevision, entry.registry); assert.ok(accepted.accepted); if (!accepted.accepted) return;
  const checkpoint = createEditorHistory(accepted.session); assert.equal(checkpoint.past.length, 0);
  const back = ok(move(checkpoint, "node:button-2", "node:root"));
  const discarded = discardEditorDraft(back.session, back.session.draftRevision, entry.registry); assert.ok(discarded.accepted);
  if (discarded.accepted) assert.deepEqual(discarded.session.transaction.draft, graph(branch));
});
test("WP10 root/self/descendant/atomic/unknown/typed incompatible/occupied targets reject atomically", () => {
  const { h } = nested(); const before = JSON.stringify(h);
  for (const [ref, parent, slot] of [["node:root", "node:container", "content"], ["node:container", "node:container", "content"],
    ["node:button-1", "node:button-2", "content"], ["node:button-1", "node:unknown", "content"],
    ["node:unknown", "node:root", "content"], ["node:button-1", "node:container", "missing"]] as const) reject(move(h, ref, parent, slot), h);
  const descendant = ok(act(h, { type: "add-node", nodeRef: "node:descendant", componentRef: "component:grid", parentRef: "node:container", slotRef: "content" }));
  reject(move(descendant, "node:container", "node:descendant"), descendant);
  const below = ok(move(h, "node:button-1", "node:container")); reject(move(below, "node:container", "node:button-1"), below);
  const { h: panel } = setup("composition:action-panel"); reject(move(panel, "panel:container", "panel:actions", "actions"), panel);
  reject(move(panel, "panel:actions", "panel:primary", "content"), panel);
  const group = setup("composition:button-group").h; reject(move(group, "layer:button-1", "layer:button-group", "button-2"), group);
  const removed = ok(act(group, { type: "remove-subtree", nodeRef: "layer:button-2" }));
  assert.ok(move(removed, "layer:button-1", "layer:button-group", "button-2").accepted);
  assert.equal(JSON.stringify(h), before);
});
test("WP10 strict stale/foreign/hostile/extra movement intents and overflow preserve state", () => {
  const { h } = nested(); const fields = { type: "reparent-node", nodeRef: "node:button-1", parentRef: "node:container", slotRef: "content" };
  for (const extra of [{ expectedDraftRevision: 7 }, { sessionRef: "session:foreign" }, { compositionRef: "composition:foreign" }, { extra: true }, { slotRef: null }, { parentRef: 7 }]) reject(act(h, { ...fields, ...extra }), h);
  let reads = 0;
  // Preserve the getter at the API boundary.
  const raw = { ...fields, sessionRef: h.session.sessionRef, compositionRef: h.session.base.compositionRef, expectedDraftRevision: h.session.draftRevision };
  Object.defineProperty(raw, "parentRef", { get() { reads++; return "node:container"; }, enumerable: true });
  reject(applyEditorHistoryStructure(h, raw as unknown as EditorStructureIntent, setup().entry.registry), h);
  assert.equal(reads, 0); // Owning API reads no accessor.
  const overflow = createEditorHistory({ ...h.session, draftRevision: Number.MAX_SAFE_INTEGER }); reject(move(overflow, "node:button-1", "node:container"), overflow);
});
test("WP10 actual codec/local/file reopening preserves moved graph; legacy and corrupt data reject safely", async () => {
  const { h, entry } = nested(); const changed = ok(move(h, "node:button-1", "node:container"));
  const prepared = prepareEditorArtifact(entry.compositionRef, graph(changed), null, operation); assert.ok(prepared.accepted); if (!prepared.accepted) return;
  assert.equal(prepared.document.schema.version, "2.0.0");
  const result = await readEditorArtifact({ size: prepared.text.length, text: async () => prepared.text }); assert.ok(result.accepted);
  const values = new Map<string, string>(); const store = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, text: string) => { values.set(key, text); } };
  assert.ok(saveStoredArtifact(store, prepared.document, null, resolveEditorCatalogEntry).accepted);
  const opened = openStoredArtifact(store, entry.compositionRef, resolveEditorCatalogEntry); assert.ok(opened.accepted); if (!opened.accepted) return;
  const fresh = initializeEditorSession({ sessionRef: "session:wp10-reopened", base: h.session.base, composition: opened.document.payload.graph }, entry.registry);
  assert.ok(fresh.accepted); if (fresh.accepted) assert.deepEqual(fresh.session.transaction.draft, graph(changed));
  for (const invalid of [{ ...prepared.document, schema: { ...prepared.document.schema, version: "1.0.0" } },
    { ...prepared.document, payload: { ...prepared.document.payload, graph: { ...graph(changed), nodes: graph(changed).nodes.map(n => n.ref === "node:container" ? { ...n, placement: { ...n.placement!, parentRef: "node:button-1" } } : n) } } }]) {
    const text: string = JSON.stringify(invalid); assert.equal((await readEditorArtifact({ size: text.length, text: async () => text })).accepted, false);
  }
  assert.equal(node(changed, "node:button-1").placement?.parentRef, "node:container");
});
test("WP10 deep graph movement preserves existing admission and descendant cycles reject without loss", () => {
  const { entry, h } = setup(); const nodes = [...entry.composition.nodes];
  for (let i = 1; i <= 31; i++) nodes.push({ ref: `deep:${i}`, componentRef: "component:grid", placement: { parentRef: i === 1 ? "node:root" : `deep:${i - 1}`, slotRef: "content", columnSpan: 2, rowSpan: 1 } });
  nodes.push({ ref: "moving:grid", componentRef: "component:grid", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
    { ref: "moving:child", componentRef: "component:button", placement: { parentRef: "moving:grid", slotRef: "content", columnSpan: 2, rowSpan: 1 } });
  const composition: CompositionGraph = { rootRef: "node:root", nodes };
  const initialized = initializeEditorSession({ sessionRef: h.session.sessionRef, base: h.session.base, composition }, entry.registry); assert.ok(initialized.accepted); if (!initialized.accepted) return;
  const deep = createEditorHistory(initialized.session); assert.ok(move(deep, "moving:grid", "deep:30").accepted);
  const deeper = ok(move(deep, "moving:grid", "deep:31"));
  // The inherited depth32 limit is JSON nesting, not flat-graph ancestry.
  assert.equal(node(deeper, "moving:child").placement?.parentRef, "moving:grid");
  reject(move(deeper, "deep:1", "moving:grid"), deeper); assert.equal(graph(deep).nodes.length, nodes.length);
});
