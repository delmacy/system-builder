import type { ProducingRevisionRef } from "./durable-execution";

export type ExternalEffectKnowledge = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type ExternalEffectOutcome = "NOT_OBSERVED" | "APPLIED" | "NOT_APPLIED" | "FAILED";
export type ReconciliationState = "NOT_REQUIRED" | "REQUIRED" | "RECONCILED";

export interface ExternalEffectIdentity {
  effectRef: string;
  executionRef: string;
  producingRevision: ProducingRevisionRef;
}

export interface EffectAttemptEvidence {
  attemptRef: string;
  deliveryRef?: string;
  providerAcknowledged: boolean;
}

export interface IdempotencyQualification {
  key: string;
  authorityRef: string;
  scopeRef: string;
  payloadFingerprint: string;
  validUntil: string;
}

export interface ExternalEffectSnapshot extends ExternalEffectIdentity {
  knowledge: ExternalEffectKnowledge;
  outcome: ExternalEffectOutcome;
  reconciliation: ReconciliationState;
  observedAt?: string;
  authorityRef?: string;
  currentRevision: ProducingRevisionRef;
  attempts: readonly EffectAttemptEvidence[];
  idempotency?: IdempotencyQualification;
}

export interface RetryCandidate {
  authorityRef: string;
  scopeRef: string;
  payloadFingerprint: string;
  evaluatedAt: string;
  currentRevision: ProducingRevisionRef;
}

export interface ExternalEffectAssessment {
  valid: boolean;
  retryAllowed: boolean;
  effectApplied: boolean;
  reasons: readonly string[];
}

const sameRevision = (left: ProducingRevisionRef, right: ProducingRevisionRef) =>
  left.definitionRef === right.definitionRef &&
  left.revisionRef === right.revisionRef &&
  left.contractVersion === right.contractVersion;

export function assessExternalEffect(
  snapshot: ExternalEffectSnapshot,
  retry: RetryCandidate,
): ExternalEffectAssessment {
  const reasons: string[] = [];

  if (snapshot.effectRef.length === 0) reasons.push("MISSING_EFFECT_IDENTITY");
  if (snapshot.attempts.some((attempt) => attempt.attemptRef === snapshot.effectRef || attempt.deliveryRef === snapshot.effectRef)) {
    reasons.push("ATTEMPT_OR_DELIVERY_COLLAPSES_TO_EFFECT_IDENTITY");
  }

  const effectApplied = snapshot.outcome === "APPLIED" && snapshot.knowledge === "KNOWN";
  if (snapshot.outcome === "APPLIED" && snapshot.knowledge !== "KNOWN") reasons.push("NON_KNOWN_CANNOT_PROVE_EFFECT");
  if (snapshot.attempts.some((attempt) => attempt.providerAcknowledged) && snapshot.outcome === "NOT_OBSERVED") {
    reasons.push("PROVIDER_ACK_IS_NOT_BUSINESS_EFFECT");
  }

  if (!sameRevision(snapshot.currentRevision, retry.currentRevision)) reasons.push("STALE_REVISION_EVIDENCE");
  if (snapshot.knowledge === "UNKNOWN" && snapshot.reconciliation !== "RECONCILED") {
    reasons.push("UNKNOWN_REQUIRES_AUTHORITATIVE_RECONCILIATION");
  }
  if (snapshot.reconciliation === "RECONCILED" && (!snapshot.authorityRef || snapshot.authorityRef !== retry.authorityRef)) {
    reasons.push("RECONCILIATION_AUTHORITY_MISMATCH");
  }

  const qualification = snapshot.idempotency;
  if (!qualification) {
    reasons.push("MISSING_IDEMPOTENCY_QUALIFICATION");
  } else {
    if (qualification.authorityRef !== retry.authorityRef) reasons.push("IDEMPOTENCY_AUTHORITY_MISMATCH");
    if (qualification.scopeRef !== retry.scopeRef) reasons.push("IDEMPOTENCY_SCOPE_MISMATCH");
    if (qualification.payloadFingerprint !== retry.payloadFingerprint) reasons.push("IDEMPOTENCY_PAYLOAD_MISMATCH");
    if (Date.parse(retry.evaluatedAt) > Date.parse(qualification.validUntil)) reasons.push("IDEMPOTENCY_HORIZON_EXPIRED");
  }

  if (effectApplied) reasons.push("EFFECT_ALREADY_APPLIED");

  const blocking = reasons.filter((reason) => reason !== "PROVIDER_ACK_IS_NOT_BUSINESS_EFFECT");
  return {
    valid: blocking.length === 0,
    retryAllowed: blocking.length === 0,
    effectApplied,
    reasons: [...new Set(reasons)],
  };
}
