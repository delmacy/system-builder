import assert from "node:assert/strict";
import test from "node:test";
import { applyWorkflowCommand, compareWorkflows, createWorkflow, decodeWorkflow, encodeWorkflow, materializeWorkflow, openWorkflow, WORKFLOW_LIMITS, workflowCanonicalText, type WorkflowCommand, type WorkflowSession } from "../../packages/station-workflow-authoring/index.js";

function starter() {
  const r = createWorkflow({ artifactId: "urn:test:workflow", createdAt: "2026-10-11T23:00:00Z", analysisRef: "analysis:1", recipeRef: "recipe:1", process: { id: "ticket", name: "Ticket", requirementRefs: ["req:1"], states: ["open"], initialState: "open" } });
  assert.ok(r.accepted); return r.document;
}
function session() { const r = openWorkflow(starter()); assert.ok(r.accepted); return r.session; }
function command(s: WorkflowSession, c: WorkflowCommand) { const r = applyWorkflowCommand(s, s.revision, c); assert.ok(r.accepted, r.accepted ? "" : r.reason); return r.session; }

test("actual starter, commands, history and new immutable candidate round-trip preserve complete metadata", () => {
  const input = JSON.parse(workflowCanonicalText(starter()));
  input.extensions = { "org.example.metadata": { opaque: ["keep", 3] } };
  input.provenance.operation = { note: "preserved" };
  input.payload.jobs = []; input.payload.sessionPolicy = { lifetimeSeconds: 300 };
  input.payload.actions = [{ id: "close", name: "Close", requirementRefs: ["req:1"] }];
  input.payload.processes.push({ id: "other", name: "Other", requirementRefs: ["req:2"], states: ["only"] });
  const opened = openWorkflow(input); assert.ok(opened.accepted); let s = opened.session;
  s = command(s, { kind: "add-state", processId: "ticket", state: "closed" });
  s = command(s, { kind: "add-transition", processId: "ticket", transition: { id: "close", from: "open", to: "closed", actionRef: "close" } });
  const edited = s; s = command(s, { kind: "undo" }); s = command(s, { kind: "redo" });
  assert.equal(workflowCanonicalText(s.document), workflowCanonicalText(edited.document));
  const r = materializeWorkflow(s, s.revision, "1.1.0", "2026-10-11T23:10:00Z"); assert.ok(r.accepted);
  const reopened = decodeWorkflow(r.text); assert.ok(reopened.accepted); assert.equal(reopened.text, r.text);
  assert.deepEqual(reopened.document.extensions, input.extensions);
  assert.deepEqual(reopened.document.payload.processes[1], input.payload.processes[1]);
  assert.deepEqual(reopened.document.payload.sessionPolicy, input.payload.sessionPolicy);
  assert.deepEqual(reopened.document.provenance.operation, input.provenance.operation);
  assert.equal(opened.session.base.artifactVersion, "1.0.0"); assert.ok(Object.isFrozen(r.document.payload));
  assert.ok(compareWorkflows(opened.session.base, r.document).processesChanged);
  const fresh = openWorkflow(reopened.document); assert.ok(fresh.accepted); assert.equal(fresh.session.dirty, false);
  assert.equal(fresh.session.upstreamStatus, "unresolved"); assert.equal(fresh.session.past.length, 0);
});
test("rejected/stale/no-op commands preserve the exact original session and bytes", () => {
  let s = session(); const text = workflowCanonicalText(s);
  for (const c of [{ kind: "remove-state", processId: "ticket", state: "open" }, { kind: "add-state", processId: "ticket", state: "open" }, { kind: "set-initial", processId: "ticket", state: "missing" }, { kind: "add-transition", processId: "ticket", transition: { id: "bad", from: "open", to: "missing" } }, { kind: "remove-state", processId: "missing", state: "open" }] as WorkflowCommand[]) {
    assert.equal(applyWorkflowCommand(s, s.revision, c).accepted, false); assert.equal(workflowCanonicalText(s), text);
  }
  const stale = applyWorkflowCommand(s, 99, { kind: "undo" }); assert.deepEqual(stale, { accepted: false, reason: "stale-revision" });
  const noop = applyWorkflowCommand(s, 0, { kind: "set-initial", processId: "ticket", state: "open" }); assert.ok(noop.accepted); assert.equal(noop.session, s); assert.equal(noop.changed, false);
  s = command(s, { kind: "add-state", processId: "ticket", state: "closed" });
  s = command(s, { kind: "add-transition", processId: "ticket", transition: { id: "close", from: "open", to: "closed" } });
  assert.equal(applyWorkflowCommand(s, s.revision, { kind: "remove-state", processId: "ticket", state: "closed" }).accepted, false);
  s = command(s, { kind: "remove-transition", processId: "ticket", transitionId: "close" });
  s = command(s, { kind: "remove-state", processId: "ticket", state: "closed" }); assert.equal(s.document.payload.processes[0]?.transitions, undefined);
});
test("cycles/self loops, add process and transition edit obey declared references", () => {
  let s = session(); s = command(s, { kind: "add-state", processId: "ticket", state: "closed" });
  s = command(s, { kind: "add-transition", processId: "ticket", transition: { id: "loop", from: "open", to: "open" } });
  s = command(s, { kind: "edit-transition", processId: "ticket", transition: { id: "loop", from: "open", to: "closed" } });
  s = command(s, { kind: "add-transition", processId: "ticket", transition: { id: "back", from: "closed", to: "open" } });
  assert.equal(applyWorkflowCommand(s, s.revision, { kind: "edit-transition", processId: "ticket", transition: { id: "loop", from: "open", to: "closed", actionRef: "undeclared" } }).accepted, false);
  s = command(s, { kind: "add-process", process: { id: "new", name: "New", states: ["start"], requirementRefs: ["req:2"] } });
  assert.equal(s.document.payload.processes.length, 2);
});
test("full existing schema checks unrelated fields and rejects incompatible or unsafe input", () => {
  const doc = starter();
  for (const mutate of [(v: Record<string, unknown>) => { v.requiredExtensions = ["org.example.required"]; }, (v: Record<string, unknown>) => { v.envelopeVersion = "2.0.0"; }, (v: Record<string, unknown>) => { v.schema = { id: "urn:other", version: "1.0.0" }; }, (v: Record<string, unknown>) => { (v.payload as Record<string, unknown>).sessionPolicy = { lifetimeSeconds: 0 }; }, (v: Record<string, unknown>) => { (v.payload as Record<string, unknown>).environmentRequirements = [{ name: "secret", kind: "secret-reference", required: true, value: "forbidden" }]; }]) {
    const input = JSON.parse(workflowCanonicalText(doc)); mutate(input); assert.equal(encodeWorkflow(input).accepted, false);
  }
  assert.equal(decodeWorkflow("{broken").accepted, false);
  const input = JSON.parse(workflowCanonicalText(doc)); Object.defineProperty(input, "evil", { enumerable: true, get() { throw Error("must not execute"); } });
  assert.deepEqual(encodeWorkflow(input), { accepted: false, reason: "unsafe-input" });
  assert.equal(decodeWorkflow('{"__proto__":{}}').accepted, false);
});
test("inclusive workflow bounds, overflow, bounded history and branch after undo", () => {
  let s = session();
  for (let i = 1; i < WORKFLOW_LIMITS.states; i++) s = command(s, { kind: "add-state", processId: "ticket", state: `state${i}` });
  assert.equal(s.past.length, 50); assert.equal(s.document.payload.processes[0]?.states.length, 64);
  assert.equal(applyWorkflowCommand(s, s.revision, { kind: "add-state", processId: "ticket", state: "overflow" }).accepted, false);
  for (let i = 0; i < WORKFLOW_LIMITS.transitions; i++) s = command(s, { kind: "add-transition", processId: "ticket", transition: { id: `t${i}`, from: "open", to: "open" } });
  assert.equal(applyWorkflowCommand(s, s.revision, { kind: "add-transition", processId: "ticket", transition: { id: "overflow", from: "open", to: "open" } }).accepted, false);
  s = command(s, { kind: "undo" }); assert.equal(s.future.length, 1);
  s = command(s, { kind: "set-initial", processId: "ticket", state: "state1" }); assert.equal(s.future.length, 0);
  assert.equal(materializeWorkflow(s, s.revision, "1.0.0", "2026-10-11T23:00:00Z").accepted, false);
  assert.equal(materializeWorkflow(s, -1, "1.1.0", "2026-10-11T23:00:00Z").accepted, false);
});
test("encoded size and depth limits reject without truncation", () => {
  const input = JSON.parse(workflowCanonicalText(starter())); input.extensions = { "org.example.large": "x".repeat(WORKFLOW_LIMITS.bytes) };
  assert.deepEqual(encodeWorkflow(input), { accepted: false, reason: "size-limit" });
  assert.deepEqual(decodeWorkflow(" ".repeat(WORKFLOW_LIMITS.bytes + 1)), { accepted: false, reason: "size-limit" });
  let value: unknown = "leaf"; for (let i = 0; i < 33; i++) value = { child: value }; input.extensions = { "org.example.deep": value };
  assert.deepEqual(encodeWorkflow(input), { accepted: false, reason: "depth-limit" });
});
