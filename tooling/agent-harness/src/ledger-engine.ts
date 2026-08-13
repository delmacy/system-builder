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
import { agentFactoryEvidenceEnvelopeSchema, type AgentFactoryEvidenceEnvelope } from "./evidence-writer.js";

const transitionReasonSchema = stateTransitionSchema.shape.reason_code;
const rejectionReasonSchema = z.enum([
  "ILLEGAL_TRANSITION",
  "EVIDENCE_INVALID",
  "EVIDENCE_INTEGRITY_INVALID",
  "EVIDENCE_IDENTITY_MISMATCH",
  "DONE_EVIDENCE_INVALID",
]);

export const ledgerTransitionAttemptSchema = z.object({
  sequence: z.number().int().positive(),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  from: executionStateSchema,
  to: executionStateSchema,
  reason_code: transitionReasonSchema,
  occurred_at: z.iso.datetime({ offset: true }),
  evidence_ref: z.string().min(1),
  evidence_receipt_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/).nullable(),
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
  const evidenceResult = agentFactoryEvidenceEnvelopeSchema.safeParse(input.evidence);
  const rejectionReasons: Array<z.infer<typeof rejectionReasonSchema>> = [];

  if (!legalTransitions.has(`${task.state}>${target}:${reasonCode}`)) rejectionReasons.push("ILLEGAL_TRANSITION");
  if (!evidenceResult.success) rejectionReasons.push("EVIDENCE_INVALID");
  else {
    const evidence = evidenceResult.data;
    if (!hasValidIntegrity(evidence)) rejectionReasons.push("EVIDENCE_INTEGRITY_INVALID");
    if (evidence.result.task_id !== task.task_id || evidence.result.work_package_id !== task.work_package_id) {
      rejectionReasons.push("EVIDENCE_IDENTITY_MISMATCH");
    }
    if (target === "DONE" && !isValidDoneEvidence(evidence)) rejectionReasons.push("DONE_EVIDENCE_INVALID");
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
    evidence_receipt_id: evidenceResult.success ? evidenceResult.data.receipt_id : null,
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
  const expected = createHash("sha256").update(JSON.stringify(semantic, null, 2)).digest("hex");
  return evidence.content_sha256 === expected && evidence.receipt_id === `AFEV-${expected}`;
}
