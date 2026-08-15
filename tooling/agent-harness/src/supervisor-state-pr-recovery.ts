import { spawnSync } from "node:child_process";
import { readStateRecord, writeStateRecord } from "./git-workflow.js";

export type StatePullRequestCandidate = {
  number: number;
  url: string;
  state: string;
  headRefName: string;
  baseRefName: string;
  headRefOid: string;
  createdAt?: string;
};

export type StatePullRequestDiscovery = (
  root: string,
  branch: string,
) => StatePullRequestCandidate[];

export function recoverExistingStatePullRequests(
  root: string,
  taskIds: readonly string[],
  discover: StatePullRequestDiscovery = (cwd, branch) => discoverWithGitHubCli(cwd, branch),
): string[] {
  const recovered: string[] = [];
  for (const taskId of taskIds) {
    const record = readStateRecord(taskId, root);
    if (!record?.commit || !record.pushed || record.pullRequest) continue;

    const candidates = discover(root, record.branch);
    const exact = candidates.filter((candidate) =>
      candidate.headRefName === record.branch
      && candidate.baseRefName === "main"
      && candidate.headRefOid === record.commit,
    );

    if (exact.length === 0) continue;
    if (exact.length !== 1) throw new Error(`STATE_PR_DISCOVERY_AMBIGUOUS:${taskId}`);

    const candidate = exact[0]!;
    record.pullRequest = {
      number: candidate.number,
      url: candidate.url,
      state: candidate.state.toUpperCase(),
      openedAt: candidate.createdAt ?? new Date().toISOString(),
    };
    writeStateRecord(record, root);
    recovered.push(taskId);
  }
  return recovered;
}

function discoverWithGitHubCli(root: string, branch: string): StatePullRequestCandidate[] {
  const result = spawnSync("gh", [
    "pr", "list",
    "--head", branch,
    "--base", "main",
    "--state", "all",
    "--json", "number,url,state,headRefName,baseRefName,headRefOid,createdAt",
  ], { cwd: root, encoding: "utf8", shell: false, windowsHide: true });

  if (result.error || result.status !== 0) {
    throw new Error(`STATE_PR_DISCOVERY_FAILED:${result.error?.message || result.stderr || `exit ${result.status}`}`);
  }

  try {
    return JSON.parse(result.stdout) as StatePullRequestCandidate[];
  } catch {
    throw new Error("STATE_PR_DISCOVERY_INVALID_RESPONSE");
  }
}
