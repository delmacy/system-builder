import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  OpenCodeExecutor,
  boundedOpenCodeAgent,
  buildOpenCodeRuntimeConfig,
  maxOpenCodeAttempts,
  resolveOpenCodeBashPermission,
  type CommandResult,
  type ExecutorAdapter,
  type ExecutorContext,
  type ExecutorReport,
} from "../src/executor.js";
import { executorAdapterResultSchema, executorRequestSchema } from "../src/execution-contracts.js";
import { evaluateGitHubLifecycle } from "../src/github-lifecycle.js";
import {
  LocalTaskOrchestrator,
  deriveOrchestratorState,
  type OrchestratorHarnessAdapter,
  type OrchestratorSnapshot,
  type PullRequestObservation,
} from "../src/orchestrator.js";
import type { Task } from "../src/task.js";
import { normalizeOpenCodeModels, OpenCodeModelResolver } from "../src/opencode-models.js";
import { LocalHarnessAdapter } from "../src/orchestrator-runtime.js";

describe("Local Task Orchestrator", () => {
  it("advances READY by exactly one task:branch transition", () => {
    const harness = new FakeHarness(snapshot());
    const result = new LocalTaskOrchestrator(harness, [new FakeExecutor()]).advance("TASK-010");
    assert.equal(result.previousState, "READY");
    assert.equal(result.state, "BRANCHED");
    assert.deepEqual(harness.actions, ["branch"]);
  });

  it("resumes after PREPARED by invoking the bounded executor", () => {
    const harness = new FakeHarness(snapshot({ branchExists: true, prepared: true }));
    const result = new LocalTaskOrchestrator(harness, [new FakeExecutor()]).advance("TASK-010");
    assert.equal(result.state, "EXECUTING");
    assert.deepEqual(harness.actions, ["execute:completed"]);
  });

  it("passes the harness-validated request to the executor and stops on boundary rejection", () => {
    const request = executorRequestSchema.parse({
      schema_version: 1,
      task_id: "TASK-010",
      work_package_id: "WP-I1-06",
      source_commit: "a".repeat(40),
      attempt: 1,
      task_pack_path: "TASK_PACK.md",
      route: {
        risk: "LOW",
        model_tier: "T1",
        executor: "opencode",
        model: "provider/model",
        architecture_impact: false,
        decision: "SELECTED",
        rationale_code: "BOUNDED_LOW_RISK",
      },
      scope: { allowed_paths: ["docs/out.md"], forbidden_paths: ["tooling/**"], max_files: 1 },
      validation_commands: ["npm run test"],
    });
    const harness = new FakeHarness(snapshot({ branchExists: true, prepared: true }), false, true, { request });
    const executor = new FakeExecutor();
    new LocalTaskOrchestrator(harness, [executor]).advance("TASK-010");
    assert.deepEqual(executor.contexts[0]?.request, request);

    const failure: ExecutorReport = { executor: "opencode", attempt: 1, status: "failed", summary: "boundary rejected" };
    const blockedHarness = new FakeHarness(snapshot({ branchExists: true, prepared: true }), false, true, { failure });
    const blockedExecutor = new FakeExecutor();
    const result = new LocalTaskOrchestrator(blockedHarness, [blockedExecutor]).advance("TASK-010");
    assert.equal(result.state, "EXECUTOR_FAILED");
    assert.equal(blockedExecutor.contexts.length, 0);
    assert.deepEqual(blockedHarness.actions, ["execute:failed"]);
  });

  it("resumes after commit and push without repeating earlier actions", () => {
    const committed = new FakeHarness(snapshot({ branchExists: true, prepared: true, verificationPassed: true, commit: "abc" }));
    new LocalTaskOrchestrator(committed, []).advance("TASK-010");
    assert.deepEqual(committed.actions, ["push"]);

    const pushed = new FakeHarness(snapshot({ branchExists: true, prepared: true, verificationPassed: true, commit: "abc", pushed: true }));
    new LocalTaskOrchestrator(pushed, []).advance("TASK-010");
    assert.deepEqual(pushed.actions, ["open-pr"]);
  });

  it("observes an existing PR and stops while CI is pending", () => {
    const harness = new FakeHarness(snapshot({ implementationPr: pr("PENDING") }));
    const result = new LocalTaskOrchestrator(harness, []).advance("TASK-010");
    assert.equal(result.state, "CI_PENDING");
    assert.equal(result.stop, true);
    assert.deepEqual(harness.actions, []);
  });

  it("maps successful CI to REVIEW_REQUIRED without merging", () => {
    const harness = new FakeHarness(snapshot({ implementationPr: pr("SUCCESS") }));
    const result = new LocalTaskOrchestrator(harness, []).advance("TASK-010");
    assert.equal(result.state, "REVIEW_REQUIRED");
    assert.deepEqual(harness.actions, []);
  });

  it("reports CI failure and requested review changes as explicit gates", () => {
    assert.equal(deriveOrchestratorState(snapshot({ implementationPr: pr("FAILURE") })), "CI_FAILED");
    assert.equal(deriveOrchestratorState(snapshot({ implementationPr: { ...pr("SUCCESS"), review: "CHANGES_REQUESTED" } })), "REVIEW_CHANGES_REQUIRED");
  });

  it("detects implementation merge, synchronizes main and then closes", () => {
    const harness = new FakeHarness(snapshot({ implementationPr: { ...pr("SUCCESS"), state: "MERGED" } }));
    const orchestrator = new LocalTaskOrchestrator(harness, []);
    assert.equal(orchestrator.advance("TASK-010").state, "MERGED");
    assert.deepEqual(harness.actions, ["sync:implementation"]);
    assert.equal(orchestrator.advance("TASK-010").state, "CLOSED");
    assert.deepEqual(harness.actions, ["sync:implementation", "close"]);
  });

  it("delivers closure through a dedicated state branch, commit, push and PR", () => {
    const harness = new FakeHarness(snapshot({ closed: true, mainSynchronized: true }));
    const orchestrator = new LocalTaskOrchestrator(harness, []);
    orchestrator.advance("TASK-010");
    orchestrator.advance("TASK-010");
    orchestrator.advance("TASK-010");
    const result = orchestrator.advance("TASK-010");
    assert.deepEqual(harness.actions, ["state-branch", "state-commit", "state-push", "state-pr"]);
    assert.equal(result.state, "STATE_CI_PENDING");
  });

  it("waits for state PR review and finishes only after human merge and main sync", () => {
    assert.equal(deriveOrchestratorState(snapshot({ closed: true, stateBranchExists: true, stateCommit: "s", statePushed: true, statePr: pr("SUCCESS") })), "STATE_REVIEW_REQUIRED");
    const harness = new FakeHarness(snapshot({
      closed: true,
      stateBranchExists: true,
      stateCommit: "s",
      statePushed: true,
      statePr: { ...pr("SUCCESS"), state: "MERGED", lifecycle: stateLifecycle() },
    }));
    const result = new LocalTaskOrchestrator(harness, []).advance("TASK-010");
    assert.equal(result.state, "DONE");
    assert.deepEqual(harness.actions, ["sync:state"]);
  });

  it("blocks a raw merged state PR when hardened identity is not eligible", () => {
    const statePr = { ...pr("FAILURE"), state: "MERGED" as const, lifecycle: stateLifecycle(true) };
    assert.equal(deriveOrchestratorState(snapshot({
      closed: true, stateBranchExists: true, stateCommit: "s", statePushed: true, statePr,
    })), "BLOCKED");
  });

  it("is idempotent at the state review external gate and repeats no state action", () => {
    const harness = new FakeHarness(snapshot({ closed: true, stateBranchExists: true, stateCommit: "s", statePushed: true, statePr: pr("SUCCESS") }));
    const orchestrator = new LocalTaskOrchestrator(harness, []);
    const first = orchestrator.advance("TASK-010");
    assert.equal(first.state, "STATE_REVIEW_REQUIRED");
    orchestrator.advance("TASK-010");
    assert.deepEqual(harness.actions, []);
  });

  it("syncs main exactly once for an eligible merged state PR and then stops DONE", () => {
    const harness = new FakeHarness(snapshot({ closed: true, stateBranchExists: true, stateCommit: "s", statePushed: true,
      statePr: { ...pr("SUCCESS"), state: "MERGED", lifecycle: stateLifecycle() } }));
    assert.equal(deriveOrchestratorState(harness.value), "STATE_MERGED");
    const orchestrator = new LocalTaskOrchestrator(harness, []);
    assert.equal(orchestrator.advance("TASK-010").state, "DONE");
    assert.deepEqual(harness.actions, ["sync:state"]);
    assert.equal(orchestrator.advance("TASK-010").state, "DONE");
    assert.deepEqual(harness.actions, ["sync:state"]);
  });

  it("blocks a merged state PR whose lifecycle has an unsuccessful required check", () => {
    const blocked = evaluateGitHubLifecycle({ prNumber: 1, state: "MERGED", branch: "state/task-010-close", baseBranch: "main",
      headCommit: "a".repeat(40), expectedBranch: "state/task-010-close", expectedBaseBranch: "main", expectedHeadCommit: "a".repeat(40),
      requiredChecks: ["validate"], checks: [{ name: "validate", status: "FAILURE" }], validation: "PASS", review: "APPROVED", reviewRequired: true });
    assert.equal(deriveOrchestratorState(snapshot({
      closed: true, stateBranchExists: true, stateCommit: "s", statePushed: true,
      statePr: { ...pr("FAILURE"), state: "MERGED", lifecycle: blocked },
    })), "BLOCKED");
  });

  it("keeps prepared architecture and high-risk tasks at the human gate when no implementation exists", () => {
    for (const metadata of [
      { model_tier: "architecture" as const },
      { risk: "high" as const },
      { architecture_impact: true },
    ]) {
      const task = makeTask(metadata);
      const harness = new FakeHarness(snapshot({ task, branchExists: true, prepared: true }));
      const result = new LocalTaskOrchestrator(harness, [new FakeExecutor()]).advance(task.metadata.id);
      assert.equal(result.state, "ARCHITECTURE_REVIEW_REQUIRED");
      assert.deepEqual(harness.actions, []);
    }
  });

  it("resumes prepared architecture and high-risk tasks at verification when implementation exists", () => {
    for (const metadata of [
      { model_tier: "architecture" as const },
      { risk: "high" as const },
    ]) {
      const task = makeTask(metadata);
      const harness = new FakeHarness(snapshot({
        task,
        branchExists: true,
        prepared: true,
        implementationChanges: true,
      }));
      assert.equal(deriveOrchestratorState(harness.value), "EXECUTING");
      const result = new LocalTaskOrchestrator(harness, [new FakeExecutor()]).advance(task.metadata.id);
      assert.equal(result.previousState, "EXECUTING");
      assert.equal(result.state, "VERIFIED");
      assert.deepEqual(harness.actions, ["verify"]);
    }
  });

  it("uses bounded verification repair and becomes BLOCKED after three attempts", () => {
    const harness = new FakeHarness(snapshot({ branchExists: true, prepared: true }), true);
    const executor = new FakeExecutor();
    const orchestrator = new LocalTaskOrchestrator(harness, [executor], 3);
    for (let index = 0; index < 7; index += 1) orchestrator.advance("TASK-010");
    assert.equal(orchestrator.inspect("TASK-010").state, "BLOCKED");
    assert.equal(harness.value.execution.attempts, 3);
    assert.equal(executor.repairs, 2);
  });

  it("blocks after three executor runs that produce no implementation change", () => {
    const harness = new FakeHarness(snapshot({ branchExists: true, prepared: true }), false, false);
    const orchestrator = new LocalTaskOrchestrator(harness, [new FakeExecutor()], 3);
    for (let index = 0; index < 3; index += 1) orchestrator.advance("TASK-010");
    assert.equal(orchestrator.inspect("TASK-010").state, "BLOCKED");
  });

  it("resumes an interrupted executor from observable implementation changes", () => {
    const harness = new FakeHarness(snapshot({ branchExists: true, prepared: true, implementationChanges: true }));
    const result = new LocalTaskOrchestrator(harness, [new FakeExecutor()]).advance("TASK-010");
    assert.equal(result.state, "VERIFIED");
    assert.deepEqual(harness.actions, ["verify"]);
  });

  it("is idempotent at external gates", () => {
    const harness = new FakeHarness(snapshot({ implementationPr: pr("PENDING") }));
    const orchestrator = new LocalTaskOrchestrator(harness, []);
    orchestrator.advance("TASK-010");
    orchestrator.advance("TASK-010");
    assert.deepEqual(harness.actions, []);
  });

  it("task:run stops at CI instead of polling indefinitely", () => {
    const harness = new FakeHarness(snapshot());
    const transitions = new LocalTaskOrchestrator(harness, [new FakeExecutor()]).run("TASK-010");
    assert.equal(transitions.at(-1)?.state, "CI_PENDING");
    assert.ok(transitions.length < 10);
    assert.equal(harness.actions.includes("merge"), false);
  });

  it("stops with EXECUTOR_REQUIRED when no configured adapter can handle the task", () => {
    const harness = new FakeHarness(snapshot({ branchExists: true, prepared: true }));
    const result = new LocalTaskOrchestrator(harness, []).advance("TASK-010");
    assert.equal(result.state, "EXECUTOR_REQUIRED");
    assert.equal(result.stop, true);
  });
});

describe("OpenCode executor", () => {
  it("generates bounded instructions and grants no Git delivery authority", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const calls: Array<{ executable: string; args: string[]; environment?: Record<string, string> }> = [];
    const runner = (
      executable: string,
      args: string[],
      cwd: string,
      environment?: Record<string, string>,
    ): CommandResult => {
      assert.equal(cwd, root);
      calls.push({ executable, args, ...(environment ? { environment } : {}) });
      return { status: 0, stdout: "ok", stderr: "" };
    };
    const model = "provider/test-model";
    const executor = new OpenCodeExecutor(root, "opencode-test", model, runner);
    const context: ExecutorContext = { task: makeTask(), taskPackPath: pack, attempt: 1 };
    const report = executor.execute(context);
    const args = calls[1]?.args ?? [];
    const prompt = args.find((argument) => argument.startsWith("# Bounded executor instruction")) ?? "";
    assert.equal(report.status, "completed");
    assert.equal(executorAdapterResultSchema.safeParse(report.result).success, true);
    assert.ok(report.result);
    assert.equal(report.result.status, "SUCCEEDED");
    assert.equal(args[0], "run");
    assert.match(prompt, /allowed_paths/);
    assert.match(prompt, /Do not run git commit, git push, gh/);
    assert.match(prompt, /Do not access undeclared external context/);
    assert.equal(args.includes("--auto"), false);
    assert.equal(args.includes("--pure"), true);
    const formatIndex = args.indexOf("--format");
    assert.equal(args[formatIndex + 1], "json");
    const agentIndex = args.indexOf("--agent");
    assert.equal(args[agentIndex + 1], boundedOpenCodeAgent);
    const modelIndex = args.indexOf("--model");
    assert.equal(args[modelIndex + 1], model);
    const fileIndex = args.indexOf("--file");
    assert.ok(args.indexOf(prompt) < fileIndex);
    assert.deepEqual(args.slice(fileIndex + 1), [pack]);
    const inlineConfig = calls[1]?.environment?.OPENCODE_CONFIG_CONTENT;
    assert.ok(inlineConfig);
    assert.deepEqual(JSON.parse(inlineConfig), buildOpenCodeRuntimeConfig(context.task));
  });

  it("enforces deny-by-default permissions while preserving bounded edits and validation", () => {
    const task = makeTask();
    const config = buildOpenCodeRuntimeConfig(task) as {
      permission: {
        edit: Record<string, string>;
        external_directory: string;
        webfetch: string;
        websearch: string;
        task: string;
      };
      agent: Record<string, { permission: { edit: Record<string, string> } }>;
    };
    assert.equal(config.permission.edit["docs/out.md"], "allow");
    assert.equal(config.agent[boundedOpenCodeAgent]?.permission.edit["docs/out.md"], "allow");
    assert.equal(config.permission.external_directory, "deny");
    assert.equal(config.permission.webfetch, "deny");
    assert.equal(config.permission.websearch, "deny");
    assert.equal(config.permission.task, "deny");
    assert.equal(resolveOpenCodeBashPermission(task, "npm run test"), "allow");
    assert.equal(resolveOpenCodeBashPermission(task, "git status --short"), "allow");
    assert.equal(resolveOpenCodeBashPermission(task, "git diff --stat"), "allow");
  });

  it("cannot authorize Git or GitHub delivery commands requested by a model", () => {
    const task = makeTask();
    for (const command of [
      "git commit -m bypass",
      "git push origin main",
      "git merge feature",
      "git rebase main",
      "git reset --hard HEAD~1",
      "git add .",
      "git switch main",
      "gh pr create --fill",
      "gh pr edit 1 --title bypass",
      "gh pr merge 1 --merge",
      "gh pr comment 1 --body bypass",
    ]) {
      assert.equal(resolveOpenCodeBashPermission(task, command), "deny", command);
    }
  });

  it("returns a structured blocked result when OpenCode is not installed or configured", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const executor = new OpenCodeExecutor(root, "missing-opencode", undefined, () => ({
      status: null,
      stdout: "",
      stderr: "",
      error: new Error("ENOENT"),
    }));
    const report = executor.execute({ task: makeTask(), taskPackPath: pack, attempt: 1 });
    assert.equal(report.status, "failed");
    assert.ok(report.result);
    assert.equal(report.result.status, "BLOCKED");
    assert.equal(report.result.failure?.code, "ADAPTER_UNAVAILABLE");
    assert.match(report.summary, /OpenCode is unavailable.*OPENCODE_EXECUTABLE/s);
  });

  it("consumes a versioned executor request and preserves deterministic argument order", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-request-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const calls: Array<{ args: string[]; timeoutMs?: number }> = [];
    const runner = (
      _executable: string,
      args: string[],
      _cwd: string,
      _environment?: Record<string, string>,
      timeoutMs?: number,
    ): CommandResult => {
      calls.push({ args, ...(timeoutMs === undefined ? {} : { timeoutMs }) });
      return { status: 0, stdout: "ok", stderr: "" };
    };
    const task = makeTask();
    const request = executorRequestSchema.parse({
      schema_version: 1,
      task_id: task.metadata.id,
      work_package_id: "WP-I1-05",
      source_commit: "6582afe794b6f7e9d97661b2051493a16905bc21",
      attempt: 1,
      task_pack_path: "TASK_PACK.md",
      route: {
        risk: "LOW",
        model_tier: "T1",
        executor: "opencode",
        model: "provider/request-model",
        architecture_impact: false,
        decision: "SELECTED",
        rationale_code: "BOUNDED_LOW_RISK",
      },
      scope: {
        allowed_paths: task.metadata.allowed_paths,
        forbidden_paths: task.metadata.forbidden_paths,
        max_files: task.metadata.max_files,
      },
      validation_commands: task.metadata.validation,
    });
    const report = new OpenCodeExecutor(root, "opencode-test", undefined, runner, 12_345).execute({
      task,
      taskPackPath: pack,
      attempt: 1,
      request,
    });
    assert.deepEqual(report.request, request);
    assert.ok(report.result);
    assert.equal(report.result.status, "SUCCEEDED");
    const args = calls[1]?.args ?? [];
    assert.equal(args[0], "run");
    assert.ok(args.indexOf("--model") < args.indexOf("--file"));
    assert.equal(args[args.indexOf("--model") + 1], "provider/request-model");
    assert.deepEqual(args.slice(args.indexOf("--file") + 1), [pack]);
    assert.deepEqual(calls.map((call) => call.timeoutMs), [12_345, 12_345]);
  });

  it("passes exactly the dynamically resolved model and records its resolution", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-resolved-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const calls: string[][] = [];
    const runner = (_executable: string, args: string[]): CommandResult => { calls.push(args); return { status: 0, stdout: "ok", stderr: "" }; };
    const task = makeTask();
    const request = executorRequestSchema.parse({
      schema_version: 1, task_id: task.metadata.id, work_package_id: "WP-I1-05",
      source_commit: "6582afe794b6f7e9d97661b2051493a16905bc21", attempt: 1, task_pack_path: "TASK_PACK.md",
      route: { risk: "LOW", model_tier: "T1", executor: "opencode", model: null, architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK" },
      scope: { allowed_paths: task.metadata.allowed_paths, forbidden_paths: task.metadata.forbidden_paths, max_files: task.metadata.max_files },
      validation_commands: task.metadata.validation,
    });
    const modelResolver = new OpenCodeModelResolver({ listModels: () => normalizeOpenCodeModels({ object: "list", data: [
      { id: "mimo-v2.5-free", object: "model", owned_by: "opencode" },
      { id: "deepseek-v4-flash-free", object: "model", owned_by: "opencode" },
    ] }) }, { cachePath: join(root, ".agent/runtime/models.json"), cacheTtlSeconds: 300, now: () => "2026-08-14T12:00:00.000Z" });
    const report = new OpenCodeExecutor(root, "opencode-test", undefined, runner, 12_345, {
      resolver: modelResolver,
      selectors: { [task.metadata.id]: { free: true, preference: ["deepseek", "mimo"] } },
    }).execute({ task, taskPackPath: pack, attempt: 1, request });
    const args = calls[1] ?? [];
    assert.equal(args[args.indexOf("--model") + 1], "opencode/deepseek-v4-flash-free");
    assert.equal(report.result?.model_resolution?.selected_model, "deepseek-v4-flash-free");
    assert.equal(report.result?.model_resolution?.source, "api");
  });

  it("does not read ambient OPENCODE_MODEL or OPENCODE_EXECUTABLE in default construction", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-hermetic-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const previousModel = process.env.OPENCODE_MODEL;
    const previousExecutable = process.env.OPENCODE_EXECUTABLE;
    const calls: Array<{ executable: string; args: string[] }> = [];
    try {
      process.env.OPENCODE_MODEL = "ambient-paid-model";
      process.env.OPENCODE_EXECUTABLE = "ambient-executable";
      const executor = new OpenCodeExecutor(root, undefined, undefined, (executable, args) => {
        calls.push({ executable, args }); return { status: 0, stdout: "ok", stderr: "" };
      });
      executor.execute({ task: makeTask(), taskPackPath: pack, attempt: 1 });
      assert.equal(calls[0]?.executable, "opencode");
      assert.equal((calls[1]?.args ?? []).includes("--model"), false);
    } finally {
      if (previousModel === undefined) delete process.env.OPENCODE_MODEL; else process.env.OPENCODE_MODEL = previousModel;
      if (previousExecutable === undefined) delete process.env.OPENCODE_EXECUTABLE; else process.env.OPENCODE_EXECUTABLE = previousExecutable;
    }
  });

  it("persists model resolution in the durable local execution journal", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-model-journal-"));
    mkdirSync(join(root, "specs/tasks"), { recursive: true });
    writeFileSync(join(root, "specs/tasks/TASK-100.md"), `---
id: TASK-100
title: Journal fixture
status: ready
priority: 100
milestone: M-TEST
model_tier: free
risk: low
architecture_impact: false
executor_preference: opencode
depends_on: []
context_paths:
  - AGENTS.md
allowed_paths:
  - docs/**
forbidden_paths: []
max_files: 1
validation:
  - npm test
---

fixture

# Objective
fixture
# Context
fixture
# Current behavior
fixture
# Required change
fixture
# Inputs / contracts
fixture
# Outputs / contracts
fixture
# Acceptance criteria
fixture
# Non-goals
fixture
# Evidence expected
fixture
# Escalation
fixture
`);
    const result = executorAdapterResultSchema.parse({
      schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED",
      exit_code: 0, stdout: "done", stderr: "", failure: null,
      model_resolution: {
        requested_selector: { free: true, preference: ["deepseek"] },
        selected_model: "deepseek-v4-flash-free", source: "api", resolved_at: "2026-08-14T12:00:00.000Z",
      },
    });
    new LocalHarnessAdapter(root).recordExecution("TASK-100", { executor: "opencode", attempt: 1, status: "completed", summary: "done", result });
    const journal = JSON.parse(readFileSync(join(root, ".agent/orchestrator/TASK-100.json"), "utf8")) as { executions: Array<{ rawResult: typeof result }> };
    assert.equal(journal.executions[0]?.rawResult.model_resolution?.selected_model, "deepseek-v4-flash-free");
  });

  it("propagates nonzero exit and timeout as structured failures without false success", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-failure-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const task = makeTask();
    const nonzero = new OpenCodeExecutor(root, "opencode-test", undefined, (_exe, args) => (
      args[0] === "--version"
        ? { status: 0, stdout: "1.0", stderr: "" }
        : { status: 7, stdout: "partial", stderr: "provider failed" }
    )).execute({ task, taskPackPath: pack, attempt: 1 });
    assert.equal(nonzero.status, "failed");
    assert.ok(nonzero.result);
    assert.equal(nonzero.result.status, "FAILED");
    assert.equal(nonzero.result.exit_code, 7);
    assert.equal(nonzero.result.failure?.code, "NONZERO_EXIT");
    assert.equal(nonzero.result.failure?.retryable, true);

    const timeout = new OpenCodeExecutor(root, "opencode-test", undefined, (_exe, args) => (
      args[0] === "--version"
        ? { status: 0, stdout: "1.0", stderr: "" }
        : { status: null, stdout: "", stderr: "", timedOut: true }
    )).execute({ task, taskPackPath: pack, attempt: maxOpenCodeAttempts });
    assert.equal(timeout.status, "failed");
    assert.ok(timeout.result);
    assert.equal(timeout.result.status, "TIMED_OUT");
    assert.equal(timeout.result.failure?.code, "EXECUTION_TIMEOUT");
    assert.equal(timeout.result.failure?.retryable, false);
  });

  it("blocks attempts and timeout settings beyond their configured bounds", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-bounds-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const task = makeTask();
    let calls = 0;
    const executor = new OpenCodeExecutor(root, "opencode-test", undefined, () => {
      calls += 1;
      return { status: 0, stdout: "ok", stderr: "" };
    });
    const report = executor.execute({ task, taskPackPath: pack, attempt: maxOpenCodeAttempts + 1 });
    assert.ok(report.result);
    assert.equal(report.result.status, "BLOCKED");
    assert.equal(report.result.failure?.code, "ATTEMPT_LIMIT_EXCEEDED");
    assert.equal(calls, 0);
    assert.throws(() => new OpenCodeExecutor(root, "opencode-test", undefined, undefined, 0), /timeout/);
  });
});

class FakeExecutor implements ExecutorAdapter {
  readonly name = "opencode";
  repairs = 0;
  contexts: ExecutorContext[] = [];
  private last?: ExecutorReport;

  canHandle(task: Task): boolean { return task.metadata.executor_preference !== "codex"; }
  execute(context: ExecutorContext): ExecutorReport { return this.complete(context); }
  repair(context: ExecutorContext): ExecutorReport { this.repairs += 1; return this.complete(context); }
  report(): ExecutorReport | undefined { return this.last; }
  private complete(context: ExecutorContext): ExecutorReport {
    this.contexts.push(context);
    this.last = {
      executor: this.name,
      attempt: context.attempt,
      status: "completed",
      summary: "done",
      result: executorAdapterResultSchema.parse({
        schema_version: 1,
        task_id: context.task.metadata.id,
        attempt: context.attempt,
        adapter: "opencode",
        status: "SUCCEEDED",
        exit_code: 0,
        stdout: "done",
        stderr: "",
        failure: null,
      }),
    };
    return this.last;
  }
}

class FakeHarness implements OrchestratorHarnessAdapter {
  actions: string[] = [];
  constructor(
    public value: OrchestratorSnapshot,
    private readonly alwaysFailVerify = false,
    private readonly executorProducesChanges = true,
    private readonly preparation: { request?: ReturnType<typeof executorRequestSchema.parse>; failure?: ExecutorReport } = {},
  ) {}
  inspect(): OrchestratorSnapshot { return this.value; }
  branch(): void { this.actions.push("branch"); this.value.branchExists = true; }
  prepare(): string { this.actions.push("prepare"); this.value.prepared = true; return "TASK_PACK.md"; }
  taskPackPath(): string { return "TASK_PACK.md"; }
  prepareExecution(): { request?: ReturnType<typeof executorRequestSchema.parse>; failure?: ExecutorReport } {
    return this.preparation;
  }
  verify(): void {
    this.actions.push("verify");
    if (this.alwaysFailVerify) throw new Error("correctable verification error");
    this.value.verificationPassed = true;
    delete this.value.execution.lastVerificationFailure;
  }
  commit(): void { this.actions.push("commit"); this.value.commit = "commit"; }
  push(): void { this.actions.push("push"); this.value.pushed = true; }
  openImplementationPr(): void { this.actions.push("open-pr"); this.value.implementationPr = pr("PENDING"); }
  synchronizeMain(_taskId: string, phase: "implementation" | "state"): void {
    this.actions.push(`sync:${phase}`);
    this.value.mainSynchronized = true;
  }
  close(): void { this.actions.push("close"); this.value.closed = true; }
  createStateBranch(): void { this.actions.push("state-branch"); this.value.stateBranchExists = true; this.value.mainSynchronized = false; }
  commitState(): void { this.actions.push("state-commit"); this.value.stateCommit = "state-commit"; }
  pushState(): void { this.actions.push("state-push"); this.value.statePushed = true; }
  openStatePr(): void { this.actions.push("state-pr"); this.value.statePr = pr("PENDING"); }
  recordExecution(_taskId: string, report: ExecutorReport): void {
    this.actions.push(`execute:${report.status}`);
    this.value.execution.attempts += 1;
    this.value.execution.lastExecutor = report.executor;
    if (report.status === "failed") this.value.execution.lastExecutorFailure = report.summary;
    else {
      delete this.value.execution.lastExecutorFailure;
      delete this.value.execution.lastVerificationFailure;
      this.value.implementationChanges = this.executorProducesChanges;
    }
  }
  recordVerificationFailure(_taskId: string, failure: string): void {
    this.value.execution.lastVerificationFailure = failure;
    this.value.verificationPassed = false;
  }
}

function snapshot(overrides: Partial<OrchestratorSnapshot> = {}): OrchestratorSnapshot {
  return {
    task: makeTask(),
    dependenciesCompleted: true,
    branchExists: false,
    prepared: false,
    implementationChanges: false,
    verificationPassed: false,
    pushed: false,
    mainSynchronized: false,
    closed: false,
    stateBranchExists: false,
    statePushed: false,
    execution: { attempts: 0 },
    ...overrides,
  };
}

function pr(ci: PullRequestObservation["ci"]): PullRequestObservation {
  return { number: 1, url: "https://example.invalid/pr/1", state: "OPEN", ci, review: "NONE" };
}

function stateLifecycle(identityMismatch = false) {
  const commit = "a".repeat(40);
  return evaluateGitHubLifecycle({
    prNumber: 1,
    state: "MERGED",
    branch: identityMismatch ? "state/task-999-close" : "state/task-010-close",
    baseBranch: "main",
    headCommit: commit,
    expectedBranch: "state/task-010-close",
    expectedBaseBranch: "main",
    expectedHeadCommit: commit,
    requiredChecks: ["validate"],
    checks: [{ name: "validate", status: "SUCCESS" }],
    validation: "PASS",
    review: "APPROVED",
    reviewRequired: true,
  });
}

function makeTask(overrides: Partial<Task["metadata"]> = {}): Task {
  const metadata: Task["metadata"] = {
    id: "TASK-010",
    title: "Fixture task",
    status: "ready",
    priority: 10,
    milestone: "M-TEST",
    model_tier: "free",
    risk: "low",
    architecture_impact: false,
    executor_preference: "opencode",
    depends_on: [],
    context_paths: ["TASK_PACK.md"],
    allowed_paths: ["docs/out.md"],
    forbidden_paths: ["tooling/**"],
    max_files: 1,
    validation: ["npm run test"],
    ...overrides,
  };
  return { file: "specs/tasks/TASK-010.md", metadata, source: "task source", body: "task body" };
}
