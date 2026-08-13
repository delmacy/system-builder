import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAgentFactoryEvidence } from "../src/evidence-writer.js";
import { applyLedgerTransition, type LedgerTransitionRequest } from "../src/ledger-engine.js";
import { taskRecordSchema, executorAdapterResultSchema, executorRequestSchema } from "../src/execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "../src/execution-harness.js";
import type { ExecutorReport } from "../src/executor.js";
import { validationGateReceiptSchema } from "../src/validation-engine.js";

describe("AgentFactory ledger state transition engine", () => {
  it("accepts an explicit legal transition and emits a TASK-012 transition", () => {
    const receipt = applyLedgerTransition(request({
      task: taskRecord("READY"), to: "RUNNING", reasonCode: "EXECUTION_STARTED",
    }));
    assert.equal(receipt.accepted, true);
    assert.equal(receipt.authoritative_task.state, "RUNNING");
    assert.equal(receipt.transition?.from, "READY");
    assert.equal(receipt.attempts[0]?.status, "ACCEPTED");
  });

  it("rejects an illegal transition and preserves authoritative state", () => {
    const task = taskRecord("READY");
    const receipt = applyLedgerTransition(request({ task, to: "DONE", reasonCode: "INTEGRATION_ACCEPTED" }));
    assert.equal(receipt.accepted, false);
    assert.deepEqual(receipt.authoritative_task, task);
    assert.deepEqual(receipt.reason_codes, ["ILLEGAL_TRANSITION"]);
    assert.equal(receipt.attempts[0]?.status, "REJECTED");
  });

  it("rejects identity and semantic hash mismatches", () => {
    const identity = applyLedgerTransition(request({ task: taskRecord("INTEGRATING", "TASK-101"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED" }));
    assert.equal(identity.accepted, false);
    assert.deepEqual(identity.reason_codes, ["EVIDENCE_IDENTITY_MISMATCH"]);

    const tampered = { ...evidence(), head_commit: "e".repeat(40) };
    const integrity = applyLedgerTransition(request({ task: taskRecord("INTEGRATING"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", evidence: tampered }));
    assert.equal(integrity.accepted, false);
    assert.deepEqual(integrity.reason_codes, ["EVIDENCE_INTEGRITY_INVALID"]);
  });

  it("accepts DONE only from INTEGRATING with validated DONE evidence", () => {
    const accepted = applyLedgerTransition(request({ task: taskRecord("INTEGRATING"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED" }));
    assert.equal(accepted.accepted, true);
    assert.equal(accepted.authoritative_task.state, "DONE");

    const needsDecision = evidence({
      validation: validationGateReceiptSchema.parse({ ...validation(), decision: "REVIEW_REQUIRED", reason_codes: ["EVALUATOR_CHANGED"], evaluator_changes: ["tests/a.test.ts"] }),
    });
    const rejected = applyLedgerTransition(request({ task: taskRecord("INTEGRATING"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", evidence: needsDecision }));
    assert.equal(rejected.accepted, false);
    assert.deepEqual(rejected.reason_codes, ["DONE_EVIDENCE_INVALID"]);
  });

  it("appends rejected attempts without changing prior attempts or task", () => {
    const first = applyLedgerTransition(request({ task: taskRecord("READY"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED" }));
    const prior = structuredClone(first.attempts);
    const task = taskRecord("READY");
    const second = applyLedgerTransition(request({ task, to: "FAILED", reasonCode: "VALIDATION_FAILED", priorAttempts: first.attempts }));
    assert.deepEqual(second.authoritative_task, task);
    assert.deepEqual(second.attempts.slice(0, 1), prior);
    assert.equal(second.attempts[1]?.sequence, 2);
  });
});

const commit = "a".repeat(40);
const requestContract = executorRequestSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-10", source_commit: commit, attempt: 1, task_pack_path: ".agent/TASK_PACK.md", route: { risk: "LOW", model_tier: "T1", executor: "opencode", model: "provider/model", architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK" }, scope: { allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2 }, validation_commands: ["npm run verify"] });
const adapter = executorAdapterResultSchema.parse({ schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED", exit_code: 0, stdout: "done", stderr: "", failure: null });
const report: ExecutorReport = { executor: "opencode", attempt: 1, status: "completed", summary: "done", result: adapter, request: requestContract };
const completion: ExecutionBoundaryCompletion = { boundary: { version: 1, taskId: "TASK-100", workPackageId: "WP-I1-10", branch: "task/100", baseCommit: commit, headCommit: commit, sourceCommit: commit, taskPackPath: ".agent/TASK_PACK.md", taskPackHash: "b".repeat(64), attempt: 1, repair: false, initialChangedFiles: [] }, changedFiles: ["docs/out.md"], violations: [], rawReport: report, report };

function validation() {
  return validationGateReceiptSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-10", source_commit: commit, changed_files: ["docs/out.md"], commands: [{ command: "npm run verify", status: "PASS", exit_code: 0, stdout: "ok", stderr: "" }], evaluator_changes: [], missing_evaluators: [], content_stable: true, decision: "PASS", reason_codes: [] });
}
function evidence(overrides: Record<string, unknown> = {}) {
  return buildAgentFactoryEvidence({ completion, validation: validation(), headCommit: "c".repeat(40), changeFingerprint: "d".repeat(64), acceptance: [{ id: "AC-I1-LEDGER", status: "PASS", evidence: "verified" }], satisfiedGates: [], blockedGates: [], metrics: { attempts: 1, execution_duration_seconds: null, review_duration_seconds: null, token_or_provider_cost: null }, ...overrides });
}
function taskRecord(state: "READY" | "INTEGRATING", taskId = "TASK-100") {
  return taskRecordSchema.parse({ schema_version: 1, task_id: taskId, work_package_id: "WP-I1-10", milestone: "I1", title: "Ledger fixture", state, route: requestContract.route, dependency_gates: [], context_paths: ["specs/tasks/TASK-100.md"], allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2, validation_commands: ["npm run verify"], acceptance_ids: ["AC-I1-LEDGER"] });
}
function request(overrides: Partial<LedgerTransitionRequest> = {}): LedgerTransitionRequest {
  return { task: taskRecord("READY"), to: "RUNNING", reasonCode: "EXECUTION_STARTED", occurredAt: "2026-08-13T01:00:00.000Z", evidenceRef: "docs/evidence/agentfactory/TASK-100/attempt.json", evidence: evidence(), ...overrides };
}
