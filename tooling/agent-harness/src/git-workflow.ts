import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getTask, loadTasks, repoPath, type Task, validateTaskCatalog } from "./task.js";
import { changedPaths, git } from "./git.js";
import { matchesAny } from "./glob.js";
import { authorityClosureFiles } from "./authority-closure.js";

export type GitTaskRecord = {
  version: 1;
  taskId: string;
  branch: string;
  baseBranch: "main";
  baseCommit: string;
  remote: "origin";
  createdAt: string;
  commit?: string;
  verifiedFingerprint?: string;
  committedAt?: string;
  pushed?: boolean;
  pushedAt?: string;
  pullRequest?: {
    number: number;
    url: string;
    state: string;
    openedAt: string;
    mergeCommit?: string;
  };
};

export type GitTaskStatus = {
  taskId: string;
  taskStatus: string;
  expectedBranch: string;
  currentBranch: string;
  associatedBranch: string | null;
  baseCommit: string | null;
  head: string;
  workingTree: "clean" | "dirty";
  aheadOfOrigin: number | null;
  behindOrigin: number | null;
  prepared: boolean;
  verified: boolean;
  committed: boolean;
  pushed: boolean;
  pullRequest: GitTaskRecord["pullRequest"] | null;
};

export type StateTaskRecord = {
  version: 1;
  taskId: string;
  branch: string;
  createdAt: string;
  commit?: string;
  pushed?: boolean;
  pullRequest?: GitTaskRecord["pullRequest"];
};

type VerificationReceiptLike = {
  taskId: string;
  baseCommit: string;
  headCommit: string;
  changedFiles: string[];
  taskHash: string;
  packHash?: string;
  changeFingerprint?: string;
  status: "passed";
};

const forbiddenArtifactPatterns = [
  /(?:^|\/)\.env(?:\.|$)/i,
  /(?:^|\/)(?:node_modules|dist|coverage|output|\.playwright-cli)(?:\/|$)/i,
  /(?:^|\/)(?:id_rsa|id_ed25519)(?:\.|$)/i,
  /\.(?:pem|p12|pfx|key)$/i,
];

const secretContentPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /(?:password|passwd|api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i,
];

export function taskBranchName(task: Task): string {
  const number = task.metadata.id.match(/^TASK-([0-9]{3})/)?.[1];
  if (!number) throw new Error(`Cannot derive branch from ${task.metadata.id}`);
  const slug = task.metadata.title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56)
    .replace(/-+$/g, "");
  if (!slug) throw new Error(`${task.metadata.id} title does not produce a safe branch slug`);
  return `task/${number}-${slug}`;
}

export function stateBranchName(taskId: string): string {
  return `state/${taskId.toLowerCase()}-close`;
}

export function branchTask(taskId: string, root = process.cwd()): GitTaskRecord {
  const task = loadAndValidateTask(taskId, root);
  if (task.metadata.status !== "ready") throw new Error(`${taskId} must be ready before branch creation`);
  assertDependenciesComplete(task, root);
  assertClean(root);
  const currentBranch = git(["branch", "--show-current"], root);
  if (currentBranch !== "main") throw new Error(`task:branch must run from main; current branch is ${currentBranch || "detached HEAD"}`);
  ensureRemote(root);
  git(["fetch", "--prune", "origin", "main"], root);
  const sync = aheadBehind("main", "origin/main", root);
  if (sync.ahead !== 0 || sync.behind !== 0) {
    throw new Error(`main must equal origin/main (ahead ${sync.ahead}, behind ${sync.behind}); synchronize it manually`);
  }

  const branch = taskBranchName(task);
  const existsOnRemote = tryGit(["ls-remote", "--exit-code", "--heads", "origin", branch], root).ok;
  if (refExists(`refs/heads/${branch}`, root) || refExists(`refs/remotes/origin/${branch}`, root) || existsOnRemote) {
    throw new Error(`Refusing to overwrite existing task branch ${branch}`);
  }
  const baseCommit = git(["rev-parse", "main"], root);
  git(["switch", "-c", branch, "main"], root);
  const record: GitTaskRecord = {
    version: 1,
    taskId,
    branch,
    baseBranch: "main",
    baseCommit,
    remote: "origin",
    createdAt: new Date().toISOString(),
  };
  writeGitRecord(record, root);
  return record;
}

export function taskGitStatus(taskId: string, root = process.cwd()): GitTaskStatus {
  const task = loadAndValidateTask(taskId, root);
  const expectedBranch = taskBranchName(task);
  const record = readGitRecord(taskId, root);
  const currentBranch = git(["branch", "--show-current"], root) || "DETACHED";
  const head = git(["rev-parse", "HEAD"], root);
  const remoteRef = `refs/remotes/origin/${expectedBranch}`;
  const remoteExists = refExists(remoteRef, root);
  const divergence = remoteExists ? aheadBehind("HEAD", `origin/${expectedBranch}`, root) : null;
  const remoteHead = remoteExists ? git(["rev-parse", remoteRef], root) : null;
  return {
    taskId,
    taskStatus: task.metadata.status,
    expectedBranch,
    currentBranch,
    associatedBranch: record?.branch ?? null,
    baseCommit: record?.baseCommit ?? null,
    head,
    workingTree: isClean(root) ? "clean" : "dirty",
    aheadOfOrigin: divergence?.ahead ?? null,
    behindOrigin: divergence?.behind ?? null,
    prepared: existsSync(contextManifestPath(taskId, root)),
    verified: existsSync(verificationReceiptPath(taskId, root)),
    committed: Boolean(record?.commit),
    pushed: Boolean(record?.pushed && remoteHead === record.commit),
    pullRequest: record?.pullRequest ?? null,
  };
}

export function commitTask(taskId: string, root = process.cwd()): string {
  const task = loadAndValidateTask(taskId, root);
  const record = requireGitRecord(taskId, root);
  assertTaskBranch(record, root);
  if (record.commit) throw new Error(`${taskId} already records commit ${record.commit}; amend is not supported`);
  const receipt = readVerificationReceipt(taskId, root);
  assertVerifiedState(task, record, receipt, root);
  assertTaskScope(task, receipt.changedFiles);
  scanCommitCandidates(receipt.changedFiles, root);
  if (receipt.changedFiles.length === 0) throw new Error(`${taskId} has no verified implementation changes to commit`);

  git(["add", "--", ...receipt.changedFiles], root);
  const staged = lines(git(["diff", "--cached", "--name-only"], root));
  if (JSON.stringify(staged) !== JSON.stringify([...receipt.changedFiles].sort())) {
    throw new Error(`Staged files differ from verified files; aborting commit`);
  }
  const trackedContext = lines(git(["ls-files", ".agent/context"], root));
  if (trackedContext.length) throw new Error(`Task Pack files must never be committed: ${trackedContext.join(", ")}`);

  git(["commit", "-m", taskCommitMessage(task)], root);
  const commit = git(["rev-parse", "HEAD"], root);
  record.commit = commit;
  record.verifiedFingerprint = receipt.changeFingerprint ?? fingerprintChanges(receipt.changedFiles, root);
  record.committedAt = new Date().toISOString();
  writeGitRecord(record, root);
  return commit;
}

export function pushTask(taskId: string, root = process.cwd()): string {
  const record = requireGitRecord(taskId, root);
  assertTaskBranch(record, root);
  assertClean(root);
  const head = git(["rev-parse", "HEAD"], root);
  if (!record.commit || head !== record.commit) throw new Error(`${taskId} HEAD is not its recorded commit`);
  const hasUpstream = tryGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], root).ok;
  git(buildPushArgs(record.branch, hasUpstream), root);
  const remoteHead = git(["rev-parse", `refs/remotes/origin/${record.branch}`], root);
  if (remoteHead !== head) throw new Error(`Remote branch does not match ${taskId} commit after push`);
  record.pushed = true;
  record.pushedAt = new Date().toISOString();
  writeGitRecord(record, root);
  return remoteHead;
}

export function openTaskPullRequest(taskId: string, root = process.cwd(), ghExecutable = "gh"): GitTaskRecord["pullRequest"] {
  const task = loadAndValidateTask(taskId, root);
  const record = requireGitRecord(taskId, root);
  assertTaskBranch(record, root);
  assertClean(root);
  if (record.pullRequest) return record.pullRequest;
  if (!record.commit || !record.pushed) throw new Error(`${taskId} must be committed and pushed before opening a PR`);
  assertGitHubCli(ghExecutable, root, record.branch);
  const receipt = readVerificationReceipt(taskId, root);
  const body = buildPullRequestBody(task, record, receipt);
  const bodyFile = resolve(root, ".agent/git", `${taskId}-pr-body.md`);
  writeFileSync(bodyFile, body);
  let output: string;
  try {
    output = runExecutable(ghExecutable, [
      "pr", "create", "--base", "main", "--head", record.branch,
      "--title", taskCommitMessage(task), "--body-file", bodyFile,
    ], root);
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : error}\nManual PR: https://github.com/delmacy/system-builder/compare/main...${record.branch}?expand=1`);
  }
  const url = output.split(/\r?\n/).find((line) => /^https:\/\//.test(line.trim()))?.trim();
  const number = Number(url?.match(/\/pull\/(\d+)$/)?.[1]);
  if (!url || !Number.isInteger(number)) throw new Error(`PR was created but its URL could not be parsed: ${output}`);
  record.pullRequest = { number, url, state: "OPEN", openedAt: new Date().toISOString() };
  writeGitRecord(record, root);
  return record.pullRequest;
}

export function createStateTaskBranch(taskId: string, root = process.cwd()): StateTaskRecord {
  const task = loadAndValidateTask(taskId, root);
  if (task.metadata.status !== "completed") throw new Error(`${taskId} must be closed before creating its state branch`);
  const currentBranch = git(["branch", "--show-current"], root);
  if (currentBranch !== "main") throw new Error(`State branch creation must run from main; current branch is ${currentBranch || "detached HEAD"}`);
  const expectedFiles = stateClosureFiles(task, root);
  const changed = changedPaths("HEAD", root);
  if (JSON.stringify(changed) !== JSON.stringify(expectedFiles)) {
    throw new Error(`State closure changes must be exactly: ${expectedFiles.join(", ")}; found: ${changed.join(", ") || "none"}`);
  }
  const branch = stateBranchName(taskId);
  const existsOnRemote = tryGit(["ls-remote", "--exit-code", "--heads", "origin", branch], root).ok;
  if (refExists(`refs/heads/${branch}`, root) || refExists(`refs/remotes/origin/${branch}`, root) || existsOnRemote) {
    throw new Error(`Refusing to overwrite existing state branch ${branch}`);
  }
  git(["switch", "-c", branch], root);
  const record: StateTaskRecord = { version: 1, taskId, branch, createdAt: new Date().toISOString() };
  writeStateRecord(record, root);
  return record;
}

export function commitStateTask(taskId: string, root = process.cwd()): string {
  const task = loadAndValidateTask(taskId, root);
  const record = requireStateRecord(taskId, root);
  assertStateBranch(record, root);
  if (record.commit) throw new Error(`${taskId} state closure already records commit ${record.commit}`);
  const expectedFiles = stateClosureFiles(task, root);
  const changed = changedPaths("HEAD", root);
  if (JSON.stringify(changed) !== JSON.stringify(expectedFiles)) {
    throw new Error(`State closure changed files do not match the expected durable evidence set`);
  }
  scanCommitCandidates(expectedFiles, root);
  git(["add", "--", ...expectedFiles], root);
  if (JSON.stringify(lines(git(["diff", "--cached", "--name-only"], root))) !== JSON.stringify(expectedFiles)) {
    throw new Error(`Staged state files differ from the closure evidence set`);
  }
  git(["commit", "-m", `chore: close ${taskId}`], root);
  record.commit = git(["rev-parse", "HEAD"], root);
  writeStateRecord(record, root);
  return record.commit;
}

export function pushStateTask(taskId: string, root = process.cwd()): string {
  const record = requireStateRecord(taskId, root);
  assertStateBranch(record, root);
  assertClean(root);
  const head = git(["rev-parse", "HEAD"], root);
  if (!record.commit || record.commit !== head) throw new Error(`${taskId} state HEAD is not its recorded commit`);
  const hasUpstream = tryGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], root).ok;
  git(buildPushArgs(record.branch, hasUpstream), root);
  const remoteHead = git(["rev-parse", `refs/remotes/origin/${record.branch}`], root);
  if (remoteHead !== head) throw new Error(`Remote state branch does not match ${taskId} closure commit`);
  record.pushed = true;
  writeStateRecord(record, root);
  return remoteHead;
}

export function openStateTaskPullRequest(
  taskId: string,
  root = process.cwd(),
  ghExecutable = "gh",
): GitTaskRecord["pullRequest"] {
  const record = requireStateRecord(taskId, root);
  assertStateBranch(record, root);
  assertClean(root);
  if (record.pullRequest) return record.pullRequest;
  if (!record.commit || !record.pushed) throw new Error(`${taskId} state closure must be committed and pushed before PR creation`);
  assertGitHubCli(ghExecutable, root, record.branch);
  const bodyFile = resolve(root, ".agent/state", `${taskId}-pr-body.md`);
  mkdirSync(dirname(bodyFile), { recursive: true });
  writeFileSync(bodyFile, [
    `## State closure`, "", `- Task: \`${taskId}\``, `- Commit: \`${record.commit}\``,
    "- Durable task evidence and ledger update produced by `task:close`.", "",
    "Automatic merge is disabled. Human review is required.", "",
  ].join("\n"));
  const output = runExecutable(ghExecutable, [
    "pr", "create", "--base", "main", "--head", record.branch,
    "--title", `chore: close ${taskId}`, "--body-file", bodyFile,
  ], root);
  const url = output.split(/\r?\n/).find((line) => /^https:\/\//.test(line.trim()))?.trim();
  const number = Number(url?.match(/\/pull\/(\d+)$/)?.[1]);
  if (!url || !Number.isInteger(number)) throw new Error(`State PR was created but its URL could not be parsed: ${output}`);
  record.pullRequest = { number, url, state: "OPEN", openedAt: new Date().toISOString() };
  writeStateRecord(record, root);
  return record.pullRequest;
}

export function buildPullRequestBody(
  task: Task,
  record: GitTaskRecord,
  receipt: VerificationReceiptLike,
): string {
  const objective = taskSection(task, "Objective");
  const nonGoals = taskSection(task, "Non-goals");
  const escalation = taskSection(task, "Escalation");
  return [
    `## Task`, "", `- ID: \`${task.metadata.id}\``, `- Milestone: \`${task.metadata.milestone}\``,
    `- Model tier: \`${task.metadata.model_tier}\``, `- Risk: \`${task.metadata.risk}\``,
    `- Architecture impact: \`${String(task.metadata.architecture_impact)}\``, "",
    `## Objective`, "", objective, "", `## Changed files`, "",
    ...receipt.changedFiles.map((file) => `- \`${file}\``), "", `## Validation`, "",
    ...task.metadata.validation.map((command) => `- [x] \`${command}\``), "",
    `Status: **${receipt.status}**`, "", `## Evidence`, "",
    `- Base commit: \`${record.baseCommit}\``, `- Head commit: \`${record.commit ?? receipt.headCommit}\``,
    `- Durable evidence after closure: \`docs/evidence/tasks/${task.metadata.id}.json\``, "",
    `## Non-goals`, "", nonGoals, "", `## Risks / gaps`, "", escalation, "",
    "Automatic merge is disabled. Architecture-tier and high-risk work always requires human review.", "",
  ].join("\n");
}

export function buildPushArgs(branch: string, hasUpstream: boolean): string[] {
  return hasUpstream ? ["push", "origin", branch] : ["push", "--set-upstream", "origin", branch];
}

export function fingerprintChanges(files: string[], root = process.cwd()): string {
  const digest = createHash("sha256");
  for (const file of [...files].sort()) {
    const path = resolve(root, file);
    digest.update(`${file}\0`);
    if (!existsSync(path)) {
      digest.update("DELETED\0");
      continue;
    }
    const stats = statSync(path);
    digest.update(`${stats.mode}\0${stats.size}\0`);
    digest.update(readFileSync(path));
    digest.update("\0");
  }
  return digest.digest("hex");
}

export function assertGitHubCli(executable = "gh", root = process.cwd(), branch = "task/branch"): void {
  const version = spawnSync(executable, ["--version"], { cwd: root, encoding: "utf8", shell: false });
  if (version.error || version.status !== 0) {
    throw new Error(`GitHub CLI is unavailable. Install/authenticate gh, or open manually: https://github.com/delmacy/system-builder/compare/main...${branch}?expand=1`);
  }
  const auth = spawnSync(executable, ["auth", "status"], { cwd: root, encoding: "utf8", shell: false });
  if (auth.status !== 0) throw new Error(`GitHub CLI is not authenticated. Run: gh auth login`);
}

export function readGitRecord(taskId: string, root = process.cwd()): GitTaskRecord | undefined {
  const path = gitRecordPath(taskId, root);
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) as GitTaskRecord : undefined;
}

export function readStateRecord(taskId: string, root = process.cwd()): StateTaskRecord | undefined {
  const path = stateRecordPath(taskId, root);
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) as StateTaskRecord : undefined;
}

export function writeStateRecord(record: StateTaskRecord, root = process.cwd()): void {
  const path = stateRecordPath(record.taskId, root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
}

export function writeGitRecord(record: GitTaskRecord, root = process.cwd()): void {
  const path = gitRecordPath(record.taskId, root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
}

export function assertGitManagedCloseReady(
  task: Task,
  receipt: VerificationReceiptLike,
  root = process.cwd(),
  ghExecutable = "gh",
): GitTaskRecord {
  const record = requireGitRecord(task.metadata.id, root);
  assertClean(root);
  const currentBranch = git(["branch", "--show-current"], root);
  if (currentBranch !== "main") throw new Error(`Git-managed task closure must run from main after merge`);
  ensureRemote(root);
  const sync = aheadBehind("main", "origin/main", root);
  if (sync.ahead !== 0 || sync.behind !== 0) throw new Error(`main must equal origin/main before closing ${task.metadata.id}`);
  if (!record.commit || !record.pushed || !record.pullRequest) {
    throw new Error(`${task.metadata.id} must be committed, pushed and have a PR before closure`);
  }
  if (receipt.taskHash !== hashText(task.source) || receipt.status !== "passed") {
    throw new Error(`${task.metadata.id} verification evidence is stale`);
  }
  const committedFiles = lines(git(["diff", "--name-only", `${record.baseCommit}...${record.commit}`], root));
  if (JSON.stringify(committedFiles) !== JSON.stringify([...receipt.changedFiles].sort())) {
    throw new Error(`${task.metadata.id} committed files differ from verified files`);
  }
  assertGitHubCli(ghExecutable, root, record.branch);
  const pr = JSON.parse(runExecutable(ghExecutable, [
    "pr", "view", String(record.pullRequest.number), "--json", "number,url,state,mergedAt,mergeCommit,headRefName,baseRefName",
  ], root)) as { state: string; mergedAt: string | null; mergeCommit: { oid: string } | null; headRefName: string; baseRefName: string };
  if (pr.state !== "MERGED" || !pr.mergedAt || pr.headRefName !== record.branch || pr.baseRefName !== "main") {
    throw new Error(`PR #${record.pullRequest.number} is not a merged ${record.branch} -> main PR`);
  }
  const originalIntegrated = tryGit(["merge-base", "--is-ancestor", record.commit, "HEAD"], root).ok;
  const mergedCommit = pr.mergeCommit?.oid;
  const mergeIntegrated = Boolean(mergedCommit && tryGit(["merge-base", "--is-ancestor", mergedCommit, "HEAD"], root).ok);
  if (!originalIntegrated && !mergeIntegrated) {
    throw new Error(`Neither task commit nor GitHub merge commit is integrated into current main`);
  }
  if (!originalIntegrated && mergedCommit) {
    const mergedFiles = lines(git(["diff", "--name-only", `${mergedCommit}^1`, mergedCommit], root));
    if (JSON.stringify(mergedFiles) !== JSON.stringify([...receipt.changedFiles].sort())) {
      throw new Error(`GitHub merge commit files differ from verified files`);
    }
  }
  record.pullRequest.state = "MERGED";
  if (mergedCommit) record.pullRequest.mergeCommit = mergedCommit;
  writeGitRecord(record, root);
  return record;
}

function assertVerifiedState(task: Task, record: GitTaskRecord, receipt: VerificationReceiptLike, root: string): void {
  if (receipt.status !== "passed" || receipt.taskId !== task.metadata.id) throw new Error(`Invalid verification receipt`);
  if (receipt.baseCommit !== record.baseCommit) throw new Error(`Verification base differs from task branch base`);
  if (receipt.headCommit !== record.baseCommit) throw new Error(`Unexpected commits were added before task:commit`);
  if (receipt.taskHash !== hashText(task.source)) throw new Error(`Task specification changed after verification`);
  const manifest = readContextManifest(task.metadata.id, root);
  if (!manifest.packHash || hashText(readFileSync(contextPackPath(task.metadata.id, root), "utf8")) !== manifest.packHash) {
    throw new Error(`Task Pack changed after preparation`);
  }
  if (receipt.packHash !== manifest.packHash) throw new Error(`Verification does not match the prepared Task Pack`);
  const current = changedPaths(record.baseCommit, root).filter((file) => file !== repoPath(root, task.file));
  if (JSON.stringify(current) !== JSON.stringify(receipt.changedFiles)) {
    throw new Error(`Working tree changed after verification`);
  }
  if (!receipt.changeFingerprint || fingerprintChanges(current, root) !== receipt.changeFingerprint) {
    throw new Error(`File content changed after verification`);
  }
}

function scanCommitCandidates(files: string[], root: string): void {
  const badPaths = files.filter((file) => file.startsWith(".agent/") || forbiddenArtifactPatterns.some((pattern) => pattern.test(file)));
  if (badPaths.length) throw new Error(`Forbidden generated/secret paths: ${badPaths.join(", ")}`);
  const secretHits: string[] = [];
  for (const file of files) {
    const path = resolve(root, file);
    if (!existsSync(path) || statSync(path).isDirectory()) continue;
    if (statSync(path).size > 5_000_000) throw new Error(`Refusing oversized task file: ${file}`);
    const buffer = readFileSync(path);
    if (buffer.includes(0)) continue;
    const content = buffer.toString("utf8");
    if (secretContentPatterns.some((pattern) => pattern.test(content))) secretHits.push(file);
  }
  if (secretHits.length) throw new Error(`Possible secret material detected: ${secretHits.join(", ")}`);
}

function assertTaskScope(task: Task, files: string[]): void {
  const forbidden = files.filter((file) => matchesAny(file, task.metadata.forbidden_paths));
  const outside = files.filter((file) => !matchesAny(file, task.metadata.allowed_paths));
  if (forbidden.length) throw new Error(`Forbidden paths changed: ${forbidden.join(", ")}`);
  if (outside.length) throw new Error(`Paths outside allowed scope: ${outside.join(", ")}`);
  if (files.length > task.metadata.max_files) {
    throw new Error(`Changed ${files.length} files; max_files is ${task.metadata.max_files}`);
  }
}

function taskCommitMessage(task: Task): string {
  return `${task.metadata.id}: ${task.metadata.title.toLowerCase()}`;
}

function taskSection(task: Task, heading: string): string {
  const match = task.body.match(new RegExp(`^## ${escapeRegExp(heading)}\\s*\\r?\\n([\\s\\S]*?)(?=^## |\\s*$)`, "mi"));
  return match?.[1]?.trim() || "Not specified.";
}

function assertDependenciesComplete(task: Task, root: string): void {
  const completed = new Set(loadTasks(root).filter((item) => item.metadata.status === "completed").map((item) => item.metadata.id));
  const blocked = task.metadata.depends_on.filter((id) => !completed.has(id));
  if (blocked.length) throw new Error(`${task.metadata.id} is blocked by: ${blocked.join(", ")}`);
}

function loadAndValidateTask(taskId: string, root: string): Task {
  const tasks = loadTasks(root);
  validateTaskCatalog(tasks);
  return getTask(tasks, taskId);
}

function assertTaskBranch(record: GitTaskRecord, root: string): void {
  const current = git(["branch", "--show-current"], root);
  if (current === "main") throw new Error(`Task delivery commits are forbidden on main`);
  if (current !== record.branch) throw new Error(`Expected branch ${record.branch}; current branch is ${current || "detached HEAD"}`);
}

function assertStateBranch(record: StateTaskRecord, root: string): void {
  const current = git(["branch", "--show-current"], root);
  if (current === "main") throw new Error(`State delivery commits are forbidden on main`);
  if (current !== record.branch) throw new Error(`Expected state branch ${record.branch}; current branch is ${current || "detached HEAD"}`);
}

function assertClean(root: string): void {
  if (!isClean(root)) throw new Error(`Working tree must be clean`);
}

function isClean(root: string): boolean {
  return git(["status", "--porcelain"], root) === "";
}

function ensureRemote(root: string): void {
  if (!lines(git(["remote"], root)).includes("origin")) throw new Error(`Remote origin is required`);
  if (!refExists("refs/remotes/origin/main", root)) git(["fetch", "origin", "main"], root);
}

function aheadBehind(left: string, right: string, root: string): { ahead: number; behind: number } {
  const [leftOnly = "0", rightOnly = "0"] = git(["rev-list", "--left-right", "--count", `${left}...${right}`], root).split(/\s+/);
  return { ahead: Number(leftOnly), behind: Number(rightOnly) };
}

function refExists(ref: string, root: string): boolean {
  return tryGit(["show-ref", "--verify", "--quiet", ref], root).ok;
}

function tryGit(args: string[], root: string): { ok: boolean; output: string } {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", shell: false });
  return { ok: result.status === 0, output: result.stdout?.trim() ?? "" };
}

function runExecutable(executable: string, args: string[], root: string): string {
  try {
    return execFileSync(executable, args, { cwd: root, encoding: "utf8" }).trim();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${executable} ${args.slice(0, 2).join(" ")} failed: ${detail}`);
  }
}

function requireGitRecord(taskId: string, root: string): GitTaskRecord {
  const record = readGitRecord(taskId, root);
  if (!record) throw new Error(`Run task:branch for ${taskId} first`);
  return record;
}

function requireStateRecord(taskId: string, root: string): StateTaskRecord {
  const record = readStateRecord(taskId, root);
  if (!record) throw new Error(`Create the state branch for ${taskId} first`);
  return record;
}

function readVerificationReceipt(taskId: string, root: string): VerificationReceiptLike {
  const path = verificationReceiptPath(taskId, root);
  if (!existsSync(path)) throw new Error(`Run task:verify for ${taskId} first`);
  return JSON.parse(readFileSync(path, "utf8")) as VerificationReceiptLike;
}

function readContextManifest(taskId: string, root: string): { packHash?: string } {
  const path = contextManifestPath(taskId, root);
  if (!existsSync(path)) throw new Error(`Run task:prepare for ${taskId} first`);
  return JSON.parse(readFileSync(path, "utf8")) as { packHash?: string };
}

function gitRecordPath(taskId: string, root: string): string {
  return resolve(root, ".agent/git", `${taskId}.json`);
}

function stateRecordPath(taskId: string, root: string): string {
  return resolve(root, ".agent/state", `${taskId}.json`);
}

function stateClosureFiles(task: Task, root: string): string[] {
  return [
    repoPath(root, task.file),
    `docs/evidence/tasks/${task.metadata.id}.json`,
    "docs/current/TASK_LEDGER.json",
    ...authorityClosureFiles(task.metadata.id, root),
  ].sort();
}

function contextManifestPath(taskId: string, root: string): string {
  return resolve(root, ".agent/context", taskId, "manifest.json");
}

function contextPackPath(taskId: string, root: string): string {
  return resolve(root, ".agent/context", taskId, "TASK_PACK.md");
}

function verificationReceiptPath(taskId: string, root: string): string {
  return resolve(root, ".agent/evidence", `${taskId}.json`);
}

function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function lines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).sort();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
