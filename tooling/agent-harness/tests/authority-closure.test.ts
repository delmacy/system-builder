import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { authorityClosureFiles, buildAuthorityClosureBundle, writeAuthorityClosureBundle, type AuthorityClosureBundle, type AuthorityClosureInput } from "../src/authority-closure.js";
import { buildGovernanceResolution } from "../src/evidence-writer.js";
import { executorAdapterResultSchema, executorRequestSchema } from "../src/execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "../src/execution-harness.js";
import type { ExecutorReport } from "../src/executor.js";
import { evaluateGitHubLifecycle } from "../src/github-lifecycle.js";
import type { Task } from "../src/task.js";
import { validationGateReceiptSchema } from "../src/validation-engine.js";

const source = "a".repeat(40);
const head = "c".repeat(40);
const fingerprint = "d".repeat(64);
const started = "2026-08-14T10:00:00.000Z";
const finished = "2026-08-14T10:00:02.000Z";
const integrated = "2026-08-14T10:05:00.000Z";
const task: Task = { file: "TASK-100.md", source: "TASK-100", body: "TASK-100", metadata: {
  id: "TASK-100", title: "authority fixture", status: "ready", priority: 1, milestone: "I2",
  model_tier: "free", risk: "low", architecture_impact: false, executor_preference: "opencode", depends_on: [],
  context_paths: ["AGENTS.md"], allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2, validation: ["npm run verify"],
} };
const request = executorRequestSchema.parse({
  schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I2-06", source_commit: source, attempt: 1,
  task_pack_path: ".agent/TASK_PACK.md", route: { risk: "LOW", model_tier: "T1", executor: "opencode", model: "proof/model", architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK" },
  scope: { allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2 }, validation_commands: ["npm run verify"],
});
const result = executorAdapterResultSchema.parse({ schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED", exit_code: 0, stdout: "done", stderr: "", failure: null });
const report: ExecutorReport = { executor: "opencode", attempt: 1, status: "completed", summary: "done", request, result };
const completion: ExecutionBoundaryCompletion = {
  boundary: { version: 1, taskId: "TASK-100", workPackageId: "WP-I2-06", branch: "task/100", baseCommit: source, headCommit: source, sourceCommit: source, taskPackPath: ".agent/TASK_PACK.md", taskPackHash: "b".repeat(64), attempt: 1, repair: false, initialChangedFiles: [] },
  changedFiles: ["docs/out.md"], violations: [], rawReport: report, report,
};
const graph = { schema_version: 1 as const, external_nodes: [], nodes: [
  { id: "TASK-100", state: "READY" as const, dependency_gates: [] },
  { id: "TASK-101", state: "BLOCKED" as const, dependency_gates: [{ schema_version: 1 as const, id: "GATE-100-101", predecessor_id: "TASK-100", successor_id: "TASK-101", type: "REQUIRES" as const, status: "UNSATISFIED" as const, evidence_refs: [] }] },
] };

function validation(review = false) {
  return validationGateReceiptSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I2-06", source_commit: source,
    changed_files: ["docs/out.md"], commands: [{ command: "npm run verify", status: "PASS", exit_code: 0, stdout: "ok", stderr: "" }],
    evaluator_changes: review ? ["tooling/tests/proof.test.ts"] : [], missing_evaluators: [], content_stable: true,
    decision: review ? "REVIEW_REQUIRED" : "PASS", reason_codes: review ? ["EVALUATOR_CHANGED"] : [] });
}

function lifecycle(review = false) {
  return evaluateGitHubLifecycle({ prNumber: 10, state: "MERGED", branch: "task/100", baseBranch: "main", headCommit: head,
    expectedBranch: "task/100", expectedBaseBranch: "main", expectedHeadCommit: head, requiredChecks: ["validate"],
    checks: [{ name: "validate", status: "SUCCESS" }], validation: review ? "REVIEW_REQUIRED" : "PASS", review: "APPROVED", reviewRequired: true });
}

function input(review = false, overrides: Partial<AuthorityClosureInput> = {}): AuthorityClosureBundle {
  const receipt = validation(review);
  const implementationLifecycle = lifecycle(review);
  const governanceResolution = review ? buildGovernanceResolution({ validation: receipt, changeFingerprint: fingerprint, implementationLifecycle }) : undefined;
  return buildAuthorityClosureBundle({ task, completion, validation: receipt, changeFingerprint: fingerprint, implementationLifecycle,
    ...(governanceResolution ? { governanceResolution } : {}), graph, acceptanceIds: ["AC-I2-CLOSE"], satisfiedGates: ["GATE-100-101"],
    attemptStartedAt: started, attemptFinishedAt: finished, integratedAt: integrated, stateBranch: "state/task-100-close",
    ...overrides });
}

function bundle(review = false) {
  return input(review);
}

describe("prospective AgentFactory authority closure", () => {
  it("builds deterministic AFATT, final AFEV, causal ledger and successor readiness", () => {
    const first = bundle(); const second = bundle();
    assert.deepEqual(second, first);
    assert.equal(first.attempt.result.status, "DONE");
    assert.equal(first.evidence.result.status, "DONE");
    assert.equal(first.ledger.accepted, true);
    assert.deepEqual(first.readiness.newly_ready, ["TASK-101"]);
    assert.equal(first.manifest.files.length, 4);
  });

  it("resolves only immutable REVIEW_REQUIRED validation through an eligible exact lifecycle", () => {
    const resolved = bundle(true);
    assert.equal(resolved.attempt.result.status, "NEEDS_DECISION");
    assert.equal(resolved.evidence.result.status, "DONE");
    assert.equal(resolved.governanceResolution?.original_validation.decision, "REVIEW_REQUIRED");
    assert.equal(resolved.evidence.validation.decision, "PASS");
    const resolution = buildGovernanceResolution({ validation: validation(true), changeFingerprint: fingerprint, implementationLifecycle: lifecycle(true) });
    assert.throws(() => buildAuthorityClosureBundle({ task, completion, validation: validation(true), changeFingerprint: "e".repeat(64),
      implementationLifecycle: lifecycle(true), governanceResolution: resolution, graph, acceptanceIds: ["AC-I2-CLOSE"], satisfiedGates: ["GATE-100-101"],
      attemptStartedAt: started, attemptFinishedAt: finished, integratedAt: integrated, stateBranch: "state/task-100-close" }), /GOVERNANCE_RESOLUTION_INVALID/);
  });

  it("writes the exact append-only manifest idempotently and rejects divergence", () => {
    const root = mkdtempSync(join(tmpdir(), "authority-close-"));
    const value = bundle();
    const files = writeAuthorityClosureBundle(value, root);
    assert.deepEqual(writeAuthorityClosureBundle(value, root), files);
    assert.deepEqual(authorityClosureFiles("TASK-100", root), files);
    writeFileSync(join(root, value.manifest.files[0]!.path), "tampered\n");
    assert.throws(() => authorityClosureFiles("TASK-100", root), /FILE_DIVERGENCE/);
    assert.ok(readFileSync(join(root, "docs/evidence/agentfactory/TASK-100/manifest.json"), "utf8").includes(value.manifest.bundle_id));
  });

  it("blocks prospective closure on technical validation failure or timed-out commands", () => {
    const failed = validationGateReceiptSchema.parse({
      ...validation(false), decision: "FAIL", reason_codes: ["COMMAND_FAILED"],
      commands: [{ command: "npm run verify", status: "FAIL", exit_code: 1, stdout: "", stderr: "boom" }],
    });
    assert.throws(() => input(false, { validation: failed }), /AUTHORITY_CLOSURE_VALIDATION_FAILED/);
    const timedOut = validationGateReceiptSchema.parse({
      ...validation(false), decision: "FAIL", reason_codes: ["COMMAND_FAILED"],
      commands: [{ command: "npm run verify", status: "TIMED_OUT", exit_code: null, stdout: "", stderr: "" }],
    });
    assert.throws(() => input(false, { validation: timedOut }), /AUTHORITY_CLOSURE_VALIDATION_FAILED/);
  });

  it("blocks closure for an ineligible or pending implementation lifecycle", () => {
    const pending = evaluateGitHubLifecycle({ prNumber: 10, state: "OPEN", branch: "task/100", baseBranch: "main", headCommit: head,
      expectedBranch: "task/100", expectedBaseBranch: "main", expectedHeadCommit: head, requiredChecks: ["validate"],
      checks: [{ name: "validate", status: "PENDING" }], validation: "PASS", review: "NONE", reviewRequired: true });
    assert.throws(() => input(false, { implementationLifecycle: pending }), /AUTHORITY_CLOSURE_IMPLEMENTATION_NOT_ELIGIBLE/);
    const identityDrift = evaluateGitHubLifecycle({ prNumber: 10, state: "OPEN", branch: "task/100", baseBranch: "main", headCommit: head,
      expectedBranch: "task/100", expectedBaseBranch: "main", expectedHeadCommit: "b".repeat(40), requiredChecks: ["validate"],
      checks: [{ name: "validate", status: "SUCCESS" }], validation: "PASS", review: "APPROVED", reviewRequired: true });
    assert.throws(() => input(false, { implementationLifecycle: identityDrift }), /AUTHORITY_CLOSURE_IMPLEMENTATION_NOT_ELIGIBLE/);
  });

  it("cannot fabricate final DONE authority from an unresolved REVIEW_REQUIRED receipt", () => {
    assert.throws(() => buildAuthorityClosureBundle({
      task, completion, validation: validation(true), changeFingerprint: fingerprint, implementationLifecycle: lifecycle(true),
      graph, acceptanceIds: ["AC-I2-CLOSE"], satisfiedGates: ["GATE-100-101"],
      attemptStartedAt: started, attemptFinishedAt: finished, integratedAt: integrated, stateBranch: "state/task-100-close",
    }), /AUTHORITY_CLOSURE_LEDGER_REJECTED/);
  });

  it("resolves REVIEW_REQUIRED only through the exact immutable validation, fingerprint, checks and eligible lifecycle", () => {
    const resolved = bundle(true);
    assert.ok(resolved.governanceResolution);
    assert.deepEqual(resolved.governanceResolution.original_validation, validation(true));
    assert.equal(resolved.governanceResolution.change_fingerprint, fingerprint);
    assert.deepEqual(resolved.governanceResolution.implementation_lifecycle.required_checks, ["validate"]);
    assert.ok(resolved.governanceResolution.implementation_lifecycle.checks.every((check) => check.status === "SUCCESS"));
    assert.equal(resolved.governanceResolution.implementation_lifecycle.decision, "ELIGIBLE");
    assert.equal(resolved.governanceResolution.implementation_lifecycle.approval_channel, "GITHUB_REVIEW");
  });

  it("rejects governance resolution for missing evaluators, content mutation or a mismatched lifecycle", () => {
    const missingEvaluators = validationGateReceiptSchema.parse({ ...validation(true), missing_evaluators: ["tooling/tests/proof.test.ts"] });
    const missingResolution = buildGovernanceResolution({ validation: missingEvaluators, changeFingerprint: fingerprint, implementationLifecycle: lifecycle(true) });
    assert.throws(() => input(false, { validation: missingEvaluators, governanceResolution: missingResolution }), /GOVERNANCE_RESOLUTION_INVALID/);

    const mutated = validationGateReceiptSchema.parse({ ...validation(true), content_stable: false });
    const mutatedResolution = buildGovernanceResolution({ validation: mutated, changeFingerprint: fingerprint, implementationLifecycle: lifecycle(true) });
    assert.throws(() => input(false, { validation: mutated, governanceResolution: mutatedResolution }), /GOVERNANCE_RESOLUTION_INVALID/);

    const lifecycleMismatch = buildGovernanceResolution({ validation: validation(true), changeFingerprint: fingerprint, implementationLifecycle: lifecycle(false) });
    assert.throws(() => input(false, { validation: validation(true), governanceResolution: lifecycleMismatch }), /GOVERNANCE_RESOLUTION_INVALID/);

    const pendingLifecycle = evaluateGitHubLifecycle({ prNumber: 10, state: "OPEN", branch: "task/100", baseBranch: "main", headCommit: head,
      expectedBranch: "task/100", expectedBaseBranch: "main", expectedHeadCommit: head, requiredChecks: ["validate"],
      checks: [{ name: "validate", status: "PENDING" }], validation: "REVIEW_REQUIRED", review: "NONE", reviewRequired: true });
    const pendingResolution = buildGovernanceResolution({ validation: validation(true), changeFingerprint: fingerprint, implementationLifecycle: pendingLifecycle });
    assert.throws(() => input(false, { validation: validation(true), governanceResolution: pendingResolution }), /GOVERNANCE_RESOLUTION_INVALID/);
  });

  it("binds the exact state manifest to source head, final AFEV and state branch", () => {
    const value = bundle();
    assert.equal(value.manifest.source_commit, source);
    assert.equal(value.manifest.implementation_head, head);
    assert.equal(value.manifest.final_evidence_id, value.evidence.receipt_id);
    assert.equal(value.manifest.state_branch, "state/task-100-close");
    assert.equal(value.manifest.implementation_pr.decision, "ELIGIBLE");
    assert.deepEqual(value.manifest.files.map((file) => file.path).sort(), [
      `docs/evidence/agentfactory/TASK-100/attempt-1-${value.attempt.content_sha256}.json`,
      `docs/evidence/agentfactory/TASK-100/attempt-1-${value.evidence.content_sha256}.json`,
      "docs/evidence/agentfactory/TASK-100/ledger.json",
      "docs/evidence/agentfactory/TASK-100/readiness.json",
    ].sort());
  });

  it("records governance-resolution.json as an exact manifest member with a digestable sha256", () => {
    const root = mkdtempSync(join(tmpdir(), "authority-close-gov-"));
    const value = bundle(true);
    assert.equal(value.manifest.files.length, 5);
    assert.ok(value.governanceResolution);
    const entry = value.manifest.files.find((file) => file.path.endsWith("governance-resolution.json"));
    assert.ok(entry);
    assert.equal(entry.sha256, createHash("sha256").update(`${JSON.stringify(value.governanceResolution, null, 2)}\n`).digest("hex"));
    const files = writeAuthorityClosureBundle(value, root);
    assert.equal(files.length, 6);
    assert.ok(files.includes("docs/evidence/agentfactory/TASK-100/manifest.json"));
    assert.deepEqual(authorityClosureFiles("TASK-100", root), files);
  });

  it("refuses to write when the manifest records divergent file hashes", () => {
    const root = mkdtempSync(join(tmpdir(), "authority-close-div-"));
    const value = bundle();
    const tampered = {
      ...value,
      manifest: { ...value.manifest, files: value.manifest.files.map((file, index) => (index === 0 ? { ...file, sha256: "f".repeat(64) } : file)) },
    };
    assert.throws(() => writeAuthorityClosureBundle(tampered, root), /AUTHORITY_CLOSURE_MANIFEST_DIVERGENCE/);
  });

  it("rejects task and bundle identity divergence when reading a persisted manifest", () => {
    const root = mkdtempSync(join(tmpdir(), "authority-close-id-"));
    const value = bundle();
    writeAuthorityClosureBundle(value, root);
    const manifestPath = join(root, "docs/evidence/agentfactory/TASK-100/manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { task_id: string; bundle_id: string };
    writeFileSync(manifestPath, `${JSON.stringify({ ...manifest, task_id: "TASK-101" }, null, 2)}\n`);
    assert.throws(() => authorityClosureFiles("TASK-100", root), /TASK_DIVERGENCE/);
    writeFileSync(manifestPath, `${JSON.stringify({ ...manifest, bundle_id: `AFCLOSE-${"e".repeat(64)}` }, null, 2)}\n`);
    assert.throws(() => authorityClosureFiles("TASK-100", root), /ID_DIVERGENCE/);
  });
});
