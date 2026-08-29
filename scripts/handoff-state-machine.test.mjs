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
    type: "Heavy Product Tests" === "Heavy Product Tests" ? "CHECK_COMPLETED" : "CHECK_COMPLETED",
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
  });
  assert.equal(result.next.next_worker, ":30");
  assert.equal(result.next.checks.deterministic, "failure");
  assert.match(result.next.reason, /CI_FAILED/);
});

test("stale workflow completion cannot rewind a newer head", () => {
  const state = baseState({ active_head_sha: "new-head" });
  const result = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "success",
    head: "old-head",
  });
  assert.equal(result.accepted, false);
  assert.equal(result.next.sequence, 1);
  assert.equal(result.next.active_head_sha, "new-head");
});

test("conformance due takes the token and resumes the prior next worker after completion", () => {
  let state = reduceHandoffState(baseState({ next_worker: ":30" }), { type: "CONFORMANCE_DUE" }).next;
  assert.equal(state.next_worker, "conformance");
  assert.equal(state.resume_worker, ":30");

  state = reduceHandoffState(state, { type: "CONFORMANCE_COMPLETE", owner: "conformance" }).next;
  assert.equal(state.next_worker, ":30");
  assert.equal(state.resume_worker, null);
});

test("conformance due is independent of advisory CI context", () => {
  let state = baseState({
    next_worker: ":30",
    active_pr: 1,
    active_branch: "sprint/example",
    active_head_sha: "abc",
  });
  state = reduceHandoffState(state, { type: "CONFORMANCE_DUE" }).next;
  assert.equal(state.next_worker, "conformance");
  assert.equal(state.resume_worker, ":30");

  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "success",
    head: "abc",
  }).next;
  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Heavy Product Tests",
    conclusion: "success",
    head: "abc",
  }).next;
  assert.equal(state.next_worker, "conformance");
  assert.equal(state.resume_worker, ":30");
});

test("expired claim recovers deterministically without changing next worker", () => {
  const state = baseState({
    claimed_by: ":10",
    claim_until: "2026-08-28T23:10:00.000Z",
  });
  const result = reduceHandoffState(state, {
    type: "LEASE_TICK",
    at: "2026-08-28T23:11:00.000Z",
  });
  assert.equal(result.next.next_worker, ":10");
  assert.equal(result.next.claimed_by, null);
  assert.equal(result.next.claim_until, null);
  assert.equal(result.next.reason, "CLAIM_EXPIRED_RECOVERED");
});
