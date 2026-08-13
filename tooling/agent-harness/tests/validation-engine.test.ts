import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { executorAdapterResultSchema, executorRequestSchema } from "../src/execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "../src/execution-harness.js";
import { runIndependentValidation, validationGateReceiptSchema, type ValidationSnapshot } from "../src/validation-engine.js";
import type { ExecutorReport } from "../src/executor.js";
import { prepareTask, verifyTask } from "../src/harness.js";
import type { Task } from "../src/task.js";

describe("AgentFactory independent validation gate", () => {
  it("passes a stable in-scope execution with every declared command", () => {
    const calls: string[] = [];
    const receipt = runIndependentValidation(task, completion(), snapshot(), (command) => {
      calls.push(command);
      return { status: 0, stdout: "passed", stderr: "" };
    }, snapshot);
    assert.equal(receipt.decision, "PASS");
    assert.deepEqual(calls, task.metadata.validation);
    assert.equal(validationGateReceiptSchema.safeParse(receipt).success, true);
  });

  it("fails command errors and timeouts while still running all declared commands", () => {
    let call = 0;
    const receipt = runIndependentValidation(task, completion(), snapshot(), () => {
      call += 1;
      return call === 1
        ? { status: 1, stdout: "", stderr: "failed" }
        : { status: null, stdout: "", stderr: "timeout", timedOut: true };
    }, snapshot);
    assert.equal(receipt.decision, "FAIL");
    assert.deepEqual(receipt.reason_codes, ["COMMAND_FAILED", "COMMAND_TIMED_OUT"]);
    assert.equal(receipt.commands.length, 2);
  });

  it("requires review for changed evaluators and fails missing evaluators", () => {
    const review = runIndependentValidation(task, completion(), snapshot({
      evaluatorChanges: ["tooling/agent-harness/tests/gate.test.ts"],
    }), pass, snapshot);
    assert.equal(review.decision, "REVIEW_REQUIRED");
    assert.deepEqual(review.reason_codes, ["EVALUATOR_CHANGED"]);

    const missing = runIndependentValidation(task, completion(), snapshot({
      evaluatorChanges: ["tooling/agent-harness/tests/gate.test.ts"],
      missingEvaluators: ["tooling/agent-harness/tests/gate.test.ts"],
    }), pass, snapshot);
    assert.equal(missing.decision, "FAIL");
    assert.deepEqual(missing.reason_codes, ["EVALUATOR_MISSING"]);
  });

  it("fails a preexisting scope violation even when commands pass", () => {
    const receipt = runIndependentValidation(task, completion({ changedFiles: ["outside.ts"] }), snapshot({
      changedFiles: ["outside.ts"], fingerprint: "outside",
    }), pass, () => snapshot({ changedFiles: ["outside.ts"], fingerprint: "outside" }));
    assert.equal(receipt.decision, "FAIL");
    assert.deepEqual(receipt.reason_codes, ["SCOPE_VIOLATION"]);
  });

  it("detects same-file content mutation during validation", () => {
    const receipt = runIndependentValidation(task, completion(), snapshot(), pass, () => snapshot({ fingerprint: "changed" }));
    assert.equal(receipt.decision, "FAIL");
    assert.equal(receipt.content_stable, false);
    assert.deepEqual(receipt.reason_codes, ["VALIDATION_MUTATED_REPOSITORY"]);
  });

  it("integrates the independent receipt into task verification", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-validation-"));
    mkdirSync(join(root, "specs/tasks"), { recursive: true });
    mkdirSync(join(root, "docs"), { recursive: true });
    writeFileSync(join(root, "AGENTS.md"), "fixture\n");
    writeFileSync(join(root, ".gitignore"), ".agent/\n");
    writeFileSync(join(root, "specs/tasks/TASK-100.md"), `---
id: TASK-100
title: Fixture
status: ready
priority: 1
milestone: I1
model_tier: free
risk: low
architecture_impact: false
executor_preference: opencode
depends_on: []
context_paths:
  - AGENTS.md
allowed_paths:
  - docs/**
forbidden_paths:
  - tooling/**
max_files: 2
validation:
  - node -e "process.exit(0)"
---
# Objective
x
# Context
x
# Current behavior
x
# Required change
x
# Inputs / contracts
x
# Outputs / contracts
x
# Acceptance criteria
x
# Non-goals
x
# Evidence expected
x
# Escalation
x
`);
    git(root, ["init", "-b", "main"]);
    git(root, ["config", "user.email", "fixture@example.test"]);
    git(root, ["config", "user.name", "Fixture"]);
    git(root, ["add", "."]);
    git(root, ["commit", "-m", "baseline"]);
    const base = git(root, ["rev-parse", "HEAD"]);
    git(root, ["switch", "-c", "task/100-fixture"]);
    prepareTask("TASK-100", root);
    writeFileSync(join(root, "docs/out.md"), "output\n");
    const integratedRequest = executorRequestSchema.parse({
      ...request,
      source_commit: base,
      validation_commands: ["node -e \"process.exit(0)\""],
    });
    const integratedReport: ExecutorReport = { ...report, request: integratedRequest };
    const receipt = verifyTask("TASK-100", root, {
      boundary: {
        ...completion().boundary,
        baseCommit: base,
        headCommit: base,
        sourceCommit: base,
      },
      changedFiles: ["docs/out.md"],
      violations: [],
      rawReport: integratedReport,
      report: integratedReport,
    });
    assert.equal(receipt.validationGate?.decision, "PASS");
    assert.equal(receipt.status, "passed");
  });
});

const commit = "a".repeat(40);
const task: Task = {
  file: "specs/tasks/TASK-100.md",
  source: "source",
  body: "body",
  metadata: {
    id: "TASK-100", title: "Fixture", status: "ready", priority: 1, milestone: "I1",
    model_tier: "free", risk: "low", architecture_impact: false, executor_preference: "opencode",
    depends_on: [], context_paths: ["AGENTS.md"], allowed_paths: ["docs/**"], forbidden_paths: ["tooling/**"],
    max_files: 2, validation: ["npm run lint", "npm run test"],
  },
};
const adapterResult = executorAdapterResultSchema.parse({
  schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED",
  exit_code: 0, stdout: "done", stderr: "", failure: null,
});
const request = executorRequestSchema.parse({
  schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-07", source_commit: commit, attempt: 1,
  task_pack_path: ".agent/TASK_PACK.md",
  route: {
    risk: "LOW", model_tier: "T1", executor: "opencode", model: "provider/model", architecture_impact: false,
    decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK",
  },
  scope: { allowed_paths: ["docs/**"], forbidden_paths: ["tooling/**"], max_files: 2 },
  validation_commands: ["npm run lint", "npm run test"],
});
const report: ExecutorReport = {
  executor: "opencode", attempt: 1, status: "completed", summary: "done", result: adapterResult, request,
};

function completion(overrides: Partial<ExecutionBoundaryCompletion> = {}): ExecutionBoundaryCompletion {
  return {
    boundary: {
      version: 1, taskId: "TASK-100", workPackageId: "WP-I1-07", branch: "task/100-fixture",
      baseCommit: commit, headCommit: commit, sourceCommit: commit, taskPackPath: ".agent/TASK_PACK.md",
      taskPackHash: "b".repeat(64), attempt: 1, repair: false, initialChangedFiles: [],
    },
    changedFiles: ["docs/out.md"], violations: [], rawReport: report, report,
    ...overrides,
  };
}

function snapshot(overrides: Partial<ValidationSnapshot> = {}): ValidationSnapshot {
  return { changedFiles: ["docs/out.md"], fingerprint: "stable", evaluatorChanges: [], missingEvaluators: [], ...overrides };
}
function pass(): { status: number; stdout: string; stderr: string } { return { status: 0, stdout: "ok", stderr: "" }; }
function git(root: string, args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}
