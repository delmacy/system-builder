import type { ProducingRevisionRef } from "./durable-execution";

export type EffectKnowledge = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type EffectObservation = "CONFIRMED" | "ABSENT" | "UNKNOWN";
export type TransportAck = "ACKNOWLEDGED" | "REJECTED" | "UNKNOWN";

export interface ExternalEffectIdentity {
  executionRef: string;
  effectRef: string;
  producingRevision: ProducingRevisionRef;
}

export interface EffectAttemptEvidence {
  attemptRef: string;
  deliveryRef: string;
  effectRef: string;
  producingRevision: ProducingRevisionRef;
  transportAck: TransportAck;
  observation: EffectObservation;
  knowledge: EffectKnowledge;
  authorityRef: string;
  currentnessRef: string;
}

export interface IdempotencyQualification {
  keyRef: string;
  authorityRef: string;
  scopeRef: string;
  payloadDigest: string;
  validUntilEpochMs: number;
}

export interface RetryCandidate {
  effectRef: string;
  producingRevision: ProducingRevisionRef;
  authorityRef: string;
  scopeRef: string;
  payloadDigest: string;
  nowEpochMs: number;
  expectedCurrentnessRef: string;
}

export interface ExternalEffectAssessment {
  effectConfirmed: boolean;
  retryAuthorized: boolean;
  reconcileRequired: boolean;
  reasons: readonly string[];
}

const sameRevision = (left: ProducingRevisionRef, right: ProducingRevisionRef) =>
  left.definitionRef === right.definitionRef &&
  left.revisionRef === right.revisionRef &&
  left.contractVersion === right.contractVersion;

export function assessExternalEffectRetry(
  identity: ExternalEffectIdentity,
  attempt: EffectAttemptEvidence,
  idempotency: IdempotencyQualification,
  candidate: RetryCandidate,
): ExternalEffectAssessment {
  const reasons: string[] = [];

  if (attempt.attemptRef === identity.effectRef || attempt.deliveryRef === identity.effectRef) {
    reasons.push("ATTEMPT_OR_DELIVERY_ID_CANNOT_BE_EFFECT_ID");
  }
  if (attempt.effectRef !== identity.effectRef || candidate.effectRef !== identity.effectRef) {
    reasons.push("EFFECT_IDENTITY_MISMATCH");
  }
  if (!sameRevision(attempt.producingRevision, identity.producingRevision) ||
      !sameRevision(candidate.producingRevision, identity.producingRevision)) {
    reasons.push("PRODUCING_REVISION_MISMATCH");
  }

  const authoritativeCurrentEvidence =
    attempt.knowledge === "KNOWN" &&
    attempt.authorityRef === candidate.authorityRef &&
    attempt.currentnessRef === candidate.expectedCurrentnessRef &&
    sameRevision(attempt.producingRevision, candidate.producingRevision);

  const effectConfirmed = authoritativeCurrentEvidence && attempt.observation === "CONFIRMED";
  const reconcileRequired =
    attempt.observation === "UNKNOWN" ||
    attempt.knowledge !== "KNOWN" ||
    !authoritativeCurrentEvidence;

  if (attempt.transportAck === "ACKNOWLEDGED" && attempt.observation !== "CONFIRMED") {
    reasons.push("ACK_IS_NOT_BUSINESS_EFFECT");
  }
  if (reconcileRequired) reasons.push("RECONCILE_BEFORE_RETRY");

  const idempotencyQualified =
    idempotency.authorityRef === candidate.authorityRef &&
    idempotency.scopeRef === candidate.scopeRef &&
    idempotency.payloadDigest === candidate.payloadDigest &&
    candidate.nowEpochMs <= idempotency.validUntilEpochMs;

  if (idempotency.authorityRef !== candidate.authorityRef) reasons.push("IDEMPOTENCY_AUTHORITY_MISMATCH");
  if (idempotency.scopeRef !== candidate.scopeRef) reasons.push("IDEMPOTENCY_SCOPE_MISMATCH");
  if (idempotency.payloadDigest !== candidate.payloadDigest) reasons.push("IDEMPOTENCY_PAYLOAD_MISMATCH");
  if (candidate.nowEpochMs > idempotency.validUntilEpochMs) reasons.push("IDEMPOTENCY_HORIZON_EXPIRED");

  const retryAuthorized =
    !effectConfirmed &&
    !reconcileRequired &&
    attempt.observation === "ABSENT" &&
    idempotencyQualified &&
    reasons.every((reason) => !reason.endsWith("MISMATCH") && reason !== "IDEMPOTENCY_HORIZON_EXPIRED");

  return {
    effectConfirmed,
    retryAuthorized,
    reconcileRequired,
    reasons: [...new Set(reasons)],
  };
}
