import assert from "node:assert/strict";
import test from "node:test";
import { reduceHandoffState, renderHandoffMarkdown, scheduledWorkerAfter } from "./handoff-state-machine.mjs";

function baseState(overrides = {}) {
  return {
    version: 3,
    next_worker: ":10",
    last_worker: null,
    claimed_by: null,
    claim_until: null,
    resume_worker: null,
    sequence: 1,
    updated_at: "2026-08-28T23:00:00.000Z",
    active_pr: null,
    active_branch: null,
    active_head_sha: null,
    checks: { deterministic: "pending", heavy: "pending" },
    last_event: "INIT",
    reason: null,
    ...overrides,
  };
}

test("scheduled routing remains advisory and chooses the nearest later recurrence", () => {
  assert.equal(scheduledWorkerAfter({ at: "2026-08-30T04:03:00.000Z" }), ":10");
  assert.equal(scheduledWorkerAfter({ at: "2026-08-30T04:17:00.000Z" }), ":30");
  assert.equal(scheduledWorkerAfter({ at: "2026-08-30T04:47:00.000Z" }), ":50");
  assert.equal(scheduledWorkerAfter({ at: "2026-08-30T04:55:00.000Z" }), ":10");
});

test("handoff from a worker is accepted even when advisory next_worker points elsewhere", () => {
  const result = reduceHandoffState(baseState({ next_worker: ":10" }), {
    type: "WORKER_HANDOFF",
    owner: ":50",
    at: "2026-08-30T04:17:00.000Z",
  });
  assert.equal(result.accepted, true);
  assert.equal(result.next.last_worker, ":50");
  assert.equal(result.next.next_worker, ":30");
  assert.equal(result.next.claimed_by, null);
  assert.equal(result.next.phase, "OBSERVING");
});

test("legacy claim is telemetry only and cannot lock another worker", () => {
  const result = reduceHandoffState(baseState({ next_worker: ":10" }), {
    type: "WORKER_CLAIM",
    owner: ":30",
    lease_until: "2026-08-28T23:59:00.000Z",
    at: "2026-08-28T23:34:00.000Z",
  });
  assert.equal(result.accepted, true);
  assert.equal(result.next.last_worker, ":30");
  assert.equal(result.next.claimed_by, null);
  assert.equal(result.next.claim_until, null);
  assert.equal(result.next.lease_until, null);
});

test("worker blocker is recorded without blocking later recurrences", () => {
  const result = reduceHandoffState(baseState({ next_worker: ":10" }), {
    type: "WORKER_BLOCK",
    owner: ":50",
    reason: "bounded repair needed",
    at: "2026-08-30T04:17:00.000Z",
  });
  assert.equal(result.accepted, true);
  assert.equal(result.next.reason, "bounded repair needed");
  assert.equal(result.next.next_worker, ":30");
  assert.equal(result.next.phase, "OBSERVING");
});

test("PR CI observation from any valid worker records exact-head evidence", () => {
  const result = reduceHandoffState(baseState({ next_worker: ":10" }), {
    type: "PR_CI_STARTED",
    owner: ":50",
    pr: 487,
    branch: "sprint/example",
    head: "abc",
    at: "2026-08-28T23:11:00.000Z",
  });
  assert.equal(result.accepted, true);
  assert.equal(result.next.last_worker, ":50");
  assert.equal(result.next.active_pr, 487);
  assert.equal(result.next.active_head_sha, "abc");
  assert.deepEqual(result.next.checks, { deterministic: "pending", heavy: "pending" });
});

test("required workflow failures are telemetry for repair, not queue locks", () => {
  const state = baseState({ active_pr: 1, active_branch: "sprint/example", active_head_sha: "abc" });
  const result = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "failure",
    head: "abc",
    at: "2026-08-28T23:34:00.000Z",
  });
  assert.equal(result.next.checks.deterministic, "failure");
  assert.equal(result.next.reason, "CI_FAILED:Deterministic CI:failure");
  assert.equal(result.next.phase, "OBSERVING");
});

test("stale workflow results cannot overwrite exact-head telemetry", () => {
  const state = baseState({ active_pr: 1, active_head_sha: "abc" });
  const result = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Heavy Product Tests",
    conclusion: "success",
    head: "stale",
    at: "2026-08-28T23:35:00.000Z",
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "stale or unrelated check completion");
  assert.equal(result.next.checks.heavy, "pending");
});

test("successful exact-head checks clear prior CI failure telemetry", () => {
  let state = baseState({ active_pr: 1, active_head_sha: "abc", reason: "CI_FAILED:Deterministic CI:failure" });
  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "success",
    head: "abc",
    at: "2026-08-28T23:36:00.000Z",
  }).next;
  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Heavy Product Tests",
    conclusion: "success",
    head: "abc",
    at: "2026-08-28T23:37:00.000Z",
  }).next;
  assert.deepEqual(state.checks, { deterministic: "success", heavy: "success" });
  assert.equal(state.reason, null);
});

test("v2 state migrates to v3 without preserving a claim lock", () => {
  const result = reduceHandoffState({
    version: 2,
    next_worker: ":30",
    claimed_by: ":10",
    claim_until: "2099-01-01T00:00:00.000Z",
    sequence: 9,
    updated_at: "2026-08-28T23:00:00.000Z",
    active_pr: null,
    active_branch: null,
    active_head_sha: null,
    checks: { deterministic: "success", heavy: "success" },
    last_event: "WORKER_CLAIM",
    reason: null,
  }, {
    type: "WORKER_OBSERVATION",
    owner: ":50",
    at: "2026-08-28T23:41:00.000Z",
  });
  assert.equal(result.next.version, 3);
  assert.equal(result.next.claimed_by, null);
  assert.equal(result.next.claim_until, null);
  assert.equal(result.next.phase, "OBSERVING");
});

test("markdown states explicitly that state fields do not grant work authority", () => {
  const markdown = renderHandoffMarkdown(baseState());
  assert.match(markdown, /No state-machine field grants or denies permission to work/);
  assert.match(markdown, /next_worker is scheduling telemetry only/);
});
