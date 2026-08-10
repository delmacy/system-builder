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
import YAML from "yaml";
import { analyzeArchitecture } from "./architecture.js";
import { changedPaths, git } from "./git.js";
import { matchesAny } from "./glob.js";
import { loadTasks, readyTasks, repoPath, type Task, validateTaskCatalog } from "./task.js";

type PackManifest = {
  taskId: string;
  taskFile: string;
  baseCommit: string;
  preparedAt: string;
  contextFiles: string[];
};

type VerificationReceipt = {
  taskId: string;
  verifiedAt: string;
  baseCommit: string;
  headCommit: string;
  changedFiles: string[];
  taskHash: string;
  commands: Array<{ command: string; status: "passed" }>;
  status: "passed";
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
  const manifest: PackManifest = {
    taskId,
    taskFile: repoPath(root, task.file),
    baseCommit: git(["rev-parse", "HEAD"], root),
    preparedAt: new Date().toISOString(),
    contextFiles: files,
  };
  writeFileSync(join(contextDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  const sections = files.map((file) => {
    const contents = readFileSync(resolve(root, file), "utf8");
    return `## ${file}\n\n<context-file path="${file}">\n${contents.trimEnd()}\n</context-file>`;
  });
  const pack = [
    `# Task Pack — ${taskId}`,
    "",
    `Prepared from commit \`${manifest.baseCommit}\`.`,
    "This pack is bounded by the task contract. The repository remains authoritative.",
    "",
    "## Execution metadata",
    "",
    "```yaml",
    YAML.stringify(task.metadata).trimEnd(),
    "```",
    "",
    ...sections,
    "",
  ].join("\n");
  const output = join(contextDirectory, "TASK_PACK.md");
  writeFileSync(output, pack);
  return output;
}

export function verifyTask(taskId: string, root = process.cwd()): VerificationReceipt {
  const task = findTask(taskId, root);
  const manifest = readManifest(taskId, root);
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
  for (const command of task.metadata.validation) {
    execSync(command, { cwd: root, stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
    commands.push({ command, status: "passed" });
  }
  const receipt: VerificationReceipt = {
    taskId,
    verifiedAt: new Date().toISOString(),
    baseCommit: manifest.baseCommit,
    headCommit: git(["rev-parse", "HEAD"], root),
    changedFiles: relevant,
    taskHash: hash(task.source),
    commands,
    status: "passed",
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
  if (receipt.taskHash !== hash(task.source)) throw new Error(`${taskId} changed after verification; verify again`);
  if (receipt.headCommit !== git(["rev-parse", "HEAD"], root)) {
    throw new Error(`HEAD changed after ${taskId} verification; verify again`);
  }
  const currentChanges = changedPaths(receipt.baseCommit, root).filter((file) => file !== repoPath(root, task.file));
  if (JSON.stringify(currentChanges) !== JSON.stringify(receipt.changedFiles)) {
    throw new Error(`${taskId} working tree changed after verification; verify again`);
  }

  const updated = task.source.replace(/^(status:\s*).+$/m, "$1completed");
  writeFileSync(task.file, updated);
  const evidencePath = resolve(root, "docs/evidence/tasks", `${taskId}.json`);
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, `${JSON.stringify(receipt, null, 2)}\n`);

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
