import { createHash } from "node:crypto";
import { z } from "zod";

const timestamp = z.iso.datetime({ offset: true });
const identifier = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/);
const eventId = z.string().regex(/^AFEVT-[0-9a-f]{64}$/);
const taskId = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);

export const supervisorEventTypeSchema = z.enum([
  "PIPELINE_STARTED", "TASK_SELECTED", "TASK_DISPATCHED", "EXECUTOR_STARTED", "EXECUTOR_COMPLETED", "EXECUTOR_FAILED",
  "VALIDATION_STARTED", "VALIDATION_PASSED", "VALIDATION_FAILED", "EVIDENCE_WRITTEN", "PR_CREATED", "PR_CHECKS_CHANGED",
  "PR_ELIGIBLE", "PR_MERGED", "APPROVAL_REQUIRED", "APPROVAL_RECEIVED", "STATE_CLOSURE_STARTED", "STATE_CLOSURE_MERGED",
  "LEDGER_UPDATED", "SUCCESSOR_READY", "TASK_DONE", "TASK_BLOCKED", "TASK_FAILED", "PIPELINE_COMPLETE", "PIPELINE_BLOCKED",
  "HEARTBEAT_RECOVERY", "HEARTBEAT_OBSERVED", "RETRY_SCHEDULED", "RETRY_EXHAUSTED", "CALLBACK_DELIVERED",
]);

export const failureClassSchema = z.enum([
  "OPENCODE_TIMEOUT", "TRANSIENT_CONNECTION", "RATE_LIMIT", "PROVIDER_5XX", "GITHUB_TRANSIENT", "CALLBACK_DELIVERY",
  "PROVIDER_UNAVAILABLE", "VALIDATION_FAILURE", "FORBIDDEN_PATH", "ARCHITECTURE_VIOLATION", "APPROVAL_REJECTED",
  "SCOPE_VIOLATION", "INVALID_TASK_CONTRACT", "AUTHORITY_DIVERGENCE", "INVALID_EVIDENCE", "DAG_CYCLE", "DETERMINISTIC_FAILURE",
]);

export const supervisorConfigSchema = z.object({
  schema_version: z.literal(1),
  heartbeat: z.object({ interval_seconds: z.number().int().positive(), stale_after_seconds: z.number().int().positive() }).strict(),
  retry: z.object({
    max_attempts: z.number().int().positive(), initial_delay_seconds: z.number().int().positive(), max_delay_seconds: z.number().int().positive(),
    multiplier: z.number().min(1), jitter_ratio: z.number().min(0).max(1), max_elapsed_seconds: z.number().int().positive(),
  }).strict(),
  callbacks: z.object({ mode: z.enum(["local"]), timeout_seconds: z.number().int().positive() }).strict(),
  lease: z.object({ ttl_seconds: z.number().int().positive() }).strict(),
  circuit_breaker: z.object({ failure_threshold: z.number().int().positive(), cooldown_seconds: z.number().int().positive() }).strict(),
}).strict();

export const supervisorCallbackSchema = z.object({
  schema_version: z.literal(1), pipeline_id: identifier, event_id: eventId, correlation_id: identifier, reason: z.string().min(1).max(256),
}).strict();

export const supervisorLeaseSchema = z.object({
  schema_version: z.literal(1), pipeline_id: identifier, owner: identifier, acquired_at: timestamp, expires_at: timestamp,
}).strict();

export const circuitStateSchema = z.object({
  state: z.enum(["CLOSED", "OPEN", "HALF_OPEN"]), failure_count: z.number().int().nonnegative(), opened_at: timestamp.nullable(),
}).strict();

export const supervisorProjectionSchema = z.object({
  schema_version: z.literal(1), pipeline_id: identifier, correlation_id: identifier,
  task_id: taskId.nullable(), state: z.string().min(1), terminal_status: z.enum(["COMPLETE", "BLOCKED", "FAILED", "NEEDS_DECISION", "RETRY_EXHAUSTED"]).nullable(),
  last_progress_at: timestamp, last_heartbeat_at: timestamp.nullable(), last_callback_at: timestamp.nullable(),
  attempt_count: z.number().int().nonnegative(), first_attempt_at: timestamp.nullable(), next_retry_at: timestamp.nullable(),
  callback_attempt_count: z.number().int().nonnegative(), next_callback_retry_at: timestamp.nullable(),
  current_operation: z.string().nullable(), external_operation_ref: z.string().nullable(),
  pending_callback_event_ids: z.array(eventId), processed_wakeup_event_ids: z.array(eventId),
  circuit_breaker: circuitStateSchema,
}).strict();

const eventSemanticSchema = z.object({
  schema_version: z.literal(1), event_type: supervisorEventTypeSchema, pipeline_id: identifier, task_id: taskId.nullable(), source: z.enum(["START", "CALLBACK", "HEARTBEAT", "RESUME", "ITERATION", "OUTBOX"]),
  previous_state: z.string().nullable(), current_state: z.string().min(1), occurred_at: timestamp, correlation_id: identifier,
  causation_id: eventId.nullable(), attempt_id: identifier.nullable(), payload_ref: z.string().nullable(), callback_required: z.boolean(),
}).strict();

export const agentFactoryEventSchema = eventSemanticSchema.extend({ event_id: eventId }).strict();
export const supervisorEventRecordSchema = z.object({ event: agentFactoryEventSchema, projection: supervisorProjectionSchema }).strict();

export type SupervisorConfig = z.infer<typeof supervisorConfigSchema>;
export type SupervisorCallback = z.infer<typeof supervisorCallbackSchema>;
export type SupervisorLease = z.infer<typeof supervisorLeaseSchema>;
export type SupervisorProjection = z.infer<typeof supervisorProjectionSchema>;
export type AgentFactoryEvent = z.infer<typeof agentFactoryEventSchema>;
export type SupervisorEventRecord = z.infer<typeof supervisorEventRecordSchema>;
export type FailureClass = z.infer<typeof failureClassSchema>;
export type SupervisorEventType = z.infer<typeof supervisorEventTypeSchema>;

export function buildSupervisorEvent(input: z.input<typeof eventSemanticSchema>): AgentFactoryEvent {
  const semantic = eventSemanticSchema.parse(input);
  return agentFactoryEventSchema.parse({ ...semantic, event_id: `AFEVT-${createHash("sha256").update(canonicalJson(semantic)).digest("hex")}` });
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
