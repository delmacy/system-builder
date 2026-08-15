import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SequentialPipelineCoordinator, type SequentialPipelineAdapter } from "../src/sequential-pipeline.js";
import type { DagGraph } from "../src/dag.js";
import type { AdvanceResult } from "../src/orchestrator.js";
import type { Task } from "../src/task.js";

const at = "2026-08-13T03:10:00.000Z";
const commit = "a".repeat(40);
const evidenceId = `AFEV-${"b".repeat(64)}`;
const plan = { schema_version: 1, focus: "AgentFactory I2", milestones: ["I2-RUN"], ordered_task_ids: ["TASK-101", "TASK-102"] };

function task(id: string, status: Task["metadata"]["status"], dependencies: string[] = [], milestone = "I2-RUN"): Task {
  return { file: `${id}.md`, source: id, body: id, metadata: {
    id, title: id, status, priority: Number(id.slice(5)), milestone, model_tier: "cheap", risk: "low",
    architecture_impact: false, executor_preference: "opencode", depends_on: dependencies,
    context_paths: ["AGENTS.md"], allowed_paths: ["x/**"], forbidden_paths: [], max_files: 1, validation: ["npm test"],
  } };
}

function graph(firstDone = false, malformed = false): DagGraph {
  const gate = { schema_version: 1 as const, id: "GATE-101-102", predecessor_id: "TASK-101", successor_id: "TASK-102", type: "REQUIRES" as const,
    status: firstDone ? "SATISFIED" as const : "UNSATISFIED" as const, evidence_refs: firstDone ? ["evidence/101"] : [] };
  return { schema_version: 1, external_nodes: [], nodes: [
    { id: "TASK-101", state: firstDone ? "DONE" : "READY", dependency_gates: malformed ? [{ ...gate, predecessor_id: "TASK-102", successor_id: "TASK-101" }] : [] },
    { id: "TASK-102", state: "READY", dependency_gates: [gate] },
    { id: "TASK-999", state: "READY", dependency_gates: [] },
  ] };
}

function doneAuthority(overrides: Record<string, unknown> = {}) {
  return {
    task_id: "TASK-101", agent_state: "DONE", orchestrator_state: "DONE",
    route: { executor: "opencode", model: "free/model" }, validation: "PASS",
    evidence: { receipt_id: evidenceId, task_id: "TASK-101", head_commit: commit, status: "DONE" },
    ledger: { accepted: true, task_id: "TASK-101", state: "DONE", evidence_receipt_id: evidenceId },
    implementation_pr: { pr_number: 1, branch: "task/101", head_commit: commit, decision: "ELIGIBLE", reason_codes: [] },
    state_pr: { pr_number: 2, branch: "state/101", head_commit: "c".repeat(40), decision: "ELIGIBLE", reason_codes: [] },
    state_closure_integrated: true,
    readiness: { previous_ready: ["TASK-999"], current_ready: ["TASK-102", "TASK-999"], newly_ready: ["TASK-102"] },
    evidence_refs: ["docs/evidence/101.json"], ...overrides,
  };
}

function activeAuthority(overrides: Record<string, unknown> = {}) {
  return { task_id: "TASK-101", agent_state: "READY", orchestrator_state: "READY", route: null, validation: null,
    evidence: null, ledger: null, implementation_pr: null, state_pr: null, state_closure_integrated: false, readiness: null, evidence_refs: [], ...overrides };
}

function observation(authorities: unknown[], completed: string[] = [], ready: string[] = ["TASK-101", "TASK-999"]) {
  return { schema_version: 1, observed_at: at, bootstrap: { completed, ready }, authorities };
}

function adapter(value: unknown, resultState = "BRANCHED") {
  let calls = 0;
  const instance: SequentialPipelineAdapter = {
    observe: () => value,
    advanceTask: (id) => {
      calls += 1;
      return { taskId: id, previousState: "READY", state: resultState, action: "task:branch", stop: false, snapshot: {} } as AdvanceResult;
    },
  };
  return { instance, calls: () => calls };
}

function coordinator(input: { obs?: unknown; tasks?: Task[]; dag?: DagGraph; adapterState?: string } = {}) {
  const tasks = input.tasks ?? [task("TASK-101", "ready"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")];
  const harness = adapter(input.obs ?? observation([activeAuthority()]), input.adapterState);
  const times = [at, "2026-08-13T03:10:02.000Z"];
  return { coordinator: new SequentialPipelineCoordinator(plan, tasks, input.dag ?? graph(), harness.instance, () => times.shift() ?? at), calls: harness.calls };
}

describe("AgentFactory I2 sequential pipeline", () => {
  it("selects deterministically inside focus and ignores an independent READY task", () => {
    const run = coordinator();
    const receipt = run.coordinator.advance();
    assert.equal(receipt.selected_task_id, "TASK-101"); assert.equal(receipt.stop_reason, "DELEGATED"); assert.equal(run.calls(), 1);
  });

  it("fails closed on an invalid DAG", () => {
    assert.throws(() => coordinator({ dag: graph(false, true) }).coordinator.advance(), /Dependency cycle|gate/);
  });

  it("stops when DoR is not met", () => {
    const run = coordinator({ tasks: [task("TASK-101", "draft"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")] });
    assert.equal(run.coordinator.advance().stop_reason, "DOR_NOT_MET"); assert.equal(run.calls(), 0);
  });

  it("delegates an observed executor failure so the Supervisor can govern a classified retry", () => {
    const run = coordinator({ obs: observation([activeAuthority({ orchestrator_state: "EXECUTOR_FAILED" })]), adapterState: "EXECUTOR_FAILED" });
    assert.equal(run.coordinator.advance().stop_reason, "DELEGATED");
    assert.equal(run.calls(), 1);
  });

  it("stops on independent validation failure", () => {
    const run = coordinator({ obs: observation([activeAuthority({ orchestrator_state: "VERIFY_FAILED", validation: "FAIL" })]) });
    assert.equal(run.coordinator.advance().stop_reason, "VALIDATION_FAILED");
  });

  it("stops when final evidence is missing", () => {
    const run = coordinator({ obs: observation([doneAuthority({ evidence: null })], ["TASK-101"], ["TASK-999"]), tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "EVIDENCE_MISSING");
  });

  it("delegates exactly one selected-task closure action after bootstrap completion", () => {
    const authority = doneAuthority({ agent_state: "DONE", orchestrator_state: "STATE_PR_PENDING", evidence: null, ledger: null,
      state_pr: null, state_closure_integrated: false, readiness: null });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true), adapterState: "STATE_PR_PENDING" });
    assert.equal(run.coordinator.advance().stop_reason, "DELEGATED");
    assert.equal(run.calls(), 1);
  });

  it("preserves state CI and non-eligible review as external gates while closure is pending", () => {
    const pendingCi = doneAuthority({ agent_state: "DONE", orchestrator_state: "STATE_CI_PENDING", evidence: null, ledger: null,
      state_closure_integrated: false, readiness: null });
    const ciRun = coordinator({ obs: observation([pendingCi], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(ciRun.coordinator.advance().stop_reason, "EXTERNAL_GATE");
    assert.equal(ciRun.calls(), 0);

    const pendingReview = doneAuthority({ agent_state: "DONE", orchestrator_state: "STATE_REVIEW_REQUIRED", evidence: null, ledger: null,
      state_pr: { pr_number: 2, branch: "state/101", head_commit: "c".repeat(40), decision: "REVIEW_REQUIRED", reason_codes: ["REVIEW_MISSING"] },
      state_closure_integrated: false, readiness: null });
    const reviewRun = coordinator({ obs: observation([pendingReview], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(reviewRun.coordinator.advance().stop_reason, "EXTERNAL_GATE");
    assert.equal(reviewRun.calls(), 0);
  });

  it("delegates exactly one state merge when the closure lifecycle is already eligible", () => {
    const eligibleReview = doneAuthority({ agent_state: "DONE", orchestrator_state: "STATE_REVIEW_REQUIRED", evidence: null, ledger: null,
      state_closure_integrated: false, readiness: null });
    const run = coordinator({ obs: observation([eligibleReview], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true), adapterState: "STATE_MERGED" });
    assert.equal(run.coordinator.advance().stop_reason, "DELEGATED");
    assert.equal(run.calls(), 1);
  });

  it("stops PR_NOT_ELIGIBLE while closure is pending with no eligible implementation identity", () => {
    const authority = doneAuthority({ agent_state: "DONE", orchestrator_state: "STATE_PR_PENDING", evidence: null, ledger: null,
      implementation_pr: null, state_pr: null, state_closure_integrated: false, readiness: null });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true), adapterState: "STATE_PR_PENDING" });
    assert.equal(run.coordinator.advance().stop_reason, "PR_NOT_ELIGIBLE");
    assert.equal(run.calls(), 0);
  });

  it("stops STATE_CLOSURE_MISSING when agent authority closes without integrated state closure", () => {
    const run = coordinator({ obs: observation([doneAuthority({ state_closure_integrated: false })], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "STATE_CLOSURE_MISSING");
    assert.equal(run.calls(), 0);
  });

  it("stops READINESS_MISSING until the successor is derived from integrated evidence", () => {
    const authority = doneAuthority({ readiness: { previous_ready: ["TASK-999"], current_ready: ["TASK-999"], newly_ready: [] } });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "READINESS_MISSING");
    assert.equal(run.calls(), 0);
  });

  it("stops EVIDENCE_DIVERGENCE when final evidence has not reached DONE", () => {
    const authority = doneAuthority({ evidence: { receipt_id: evidenceId, task_id: "TASK-101", head_commit: commit, status: "NEEDS_DECISION" } });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "EVIDENCE_DIVERGENCE");
    assert.equal(run.calls(), 0);
  });

  it("stops AUTHORITY_DIVERGENCE when bootstrap completion lacks final agent authority", () => {
    const run = coordinator({ obs: observation([activeAuthority()], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "AUTHORITY_DIVERGENCE");
    assert.equal(run.calls(), 0);
  });

  it("stops on tampered evidence identity", () => {
    const authority = doneAuthority({ evidence: { receipt_id: evidenceId, task_id: "TASK-102", head_commit: commit, status: "DONE" } });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "EVIDENCE_DIVERGENCE"); assert.equal(run.calls(), 0);
  });

  it("stops on wrong implementation branch or SHA", () => {
    for (const implementation_pr of [
      { pr_number: 1, branch: "task/wrong", head_commit: commit, decision: "ELIGIBLE", reason_codes: [] },
      { pr_number: 1, branch: "task/101", head_commit: "d".repeat(40), decision: "ELIGIBLE", reason_codes: [] },
    ]) {
      const authority = doneAuthority({ implementation_pr });
      const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
        tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
      assert.notEqual(run.coordinator.advance().stop_reason, "PIPELINE_COMPLETE");
    }
  });

  it("stops while a required check is pending or missing", () => {
    for (const state of ["CI_PENDING", "PR_OPEN"]) {
      const run = coordinator({ obs: observation([activeAuthority({ orchestrator_state: state })]) });
      assert.equal(run.coordinator.advance().stop_reason, "EXTERNAL_GATE");
      assert.equal(run.calls(), 0);
    }
  });

  it("stops on state PR identity mismatch", () => {
    const authority = doneAuthority({ state_pr: { pr_number: 2, branch: "state/wrong", head_commit: "c".repeat(40), decision: "BLOCKED", reason_codes: ["IDENTITY_MISMATCH"] } });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.notEqual(run.coordinator.advance().stop_reason, "PIPELINE_COMPLETE");
  });

  it("stops on causal ledger divergence", () => {
    const authority = doneAuthority({ ledger: { accepted: true, task_id: "TASK-101", state: "DONE", evidence_receipt_id: `AFEV-${"e".repeat(64)}` } });
    const run = coordinator({ obs: observation([authority], ["TASK-101"], ["TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    assert.equal(run.coordinator.advance().stop_reason, "AUTHORITY_DIVERGENCE");
  });

  it("stops when bootstrap and AgentFactory authorities diverge", () => {
    const run = coordinator({ obs: observation([doneAuthority()], [], ["TASK-999"]),
      tasks: [task("TASK-101", "ready"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph() });
    assert.equal(run.coordinator.advance().stop_reason, "AUTHORITY_DIVERGENCE");
  });

  it("is restart-safe at external gates and does not duplicate an action", () => {
    const run = coordinator({ obs: observation([activeAuthority({ orchestrator_state: "CI_PENDING" })]) });
    assert.equal(run.coordinator.advance().stop_reason, "EXTERNAL_GATE");
    assert.equal(run.coordinator.advance().stop_reason, "EXTERNAL_GATE");
    assert.equal(run.calls(), 0);
  });

  it("runs a two-task happy path only after full predecessor reconciliation and never re-executes DONE", () => {
    const first = doneAuthority();
    const second = activeAuthority({ task_id: "TASK-102" });
    const run = coordinator({ obs: observation([first, second], ["TASK-101"], ["TASK-102", "TASK-999"]),
      tasks: [task("TASK-101", "completed"), task("TASK-102", "ready", ["TASK-101"]), task("TASK-999", "ready", [], "M1")], dag: graph(true) });
    const receipt = run.coordinator.advance();
    assert.equal(receipt.selected_task_id, "TASK-102");
    assert.equal(receipt.stop_reason, "DELEGATED");
    assert.equal(run.calls(), 1);
  });
});
