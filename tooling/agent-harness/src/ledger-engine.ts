import { createHash } from "node:crypto";
import { z } from "zod";
import {
  executionStateSchema,
  stateTransitionSchema,
  taskRecordSchema,
  type ExecutionState,
  type StateTransition,
  type TaskRecord,
} from "./execution-contracts.js";
import {
  agentFactoryAttemptEvidenceEnvelopeSchema,
  agentFactoryEvidenceEnvelopeSchema,
  type AgentFactoryAttemptEvidenceEnvelope,
  type AgentFactoryEvidenceEnvelope,
} from "./evidence-writer.js";

const transitionReasonSchema = stateTransitionSchema.shape.reason_code;
const rejectionReasonSchema = z.enum([
  "ILLEGAL_TRANSITION",
  "EVIDENCE_INVALID",
  "EVIDENCE_INTEGRITY_INVALID",
  "EVIDENCE_IDENTITY_MISMATCH",
  "EVIDENCE_CAUSALITY_INVALID",
  "EVIDENCE_OUTCOME_INVALID",
  "DONE_EVIDENCE_INVALID",
]);

export const ledgerTransitionEventSchema = z.object({
  schema_version: z.literal(1),
  receipt_id: z.string().regex(/^AFEVT-[0-9a-f]{64}$/),
  content_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  work_package_id: z.string().regex(/^WP-[A-Z0-9-]+$/),
  reason_code: transitionReasonSchema,
  observed_at: z.iso.datetime({ offset: true }),
}).strict();

export type LedgerTransitionEvent = z.infer<typeof ledgerTransitionEventSchema>;

export const ledgerTransitionAttemptSchema = z.object({
  sequence: z.number().int().positive(),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  from: executionStateSchema,
  to: executionStateSchema,
  reason_code: transitionReasonSchema,
  occurred_at: z.iso.datetime({ offset: true }),
  evidence_ref: z.string().min(1),
  evidence_receipt_id: z.string().regex(/^AF(?:EV|ATT|EVT)-[0-9a-f]{64}$/).nullable(),
  status: z.enum(["ACCEPTED", "REJECTED"]),
  rejection_reasons: z.array(rejectionReasonSchema),
}).strict().superRefine((attempt, context) => {
  if (attempt.status === "ACCEPTED" && attempt.rejection_reasons.length > 0) {
    context.addIssue({ code: "custom", path: ["rejection_reasons"], message: "accepted attempt cannot retain rejection reasons" });
  }
  if (attempt.status === "REJECTED" && attempt.rejection_reasons.length === 0) {
    context.addIssue({ code: "custom", path: ["rejection_reasons"], message: "rejected attempt requires reasons" });
  }
});

const receiptBaseSchema = z.object({
  schema_version: z.literal(1),
  authoritative_task: taskRecordSchema,
  attempts: z.array(ledgerTransitionAttemptSchema).min(1),
}).strict();

export const ledgerApplicationReceiptSchema = z.discriminatedUnion("accepted", [
  receiptBaseSchema.extend({
    accepted: z.literal(true),
    transition: stateTransitionSchema,
    reason_codes: z.array(rejectionReasonSchema).length(0),
  }).strict(),
  receiptBaseSchema.extend({
    accepted: z.literal(false),
    transition: z.null(),
    reason_codes: z.array(rejectionReasonSchema).min(1),
  }).strict(),
]);

export type LedgerTransitionAttempt = z.infer<typeof ledgerTransitionAttemptSchema>;
export type LedgerApplicationReceipt = z.infer<typeof ledgerApplicationReceiptSchema>;
export type LedgerTransitionRequest = {
  task: TaskRecord;
  to: ExecutionState;
  reasonCode: StateTransition["reason_code"];
  occurredAt: string;
  evidenceRef: string;
  evidence: unknown;
  priorAttempts?: LedgerTransitionAttempt[];
};

export type LedgerTransitionEventInput = Omit<LedgerTransitionEvent, "schema_version" | "receipt_id" | "content_sha256">;

const legalTransitions = new Set<string>([
  "DRAFT>READY:TASK_APPROVED",
  "READY>RUNNING:EXECUTION_STARTED",
  "RUNNING>VERIFICATION:EXECUTOR_COMPLETED",
  "VERIFICATION>EVIDENCED:VALIDATION_PASSED",
  "VERIFICATION>FAILED:VALIDATION_FAILED",
  "EVIDENCED>INTEGRATING:INTEGRATION_STARTED",
  "INTEGRATING>DONE:INTEGRATION_ACCEPTED",
  "READY>BLOCKED:DEPENDENCY_BLOCKED",
  "RUNNING>BLOCKED:DEPENDENCY_BLOCKED",
  "VERIFICATION>NEEDS_DECISION:GOVERNANCE_DECISION_REQUIRED",
]);

export function applyLedgerTransition(input: LedgerTransitionRequest): LedgerApplicationReceipt {
  const task = taskRecordSchema.parse(input.task);
  const target = executionStateSchema.parse(input.to);
  const reasonCode = transitionReasonSchema.parse(input.reasonCode);
  const occurredAt = z.iso.datetime({ offset: true }).parse(input.occurredAt);
  const evidenceRef = z.string().min(1).parse(input.evidenceRef);
  const priorAttempts = z.array(ledgerTransitionAttemptSchema).parse(input.priorAttempts ?? []);
  const evidence = parseEvidence(input.evidence);
  const rejectionReasons: Array<z.infer<typeof rejectionReasonSchema>> = [];

  if (!legalTransitions.has(`${task.state}>${target}:${reasonCode}`)) rejectionReasons.push("ILLEGAL_TRANSITION");
  if (!evidence) rejectionReasons.push("EVIDENCE_INVALID");
  else {
    if (!hasValidEvidenceIntegrity(evidence)) rejectionReasons.push("EVIDENCE_INTEGRITY_INVALID");
    if (!hasMatchingIdentity(evidence, task)) {
      rejectionReasons.push("EVIDENCE_IDENTITY_MISMATCH");
    }
    if (!isCausallyAvailable(evidence, occurredAt)) rejectionReasons.push("EVIDENCE_CAUSALITY_INVALID");
    if (!hasCompatibleOutcome(evidence, reasonCode)) rejectionReasons.push("EVIDENCE_OUTCOME_INVALID");
    if (target === "DONE" && (evidence.kind !== "accepted" || !isValidDoneEvidence(evidence.value))) {
      rejectionReasons.push("DONE_EVIDENCE_INVALID");
    }
  }

  const reasons = [...new Set(rejectionReasons)];
  const attempt = ledgerTransitionAttemptSchema.parse({
    sequence: priorAttempts.length + 1,
    task_id: task.task_id,
    from: task.state,
    to: target,
    reason_code: reasonCode,
    occurred_at: occurredAt,
    evidence_ref: evidenceRef,
    evidence_receipt_id: evidence?.value.receipt_id ?? null,
    status: reasons.length === 0 ? "ACCEPTED" : "REJECTED",
    rejection_reasons: reasons,
  });
  const attempts = [...priorAttempts, attempt];

  if (reasons.length > 0) {
    return ledgerApplicationReceiptSchema.parse({
      schema_version: 1,
      accepted: false,
      authoritative_task: task,
      transition: null,
      reason_codes: reasons,
      attempts,
    });
  }

  const transition = stateTransitionSchema.parse({
    schema_version: 1,
    task_id: task.task_id,
    from: task.state,
    to: target,
    reason_code: reasonCode,
    occurred_at: occurredAt,
    evidence_refs: [evidenceRef],
  });
  return ledgerApplicationReceiptSchema.parse({
    schema_version: 1,
    accepted: true,
    authoritative_task: { ...task, state: target },
    transition,
    reason_codes: [],
    attempts,
  });
}

export function buildLedgerTransitionEvent(input: LedgerTransitionEventInput): LedgerTransitionEvent {
  const semantic = {
    schema_version: 1 as const,
    task_id: input.task_id,
    work_package_id: input.work_package_id,
    reason_code: transitionReasonSchema.parse(input.reason_code),
    observed_at: z.iso.datetime({ offset: true }).parse(input.observed_at),
  };
  const contentHash = hashSemantic(semantic);
  return ledgerTransitionEventSchema.parse({
    ...semantic,
    receipt_id: `AFEVT-${contentHash}`,
    content_sha256: contentHash,
  });
}

type ParsedEvidence =
  | { kind: "event"; value: LedgerTransitionEvent }
  | { kind: "attempt"; value: AgentFactoryAttemptEvidenceEnvelope }
  | { kind: "accepted"; value: AgentFactoryEvidenceEnvelope };

function parseEvidence(value: unknown): ParsedEvidence | undefined {
  const event = ledgerTransitionEventSchema.safeParse(value);
  if (event.success) return { kind: "event", value: event.data };
  const attempt = agentFactoryAttemptEvidenceEnvelopeSchema.safeParse(value);
  if (attempt.success) return { kind: "attempt", value: attempt.data };
  const accepted = agentFactoryEvidenceEnvelopeSchema.safeParse(value);
  if (accepted.success) return { kind: "accepted", value: accepted.data };
  return undefined;
}

function hasMatchingIdentity(evidence: ParsedEvidence, task: TaskRecord): boolean {
  if (evidence.kind === "event") {
    return evidence.value.task_id === task.task_id && evidence.value.work_package_id === task.work_package_id;
  }
  return evidence.value.result.task_id === task.task_id && evidence.value.result.work_package_id === task.work_package_id;
}

function isCausallyAvailable(evidence: ParsedEvidence, occurredAt: string): boolean {
  if (evidence.kind === "accepted") return true;
  const observedAt = evidence.kind === "event" ? evidence.value.observed_at : evidence.value.attempt_finished_at;
  return Date.parse(observedAt) <= Date.parse(occurredAt);
}

function hasCompatibleOutcome(evidence: ParsedEvidence, reasonCode: StateTransition["reason_code"]): boolean {
  if (["TASK_APPROVED", "EXECUTION_STARTED", "EXECUTOR_COMPLETED", "INTEGRATION_STARTED"].includes(reasonCode)) {
    return evidence.kind === "event" && evidence.value.reason_code === reasonCode;
  }
  if (reasonCode === "INTEGRATION_ACCEPTED") return evidence.kind === "accepted";
  if (evidence.kind !== "attempt") return false;
  if (reasonCode === "VALIDATION_PASSED") return evidence.value.result.status === "DONE" && evidence.value.validation.decision === "PASS";
  if (reasonCode === "VALIDATION_FAILED") return evidence.value.result.status === "FAILED" && evidence.value.validation.decision === "FAIL";
  if (reasonCode === "GOVERNANCE_DECISION_REQUIRED") return evidence.value.result.status === "NEEDS_DECISION";
  if (reasonCode === "DEPENDENCY_BLOCKED") return evidence.value.result.status === "BLOCKED";
  return false;
}

function hasValidEvidenceIntegrity(evidence: ParsedEvidence): boolean {
  if (evidence.kind === "event") {
    const semantic = {
      schema_version: evidence.value.schema_version,
      task_id: evidence.value.task_id,
      work_package_id: evidence.value.work_package_id,
      reason_code: evidence.value.reason_code,
      observed_at: evidence.value.observed_at,
    };
    const expected = hashSemantic(semantic);
    return evidence.value.content_sha256 === expected && evidence.value.receipt_id === `AFEVT-${expected}`;
  }
  if (evidence.kind === "attempt") {
    const value = evidence.value;
    const semantic = {
      schema_version: value.schema_version,
      head_commit: value.head_commit,
      change_fingerprint: value.change_fingerprint,
      attempt_started_at: value.attempt_started_at,
      attempt_finished_at: value.attempt_finished_at,
      duration_seconds: value.duration_seconds,
      failure_category: value.failure_category,
      validation: value.validation,
      result: value.result,
    };
    const expected = hashSemantic(semantic);
    return value.content_sha256 === expected && value.receipt_id === `AFATT-${expected}`;
  }
  return hasValidIntegrity(evidence.value);
}

function isValidDoneEvidence(evidence: AgentFactoryEvidenceEnvelope): boolean {
  return evidence.validation.decision === "PASS"
    && evidence.validation.commands.length > 0
    && evidence.validation.commands.every((command) => command.status === "PASS")
    && evidence.result.status === "DONE"
    && evidence.result.tests.length > 0
    && evidence.result.tests.every((test) => test.status === "PASS")
    && evidence.result.acceptance.length > 0
    && evidence.result.acceptance.every((acceptance) => acceptance.status === "PASS")
    && evidence.result.dependency_gates_blocked.length === 0;
}

function hasValidIntegrity(evidence: AgentFactoryEvidenceEnvelope): boolean {
  const semantic = {
    schema_version: evidence.schema_version,
    head_commit: evidence.head_commit,
    change_fingerprint: evidence.change_fingerprint,
    validation: evidence.validation,
    result: evidence.result,
  };
  const expected = hashSemantic(semantic);
  return evidence.content_sha256 === expected && evidence.receipt_id === `AFEV-${expected}`;
}

function hashSemantic(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value, null, 2)).digest("hex");
}
