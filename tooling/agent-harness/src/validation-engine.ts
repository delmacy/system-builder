import { spawnSync } from "node:child_process";
import { z } from "zod";
import type { ExecutionBoundaryCompletion } from "./execution-harness.js";
import { matchesAny } from "./glob.js";
import type { Task } from "./task.js";

const reasonCodeSchema = z.enum([
  "BOUNDARY_REJECTED",
  "SCOPE_VIOLATION",
  "COMMAND_FAILED",
  "COMMAND_TIMED_OUT",
  "EVALUATOR_MISSING",
  "EVALUATOR_CHANGED",
  "VALIDATION_MUTATED_REPOSITORY",
]);

export const validationGateReceiptSchema = z.object({
  schema_version: z.literal(1),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  work_package_id: z.string().regex(/^WP-[A-Z0-9-]+$/),
  source_commit: z.string().regex(/^[0-9a-f]{40}$/),
  changed_files: z.array(z.string()),
  commands: z.array(z.object({
    command: z.string().min(1),
    status: z.enum(["PASS", "FAIL", "TIMED_OUT"]),
    exit_code: z.number().int().nullable(),
    stdout: z.string(),
    stderr: z.string(),
  }).strict()),
  evaluator_changes: z.array(z.string()),
  missing_evaluators: z.array(z.string()),
  content_stable: z.boolean(),
  decision: z.enum(["PASS", "FAIL", "REVIEW_REQUIRED"]),
  reason_codes: z.array(reasonCodeSchema),
}).strict().superRefine((receipt, context) => {
  if (receipt.decision === "PASS" && receipt.reason_codes.length > 0) {
    context.addIssue({ code: "custom", path: ["decision"], message: "PASS cannot retain validation reasons" });
  }
  if (receipt.decision === "FAIL" && !receipt.reason_codes.some((reason) => reason !== "EVALUATOR_CHANGED")) {
    context.addIssue({ code: "custom", path: ["reason_codes"], message: "FAIL requires a blocking reason" });
  }
  if (receipt.decision === "REVIEW_REQUIRED"
    && (receipt.reason_codes.length !== 1 || receipt.reason_codes[0] !== "EVALUATOR_CHANGED")) {
    context.addIssue({ code: "custom", path: ["reason_codes"], message: "REVIEW_REQUIRED is reserved for evaluator changes" });
  }
});

export type ValidationGateReceipt = z.infer<typeof validationGateReceiptSchema>;
export type ValidationSnapshot = {
  changedFiles: string[];
  fingerprint: string;
  evaluatorChanges: string[];
  missingEvaluators: string[];
};
export type ValidationCommandResult = {
  status: number | null;
  stdout: string;
  stderr: string;
  timedOut?: boolean;
};
export type ValidationCommandRunner = (command: string) => ValidationCommandResult;

const evaluatorPatterns: string[] = [
  "**/tests/**",
  "**/*.test.*",
  "**/*.spec.*",
  ".github/workflows/**",
  "project_docs/execution_governance/**",
  "package.json",
  "package-lock.json",
  "tsconfig*.json",
  "eslint.config.*",
  "tooling/agent-harness/src/architecture.ts",
  "tooling/agent-harness/src/harness.ts",
  "tooling/agent-harness/src/validation-engine.ts",
];

export function classifyEvaluatorChanges(changedFiles: string[], exists: (path: string) => boolean): {
  evaluatorChanges: string[];
  missingEvaluators: string[];
} {
  const evaluatorChanges = [...new Set(changedFiles.filter((path) => matchesAny(path, evaluatorPatterns)))].sort();
  return { evaluatorChanges, missingEvaluators: evaluatorChanges.filter((path) => !exists(path)) };
}

export function runIndependentValidation(
  task: Task,
  completion: ExecutionBoundaryCompletion,
  before: ValidationSnapshot,
  runner: ValidationCommandRunner,
  observeAfter: () => ValidationSnapshot,
): ValidationGateReceipt {
  const reasons = new Set<z.infer<typeof reasonCodeSchema>>();
  const identity = completion.boundary;
  const request = completion.rawReport.request;
  if (identity.taskId !== task.metadata.id
    || completion.report.status !== "completed"
    || completion.violations.length > 0
    || identity.baseCommit !== identity.sourceCommit
    || identity.headCommit !== identity.baseCommit
    || !request
    || request.task_id !== identity.taskId
    || request.work_package_id !== identity.workPackageId
    || request.source_commit !== identity.sourceCommit
    || request.attempt !== identity.attempt) reasons.add("BOUNDARY_REJECTED");

  const expectedFiles = sorted(completion.changedFiles);
  const beforeFiles = sorted(before.changedFiles);
  if (JSON.stringify(expectedFiles) !== JSON.stringify(beforeFiles) || scopeViolations(beforeFiles, task).length > 0) {
    reasons.add("SCOPE_VIOLATION");
  }
  if (before.missingEvaluators.length > 0) reasons.add("EVALUATOR_MISSING");
  else if (before.evaluatorChanges.length > 0) reasons.add("EVALUATOR_CHANGED");

  const commands = task.metadata.validation.map((command) => {
    let result: ValidationCommandResult;
    try {
      result = runner(command);
    } catch (error) {
      result = { status: null, stdout: "", stderr: error instanceof Error ? error.message : String(error) };
    }
    const timedOut = Boolean(result.timedOut);
    if (timedOut) reasons.add("COMMAND_TIMED_OUT");
    else if (result.status !== 0) reasons.add("COMMAND_FAILED");
    return {
      command,
      status: timedOut ? "TIMED_OUT" as const : result.status === 0 ? "PASS" as const : "FAIL" as const,
      exit_code: result.status,
      stdout: bounded(result.stdout),
      stderr: bounded(result.stderr),
    };
  });
  const after = observeAfter();
  if (JSON.stringify(beforeFiles) !== JSON.stringify(sorted(after.changedFiles))
    || before.fingerprint !== after.fingerprint) reasons.add("VALIDATION_MUTATED_REPOSITORY");

  const reasonCodes = [...reasons];
  const blocking = reasonCodes.some((reason) => reason !== "EVALUATOR_CHANGED");
  const decision = blocking ? "FAIL" : reasonCodes.includes("EVALUATOR_CHANGED") ? "REVIEW_REQUIRED" : "PASS";
  return validationGateReceiptSchema.parse({
    schema_version: 1,
    task_id: identity.taskId,
    work_package_id: identity.workPackageId,
    source_commit: identity.sourceCommit,
    changed_files: beforeFiles,
    commands,
    evaluator_changes: sorted(before.evaluatorChanges),
    missing_evaluators: sorted(before.missingEvaluators),
    content_stable: !reasonCodes.includes("VALIDATION_MUTATED_REPOSITORY"),
    decision,
    reason_codes: reasonCodes,
  });
}

export function runValidationCommand(command: string, root = process.cwd(), timeoutMs = 30 * 60 * 1000): ValidationCommandResult {
  const result = spawnSync(command, [], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh",
    timeout: timeoutMs,
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: [result.stderr, result.error?.message].filter(Boolean).join("\n"),
    timedOut: (result.error as NodeJS.ErrnoException | undefined)?.code === "ETIMEDOUT",
  };
}

function scopeViolations(files: string[], task: Task): string[] {
  return files.filter((path) => matchesAny(path, task.metadata.forbidden_paths)
    || !matchesAny(path, task.metadata.allowed_paths)).concat(files.length > task.metadata.max_files ? ["MAX_FILES"] : []);
}

function sorted(values: string[]): string[] { return [...new Set(values)].sort(); }
function bounded(value: string): string { return value.length <= 16_000 ? value : `${value.slice(0, 16_000)}\n[truncated]`; }
