import { executorAdapterResultSchema, executorRequestSchema, type ExecutionRoute, type ExecutorRequest } from "./execution-contracts.js";
import type { ExecutorReport } from "./executor.js";
import { matchesAny } from "./glob.js";
import type { Task } from "./task.js";

export type ExecutionPlan = {
  workPackageId: string;
  route: ExecutionRoute;
};

export type ExecutionBoundaryIdentity = {
  version: 1;
  taskId: string;
  workPackageId: string;
  branch: string;
  baseCommit: string;
  headCommit: string;
  sourceCommit: string;
  taskPackPath: string;
  taskPackHash: string;
  attempt: number;
  repair: boolean;
  initialChangedFiles: string[];
};

export type ExecutionBoundaryStart = {
  identity: ExecutionBoundaryIdentity;
  request: ExecutorRequest;
  taskFile: string;
};

export type BeginExecutionBoundaryInput = {
  task: Task;
  taskFile: string;
  recordedTaskId: string;
  manifestTaskId: string;
  plan: ExecutionPlan;
  executor: string;
  attempt: number;
  repair: boolean;
  expectedBranch: string;
  currentBranch: string;
  baseCommit: string;
  headCommit: string;
  sourceCommit: string;
  taskPackPath: string;
  taskPackHash: string;
  actualTaskPackHash: string;
  changedFiles: string[];
};

export type ExecutionBoundaryCompletion = {
  boundary: ExecutionBoundaryIdentity;
  changedFiles: string[];
  violations: string[];
  rawReport: ExecutorReport;
  report: ExecutorReport;
};

export function beginExecutionBoundary(input: BeginExecutionBoundaryInput): ExecutionBoundaryStart {
  const initialChangedFiles = implementationFiles(input.changedFiles, input.taskFile);
  if (input.recordedTaskId !== input.task.metadata.id || input.manifestTaskId !== input.task.metadata.id) {
    throw new Error("EXECUTION_TASK_MISMATCH: Git record, Task Pack manifest and task contract must identify the same task");
  }
  if (!input.expectedBranch || input.currentBranch !== input.expectedBranch) {
    throw new Error(`EXECUTION_BRANCH_MISMATCH: expected ${input.expectedBranch || "recorded task branch"}; current ${input.currentBranch || "DETACHED"}`);
  }
  if (input.baseCommit !== input.sourceCommit) {
    throw new Error("EXECUTION_SOURCE_MISMATCH: Task Pack source commit differs from the recorded task base");
  }
  if (input.headCommit !== input.baseCommit) {
    throw new Error("EXECUTION_HEAD_MISMATCH: task branch HEAD differs from the recorded task base");
  }
  if (input.taskPackHash !== input.actualTaskPackHash) {
    throw new Error("EXECUTION_PACK_TAMPERED: Task Pack hash differs from its prepared manifest");
  }
  if (!input.repair && initialChangedFiles.length > 0) {
    throw new Error(`EXECUTION_DIRTY_START: ${initialChangedFiles.join(", ")}`);
  }
  if (input.repair) {
    const priorViolations = scopeViolations(initialChangedFiles, input.task);
    if (priorViolations.length > 0) {
      throw new Error(`EXECUTION_UNSAFE_REPAIR_BASELINE: ${priorViolations.join("; ")}`);
    }
  }
  if (input.plan.route.decision !== "SELECTED" || input.plan.route.executor !== input.executor) {
    throw new Error("EXECUTION_ROUTE_MISMATCH: route must explicitly select the invoked executor");
  }
  const request = executorRequestSchema.parse({
    schema_version: 1,
    task_id: input.task.metadata.id,
    work_package_id: input.plan.workPackageId,
    source_commit: input.sourceCommit,
    attempt: input.attempt,
    task_pack_path: input.taskPackPath,
    route: input.plan.route,
    scope: {
      allowed_paths: input.task.metadata.allowed_paths,
      forbidden_paths: input.task.metadata.forbidden_paths,
      max_files: input.task.metadata.max_files,
    },
    validation_commands: input.task.metadata.validation,
  });
  return {
    identity: {
      version: 1,
      taskId: request.task_id,
      workPackageId: request.work_package_id,
      branch: input.currentBranch,
      baseCommit: input.baseCommit,
      headCommit: input.headCommit,
      sourceCommit: input.sourceCommit,
      taskPackPath: input.taskPackPath,
      taskPackHash: input.taskPackHash,
      attempt: input.attempt,
      repair: input.repair,
      initialChangedFiles,
    },
    request,
    taskFile: input.taskFile,
  };
}

export function enforceExecutionDelta(
  start: ExecutionBoundaryStart,
  task: Task,
  rawReport: ExecutorReport,
  changedFiles: string[],
): ExecutionBoundaryCompletion {
  const implementation = implementationFiles(changedFiles, start.taskFile);
  const violations = scopeViolations(implementation, task);
  if (violations.length === 0) {
    return { boundary: start.identity, changedFiles: implementation, violations, rawReport, report: rawReport };
  }
  const adapter = start.request.route.executor;
  const result = executorAdapterResultSchema.parse({
    schema_version: 1,
    task_id: task.metadata.id,
    attempt: start.identity.attempt,
    adapter,
    status: "BLOCKED",
    exit_code: rawReport.result?.exit_code ?? null,
    stdout: rawReport.result?.stdout ?? "",
    stderr: rawReport.result?.stderr ?? "",
    failure: {
      code: "EXECUTION_SCOPE_VIOLATION",
      message: violations.join("; "),
      retryable: false,
    },
  });
  return {
    boundary: start.identity,
    changedFiles: implementation,
    violations,
    rawReport,
    report: {
      executor: rawReport.executor,
      attempt: rawReport.attempt,
      status: "failed",
      summary: result.failure?.message ?? "Execution scope violation",
      result,
      request: start.request,
    },
  };
}

export function boundaryFailureReport(task: Task, attempt: number, executor: string, error: unknown): ExecutorReport {
  const message = error instanceof Error ? error.message : String(error);
  if (!["opencode", "codex"].includes(executor)) {
    return { executor, attempt, status: "failed", summary: message };
  }
  const result = executorAdapterResultSchema.parse({
    schema_version: 1,
    task_id: task.metadata.id,
    attempt,
    adapter: executor,
    status: "BLOCKED",
    exit_code: null,
    stdout: "",
    stderr: "",
    failure: { code: "EXECUTION_BOUNDARY_REJECTED", message, retryable: false },
  });
  return { executor, attempt, status: "failed", summary: message, result };
}

function implementationFiles(files: string[], taskFile: string): string[] {
  return [...new Set(files)].filter((path) => path !== taskFile && !path.startsWith(".agent/")).sort();
}

function scopeViolations(files: string[], task: Task): string[] {
  const forbidden = files.filter((path) => matchesAny(path, task.metadata.forbidden_paths));
  const outside = files.filter((path) => !matchesAny(path, task.metadata.allowed_paths));
  return [
    ...(forbidden.length ? [`forbidden paths: ${forbidden.join(", ")}`] : []),
    ...(outside.length ? [`outside allowed paths: ${outside.join(", ")}`] : []),
    ...(files.length > task.metadata.max_files
      ? [`changed ${files.length} files; max_files is ${task.metadata.max_files}`]
      : []),
  ];
}
