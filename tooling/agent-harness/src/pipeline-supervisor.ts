import {
  buildSupervisorEvent, failureClassSchema, supervisorCallbackSchema, supervisorConfigSchema,
  supervisorProjectionSchema, type AgentFactoryEvent, type FailureClass, type SupervisorCallback,
  type SupervisorConfig, type SupervisorEventType, type SupervisorProjection,
} from "./supervisor-contracts.js";
import { DurableSupervisorStore } from "./supervisor-store.js";

const retryable = new Set<FailureClass>([
  "OPENCODE_TIMEOUT", "TRANSIENT_CONNECTION", "RATE_LIMIT", "PROVIDER_5XX", "GITHUB_TRANSIENT", "CALLBACK_DELIVERY", "PROVIDER_UNAVAILABLE",
]);

export function isRetryableFailure(value: FailureClass): boolean { return retryable.has(failureClassSchema.parse(value)); }

export type SupervisorIterationResult = {
  eventType: SupervisorEventType;
  state: string;
  taskId?: string | null;
  currentOperation?: string | null;
  externalOperationRef?: string | null;
  payloadRef?: string | null;
  attemptId?: string | null;
  failureClass?: FailureClass;
  provider?: string;
  terminalStatus?: SupervisorProjection["terminal_status"];
};

export interface SupervisorIterationAdapter {
  iterate(input: { pipelineId: string; correlationId: string; projection: SupervisorProjection }): SupervisorIterationResult;
}

export interface SupervisorCallbackTransport {
  deliver(callback: SupervisorCallback): boolean;
}

export type SupervisorOutcome = {
  pipelineId: string; action: "ITERATED" | "NO_OP" | "LEASE_BUSY" | "CALLBACK_RECOVERED" | "RETRY_SCHEDULED" | "RETRY_EXHAUSTED";
  eventId: string | null; state: string | null; reason: string;
};

export class AgentFactorySupervisor {
  private readonly config: SupervisorConfig;

  constructor(
    private readonly store: DurableSupervisorStore,
    config: unknown,
    private readonly iteration: SupervisorIterationAdapter,
    private readonly callbacks: SupervisorCallbackTransport,
    private readonly owner: string,
    private readonly now: () => string,
    private readonly jitter: () => number = () => 0.5,
  ) { this.config = supervisorConfigSchema.parse(config); }

  start(pipelineId: string, correlationId: string): SupervisorOutcome {
    return this.withLease(pipelineId, "START", undefined, () => {
      let projection = this.store.projection(pipelineId);
      if (!projection) projection = this.persistInitial(pipelineId, correlationId);
      else if (projection.correlation_id !== correlationId) throw new Error("SUPERVISOR_CORRELATION_MISMATCH");
      if (projection.terminal_status) return outcome(pipelineId, "NO_OP", null, projection.state, "PIPELINE_TERMINAL");
      return this.iterate(projection, "START", null);
    });
  }

  resume(pipelineId: string): SupervisorOutcome {
    return this.withLease(pipelineId, "RESUME", undefined, () => {
      const projection = this.requireProjection(pipelineId);
      if (projection.terminal_status) return outcome(pipelineId, "NO_OP", null, projection.state, "PIPELINE_TERMINAL");
      if (projection.next_retry_at && Date.parse(projection.next_retry_at) > Date.parse(this.now())) return outcome(pipelineId, "NO_OP", null, projection.state, "RETRY_NOT_DUE");
      return this.iterate(projection, "RESUME", null);
    });
  }

  callback(input: unknown): SupervisorOutcome {
    const wake = supervisorCallbackSchema.parse(input);
    return this.withLease(wake.pipeline_id, "CALLBACK", wake.event_id, () => {
      const projection = this.requireProjection(wake.pipeline_id);
      if (projection.correlation_id !== wake.correlation_id) throw new Error("SUPERVISOR_CORRELATION_MISMATCH");
      if (projection.processed_wakeup_event_ids.includes(wake.event_id)) return outcome(wake.pipeline_id, "NO_OP", null, projection.state, "DUPLICATE_CALLBACK");
      if (!this.store.readEvents(wake.pipeline_id).some((record) => record.event.event_id === wake.event_id)) throw new Error("SUPERVISOR_CALLBACK_EVENT_UNKNOWN");
      if (projection.terminal_status) return outcome(wake.pipeline_id, "NO_OP", null, projection.state, "PIPELINE_TERMINAL");
      return this.iterate(projection, "CALLBACK", wake.event_id);
    });
  }

  heartbeat(): SupervisorOutcome[] {
    return this.store.listPipelineIds().map((pipelineId) => this.withLease(pipelineId, "HEARTBEAT", undefined, () => this.heartbeatPipeline(pipelineId)));
  }

  status(pipelineId: string): SupervisorProjection | undefined { return this.store.projection(pipelineId); }

  private heartbeatPipeline(pipelineId: string): SupervisorOutcome {
    let projection = this.requireProjection(pipelineId);
    if (projection.terminal_status) return outcome(pipelineId, "NO_OP", null, projection.state, "PIPELINE_TERMINAL");
    const pending = projection.pending_callback_event_ids[0];
    const callbackDue = projection.next_callback_retry_at === null || Date.parse(projection.next_callback_retry_at) <= Date.parse(this.now());
    if (pending && callbackDue) {
      const event = this.store.readEvents(pipelineId).find((record) => record.event.event_id === pending)?.event;
      if (event && this.deliver(event, projection)) return outcome(pipelineId, "CALLBACK_RECOVERED", event.event_id, projection.state, "PENDING_CALLBACK_DELIVERED");
      projection = this.store.projection(pipelineId) ?? projection;
    }
    const nowMs = Date.parse(this.now());
    const retryDue = projection.next_retry_at !== null && Date.parse(projection.next_retry_at) <= nowMs;
    const stale = projection.current_operation !== null && nowMs - Date.parse(projection.last_progress_at) >= this.config.heartbeat.stale_after_seconds * 1000;
    if (retryDue || stale) {
      const recovery = this.persist(projection, {
        eventType: "HEARTBEAT_RECOVERY", state: projection.state, taskId: projection.task_id, currentOperation: projection.current_operation,
        externalOperationRef: projection.external_operation_ref, payloadRef: null,
      }, "HEARTBEAT", null, { last_heartbeat_at: this.now() }, false);
      return this.iterate(recovery.projection, "HEARTBEAT", recovery.event.event_id);
    }
    const observed = this.persist(projection, {
      eventType: "HEARTBEAT_OBSERVED", state: projection.state, taskId: projection.task_id, currentOperation: projection.current_operation,
      externalOperationRef: projection.external_operation_ref, payloadRef: null,
    }, "HEARTBEAT", null, { last_heartbeat_at: this.now() }, false);
    return outcome(pipelineId, "NO_OP", observed.event.event_id, projection.state, "HEALTHY");
  }

  private iterate(projection: SupervisorProjection, source: "START" | "CALLBACK" | "HEARTBEAT" | "RESUME", wakeId: string | null): SupervisorOutcome {
    const now = this.now();
    const circuit = advanceCircuit(projection, now, this.config);
    if (circuit.state === "OPEN") return outcome(projection.pipeline_id, "NO_OP", null, projection.state, "CIRCUIT_OPEN");
    const base = supervisorProjectionSchema.parse({ ...projection, circuit_breaker: circuit });
    const result = this.iteration.iterate({ pipelineId: projection.pipeline_id, correlationId: projection.correlation_id, projection: base });
    if (result.failureClass) return this.handleFailure(base, { ...result, failureClass: result.failureClass }, source, wakeId);
    const updatedCircuit = result.provider || base.circuit_breaker.state === "HALF_OPEN"
      ? { state: "CLOSED" as const, failure_count: 0, opened_at: null }
      : base.circuit_breaker;
    const processed = wakeId ? unique([...base.processed_wakeup_event_ids, wakeId]) : base.processed_wakeup_event_ids;
    const record = this.persist(base, result, "ITERATION", wakeId, {
      task_id: result.taskId ?? base.task_id, state: result.state, terminal_status: result.terminalStatus ?? terminalFromEvent(result.eventType),
      last_progress_at: now, last_callback_at: source === "CALLBACK" ? now : base.last_callback_at,
      attempt_count: 0, first_attempt_at: null, next_retry_at: null, current_operation: result.currentOperation ?? null,
      external_operation_ref: result.externalOperationRef ?? null, processed_wakeup_event_ids: processed, circuit_breaker: updatedCircuit,
    }, true);
    this.deliver(record.event, record.projection);
    return outcome(base.pipeline_id, "ITERATED", record.event.event_id, record.projection.state, result.eventType);
  }

  private handleFailure(projection: SupervisorProjection, result: SupervisorIterationResult & { failureClass: FailureClass }, source: string, wakeId: string | null): SupervisorOutcome {
    failureClassSchema.parse(result.failureClass);
    const now = this.now();
    const attempts = projection.attempt_count + 1;
    const first = projection.first_attempt_at ?? now;
    const elapsed = (Date.parse(now) - Date.parse(first)) / 1000;
    const canRetry = isRetryableFailure(result.failureClass) && attempts < this.config.retry.max_attempts && elapsed < this.config.retry.max_elapsed_seconds;
    const circuit = registerCircuitFailure(projection.circuit_breaker, now, this.config, Boolean(result.provider));
    const processed = wakeId ? unique([...projection.processed_wakeup_event_ids, wakeId]) : projection.processed_wakeup_event_ids;
    if (canRetry) {
      const delay = retryDelaySeconds(attempts, this.config, this.jitter());
      const record = this.persist(projection, { ...result, eventType: "RETRY_SCHEDULED", state: "RETRY_WAIT" }, "ITERATION", wakeId, {
        state: "RETRY_WAIT", attempt_count: attempts, first_attempt_at: first, next_retry_at: new Date(Date.parse(now) + delay * 1000).toISOString(),
        last_callback_at: source === "CALLBACK" ? now : projection.last_callback_at, processed_wakeup_event_ids: processed, circuit_breaker: circuit,
      }, true);
      this.deliver(record.event, record.projection);
      return outcome(projection.pipeline_id, "RETRY_SCHEDULED", record.event.event_id, record.projection.state, result.failureClass);
    }
    const terminal = isRetryableFailure(result.failureClass) ? "RETRY_EXHAUSTED" as const : (result.terminalStatus ?? "BLOCKED");
    const type = isRetryableFailure(result.failureClass) ? "RETRY_EXHAUSTED" as const : (result.eventType === "TASK_FAILED" ? "TASK_FAILED" as const : "PIPELINE_BLOCKED" as const);
    const record = this.persist(projection, { ...result, eventType: type, state: terminal }, "ITERATION", wakeId, {
      state: terminal, terminal_status: terminal, attempt_count: attempts, first_attempt_at: first, next_retry_at: null,
      last_callback_at: source === "CALLBACK" ? now : projection.last_callback_at, processed_wakeup_event_ids: processed, circuit_breaker: circuit,
    }, true);
    this.deliver(record.event, record.projection);
    return outcome(projection.pipeline_id, isRetryableFailure(result.failureClass) ? "RETRY_EXHAUSTED" : "ITERATED", record.event.event_id, terminal, result.failureClass);
  }

  private persistInitial(pipelineId: string, correlationId: string): SupervisorProjection {
    const at = this.now();
    const projection = supervisorProjectionSchema.parse({ schema_version: 1, pipeline_id: pipelineId, correlation_id: correlationId, task_id: null, state: "STARTED", terminal_status: null,
      last_progress_at: at, last_heartbeat_at: null, last_callback_at: null, attempt_count: 0, first_attempt_at: null, next_retry_at: null,
      callback_attempt_count: 0, next_callback_retry_at: null,
      current_operation: null, external_operation_ref: null, pending_callback_event_ids: [], processed_wakeup_event_ids: [],
      circuit_breaker: { state: "CLOSED", failure_count: 0, opened_at: null } });
    return this.persist(projection, { eventType: "PIPELINE_STARTED", state: "STARTED", taskId: null }, "START", null, {}, false).projection;
  }

  private persist(previous: SupervisorProjection, result: Pick<SupervisorIterationResult, "eventType" | "state"> & Partial<SupervisorIterationResult>, source: AgentFactoryEvent["source"], causationId: string | null, changes: Partial<SupervisorProjection>, callbackRequired: boolean) {
    const at = this.now();
    const event = buildSupervisorEvent({ schema_version: 1, event_type: result.eventType, pipeline_id: previous.pipeline_id, task_id: result.taskId ?? previous.task_id,
      source, previous_state: previous.state, current_state: result.state, occurred_at: at, correlation_id: previous.correlation_id,
      causation_id: causationId, attempt_id: result.attemptId ?? null, payload_ref: result.payloadRef ?? null, callback_required: callbackRequired });
    const pending = callbackRequired
      ? unique([...previous.pending_callback_event_ids, event.event_id])
      : changes.pending_callback_event_ids ?? previous.pending_callback_event_ids;
    const projection = supervisorProjectionSchema.parse({ ...previous, ...changes, pending_callback_event_ids: pending });
    return this.store.append({ event, projection }).record;
  }

  private deliver(event: AgentFactoryEvent, projection: SupervisorProjection): boolean {
    const callback = supervisorCallbackSchema.parse({ schema_version: 1, pipeline_id: event.pipeline_id, event_id: event.event_id, correlation_id: event.correlation_id, reason: event.event_type });
    let delivered = false;
    try { delivered = this.callbacks.deliver(callback); } catch { delivered = false; }
    if (!delivered) {
      const attempts = projection.callback_attempt_count + 1;
      const exhausted = attempts >= this.config.retry.max_attempts;
      const delay = retryDelaySeconds(attempts, this.config, this.jitter());
      this.persist(projection, {
        eventType: exhausted ? "RETRY_EXHAUSTED" : "RETRY_SCHEDULED", state: exhausted ? "RETRY_EXHAUSTED" : projection.state,
        taskId: projection.task_id, payloadRef: event.event_id,
      }, "OUTBOX", event.event_id, exhausted ? {
        state: "RETRY_EXHAUSTED", terminal_status: "RETRY_EXHAUSTED", callback_attempt_count: attempts, next_callback_retry_at: null,
      } : {
        callback_attempt_count: attempts, next_callback_retry_at: new Date(Date.parse(this.now()) + delay * 1000).toISOString(),
      }, exhausted);
      return false;
    }
    const remaining = projection.pending_callback_event_ids.filter((id) => id !== event.event_id);
    this.persist(projection, { eventType: "CALLBACK_DELIVERED", state: projection.state, taskId: projection.task_id, payloadRef: event.event_id }, "OUTBOX", event.event_id, {
      pending_callback_event_ids: remaining, last_callback_at: this.now(),
      callback_attempt_count: 0, next_callback_retry_at: null,
    }, false);
    return true;
  }

  private withLease(pipelineId: string, _source: string, _wakeId: string | undefined, run: () => SupervisorOutcome): SupervisorOutcome {
    const lease = this.store.acquireLease(pipelineId, this.owner, this.now(), this.config.lease.ttl_seconds);
    if (!lease) return outcome(pipelineId, "LEASE_BUSY", null, this.store.projection(pipelineId)?.state ?? null, "LEASE_HELD");
    try { return run(); } finally { this.store.releaseLease(lease); }
  }

  private requireProjection(pipelineId: string): SupervisorProjection {
    const projection = this.store.projection(pipelineId); if (!projection) throw new Error("SUPERVISOR_PIPELINE_NOT_FOUND"); return projection;
  }
}

export function retryDelaySeconds(attempt: number, configInput: unknown, random: number): number {
  const config = supervisorConfigSchema.parse(configInput);
  const base = Math.min(config.retry.max_delay_seconds, config.retry.initial_delay_seconds * config.retry.multiplier ** Math.max(0, attempt - 1));
  const boundedRandom = Math.min(1, Math.max(0, random));
  return Math.round(base * (1 + config.retry.jitter_ratio * (boundedRandom * 2 - 1)));
}

function advanceCircuit(projection: SupervisorProjection, now: string, config: SupervisorConfig): SupervisorProjection["circuit_breaker"] {
  const circuit = projection.circuit_breaker;
  if (circuit.state !== "OPEN" || !circuit.opened_at) return circuit;
  if (Date.parse(now) - Date.parse(circuit.opened_at) >= config.circuit_breaker.cooldown_seconds * 1000) return { ...circuit, state: "HALF_OPEN" };
  return circuit;
}

function registerCircuitFailure(circuit: SupervisorProjection["circuit_breaker"], now: string, config: SupervisorConfig, providerFailure: boolean): SupervisorProjection["circuit_breaker"] {
  if (!providerFailure) return circuit;
  const count = circuit.failure_count + 1;
  return count >= config.circuit_breaker.failure_threshold || circuit.state === "HALF_OPEN"
    ? { state: "OPEN", failure_count: count, opened_at: now }
    : { state: "CLOSED", failure_count: count, opened_at: null };
}

function terminalFromEvent(type: SupervisorEventType): SupervisorProjection["terminal_status"] {
  if (type === "PIPELINE_COMPLETE") return "COMPLETE";
  if (type === "PIPELINE_BLOCKED" || type === "TASK_BLOCKED") return "BLOCKED";
  if (type === "TASK_FAILED") return "FAILED";
  return null;
}

function unique<T>(values: T[]): T[] { return [...new Set(values)]; }
function outcome(pipelineId: string, action: SupervisorOutcome["action"], eventId: string | null, state: string | null, reason: string): SupervisorOutcome {
  return { pipelineId, action, eventId, state, reason };
}
