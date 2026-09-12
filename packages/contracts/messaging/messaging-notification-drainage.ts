import { assessFiniteFlow, type DrainageAssumptions, type FiniteFlowPopulationIdentity } from "../finite-flow/finite-flow.js";
import type { MessagingCurrentness, MessagingEvidenceCompleteness } from "./messaging-identity.js";

export const MESSAGING_NOTIFICATION_DRAINAGE_CONTRACT_VERSION = "1.0.0" as const;

export type NotificationEffectState = "OBSERVED" | "NOT_OBSERVED" | "UNKNOWN";
export type ResidualMessagingKind = "SUBSCRIPTION" | "MESSAGE" | "CALLBACK";

export type NotificationIntentEvidence = Readonly<{
  intentRef: string;
  occurrenceRef: string;
  producingRevisionRef: string;
  recipientRef: string;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type NotificationDeliveryEvidence = Readonly<{
  deliveryRef: string;
  intentRef: string;
  providerRef: string;
  providerAckRef: string | null;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type NotificationEffectEvidence = Readonly<{
  effectRef: string;
  intentRef: string;
  effectState: NotificationEffectState;
  authoritative: boolean;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type OfflineBufferedCohort = Readonly<{
  cohortRef: string;
  populationRef: string;
  scopeRef: string;
  occurrenceRef: string;
  producingRevisionRef: string;
  items: number;
  knowledge: "KNOWN" | "PARTIAL" | "UNKNOWN";
  telemetryComplete: boolean;
  observedAt: string;
  currentness: MessagingCurrentness;
}>;

export type ResidualMessagingCohort = Readonly<{
  cohortRef: string;
  kind: ResidualMessagingKind;
  populationRef: string;
  scopeRef: string;
  items: number;
  knowledge: "KNOWN" | "PARTIAL" | "UNKNOWN";
  telemetryComplete: boolean;
  observedAt: string;
  currentness: MessagingCurrentness;
}>;

export type NotificationDrainageAssessment = Readonly<{
  valid: boolean;
  drainable: boolean;
  residualItemsUpperBound: number | null;
  reasons: readonly string[];
}>;

const nonEmpty = (value: string): boolean => typeof value === "string" && value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentKnown(
  completeness: MessagingEvidenceCompleteness,
  currentness: MessagingCurrentness,
  evaluatedAt: string,
): boolean {
  if (completeness !== "KNOWN" || currentness.state !== "CURRENT") return false;
  const evaluated = Date.parse(evaluatedAt);
  const assessed = Date.parse(currentness.assessedAt);
  const validUntil = Date.parse(currentness.validUntil);
  return Number.isFinite(evaluated) && Number.isFinite(assessed) && Number.isFinite(validUntil)
    && evaluated >= assessed && evaluated <= validUntil;
}

export function providerDeliveryProvesNotificationEffect(
  delivery: NotificationDeliveryEvidence,
  effect: NotificationEffectEvidence,
): false {
  void delivery;
  void effect;
  return false;
}

export function notificationEffectIsAuthoritative(
  effect: NotificationEffectEvidence,
  evaluatedAt: string,
): boolean {
  return effect.authoritative
    && effect.effectState !== "UNKNOWN"
    && currentKnown(effect.completeness, effect.currentness, evaluatedAt);
}

export function offlineBufferPreservesLineage(
  intent: NotificationIntentEvidence,
  cohort: OfflineBufferedCohort,
  evaluatedAt: string,
): boolean {
  return nonEmpty(cohort.cohortRef)
    && cohort.occurrenceRef === intent.occurrenceRef
    && cohort.producingRevisionRef === intent.producingRevisionRef
    && cohort.knowledge === "KNOWN"
    && cohort.telemetryComplete
    && Number.isSafeInteger(cohort.items)
    && cohort.items >= 0
    && validTime(cohort.observedAt)
    && currentKnown(intent.completeness, intent.currentness, evaluatedAt)
    && currentKnown("KNOWN", cohort.currentness, evaluatedAt);
}

export function assessNotificationDrainage(
  identity: FiniteFlowPopulationIdentity,
  assumptions: DrainageAssumptions,
  residualCohorts: readonly ResidualMessagingCohort[],
  evaluatedAt: string,
): NotificationDrainageAssessment {
  const reasons: string[] = [];
  if (!validTime(evaluatedAt)) reasons.push("EVALUATION_TIME_INVALID");
  if (residualCohorts.length === 0) reasons.push("RESIDUAL_COHORTS_NOT_RECONCILED");

  let knownResidualItems = 0;
  for (const cohort of residualCohorts) {
    if (!nonEmpty(cohort.cohortRef)) reasons.push("RESIDUAL_COHORT_IDENTITY_INCOMPLETE");
    if (cohort.populationRef !== identity.populationRef || cohort.scopeRef !== identity.scopeRef) {
      reasons.push("RESIDUAL_COHORT_POPULATION_OR_SCOPE_MISMATCH");
    }
    if (!Number.isSafeInteger(cohort.items) || cohort.items < 0) reasons.push("RESIDUAL_COHORT_ITEMS_INVALID");
    if (cohort.knowledge !== "KNOWN") reasons.push("RESIDUAL_COHORT_NOT_KNOWN");
    if (!cohort.telemetryComplete) reasons.push("RESIDUAL_COHORT_TELEMETRY_INCOMPLETE");
    if (!validTime(cohort.observedAt)) reasons.push("RESIDUAL_COHORT_TIME_INVALID");
    if (!currentKnown("KNOWN", cohort.currentness, evaluatedAt)) reasons.push("RESIDUAL_COHORT_NOT_CURRENT");
    if (cohort.knowledge === "KNOWN" && cohort.telemetryComplete && Number.isSafeInteger(cohort.items) && cohort.items >= 0) {
      knownResidualItems += cohort.items;
    }
  }

  if (residualCohorts.length > 0 && reasons.length === 0 && assumptions.backlog.items !== knownResidualItems) {
    reasons.push("RESIDUAL_COHORT_BACKLOG_MISMATCH");
  }

  const finiteFlow = assessFiniteFlow(identity, assumptions);
  reasons.push(...finiteFlow.reasons);
  const uniqueReasons = [...new Set(reasons)];
  const evidenceQualified = uniqueReasons.length === 0 && finiteFlow.valid;

  return Object.freeze({
    valid: evidenceQualified,
    drainable: evidenceQualified && finiteFlow.drainable,
    residualItemsUpperBound: evidenceQualified ? finiteFlow.residualItemsUpperBound : null,
    reasons: uniqueReasons,
  });
}
