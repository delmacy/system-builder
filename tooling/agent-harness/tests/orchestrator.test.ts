import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  OpenCodeExecutor,
  boundedOpenCodeAgent,
  buildOpenCodeRuntimeConfig,
  resolveOpenCodeBashPermission,
  type CommandResult,
  type ExecutorAdapter,
  type ExecutorContext,
  type ExecutorReport,
} from "../src/executor.js";
import {
  LocalTaskOrchestrator,
  deriveOrchestratorState,
  type OrchestratorHarnessAdapter,
  type OrchestratorSnapshot,
  type PullRequestObservation,
} from "../src/orchestrator.js";
import type { Task } from "../src/task.js";

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
      statePr: { ...pr("SUCCESS"), state: "MERGED" },
    }));
    const result = new LocalTaskOrchestrator(harness, []).advance("TASK-010");
    assert.equal(result.state, "DONE");
    assert.deepEqual(harness.actions, ["sync:state"]);
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
    const executor = new OpenCodeExecutor(root, "opencode-test", undefined, runner);
    const context: ExecutorContext = { task: makeTask(), taskPackPath: pack, attempt: 1 };
    const report = executor.execute(context);
    const prompt = calls[1]?.args.at(-1) ?? "";
    assert.equal(report.status, "completed");
    assert.match(prompt, /allowed_paths/);
    assert.match(prompt, /Do not run git commit, git push, gh/);
    assert.match(prompt, /Do not access undeclared external context/);
    assert.equal(calls[1]?.args.includes("--auto"), false);
    assert.equal(calls[1]?.args.includes("--pure"), true);
    assert.deepEqual(calls[1]?.args.slice(4, 6), ["--agent", boundedOpenCodeAgent]);
    const fileIndex = calls[1]?.args.indexOf("--file") ?? -1;
    assert.equal(calls[1]?.args[fileIndex + 1], pack);
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

  it("fails clearly when OpenCode is not installed or configured", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-opencode-"));
    const pack = join(root, "TASK_PACK.md");
    writeFileSync(pack, "bounded pack\n");
    const executor = new OpenCodeExecutor(root, "missing-opencode", undefined, () => ({
      status: null,
      stdout: "",
      stderr: "",
      error: new Error("ENOENT"),
    }));
    assert.throws(() => executor.execute({ task: makeTask(), taskPackPath: pack, attempt: 1 }), /OpenCode is unavailable.*OPENCODE_EXECUTABLE/s);
  });
});

class FakeExecutor implements ExecutorAdapter {
  readonly name = "opencode";
  repairs = 0;
  private last?: ExecutorReport;

  canHandle(task: Task): boolean { return task.metadata.executor_preference !== "codex"; }
  execute(context: ExecutorContext): ExecutorReport { return this.complete(context); }
  repair(context: ExecutorContext): ExecutorReport { this.repairs += 1; return this.complete(context); }
  report(): ExecutorReport | undefined { return this.last; }
  private complete(context: ExecutorContext): ExecutorReport {
    this.last = { executor: this.name, attempt: context.attempt, status: "completed", summary: "done" };
    return this.last;
  }
}

class FakeHarness implements OrchestratorHarnessAdapter {
  actions: string[] = [];
  constructor(
    public value: OrchestratorSnapshot,
    private readonly alwaysFailVerify = false,
    private readonly executorProducesChanges = true,
  ) {}
  inspect(): OrchestratorSnapshot { return this.value; }
  branch(): void { this.actions.push("branch"); this.value.branchExists = true; }
  prepare(): string { this.actions.push("prepare"); this.value.prepared = true; return "TASK_PACK.md"; }
  taskPackPath(): string { return "TASK_PACK.md"; }
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
