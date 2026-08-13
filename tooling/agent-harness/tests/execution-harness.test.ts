import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executorAdapterResultSchema, executorRequestSchema, executionRouteSchema } from "../src/execution-contracts.js";
import { beginExecutionBoundary, enforceExecutionDelta, type BeginExecutionBoundaryInput } from "../src/execution-harness.js";
import type { ExecutorReport } from "../src/executor.js";
import type { Task } from "../src/task.js";

describe("AgentFactory execution harness boundary", () => {
  it("binds a clean prepared workspace to a validated executor request", () => {
    const start = beginExecutionBoundary(input());
    assert.equal(executorRequestSchema.safeParse(start.request).success, true);
    assert.equal(start.request.work_package_id, "WP-I1-06");
    assert.equal(start.request.source_commit, commit);
    assert.deepEqual(start.request.scope.allowed_paths, task.metadata.allowed_paths);
    assert.deepEqual(start.identity.initialChangedFiles, []);
  });

  it("rejects wrong or detached branches and a dirty initial implementation delta", () => {
    assert.throws(() => beginExecutionBoundary(input({ currentBranch: "other" })), /EXECUTION_BRANCH_MISMATCH/);
    assert.throws(() => beginExecutionBoundary(input({ currentBranch: "DETACHED" })), /EXECUTION_BRANCH_MISMATCH/);
    assert.throws(() => beginExecutionBoundary(input({ changedFiles: ["docs/out.md"] })), /EXECUTION_DIRTY_START/);
    assert.doesNotThrow(() => beginExecutionBoundary(input({ repair: true, changedFiles: ["docs/out.md"] })));
    assert.throws(
      () => beginExecutionBoundary(input({ repair: true, changedFiles: ["tooling/unsafe.ts"] })),
      /EXECUTION_UNSAFE_REPAIR_BASELINE/,
    );
  });

  it("rejects source, pack and route identity mismatches before execution", () => {
    assert.throws(() => beginExecutionBoundary(input({ sourceCommit: "b".repeat(40) })), /EXECUTION_SOURCE_MISMATCH/);
    assert.throws(() => beginExecutionBoundary(input({ headCommit: "b".repeat(40) })), /EXECUTION_HEAD_MISMATCH/);
    assert.throws(() => beginExecutionBoundary(input({ manifestTaskId: "TASK-999" })), /EXECUTION_TASK_MISMATCH/);
    assert.throws(() => beginExecutionBoundary(input({ actualTaskPackHash: "b".repeat(64) })), /EXECUTION_PACK_TAMPERED/);
    const blocked = executionRouteSchema.parse({ ...route, decision: "BLOCKED", executor: "human", model_tier: "HUMAN_GATE", model: null, rationale_code: "UNSUPPORTED_ROUTE" });
    assert.throws(() => beginExecutionBoundary(input({ plan: { workPackageId: "WP-I1-06", route: blocked } })), /EXECUTION_ROUTE_MISMATCH/);
  });

  it("preserves clean output and deterministically captures the repository delta", () => {
    const completion = enforceExecutionDelta(beginExecutionBoundary(input()), task, successReport(), [
      "specs/tasks/TASK-100.md", ".agent/evidence/ignored.json", "docs/out.md", "docs/out.md",
    ]);
    assert.equal(completion.report.status, "completed");
    assert.deepEqual(completion.changedFiles, ["docs/out.md"]);
    assert.deepEqual(completion.violations, []);
  });

  it("overrides adapter success for forbidden, outside and excess output", () => {
    const changed = ["docs/out.md", "docs/second.md", "tooling/unsafe.ts"];
    const completion = enforceExecutionDelta(beginExecutionBoundary(input()), task, successReport(), changed);
    assert.equal(completion.rawReport.status, "completed");
    assert.equal(completion.report.status, "failed");
    assert.equal(completion.report.result?.status, "BLOCKED");
    assert.equal(completion.report.result?.failure?.code, "EXECUTION_SCOPE_VIOLATION");
    assert.match(completion.report.summary, /forbidden paths/);
    assert.match(completion.report.summary, /outside allowed paths/);
    assert.match(completion.report.summary, /max_files/);
    assert.equal(executorAdapterResultSchema.safeParse(completion.report.result).success, true);
  });
});

const commit = "a".repeat(40);
const route = executionRouteSchema.parse({
  risk: "LOW",
  model_tier: "T1",
  executor: "opencode",
  model: "provider/model",
  architecture_impact: false,
  decision: "SELECTED",
  rationale_code: "BOUNDED_LOW_RISK",
});
const task: Task = {
  file: "specs/tasks/TASK-100.md",
  source: "task source",
  body: "task body",
  metadata: {
    id: "TASK-100",
    title: "Fixture",
    status: "ready",
    priority: 1,
    milestone: "I1",
    model_tier: "free",
    risk: "low",
    architecture_impact: false,
    executor_preference: "opencode",
    depends_on: [],
    context_paths: ["AGENTS.md"],
    allowed_paths: ["docs/**"],
    forbidden_paths: ["tooling/**"],
    max_files: 1,
    validation: ["npm run verify"],
  },
};

function input(overrides: Partial<BeginExecutionBoundaryInput> = {}): BeginExecutionBoundaryInput {
  return {
    task,
    taskFile: "specs/tasks/TASK-100.md",
    recordedTaskId: "TASK-100",
    manifestTaskId: "TASK-100",
    plan: { workPackageId: "WP-I1-06", route },
    executor: "opencode",
    attempt: 1,
    repair: false,
    expectedBranch: "task/100-fixture",
    currentBranch: "task/100-fixture",
    baseCommit: commit,
    headCommit: commit,
    sourceCommit: commit,
    taskPackPath: ".agent/context/TASK-100/TASK_PACK.md",
    taskPackHash: "a".repeat(64),
    actualTaskPackHash: "a".repeat(64),
    changedFiles: [],
    ...overrides,
  };
}

function successReport(): ExecutorReport {
  return {
    executor: "opencode",
    attempt: 1,
    status: "completed",
    summary: "done",
    result: executorAdapterResultSchema.parse({
      schema_version: 1,
      task_id: "TASK-100",
      attempt: 1,
      adapter: "opencode",
      status: "SUCCEEDED",
      exit_code: 0,
      stdout: "done",
      stderr: "",
      failure: null,
    }),
  };
}
