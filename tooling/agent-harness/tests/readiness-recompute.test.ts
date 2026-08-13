import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DagGraph } from "../src/dag.js";
import { buildAgentFactoryEvidence } from "../src/evidence-writer.js";
import { applyLedgerTransition } from "../src/ledger-engine.js";
import { recomputeSuccessorReadiness } from "../src/readiness-recompute.js";
import { executorAdapterResultSchema, executorRequestSchema, taskRecordSchema } from "../src/execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "../src/execution-harness.js";
import type { ExecutorReport } from "../src/executor.js";
import { validationGateReceiptSchema } from "../src/validation-engine.js";

describe("AgentFactory successor readiness recomputation", () => {
  it("unblocks the affected successor and preserves an unrelated READY branch", () => {
    const input = fixture();
    const graphBefore = structuredClone(input.graph);
    const receipt = recomputeSuccessorReadiness(input);
    assert.deepEqual(receipt.previous_ready, ["WP-I1-10", "WP-I1-99"]);
    assert.deepEqual(receipt.current_ready, ["WP-I1-11", "WP-I1-99"]);
    assert.deepEqual(receipt.newly_ready, ["WP-I1-11"]);
    assert.deepEqual(receipt.changed_nodes, ["WP-I1-10"]);
    assert.deepEqual(receipt.changed_gates, ["GATE-I1-10-11"]);
    assert.deepEqual(receipt.graph.nodes.find((node) => node.id === "WP-I1-99"), graphBefore.nodes.find((node) => node.id === "WP-I1-99"));
    assert.deepEqual(input.graph, graphBefore);
  });

  it("keeps a successor blocked when another mandatory gate remains unsatisfied", () => {
    const input = fixture();
    input.graph.nodes.find((node) => node.id === "WP-I1-11")!.dependency_gates.push(gate("GATE-I1-09-11", "WP-I1-09", "WP-I1-11"));
    input.graph.external_nodes.push({ id: "WP-I1-09", state: "DONE" });
    const receipt = recomputeSuccessorReadiness(input);
    assert.ok(!receipt.current_ready.includes("WP-I1-11"));
    assert.deepEqual(receipt.changed_gates, ["GATE-I1-10-11"]);
  });

  it("fails closed for a rejected ledger receipt", () => {
    const input = fixture();
    const rejected = applyLedgerTransition({ task: task("READY"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", occurredAt, evidenceRef, evidence: input.evidence });
    assert.throws(() => recomputeSuccessorReadiness({ ...input, ledgerReceipt: rejected }), /LEDGER_NOT_ACCEPTED/);
  });

  it("fails closed for ledger/evidence identity mismatch", () => {
    const input = fixture();
    const other = { ...input.evidence, receipt_id: `AFEV-${"f".repeat(64)}` };
    assert.throws(() => recomputeSuccessorReadiness({ ...input, evidence: other }), /EVIDENCE_RECEIPT_MISMATCH/);
  });

  it("produces identical semantic receipts for equivalent inputs", () => {
    const input = fixture();
    assert.deepEqual(recomputeSuccessorReadiness(input), recomputeSuccessorReadiness(structuredClone(input)));
  });
});

const commit = "a".repeat(40);
const occurredAt = "2026-08-13T01:00:00.000Z";
const evidenceRef = "docs/evidence/agentfactory/TASK-100/attempt.json";
const request = executorRequestSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-10", source_commit: commit, attempt: 1, task_pack_path: ".agent/TASK_PACK.md", route: { risk: "LOW", model_tier: "T1", executor: "opencode", model: "provider/model", architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK" }, scope: { allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2 }, validation_commands: ["npm run verify"] });
const adapter = executorAdapterResultSchema.parse({ schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED", exit_code: 0, stdout: "done", stderr: "", failure: null });
const report: ExecutorReport = { executor: "opencode", attempt: 1, status: "completed", summary: "done", result: adapter, request };
const completion: ExecutionBoundaryCompletion = { boundary: { version: 1, taskId: "TASK-100", workPackageId: "WP-I1-10", branch: "task/100", baseCommit: commit, headCommit: commit, sourceCommit: commit, taskPackPath: ".agent/TASK_PACK.md", taskPackHash: "b".repeat(64), attempt: 1, repair: false, initialChangedFiles: [] }, changedFiles: ["docs/out.md"], violations: [], rawReport: report, report };

function fixture() {
  const evidence = buildAgentFactoryEvidence({ completion, validation: validationGateReceiptSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-10", source_commit: commit, changed_files: ["docs/out.md"], commands: [{ command: "npm run verify", status: "PASS", exit_code: 0, stdout: "ok", stderr: "" }], evaluator_changes: [], missing_evaluators: [], content_stable: true, decision: "PASS", reason_codes: [] }), headCommit: "c".repeat(40), changeFingerprint: "d".repeat(64), acceptance: [{ id: "AC-I1-READY", status: "PASS", evidence: "verified" }], satisfiedGates: ["GATE-I1-10-11"], blockedGates: [], metrics: { attempts: 1, execution_duration_seconds: null, review_duration_seconds: null, token_or_provider_cost: null } });
  const ledgerReceipt = applyLedgerTransition({ task: task("INTEGRATING"), to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", occurredAt, evidenceRef, evidence });
  const graph: DagGraph = { schema_version: 1, external_nodes: [], nodes: [
    { id: "WP-I1-10", state: "READY", dependency_gates: [] },
    { id: "WP-I1-11", state: "BLOCKED", dependency_gates: [gate("GATE-I1-10-11", "WP-I1-10", "WP-I1-11")] },
    { id: "WP-I1-99", state: "READY", dependency_gates: [] },
  ] };
  return { graph, ledgerReceipt, evidence, evidenceRef };
}
function task(state: "READY" | "INTEGRATING") {
  return taskRecordSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-10", milestone: "I1", title: "Readiness fixture", state, route: request.route, dependency_gates: [], context_paths: ["specs/tasks/TASK-100.md"], allowed_paths: ["docs/**"], forbidden_paths: [], max_files: 2, validation_commands: ["npm run verify"], acceptance_ids: ["AC-I1-READY"] });
}
function gate(id: string, predecessor: string, successor: string) {
  return { schema_version: 1 as const, id, predecessor_id: predecessor, successor_id: successor, type: "REQUIRES" as const, status: "UNSATISFIED" as const, evidence_refs: [] };
}
