import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { writeStateRecord } from "../src/git-workflow.js";
import { heartbeatStateNeedsResume, recoverRecordedStateWorkspace } from "../src/supervisor-recovery.js";

function repository(): string {
  const root = mkdtempSync(join(tmpdir(), "supervisor-recovery-"));
  run(root, "init");
  run(root, "config", "user.email", "test@example.com");
  run(root, "config", "user.name", "Test");
  writeFileSync(join(root, "README.md"), "fixture\n");
  run(root, "add", "README.md");
  run(root, "commit", "-m", "fixture");
  run(root, "branch", "-M", "main");
  run(root, "branch", "state/task-004-close");
  writeStateRecord({
    version: 1,
    taskId: "TASK-004",
    branch: "state/task-004-close",
    createdAt: "2026-08-15T08:00:00.000Z",
  }, root);
  return root;
}

function run(root: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

describe("Supervisor recovery", () => {
  it("reattaches an incomplete recorded state delivery from main without committing anything", () => {
    const root = repository();
    const result = recoverRecordedStateWorkspace(root, ["TASK-004", "TASK-005"]);
    assert.deepEqual(result, { action: "SWITCHED", task_id: "TASK-004", branch: "state/task-004-close" });
    assert.equal(run(root, "branch", "--show-current"), "state/task-004-close");
    assert.equal(run(root, "rev-parse", "HEAD"), run(root, "rev-parse", "main"));
  });

  it("is idempotent when the recorded state branch is already active", () => {
    const root = repository();
    run(root, "switch", "state/task-004-close");
    assert.deepEqual(recoverRecordedStateWorkspace(root, ["TASK-004"]), {
      action: "NO_OP", task_id: "TASK-004", branch: "state/task-004-close",
    });
  });

  it("fails closed instead of switching away from an unrelated branch", () => {
    const root = repository();
    run(root, "switch", "-c", "work/unrelated");
    assert.throws(
      () => recoverRecordedStateWorkspace(root, ["TASK-004"]),
      /SUPERVISOR_STATE_BRANCH_MISMATCH:TASK-004:work\/unrelated:state\/task-004-close/,
    );
  });

  it("reobserves only external waits and incomplete state delivery on heartbeat", () => {
    for (const state of ["EXTERNAL_WAIT", "PR_OPEN", "CI_PENDING", "STATE_PR_PENDING", "STATE_CI_PENDING"]) {
      assert.equal(heartbeatStateNeedsResume(state), true, state);
    }
    for (const state of [null, "STARTED", "BRANCHED", "BLOCKED", "COMPLETE", "DONE"]) {
      assert.equal(heartbeatStateNeedsResume(state), false, String(state));
    }
  });
});
