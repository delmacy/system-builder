import assert from "node:assert/strict";
import test from "node:test";
import { reduceHandoffState } from "./handoff-state-machine.mjs";

function baseState(overrides = {}) {
  return {
    version: 2,
    next_worker: ":10",
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

test("PR CI observation hands the token forward while checks remain advisory context", () => {
  let state = reduceHandoffState(baseState(), {
    type: "PR_CI_STARTED",
    owner: ":10",
    pr: 487,
    branch: "sprint/example",
    head: "abc",
    at: "2026-08-28T23:01:00.000Z",
  }).next;

  assert.equal(state.next_worker, ":30");
  assert.equal(state.active_pr, 487);
  assert.deepEqual(state.checks, { deterministic: "pending", heavy: "pending" });

  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Heavy Product Tests",
    conclusion: "success",
    head: "abc",
    at: "2026-08-28T23:02:00.000Z",
  }).next;
  assert.equal(state.next_worker, ":30");
  assert.equal(state.checks.heavy, "success");

  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "success",
    head: "abc",
    at: "2026-08-28T23:03:00.000Z",
  }).next;
  assert.equal(state.next_worker, ":30");
  assert.equal(state.checks.deterministic, "success");
  assert.equal(state.reason, null);
});

test("failed required check records failure without reclaiming or blocking the token", () => {
  const state = baseState({
    next_worker: ":30",
    active_pr: 1,
    active_branch: "sprint/example",
    active_head_sha: "abc",
  });
  const result = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "failure",
    head: "abc",
    at: "2026-08-28T23:04:00.000Z",
  });
  assert.equal(result.next.next_worker, ":30");
  assert.equal(result.next.checks.deterministic, "failure");
  assert.equal(result.next.reason, "CI_FAILED:Deterministic CI:failure");
});

test("worker handoff advances the canonical queue :10 -> :30 -> :50 -> conformance", () => {
  let state = reduceHandoffState(baseState(), {
    type: "WORKER_HANDOFF",
    owner: ":10",
    at: "2026-08-28T23:05:00.000Z",
  }).next;
  assert.equal(state.next_worker, ":30");

  state = reduceHandoffState(state, {
    type: "WORKER_HANDOFF",
    owner: ":30",
    at: "2026-08-28T23:06:00.000Z",
  }).next;
  assert.equal(state.next_worker, ":50");

  state = reduceHandoffState(state, {
    type: "WORKER_HANDOFF",
    owner: ":50",
    at: "2026-08-28T23:07:00.000Z",
  }).next;
  assert.equal(state.next_worker, "conformance");
});

test("PR CI started by :50 hands the token to conformance", () => {
  const result = reduceHandoffState(baseState({ next_worker: ":50" }), {
    type: "PR_CI_STARTED",
    owner: ":50",
    pr: 500,
    branch: "sprint/example-50",
    head: "def",
    at: "2026-08-28T23:08:00.000Z",
  });
  assert.equal(result.next.next_worker, "conformance");
  assert.equal(result.next.resume_worker, null);
});

test("normal conformance completion returns the canonical queue to :10", () => {
  const result = reduceHandoffState(baseState({ next_worker: "conformance" }), {
    type: "CONFORMANCE_COMPLETE",
    owner: "conformance",
    at: "2026-08-28T23:09:00.000Z",
  });
  assert.equal(result.next.next_worker, ":10");
});

test("scheduled conformance interruption returns to its interrupted resume worker", () => {
  let state = reduceHandoffState(baseState({ next_worker: ":30" }), {
    type: "CONFORMANCE_DUE",
    at: "2026-08-28T23:10:00.000Z",
  }).next;
  assert.equal(state.next_worker, "conformance");
  assert.equal(state.resume_worker, ":30");

  state = reduceHandoffState(state, {
    type: "CONFORMANCE_COMPLETE",
    owner: "conformance",
    at: "2026-08-28T23:11:00.000Z",
  }).next;
  assert.equal(state.next_worker, ":30");
  assert.equal(state.resume_worker, null);
});

test("claim is advisory and does not change next worker", () => {
  const result = reduceHandoffState(baseState(), {
    type: "WORKER_CLAIM",
    owner: ":10",
    lease_until: "2026-08-28T23:30:00.000Z",
    at: "2026-08-28T23:05:00.000Z",
  });
  assert.equal(result.next.next_worker, ":10");
  assert.equal(result.next.claimed_by, ":10");
});
