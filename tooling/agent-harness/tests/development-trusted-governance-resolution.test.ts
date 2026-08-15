import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAuthorityClosureBundle } from "../src/authority-closure.js";
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
const task: Task = { file: "TASK-100.md", source: "TASK-100", body: "TASK-100", metadata: {
  id: "TASK-100", title: "development trusted fixture", status: "ready", priority: 1, milestone: "I2",
  model_tier: "free", risk: "medium", architecture_impact: false, executor_preference: "opencode", depends_on: [],
  context_paths: ["AGENTS.md"], allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2, validation: ["npm run verify"],
} };
const request = executorRequestSchema.parse({
  schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I2-DEV", source_commit: source, attempt: 1,
  task_pack_path: ".agent/TASK_PACK.md", route: { risk: "MEDIUM", model_tier: "T1", executor: "opencode", model: "proof/model", architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_MODERATE_RISK" },
  scope: { allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2 }, validation_commands: ["npm run verify"],
});
const result = executorAdapterResultSchema.parse({ schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED", exit_code: 0, stdout: "done", stderr: "", failure: null });
const report: ExecutorReport = { executor: "opencode", attempt: 1, status: "completed", summary: "done", request, result };
const completion: ExecutionBoundaryCompletion = {
  boundary: { version: 1, taskId: "TASK-100", workPackageId: "WP-I2-DEV", branch: "task/100", baseCommit: source, headCommit: source, sourceCommit: source, taskPackPath: ".agent/TASK_PACK.md", taskPackHash: "b".repeat(64), attempt: 1, repair: false, initialChangedFiles: [] },
  changedFiles: ["docs/out.md"], violations: [], rawReport: report, report,
};
const validation = validationGateReceiptSchema.parse({
  schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I2-DEV", source_commit: source,
  changed_files: ["docs/out.md"], commands: [{ command: "npm run verify", status: "PASS", exit_code: 0, stdout: "ok", stderr: "" }],
  evaluator_changes: ["tooling/tests/proof.test.ts"], missing_evaluators: [], content_stable: true,
  decision: "REVIEW_REQUIRED", reason_codes: ["EVALUATOR_CHANGED"],
});
const lifecycle = evaluateGitHubLifecycle({
  prNumber: 10, state: "MERGED", branch: "task/100", baseBranch: "main", headCommit: head,
  expectedBranch: "task/100", expectedBaseBranch: "main", expectedHeadCommit: head,
  requiredChecks: ["validate"], checks: [{ name: "validate", status: "SUCCESS" }],
  validation: "REVIEW_REQUIRED", review: "NONE", reviewRequired: true,
  humanApproval: { decision: "DEVELOPMENT_TRUSTED", approval_id: null, reason_codes: [] },
});
const graph = { schema_version: 1 as const, external_nodes: [], nodes: [
  { id: "TASK-100", state: "READY" as const, dependency_gates: [] },
] };

describe("development trusted governance resolution", () => {
  it("resolves immutable REVIEW_REQUIRED evidence through the explicit development authority channel", () => {
    assert.equal(lifecycle.decision, "ELIGIBLE");
    assert.equal(lifecycle.approval_channel, "DEVELOPMENT_TRUSTED");
    const governanceResolution = buildGovernanceResolution({ validation, changeFingerprint: fingerprint, implementationLifecycle: lifecycle });
    const bundle = buildAuthorityClosureBundle({
      task, completion, validation, changeFingerprint: fingerprint, implementationLifecycle: lifecycle,
      governanceResolution, graph, acceptanceIds: ["AC-DEV-TRUST"], satisfiedGates: [],
      attemptStartedAt: "2026-08-15T06:00:00.000Z", attemptFinishedAt: "2026-08-15T06:00:02.000Z",
      integratedAt: "2026-08-15T06:05:00.000Z", stateBranch: "state/task-100-close",
    });
    assert.equal(bundle.evidence.result.status, "DONE");
    assert.equal(bundle.evidence.validation.decision, "PASS");
    assert.equal(bundle.governanceResolution?.implementation_lifecycle.approval_channel, "DEVELOPMENT_TRUSTED");
  });
});
