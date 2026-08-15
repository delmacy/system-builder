import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { OpenCodeExecutor, type ExecutorAdapter } from "../src/executor.js";
import { evaluateStoredHumanApproval } from "../src/human-approval.js";
import { LocalTaskOrchestrator, type OrchestratorHarnessAdapter, type OrchestratorSnapshot } from "../src/orchestrator.js";
import type { Task } from "../src/task.js";

const now = "2026-08-15T08:00:00.000Z";
const commit = "a".repeat(40);

function architectureTask(id = "TASK-004"): Task {
  return {
    file: `specs/tasks/${id}.md`,
    source: "fixture",
    body: "fixture",
    metadata: {
      id,
      title: "architecture fixture",
      status: "ready",
      priority: 1,
      milestone: "M1",
      model_tier: "architecture",
      risk: "medium",
      architecture_impact: true,
      executor_preference: "codex",
      depends_on: ["TASK-003"],
      context_paths: ["AGENTS.md"],
      allowed_paths: ["packages/contracts/**"],
      forbidden_paths: ["apps/**"],
      max_files: 8,
      validation: ["npm run verify"],
    },
  };
}

function rootWithScope(overrides: Record<string, unknown> = {}): string {
  const root = mkdtempSync(join(tmpdir(), "development-scope-"));
  const directory = join(root, "tooling/agent-harness/policies");
  mkdirSync(directory, { recursive: true });
  const scope = {
    scope_type: "SPRINT",
    scope_id: "M1-SPRINT-01",
    task_ids: ["TASK-004", "TASK-005", "TASK-006"],
    risk_ceiling: "medium",
    allow_architecture: true,
    base_ref: "main",
    valid_from: "2026-08-15T00:00:00.000Z",
    expires_at: "2026-08-20T00:00:00.000Z",
    allowed_executors: ["opencode"],
    allowed_model_tiers: ["architecture"],
    allow_executor_override: true,
    ...overrides,
  };
  writeFileSync(join(directory, "HUMAN_APPROVAL.json"), JSON.stringify({
    schema_version: 1,
    policy_version: "1.1.0",
    mode: "DEVELOPMENT_TRUSTED",
    repository: "delmacy/system-builder",
    max_age_seconds: 604800,
    receipt_directory_env: "SYSTEM_BUILDER_HUMAN_APPROVAL_DIR",
    authorized_approvers: [],
    development_authority_scopes: [scope],
  }));
  return root;
}

function expected(taskId = "TASK-004") {
  return {
    repository: "delmacy/system-builder",
    taskId,
    risk: "medium" as const,
    architectureImpact: true,
    prNumber: 200,
    baseRef: "main",
    headRef: `task/${taskId.toLowerCase()}`,
    headSha: commit,
    observedAt: now,
  };
}

function withScope<T>(value: string | undefined, run: () => T): T {
  const previous = process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE;
  try {
    if (value === undefined) delete process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE;
    else process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE = value;
    return run();
  } finally {
    if (previous === undefined) delete process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE;
    else process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE = previous;
  }
}

function preparedSnapshot(task: Task): OrchestratorSnapshot {
  return {
    task,
    dependenciesCompleted: true,
    branchExists: true,
    prepared: true,
    implementationChanges: false,
    verificationPassed: false,
    pushed: false,
    mainSynchronized: true,
    closed: false,
    stateBranchExists: false,
    statePushed: false,
    execution: { attempts: 0 },
  };
}

function harness(snapshot: OrchestratorSnapshot): OrchestratorHarnessAdapter {
  return {
    inspect: () => snapshot,
    branch: () => undefined,
    prepare: () => "pack",
    taskPackPath: () => "TASK_PACK.md",
    prepareExecution: () => ({}),
    verify: () => undefined,
    commit: () => undefined,
    push: () => undefined,
    openImplementationPr: () => undefined,
    synchronizeMain: () => undefined,
    close: () => undefined,
    createStateBranch: () => undefined,
    commitState: () => undefined,
    pushState: () => undefined,
    openStatePr: () => undefined,
    recordExecution: () => undefined,
    recordVerificationFailure: () => undefined,
  };
}

const acceptingExecutor: ExecutorAdapter = {
  name: "opencode",
  canHandle: () => true,
  execute: () => ({ executor: "opencode", attempt: 1, status: "completed", summary: "ok" }),
  repair: () => ({ executor: "opencode", attempt: 1, status: "completed", summary: "ok" }),
  report: () => undefined,
};

describe("development sprint/work-package authority", () => {
  it("keeps architecture work gated when no development scope is selected", () => {
    const root = rootWithScope();
    const result = withScope(undefined, () => evaluateStoredHumanApproval(root, expected()));
    assert.equal(result.decision, "MISSING");
    assert.deepEqual(result.reason_codes, ["DEVELOPMENT_SCOPE_MISSING"]);
  });

  it("authorizes every PR identity for an architecture task covered by the selected sprint", () => {
    const root = rootWithScope();
    withScope("M1-SPRINT-01", () => {
      const implementation = evaluateStoredHumanApproval(root, expected());
      const state = evaluateStoredHumanApproval(root, { ...expected(), prNumber: 201, headRef: "state/task-004-close", headSha: "b".repeat(40) });
      assert.equal(implementation.decision, "DEVELOPMENT_TRUSTED");
      assert.equal(implementation.approval_id, "DEVSCOPE:M1-SPRINT-01");
      assert.deepEqual(state, implementation);
    });
  });

  it("fails closed when the selected scope does not cover task, risk, architecture or time", () => {
    const taskMismatch = rootWithScope();
    const riskExceeded = rootWithScope({ risk_ceiling: "low" });
    const architectureDenied = rootWithScope({ allow_architecture: false });
    const expired = rootWithScope({ expires_at: "2026-08-15T01:00:00.000Z" });
    withScope("M1-SPRINT-01", () => {
      assert.ok(evaluateStoredHumanApproval(taskMismatch, expected("TASK-007")).reason_codes.includes("DEVELOPMENT_SCOPE_TASK_MISMATCH"));
      assert.ok(evaluateStoredHumanApproval(riskExceeded, expected()).reason_codes.includes("DEVELOPMENT_SCOPE_RISK_EXCEEDED"));
      assert.ok(evaluateStoredHumanApproval(architectureDenied, expected()).reason_codes.includes("DEVELOPMENT_SCOPE_ARCHITECTURE_DISALLOWED"));
      assert.ok(evaluateStoredHumanApproval(expired, expected()).reason_codes.includes("DEVELOPMENT_SCOPE_EXPIRED"));
    });
  });

  it("lets OpenCode handle an explicitly scoped architecture task, including codex-to-opencode override", () => {
    const root = rootWithScope();
    withScope("M1-SPRINT-01", () => {
      const executor = new OpenCodeExecutor(root);
      assert.equal(executor.canHandle(architectureTask()), true);
    });
  });

  it("does not let OpenCode cross a scope executor or override boundary", () => {
    const noOverride = rootWithScope({ allow_executor_override: false });
    const wrongExecutor = rootWithScope({ allowed_executors: ["codex"] });
    withScope("M1-SPRINT-01", () => {
      assert.equal(new OpenCodeExecutor(noOverride).canHandle(architectureTask()), false);
      assert.equal(new OpenCodeExecutor(wrongExecutor).canHandle(architectureTask()), false);
    });
  });

  it("turns the architecture start gate into PREPARED only when an executor is explicitly available", () => {
    const snapshot = preparedSnapshot(architectureTask());
    assert.equal(new LocalTaskOrchestrator(harness(snapshot), []).inspect("TASK-004").state, "EXECUTOR_REQUIRED");
    assert.equal(new LocalTaskOrchestrator(harness(snapshot), [acceptingExecutor]).inspect("TASK-004").state, "PREPARED");
  });
});
