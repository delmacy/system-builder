import { assessFiniteFlow, type DrainageAssumptions, type FiniteFlowPopulationIdentity } from "../finite-flow/finite-flow.js";
import type { DeliveryAttemptEvidence } from "./messaging-delivery-effect.js";
import type { EventOccurrenceIdentity, MessagingCurrentness, MessagingEvidenceCompleteness } from "./messaging-identity.js";

export const MESSAGING_ORDERING_REPLAY_CONTRACT_VERSION = "1.0.0" as const;

export type OrderingPosition = "BEFORE" | "SAME" | "AFTER" | "UNKNOWN";
export type BatchItemState = "SUCCEEDED" | "FAILED" | "PARTIAL" | "UNKNOWN";
export type BatchAggregateState = "SUCCEEDED" | "FAILED" | "PARTIAL" | "UNKNOWN";

export type OrderingEvidence = Readonly<{
  scopeRef: string;
  partitionRef: string;
  epochRef: string;
  sequence: number;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type ReplayEvidence = Readonly<{
  replayRef: string;
  occurrenceRef: string;
  lineageRootOccurrenceRef: string;
  producingRevisionRef: string;
  replayMessageRef: string;
  priorDeliveryRefs: readonly string[];
  requestedAt: string;
  validUntil: string;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type DlqMovementEvidence = Readonly<{
  movementRef: string;
  occurrenceRef: string;
  messageRef: string;
  providerAckRef: string | null;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type BatchItemEvidence = Readonly<{
  itemRef: string;
  occurrenceRef: string;
  state: BatchItemState;
}>;

export type ResidualReplayCohort = Readonly<{
  cohortRef: string;
  populationRef: string;
  scopeRef: string;
  items: number;
  knowledge: "KNOWN" | "PARTIAL" | "UNKNOWN";
  telemetryComplete: boolean;
  observedAt: string;
}>;

export type MessagingRecoveryAssessment = Readonly<{
  valid: boolean;
  drainable: boolean;
  residualItemsUpperBound: number | null;
  reasons: readonly string[];
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

const currentKnownAt = (
  completeness: MessagingEvidenceCompleteness,
  currentness: MessagingCurrentness,
  evaluatedAt: string,
): boolean => {
  const evaluated = parseTime(evaluatedAt, "evaluatedAt");
  return completeness === "KNOWN"
    && currentness.state === "CURRENT"
    && evaluated >= parseTime(currentness.assessedAt, "assessedAt")
    && evaluated <= parseTime(currentness.validUntil, "validUntil");
};

export function compareOrderingEvidence(
  left: OrderingEvidence,
  right: OrderingEvidence,
  evaluatedAt: string,
): OrderingPosition {
  if (!currentKnownAt(left.completeness, left.currentness, evaluatedAt)) return "UNKNOWN";
  if (!currentKnownAt(right.completeness, right.currentness, evaluatedAt)) return "UNKNOWN";
  if (left.scopeRef !== right.scopeRef || left.partitionRef !== right.partitionRef || left.epochRef !== right.epochRef) return "UNKNOWN";
  if (!Number.isSafeInteger(left.sequence) || left.sequence < 0 || !Number.isSafeInteger(right.sequence) || right.sequence < 0) return "UNKNOWN";
  if (left.sequence === right.sequence) return "SAME";
  return left.sequence < right.sequence ? "BEFORE" : "AFTER";
}

export function orderingEvidenceProvesGlobalOrder(left: OrderingEvidence, right: OrderingEvidence): false {
  void left;
  void right;
  return false;
}

export function replayPreservesCanonicalLineage(
  occurrence: EventOccurrenceIdentity,
  replay: ReplayEvidence,
  priorDeliveries: readonly DeliveryAttemptEvidence[],
  evaluatedAt: string,
): boolean {
  if (!currentKnownAt(replay.completeness, replay.currentness, evaluatedAt)) return false;
  if (parseTime(replay.requestedAt, "requestedAt") > parseTime(replay.validUntil, "validUntil")) return false;
  if (parseTime(evaluatedAt, "evaluatedAt") > parseTime(replay.validUntil, "validUntil")) return false;
  if (replay.occurrenceRef !== occurrence.occurrenceRef) return false;
  if (replay.lineageRootOccurrenceRef !== occurrence.lineageRootOccurrenceRef) return false;
  if (replay.producingRevisionRef !== occurrence.producingRevisionRef) return false;
  if (replay.replayMessageRef.trim().length === 0) return false;
  const expectedRefs = new Set(priorDeliveries.filter((delivery) => delivery.occurrenceRef === occurrence.occurrenceRef).map((delivery) => delivery.deliveryRef));
  return replay.priorDeliveryRefs.length === expectedRefs.size
    && replay.priorDeliveryRefs.every((deliveryRef) => expectedRefs.has(deliveryRef));
}

export function dlqMovementProvesResolution(evidence: DlqMovementEvidence): false {
  void evidence;
  return false;
}

export function deriveBatchAggregate(items: readonly BatchItemEvidence[]): BatchAggregateState {
  if (items.length === 0) return "UNKNOWN";
  if (items.some((item) => item.state === "UNKNOWN")) return "UNKNOWN";
  if (items.some((item) => item.state === "PARTIAL")) return "PARTIAL";
  const states = new Set(items.map((item) => item.state));
  if (states.size > 1) return "PARTIAL";
  return items[0]?.state === "SUCCEEDED" ? "SUCCEEDED" : "FAILED";
}

export function assessMessagingRecovery(
  identity: FiniteFlowPopulationIdentity,
  assumptions: DrainageAssumptions,
  residualCohorts: readonly ResidualReplayCohort[],
): MessagingRecoveryAssessment {
  const reasons: string[] = [];
  if (residualCohorts.length === 0) reasons.push("RESIDUAL_COHORTS_NOT_RECONCILED");

  let knownResidualItems = 0;
  for (const cohort of residualCohorts) {
    if (!cohort.cohortRef.trim()) reasons.push("RESIDUAL_COHORT_IDENTITY_INCOMPLETE");
    if (cohort.populationRef !== identity.populationRef || cohort.scopeRef !== identity.scopeRef) reasons.push("RESIDUAL_COHORT_POPULATION_OR_SCOPE_MISMATCH");
    if (!Number.isSafeInteger(cohort.items) || cohort.items < 0) reasons.push("RESIDUAL_COHORT_ITEMS_INVALID");
    if (cohort.knowledge !== "KNOWN") reasons.push("RESIDUAL_COHORT_NOT_KNOWN");
    if (!cohort.telemetryComplete) reasons.push("RESIDUAL_COHORT_TELEMETRY_INCOMPLETE");
    if (!Number.isFinite(Date.parse(cohort.observedAt))) reasons.push("RESIDUAL_COHORT_TIME_INVALID");
    if (cohort.knowledge === "KNOWN" && cohort.telemetryComplete && Number.isSafeInteger(cohort.items) && cohort.items >= 0) knownResidualItems += cohort.items;
  }

  if (residualCohorts.length > 0 && reasons.length === 0 && assumptions.backlog.items !== knownResidualItems) {
    reasons.push("RESIDUAL_COHORT_BACKLOG_MISMATCH");
  }

  const finiteFlow = assessFiniteFlow(identity, assumptions);
  reasons.push(...finiteFlow.reasons);
  const uniqueReasons = [...new Set(reasons)];
  return Object.freeze({
    valid: uniqueReasons.length === 0 && finiteFlow.valid,
    drainable: uniqueReasons.length === 0 && finiteFlow.drainable,
    residualItemsUpperBound: uniqueReasons.length === 0 ? finiteFlow.residualItemsUpperBound : null,
    reasons: uniqueReasons,
  });
}
