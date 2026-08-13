import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAgentFactoryAttemptEvidence, buildAgentFactoryEvidence } from "../src/evidence-writer.js";
import { applyLedgerTransition, buildLedgerTransitionEvent, type LedgerTransitionRequest } from "../src/ledger-engine.js";
import { taskRecordSchema, executorAdapterResultSchema, executorRequestSchema } from "../src/execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "../src/execution-harness.js";
import type { ExecutorReport } from "../src/executor.js";
import { validationGateReceiptSchema } from "../src/validation-engine.js";

describe("AgentFactory ledger state transition engine", () => {
  it("accepts an explicit legal transition and emits a TASK-012 transition", () => {
    const receipt = applyLedgerTransition(request({
      task: taskRecord("READY"), to: "RUNNING", reasonCode: "EXECUTION_STARTED", evidence: event("EXECUTION_STARTED"),
    }));
    assert.equal(receipt.accepted, true);
    assert.equal(receipt.authoritative_task.state, "RUNNING");
    assert.equal(receipt.transition?.from, "READY");
    assert.equal(receipt.attempts[0]?.status, "ACCEPTED");
  });

  it("uses contemporaneous evidence for lifecycle and validation transitions", () => {
    const started = applyLedgerTransition(request({ task: taskRecord("READY"), to: "RUNNING", reasonCode: "EXECUTION_STARTED", evidence: event("EXECUTION_STARTED") }));
    assert.equal(started.accepted, true);
    const verifying = applyLedgerTransition(request({ task: taskRecord("RUNNING"), to: "VERIFICATION", reasonCode: "EXECUTOR_COMPLETED", evidence: event("EXECUTOR_COMPLETED") }));
    assert.equal(verifying.accepted, true);
    const evidenced = applyLedgerTransition(request({ task: taskRecord("VERIFICATION"), to: "EVIDENCED", reasonCode: "VALIDATION_PASSED", evidence: attemptEvidence() }));
    assert.equal(evidenced.accepted, true);
    assert.match(evidenced.attempts[0]!.evidence_receipt_id!, /^AFATT-/);
    const integrating = applyLedgerTransition(request({ task: taskRecord("EVIDENCED"), to: "INTEGRATING", reasonCode: "INTEGRATION_STARTED", evidence: event("INTEGRATION_STARTED") }));
    assert.equal(integrating.accepted, true);
  });

  it("accepts only compatible durable attempt outcomes for non-happy transitions", () => {
    const failedValidation = validationGateReceiptSchema.parse({
      ...validation(),
      decision: "FAIL",
      reason_codes: ["COMMAND_FAILED"],
      commands: [{ command: "npm run verify", status: "FAIL", exit_code: 1, stdout: "", stderr: "failed" }],
    });
    const failed = applyLedgerTransition(request({
      task: taskRecord("VERIFICATION"), to: "FAILED", reasonCode: "VALIDATION_FAILED",
      evidence: attemptEvidence({ validation: failedValidation }),
    }));
    assert.equal(failed.accepted, true);

    const reviewValidation = validationGateReceiptSchema.parse({
      ...validation(), decision: "REVIEW_REQUIRED", reason_codes: ["EVALUATOR_CHANGED"], evaluator_changes: ["tests/a.test.ts"],
    });
    const review = applyLedgerTransition(request({
      task: taskRecord("VERIFICATION"), to: "NEEDS_DECISION", reasonCode: "GOVERNANCE_DECISION_REQUIRED",
      evidence: attemptEvidence({ validation: reviewValidation }),
    }));
    assert.equal(review.accepted, true);

    const blockedCompletion: ExecutionBoundaryCompletion = {
      ...completion,
      violations: ["outside allowed paths: packages/escape.ts"],
      report: { ...report, status: "failed" },
    };
    const blocked = applyLedgerTransition(request({
      task: taskRecord("RUNNING"), to: "BLOCKED", reasonCode: "DEPENDENCY_BLOCKED",
      evidence: attemptEvidence({ completion: blockedCompletion }),
    }));
    assert.equal(blocked.accepted, true);
  });

  it("rejects a future event and the former final-envelope shortcut for early transitions", () => {
    const future = applyLedgerTransition(request({ evidence: event("EXECUTION_STARTED", "2026-08-13T01:00:01.000Z") }));
    assert.equal(future.accepted, false);
    assert.deepEqual(future.reason_codes, ["EVIDENCE_CAUSALITY_INVALID"]);
    const shortcut = applyLedgerTransition(request());
    assert.equal(shortcut.accepted, false);
    assert.deepEqual(shortcut.reason_codes, ["EVIDENCE_OUTCOME_INVALID"]);
  });

  it("rejects tampered, mismatched and incompatible attempt evidence", () => {
    const tampered = { ...event("EXECUTION_STARTED"), observed_at: "2026-08-13T00:59:59.000Z" };
    assert.deepEqual(applyLedgerTransition(request({ evidence: tampered })).reason_codes, ["EVIDENCE_INTEGRITY_INVALID"]);
    const mismatched = event("EXECUTION_STARTED", "2026-08-13T01:00:00.000Z", "TASK-101");
    assert.deepEqual(applyLedgerTransition(request({ evidence: mismatched })).reason_codes, ["EVIDENCE_IDENTITY_MISMATCH"]);
    const incompatible = applyLedgerTransition(request({ task: taskRecord("VERIFICATION"), to: "FAILED", reasonCode: "VALIDATION_FAILED", evidence: attemptEvidence() }));
    assert.deepEqual(incompatible.reason_codes, ["EVIDENCE_OUTCOME_INVALID"]);
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
function taskRecord(state: "READY" | "RUNNING" | "VERIFICATION" | "EVIDENCED" | "INTEGRATING", taskId = "TASK-100") {
  return taskRecordSchema.parse({ schema_version: 1, task_id: taskId, work_package_id: "WP-I1-10", milestone: "I1", title: "Ledger fixture", state, route: requestContract.route, dependency_gates: [], context_paths: ["specs/tasks/TASK-100.md"], allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2, validation_commands: ["npm run verify"], acceptance_ids: ["AC-I1-LEDGER"] });
}
function event(reasonCode: "EXECUTION_STARTED" | "EXECUTOR_COMPLETED" | "INTEGRATION_STARTED", observedAt = "2026-08-13T01:00:00.000Z", taskId = "TASK-100") {
  return buildLedgerTransitionEvent({ task_id: taskId, work_package_id: "WP-I1-10", reason_code: reasonCode, observed_at: observedAt });
}
function attemptEvidence(overrides: Partial<Parameters<typeof buildAgentFactoryAttemptEvidence>[0]> = {}) {
  return buildAgentFactoryAttemptEvidence({
    completion,
    validation: validation(),
    headCommit: "c".repeat(40),
    changeFingerprint: "d".repeat(64),
    acceptance: [{ id: "AC-I1-LEDGER", status: "PASS", evidence: "verified" }],
    satisfiedGates: [],
    blockedGates: [],
    attemptStartedAt: "2026-08-13T00:59:58.000Z",
    attemptFinishedAt: "2026-08-13T00:59:59.000Z",
    metrics: { attempts: 1, review_duration_seconds: null, token_or_provider_cost: null },
    ...overrides,
  });
}
function request(overrides: Partial<LedgerTransitionRequest> = {}): LedgerTransitionRequest {
  return { task: taskRecord("READY"), to: "RUNNING", reasonCode: "EXECUTION_STARTED", occurredAt: "2026-08-13T01:00:00.000Z", evidenceRef: "docs/evidence/agentfactory/TASK-100/attempt.json", evidence: evidence(), ...overrides };
}
