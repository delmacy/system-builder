import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";
import { git } from "./git.js";
import { readGitRecord } from "./git-workflow.js";
import { loadTasks, repoPath, taskMetadataSchema, type TaskMetadata } from "./task.js";

type VerificationReceipt = {
  taskId: string;
  verifiedAt: string;
  baseCommit: string;
  headCommit: string;
  changedFiles: string[];
  taskHash: string;
  packHash?: string;
  changeFingerprint?: string;
  commands?: Array<{ command: string; status: "passed" }>;
  status: "passed";
  validationGate?: unknown;
  reconciliation?: VerificationReconciliation;
  [key: string]: unknown;
};

type VerificationReconciliation = {
  schema_version: 1;
  kind: "POST_VERIFICATION_DEPENDENCY_ADDITION";
  previous_task_hash: string;
  reconciled_task_hash: string;
  historical_task_commit: string;
  current_pr_head: string;
  pr_number: number;
  added_dependencies: string[];
  reconciled_at: string;
};

type PullRequestIdentity = {
  state: string;
  mergedAt: string | null;
  mergeCommit: { oid: string } | null;
  headRefOid: string;
  headRefName: string;
  baseRefName: string;
};

type ParsedTaskSource = {
  metadata: TaskMetadata;
  body: string;
};

export function reconcileVerificationEvidence(
  taskId: string,
  root = process.cwd(),
  ghExecutable = "gh",
): VerificationReconciliation {
  const task = loadTasks(root).find((candidate) => candidate.metadata.id === taskId);
  if (!task) throw new Error(`Unknown task: ${taskId}`);
  if (task.metadata.status !== "ready") {
    throw new Error(`${taskId} must still be ready before verification reconciliation`);
  }

  const record = readGitRecord(taskId, root);
  if (!record?.commit || !record.pushed || !record.pullRequest) {
    throw new Error(`${taskId} requires a committed, pushed implementation PR before reconciliation`);
  }
  if (git(["branch", "--show-current"], root) !== "main") {
    throw new Error(`Verification reconciliation must run from main`);
  }
  if (git(["status", "--porcelain"], root)) {
    throw new Error(`Verification reconciliation requires a clean working tree`);
  }

  git(["fetch", "--prune", "origin", "main", record.branch], root);
  const divergence = git(["rev-list", "--left-right", "--count", "main...origin/main"], root)
    .split(/\s+/)
    .map(Number);
  if (divergence[0] !== 0 || divergence[1] !== 0) {
    throw new Error(`main must equal origin/main before verification reconciliation`);
  }

  const receiptPath = resolve(root, ".agent/evidence", `${taskId}.json`);
  if (!existsSync(receiptPath)) throw new Error(`${taskId} verification receipt is missing`);
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8")) as VerificationReceipt;
  if (receipt.taskId !== taskId || receipt.status !== "passed") {
    throw new Error(`${taskId} does not have a passing verification receipt`);
  }
  const currentTaskHash = hash(task.source);
  if (receipt.taskHash === currentTaskHash) {
    throw new Error(`${taskId} verification evidence is already current`);
  }
  if (receipt.reconciliation) {
    throw new Error(`${taskId} verification evidence already contains a reconciliation record`);
  }

  const taskPath = repoPath(root, task.file);
  const historicalSource = git(["show", `${record.commit}:${taskPath}`], root);
  if (!hashMatchesGitText(receipt.taskHash, historicalSource)) {
    throw new Error(`${taskId} stale receipt does not match the task specification at its recorded implementation commit`);
  }

  const historical = parseTaskSource(historicalSource, taskId);
  const current = parseTaskSource(task.source, taskId);
  assertOnlyCompletedDependenciesWereAdded(historical, current, root, taskId);

  const pr = JSON.parse(execFileSync(ghExecutable, [
    "pr", "view", String(record.pullRequest.number),
    "--json", "state,mergedAt,mergeCommit,headRefOid,headRefName,baseRefName",
  ], { cwd: root, encoding: "utf8" })) as PullRequestIdentity;
  if (pr.state !== "MERGED" || !pr.mergedAt || pr.headRefName !== record.branch || pr.baseRefName !== "main") {
    throw new Error(`PR #${record.pullRequest.number} is not the merged implementation PR for ${taskId}`);
  }
  if (!/^[0-9a-f]{40}$/.test(pr.headRefOid)) {
    throw new Error(`PR #${record.pullRequest.number} returned an invalid head identity`);
  }

  const prFiles = execFileSync(ghExecutable, ["pr", "diff", String(record.pullRequest.number), "--name-only"], {
    cwd: root,
    encoding: "utf8",
  }).split(/\r?\n/).filter(Boolean).sort();
  const verifiedFiles = [...receipt.changedFiles].sort();
  if (JSON.stringify(prFiles) !== JSON.stringify(verifiedFiles)) {
    throw new Error(`${taskId} merged PR files differ from the original verified file set`);
  }

  git(["fetch", "origin", record.branch], root);
  for (const file of verifiedFiles) {
    const original = git(["show", `${record.commit}:${file}`], root);
    const mergedHead = git(["show", `${pr.headRefOid}:${file}`], root);
    if (original !== mergedHead) {
      throw new Error(`${taskId} merged PR content differs from the original verified content: ${file}`);
    }
  }

  const mergeIntegrated = pr.mergeCommit?.oid
    ? gitExitOk(["merge-base", "--is-ancestor", pr.mergeCommit.oid, "HEAD"], root)
    : false;
  const headIntegrated = gitExitOk(["merge-base", "--is-ancestor", pr.headRefOid, "HEAD"], root);
  if (!mergeIntegrated && !headIntegrated) {
    throw new Error(`${taskId} merged implementation is not integrated into current main`);
  }

  const addedDependencies = current.metadata.depends_on
    .filter((dependency) => !historical.metadata.depends_on.includes(dependency))
    .sort();
  const reconciliation: VerificationReconciliation = {
    schema_version: 1,
    kind: "POST_VERIFICATION_DEPENDENCY_ADDITION",
    previous_task_hash: receipt.taskHash,
    reconciled_task_hash: currentTaskHash,
    historical_task_commit: record.commit,
    current_pr_head: pr.headRefOid,
    pr_number: record.pullRequest.number,
    added_dependencies: addedDependencies,
    reconciled_at: new Date().toISOString(),
  };

  const updated: VerificationReceipt = {
    ...receipt,
    taskHash: currentTaskHash,
    reconciliation,
  };
  const temporary = `${receiptPath}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(updated, null, 2)}\n`, { flag: "wx" });
  renameSync(temporary, receiptPath);
  return reconciliation;
}

function assertOnlyCompletedDependenciesWereAdded(
  historical: ParsedTaskSource,
  current: ParsedTaskSource,
  root: string,
  taskId: string,
): void {
  const historicalComparable = { ...historical.metadata, depends_on: [] as string[] };
  const currentComparable = { ...current.metadata, depends_on: [] as string[] };
  if (JSON.stringify(historicalComparable) !== JSON.stringify(currentComparable)) {
    throw new Error(`${taskId} task metadata changed beyond depends_on; reconciliation refused`);
  }
  if (normalizeBody(historical.body) !== normalizeBody(current.body)) {
    throw new Error(`${taskId} task body changed after verification; reconciliation refused`);
  }
  const removed = historical.metadata.depends_on.filter((dependency) => !current.metadata.depends_on.includes(dependency));
  if (removed.length) {
    throw new Error(`${taskId} dependencies were removed after verification: ${removed.join(", ")}`);
  }
  const added = current.metadata.depends_on.filter((dependency) => !historical.metadata.depends_on.includes(dependency));
  if (!added.length) {
    throw new Error(`${taskId} task hash changed without a dependency addition; reconciliation refused`);
  }
  const completed = new Set(loadTasks(root)
    .filter((candidate) => candidate.metadata.status === "completed")
    .map((candidate) => candidate.metadata.id));
  const incomplete = added.filter((dependency) => !completed.has(dependency));
  if (incomplete.length) {
    throw new Error(`${taskId} added dependencies are not completed: ${incomplete.join(", ")}`);
  }
}

function parseTaskSource(source: string, taskId: string): ParsedTaskSource {
  const match = normalizeBody(source).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match?.[1] || match[2] === undefined) throw new Error(`${taskId} task source is not valid frontmatter`);
  return {
    metadata: taskMetadataSchema.parse(YAML.parse(match[1])),
    body: match[2],
  };
}

function hashMatchesGitText(expected: string, source: string): boolean {
  const lf = `${source.replace(/\r\n/g, "\n")}\n`;
  const candidates = new Set([
    source,
    source.replace(/\r\n/g, "\n"),
    source.replace(/\r\n/g, "\n") + "\n",
    lf.replace(/\n/g, "\r\n"),
  ]);
  return [...candidates].some((candidate) => hash(candidate) === expected);
}

function normalizeBody(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\n+$/, "");
}

function gitExitOk(args: string[], root: string): boolean {
  try {
    execFileSync("git", args, { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("reconcile-verification-evidence.ts")) {
  const taskId = process.argv[2];
  if (!taskId) throw new Error("Usage: tsx tooling/agent-harness/src/reconcile-verification-evidence.ts TASK-XXX");
  process.stdout.write(`${JSON.stringify(reconcileVerificationEvidence(taskId), null, 2)}\n`);
}
