import assert from "node:assert/strict";
import test from "node:test";
import { appendWorkspaceRevision, compareWorkspaceRevisions, workspaceRevisions, REVISION_DIFF_LIMIT } from "../../apps/station/web/app/station-workspace-revisions.js";
import { loadArtifactWorkspace, mutateArtifactWorkspace, WORKSPACE_KEY, WORKSPACE_ROOT } from "../../apps/station/web/app/station-artifact-workspace.js";
import { prepareEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { applyEditorHistoryStructure, createEditorHistory, decodeCompositionArtifact, initializeEditorSession, type ArtifactStore } from "../../packages/station-editor/index.js";
const createdAt = "2026-10-11T16:00:00Z";
function setup() {
  const values = new Map<string, string>(); let writes = 0;
  const store: ArtifactStore = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { writes++; values.set(key, value); } };
  const initial = initializeCatalogEditorSession("composition:example", "session:wp12");
  assert.ok(initial.accepted); if (!initial.accepted) throw Error("source");
  const first = prepareEditorArtifact(initial.entry.compositionRef, initial.entry.composition, null, { artifactId: "urn:uuid:wp12", createdAt });
  assert.ok(first.accepted); if (!first.accepted) throw Error("first");
  const saved = mutateArtifactWorkspace(store, null, { type: "append-file", ref: "file:first", folderRef: WORKSPACE_ROOT, name: "first.composition.json", text: first.text });
  assert.ok(saved.accepted); if (!saved.accepted) throw Error("saved");
  const history = createEditorHistory(initial.session);
  const edited = applyEditorHistoryStructure(history, { type: "set-text", nodeRef: "node:button-1", text: "Revisão real", expectedDraftRevision: initial.session.draftRevision,
    sessionRef: initial.session.sessionRef, compositionRef: initial.entry.compositionRef }, initial.entry.registry);
  assert.ok(edited.accepted); if (!edited.accepted) throw Error("edit");
  const next = prepareEditorArtifact(initial.entry.compositionRef, edited.history.session.transaction.draft, first.document, { artifactId: first.document.artifactId, createdAt });
  assert.ok(next.accepted); if (!next.accepted) throw Error("next");
  const intent = { baseRef: "file:first", ref: "file:second", name: "second.composition.json", text: next.text };
  return { values, store, writes: () => writes, initial, first, next, edited, saved, intent };
}
test("WP12 actual editor -> first copy -> immutable patch revision -> full diff -> fresh editor", () => {
  const m = setup(), beforeHistory = JSON.stringify(m.edited.history);
  const result = appendWorkspaceRevision(m.store, m.saved.storedText, m.intent);
  assert.ok(result.accepted); if (!result.accepted) throw Error("append");
  assert.equal(m.writes(), 2); assert.equal(result.workspace.files[0]!.text, m.first.text);
  const revisions = workspaceRevisions(result.workspace, "file:first");
  assert.deepEqual(revisions.map(r => r.document.artifactVersion), ["1.0.0", "1.0.1"]);
  assert.equal(revisions[0]!.document.artifactId, revisions[1]!.document.artifactId);
  assert.ok(Object.isFrozen(revisions)); assert.ok(Object.isFrozen(revisions[1]));
  assert.equal(revisions[1]!.file.folderRef, WORKSPACE_ROOT);
  assert.deepEqual(revisions[1]!.document.provenance.inputs, [{ artifactType: m.first.document.artifactType, artifactId: m.first.document.artifactId, artifactVersion: "1.0.0" }]);
  const diff = compareWorkspaceRevisions(m.first.text, m.next.text);
  assert.ok(diff.accepted); if (!diff.accepted) throw Error("diff");
  assert.equal(diff.truncated, false);
  assert.deepEqual(diff.changes.map(c => c.path), ["/artifactVersion", "/payload/graph/nodes/1/text", "/provenance/inputs/0", "/schema/version"]);
  assert.equal(diff.changes[1]!.after, "Revisão real"); assert.equal(diff.changes[1]!.kind, "added");
  const fresh = initializeEditorSession({ sessionRef: "session:wp12-reopen", base: m.initial.session.base, composition: revisions[1]!.document.payload.graph }, m.initial.entry.registry);
  assert.ok(fresh.accepted); if (fresh.accepted) assert.deepEqual(fresh.session.transaction.draft, m.edited.history.session.transaction.draft);
  assert.equal(JSON.stringify(m.edited.history), beforeHistory);
  assert.deepEqual(compareWorkspaceRevisions(m.next.text, m.next.text), { accepted: true, changes: [], truncated: false });
});
test("WP12 stale head and unrelated snapshot changes reject, refreshed deliberate append recovers", () => {
  const m = setup(); const second = appendWorkspaceRevision(m.store, m.saved.storedText, m.intent);
  assert.ok(second.accepted); if (!second.accepted) throw Error("second");
  const prior = m.store.getItem(WORKSPACE_KEY);
  assert.deepEqual(appendWorkspaceRevision(m.store, m.saved.storedText, { ...m.intent, ref: "file:third", name: "third.composition.json" }), { accepted: false, reason: "storage-conflict" });
  assert.deepEqual(appendWorkspaceRevision(m.store, prior, m.intent), { accepted: false, reason: "revision-conflict" });
  const thirdGraph = JSON.parse(JSON.stringify(m.next.document.payload.graph)); thirdGraph.nodes[1].text = "Terceira revisão";
  const third = prepareEditorArtifact("composition:example", thirdGraph, m.next.document, { artifactId: m.next.document.artifactId, createdAt });
  assert.ok(third.accepted); if (!third.accepted) throw Error("third");
  assert.ok(appendWorkspaceRevision(m.store, prior, { baseRef: "file:second", ref: "file:third", name: "third.composition.json", text: third.text }).accepted);
  assert.equal(m.writes(), 3); assert.equal(m.store.getItem(WORKSPACE_KEY) === prior, false);
  const loaded = loadArtifactWorkspace(m.store); assert.ok(loaded.accepted);
  if (loaded.accepted) assert.deepEqual(workspaceRevisions(loaded.workspace, "file:first").map(r => r.document.artifactVersion), ["1.0.0", "1.0.1", "1.0.2"]);
});
test("WP12 hostile intent, wrong identity/version/source/provenance/metadata, unchanged graph preserve bytes", () => {
  const m = setup(); const prior = m.store.getItem(WORKSPACE_KEY);
  const invalid = [m.first.text, "{}", JSON.stringify({ ...m.next.document, artifactId: "urn:uuid:foreign" }),
    JSON.stringify({ ...m.next.document, artifactVersion: "2.0.0" }), JSON.stringify({ ...m.next.document, provenance: { ...m.next.document.provenance, inputs: [] } }),
    JSON.stringify({ ...m.next.document, extensions: { "org.example.changed": true } }),
    JSON.stringify({ ...m.next.document, payload: { ...m.next.document.payload, compositionRef: "composition:button-group" } })];
  for (const text of invalid) assert.equal(appendWorkspaceRevision(m.store, prior, { ...m.intent, text }).accepted, false);
  let getters = 0; const hostile = { ...m.intent };
  Object.defineProperty(hostile, "name", { enumerable: true, get() { getters++; return "x"; } });
  assert.equal(appendWorkspaceRevision(m.store, prior, hostile).accepted, false); assert.equal(getters, 0);
  assert.equal(appendWorkspaceRevision(m.store, prior, { ...m.intent, extra: true } as typeof m.intent).accepted, false);
  assert.equal(appendWorkspaceRevision(m.store, prior, { ...m.intent, name: "../bad.composition.json" }).accepted, false);
  assert.equal(m.store.getItem(WORKSPACE_KEY), prior); assert.equal(m.writes(), 1);
});
test("WP12 denied/corrupt/quota and intervening second-read changes do not write", () => {
  const m = setup(), prior = m.store.getItem(WORKSPACE_KEY);
  assert.equal(appendWorkspaceRevision({ getItem() { throw Error("denied"); }, setItem: m.store.setItem }, prior, m.intent).accepted, false);
  assert.equal(appendWorkspaceRevision({ getItem: m.store.getItem, setItem() { throw Error("quota"); } }, prior, m.intent).accepted, false);
  let reads = 0;
  assert.equal(appendWorkspaceRevision({ getItem() { return ++reads === 1 ? prior : null; }, setItem: m.store.setItem }, prior, m.intent).accepted, false);
  assert.equal(m.store.getItem(WORKSPACE_KEY), prior); assert.equal(m.writes(), 1);
  m.values.set(WORKSPACE_KEY, "broken"); assert.equal(appendWorkspaceRevision(m.store, "broken", m.intent).accepted, false);
  assert.equal(m.store.getItem(WORKSPACE_KEY), "broken");
});
test("WP12 compatible opaque metadata persists, JSON pointer escaping and removal are deterministic", () => {
  const m = setup(); const a = JSON.parse(m.first.text), b = JSON.parse(m.next.text);
  a.extensions = { "org.example.keep": { "a/b~c": "literal <script>", gone: true } };
  b.extensions = { "org.example.keep": { "a/b~c": "literal <button>", added: 3 } };
  const diff = compareWorkspaceRevisions(JSON.stringify(a), JSON.stringify(b)); assert.ok(diff.accepted);
  if (diff.accepted) {
    assert.ok(diff.changes.some(c => c.path === "/extensions/org.example.keep/a~1b~0c" && c.kind === "changed"));
    assert.ok(diff.changes.some(c => c.path.endsWith("/gone") && c.kind === "removed"));
    assert.ok(diff.changes.some(c => c.path.endsWith("/added") && c.kind === "added"));
    const repeat = compareWorkspaceRevisions(JSON.stringify(a), JSON.stringify(b)); assert.deepEqual(repeat, diff);
  }
  m.values.set(WORKSPACE_KEY, JSON.stringify({ ...m.saved.workspace, files: [{ ...m.saved.workspace.files[0], text: JSON.stringify(a) }] }));
  const decoded = decodeCompositionArtifact(JSON.stringify(a), resolveEditorCatalogEntry); assert.ok(decoded.accepted);
  if (!decoded.accepted) throw Error("metadata");
  const revision = prepareEditorArtifact("composition:example", m.next.document.payload.graph, decoded.document, { artifactId: decoded.document.artifactId, createdAt });
  assert.ok(revision.accepted); if (!revision.accepted) throw Error("revision");
  const saved = appendWorkspaceRevision(m.store, m.store.getItem(WORKSPACE_KEY), { ...m.intent, text: revision.text });
  assert.ok(saved.accepted); if (saved.accepted) assert.deepEqual(workspaceRevisions(saved.workspace, "file:second")[1]!.document.extensions, a.extensions);
});
test("WP12 diff limit512 exactly inclusive and truncation explicit at513, incompatible input rejects", () => {
  const m = setup();
  for (const n of [511, 512, 513]) {
    const a = { ...m.first.document, extensions: { "org.example.diff": Object.fromEntries(Array.from({ length: n }, (_, i) => ["x" + String(i).padStart(4, "0"), 0])) } };
    const b = { ...a, extensions: { "org.example.diff": Object.fromEntries(Array.from({ length: n }, (_, i) => ["x" + String(i).padStart(4, "0"), 1])) } };
    const diff = compareWorkspaceRevisions(JSON.stringify(a), JSON.stringify(b)); assert.ok(diff.accepted);
    if (diff.accepted) { assert.equal(diff.changes.length, Math.min(n, REVISION_DIFF_LIMIT)); assert.equal(diff.truncated, n > REVISION_DIFF_LIMIT); }
  }
  assert.equal(compareWorkspaceRevisions("{}", m.next.text).accepted, false);
  assert.deepEqual(compareWorkspaceRevisions(m.first.text, JSON.stringify({ ...m.first.document, artifactId: "urn:uuid:other" })), { accepted: false, reason: "identity-mismatch" });
});
test("WP12 revision count remains workspace48 files cap, aliases/version reuse and unstable bases reject", () => {
  const m = setup(); let expected = m.saved.storedText;
  for (let i = 1; i < 48; i++) {
    const doc = { ...m.first.document, artifactId: "urn:uuid:copy-" + i };
    const result = mutateArtifactWorkspace(m.store, expected, { type: "append-file", ref: "file:f" + i, folderRef: WORKSPACE_ROOT, name: "f" + i + ".composition.json", text: JSON.stringify(doc) });
    assert.ok(result.accepted); if (!result.accepted) throw Error("cap"); expected = result.storedText;
  }
  const prior = m.store.getItem(WORKSPACE_KEY);
  assert.equal(appendWorkspaceRevision(m.store, prior, m.intent).accepted, false); assert.equal(m.store.getItem(WORKSPACE_KEY), prior);
  const unstable = setup(); unstable.values.set(WORKSPACE_KEY, JSON.stringify({ ...unstable.saved.workspace, files: [{ ...unstable.saved.workspace.files[0], text: JSON.stringify({ ...unstable.first.document, artifactVersion: "1.0.0-beta" }) }] }));
  assert.equal(appendWorkspaceRevision(unstable.store, unstable.store.getItem(WORKSPACE_KEY), unstable.intent).accepted, false);
  const alias = setup(); const extra = mutateArtifactWorkspace(alias.store, alias.saved.storedText, { type: "append-file", ref: "file:alias", folderRef: WORKSPACE_ROOT, name: "alias.composition.json", text: alias.first.text });
  assert.ok(extra.accepted); if (!extra.accepted) throw Error("alias");
  assert.equal(appendWorkspaceRevision(alias.store, extra.storedText, alias.intent).accepted, false);
  assert.ok(appendWorkspaceRevision(alias.store, extra.storedText, { ...alias.intent, baseRef: "file:alias" }).accepted);
});
