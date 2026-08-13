import type { ExecutorAdapter, ExecutorReport } from "./executor.js";
import type { ExecutorRequest } from "./execution-contracts.js";
import type { Task } from "./task.js";
import type { GitHubLifecycleReceipt } from "./github-lifecycle.js";

export type CheckState = "UNKNOWN" | "PENDING" | "SUCCESS" | "FAILURE";
export type ReviewState = "NONE" | "APPROVED" | "CHANGES_REQUESTED";

export type PullRequestObservation = {
  number: number;
  url: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  ci: CheckState;
  review: ReviewState;
  mergeCommit?: string;
  lifecycle?: GitHubLifecycleReceipt;
};

export type ExecutionObservation = {
  attempts: number;
  lastExecutor?: string;
  lastExecutorFailure?: string;
  lastVerificationFailure?: string;
};

export type OrchestratorSnapshot = {
  task: Task;
  dependenciesCompleted: boolean;
  branchExists: boolean;
  prepared: boolean;
  implementationChanges: boolean;
  verificationPassed: boolean;
  commit?: string;
  pushed: boolean;
  implementationPr?: PullRequestObservation;
  mainSynchronized: boolean;
  closed: boolean;
  stateBranchExists: boolean;
  stateCommit?: string;
  statePushed: boolean;
  statePr?: PullRequestObservation;
  execution: ExecutionObservation;
};

export type OrchestratorState =
  | "READY"
  | "BRANCHED"
  | "PREPARED"
  | "EXECUTING"
  | "VERIFIED"
  | "COMMITTED"
  | "PUSHED"
  | "PR_OPEN"
  | "CI_PENDING"
  | "REVIEW_REQUIRED"
  | "MERGED"
  | "CLOSED"
  | "STATE_PR_PENDING"
  | "STATE_CI_PENDING"
  | "STATE_REVIEW_REQUIRED"
  | "STATE_MERGED"
  | "DONE"
  | "EXECUTOR_REQUIRED"
  | "ARCHITECTURE_REVIEW_REQUIRED"
  | "BLOCKED"
  | "EXECUTOR_FAILED"
  | "VERIFY_FAILED"
  | "CI_FAILED"
  | "REVIEW_CHANGES_REQUIRED";

export interface OrchestratorHarnessAdapter {
  inspect(taskId: string): OrchestratorSnapshot;
  branch(taskId: string): void;
  prepare(taskId: string): string;
  taskPackPath(taskId: string): string;
  prepareExecution(taskId: string, attempt: number, executor: string, repair: boolean): {
    request?: ExecutorRequest;
    failure?: ExecutorReport;
  };
  verify(taskId: string): void;
  commit(taskId: string): void;
  push(taskId: string): void;
  openImplementationPr(taskId: string): void;
  synchronizeMain(taskId: string, phase: "implementation" | "state"): void;
  close(taskId: string): void;
  createStateBranch(taskId: string): void;
  commitState(taskId: string): void;
  pushState(taskId: string): void;
  openStatePr(taskId: string): void;
  recordExecution(taskId: string, report: ExecutorReport): void;
  recordVerificationFailure(taskId: string, failure: string): void;
}

export type AdvanceResult = {
  taskId: string;
  previousState: OrchestratorState;
  state: OrchestratorState;
  action: string;
  stop: boolean;
  snapshot: OrchestratorSnapshot;
};

const stopStates = new Set<OrchestratorState>([
  "PR_OPEN",
  "CI_PENDING",
  "REVIEW_REQUIRED",
  "STATE_CI_PENDING",
  "STATE_REVIEW_REQUIRED",
  "DONE",
  "EXECUTOR_REQUIRED",
  "ARCHITECTURE_REVIEW_REQUIRED",
  "BLOCKED",
  "CI_FAILED",
  "REVIEW_CHANGES_REQUIRED",
]);

export class LocalTaskOrchestrator {
  constructor(
    private readonly harness: OrchestratorHarnessAdapter,
    private readonly executors: ExecutorAdapter[],
    private readonly maxExecutionAttempts = 3,
    private readonly maxRunTransitions = 32,
  ) {}

  inspect(taskId: string): { state: OrchestratorState; snapshot: OrchestratorSnapshot } {
    const snapshot = this.harness.inspect(taskId);
    let state = deriveOrchestratorState(snapshot, this.maxExecutionAttempts);
    if (["PREPARED", "EXECUTOR_FAILED", "VERIFY_FAILED"].includes(state)
      && !this.executors.some((executor) => executor.canHandle(snapshot.task))) {
      state = "EXECUTOR_REQUIRED";
    }
    return { state, snapshot };
  }

  advance(taskId: string): AdvanceResult {
    const before = this.inspect(taskId);
    const action = this.performOne(taskId, before.state, before.snapshot);
    const after = this.inspect(taskId);
    return {
      taskId,
      previousState: before.state,
      state: after.state,
      action,
      stop: stopStates.has(after.state),
      snapshot: after.snapshot,
    };
  }

  run(taskId: string): AdvanceResult[] {
    const transitions: AdvanceResult[] = [];
    for (let index = 0; index < this.maxRunTransitions; index += 1) {
      const result = this.advance(taskId);
      transitions.push(result);
      if (result.stop) return transitions;
    }
    throw new Error(`task:run reached the safety limit of ${this.maxRunTransitions} transitions`);
  }

  private performOne(taskId: string, state: OrchestratorState, snapshot: OrchestratorSnapshot): string {
    switch (state) {
      case "READY":
        if (!snapshot.dependenciesCompleted) throw new Error(`${taskId} dependencies are not completed`);
        this.harness.branch(taskId);
        return "task:branch";
      case "BRANCHED":
        this.harness.prepare(taskId);
        return "task:prepare";
      case "PREPARED":
      case "EXECUTOR_FAILED":
        return this.execute(taskId, snapshot, false);
      case "EXECUTING":
        try {
          this.harness.verify(taskId);
          return "task:verify";
        } catch (error) {
          this.harness.recordVerificationFailure(taskId, errorMessage(error));
          return "task:verify failed";
        }
      case "VERIFY_FAILED":
        return this.execute(taskId, snapshot, true);
      case "VERIFIED":
        this.harness.commit(taskId);
        return "task:commit";
      case "COMMITTED":
        this.harness.push(taskId);
        return "task:push";
      case "PUSHED":
        this.harness.openImplementationPr(taskId);
        return "task:pr";
      case "MERGED":
        if (!snapshot.mainSynchronized) {
          this.harness.synchronizeMain(taskId, "implementation");
          return "sync main after implementation merge";
        }
        this.harness.close(taskId);
        return "task:close";
      case "CLOSED":
        this.harness.createStateBranch(taskId);
        return "create state branch";
      case "STATE_PR_PENDING":
        if (!snapshot.stateCommit) {
          this.harness.commitState(taskId);
          return "commit state closure";
        }
        if (!snapshot.statePushed) {
          this.harness.pushState(taskId);
          return "push state branch";
        }
        if (!snapshot.statePr) {
          this.harness.openStatePr(taskId);
          return "open state PR";
        }
        return "observe state PR";
      case "STATE_MERGED":
        this.harness.synchronizeMain(taskId, "state");
        return "sync main after state merge";
      case "PR_OPEN":
      case "CI_PENDING":
      case "REVIEW_REQUIRED":
      case "STATE_CI_PENDING":
      case "STATE_REVIEW_REQUIRED":
      case "DONE":
      case "EXECUTOR_REQUIRED":
      case "ARCHITECTURE_REVIEW_REQUIRED":
      case "BLOCKED":
      case "CI_FAILED":
      case "REVIEW_CHANGES_REQUIRED":
        return `stop at ${state}`;
    }
  }

  private execute(taskId: string, snapshot: OrchestratorSnapshot, repair: boolean): string {
    const attempt = snapshot.execution.attempts + 1;
    if (attempt > this.maxExecutionAttempts) return "stop at BLOCKED";
    const executor = this.executors.find((candidate) => candidate.canHandle(snapshot.task));
    if (!executor) return "stop at EXECUTOR_REQUIRED";
    const preparation = this.harness.prepareExecution(taskId, attempt, executor.name, repair);
    if (preparation.failure) {
      this.harness.recordExecution(taskId, preparation.failure);
      return "execution boundary rejected";
    }
    const context = {
      task: snapshot.task,
      taskPackPath: this.harness.taskPackPath(taskId),
      attempt,
      ...(preparation.request ? { request: preparation.request } : {}),
      ...(repair && snapshot.execution.lastVerificationFailure
        ? { verificationFailure: snapshot.execution.lastVerificationFailure }
        : {}),
    };
    let report: ExecutorReport;
    try {
      report = repair ? executor.repair(context) : executor.execute(context);
    } catch (error) {
      report = { executor: executor.name, attempt, status: "failed", summary: errorMessage(error) };
    }
    this.harness.recordExecution(taskId, report);
    return repair ? `${executor.name}:repair` : `${executor.name}:execute`;
  }
}

export function deriveOrchestratorState(
  snapshot: OrchestratorSnapshot,
  maxExecutionAttempts = 3,
): OrchestratorState {
  if (snapshot.closed) return deriveStateDelivery(snapshot);
  const implementationPr = snapshot.implementationPr;
  if (implementationPr?.state === "MERGED") return "MERGED";
  if (implementationPr) return derivePullRequestState(implementationPr, false);
  if (snapshot.pushed) return "PUSHED";
  if (snapshot.commit) return "COMMITTED";
  if (snapshot.verificationPassed) return "VERIFIED";
  if (snapshot.prepared) {
    if (requiresArchitectureExecutor(snapshot.task)) {
      return snapshot.implementationChanges ? "EXECUTING" : "ARCHITECTURE_REVIEW_REQUIRED";
    }
    if (snapshot.execution.attempts >= maxExecutionAttempts
      && (snapshot.execution.lastExecutorFailure
        || snapshot.execution.lastVerificationFailure
        || !snapshot.implementationChanges)) return "BLOCKED";
    if (snapshot.execution.lastVerificationFailure) return "VERIFY_FAILED";
    if (snapshot.implementationChanges) return "EXECUTING";
    if (snapshot.execution.lastExecutorFailure) return "EXECUTOR_FAILED";
    if (snapshot.execution.attempts > 0) return "EXECUTOR_FAILED";
    return "PREPARED";
  }
  if (snapshot.branchExists) return "BRANCHED";
  return "READY";
}

function deriveStateDelivery(snapshot: OrchestratorSnapshot): OrchestratorState {
  const statePr = snapshot.statePr;
  if (statePr?.state === "MERGED") {
    if (statePr.lifecycle?.decision !== "ELIGIBLE") return "BLOCKED";
    return snapshot.mainSynchronized ? "DONE" : "STATE_MERGED";
  }
  if (!snapshot.stateBranchExists || !snapshot.stateCommit || !snapshot.statePushed || !statePr) {
    return snapshot.stateBranchExists ? "STATE_PR_PENDING" : "CLOSED";
  }
  return derivePullRequestState(statePr, true);
}

function derivePullRequestState(pr: PullRequestObservation, stateUpdate: boolean): OrchestratorState {
  if (pr.state === "CLOSED") return "BLOCKED";
  if (pr.review === "CHANGES_REQUESTED") return "REVIEW_CHANGES_REQUIRED";
  if (pr.ci === "FAILURE") return "CI_FAILED";
  if (pr.ci === "UNKNOWN") return stateUpdate ? "STATE_CI_PENDING" : "PR_OPEN";
  if (pr.ci === "PENDING") return stateUpdate ? "STATE_CI_PENDING" : "CI_PENDING";
  return stateUpdate ? "STATE_REVIEW_REQUIRED" : "REVIEW_REQUIRED";
}

function requiresArchitectureExecutor(task: Task): boolean {
  return task.metadata.model_tier === "architecture"
    || task.metadata.risk === "high"
    || task.metadata.architecture_impact;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
