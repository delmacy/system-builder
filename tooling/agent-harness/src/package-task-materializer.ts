import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { z } from "zod";
import { evaluateStoredPackageTaskSpecAuthorization, packageTaskSpecAuthorizationSchema } from "./package-authorization.js";
import { loadTasks, parseTask, validateTaskCatalog } from "./task.js";

const sha = z.string().regex(/^[0-9a-f]{40}$/);
const hash = z.string().regex(/^[0-9a-f]{64}$/);

export const packageTaskMaterializationRecordSchema = z.object({
  schema_version: z.literal(1),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  descriptor_id: z.string().regex(/^PWD-[A-Z0-9-]+$/),
  candidate_name: z.string().regex(/^TASK-[A-Z0-9-]+\.md$/),
  candidate_sha256: hash,
  candidate_source: z.string().min(1),
  source_commit: sha,
  branch: z.string().regex(/^task-spec\/[a-z0-9-]+$/),
  written: z.boolean(),
  commit: sha.nullable(),
  pushed: z.boolean(),
  pull_request: z.object({ number: z.number().int().positive(), url: z.string().url() }).strict().nullable(),
  authorization: packageTaskSpecAuthorizationSchema.nullable(),
  merged: z.boolean(),
  integrated: z.boolean(),
}).strict();

export type PackageTaskMaterializationRecord = z.infer<typeof packageTaskMaterializationRecordSchema>;

export function advancePackageTaskMaterialization(input: {
  candidatePath: string;
  root?: string;
  ghExecutable?: string;
  now?: () => string;
}): { action: string; record: PackageTaskMaterializationRecord } {
  const root = resolve(input.root ?? process.cwd());
  const gh = input.ghExecutable ?? "gh";
  const now = input.now ?? (() => new Date().toISOString());
  const candidatePath = resolve(input.candidatePath);
  if (!existsSync(candidatePath)) throw new Error(`PACKAGE_TASK_SPEC_CANDIDATE_MISSING:${candidatePath}`);
  const candidateSource = readFileSync(candidatePath, "utf8");
  const candidate = parseTask(candidatePath);
  if (!candidate.metadata.package_authorization) throw new Error("PACKAGE_BINDING_MISSING");
  const recordPath = resolve(root, ".agent/package-task-spec", `${candidate.metadata.id}.json`);
  const existing = existsSync(recordPath)
    ? packageTaskMaterializationRecordSchema.parse(JSON.parse(readFileSync(recordPath, "utf8")))
    : undefined;
  if (!existing && loadTasks(root).some((task) => task.metadata.id === candidate.metadata.id)) throw new Error(`PACKAGE_TASK_SPEC_ALREADY_EXISTS:${candidate.metadata.id}`);
  const candidateHash = digest(candidateSource);
  if (existing && (existing.candidate_sha256 !== candidateHash || existing.candidate_name !== basename(candidatePath))) {
    throw new Error("PACKAGE_TASK_SPEC_CANDIDATE_DIVERGENCE");
  }

  if (!existing) {
    assertClean(root);
    if (git(["branch", "--show-current"], root) !== "main") throw new Error("PACKAGE_TASK_SPEC_REQUIRES_MAIN");
    git(["fetch", "origin", "main"], root);
    if (git(["rev-parse", "main"], root) !== git(["rev-parse", "origin/main"], root)) throw new Error("PACKAGE_TASK_SPEC_MAIN_NOT_SYNCHRONIZED");
    const sourceCommit = git(["rev-parse", "HEAD"], root);
    evaluateStoredPackageTaskSpecAuthorization(root, {
      repository: repositoryIdentity(root), taskId: candidate.metadata.id, taskMetadata: candidate.metadata,
      candidateSource, sourceCommit, observedAt: now(), phase: "PREPARE",
    });
    const branch = `task-spec/${candidate.metadata.id.toLowerCase()}-${candidate.metadata.package_authorization.descriptor_id.toLowerCase()}`;
    if (refExists(`refs/heads/${branch}`, root) || refExists(`refs/remotes/origin/${branch}`, root)
      || tryGit(["ls-remote", "--exit-code", "--heads", "origin", branch], root)) throw new Error(`PACKAGE_TASK_SPEC_REF_EXISTS:${branch}`);
    git(["switch", "-c", branch], root);
    const record = packageTaskMaterializationRecordSchema.parse({
      schema_version: 1, task_id: candidate.metadata.id, descriptor_id: candidate.metadata.package_authorization.descriptor_id,
      candidate_name: basename(candidatePath), candidate_sha256: candidateHash, candidate_source: candidateSource,
      source_commit: sourceCommit, branch, written: false, commit: null, pushed: false, pull_request: null, authorization: null,
      merged: false, integrated: false,
    });
    writeRecord(recordPath, record);
    return { action: "BRANCH_CREATED", record };
  }

  if (existing.integrated) return { action: "NO_OP", record: existing };
  if (existing.merged) {
    assertClean(root);
    git(["switch", "main"], root);
    git(["pull", "--ff-only", "origin", "main"], root);
    const integratedPath = resolve(root, "specs/tasks", existing.candidate_name);
    if (!existsSync(integratedPath) || readFileSync(integratedPath, "utf8") !== existing.candidate_source) {
      throw new Error("PACKAGE_TASK_SPEC_INTEGRATION_DIVERGENCE");
    }
    existing.integrated = true;
    writeRecord(recordPath, existing);
    return { action: "MAIN_SYNCHRONIZED", record: existing };
  }
  assertBranch(existing.branch, root);
  evaluateStoredPackageTaskSpecAuthorization(root, {
    repository: repositoryIdentity(root), taskId: candidate.metadata.id, taskMetadata: candidate.metadata,
    candidateSource, sourceCommit: existing.source_commit, observedAt: now(), phase: "PREPARE",
  });
  const target = resolve(root, "specs/tasks", existing.candidate_name);
  if (!existing.written) {
    if (existsSync(target)) throw new Error(`PACKAGE_TASK_SPEC_TARGET_EXISTS:${existing.candidate_name}`);
    writeFileSync(target, existing.candidate_source, { flag: "wx" });
    existing.written = true;
    writeRecord(recordPath, existing);
    return { action: "SPEC_WRITTEN", record: existing };
  }
  if (!existsSync(target) || readFileSync(target, "utf8") !== existing.candidate_source) throw new Error("PACKAGE_TASK_SPEC_CONTENT_DIVERGENCE");
  if (!existing.commit) {
    const changed = lines(git(["status", "--porcelain"], root).split(/\r?\n/).map((line) => line.slice(3)).join("\n"));
    if (JSON.stringify(changed) !== JSON.stringify([`specs/tasks/${existing.candidate_name}`])) throw new Error(`PACKAGE_TASK_SPEC_SCOPE_DIVERGENCE:${changed.join(",")}`);
    validateTaskCatalog(loadTasks(root));
    git(["add", "--", `specs/tasks/${existing.candidate_name}`], root);
    git(["commit", "-m", `docs: materialize ${existing.task_id}`], root);
    existing.commit = sha.parse(git(["rev-parse", "HEAD"], root));
    writeRecord(recordPath, existing);
    return { action: "SPEC_COMMITTED", record: existing };
  }
  assertClean(root);
  if (git(["rev-parse", "HEAD"], root) !== existing.commit) throw new Error("PACKAGE_TASK_SPEC_HEAD_DIVERGENCE");
  if (!existing.pushed) {
    git(["push", "--set-upstream", "origin", existing.branch], root);
    if (git(["rev-parse", `refs/remotes/origin/${existing.branch}`], root) !== existing.commit) throw new Error("PACKAGE_TASK_SPEC_REMOTE_DIVERGENCE");
    existing.pushed = true;
    writeRecord(recordPath, existing);
    return { action: "SPEC_PUSHED", record: existing };
  }
  if (!existing.pull_request) {
    const output = run(gh, ["pr", "create", "--base", "main", "--head", existing.branch,
      "--title", `docs: materialize ${existing.task_id}`,
      "--body", `Package-authorized rolling-wave task specification for ${existing.descriptor_id}. Implementation authority is not consumed.`], root);
    const url = output.split(/\r?\n/).find((line) => /^https:\/\//.test(line.trim()))?.trim();
    const number = Number(url?.match(/\/pull\/(\d+)$/)?.[1]);
    if (!url || !Number.isInteger(number)) throw new Error("PACKAGE_TASK_SPEC_PR_IDENTITY_INVALID");
    existing.pull_request = { number, url };
    writeRecord(recordPath, existing);
    return { action: "SPEC_PR_OPENED", record: existing };
  }
  if (existing.authorization) {
    run(gh, ["pr", "merge", String(existing.pull_request.number), "--merge"], root);
    existing.merged = true;
    writeRecord(recordPath, existing);
    return { action: "SPEC_PR_MERGED", record: existing };
  }
  const pr = JSON.parse(run(gh, ["pr", "view", String(existing.pull_request.number),
    "--json", "number,headRefName,baseRefName,headRefOid,statusCheckRollup,reviewDecision,state"], root)) as {
      number: number; headRefName: string; baseRefName: string; headRefOid: string; state: string; reviewDecision: string;
      statusCheckRollup: Array<{ name?: string; context?: string; status?: string; conclusion?: string | null }>;
    };
  if (pr.state === "CLOSED" || pr.reviewDecision === "CHANGES_REQUESTED") throw new Error("PACKAGE_TASK_SPEC_PR_BLOCKED");
  if (pr.number !== existing.pull_request.number || pr.baseRefName !== "main" || pr.headRefName !== existing.branch
    || pr.headRefOid !== existing.commit) throw new Error("PACKAGE_TASK_SPEC_PR_IDENTITY_DIVERGENCE");
  const committed = lines(git(["diff", "--name-only", `${existing.source_commit}..${existing.commit}`], root));
  if (JSON.stringify(committed) !== JSON.stringify([`specs/tasks/${existing.candidate_name}`])) {
    throw new Error(`PACKAGE_TASK_SPEC_PR_CONTENT_DIVERGENCE:${committed.join(",")}`);
  }
  const authorization = evaluateStoredPackageTaskSpecAuthorization(root, {
    repository: repositoryIdentity(root), taskId: candidate.metadata.id, taskMetadata: candidate.metadata,
    candidateSource, sourceCommit: existing.source_commit, observedAt: now(), phase: "PR",
    prNumber: pr.number, baseRef: pr.baseRefName, headRef: pr.headRefName, headSha: pr.headRefOid,
    validation: "PASS", checks: lifecycleChecks(pr.statusCheckRollup),
  });
  existing.authorization = authorization;
  writeRecord(recordPath, existing);
  return { action: "SPEC_PR_AUTHORIZED", record: existing };
}

function lifecycleChecks(values: Array<{ name?: string; context?: string; status?: string; conclusion?: string | null }>) {
  return values.flatMap((value) => {
    const name = value.name ?? value.context;
    if (!name) return [];
    const status = value.status !== "COMPLETED" || !value.conclusion ? "PENDING"
      : value.conclusion === "SUCCESS" ? "SUCCESS"
        : value.conclusion === "CANCELLED" ? "CANCELLED"
          : value.conclusion === "TIMED_OUT" ? "TIMED_OUT"
            : value.conclusion === "FAILURE" ? "FAILURE" : "UNKNOWN";
    return [{ name, status }] as Array<{ name: string; status: "PENDING" | "SUCCESS" | "FAILURE" | "CANCELLED" | "TIMED_OUT" | "UNKNOWN" }>;
  });
}

function assertBranch(branch: string, root: string): void {
  if (git(["branch", "--show-current"], root) !== branch) throw new Error(`PACKAGE_TASK_SPEC_BRANCH_MISMATCH:${branch}`);
}
function assertClean(root: string): void { if (git(["status", "--porcelain"], root)) throw new Error("PACKAGE_TASK_SPEC_WORKTREE_DIRTY"); }
function refExists(ref: string, root: string): boolean { return tryGit(["show-ref", "--verify", "--quiet", ref], root); }
function tryGit(args: string[], root: string): boolean { return spawnSync("git", args, { cwd: root, encoding: "utf8", shell: false }).status === 0; }
function git(args: string[], root: string): string { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }
function run(executable: string, args: string[], root: string): string { return execFileSync(executable, args, { cwd: root, encoding: "utf8" }).trim(); }
function digest(value: string): string { return createHash("sha256").update(value).digest("hex"); }
function lines(value: string): string[] { return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).sort(); }
function writeRecord(path: string, record: PackageTaskMaterializationRecord): void { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`); }
function repositoryIdentity(root: string): string {
  const remote = git(["config", "--get", "remote.origin.url"], root);
  return remote.replace(/\\/g, "/").match(/(?:github\.com[:/])([^/]+\/[^/]+?)(?:\.git)?$/i)?.[1] ?? remote;
}
