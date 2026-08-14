import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";
import { runSupervisorCommand } from "../src/supervisor-cli.js";
import {
  buildTaskCatalogDag,
  LocalProcessCallbackTransport,
  mapSequentialReceipt,
  RepositorySequentialAdapter,
  supervisorRuntimePlanSchema,
  type SupervisorRuntimePlan,
} from "../src/supervisor-runtime.js";
import { SequentialPipelineCoordinator, type SequentialReceipt } from "../src/sequential-pipeline.js";
import { LocalTaskOrchestrator, type OrchestratorHarnessAdapter, type OrchestratorSnapshot } from "../src/orchestrator.js";
import type { Task } from "../src/task.js";

const at = "2026-08-14T12:00:00.000Z";

function task(id: string, status: Task["metadata"]["status"] = "ready", dependsOn: string[] = []): Task {
  return {
    file: `${id}.md`, source: id, body: id,
    metadata: {
      id, title: id, status, priority: Number(id.slice(5)), milestone: "I2-RUN", model_tier: "free", risk: "low",
      architecture_impact: false, executor_preference: "opencode", depends_on: dependsOn,
      context_paths: ["AGENTS.md"], allowed_paths: ["sandbox/**"], forbidden_paths: [], max_files: 2, validation: ["npm test"],
    },
  };
}

function plan(ids = ["TASK-100", "TASK-101"]): SupervisorRuntimePlan {
  return supervisorRuntimePlanSchema.parse({
    schema_version: 1,
    pipeline: { schema_version: 1, focus: "non-product proof", milestones: ["I2-RUN"], ordered_task_ids: ids },
    execution: Object.fromEntries(ids.map((id) => [id, {
      work_package_id: `WP-I2-${id.slice(5)}`,
      route: { risk: "LOW", model_tier: "T1", executor: "opencode", model: "test/model", architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK" },
    }])),
  });
}

function snapshot(value: Partial<OrchestratorSnapshot> = {}): OrchestratorSnapshot {
  return {
    task: task("TASK-100"), dependenciesCompleted: true, branchExists: false, prepared: false,
    implementationChanges: false, verificationPassed: false, pushed: false, mainSynchronized: true,
    closed: false, stateBranchExists: false, statePushed: false, execution: { attempts: 0 }, ...value,
  };
}

function fakeHarness(initial = snapshot()) {
  let current = initial;
  const calls: string[] = [];
  const harness: OrchestratorHarnessAdapter = {
    inspect: () => current,
    branch: () => { calls.push("branch"); current = { ...current, branchExists: true }; },
    prepare: () => { calls.push("prepare"); current = { ...current, prepared: true }; return "pack"; },
    taskPackPath: () => "pack",
    prepareExecution: () => ({}),
    verify: () => { calls.push("verify"); current = { ...current, verificationPassed: true }; },
    commit: () => { calls.push("commit"); current = { ...current, commit: "a".repeat(40) }; },
    push: () => { calls.push("push"); current = { ...current, pushed: true }; },
    openImplementationPr: () => calls.push("pr"),
    synchronizeMain: () => calls.push("sync"),
    close: () => calls.push("close"),
    createStateBranch: () => calls.push("state-branch"),
    commitState: () => calls.push("state-commit"),
    pushState: () => calls.push("state-push"),
    openStatePr: () => calls.push("state-pr"),
    recordExecution: () => calls.push("execution"),
    recordVerificationFailure: () => calls.push("verify-failed"),
  };
  return { harness, calls };
}

function writeLedger(root: string, completed: string[] = [], ready: string[] = ["TASK-100"]): void {
  const path = resolve(root, "docs/current/TASK_LEDGER.json");
  mkdirSync(resolve(root, "docs/current"), { recursive: true });
  writeFileSync(path, JSON.stringify({ completed, ready }));
}

function receipt(overrides: Partial<SequentialReceipt> = {}): SequentialReceipt {
  return {
    schema_version: 1, focus: "proof", selected_task_id: "TASK-100", selection_reason: "first",
    predecessor_gates: [{ task_id: "TASK-100", reconciled: false }],
    delegated: { previous_state: "READY", state: "BRANCHED", action: "task:branch" },
    route: { executor: "opencode", model: "test/model" }, validation: null, evidence_refs: [],
    implementation_pr: null, state_pr: null, state_closure_integrated: false, reconciled: false,
    readiness_before: ["TASK-100"], readiness_after: ["TASK-100"], stop_reason: "DELEGATED",
    observed_started_at: at, observed_finished_at: at, duration_seconds: 0, ...overrides,
  };
}

describe("AgentFactory local supervisor runtime bridge", () => {
  it("requires an exact execution plan for every ordered task", () => {
    const value = plan();
    assert.deepEqual(Object.keys(value.execution), ["TASK-100", "TASK-101"]);
    assert.throws(() => supervisorRuntimePlanSchema.parse({ ...value, execution: { "TASK-100": value.execution["TASK-100"] } }), /execution plan/);
    assert.throws(() => supervisorRuntimePlanSchema.parse({ ...value, execution: { ...value.execution, "TASK-999": value.execution["TASK-100"] } }), /must belong/);
  });

  it("derives the real dependency DAG and satisfies a gate only with completed repository evidence", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-supervisor-dag-"));
    const tasks = [task("TASK-100", "completed"), task("TASK-101", "ready", ["TASK-100"])];
    let graph = buildTaskCatalogDag(tasks, root);
    assert.equal(graph.nodes[1]!.dependency_gates[0]!.status, "UNSATISFIED");
    mkdirSync(resolve(root, "docs/evidence/tasks"), { recursive: true });
    writeFileSync(resolve(root, "docs/evidence/tasks/TASK-100.json"), "{}\n");
    graph = buildTaskCatalogDag(tasks, root);
    assert.equal(graph.nodes[1]!.dependency_gates[0]!.status, "SATISFIED");
    assert.deepEqual(graph.nodes[1]!.dependency_gates[0]!.evidence_refs, ["docs/evidence/tasks/TASK-100.json"]);
  });

  it("uses the real sequential coordinator and orchestrator for exactly one safe action", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-supervisor-adapter-"));
    writeLedger(root);
    const tasks = [task("TASK-100"), task("TASK-101", "ready", ["TASK-100"])];
    const fake = fakeHarness(snapshot({ task: tasks[0]! }));
    const orchestrator = new LocalTaskOrchestrator(fake.harness, []);
    const runtimePlan = plan();
    const adapter = new RepositorySequentialAdapter(root, runtimePlan, tasks, orchestrator, () => at, () => ({ evidence: null, ledger: null, readiness: null, evidence_refs: [] }));
    const coordinator = new SequentialPipelineCoordinator(runtimePlan.pipeline, tasks, buildTaskCatalogDag(tasks, root), adapter, () => at);
    const result = coordinator.advance();
    assert.equal(result.stop_reason, "DELEGATED");
    assert.equal(result.delegated?.action, "task:branch");
    assert.deepEqual(fake.calls, ["branch"]);
  });

  it("does not fabricate completed AFEV, ledger or readiness authority", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-supervisor-authority-"));
    writeLedger(root, ["TASK-100"], []);
    const completed = task("TASK-100", "completed");
    const fake = fakeHarness(snapshot({ task: completed, closed: true }));
    const adapter = new RepositorySequentialAdapter(root, plan(["TASK-100"]), [completed], new LocalTaskOrchestrator(fake.harness, []), () => at);
    const observation = adapter.observe();
    assert.equal(observation.authorities[0]!.agent_state, "DONE");
    assert.equal(observation.authorities[0]!.evidence, null);
    assert.equal(observation.authorities[0]!.ledger, null);
    assert.equal(observation.authorities[0]!.readiness, null);
  });

  it("maps progress, external waits, completion and deterministic failures without changing authority", () => {
    assert.equal(mapSequentialReceipt(receipt(), "payload").eventType, "TASK_SELECTED");
    assert.equal(mapSequentialReceipt(receipt({ delegated: { previous_state: "PREPARED", state: "EXECUTOR_FAILED", action: "execution boundary rejected" } }), "payload").eventType, "EXECUTOR_FAILED");
    assert.equal(mapSequentialReceipt(receipt({ delegated: { previous_state: "EXECUTING", state: "VERIFY_FAILED", action: "task:verify failed" } }), "payload").eventType, "VALIDATION_FAILED");
    assert.deepEqual(mapSequentialReceipt(receipt({ stop_reason: "EXTERNAL_GATE", delegated: null }), "payload"), {
      taskId: "TASK-100", payloadRef: "payload", eventType: "APPROVAL_REQUIRED", state: "EXTERNAL_WAIT",
    });
    assert.equal(mapSequentialReceipt(receipt({ stop_reason: "PIPELINE_COMPLETE", selected_task_id: null, delegated: null }), "payload").terminalStatus, "COMPLETE");
    assert.equal(mapSequentialReceipt(receipt({ stop_reason: "AUTHORITY_DIVERGENCE", delegated: null }), "payload").failureClass, "AUTHORITY_DIVERGENCE");
  });

  it("launches one finite local callback for progress and never auto-schedules an external wait", () => {
    const launches: Array<{ executable: string; args: string[]; cwd: string }> = [];
    const transport = new LocalProcessCallbackTransport("C:/repo", "C:/repo/plan.json", "C:/repo/supervisor-cli.ts", (executable, args, cwd) => {
      launches.push({ executable, args, cwd }); return true;
    });
    const base = { schema_version: 1 as const, pipeline_id: "proof", event_id: `AFEVT-${"a".repeat(64)}`, correlation_id: "corr" };
    assert.equal(transport.deliver({ ...base, reason: "TASK_SELECTED" }), true);
    assert.equal(launches.length, 1);
    assert.ok(launches[0]!.args.includes("callback"));
    assert.ok(launches[0]!.args.includes(base.event_id));
    assert.equal(transport.deliver({ ...base, event_id: `AFEVT-${"b".repeat(64)}`, reason: "APPROVAL_REQUIRED" }), true);
    assert.equal(launches.length, 1);
  });

  it("dispatches start, status, callback, heartbeat and resume exactly once", () => {
    const calls: string[] = [];
    const supervisor = {
      start: () => { calls.push("start"); return "start"; },
      status: () => { calls.push("status"); return "status"; },
      callback: () => { calls.push("callback"); return "callback"; },
      heartbeat: () => { calls.push("heartbeat"); return ["heartbeat"]; },
      resume: () => { calls.push("resume"); return "resume"; },
    };
    const factory = (() => ({ supervisor, plan: plan(), store: { readEvents: () => [] } })) as never;
    assert.equal(runSupervisorCommand(["start", "--plan", "plan.json", "--pipeline", "proof", "--correlation", "corr"], factory), "start");
    assert.deepEqual(runSupervisorCommand(["status", "--plan", "plan.json", "--pipeline", "proof"], factory), { projection: "status", last_event: null });
    assert.equal(runSupervisorCommand(["callback", "--plan", "plan.json", "--pipeline", "proof", "--event", `AFEVT-${"c".repeat(64)}`, "--correlation", "corr", "--reason", "wake"], factory), "callback");
    assert.deepEqual(runSupervisorCommand(["heartbeat", "--plan", "plan.json"], factory), ["heartbeat"]);
    assert.equal(runSupervisorCommand(["resume", "--plan", "plan.json", "--pipeline", "proof"], factory), "resume");
    assert.deepEqual(calls, ["start", "status", "callback", "heartbeat", "resume"]);
  });

  it("uses non-product fixtures and creates no TASK-010 branch, context, evidence or PR record", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-supervisor-no-product-"));
    const forbidden = [".agent/git/TASK-010.json", ".agent/context/TASK-010", ".agent/evidence/TASK-010.json"];
    for (const path of forbidden) assert.equal(existsSync(resolve(root, path)), false);
    buildTaskCatalogDag([task("TASK-100"), task("TASK-101", "ready", ["TASK-100"])], root);
    for (const path of forbidden) assert.equal(existsSync(resolve(root, path)), false);
  });
});
