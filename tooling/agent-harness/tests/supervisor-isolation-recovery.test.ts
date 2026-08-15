import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { runSupervisorCommand } from "../src/supervisor-cli.js";
import { readStateRecord, writeStateRecord } from "../src/git-workflow.js";
import { recoverExistingStatePullRequests } from "../src/supervisor-state-pr-recovery.js";

function runtimePlan() {
  return {
    schema_version: 1 as const,
    pipeline: {
      schema_version: 1 as const,
      focus: "scoped heartbeat proof",
      milestones: ["M1"],
      ordered_task_ids: ["TASK-004"],
    },
    execution: {},
  };
}

describe("Supervisor pipeline isolation and state PR recovery", () => {
  it("scopes heartbeat to the explicit pipeline and never calls the global heartbeat", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-scoped-heartbeat-"));
    const calls: string[] = [];
    const projection = {
      pipeline_id: "m1-sprint-01-r1",
      correlation_id: "corr",
      state: "BRANCHED",
      terminal_status: null,
      pending_callback_event_ids: [],
    };
    const supervisor = {
      status: (pipelineId: string) => { calls.push(`status:${pipelineId}`); return projection; },
      resume: (pipelineId: string) => { calls.push(`resume:${pipelineId}`); return { pipelineId, action: "ITERATED" }; },
      heartbeat: () => { calls.push("GLOBAL_HEARTBEAT"); return []; },
      callback: () => { calls.push("callback"); return {}; },
      start: () => ({}),
    };
    const factory = (() => ({
      supervisor,
      plan: runtimePlan(),
      store: { readEvents: () => [] },
    })) as never;

    const result = runSupervisorCommand([
      "heartbeat", "--plan", "plan.json", "--root", root, "--pipeline", "m1-sprint-01-r1",
    ], factory);

    assert.deepEqual(result, [{ pipelineId: "m1-sprint-01-r1", action: "ITERATED" }]);
    assert.deepEqual(calls, ["status:m1-sprint-01-r1", "resume:m1-sprint-01-r1"]);
    assert.equal(calls.includes("GLOBAL_HEARTBEAT"), false);
  });

  it("adopts exactly one existing state PR only when branch, base and head SHA match", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-state-pr-recovery-"));
    const commit = "b".repeat(40);
    writeStateRecord({
      version: 1,
      taskId: "TASK-004",
      branch: "state/task-004-close",
      createdAt: "2026-08-15T09:00:00.000Z",
      commit,
      pushed: true,
    }, root);

    const recovered = recoverExistingStatePullRequests(root, ["TASK-004"], () => [
      {
        number: 142,
        url: "https://github.com/delmacy/system-builder/pull/142",
        state: "OPEN",
        headRefName: "state/task-004-close",
        baseRefName: "main",
        headRefOid: "a".repeat(40),
      },
      {
        number: 143,
        url: "https://github.com/delmacy/system-builder/pull/143",
        state: "OPEN",
        headRefName: "state/task-004-close",
        baseRefName: "main",
        headRefOid: commit,
        createdAt: "2026-08-15T09:31:37.000Z",
      },
    ]);

    assert.deepEqual(recovered, ["TASK-004"]);
    const record = readStateRecord("TASK-004", root);
    assert.equal(record?.pullRequest?.number, 143);
    assert.equal(record?.pullRequest?.url, "https://github.com/delmacy/system-builder/pull/143");
    assert.equal(record?.pullRequest?.state, "OPEN");
  });

  it("fails closed when more than one exact state PR candidate exists", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-state-pr-ambiguous-"));
    const commit = "c".repeat(40);
    writeStateRecord({
      version: 1,
      taskId: "TASK-004",
      branch: "state/task-004-close",
      createdAt: "2026-08-15T09:00:00.000Z",
      commit,
      pushed: true,
    }, root);
    const candidate = {
      number: 143,
      url: "https://github.com/delmacy/system-builder/pull/143",
      state: "OPEN",
      headRefName: "state/task-004-close",
      baseRefName: "main",
      headRefOid: commit,
    };

    assert.throws(
      () => recoverExistingStatePullRequests(root, ["TASK-004"], () => [candidate, { ...candidate, number: 144 }]),
      /STATE_PR_DISCOVERY_AMBIGUOUS:TASK-004/,
    );
    assert.equal(readStateRecord("TASK-004", root)?.pullRequest, undefined);
  });
});
