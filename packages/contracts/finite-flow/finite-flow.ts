import {
  assertCompatibleDimensions,
  type UnitReference,
} from "../mathematical-semantics/index.js";

export type FiniteFlowKnowledge = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type AdmissionState = "OPEN" | "BACKPRESSURE" | "CLOSED";

export interface FiniteFlowPopulationIdentity {
  queueRef: string;
  populationRef: string;
  scopeRef: string;
}

export interface QualifiedRateEvidence {
  value: number;
  unit: UnitReference;
  populationRef: string;
  scopeRef: string;
  windowMs: number;
  knowledge: FiniteFlowKnowledge;
}

export interface BacklogEvidence {
  populationRef: string;
  scopeRef: string;
  items: number;
  knowledge: FiniteFlowKnowledge;
  telemetryComplete: boolean;
}

export interface ReplayBound {
  requestedItems: number;
  maximumReplayItems: number;
  deduplicationBoundItems: number;
}

export interface DrainageAssumptions {
  horizonMs: number;
  arrival: QualifiedRateEvidence;
  service: QualifiedRateEvidence;
  backlog: BacklogEvidence;
  replay: ReplayBound;
}

export interface FiniteFlowAssessment {
  valid: boolean;
  admission: AdmissionState;
  drainable: boolean;
  residualItemsUpperBound: number | null;
  reasons: readonly string[];
}

const positiveFinite = (value: number): boolean => Number.isFinite(value) && value > 0;
const nonNegativeInteger = (value: number): boolean => Number.isInteger(value) && value >= 0;

function samePopulation(identity: FiniteFlowPopulationIdentity, evidence: { populationRef: string; scopeRef: string }): boolean {
  return identity.populationRef === evidence.populationRef && identity.scopeRef === evidence.scopeRef;
}

function knownUnit(unit: UnitReference): boolean {
  return unit.state === "KNOWN";
}

export function assessFiniteFlow(
  identity: FiniteFlowPopulationIdentity,
  assumptions: DrainageAssumptions,
): FiniteFlowAssessment {
  const reasons: string[] = [];
  const { arrival, service, backlog, replay } = assumptions;
  const identityComplete = Boolean(identity.queueRef.trim() && identity.populationRef.trim() && identity.scopeRef.trim());

  if (!identityComplete) {
    reasons.push("POPULATION_IDENTITY_INCOMPLETE");
  }

  for (const [label, rate] of [["ARRIVAL", arrival], ["SERVICE", service]] as const) {
    if (!positiveFinite(rate.value)) reasons.push(`${label}_RATE_MUST_BE_POSITIVE`);
    if (!positiveFinite(rate.windowMs)) reasons.push(`${label}_WINDOW_MUST_BE_POSITIVE`);
    if (!samePopulation(identity, rate)) reasons.push(`${label}_POPULATION_OR_SCOPE_MISMATCH`);
    if (rate.knowledge !== "KNOWN") reasons.push(`${label}_CAPACITY_NOT_KNOWN`);
    if (!knownUnit(rate.unit)) reasons.push(`${label}_UNIT_NOT_KNOWN`);
  }

  let unitsCompatible = true;
  if (knownUnit(arrival.unit) && knownUnit(service.unit)) {
    try {
      assertCompatibleDimensions(arrival.unit, service.unit);
    } catch {
      unitsCompatible = false;
      reasons.push("RATE_UNITS_INCOMPATIBLE");
    }
  }

  if (arrival.windowMs !== service.windowMs) reasons.push("RATE_WINDOWS_NOT_COMPARABLE");
  if (!samePopulation(identity, backlog)) reasons.push("BACKLOG_POPULATION_OR_SCOPE_MISMATCH");
  if (!nonNegativeInteger(backlog.items)) reasons.push("BACKLOG_MUST_BE_NON_NEGATIVE_INTEGER");
  if (backlog.knowledge !== "KNOWN") reasons.push("BACKLOG_NOT_KNOWN");
  if (!backlog.telemetryComplete) reasons.push("BACKLOG_TELEMETRY_INCOMPLETE");
  if (!positiveFinite(assumptions.horizonMs)) reasons.push("DRAINAGE_HORIZON_MUST_BE_POSITIVE");

  const replayIntegers = nonNegativeInteger(replay.requestedItems)
    && nonNegativeInteger(replay.maximumReplayItems)
    && nonNegativeInteger(replay.deduplicationBoundItems);
  if (!replayIntegers) {
    reasons.push("REPLAY_BOUNDS_MUST_BE_NON_NEGATIVE_INTEGERS");
  }
  if (replay.requestedItems > replay.maximumReplayItems) reasons.push("REPLAY_EXCEEDS_DECLARED_MAXIMUM");
  if (replay.maximumReplayItems > replay.deduplicationBoundItems) reasons.push("REPLAY_EXCEEDS_DEDUPLICATION_BOUND");

  const knowledgeResolved = arrival.knowledge === "KNOWN" && service.knowledge === "KNOWN" && backlog.knowledge === "KNOWN" && backlog.telemetryComplete;
  const rateShapeValid = positiveFinite(arrival.value) && positiveFinite(service.value) && positiveFinite(arrival.windowMs) && positiveFinite(service.windowMs);
  const backlogShapeValid = nonNegativeInteger(backlog.items);
  const comparable = knownUnit(arrival.unit) && knownUnit(service.unit) && unitsCompatible && arrival.windowMs === service.windowMs && samePopulation(identity, arrival) && samePopulation(identity, service) && samePopulation(identity, backlog);
  const replayBounded = replayIntegers && replay.requestedItems <= replay.maximumReplayItems && replay.maximumReplayItems <= replay.deduplicationBoundItems;
  const admissionEvidenceValid = identityComplete && knowledgeResolved && rateShapeValid && backlogShapeValid && comparable && replayBounded;

  let residualItemsUpperBound: number | null = null;
  let drainable = false;
  if (admissionEvidenceValid && positiveFinite(assumptions.horizonMs) && reasons.length === 0) {
    const netServicePerWindow = service.value - arrival.value;
    if (netServicePerWindow <= 0) {
      reasons.push("SERVICE_DOES_NOT_EXCEED_ARRIVAL");
    } else {
      const effectiveBacklog = backlog.items + replay.requestedItems;
      const drainCapacity = netServicePerWindow * (assumptions.horizonMs / service.windowMs);
      residualItemsUpperBound = Math.max(0, Math.ceil(effectiveBacklog - drainCapacity));
      drainable = residualItemsUpperBound === 0;
      if (!drainable) reasons.push("DECLARED_HORIZON_DOES_NOT_DRAIN_POPULATION");
    }
  }

  const admission: AdmissionState = !admissionEvidenceValid
    ? "CLOSED"
    : service.value <= arrival.value || backlog.items > 0 || replay.requestedItems > 0
      ? "BACKPRESSURE"
      : "OPEN";

  return {
    valid: reasons.length === 0,
    admission,
    drainable,
    residualItemsUpperBound,
    reasons: [...new Set(reasons)],
  };
}
