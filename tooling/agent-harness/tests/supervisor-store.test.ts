import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { DurableSupervisorStore } from "../src/supervisor-store.js";
import { buildSupervisorEvent, supervisorProjectionSchema } from "../src/supervisor-contracts.js";

function projection(pipelineId: string) {
  return supervisorProjectionSchema.parse({
    schema_version: 1,
    pipeline_id: pipelineId,
    correlation_id: `${pipelineId}-correlation`,
    task_id: null,
    state: "STARTED",
    terminal_status: null,
    last_progress_at: "2026-08-15T09:00:00.000Z",
    last_heartbeat_at: null,
    last_callback_at: null,
    attempt_count: 0,
    first_attempt_at: null,
    next_retry_at: null,
    callback_attempt_count: 0,
    next_callback_retry_at: null,
    current_operation: null,
    external_operation_ref: null,
    pending_callback_event_ids: [],
    processed_wakeup_event_ids: [],
    circuit_breaker: { state: "CLOSED", failure_count: 0, opened_at: null },
  });
}

describe("DurableSupervisorStore.listPipelineIds", () => {
  it("returns only directories with durable supervisor events", () => {
    const root = mkdtempSync(join(tmpdir(), "supervisor-store-"));
    const store = new DurableSupervisorStore(root);
    const current = projection("m1-sprint-01-r1");
    const event = buildSupervisorEvent({
      schema_version: 1,
      event_type: "PIPELINE_STARTED",
      pipeline_id: current.pipeline_id,
      task_id: null,
      source: "START",
      previous_state: "STARTED",
      current_state: "STARTED",
      occurred_at: "2026-08-15T09:00:00.000Z",
      correlation_id: current.correlation_id,
      causation_id: null,
      attempt_id: null,
      payload_ref: null,
      callback_required: false,
    });
    store.append({ event, projection: current });

    mkdirSync(join(root, "payloads"), { recursive: true });
    writeFileSync(join(root, "payloads", "AFSEQ-fixture.json"), "{}\n");
    mkdirSync(join(root, "scratch", "events"), { recursive: true });
    writeFileSync(join(root, "scratch", "events", "not-an-event.json"), "{}\n");

    assert.deepEqual(store.listPipelineIds(), ["m1-sprint-01-r1"]);
  });
});
