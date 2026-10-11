import assert from "node:assert/strict";
import test from "node:test";
import { ARTIFACT_LIMITS, openStoredArtifact, saveStoredArtifact, compositionArtifactKey,
  initializeEditorSession, applyEditorSessionMutation, type ArtifactStore, type CompositionArtifact } from "../../packages/station-editor/index.js";
import { resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { importCatalogArtifact } from "../../apps/station/web/app/station-editor-artifact.js";
import { prepareEditorArtifact, readEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";

const operation = { artifactId: "urn:uuid:5ba6c0a6-098f-412a-9c9e-35b9393a2da0", createdAt: "2026-10-10T18:00:00Z" };
function artifact(ref = "composition:example"): CompositionArtifact {
  const source = resolveEditorCatalogEntry(ref)!;
  const result = prepareEditorArtifact(ref, source.composition, null, operation);
  assert.ok(result.accepted); if (!result.accepted) throw new Error("rejection"); return result.document;
}
function memory(): { store: ArtifactStore; values: Map<string, string> } {
  const values = new Map<string, string>();
  return { values, store: { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } } };
}
test("real codec -> independent stored artifacts -> reopen fresh session", () => {
  const { store, values } = memory();
  for (const ref of ["composition:example", "composition:button-group"]) {
    const source = resolveEditorCatalogEntry(ref)!;
    const start = initializeEditorSession({ sessionRef: "session:file-source", base: { applicationRef: source.applicationRef,
      compositionRef: ref, revision: source.revision, currentness: "current" }, composition: source.composition }, source.registry);
    assert.ok(start.accepted); if (!start.accepted) throw new Error("rejection");
    const node = start.session.transaction.draft.nodes[1]!;
    const edited = applyEditorSessionMutation(start.session, start.session.draftRevision, { type: "replace-node",
      node: { ...node, placement: { ...node.placement!, columnSpan: 3 } } }, source.registry);
    assert.ok(edited.accepted); if (!edited.accepted) throw new Error("rejection");
    const prepared = prepareEditorArtifact(ref, edited.session.transaction.draft, null, operation);
    assert.ok(prepared.accepted); if (!prepared.accepted) throw new Error("rejection");
    const saved = saveStoredArtifact(store, prepared.document, null, resolveEditorCatalogEntry); assert.ok(saved.accepted);
    const opened = openStoredArtifact(store, ref, resolveEditorCatalogEntry); assert.ok(opened.accepted);
    if (!opened.accepted) throw new Error("rejection");
    const fresh = initializeEditorSession({ sessionRef: "session:file-reopened", base: { applicationRef: source.applicationRef,
      compositionRef: ref, revision: source.revision, currentness: "current" }, composition: opened.document.payload.graph }, source.registry);
    assert.ok(fresh.accepted); if (!fresh.accepted) throw new Error("rejection");
    assert.equal(fresh.session.transaction.draft.nodes[1]!.placement!.columnSpan, 3);
  }
  assert.equal(values.size, 2); assert.ok([...values.keys()].every(key => key.startsWith("station:composition-artifact:v1:")));
  assert.equal(values.has("system-builder.station.layout.v1"), false);
});
test("quota/read denial, conflict and invalid document leave prior retained bytes unchanged", () => {
  const { store, values } = memory(); const doc = artifact();
  const saved = saveStoredArtifact(store, doc, null, resolveEditorCatalogEntry); assert.ok(saved.accepted);
  if (!saved.accepted) throw new Error("rejection");
  const snapshot = [...values]; const original = JSON.stringify(doc);
  const denied: ArtifactStore = { getItem: store.getItem, setItem() { throw new Error("quota"); } };
  assert.deepEqual(saveStoredArtifact(denied, doc, saved.storedText, resolveEditorCatalogEntry), { accepted: false, reason: "storage-unavailable" });
  assert.deepEqual(saveStoredArtifact(store, doc, null, resolveEditorCatalogEntry), { accepted: false, reason: "storage-conflict" });
  const unreadable: ArtifactStore = { getItem() { throw new Error("denied"); }, setItem: store.setItem };
  assert.equal(openStoredArtifact(unreadable, doc.payload.compositionRef, resolveEditorCatalogEntry).accepted, false);
  assert.equal(saveStoredArtifact(store, { ...doc, payload: { ...doc.payload, baseRevision: 6 } }, saved.storedText, resolveEditorCatalogEntry).accepted, false);
  assert.deepEqual([...values], snapshot); assert.equal(JSON.stringify(doc), original);
});
test("corrupt local data and a swapped composition key reject without overwriting", () => {
  const { store, values } = memory(); const key = compositionArtifactKey("composition:example");
  values.set(key, "{corrupted"); assert.deepEqual(openStoredArtifact(store, "composition:example", resolveEditorCatalogEntry),
    { accepted: false, reason: "malformed-json" }); assert.equal(values.get(key), "{corrupted");
  values.set(key, JSON.stringify(artifact("composition:button-group")));
  assert.deepEqual(openStoredArtifact(store, "composition:example", resolveEditorCatalogEntry), { accepted: false, reason: "identity-mismatch" });
  assert.deepEqual(openStoredArtifact(store, "composition:button-group", resolveEditorCatalogEntry), { accepted: false, reason: "not-found" });
});
test("unchanged tuple is retained, changed meaning advances patch/provenance, Save As forks identity", () => {
  const initial = { ...artifact(), extensions: { "com.example.audit": { actor: "qa" } },
    provenance: { ...artifact().provenance, operation: "original" } };
  const graph = initial.payload.graph;
  const same = prepareEditorArtifact("composition:example", graph, initial, operation); assert.ok(same.accepted);
  if (!same.accepted) throw new Error("rejection"); assert.deepEqual(same.document, initial);
  const changedGraph = { ...graph, nodes: graph.nodes.map((node, i) => i === 1 ? { ...node, placement: { ...node.placement!, columnSpan: 4 } } : node) };
  const changed = prepareEditorArtifact("composition:example", changedGraph, initial,
    { ...operation, createdAt: "2026-10-10T18:01:00Z" }); assert.ok(changed.accepted);
  if (!changed.accepted) throw new Error("rejection");
  assert.equal(changed.document.artifactVersion, "1.0.1"); assert.equal(changed.document.artifactId, initial.artifactId);
  assert.deepEqual(changed.document.extensions, initial.extensions); assert.equal(changed.document.provenance.operation, "original");
  assert.deepEqual(changed.document.provenance.inputs, [{ artifactType: initial.artifactType, artifactId: initial.artifactId, artifactVersion: "1.0.0" }]);
  const fork = prepareEditorArtifact("composition:example", changedGraph, changed.document,
    { ...operation, artifactId: "urn:uuid:05808f07-a88b-4a0d-9adb-69dded82b7d5" }, true);
  assert.ok(fork.accepted); if (!fork.accepted) throw new Error("rejection");
  assert.notEqual(fork.document.artifactId, initial.artifactId); assert.equal(fork.document.artifactVersion, "1.0.0");
  assert.deepEqual(fork.document.extensions, initial.extensions);
});
test("file size preflight avoids reading oversized data; read/codec failures leave originals untouched", async () => {
  let reads = 0; const doc = artifact(); const text = JSON.stringify(doc);
  const huge = await readEditorArtifact({ size: ARTIFACT_LIMITS.bytes + 1, text: async () => { reads++; return text; } });
  assert.deepEqual(huge, { accepted: false, reason: "size-limit" }); assert.equal(reads, 0);
  assert.deepEqual(await readEditorArtifact({ size: 10, text: async () => { throw new Error("disk"); } }), { accepted: false, reason: "file-read-failed" });
  assert.equal((await readEditorArtifact({ size: 2, text: async () => "{}" })).accepted, false);
  const valid = await readEditorArtifact({ size: new TextEncoder().encode(text).length, text: async () => text });
  assert.ok(valid.accepted); if (!valid.accepted) throw new Error("rejection"); assert.deepEqual(valid.document, doc);
  assert.equal(JSON.stringify(doc), text);
});

test("WP5 updating retained v1 to authored v2 advances artifact version and preserves opaque metadata", () => {
  const source = resolveEditorCatalogEntry("composition:example")!;
  const first = prepareEditorArtifact(source.compositionRef, source.composition, null,
    { artifactId: "urn:uuid:wp5-retain", createdAt: "2026-10-10T21:00:00Z" });
  if (!first.accepted) throw Error("first");
  const previous = { ...first.document, extensions: { "com.example.keep": { value: "inert" } } };
  const graph = { ...source.composition, nodes: [...source.composition.nodes, {
    ref: "node:added-3", componentRef: "component:button",
    placement: { parentRef: source.composition.rootRef, slotRef: "content", columnSpan: 2, rowSpan: 1 },
  }] };
  const next = prepareEditorArtifact(source.compositionRef, graph, previous,
    { artifactId: "urn:uuid:unused", createdAt: "2026-10-10T21:01:00Z" });
  assert.ok(next.accepted); if (!next.accepted) return;
  assert.equal(next.document.schema.version, "2.0.0"); assert.equal(next.document.artifactId, previous.artifactId);
  assert.equal(next.document.artifactVersion, "1.0.1"); assert.deepEqual(next.document.extensions, previous.extensions);
  const reopened = importCatalogArtifact(next.text); assert.ok(reopened.accepted);
  if (reopened.accepted) assert.deepEqual(reopened.document.payload.graph, graph);
  const unchanged = prepareEditorArtifact(source.compositionRef, graph, next.document,
    { artifactId: "urn:uuid:unused2", createdAt: "2026-10-10T21:02:00Z" });
  assert.deepEqual(unchanged, next);
});
