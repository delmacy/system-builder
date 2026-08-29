import assert from "node:assert/strict";
import test from "node:test";
import { reduceHandoffState } from "./handoff-state-machine.mjs";

function baseState(overrides = {}) {
  return {
    version: 1,
    sequence: 1,
    phase: "READY",
    owner: ":10",
    resume_owner: null,
    conformance_due: false,
    lease_until: null,
    active_pr: null,
    active_branch: null,
    active_head_sha: null,
    checks: { deterministic: "pending", heavy: "pending" },
    last_event: "INIT",
    reason: null,
    updated_at: "2026-08-28T23:00:00.000Z",
    ...overrides,
  };
}

test("happy path advances :10 to :30 only after both required checks pass", () => {
  let state = reduceHandoffState(baseState(), {
    type: "PR_CI_STARTED",
    owner: ":10",
    pr: 487,
    branch: "sprint/example",
    head: "abc",
    at: "2026-08-28T23:01:00.000Z",
  }).next;

  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Heavy Product Tests",
    conclusion: "success",
    head: "abc",
    at: "2026-08-28T23:02:00.000Z",
  }).next;
  assert.equal(state.phase, "CI_RUNNING");
  assert.equal(state.owner, ":10");

  state = reduceHandoffState(state, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "success",
    head: "abc",
    at: "2026-08-28T23:03:00.000Z",
  }).next;
  assert.equal(state.phase, "READY");
  assert.equal(state.owner, ":30");
});

test("failed required check blocks the same owner", () => {
  const running = baseState({
    phase: "CI_RUNNING",
    active_pr: 1,
    active_branch: "sprint/example",
    active_head_sha: "abc",
  });
  const result = reduceHandoffState(running, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "failure",
    head: "abc",
  });
  assert.equal(result.next.phase, "BLOCKED");
  assert.equal(result.next.owner, ":10");
  assert.match(result.next.reason, /CI_FAILED/);
});

test("stale workflow completion cannot rewind a newer head", () => {
  const running = baseState({ phase: "CI_RUNNING", active_head_sha: "new-head" });
  const result = reduceHandoffState(running, {
    type: "CHECK_COMPLETED",
    workflow: "Deterministic CI",
    conclusion: "success",
    head: "old-head",
  });
  assert.equal(result.accepted, false);
  assert.equal(result.next.sequence, 1);
  assert.equal(result.next.active_head_sha, "new-head");
});

test("conformance due interrupts the next ready owner and resumes it after completion", () => {
  let state = reduceHandoffState(baseState({ owner: ":30" }), { type: "CONFORMANCE_DUE" }).next;
  assert.equal(state.owner, "conformance");
  assert.equal(state.resume_owner, ":30");

  state = reduceHandoffState(state, { type: "CONFORMANCE_COMPLETE", owner: "conformance" }).next;
  assert.equal(state.phase, "READY");
  assert.equal(state.owner, ":30");
  assert.equal(state.resume_owner, null);
});

test("conformance due while CI runs is deferred until the normal handoff", () => {
  let state = baseState({
    phase: "CI_RUNNING",
    active_pr: 1,
    active_branch: "sprint/example",
    active_head_sha: "abc",
  });
  state = reduceHandoffState(state, { type: "CONFORMANCE_DUE" }).next;
  assert.equal(state.conformance_due, true);
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
  assert.equal(state.owner, "conformance");
  assert.equal(state.resume_owner, ":30");
});

test("expired lease recovers deterministically to READY for the same owner", () => {
  const state = baseState({ phase: "RUNNING", lease_until: "2026-08-28T23:10:00.000Z" });
  const result = reduceHandoffState(state, {
    type: "LEASE_TICK",
    at: "2026-08-28T23:11:00.000Z",
  });
  assert.equal(result.next.phase, "READY");
  assert.equal(result.next.owner, ":10");
  assert.equal(result.next.reason, "LEASE_EXPIRED_RECOVERED");
});
