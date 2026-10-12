import assert from "node:assert/strict";
import test from "node:test";
import { DesignCandidateService, MemoryDesignCandidateRepository, type DesignAuthorizationPort } from "../../packages/design/index.js";
import { createWorkflow, openWorkflow, applyWorkflowCommand, materializeWorkflow } from "../../packages/station-workflow-authoring/index.js";
import { decodeDesignCandidate, type SubmitCandidate } from "../../packages/contracts/design-candidate/index.js";
import type { AuthorizationDecision } from "../../packages/contracts/identity-authorization/index.js";
import type { CurrentnessQualification, DefinitionRevisionRef } from "../../packages/contracts/semantic-substrate/index.js";
const now = "2026-10-12T12:00:00Z";
const who = { scopeRef: "scope:local", actorRef: "actor:builder", actorRevisionRef: "identity:1" };
function revision(id: string, version = "identity:1"): DefinitionRevisionRef { return { contractVersion: "1.0.0", semanticOwner: "identity", semanticKind: "evidence", canonicalRef: id, definitionRef: id, revisionOwner: "identity", revisionDimension: "definition", revisionRef: version }; }
function current(subject: DefinitionRevisionRef): CurrentnessQualification { return { contractVersion: "1.0.0", subject, revisionVector: [{ revisionOwner: subject.revisionOwner, revisionDimension: subject.revisionDimension, revisionRef: subject.revisionRef }], temporal: { occurredAt: null, observedAt: now, evaluatedAt: now, effectiveFrom: null, effectiveUntil: null, reconciledAt: null }, populationScope: who.scopeRef, localityScope: "local:1", currentnessHorizon: { assessedAt: now, validUntil: "2026-10-13T12:00:00Z" }, state: "CURRENT", reason: "isolated test qualification" }; }
function decision(request: Parameters<DesignAuthorizationPort["authorize"]>[1]): AuthorizationDecision {
  const identity = revision(who.actorRef), evidence = revision("authentication:1"), policy = revision("policy:1"), grant = revision("grant:1"), locality = { scopeKind: "STATION" as const, localityRef: "local:1" };
  return { contractVersion: "1.0.0", disposition: "ALLOW", request: { contractVersion: "1.0.0", actor: { contractVersion: "1.0.0", identity: { contractVersion: "1.0.0", identity }, authentication: { contractVersion: "1.0.0", subjectIdentity: identity, evidence, currentness: current(evidence), locality, state: "AUTHENTICATED" } }, authorityPolicy: policy, policyCurrentness: current(policy), authorizationEvidence: { contractVersion: "1.0.0", evidence: grant, currentness: current(grant), locality, state: "SUFFICIENT" }, requested: { action: request.action, resource: request.resource, scope: request.scopeRef, locality } } };
}
const auth: DesignAuthorizationPort = { async authorize(credential, request) { if (credential !== "isolated-test-token") throw new Error("denied"); return decision(request); } };
function candidate() {
  const r = createWorkflow({ artifactId: "urn:test:design-owner", createdAt: now, analysisRef: "analysis:unresolved", recipeRef: "recipe:unresolved", process: { id: "ticket", name: "Ticket", requirementRefs: ["req:1"], states: ["open"] } }); assert.ok(r.accepted);
  const input = JSON.parse(r.text); input.extensions = { "org.example.metadata": { note: "keep" } }; input.payload.sessionPolicy = { lifetimeSeconds: 300 };
  const opened = openWorkflow(input); assert.ok(opened.accepted);
  const edited = applyWorkflowCommand(opened.session, 0, { kind: "add-state", processId: "ticket", state: "closed" }); assert.ok(edited.accepted);
  const output = materializeWorkflow(edited.session, 1, "1.1.0", now); assert.ok(output.accepted); return output.document;
}
function command(commandRef = "command:1"): SubmitCandidate { return { ...who, commandRef, expectedOwnerRevision: null, candidate: candidate() }; }
function service(repo = new MemoryDesignCandidateRepository(), authorization = auth) { return new DesignCandidateService(repo, authorization, () => new Date(now)); }
test("actual WP15 candidate is retained exactly, full metadata survives, exact query never falls back", async () => {
  const s = service(), r = await s.submit("isolated-test-token", command()); assert.equal(r.status, "retained"); if (r.status !== "retained") return;
  const decoded = decodeDesignCandidate(r.record.text); assert.ok(decoded.accepted);
  assert.deepEqual(decoded.document, command().candidate); assert.equal(r.record.predecessorOwnerRevision, null); assert.match(r.record.digest, /^[0-9a-f]{64}$/);
  assert.deepEqual(await s.exact("isolated-test-token", { ...who, artifactId: r.record.artifactId, artifactVersion: "1.1.0" }), { status: "found", value: r.record });
  assert.deepEqual(await s.exact("isolated-test-token", { ...who, artifactId: r.record.artifactId, artifactVersion: "9.0.0" }), { status: "absent" });
});
test("durable-port command semantics replay original receipt, reject changed key and immutable tuple", async () => {
  const s = service(), c = command(), r = await s.submit("isolated-test-token", c);
  assert.deepEqual(await s.submit("isolated-test-token", c), r);
  assert.deepEqual(await s.submit("isolated-test-token", { ...c, expectedOwnerRevision: "changed" }), { status: "rejected", commandRef: c.commandRef, reason: "command-conflict" });
  assert.deepEqual(await s.submit("isolated-test-token", command("command:2")), { status: "rejected", commandRef: "command:2", reason: "immutable-conflict" });
  assert.deepEqual(await s.result("isolated-test-token", { ...who, commandRef: c.commandRef }), { status: "found", value: r });
});
test("competing owner revisions are atomic and rejection replay remains stable", async () => {
  const s = service(), r = await s.submit("isolated-test-token", command()); assert.equal(r.status, "retained"); if (r.status !== "retained") return;
  const next = (id: string, version: string): SubmitCandidate => ({ ...command(id), expectedOwnerRevision: r.record.ownerRevision, candidate: { ...candidate(), artifactVersion: version } });
  const [a,b] = await Promise.all([s.submit("isolated-test-token", next("command:a","1.2.0")), s.submit("isolated-test-token", next("command:b","1.3.0"))]);
  assert.equal(a.status, "retained"); assert.deepEqual(b, { status: "rejected", commandRef: "command:b", reason: "stale-owner-revision" });
  assert.deepEqual(await s.submit("isolated-test-token", next("command:b","1.3.0")), b);
});
test("missing credential, actor/scope mismatch, revoked/expired evidence and malformed candidate fail closed", async () => {
  const c = command(), s = service();
  for (const input of [c, { ...c, actorRef: "actor:other" }, { ...c, actorRevisionRef: "identity:2" }, { ...c, scopeRef: "scope:other" }]) assert.equal((await s.submit(input === c ? undefined : "isolated-test-token", input)).status, "rejected");
  for (const mode of ["expired","revoked"] as const) {
    const a: DesignAuthorizationPort = { async authorize(_credential, request) { const d = JSON.parse(JSON.stringify(decision(request))) as AuthorizationDecision; return mode === "revoked" ? { ...d, disposition: "DENY" } : { ...d, request: { ...d.request, policyCurrentness: { ...d.request.policyCurrentness, currentnessHorizon: { assessedAt: "2026-10-11T00:00:00Z", validUntil: "2026-10-11T01:00:00Z" } } } }; } };
    assert.deepEqual(await service(undefined,a).submit("isolated-test-token", c), { status: "rejected", commandRef: c.commandRef, reason: "denied" });
  }
  assert.equal((await s.submit("isolated-test-token", { ...c, candidate: { ...c.candidate, artifactVersion: "bad" } })).status, "rejected");
  assert.deepEqual(await s.head(undefined, { ...who, artifactId: c.candidate.artifactId }), { status: "denied" });
});
test("repository outage is unknown; committed receipt can be recovered after response loss", async () => {
  const repo = new MemoryDesignCandidateRepository(), original = repo.commit.bind(repo);
  repo.commit = async input => { await original(input); throw new Error("response lost"); };
  const s = service(repo), c = command(); assert.deepEqual(await s.submit("isolated-test-token", c), { status: "unknown", commandRef: c.commandRef, reason: "unavailable" });
  const result = await s.result("isolated-test-token", { ...who, commandRef: c.commandRef }); assert.equal(result.status, "found"); if (result.status === "found") assert.equal(result.value.status, "retained");
});
