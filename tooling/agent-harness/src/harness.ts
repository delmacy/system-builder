import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { analyzeArchitecture } from "./architecture.js";
import { changedPaths, git } from "./git.js";
import { assertGitManagedCloseReady, fingerprintChanges, readGitRecord } from "./git-workflow.js";
import { matchesAny } from "./glob.js";
import { buildLegacyTaskPackContent } from "./task-pack.js";
import { loadTasks, readyTasks, repoPath, type Task, validateTaskCatalog } from "./task.js";
import {
  classifyEvaluatorChanges,
  runIndependentValidation,
  runValidationCommand,
  type ValidationGateReceipt,
  type ValidationSnapshot,
} from "./validation-engine.js";
import type { ExecutionBoundaryCompletion } from "./execution-harness.js";
export {
  buildAgentFactoryAttemptEvidence,
  buildAgentFactoryEvidence,
  writeAgentFactoryAttemptEvidence,
  writeAgentFactoryEvidence,
} from "./evidence-writer.js";
export { applyLedgerTransition, buildLedgerTransitionEvent } from "./ledger-engine.js";
export { recomputeSuccessorReadiness } from "./readiness-recompute.js";
export { buildPostHardeningI1Proof, buildRepresentativeI1Proof, writeI1Proof, writePostHardeningI1Proof } from "./i1-proof.js";
export { SequentialPipelineCoordinator, sequentialObservationSchema, sequentialPlanSchema, sequentialReceiptSchema } from "./sequential-pipeline.js";
export { evaluateHumanApproval, evaluateStoredHumanApproval, humanApprovalId, humanApprovalSigningPayload } from "./human-approval.js";
export {
  evaluatePackageAuthorization,
  evaluatePackageTaskConformance,
  evaluateStoredPackageAuthorization,
  packageApprovalId,
  packageAuthorizationEvaluationSchema,
  packageAuthorizationPlanSchema,
  packageAuthorizationReceiptSchema,
  packageAuthorizationSigningPayload,
  packagePlanHash,
  packageRevocationId,
  packageRevocationReceiptSchema,
  packageRevocationSigningPayload,
  packageTaskDescriptorSchema,
  packageTaskConformanceSchema,
  packageUseReceiptSchema,
  writePackageUseReceipt,
} from "./package-authorization.js";
export { AgentFactorySupervisor, isRetryableFailure, retryDelaySeconds } from "./pipeline-supervisor.js";
export { DurableSupervisorStore } from "./supervisor-store.js";
export {
  buildTaskCatalogDag,
  createSupervisorRuntime,
  loadSupervisorRuntimePlan,
  LocalProcessCallbackTransport,
  mapSequentialReceipt,
  RepositorySequentialAdapter,
  SequentialSupervisorIterationAdapter,
  supervisorRuntimePlanSchema,
} from "./supervisor-runtime.js";
export {
  agentFactoryEventSchema, buildSupervisorEvent, supervisorCallbackSchema, supervisorConfigSchema,
  supervisorEventRecordSchema, supervisorLeaseSchema, supervisorProjectionSchema,
} from "./supervisor-contracts.js";

type PackManifest = {
  taskId: string;
  taskFile: string;
  baseCommit: string;
  preparedAt: string;
  contextFiles: string[];
  branch: string;
  taskHash: string;
  packHash: string;
};

type VerificationReceipt = {
  taskId: string;
  verifiedAt: string;
  baseCommit: string;
  headCommit: string;
  changedFiles: string[];
  taskHash: string;
  packHash: string;
  changeFingerprint: string;
  commands: Array<{ command: string; status: "passed" }>;
  status: "passed";
  validationGate?: ValidationGateReceipt;
};

export function nextTask(root = process.cwd()): Task | undefined {
  const tasks = loadTasks(root);
  validateTaskCatalog(tasks);
  return readyTasks(tasks)[0];
}

export function prepareTask(taskId: string, root = process.cwd()): string {
  const task = findTask(taskId, root);
  if (!["ready", "running", "verification"].includes(task.metadata.status)) {
    throw new Error(`${taskId} cannot be prepared from status ${task.metadata.status}`);
  }
  const tasks = loadTasks(root);
  const completed = new Set(
    tasks.filter((candidate) => candidate.metadata.status === "completed").map((candidate) => candidate.metadata.id),
  );
  const blockedBy = task.metadata.depends_on.filter((dependency) => !completed.has(dependency));
  if (blockedBy.length) throw new Error(`${taskId} is blocked by: ${blockedBy.join(", ")}`);
  const files = expandContext(task.metadata.context_paths, root);
  const contextDirectory = resolve(root, ".agent/context", taskId);
  const existingManifest = join(contextDirectory, "manifest.json");
  if (existsSync(existingManifest)) {
    throw new Error(`${taskId} is already prepared; remove its ignored context directory only to restart intentionally`);
  }
  mkdirSync(contextDirectory, { recursive: true });
  const baseCommit = git(["rev-parse", "HEAD"], root);
  const pack = buildLegacyTaskPackContent(task, baseCommit, files.map((file) => ({
    path: file,
    contents: readFileSync(resolve(root, file), "utf8"),
  })));
  const output = join(contextDirectory, "TASK_PACK.md");
  writeFileSync(output, pack);
  const manifest: PackManifest = {
    taskId,
    taskFile: repoPath(root, task.file),
    baseCommit,
    preparedAt: new Date().toISOString(),
    contextFiles: files,
    branch: git(["branch", "--show-current"], root) || "DETACHED",
    taskHash: hash(task.source),
    packHash: hash(pack),
  };
  writeFileSync(join(contextDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return output;
}

export function verifyTask(
  taskId: string,
  root = process.cwd(),
  completion?: ExecutionBoundaryCompletion,
): VerificationReceipt {
  const task = findTask(taskId, root);
  const manifest = readManifest(taskId, root);
  const packPath = resolve(root, ".agent/context", taskId, "TASK_PACK.md");
  if (manifest.taskHash !== hash(task.source) || !existsSync(packPath) || manifest.packHash !== hash(readFileSync(packPath, "utf8"))) {
    throw new Error(`${taskId} Task Pack or task specification changed after preparation`);
  }
  const changed = changedPaths(manifest.baseCommit, root);
  const taskFile = repoPath(root, task.file);
  const relevant = changed.filter((file) => file !== taskFile);
  const forbidden = relevant.filter((file) => matchesAny(file, task.metadata.forbidden_paths));
  const outside = relevant.filter((file) => !matchesAny(file, task.metadata.allowed_paths));
  if (forbidden.length || outside.length) {
    const messages = [
      forbidden.length ? `Forbidden paths:\n${forbidden.join("\n")}` : "",
      outside.length ? `Outside allowed paths:\n${outside.join("\n")}` : "",
    ].filter(Boolean);
    throw new Error(messages.join("\n"));
  }
  if (relevant.length > task.metadata.max_files) {
    throw new Error(`Changed ${relevant.length} files; max_files is ${task.metadata.max_files}`);
  }

  const commands: VerificationReceipt["commands"] = [];
  const beforeFingerprint = fingerprintChanges(relevant, root);
  let validationGate: ValidationGateReceipt | undefined;
  if (completion) {
    const before = validationSnapshot(relevant, beforeFingerprint, root);
    validationGate = runIndependentValidation(
      task,
      completion,
      before,
      (command) => runValidationCommand(command, root),
      () => {
        const afterFiles = changedPaths(manifest.baseCommit, root).filter((file) => file !== taskFile);
        return validationSnapshot(afterFiles, fingerprintChanges(afterFiles, root), root);
      },
    );
    if (validationGate.decision === "FAIL") {
      throw new Error(`${taskId} independent validation failed: ${validationGate.reason_codes.join(", ")}`);
    }
    commands.push(...validationGate.commands.map((result) => ({ command: result.command, status: "passed" as const })));
  } else {
    for (const command of task.metadata.validation) {
      execSync(command, { cwd: root, stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
      commands.push({ command, status: "passed" });
    }
  }
  const afterValidation = changedPaths(manifest.baseCommit, root).filter((file) => file !== taskFile);
  if (JSON.stringify(afterValidation) !== JSON.stringify(relevant)) {
    throw new Error(`${taskId} validations changed the task file set; inspect and verify again`);
  }
  if (fingerprintChanges(afterValidation, root) !== beforeFingerprint) {
    throw new Error(`${taskId} validations changed repository content; inspect and verify again`);
  }
  const receipt: VerificationReceipt = {
    taskId,
    verifiedAt: new Date().toISOString(),
    baseCommit: manifest.baseCommit,
    headCommit: git(["rev-parse", "HEAD"], root),
    changedFiles: relevant,
    taskHash: hash(task.source),
    packHash: manifest.packHash,
    changeFingerprint: fingerprintChanges(relevant, root),
    commands,
    status: "passed",
    ...(validationGate ? { validationGate } : {}),
  };
  const receiptPath = resolve(root, ".agent/evidence", `${taskId}.json`);
  mkdirSync(dirname(receiptPath), { recursive: true });
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
}

export function closeTask(taskId: string, root = process.cwd()): string {
  const task = findTask(taskId, root);
  const receiptPath = resolve(root, ".agent/evidence", `${taskId}.json`);
  if (!existsSync(receiptPath)) throw new Error(`Run task:verify for ${taskId} before closing`);
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8")) as VerificationReceipt;
  if (receipt.status !== "passed") throw new Error(`${taskId} has no passing verification receipt`);
  let gitRecord = readGitRecord(taskId, root);
  if (gitRecord) {
    gitRecord = assertGitManagedCloseReady(task, receipt, root);
  } else {
    if (receipt.taskHash !== hash(task.source)) throw new Error(`${taskId} changed after verification; verify again`);
    if (receipt.headCommit !== git(["rev-parse", "HEAD"], root)) {
      throw new Error(`HEAD changed after ${taskId} verification; verify again`);
    }
    const currentChanges = changedPaths(receipt.baseCommit, root).filter((file) => file !== repoPath(root, task.file));
    if (JSON.stringify(currentChanges) !== JSON.stringify(receipt.changedFiles)) {
      throw new Error(`${taskId} working tree changed after verification; verify again`);
    }
  }

  const updated = task.source.replace(/^(status:\s*).+$/m, "$1completed");
  writeFileSync(task.file, updated);
  const evidencePath = resolve(root, "docs/evidence/tasks", `${taskId}.json`);
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, `${JSON.stringify(gitRecord ? { ...receipt, git: gitRecord } : receipt, null, 2)}\n`);

  const tasks = loadTasks(root);
  validateTaskCatalog(tasks);
  const milestoneStates = tasks.reduce<Record<string, Array<{ id: string; status: string }>>>((result, item) => {
    (result[item.metadata.milestone] ??= []).push({ id: item.metadata.id, status: item.metadata.status });
    return result;
  }, {});
  const ledger = {
    updatedAt: new Date().toISOString(),
    completed: tasks.filter((item) => item.metadata.status === "completed").map((item) => item.metadata.id),
    ready: readyTasks(tasks).map((item) => item.metadata.id),
    milestones: milestoneStates,
  };
  const ledgerPath = resolve(root, "docs/current/TASK_LEDGER.json");
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
  return evidencePath;
}

export function validateTasks(root = process.cwd()): number {
  const tasks = loadTasks(root);
  validateTaskCatalog(tasks);
  return tasks.length;
}

export function validateArchitecture(root = process.cwd()): void {
  const violations = analyzeArchitecture(root);
  if (violations.length) throw new Error(`Architecture violations:\n${JSON.stringify(violations, null, 2)}`);
}

function findTask(taskId: string, root: string): Task {
  const tasks = loadTasks(root);
  validateTaskCatalog(tasks);
  const task = tasks.find((candidate) => candidate.metadata.id === taskId);
  if (!task) throw new Error(`Unknown task: ${taskId}`);
  return task;
}

function expandContext(patterns: string[], root: string): string[] {
  for (const pattern of patterns) {
    if (pattern.startsWith("/") || pattern.includes("..")) throw new Error(`Unsafe context path: ${pattern}`);
  }
  const candidates = walk(root)
    .map((file) => relative(root, file).replaceAll("\\", "/"))
    .filter((file) => !file.startsWith(".git/") && !file.startsWith("node_modules/") && !file.startsWith(".agent/"));
  const files = candidates.filter((file) => matchesAny(file, patterns)).sort();
  if (files.length === 0) throw new Error("No context files matched the task context_paths");
  const missing = patterns.filter((pattern) => !files.some((file) => matchesAny(file, [pattern])));
  if (missing.length) throw new Error(`Context paths did not match files: ${missing.join(", ")}`);
  const totalBytes = files.reduce((total, file) => total + statSync(resolve(root, file)).size, 0);
  if (totalBytes > 300_000) throw new Error(`Context pack exceeds 300000 bytes (${totalBytes})`);
  return files;
}

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const file = join(directory, name);
    if (name === ".git" || name === "node_modules" || name === "dist") return [];
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function readManifest(taskId: string, root: string): PackManifest {
  const path = resolve(root, ".agent/context", taskId, "manifest.json");
  if (!existsSync(path)) throw new Error(`Run task:prepare for ${taskId} before verification`);
  return JSON.parse(readFileSync(path, "utf8")) as PackManifest;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function validationSnapshot(files: string[], fingerprint: string, root: string): ValidationSnapshot {
  const evaluator = classifyEvaluatorChanges(files, (path) => existsSync(resolve(root, path)));
  return { changedFiles: files, fingerprint, ...evaluator };
}
