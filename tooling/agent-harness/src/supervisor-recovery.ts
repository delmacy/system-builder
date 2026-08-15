import { readStateRecord } from "./git-workflow.js";
import { git } from "./git.js";

export type StateWorkspaceRecovery = {
  action: "NO_OP" | "SWITCHED";
  task_id: string | null;
  branch: string | null;
};

export function recoverRecordedStateWorkspace(
  root: string,
  orderedTaskIds: readonly string[],
): StateWorkspaceRecovery {
  const candidates = orderedTaskIds.flatMap((taskId) => {
    const record = readStateRecord(taskId, root);
    if (!record || (record.commit && record.pushed && record.pullRequest)) return [];
    return [{ taskId, record }];
  });

  if (candidates.length === 0) return { action: "NO_OP", task_id: null, branch: null };
  if (candidates.length > 1) {
    throw new Error(`SUPERVISOR_STATE_RECOVERY_AMBIGUOUS:${candidates.map((item) => item.taskId).join(",")}`);
  }

  const candidate = candidates[0]!;
  const current = git(["branch", "--show-current"], root) || "DETACHED";
  if (current === candidate.record.branch) {
    return { action: "NO_OP", task_id: candidate.taskId, branch: candidate.record.branch };
  }
  if (current !== "main") {
    throw new Error(`SUPERVISOR_STATE_BRANCH_MISMATCH:${candidate.taskId}:${current}:${candidate.record.branch}`);
  }

  // Switching is recovery only. commitStateTask remains responsible for validating
  // the exact durable closure file set before any state-delivery commit is allowed.
  git(["show-ref", "--verify", `refs/heads/${candidate.record.branch}`], root);
  git(["switch", candidate.record.branch], root);
  return { action: "SWITCHED", task_id: candidate.taskId, branch: candidate.record.branch };
}

export function heartbeatStateNeedsResume(state: string | null): boolean {
  return state !== null && new Set([
    "EXTERNAL_WAIT",
    "PR_OPEN",
    "CI_PENDING",
    "STATE_PR_PENDING",
    "STATE_CI_PENDING",
  ]).has(state);
}
