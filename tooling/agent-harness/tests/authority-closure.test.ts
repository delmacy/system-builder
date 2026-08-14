import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { authorityClosureFiles, buildAuthorityClosureBundle, writeAuthorityClosureBundle } from "../src/authority-closure.js";
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

function bundle(review = false) {
  const receipt = validation(review);
  const implementationLifecycle = lifecycle(review);
  const governanceResolution = review ? buildGovernanceResolution({ validation: receipt, changeFingerprint: fingerprint, implementationLifecycle }) : undefined;
  return buildAuthorityClosureBundle({ task, completion, validation: receipt, changeFingerprint: fingerprint, implementationLifecycle,
    ...(governanceResolution ? { governanceResolution } : {}), graph, acceptanceIds: ["AC-I2-CLOSE"], satisfiedGates: ["GATE-100-101"],
    attemptStartedAt: started, attemptFinishedAt: finished, integratedAt: integrated, stateBranch: "state/task-100-close" });
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
});
