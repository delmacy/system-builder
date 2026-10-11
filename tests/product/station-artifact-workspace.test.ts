import assert from "node:assert/strict";
import test from "node:test";
import { WORKSPACE_KEY, WORKSPACE_ROOT, WORKSPACE_LIMITS, emptyArtifactWorkspace, parseArtifactWorkspace,
  loadArtifactWorkspace, mutateArtifactWorkspace, readWorkspaceComposition, workspaceDocument, validWorkspaceName,
  type WorkspaceIntent } from "../../apps/station/web/app/station-artifact-workspace.js";
import { prepareEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { applyEditorHistoryStructure, createEditorHistory, initializeEditorSession, type ArtifactStore } from "../../packages/station-editor/index.js";
function memory() {
  const values = new Map<string, string>(); let writes = 0;
  const store: ArtifactStore = { getItem: k => values.get(k) ?? null, setItem: (k, v) => { writes++; values.set(k, v); } };
  return { store, values, writes: () => writes };
}
function text(ref = "composition:example", id = "urn:uuid:wp11") {
  const entry = resolveEditorCatalogEntry(ref)!;
  const result = prepareEditorArtifact(ref, entry.composition, null, { artifactId: id, createdAt: "2026-10-11T13:00:00Z" });
  assert.ok(result.accepted); if (!result.accepted) throw Error("artifact"); return result.text;
}
test("WP11 real editor movement/properties -> codec -> named nested workspace -> fresh editor preserves semantics", () => {
  const initial = initializeCatalogEditorSession("composition:action-panel", "session:wp11"); assert.ok(initial.accepted);
  if (!initial.accepted) throw Error("source");
  let history = createEditorHistory(initial.session);
  for (const edit of [{ type: "set-text", nodeRef: "panel:primary", text: "Confirmar" },
    { type: "set-properties", nodeRef: "panel:primary", properties: { variant: "outline", disabled: true } },
    { type: "reparent-node", nodeRef: "panel:primary", parentRef: "panel:root", slotRef: "content" }] as const) {
    const result = applyEditorHistoryStructure(history, { ...edit, expectedDraftRevision: history.session.draftRevision,
      sessionRef: history.session.sessionRef, compositionRef: initial.entry.compositionRef }, initial.entry.registry);
    assert.ok(result.accepted); if (!result.accepted) throw Error("edit"); history = result.history;
  }
  const prepared = prepareEditorArtifact(initial.entry.compositionRef, history.session.transaction.draft, null,
    { artifactId: "urn:uuid:wp11-edited", createdAt: "2026-10-11T13:00:00Z" }, true);
  assert.ok(prepared.accepted); if (!prepared.accepted) throw Error("prepared");
  const m = memory();
  const folder = mutateArtifactWorkspace(m.store, null, { type: "create-folder", ref: "folder:design", parentRef: WORKSPACE_ROOT, name: "Design" });
  assert.ok(folder.accepted); if (!folder.accepted) throw Error("folder");
  const saved = mutateArtifactWorkspace(m.store, folder.storedText, { type: "append-file", ref: "file:confirm", folderRef: "folder:design",
    name: "Confirmar.composition.json", text: prepared.text }); assert.ok(saved.accepted);
  const loaded = loadArtifactWorkspace(m.store); assert.ok(loaded.accepted); if (!loaded.accepted) throw Error("loaded");
  assert.equal(loaded.workspace.revision, 2); assert.equal(m.writes(), 2); assert.deepEqual([...m.values.keys()], [WORKSPACE_KEY]);
  const file = loaded.workspace.files[0]!, doc = workspaceDocument(file)!;
  assert.equal(file.folderRef, "folder:design"); assert.equal(doc.schema.version, "4.0.0");
  assert.equal(doc.artifactId, "urn:uuid:wp11-edited");
  const fresh = initializeEditorSession({ sessionRef: "session:wp11-fresh", base: initial.session.base, composition: doc.payload.graph }, initial.entry.registry);
  assert.ok(fresh.accepted); if (fresh.accepted) assert.deepEqual(fresh.session.transaction.draft, history.session.transaction.draft);
  assert.ok(Object.isFrozen(loaded.workspace.files)); assert.ok(Object.isFrozen(file));
});
test("WP11 multiple same-source copies, independent sources and opaque envelope metadata roundtrip", () => {
  const m = memory(); let expected: string | null = null;
  for (const [i, source] of ["composition:example", "composition:example", "composition:button-group", "composition:action-panel"].entries()) {
    const doc = JSON.parse(text(source, "urn:uuid:copy-" + i));
    doc.extensions = { "org.example.keep": { note: "literal <script>" } };
    const result = mutateArtifactWorkspace(m.store, expected, { type: "append-file", ref: "file:copy-" + i,
      folderRef: WORKSPACE_ROOT, name: "copy-" + i + ".composition.json", text: JSON.stringify(doc) });
    assert.ok(result.accepted); if (!result.accepted) throw Error("copy"); expected = result.storedText;
    assert.deepEqual(workspaceDocument(result.workspace.files[i]!)?.extensions, doc.extensions);
  }
  const loaded = loadArtifactWorkspace(m.store); assert.ok(loaded.accepted);
  if (loaded.accepted) assert.equal(loaded.workspace.files.length, 4);
});
test("WP11 hostile metadata, disconnected/cyclic roots, filenames, source/schema/identity and tuple conflicts reject", () => {
  const base = emptyArtifactWorkspace();
  const invalid = [{ ...base, extra: true }, { ...base, schemaVersion: 2 }, { ...base, revision: -1 },
    { ...base, folders: [] }, { ...base, folders: [{ ref: WORKSPACE_ROOT, name: "changed", parentRef: null }] },
    { ...base, folders: [...base.folders, { ref: "folder:a", name: "A", parentRef: "folder:b" }, { ref: "folder:b", name: "B", parentRef: "folder:a" }] },
    { ...base, files: [{ ref: "file:a", folderRef: "folder:missing", name: "a.composition.json", text: text() }] }];
  for (const value of invalid) assert.equal(parseArtifactWorkspace(JSON.stringify(value)).accepted, false);
  for (const name of ["", " ", ".", "..", "../a", "a\\b", " a", "a ", "\ud800", "a\n", "x".repeat(81)]) assert.equal(validWorkspaceName(name), false, name);
  assert.ok(validWorkspaceName("😀".repeat(80))); assert.equal(validWorkspaceName("a.json", true), false);
  const m = memory(); const append = (fileText: string, name = "first.composition.json", id = "a") => mutateArtifactWorkspace(m.store,
    m.store.getItem(WORKSPACE_KEY), { type: "append-file", ref: "file:" + id, folderRef: WORKSPACE_ROOT, name, text: fileText });
  assert.equal(append("{}").accepted, false); assert.equal(m.writes(), 0);
  assert.ok(append(text()).accepted); const prior = m.store.getItem(WORKSPACE_KEY);
  assert.equal(append(text(), "FIRST.composition.json", "b").accepted, false);
  const changed = JSON.parse(text()); changed.payload.graph.nodes[1].placement.columnSpan = 3;
  assert.equal(append(JSON.stringify(changed), "different.composition.json", "b").accepted, false);
  assert.equal(m.store.getItem(WORKSPACE_KEY), prior);
  const unknown = JSON.parse(text()); unknown.payload.compositionRef = "composition:unknown";
  assert.equal(append(JSON.stringify(unknown), "unknown.composition.json", "c").accepted, false);
  assert.equal(m.writes(), 1);
});
test("WP11 stale snapshot, second-read conflict, corrupt/quota/denied storage and revision overflow preserve bytes", () => {
  const m = memory(); const op: WorkspaceIntent = { type: "create-folder", ref: "folder:a", parentRef: WORKSPACE_ROOT, name: "A" };
  const saved = mutateArtifactWorkspace(m.store, null, op); assert.ok(saved.accepted); if (!saved.accepted) throw Error("saved");
  const next: WorkspaceIntent = { ...op, ref: "folder:b", name: "B" }; const prior = m.store.getItem(WORKSPACE_KEY);
  assert.deepEqual(mutateArtifactWorkspace(m.store, null, next), { accepted: false, reason: "storage-conflict" });
  assert.equal(mutateArtifactWorkspace({ getItem: m.store.getItem, setItem() { throw Error("quota"); } }, prior, next).accepted, false);
  assert.equal(loadArtifactWorkspace({ getItem() { throw Error("denied"); }, setItem: m.store.setItem }).accepted, false);
  let reads = 0;
  assert.equal(mutateArtifactWorkspace({ getItem() { return ++reads === 1 ? prior : null; }, setItem: m.store.setItem }, prior, next).accepted, false);
  assert.equal(m.store.getItem(WORKSPACE_KEY), prior); assert.equal(m.writes(), 1);
  const overflow = JSON.stringify({ ...saved.workspace, revision: Number.MAX_SAFE_INTEGER }); m.values.set(WORKSPACE_KEY, overflow);
  assert.equal(mutateArtifactWorkspace(m.store, overflow, next).accepted, false); assert.equal(m.store.getItem(WORKSPACE_KEY), overflow);
  m.values.set(WORKSPACE_KEY, "{broken");
  assert.equal(mutateArtifactWorkspace(m.store, "{broken", next).accepted, false); assert.equal(m.store.getItem(WORKSPACE_KEY), "{broken");
  let getters = 0; const hostile = { ...op };
  Object.defineProperty(hostile, "name", { get() { getters++; return "X"; }, enumerable: true });
  assert.equal(mutateArtifactWorkspace(m.store, "{broken", hostile).accepted, false); assert.equal(getters, 0);
});
test("WP11 actual folder8/9, folders16/17, files48/49 and UTF-8 bytes inclusive boundaries", () => {
  const m = memory(); let expected: string | null = null;
  for (let i = 1; i <= 7; i++) {
    const result = mutateArtifactWorkspace(m.store, expected, { type: "create-folder", ref: "folder:d" + i, parentRef: i === 1 ? WORKSPACE_ROOT : "folder:d" + (i - 1), name: "D" + i });
    assert.ok(result.accepted); if (!result.accepted) throw Error("depth"); expected = result.storedText;
  }
  assert.equal(mutateArtifactWorkspace(m.store, expected, { type: "create-folder", ref: "folder:d8", parentRef: "folder:d7", name: "D8" }).accepted, false);
  for (let i = 8; i < 16; i++) {
    const result = mutateArtifactWorkspace(m.store, expected, { type: "create-folder", ref: "folder:s" + i, parentRef: WORKSPACE_ROOT, name: "S" + i });
    assert.ok(result.accepted); if (!result.accepted) throw Error("count"); expected = result.storedText;
  }
  assert.equal(mutateArtifactWorkspace(m.store, expected, { type: "create-folder", ref: "folder:extra", parentRef: WORKSPACE_ROOT, name: "Extra" }).accepted, false);
  for (let i = 0; i < 48; i++) {
    const result = mutateArtifactWorkspace(m.store, expected, { type: "append-file", ref: "file:f" + i, folderRef: WORKSPACE_ROOT, name: "f" + i + ".composition.json", text: text() });
    assert.ok(result.accepted); if (!result.accepted) throw Error("files"); expected = result.storedText;
  }
  assert.equal(mutateArtifactWorkspace(m.store, expected, { type: "append-file", ref: "file:extra", folderRef: WORKSPACE_ROOT, name: "extra.composition.json", text: text() }).accepted, false);
  const raw = JSON.stringify(emptyArtifactWorkspace()), exact = raw + " ".repeat(WORKSPACE_LIMITS.bytes - raw.length);
  assert.ok(parseArtifactWorkspace(exact).accepted); assert.deepEqual(parseArtifactWorkspace(exact + " "), { accepted: false, reason: "size-limit" });
});
test("WP11 portable filename/size preflight, read failure and actual import codec", async () => {
  let reads = 0; const valid = text(); const input = { name: "safe.composition.json", size: valid.length, text: async () => { reads++; return valid; } };
  assert.equal((await readWorkspaceComposition({ ...input, name: "script.js" })).accepted, false); assert.equal(reads, 0);
  assert.equal((await readWorkspaceComposition({ ...input, size: 1_048_577 })).accepted, false); assert.equal(reads, 0);
  assert.equal((await readWorkspaceComposition({ ...input, text: async () => { throw Error("disk"); } })).accepted, false);
  assert.ok((await readWorkspaceComposition(input)).accepted); assert.equal(reads, 1);
});
