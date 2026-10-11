import assert from "node:assert/strict";
import test from "node:test";
import { applyWorkflowCommand, createWorkflow, materializeWorkflow, openWorkflow, workflowCanonicalText } from "../../packages/station-workflow-authoring/index.js";
import { loadWorkflowCandidates, readWorkflowFile, saveWorkflowCandidates, WORKFLOW_STORE_KEY, WORKFLOW_STORE_LIMITS, type WorkflowStorage } from "../../apps/station/web/app/station-workflow-store.js";
function documents() {
  const r = createWorkflow({ artifactId: "urn:test:store-workflow", createdAt: "2026-10-11T23:00:00Z", analysisRef: "analysis:1", recipeRef: "recipe:1", process: { id: "ticket", name: "Ticket", requirementRefs: ["req:1"], states: ["open"], initialState: "open" } }); assert.ok(r.accepted);
  const s = openWorkflow(r.document); assert.ok(s.accepted);
  const c = applyWorkflowCommand(s.session, 0, { kind: "add-state", processId: "ticket", state: "closed" }); assert.ok(c.accepted);
  const m = materializeWorkflow(c.session, c.session.revision, "1.0.1", "2026-10-11T23:01:00Z"); assert.ok(m.accepted);
  return { base: r.document, candidate: m.document, text: m.text };
}
function memory() { const values = new Map<string, string>(); const store: WorkflowStorage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => { values.set(k, v); } }; return { store, values }; }
test("actual generated immutable revisions save, file import, reopen and duplicate idempotence", async () => {
  const d = documents(), { store } = memory(); const saved = saveWorkflowCandidates(store, [d.base, d.candidate], null); assert.ok(saved.accepted);
  const opened = loadWorkflowCandidates(store); assert.ok(opened.accepted); assert.equal(opened.documents.length, 2);
  assert.equal(workflowCanonicalText(opened.documents[0]), workflowCanonicalText(d.base));
  const file = await readWorkflowFile({ name: "ticket.workflow.json", size: Buffer.byteLength(d.text), text: async () => d.text }); assert.ok(file.accepted); assert.equal(file.text, d.text);
  const again = saveWorkflowCandidates(store, [d.candidate], saved.storedText); assert.ok(again.accepted); assert.equal(again.storedText, saved.storedText);
});
test("stale snapshots and same-tuple changed content reject without replacing prior bytes", () => {
  const d = documents(), { store } = memory(); const saved = saveWorkflowCandidates(store, [d.base], null); assert.ok(saved.accepted);
  assert.deepEqual(saveWorkflowCandidates(store, [d.candidate], null), { accepted: false, reason: "storage-conflict" });
  const changed = { ...d.candidate, artifactVersion: d.base.artifactVersion };
  assert.deepEqual(saveWorkflowCandidates(store, [changed], saved.storedText), { accepted: false, reason: "storage-conflict" });
  assert.equal(store.getItem(WORKFLOW_STORE_KEY), saved.storedText);
});
test("corruption, read denial and quota preserve caller drafts and existing stored bytes", () => {
  const d = documents(), { store, values } = memory(); values.set(WORKFLOW_STORE_KEY, "corrupt");
  assert.equal(loadWorkflowCandidates(store).accepted, false); assert.equal(saveWorkflowCandidates(store, [d.base], "corrupt").accepted, false); assert.equal(store.getItem(WORKFLOW_STORE_KEY), "corrupt");
  const denied: WorkflowStorage = { getItem() { throw Error("denied"); }, setItem() { throw Error("quota"); } }; assert.equal(loadWorkflowCandidates(denied).accepted, false);
  values.clear(); const quota: WorkflowStorage = { getItem: store.getItem, setItem() { throw Error("quota"); } };
  assert.equal(saveWorkflowCandidates(quota, [d.base], null).accepted, false); assert.equal(store.getItem(WORKFLOW_STORE_KEY), null); assert.equal(d.base.artifactVersion, "1.0.0");
});
test("16 inclusive immutable revisions, 17 and byte overflow reject atomically", () => {
  const d = documents(), { store } = memory(); const docs = Array.from({ length: 16 }, (_, i) => ({ ...d.base, artifactVersion: `1.0.${i}` }));
  const saved = saveWorkflowCandidates(store, docs, null); assert.ok(saved.accepted); assert.equal(saved.documents.length, 16);
  assert.deepEqual(saveWorkflowCandidates(store, [{ ...d.base, artifactVersion: "1.0.16" }], saved.storedText), { accepted: false, reason: "store-limit" }); assert.equal(store.getItem(WORKFLOW_STORE_KEY), saved.storedText);
  const oversized: WorkflowStorage = { getItem: () => "x".repeat(WORKFLOW_STORE_LIMITS.bytes + 1), setItem() { throw Error("must not write"); } }; assert.deepEqual(loadWorkflowCandidates(oversized), { accepted: false, reason: "store-limit" });
});
test("wrong extension, declared overflow and failed asynchronous read reject explicitly", async () => {
  const d = documents(); assert.equal((await readWorkflowFile({ name: "bad.json", size: 1, text: async () => d.text })).accepted, false);
  assert.equal((await readWorkflowFile({ name: "ticket.workflow.json", size: 1_048_577, text: async () => d.text })).accepted, false);
  assert.deepEqual(await readWorkflowFile({ name: "ticket.workflow.json", size: 1, text: async () => { throw Error("read"); } }), { accepted: false, reason: "file-read-failed" });
});

test("larger unrelated workflow stays lossless and read-only while bounded selected process remains editable", () => {
  const d = documents();
  const input = { ...d.base, payload: { ...d.base.payload, processes: [...d.base.payload.processes, { id: "large", name: "Large", requirementRefs: ["req:other"], states: Array.from({ length: 65 }, (_, i) => "s" + i) }] } };
  const opened = openWorkflow(input); assert.ok(opened.accepted);
  const changed = applyWorkflowCommand(opened.session, 0, { kind: "add-state", processId: "ticket", state: "closed" }); assert.ok(changed.accepted);
  assert.deepEqual(changed.session.document.payload.processes[1], input.payload.processes[1]);
  assert.equal(applyWorkflowCommand(changed.session, changed.session.revision, { kind: "set-initial", processId: "large", state: "s0" }).accepted, false);
  const m = materializeWorkflow(changed.session, changed.session.revision, "1.0.1", "2026-10-11T23:02:00Z"); assert.ok(m.accepted);
  const { store } = memory(); const saved = saveWorkflowCandidates(store, [opened.session.base, m.document], null); assert.ok(saved.accepted);
  assert.deepEqual(saved.documents[1]?.payload.processes[1], input.payload.processes[1]);
});
