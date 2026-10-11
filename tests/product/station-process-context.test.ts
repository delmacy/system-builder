import assert from "node:assert/strict";
import test from "node:test";
import { createProcessContext, encodeProcessContext, decodeProcessContext, resolveProcessAnchor, PROCESS_CONTEXT_LIMITS, type ProcessContextDocument } from "../../packages/station-process-context/index.js";
import { normalizeProcessRevisionIdentity } from "../../packages/contracts/process-versioning/index.js";
import { loadProcessContext, saveProcessContext, resolveContextComposition, readProcessContextFile, PROCESS_CONTEXT_KEY } from "../../apps/station/web/app/station-process-context-store.js";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { prepareEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
import { mutateArtifactWorkspace, WORKSPACE_KEY, WORKSPACE_ROOT } from "../../apps/station/web/app/station-artifact-workspace.js";
import { appendWorkspaceRevision } from "../../apps/station/web/app/station-workspace-revisions.js";
import { createEditorHistory, applyEditorHistoryStructure, type ArtifactStore } from "../../packages/station-editor/index.js";
const createdAt = "2026-10-11T18:00:00Z";
const anchor = normalizeProcessRevisionIdentity({ contractVersion: "1.0.0", artifactRef: "process:orders", revisionRef: "revision:orders-1", revisionNumber: 1, previousRevisionRef: null });
function setup() {
  const values = new Map<string, string>(); let writes = 0;
  const store: ArtifactStore = { getItem: k => values.get(k) ?? null, setItem: (k,v) => { writes++; values.set(k,v); } };
  const initial = initializeCatalogEditorSession("composition:example", "session:wp13");
  assert.ok(initial.accepted); if (!initial.accepted) throw Error("initial");
  const first = prepareEditorArtifact(initial.entry.compositionRef, initial.entry.composition, null, { artifactId: "urn:uuid:wp13-composition", createdAt });
  assert.ok(first.accepted); if (!first.accepted) throw Error("first");
  const saved = mutateArtifactWorkspace(store, null, { type: "append-file", ref: "file:one", folderRef: WORKSPACE_ROOT, name: "one.composition.json", text: first.text });
  assert.ok(saved.accepted); if (!saved.accepted) throw Error("saved");
  const history = createEditorHistory(initial.session);
  const edited = applyEditorHistoryStructure(history, { type: "set-text", nodeRef: "node:button-1", text: "Process projection", expectedDraftRevision: initial.session.draftRevision, sessionRef: initial.session.sessionRef, compositionRef: initial.entry.compositionRef }, initial.entry.registry);
  assert.ok(edited.accepted); if (!edited.accepted) throw Error("edited");
  const second = prepareEditorArtifact(initial.entry.compositionRef, edited.history.session.transaction.draft, first.document, { artifactId: first.document.artifactId, createdAt });
  assert.ok(second.accepted); if (!second.accepted) throw Error("second");
  const revisions = appendWorkspaceRevision(store, saved.storedText, { baseRef: "file:one", ref: "file:two", name: "two.composition.json", text: second.text });
  assert.ok(revisions.accepted);
  const tuple = { artifactType: "urn:system-builder:station:composition" as const, artifactId: first.document.artifactId, artifactVersion: "1.0.0" };
  const result = createProcessContext(anchor, "Orders", [{ ref: "view:layout", title: "Layout", composition: tuple }], { artifactId: "urn:uuid:context", createdAt });
  assert.ok(result.accepted); if (!result.accepted) throw Error("context");
  return { values, store, first, second, tuple, context: result.document, text: result.text, writes: () => writes };
}
const clone = (d: ProcessContextDocument) => JSON.parse(JSON.stringify(d));
test("WP13 real editor -> immutable revisions -> context -> retained fresh decode pins historical revision", () => {
  const m = setup(), workspaceBefore = m.store.getItem(WORKSPACE_KEY);
  assert.ok(saveProcessContext(m.store, m.context, null).accepted);
  const reopened = loadProcessContext(m.store); assert.ok(reopened.accepted);
  if (!reopened.accepted || !reopened.document) throw Error("reopen");
  assert.deepEqual(reopened.document.payload.processRevision, anchor);
  assert.deepEqual(resolveContextComposition(m.store, reopened.document.payload.views[0]!.composition), { status: "available", text: m.first.text, fileRef: "file:one" });
  assert.equal(resolveProcessAnchor(anchor).status, "unavailable");
  assert.equal(m.store.getItem(WORKSPACE_KEY), workspaceBefore);
  assert.equal(Object.isFrozen(reopened.document.payload.views[0]!.composition), true);
  assert.deepEqual(decodeProcessContext(m.text), encodeProcessContext(m.context));
});
test("WP13 canonical owner response is necessary, identity mismatch is stale, owner failures unavailable", () => {
  assert.equal(resolveProcessAnchor(anchor, ref => ({ status: "available", processRevision: ref })).status, "available");
  assert.equal(resolveProcessAnchor(anchor, () => ({ status: "available", processRevision: { ...anchor, revisionRef: "revision:other" } })).status, "stale");
  for (const status of ["missing", "stale", "invalid", "unavailable"] as const) assert.equal(resolveProcessAnchor(anchor, () => ({ status })).status, status);
  assert.equal(resolveProcessAnchor(anchor, () => { throw Error("offline"); }).status, "unavailable");
});
test("WP13 missing and stale compositions cannot substitute another retained revision", () => {
  const m = setup();
  assert.deepEqual(resolveContextComposition(m.store, { ...m.tuple, artifactId: "urn:uuid:missing" }), { status: "missing" });
  assert.deepEqual(resolveContextComposition(m.store, { ...m.tuple, artifactVersion: "1.0.9" }), { status: "stale" });
  m.values.set(WORKSPACE_KEY, "broken"); assert.deepEqual(resolveContextComposition(m.store, m.tuple), { status: "invalid" });
  assert.deepEqual(resolveContextComposition({ getItem: () => { throw Error("denied"); }, setItem: () => {} }, m.tuple), { status: "unavailable" });
});
test("WP13 conflicting retained tuples reject while identical aliases remain available", () => {
  const m = setup(), data = JSON.parse(m.values.get(WORKSPACE_KEY)!);
  data.files.push({ ...data.files[0], ref: "file:alias", name: "alias.composition.json" });
  m.values.set(WORKSPACE_KEY, JSON.stringify(data)); assert.equal(resolveContextComposition(m.store, m.tuple).status, "available");
  const changed = JSON.parse(data.files[0].text); changed.extensions = { "org.example.test": "changed" };
  data.files[2].text = JSON.stringify(changed); m.values.set(WORKSPACE_KEY, JSON.stringify(data));
  assert.equal(resolveContextComposition(m.store, m.tuple).status, "invalid");
});
test("WP13 optional compatible envelope/extension/provenance metadata round-trips losslessly", () => {
  const m = setup(), data = clone(m.context);
  data.envelopeVersion = "1.1.0"; data.futureField = { value: "inert" };
  data.extensions = { "org.example.layout": { note: "not a business rule" } }; data.provenance.note = "portable";
  const result = encodeProcessContext(data); assert.ok(result.accepted);
  if (result.accepted) { assert.deepEqual(result.document, data); assert.deepEqual(decodeProcessContext(result.text), result); }
});
test("WP13 strict payload, canonical process identity, duplicate references and wrong artifact family fail", () => {
  const m = setup();
  for (const change of [
    (d: ReturnType<typeof clone>) => { d.payload.rules = ["execute"]; },
    (d: ReturnType<typeof clone>) => { d.payload.processRevision.revisionNumber = 2; },
    (d: ReturnType<typeof clone>) => { d.payload.processRevision.artifactRef = " padded "; },
    (d: ReturnType<typeof clone>) => { d.payload.processRevision.revisionRef = anchor.artifactRef; },
    (d: ReturnType<typeof clone>) => { d.payload.views.push(d.payload.views[0]); },
    (d: ReturnType<typeof clone>) => { d.payload.views[0].composition.artifactType = "urn:business:recipe"; },
    (d: ReturnType<typeof clone>) => { d.payload.views[0].composition.locator = "https://untrusted"; },
    (d: ReturnType<typeof clone>) => { d.schema.version = "2.0.0"; },
    (d: ReturnType<typeof clone>) => { d.envelopeVersion = "2.0.0"; },
    (d: ReturnType<typeof clone>) => { d.artifactVersion = "01.0.0"; },
    (d: ReturnType<typeof clone>) => { d.provenance.createdAt = "2026-02-30T00:00:00Z"; },
  ]) { const data = clone(m.context); change(data); assert.equal(encodeProcessContext(data).accepted, false); }
  assert.deepEqual(encodeProcessContext({ ...m.context, requiredExtensions: ["urn:unknown:required"] }), { accepted: false, reason: "required-extension" });
});
test("WP13 cycles, accessors, unsafe keys and non-JSON data reject without getter execution", () => {
  const m = setup(); let getters = 0; const hostile = clone(m.context);
  Object.defineProperty(hostile, "payload", { enumerable: true, get() { getters++; return m.context.payload; } });
  assert.equal(encodeProcessContext(hostile).accepted, false); assert.equal(getters, 0);
  const cyclic = clone(m.context); cyclic.extensions = { "org.example.cycle": cyclic }; assert.equal(encodeProcessContext(cyclic).accepted, false);
  for (const value of [undefined, NaN, Infinity, BigInt(1), () => {}, new Date(), Symbol("x")]) assert.equal(encodeProcessContext({ ...m.context, extensions: { "org.example.value": value } }).accepted, false);
  assert.deepEqual(decodeProcessContext('{"__proto__":{}}'), { accepted: false, reason: "unsafe-key" });
  assert.equal(decodeProcessContext("not json").accepted, false);
});
test("WP13 bounds: 16 views/80 title/256 ref accepted; successors rejected", () => {
  const m = setup(), data = clone(m.context);
  data.payload.title = "T".repeat(80); data.payload.views = Array.from({ length: 16 }, (_, i) => ({ ref: String(i).padEnd(256,"x"), title: "V".repeat(80), composition: { ...m.tuple } }));
  assert.ok(encodeProcessContext(data).accepted);
  for (const field of ["title", "views", "ref"]) {
    const next = JSON.parse(JSON.stringify(data));
    if (field === "title") next.payload.title += "x";
    if (field === "views") next.payload.views.push({ ...next.payload.views[0], ref: "view:overflow" });
    if (field === "ref") next.payload.views[0].ref += "x";
    assert.equal(encodeProcessContext(next).accepted, false);
  }
});
test("WP13 byte and depth bounds accepted exactly and rejected above", () => {
  const m = setup(), data = clone(m.context); data.extensions = { "org.example.padding": "" };
  const empty = encodeProcessContext(data); assert.ok(empty.accepted); if (!empty.accepted) throw Error("empty");
  data.extensions["org.example.padding"] = "x".repeat(PROCESS_CONTEXT_LIMITS.bytes - new TextEncoder().encode(empty.text).length);
  const full = encodeProcessContext(data); assert.ok(full.accepted); if (!full.accepted) throw Error("full");
  assert.equal(new TextEncoder().encode(full.text).length, PROCESS_CONTEXT_LIMITS.bytes);
  assert.ok(decodeProcessContext(full.text).accepted); data.extensions["org.example.padding"] += "x";
  assert.deepEqual(encodeProcessContext(data), { accepted: false, reason: "size-limit" });
  assert.deepEqual(decodeProcessContext(full.text + " "), { accepted: false, reason: "size-limit" });
  let nested: unknown = "end"; for (let i=0;i<30;i++) nested={ child: nested };
  assert.ok(encodeProcessContext({ ...m.context, extensions: { "org.example.depth": nested } }).accepted);
  assert.deepEqual(encodeProcessContext({ ...m.context, extensions: { "org.example.depth": { child: nested } } }), { accepted: false, reason: "depth-limit" });
});
test("WP13 failed/stale/quota/corrupt context writes preserve both context and composition bytes", () => {
  const m = setup(), workspace = m.store.getItem(WORKSPACE_KEY); assert.ok(saveProcessContext(m.store,m.context,null).accepted);
  const prior = m.store.getItem(PROCESS_CONTEXT_KEY), beforeWrites = m.writes();
  assert.deepEqual(saveProcessContext(m.store,m.context,null), { accepted: false, reason: "storage-conflict" });
  assert.deepEqual(saveProcessContext(m.store,{},prior), { accepted: false, reason: "invalid-context" });
  assert.deepEqual(saveProcessContext({ getItem: k => m.store.getItem(k), setItem: () => { throw Error("quota"); } },m.context,prior), { accepted: false, reason: "storage-unavailable" });
  let reads = 0;
  assert.deepEqual(saveProcessContext({ getItem: () => ++reads === 1 ? prior : "changed", setItem: () => { throw Error("must not write"); } },m.context,prior), { accepted: false, reason: "storage-conflict" });
  assert.equal(m.writes(),beforeWrites); assert.equal(m.store.getItem(PROCESS_CONTEXT_KEY),prior); assert.equal(m.store.getItem(WORKSPACE_KEY),workspace);
  m.values.set(PROCESS_CONTEXT_KEY,"corrupt"); assert.equal(saveProcessContext(m.store,m.context,"corrupt").accepted,false); assert.equal(m.store.getItem(PROCESS_CONTEXT_KEY),"corrupt");
});
test("WP13 actual file size/extension/read checks precede decode, failures remain explicit", async () => {
  const m=setup(); let reads=0;
  const file={ name:"orders.process.json",size:new TextEncoder().encode(m.text).length,text:async()=>{reads++;return m.text;} };
  assert.ok((await readProcessContextFile(file)).accepted); assert.equal(reads,1);
  assert.deepEqual(await readProcessContextFile({...file,name:"orders.json"}),{accepted:false,reason:"invalid-filename"});
  assert.deepEqual(await readProcessContextFile({...file,size:PROCESS_CONTEXT_LIMITS.bytes+1}),{accepted:false,reason:"size-limit"});
  assert.equal(reads,1);
  assert.deepEqual(await readProcessContextFile({...file,text:async()=>{throw Error("read");}}),{accepted:false,reason:"file-read-failed"});
  assert.equal((await readProcessContextFile({...file,text:async()=>"{}"})).accepted,false);
});
