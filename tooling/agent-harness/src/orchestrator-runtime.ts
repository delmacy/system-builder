import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import type { ExecutorReport } from "./executor.js";
import {
  beginExecutionBoundary,
  boundaryFailureReport,
  enforceExecutionDelta,
  type ExecutionBoundaryCompletion,
  type ExecutionBoundaryStart,
  type ExecutionPlan,
} from "./execution-harness.js";
import type { ExecutorRequest } from "./execution-contracts.js";
import {
  branchTask,
  commitStateTask,
  commitTask,
  createStateTaskBranch,
  openStateTaskPullRequest,
  openTaskPullRequest,
  pushStateTask,
  pushTask,
  readGitRecord,
  readStateRecord,
  taskGitStatus,
  fingerprintChanges,
  writeGitRecord,
  writeStateRecord,
  type GitTaskRecord,
} from "./git-workflow.js";
import { changedPaths, git } from "./git.js";
import { closeTask, prepareTask, verifyTask } from "./harness.js";
import type {
  CheckState,
  ExecutionObservation,
  OrchestratorHarnessAdapter,
  OrchestratorSnapshot,
  PullRequestObservation,
  ReviewState,
} from "./orchestrator.js";
import { getTask, loadTasks, repoPath, validateTaskCatalog } from "./task.js";

type Journal = {
  version: 1;
  taskId: string;
  executions: Array<ExecutorReport & {
    recordedAt: string;
    boundary?: ExecutionBoundaryCompletion["boundary"];
    changedFiles?: string[];
    violations?: string[];
    rawResult?: ExecutorReport["result"];
  }>;
  lastVerificationFailure?: string;
};

type GitHubPullRequest = {
  number: number;
  url: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  reviewDecision: string;
  mergeCommit: { oid: string } | null;
  statusCheckRollup: Array<{ status?: string; conclusion?: string | null }>;
  createdAt?: string;
};

export class LocalHarnessAdapter implements OrchestratorHarnessAdapter {
  private readonly activeBoundaries = new Map<string, ExecutionBoundaryStart>();

  constructor(
    private readonly root = process.cwd(),
    private readonly ghExecutable = "gh",
    private readonly executionPlans: Readonly<Record<string, ExecutionPlan>> = {},
  ) {}

  inspect(taskId: string): OrchestratorSnapshot {
    const tasks = loadTasks(this.root);
    validateTaskCatalog(tasks);
    const task = getTask(tasks, taskId);
    const completed = new Set(tasks.filter((item) => item.metadata.status === "completed").map((item) => item.metadata.id));
    const gitRecord = readGitRecord(taskId, this.root);
    const stateRecord = readStateRecord(taskId, this.root);
    const manifest = readJson<{ baseCommit?: string; taskHash?: string; packHash?: string }>(this.contextManifestPath(taskId));
    const receipt = readJson<{
      status?: string;
      changedFiles?: string[];
      taskHash?: string;
      packHash?: string;
      changeFingerprint?: string;
    }>(this.receiptPath(taskId));
    const journal = this.readJournal(taskId);
    const gitStatus = safely(() => taskGitStatus(taskId, this.root));
    const implementationChanges = manifest?.baseCommit
      ? safely(() => changedPaths(manifest.baseCommit!, this.root).filter((file) => file !== repoPath(this.root, task.file)).length > 0) ?? false
      : false;
    const implementationPr = gitRecord?.pullRequest
      ? this.observePullRequest(gitRecord.pullRequest)
      : gitRecord?.pushed ? this.discoverPullRequest(gitRecord.branch, (pullRequest) => {
        gitRecord.pullRequest = pullRequest;
        writeGitRecord(gitRecord, this.root);
      }) : undefined;
    const statePr = stateRecord?.pullRequest
      ? this.observePullRequest(stateRecord.pullRequest)
      : stateRecord?.pushed ? this.discoverPullRequest(stateRecord.branch, (pullRequest) => {
        stateRecord.pullRequest = pullRequest;
        writeStateRecord(stateRecord, this.root);
      }) : undefined;
    return {
      task,
      dependenciesCompleted: task.metadata.depends_on.every((id) => completed.has(id)),
      branchExists: Boolean(gitRecord || gitStatus?.associatedBranch),
      prepared: existsSync(this.contextManifestPath(taskId)) && existsSync(this.taskPackPath(taskId)),
      implementationChanges,
      verificationPassed: this.verificationIsCurrent(task.source, repoPath(this.root, task.file), taskId, manifest, receipt),
      ...(gitRecord?.commit ? { commit: gitRecord.commit } : {}),
      pushed: Boolean(gitRecord?.pushed && gitStatus?.pushed),
      ...(implementationPr ? { implementationPr } : {}),
      mainSynchronized: this.mainIsSynchronized(),
      closed: task.metadata.status === "completed" && existsSync(resolve(this.root, "docs/evidence/tasks", `${taskId}.json`)),
      stateBranchExists: Boolean(stateRecord),
      ...(stateRecord?.commit ? { stateCommit: stateRecord.commit } : {}),
      statePushed: Boolean(stateRecord?.pushed),
      ...(statePr ? { statePr } : {}),
      execution: this.executionObservation(journal),
    };
  }

  branch(taskId: string): void { branchTask(taskId, this.root); }
  prepare(taskId: string): string { return prepareTask(taskId, this.root); }
  taskPackPath(taskId: string): string { return resolve(this.root, ".agent/context", taskId, "TASK_PACK.md"); }
  prepareExecution(taskId: string, attempt: number, executor: string, repair: boolean): {
    request?: ExecutorRequest;
    failure?: ExecutorReport;
  } {
    const tasks = loadTasks(this.root);
    validateTaskCatalog(tasks);
    const task = getTask(tasks, taskId);
    try {
      const plan = this.executionPlans[taskId];
      if (!plan) throw new Error(`EXECUTION_PLAN_MISSING: no explicit work package/route plan for ${taskId}`);
      const record = readGitRecord(taskId, this.root);
      if (!record) throw new Error(`EXECUTION_GIT_IDENTITY_MISSING: no Git task record for ${taskId}`);
      const manifest = readJson<{ taskId?: string; baseCommit?: string; taskFile?: string; packHash?: string }>(this.contextManifestPath(taskId));
      if (!manifest?.taskId || !manifest.baseCommit || !manifest.taskFile || !manifest.packHash) {
        throw new Error(`EXECUTION_PACK_MANIFEST_INVALID: incomplete prepared manifest for ${taskId}`);
      }
      const packPath = this.taskPackPath(taskId);
      if (!existsSync(packPath)) throw new Error(`EXECUTION_PACK_MISSING: no prepared Task Pack for ${taskId}`);
      const start = beginExecutionBoundary({
        task,
        taskFile: manifest.taskFile,
        recordedTaskId: record.taskId,
        manifestTaskId: manifest.taskId,
        plan,
        executor,
        attempt,
        repair,
        expectedBranch: record.branch,
        currentBranch: git(["branch", "--show-current"], this.root) || "DETACHED",
        baseCommit: record.baseCommit,
        headCommit: git(["rev-parse", "HEAD"], this.root),
        sourceCommit: manifest.baseCommit,
        taskPackPath: repoPath(this.root, packPath),
        taskPackHash: manifest.packHash,
        actualTaskPackHash: hash(readFileSync(packPath, "utf8")),
        changedFiles: changedPaths(record.baseCommit, this.root),
      });
      this.activeBoundaries.set(taskId, start);
      return { request: start.request };
    } catch (error) {
      return { failure: boundaryFailureReport(task, attempt, executor, error) };
    }
  }
  verify(taskId: string): void { verifyTask(taskId, this.root); }
  commit(taskId: string): void { commitTask(taskId, this.root); }
  push(taskId: string): void { pushTask(taskId, this.root); }
  openImplementationPr(taskId: string): void { openTaskPullRequest(taskId, this.root, this.ghExecutable); }
  close(taskId: string): void { closeTask(taskId, this.root); }
  createStateBranch(taskId: string): void { createStateTaskBranch(taskId, this.root); }
  commitState(taskId: string): void { commitStateTask(taskId, this.root); }
  pushState(taskId: string): void { pushStateTask(taskId, this.root); }
  openStatePr(taskId: string): void { openStateTaskPullRequest(taskId, this.root, this.ghExecutable); }

  synchronizeMain(): void {
    if (git(["status", "--porcelain"], this.root)) throw new Error("Cannot synchronize main with a dirty working tree");
    git(["switch", "main"], this.root);
    git(["pull", "--ff-only", "origin", "main"], this.root);
  }

  recordExecution(taskId: string, report: ExecutorReport): void {
    const journal = this.readJournal(taskId);
    const start = this.activeBoundaries.get(taskId);
    const task = getTask(loadTasks(this.root), taskId);
    const completion = start
      ? enforceExecutionDelta(start, task, report, changedPaths(start.identity.baseCommit, this.root))
      : undefined;
    const enforced = completion?.report ?? report;
    journal.executions.push({
      ...enforced,
      recordedAt: new Date().toISOString(),
      ...(completion ? {
        boundary: completion.boundary,
        changedFiles: completion.changedFiles,
        violations: completion.violations,
        ...(completion.rawReport.result ? { rawResult: completion.rawReport.result } : {}),
      } : {}),
    });
    this.activeBoundaries.delete(taskId);
    if (enforced.status === "completed") delete journal.lastVerificationFailure;
    this.writeJournal(journal);
  }

  recordVerificationFailure(taskId: string, failure: string): void {
    const journal = this.readJournal(taskId);
    journal.lastVerificationFailure = failure;
    this.writeJournal(journal);
  }

  private observePullRequest(record: NonNullable<GitTaskRecord["pullRequest"]>): PullRequestObservation {
    const result = spawnSync(this.ghExecutable, [
      "pr", "view", String(record.number),
      "--json", "number,url,state,reviewDecision,mergeCommit,statusCheckRollup",
    ], { cwd: this.root, encoding: "utf8", shell: false });
    if (result.error || result.status !== 0) {
      throw new Error(`Cannot observe PR #${record.number}: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
    }
    const pr = JSON.parse(result.stdout) as GitHubPullRequest;
    return {
      number: pr.number,
      url: pr.url,
      state: pr.state,
      ci: checkState(pr.statusCheckRollup),
      review: reviewState(pr.reviewDecision),
      ...(pr.mergeCommit?.oid ? { mergeCommit: pr.mergeCommit.oid } : {}),
    };
  }

  private discoverPullRequest(
    branch: string,
    persist: (record: NonNullable<GitTaskRecord["pullRequest"]>) => void,
  ): PullRequestObservation | undefined {
    const result = spawnSync(this.ghExecutable, [
      "pr", "list", "--head", branch, "--state", "all", "--limit", "1",
      "--json", "number,url,state,createdAt,reviewDecision,mergeCommit,statusCheckRollup",
    ], { cwd: this.root, encoding: "utf8", shell: false });
    if (result.error || result.status !== 0) {
      throw new Error(`Cannot discover a PR for ${branch}: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
    }
    const [pr] = JSON.parse(result.stdout) as GitHubPullRequest[];
    if (!pr) return undefined;
    persist({ number: pr.number, url: pr.url, state: pr.state, openedAt: pr.createdAt || new Date().toISOString() });
    return pullRequestObservation(pr);
  }

  private mainIsSynchronized(): boolean {
    if (git(["branch", "--show-current"], this.root) !== "main") return false;
    if (git(["status", "--porcelain"], this.root)) return false;
    return safely(() => {
      const remoteLine = git(["ls-remote", "origin", "refs/heads/main"], this.root);
      const remoteHead = remoteLine.split(/\s+/)[0];
      return Boolean(remoteHead) && git(["rev-parse", "main"], this.root) === remoteHead;
    }) ?? false;
  }

  private executionObservation(journal: Journal): ExecutionObservation {
    const last = journal.executions.at(-1);
    return {
      attempts: journal.executions.length,
      ...(last ? { lastExecutor: last.executor } : {}),
      ...(last?.status === "failed" ? { lastExecutorFailure: last.summary } : {}),
      ...(journal.lastVerificationFailure ? { lastVerificationFailure: journal.lastVerificationFailure } : {}),
    };
  }

  private verificationIsCurrent(
    taskSource: string,
    taskFile: string,
    taskId: string,
    manifest: { baseCommit?: string; taskHash?: string; packHash?: string } | undefined,
    receipt: {
      status?: string;
      changedFiles?: string[];
      taskHash?: string;
      packHash?: string;
      changeFingerprint?: string;
    } | undefined,
  ): boolean {
    if (receipt?.status !== "passed" || !receipt.changedFiles || !receipt.changeFingerprint) return false;
    const packPath = this.taskPackPath(taskId);
    if (!existsSync(packPath) || !manifest?.packHash) return false;
    if (receipt.taskHash !== hash(taskSource) || manifest.taskHash !== receipt.taskHash) return false;
    if (receipt.packHash !== manifest.packHash || hash(readFileSync(packPath, "utf8")) !== manifest.packHash) return false;
    if (!manifest.baseCommit) return false;
    return safely(() => {
      const currentFiles = changedPaths(manifest.baseCommit!, this.root).filter((file) => file !== taskFile);
      return JSON.stringify(currentFiles) === JSON.stringify([...receipt.changedFiles!].sort())
        && fingerprintChanges(receipt.changedFiles!, this.root) === receipt.changeFingerprint;
    }) ?? false;
  }

  private readJournal(taskId: string): Journal {
    return readJson<Journal>(this.journalPath(taskId)) ?? { version: 1, taskId, executions: [] };
  }

  private writeJournal(journal: Journal): void {
    const path = this.journalPath(journal.taskId);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(journal, null, 2)}\n`);
  }

  private contextManifestPath(taskId: string): string { return resolve(this.root, ".agent/context", taskId, "manifest.json"); }
  private receiptPath(taskId: string): string { return resolve(this.root, ".agent/evidence", `${taskId}.json`); }
  private journalPath(taskId: string): string { return resolve(this.root, ".agent/orchestrator", `${taskId}.json`); }
}

function checkState(checks: GitHubPullRequest["statusCheckRollup"]): CheckState {
  if (checks.length === 0) return "UNKNOWN";
  if (checks.some((check) => ["FAILURE", "CANCELLED", "TIMED_OUT", "ACTION_REQUIRED"].includes(check.conclusion || ""))) {
    return "FAILURE";
  }
  if (checks.some((check) => check.status !== "COMPLETED" || !check.conclusion)) return "PENDING";
  return checks.every((check) => ["SUCCESS", "NEUTRAL", "SKIPPED"].includes(check.conclusion || "")) ? "SUCCESS" : "FAILURE";
}

function reviewState(value: string): ReviewState {
  if (value === "CHANGES_REQUESTED") return "CHANGES_REQUESTED";
  if (value === "APPROVED") return "APPROVED";
  return "NONE";
}

function pullRequestObservation(pr: GitHubPullRequest): PullRequestObservation {
  return {
    number: pr.number,
    url: pr.url,
    state: pr.state,
    ci: checkState(pr.statusCheckRollup),
    review: reviewState(pr.reviewDecision),
    ...(pr.mergeCommit?.oid ? { mergeCommit: pr.mergeCommit.oid } : {}),
  };
}

function readJson<T>(path: string): T | undefined {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) as T : undefined;
}

function safely<T>(operation: () => T): T | undefined {
  try { return operation(); } catch { return undefined; }
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
