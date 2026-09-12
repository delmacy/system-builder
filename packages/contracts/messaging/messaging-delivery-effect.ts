import type { MessagingCurrentness, MessagingEvidenceCompleteness } from "./messaging-identity.js";

export const MESSAGING_DELIVERY_EFFECT_CONTRACT_VERSION = "1.0.0" as const;

export type DeliveryAttemptOutcome = "ACKNOWLEDGED" | "REJECTED" | "TIMEOUT" | "UNKNOWN";
export type BusinessEffectState = "NOT_OBSERVED" | "OBSERVED" | "UNKNOWN";
export type RetryDisposition = "SAFE_RETRY" | "RECONCILE_BEFORE_RETRY" | "DO_NOT_RETRY";

export type DeliveryAttemptEvidence = Readonly<{
  deliveryRef: string;
  attemptRef: string;
  messageRef: string;
  occurrenceRef: string;
  subscriptionRef: string;
  providerRef: string;
  providerQualificationRef: string;
  providerCurrentness: MessagingCurrentness;
  attemptOutcome: DeliveryAttemptOutcome;
  providerAckRef: string | null;
  completeness: MessagingEvidenceCompleteness;
}>;

export type BusinessEffectEvidence = Readonly<{
  effectRef: string;
  occurrenceRef: string;
  authorityRef: string;
  authorityRevisionRef: string;
  scopeRef: string;
  payloadFingerprint: string;
  idempotencyRef: string | null;
  idempotencyScopeRef: string | null;
  idempotencyValidUntil: string | null;
  state: BusinessEffectState;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type MessagingDeliveryEffectEnvelope = Readonly<{
  contractVersion: typeof MESSAGING_DELIVERY_EFFECT_CONTRACT_VERSION;
  delivery: DeliveryAttemptEvidence;
  effect: BusinessEffectEvidence;
}>;

const nonEmpty = (value: string, label: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};

const parseTime = (value: string, label: string): number => {
  const parsed = Date.parse(nonEmpty(value, label));
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be an ISO timestamp`);
  return parsed;
};

export function providerEvidenceIsCurrent(delivery: DeliveryAttemptEvidence, evaluatedAt: string): boolean {
  const evaluated = parseTime(evaluatedAt, "evaluatedAt");
  return delivery.completeness === "KNOWN"
    && delivery.providerCurrentness.state === "CURRENT"
    && evaluated >= parseTime(delivery.providerCurrentness.assessedAt, "assessedAt")
    && evaluated <= parseTime(delivery.providerCurrentness.validUntil, "validUntil");
}

export function businessEffectEvidenceIsAuthoritative(effect: BusinessEffectEvidence, evaluatedAt: string): boolean {
  const evaluated = parseTime(evaluatedAt, "evaluatedAt");
  const idempotencyComplete = effect.idempotencyRef === null
    ? effect.idempotencyScopeRef === null && effect.idempotencyValidUntil === null
    : effect.idempotencyScopeRef !== null
      && effect.idempotencyValidUntil !== null
      && evaluated <= parseTime(effect.idempotencyValidUntil, "idempotencyValidUntil");
  return effect.completeness === "KNOWN"
    && effect.currentness.state === "CURRENT"
    && evaluated >= parseTime(effect.currentness.assessedAt, "assessedAt")
    && evaluated <= parseTime(effect.currentness.validUntil, "validUntil")
    && nonEmpty(effect.authorityRef, "authorityRef").length > 0
    && nonEmpty(effect.authorityRevisionRef, "authorityRevisionRef").length > 0
    && nonEmpty(effect.scopeRef, "scopeRef").length > 0
    && nonEmpty(effect.payloadFingerprint, "payloadFingerprint").length > 0
    && idempotencyComplete;
}

export function providerAckProvesBusinessEffect(delivery: DeliveryAttemptEvidence): false {
  void delivery;
  return false;
}

export function retryDisposition(
  delivery: DeliveryAttemptEvidence,
  effect: BusinessEffectEvidence,
  evaluatedAt: string,
): RetryDisposition {
  if (delivery.occurrenceRef !== effect.occurrenceRef) throw new Error("delivery and effect must reference the same canonical occurrence");
  const authoritativeEffect = businessEffectEvidenceIsAuthoritative(effect, evaluatedAt);
  if (authoritativeEffect && effect.state === "OBSERVED") return "DO_NOT_RETRY";
  if (
    delivery.attemptOutcome === "REJECTED"
    && providerEvidenceIsCurrent(delivery, evaluatedAt)
    && authoritativeEffect
    && effect.state === "NOT_OBSERVED"
  ) return "SAFE_RETRY";
  if (delivery.attemptOutcome === "TIMEOUT" || delivery.attemptOutcome === "UNKNOWN" || effect.state === "UNKNOWN") return "RECONCILE_BEFORE_RETRY";
  if (delivery.attemptOutcome === "ACKNOWLEDGED" && effect.state !== "OBSERVED") return "RECONCILE_BEFORE_RETRY";
  return "RECONCILE_BEFORE_RETRY";
}

export function sameBusinessOccurrence(left: DeliveryAttemptEvidence, right: DeliveryAttemptEvidence): boolean {
  return left.occurrenceRef === right.occurrenceRef && left.messageRef === right.messageRef;
}
