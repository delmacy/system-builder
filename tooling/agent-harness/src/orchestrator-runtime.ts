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
  type StateTaskRecord,
} from "./git-workflow.js";
import { changedPaths, git } from "./git.js";
import { closeTask, prepareTask, verifyTask } from "./harness.js";
import {
  evaluateGitHubLifecycle,
  type GitHubLifecycleCheck,
  type GitHubLifecycleReceipt,
} from "./github-lifecycle.js";
import { evaluateStoredHumanApproval, type HumanApprovalEvaluation } from "./human-approval.js";
import {
  evaluateStoredPackageAuthorization,
  writePackageUseReceipt,
  type PackageAction,
  type PackageAuthorizationEvaluation,
} from "./package-authorization.js";
import type {
  CheckState,
  ExecutionObservation,
  OrchestratorHarnessAdapter,
  OrchestratorSnapshot,
  PullRequestObservation,
  ReviewState,
} from "./orchestrator.js";
import { getTask, loadTasks, repoPath, validateTaskCatalog, type Task } from "./task.js";

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

export type GitHubPullRequest = {
  number: number;
  url: string;
  state: string;
  headRefName?: string;
  baseRefName?: string;
  headRefOid?: string;
  reviewDecision: string;
  mergeCommit: { oid: string } | null;
  statusCheckRollup: Array<{ name?: string; context?: string; status?: string; conclusion?: string | null }>;
  createdAt?: string;
};

export class LocalHarnessAdapter implements OrchestratorHarnessAdapter {
  private readonly activeBoundaries = new Map<string, ExecutionBoundaryStart>();

  constructor(
    private readonly root = process.cwd(),
    private readonly ghExecutable = "gh",
    private readonly executionPlans: Readonly<Record<string, ExecutionPlan>> = {},
    private readonly requiredChecks: readonly string[] = ["validate"],
    private readonly reviewRequired = true,
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
      validationGate?: { decision?: "PASS" | "FAIL" | "REVIEW_REQUIRED" };
    }>(this.receiptPath(taskId));
    const journal = this.readJournal(taskId);
    const gitStatus = safely(() => taskGitStatus(taskId, this.root));
    const implementationChanges = manifest?.baseCommit
      ? safely(() => changedPaths(manifest.baseCommit!, this.root).filter((file) => file !== repoPath(this.root, task.file)).length > 0) ?? false
      : false;
    const implementationPr = gitRecord?.pullRequest
      ? this.observeImplementationPullRequest(task, gitRecord, receipt?.validationGate?.decision ?? (receipt?.status === "passed" ? "PASS" : "FAIL"))
      : gitRecord?.pushed ? this.discoverPullRequest(gitRecord.branch, (pullRequest) => {
        gitRecord.pullRequest = pullRequest;
        writeGitRecord(gitRecord, this.root);
      }, (pr) => this.deriveImplementationPullRequest(task, pr, gitRecord, receipt?.validationGate?.decision ?? (receipt?.status === "passed" ? "PASS" : "FAIL"))) : undefined;
    const statePr = stateRecord?.pullRequest
      ? this.observeStatePullRequest(task, stateRecord)
      : stateRecord?.pushed ? this.discoverPullRequest(stateRecord.branch, (pullRequest) => {
        stateRecord.pullRequest = pullRequest;
        writeStateRecord(stateRecord, this.root);
      }, (pr) => this.deriveStatePullRequest(task, pr, stateRecord)) : undefined;
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
  verify(taskId: string): void {
    const execution = this.readJournal(taskId).executions.at(-1);
    if (!execution?.boundary || !execution.changedFiles || !execution.rawResult) {
      verifyTask(taskId, this.root);
      return;
    }
    const rawReport: ExecutorReport = {
      executor: execution.executor,
      attempt: execution.attempt,
      status: execution.rawResult.status === "SUCCEEDED" ? "completed" : "failed",
      summary: execution.summary,
      result: execution.rawResult,
      ...(execution.request ? { request: execution.request } : {}),
    };
    verifyTask(taskId, this.root, {
      boundary: execution.boundary,
      changedFiles: execution.changedFiles,
      violations: execution.violations ?? [],
      rawReport,
      report: execution,
    });
  }
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
      ...(completion?.rawReport.result
        ? { rawResult: completion.rawReport.result }
        : enforced.result ? { rawResult: enforced.result } : {}),
      ...(completion ? {
        boundary: completion.boundary,
        changedFiles: completion.changedFiles,
        violations: completion.violations,
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

  private observeImplementationPullRequest(
    task: Task,
    gitRecord: GitTaskRecord,
    validation: "PASS" | "FAIL" | "REVIEW_REQUIRED",
  ): PullRequestObservation {
    const record = gitRecord.pullRequest;
    if (!record) throw new Error(`Cannot observe implementation PR without a recorded PR for ${gitRecord.taskId}`);
    const result = spawnSync(this.ghExecutable, [
      "pr", "view", String(record.number),
      "--json", "number,url,state,headRefName,baseRefName,headRefOid,reviewDecision,mergeCommit,statusCheckRollup",
    ], { cwd: this.root, encoding: "utf8", shell: false });
    if (result.error || result.status !== 0) {
      throw new Error(`Cannot observe PR #${record.number}: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
    }
    return this.deriveImplementationPullRequest(task, JSON.parse(result.stdout) as GitHubPullRequest, gitRecord, validation);
  }

  private deriveImplementationPullRequest(task: Task, pr: GitHubPullRequest, gitRecord: GitTaskRecord, validation: "PASS" | "FAIL" | "REVIEW_REQUIRED"): PullRequestObservation {
    const authorizations = this.authorizationsFor(task, pr, gitRecord.branch, gitRecord.baseBranch, gitRecord.commit ?? "f".repeat(40), gitRecord.baseCommit, "IMPLEMENTATION_PR", validation);
    const observation = deriveGitHubLifecycleObservation(pr, {
      branch: gitRecord.branch,
      baseBranch: gitRecord.baseBranch,
      headCommit: gitRecord.commit ?? "f".repeat(40),
      requiredChecks: this.requiredChecks,
      validation,
      reviewRequired: this.reviewRequired,
      ...authorizations,
    });
    this.recordPackageUseIfEligible(observation, authorizations.packageAuthorization);
    return observation;
  }

  private observeStatePullRequest(task: Task, record: StateTaskRecord): PullRequestObservation {
    if (!record.pullRequest) throw new Error(`Cannot observe state PR without a recorded PR for ${record.taskId}`);
    const result = spawnSync(this.ghExecutable, [
      "pr", "view", String(record.pullRequest.number),
      "--json", "number,url,state,headRefName,baseRefName,headRefOid,reviewDecision,mergeCommit,statusCheckRollup",
    ], { cwd: this.root, encoding: "utf8", shell: false });
    if (result.error || result.status !== 0) {
      throw new Error(`Cannot observe PR #${record.pullRequest.number}: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
    }
    return this.deriveStatePullRequest(task, JSON.parse(result.stdout) as GitHubPullRequest, record);
  }

  private deriveStatePullRequest(task: Task, pr: GitHubPullRequest, record: StateTaskRecord): PullRequestObservation {
    if (!record.commit) throw new Error(`Cannot observe state PR without a recorded commit for ${record.taskId}`);
    const implementation = readGitRecord(task.metadata.id, this.root);
    const authorizations = this.authorizationsFor(task, pr, record.branch, "main", record.commit, implementation?.baseCommit ?? record.commit, "STATE_PR", "PASS");
    const observation = deriveStateGitHubLifecycleObservation(pr, {
      branch: record.branch,
      headCommit: record.commit,
      requiredChecks: this.requiredChecks,
      reviewRequired: this.reviewRequired,
      ...authorizations,
    });
    this.recordPackageUseIfEligible(observation, authorizations.packageAuthorization);
    return observation;
  }

  private authorizationsFor(
    task: Task,
    pr: GitHubPullRequest,
    headRef: string,
    baseRef: string,
    headSha: string,
    sourceCommit: string,
    packageAction: PackageAction,
    validation: "PASS" | "FAIL" | "REVIEW_REQUIRED",
  ): { humanApproval: HumanApprovalEvaluation; packageAuthorization: PackageAuthorizationEvaluation } {
    const executions = this.readJournal(task.metadata.id).executions;
    let consecutiveFailures = 0;
    for (const execution of [...executions].reverse()) {
      if (execution.status !== "failed") break;
      consecutiveFailures += 1;
    }
    const humanApproval = evaluateStoredHumanApproval(this.root, {
      repository: this.repositoryIdentity(), taskId: task.metadata.id, risk: task.metadata.risk,
      architectureImpact: task.metadata.architecture_impact, prNumber: pr.number,
      baseRef, headRef, headSha, observedAt: new Date().toISOString(),
    });
    const packageAuthorization = evaluateStoredPackageAuthorization(this.root, {
      repository: this.repositoryIdentity(), taskId: task.metadata.id, taskMetadata: task.metadata,
      action: packageAction, sourceCommit, prNumber: pr.number, baseRef, headRef, headSha,
      observedAt: new Date().toISOString(), validation, checks: lifecycleChecks(pr.statusCheckRollup),
      totalAttempts: executions.length, consecutiveFailures,
    });
    return { humanApproval, packageAuthorization };
  }

  private recordPackageUseIfEligible(observation: PullRequestObservation, evaluation?: PackageAuthorizationEvaluation): void {
    if (observation.lifecycle?.decision === "ELIGIBLE" && observation.lifecycle.approval_channel === "PACKAGE_AUTHORIZATION" && evaluation?.use_receipt) {
      writePackageUseReceipt(this.root, evaluation.use_receipt);
    }
  }

  private repositoryIdentity(): string {
    const remote = git(["config", "--get", "remote.origin.url"], this.root);
    const match = remote.replace(/\\/g, "/").match(/(?:github\.com[:/])([^/]+\/[^/]+?)(?:\.git)?$/i);
    return match?.[1] ?? remote;
  }

  private discoverPullRequest(
    branch: string,
    persist: (record: NonNullable<GitTaskRecord["pullRequest"]>) => void,
    observe: (pr: GitHubPullRequest) => PullRequestObservation,
  ): PullRequestObservation | undefined {
    const result = spawnSync(this.ghExecutable, [
      "pr", "list", "--head", branch, "--state", "all", "--limit", "1",
      "--json", "number,url,state,createdAt,headRefName,baseRefName,headRefOid,reviewDecision,mergeCommit,statusCheckRollup",
    ], { cwd: this.root, encoding: "utf8", shell: false });
    if (result.error || result.status !== 0) {
      throw new Error(`Cannot discover a PR for ${branch}: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
    }
    const [pr] = JSON.parse(result.stdout) as GitHubPullRequest[];
    if (!pr) return undefined;
    persist({ number: pr.number, url: pr.url, state: pr.state, openedAt: pr.createdAt || new Date().toISOString() });
    return observe(pr);
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
      ...(last?.rawResult ? { lastExecutorResult: last.rawResult } : {}),
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

function reviewState(value: string): ReviewState {
  if (value === "CHANGES_REQUESTED") return "CHANGES_REQUESTED";
  if (value === "APPROVED") return "APPROVED";
  return "NONE";
}

export function deriveGitHubLifecycleObservation(
  pr: GitHubPullRequest,
  expected: {
    branch: string;
    baseBranch: string;
    headCommit: string;
    requiredChecks: readonly string[];
    validation: "PASS" | "FAIL" | "REVIEW_REQUIRED";
    reviewRequired: boolean;
    humanApproval?: HumanApprovalEvaluation;
    packageAuthorization?: PackageAuthorizationEvaluation;
  },
): PullRequestObservation {
  const state = pullRequestState(pr.state);
  const lifecycle = evaluateGitHubLifecycle({
    prNumber: pr.number,
    state: knownPullRequestState(pr.state),
    branch: pr.headRefName ?? "UNKNOWN",
    baseBranch: pr.baseRefName ?? "UNKNOWN",
    headCommit: /^[0-9a-f]{40}$/.test(pr.headRefOid ?? "") ? pr.headRefOid! : "0".repeat(40),
    expectedBranch: expected.branch,
    expectedBaseBranch: expected.baseBranch,
    expectedHeadCommit: expected.headCommit,
    requiredChecks: [...expected.requiredChecks],
    checks: lifecycleChecks(pr.statusCheckRollup),
    validation: expected.validation,
    review: lifecycleReviewState(pr.reviewDecision),
    reviewRequired: expected.reviewRequired,
    ...(expected.humanApproval ? { humanApproval: expected.humanApproval } : {}),
    ...(expected.packageAuthorization ? { packageAuthorization: expected.packageAuthorization } : {}),
  });
  return {
    number: pr.number,
    url: pr.url,
    state,
    ci: lifecycleCheckState(lifecycle),
    review: reviewState(pr.reviewDecision),
    ...(pr.mergeCommit?.oid ? { mergeCommit: pr.mergeCommit.oid } : {}),
    lifecycle,
  };
}

export function deriveStateGitHubLifecycleObservation(
  pr: GitHubPullRequest,
  expected: {
    branch: string;
    headCommit: string;
    requiredChecks: readonly string[];
    reviewRequired: boolean;
    humanApproval?: HumanApprovalEvaluation;
    packageAuthorization?: PackageAuthorizationEvaluation;
  },
): PullRequestObservation {
  return deriveGitHubLifecycleObservation(pr, {
    ...expected,
    baseBranch: "main",
    validation: "PASS",
  });
}

function lifecycleChecks(checks: GitHubPullRequest["statusCheckRollup"]): GitHubLifecycleCheck[] {
  return checks.flatMap((check) => {
    const name = check.name || check.context;
    if (!name) return [];
    let status: GitHubLifecycleCheck["status"];
    if (check.status !== "COMPLETED" || !check.conclusion) status = "PENDING";
    else if (check.conclusion === "SUCCESS") status = "SUCCESS";
    else if (check.conclusion === "CANCELLED") status = "CANCELLED";
    else if (check.conclusion === "TIMED_OUT") status = "TIMED_OUT";
    else if (["FAILURE", "ACTION_REQUIRED", "STARTUP_FAILURE"].includes(check.conclusion)) status = "FAILURE";
    else status = "UNKNOWN";
    return [{ name, status }];
  });
}

function lifecycleReviewState(value: string): GitHubLifecycleReceipt["review"] {
  if (!value) return "NONE";
  if (["APPROVED", "CHANGES_REQUESTED"].includes(value)) return value as "APPROVED" | "CHANGES_REQUESTED";
  return "UNKNOWN";
}

function lifecycleCheckState(receipt: GitHubLifecycleReceipt): CheckState {
  if (receipt.decision === "BLOCKED") return "FAILURE";
  if (receipt.decision === "PENDING") return "PENDING";
  return "SUCCESS";
}

function knownPullRequestState(value: string): "OPEN" | "CLOSED" | "MERGED" | "UNKNOWN" {
  return ["OPEN", "CLOSED", "MERGED"].includes(value)
    ? value as "OPEN" | "CLOSED" | "MERGED"
    : "UNKNOWN";
}

function pullRequestState(value: string): PullRequestObservation["state"] {
  return ["OPEN", "CLOSED", "MERGED"].includes(value)
    ? value as PullRequestObservation["state"]
    : "CLOSED";
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
