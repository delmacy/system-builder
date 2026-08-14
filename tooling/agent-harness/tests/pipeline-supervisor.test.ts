import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { AgentFactorySupervisor, retryDelaySeconds, type SupervisorIterationAdapter, type SupervisorIterationResult } from "../src/pipeline-supervisor.js";
import type { SupervisorCallback, SupervisorConfig } from "../src/supervisor-contracts.js";
import { DurableSupervisorStore } from "../src/supervisor-store.js";

const baseTime = Date.parse("2026-08-14T01:00:00.000Z");
const config: SupervisorConfig = {
  schema_version: 1, heartbeat: { interval_seconds: 5, stale_after_seconds: 10 },
  retry: { max_attempts: 3, initial_delay_seconds: 2, max_delay_seconds: 10, multiplier: 2, jitter_ratio: 0, max_elapsed_seconds: 60 },
  callbacks: { mode: "local", timeout_seconds: 5 }, lease: { ttl_seconds: 5 }, circuit_breaker: { failure_threshold: 2, cooldown_seconds: 10 },
};

function fixture(results: SupervisorIterationResult[], deliver = true) {
  const root = mkdtempSync(join(tmpdir(), "sb-supervisor-"));
  const store = new DurableSupervisorStore(root);
  let clock = baseTime; let calls = 0; const wakes: SupervisorCallback[] = [];
  const adapter: SupervisorIterationAdapter = { iterate: () => { calls += 1; const value = results.shift(); if (!value) throw new Error("NO_ITERATION_FIXTURE"); return value; } };
  let delivery = deliver;
  const supervisor = new AgentFactorySupervisor(store, config, adapter, { deliver: (wake) => { wakes.push(wake); return delivery; } }, "test-owner", () => new Date(clock).toISOString());
  return { root, store, supervisor, wakes, calls: () => calls, advance: (ms: number) => { clock += ms; }, setDelivery: (value: boolean) => { delivery = value; } };
}

const selected = (): SupervisorIterationResult => ({ eventType: "TASK_SELECTED", state: "READY", taskId: "TASK-010", payloadRef: "docs/task.json" });
const dispatched = (): SupervisorIterationResult => ({ eventType: "TASK_DISPATCHED", state: "EXECUTING", taskId: "TASK-010", currentOperation: "opencode", externalOperationRef: "attempt-1" });
const complete = (): SupervisorIterationResult => ({ eventType: "PIPELINE_COMPLETE", state: "COMPLETE", taskId: "TASK-010", terminalStatus: "COMPLETE" });

describe("AgentFactory event-driven supervisor", () => {
  it("1 callback wakes the supervisor after a durable state change", () => {
    const f = fixture([selected(), dispatched()]); f.supervisor.start("pipe-1", "corr-1");
    const wake = f.wakes[0]!; assert.ok(f.store.readEvents("pipe-1").some((item) => item.event.event_id === wake.event_id));
    assert.equal(f.supervisor.callback(wake).action, "ITERATED"); assert.equal(f.calls(), 2);
  });

  it("2 duplicate callback is idempotent", () => {
    const f = fixture([selected(), dispatched()]); f.supervisor.start("pipe-2", "corr-2"); const wake = f.wakes[0]!;
    f.supervisor.callback(wake); assert.equal(f.supervisor.callback(wake).reason, "DUPLICATE_CALLBACK"); assert.equal(f.calls(), 2);
  });

  it("3 heartbeat recovers a lost callback", () => {
    const f = fixture([selected()], false); f.supervisor.start("pipe-3", "corr-3"); assert.equal(f.supervisor.status("pipe-3")!.pending_callback_event_ids.length, 1);
    f.setDelivery(true); f.advance(2_000); assert.equal(f.supervisor.heartbeat()[0]!.action, "CALLBACK_RECOVERED"); assert.equal(f.supervisor.status("pipe-3")!.pending_callback_event_ids.length, 0);
  });

  it("4 OpenCode timeout schedules retry", () => {
    const f = fixture([{ eventType: "EXECUTOR_FAILED", state: "FAILED", failureClass: "OPENCODE_TIMEOUT", provider: "opencode" }]);
    assert.equal(f.supervisor.start("pipe-4", "corr-4").action, "RETRY_SCHEDULED"); assert.ok(f.supervisor.status("pipe-4")!.next_retry_at);
  });

  it("5 retry respects configured exponential backoff", () => {
    assert.equal(retryDelaySeconds(1, config, 0.5), 2); assert.equal(retryDelaySeconds(2, config, 0.5), 4); assert.equal(retryDelaySeconds(5, config, 0.5), 10);
  });

  it("6 retry exhaustion blocks and notifies", () => {
    const fail = (): SupervisorIterationResult => ({ eventType: "EXECUTOR_FAILED", state: "FAILED", failureClass: "PROVIDER_5XX", provider: "model" });
    const f = fixture([fail(), fail(), fail()]); f.supervisor.start("pipe-6", "corr-6");
    f.advance(2_000); f.supervisor.heartbeat(); f.advance(10_000); const result = f.supervisor.heartbeat()[0]!;
    assert.equal(result.action, "RETRY_EXHAUSTED"); assert.equal(f.supervisor.status("pipe-6")!.terminal_status, "RETRY_EXHAUSTED"); assert.ok(f.wakes.some((wake) => wake.reason === "RETRY_EXHAUSTED"));
  });

  it("7 deterministic failure never retries", () => {
    const f = fixture([{ eventType: "VALIDATION_FAILED", state: "BLOCKED", failureClass: "VALIDATION_FAILURE" }]);
    f.supervisor.start("pipe-7", "corr-7"); const state = f.supervisor.status("pipe-7")!; assert.equal(state.terminal_status, "BLOCKED"); assert.equal(state.next_retry_at, null);
  });

  it("8 provider 5xx is retryable", () => {
    const f = fixture([{ eventType: "EXECUTOR_FAILED", state: "FAILED", failureClass: "PROVIDER_5XX", provider: "provider" }]);
    assert.equal(f.supervisor.start("pipe-8", "corr-8").action, "RETRY_SCHEDULED");
  });

  it("9 healthy heartbeat is a NO-OP", () => {
    const f = fixture([selected()]); f.supervisor.start("pipe-9", "corr-9"); assert.equal(f.supervisor.heartbeat()[0]!.reason, "HEALTHY"); assert.equal(f.calls(), 1);
  });

  it("10 stale operation is recovered", () => {
    const f = fixture([dispatched(), selected()]); f.supervisor.start("pipe-10", "corr-10"); f.advance(11_000);
    assert.equal(f.supervisor.heartbeat()[0]!.action, "ITERATED"); assert.equal(f.calls(), 2);
  });

  it("11 process restart resumes from replayed durable state", () => {
    const f = fixture([selected()]); f.supervisor.start("pipe-11", "corr-11");
    const second = new AgentFactorySupervisor(new DurableSupervisorStore(f.root), config, { iterate: () => dispatched() }, { deliver: () => true }, "restarted", () => new Date(baseTime + 1_000).toISOString());
    assert.equal(second.resume("pipe-11").action, "ITERATED"); assert.equal(second.status("pipe-11")!.current_operation, "opencode");
  });

  it("12 callback and heartbeat race cannot duplicate an action", () => {
    const f = fixture([selected(), dispatched()]); f.supervisor.start("pipe-12", "corr-12"); const wake = f.wakes[0]!;
    const lease = f.store.acquireLease("pipe-12", "racer", new Date(baseTime).toISOString(), 5)!;
    assert.equal(f.supervisor.callback(wake).action, "LEASE_BUSY"); assert.equal(f.supervisor.heartbeat()[0]!.action, "LEASE_BUSY"); assert.equal(f.calls(), 1);
    f.store.releaseLease(lease); assert.equal(f.supervisor.callback(wake).action, "ITERATED"); assert.equal(f.calls(), 2);
  });

  it("13 expired lease can be recovered", () => {
    const f = fixture([selected()]); assert.ok(f.store.acquireLease("pipe-13", "dead", new Date(baseTime).toISOString(), 1)); f.advance(2_000);
    assert.equal(f.supervisor.start("pipe-13", "corr-13").action, "ITERATED");
  });

  it("14 valid lease prevents concurrent processing", () => {
    const f = fixture([selected()]); assert.ok(f.store.acquireLease("pipe-14", "active", new Date(baseTime).toISOString(), 10));
    assert.equal(f.supervisor.start("pipe-14", "corr-14").action, "LEASE_BUSY"); assert.equal(f.calls(), 0);
  });

  it("15 DONE is never reexecuted", () => {
    const f = fixture([complete()]); f.supervisor.start("pipe-15", "corr-15"); assert.equal(f.supervisor.resume("pipe-15").reason, "PIPELINE_TERMINAL"); assert.equal(f.calls(), 1);
  });

  it("16 BLOCKED is not bypassed by heartbeat", () => {
    const f = fixture([{ eventType: "PIPELINE_BLOCKED", state: "BLOCKED", terminalStatus: "BLOCKED", failureClass: "AUTHORITY_DIVERGENCE" }]);
    f.supervisor.start("pipe-16", "corr-16"); assert.equal(f.supervisor.heartbeat()[0]!.reason, "PIPELINE_TERMINAL"); assert.equal(f.calls(), 1);
  });

  it("17 approval arrival wakes the supervisor", () => {
    const f = fixture([selected(), { eventType: "APPROVAL_RECEIVED", state: "APPROVED", taskId: "TASK-010" }]); f.supervisor.start("pipe-17", "corr-17");
    assert.equal(f.supervisor.callback(f.wakes[0]!).reason, "APPROVAL_RECEIVED");
  });

  it("18 terminal CI wake reconciles the supervisor", () => {
    const f = fixture([selected(), { eventType: "PR_CHECKS_CHANGED", state: "CI_SUCCESS", taskId: "TASK-010", payloadRef: "github/pr/1" }]); f.supervisor.start("pipe-18", "corr-18");
    assert.equal(f.supervisor.callback(f.wakes[0]!).reason, "PR_CHECKS_CHANGED");
  });

  it("19 missing external callback is detected by next heartbeat", () => {
    const f = fixture([selected()], false); f.supervisor.start("pipe-19", "corr-19"); f.advance(5_000);
    assert.equal(f.supervisor.heartbeat()[0]!.reason, "HEALTHY"); assert.equal(f.supervisor.status("pipe-19")!.pending_callback_event_ids.length, 1);
  });

  it("20 pipeline completion produces a final durable event", () => {
    const f = fixture([complete()]); const result = f.supervisor.start("pipe-20", "corr-20");
    assert.equal(f.supervisor.status("pipe-20")!.terminal_status, "COMPLETE"); assert.equal(f.store.readEvents("pipe-20").find((item) => item.event.event_id === result.eventId)!.event.event_type, "PIPELINE_COMPLETE");
  });

  it("opens and half-opens the provider circuit without polling", () => {
    const fail = (): SupervisorIterationResult => ({ eventType: "EXECUTOR_FAILED", state: "FAILED", failureClass: "PROVIDER_5XX", provider: "provider" });
    const f = fixture([fail(), fail(), selected()]); f.supervisor.start("pipe-circuit", "corr-circuit"); f.advance(2_000); f.supervisor.heartbeat();
    assert.equal(f.supervisor.status("pipe-circuit")!.circuit_breaker.state, "OPEN"); f.advance(4_000); assert.equal(f.supervisor.resume("pipe-circuit").reason, "CIRCUIT_OPEN");
    f.advance(10_000); f.supervisor.heartbeat(); assert.equal(f.supervisor.status("pipe-circuit")!.circuit_breaker.state, "CLOSED");
  });

  it("persists an event before attempting callback delivery", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-supervisor-order-")); const store = new DurableSupervisorStore(root); let observed = false;
    const supervisor = new AgentFactorySupervisor(store, config, { iterate: () => selected() }, { deliver: (wake) => { observed = store.readEvents("pipe-order").some((item) => item.event.event_id === wake.event_id); return true; } }, "owner", () => new Date(baseTime).toISOString());
    supervisor.start("pipe-order", "corr-order"); assert.equal(observed, true);
  });

  it("bounds callback delivery retries and preserves the attention event", () => {
    const f = fixture([selected()], false); f.supervisor.start("pipe-callback-exhausted", "corr-callback-exhausted");
    f.advance(2_000); f.supervisor.heartbeat(); f.advance(4_000); f.supervisor.heartbeat();
    assert.equal(f.supervisor.status("pipe-callback-exhausted")!.terminal_status, "RETRY_EXHAUSTED");
    assert.ok(f.store.readEvents("pipe-callback-exhausted").some((item) => item.event.event_type === "RETRY_EXHAUSTED" && item.event.callback_required));
  });

  it("policy file remains valid and runtime path is ignored", () => {
    assert.equal(JSON.parse(readFileSync("tooling/agent-harness/policies/SUPERVISOR.json", "utf8")).schema_version, 1);
    assert.match(readFileSync(".gitignore", "utf8"), /^\.agent\/runtime\/$/m);
  });
});
