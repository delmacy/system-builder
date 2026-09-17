export type ObservabilityLocality = "LOCAL" | "STATION" | "FLEET";
export type EvidenceCurrentness = "CURRENT" | "STALE" | "UNKNOWN";
export type ObservabilityEvidenceState = "KNOWN" | "PARTIAL" | "UNKNOWN";

export type ObservabilitySource = Readonly<{
  sourceId: string;
  producerId: string;
  producerRevision: string;
  locality: ObservabilityLocality;
  populationRef: string;
}>;

export type ObservabilityEvidence = Readonly<{
  source: ObservabilitySource;
  observedAt: string;
  effectiveAt?: string;
  currentness: EvidenceCurrentness;
  evidenceState: ObservabilityEvidenceState;
}>;

export type TelemetrySignal = Readonly<{ kind: "signal"; signalId: string; name: string; evidence: ObservabilityEvidence }>;
export type EvaluatedCondition = Readonly<{ kind: "condition"; conditionId: string; signalId: string; evaluatorRevision: string; outcome: "TRUE" | "FALSE" | "UNKNOWN"; evidence: ObservabilityEvidence }>;
export type ObservabilityAlert = Readonly<{ kind: "alert"; alertId: string; conditionId: string; policyRevision: string; evidence: ObservabilityEvidence }>;
export type ObservabilityIncident = Readonly<{ kind: "incident"; incidentId: string; alertIds: readonly string[]; authorityRef: string; confirmedAt: string }>;
export type ObservabilityIdentity = TelemetrySignal | EvaluatedCondition | ObservabilityAlert | ObservabilityIncident;

export type ServiceLevelIndicatorDefinition = Readonly<{ sliId: string; revision: string; name: string; unit: string; populationRef: string; locality: ObservabilityLocality }>;
export type ServiceLevelObjectiveTarget = Readonly<{ sloId: string; revision: string; sliId: string; sliRevision: string; target: number; window: string }>;
export type TelemetryGapReason = "LOSS" | "BACKPRESSURE" | "MISSING_POPULATION" | "UNKNOWN";
export type TelemetryGap = Readonly<{ gapId: string; populationRef: string; locality: ObservabilityLocality; reason: TelemetryGapReason; observedAt: string; currentness: EvidenceCurrentness }>;
export type SliObservation = Readonly<{ observationId: string; sliId: string; sliRevision: string; value?: number; evidence: ObservabilityEvidence; gaps: readonly TelemetryGap[] }>;
export type PopulationCoverage = Readonly<{ populationRef: string; locality: ObservabilityLocality; currentness: EvidenceCurrentness; evidenceState: ObservabilityEvidenceState }>;
export type ReconciliationDisposition = "CONVERGED" | "DIVERGED" | "UNKNOWN";
export type ReconciliationJob = Readonly<{ jobId: string; reconcilerId: string; reconcilerRevision: string; locality: ObservabilityLocality; intendedPopulationRefs: readonly string[]; sourceRevision: string }>;
export type ReconciliationEvidence = Readonly<{ jobId: string; reconcilerRevision: string; locality: ObservabilityLocality; sourceRevision: string; effectRevision?: string; intendedPopulationRefs: readonly string[]; attemptedPopulationRefs: readonly string[]; observedPopulationRefs: readonly string[]; observedAt: string; currentness: EvidenceCurrentness; evidenceState: ObservabilityEvidenceState; disposition: ReconciliationDisposition }>;

export type OperatorRequestAcknowledgement = Readonly<{ requestId: string; authorityRef: string; ownerId: string; requestedRevision: string; locality: ObservabilityLocality; populationRef: string; acknowledgedAt: string }>;
export type OperatorEffectEvidence = Readonly<{ requestId: string; authorityRef: string; ownerId: string; requestedRevision: string; effectRevision?: string | undefined; locality: ObservabilityLocality; populationRef: string; evidence: ObservabilityEvidence; disposition: ReconciliationDisposition }>;

export type OperatorProjectionOrigin = "AUTHORITATIVE_SOURCE" | "AI_INFERENCE" | "PRESENTATION_DERIVATION";
export type OperatorAuthorityProjection = Readonly<{
  projectionId: string;
  authorityRef: string;
  ownerId: string;
  sourceId: string;
  sourceRevision: string;
  locality: ObservabilityLocality;
  populationRef: string;
  currentness: EvidenceCurrentness;
  evidenceState: ObservabilityEvidenceState;
  origin: OperatorProjectionOrigin;
}>;

export type OperatorReconnectReconciliation = Readonly<{
  requestId: string;
  authorityRef: string;
  ownerId: string;
  requestedRevision: string;
  locality: ObservabilityLocality;
  populationRef: string;
  sourceRevision: string;
  effectRevision?: string | undefined;
  currentness: EvidenceCurrentness;
  evidenceState: ObservabilityEvidenceState;
  disposition: ReconciliationDisposition;
}>;

export function projectOperatorAuthority(authorityRef: string, ownerId: string, evidence: ObservabilityEvidence, origin: OperatorProjectionOrigin = "AUTHORITATIVE_SOURCE"): OperatorAuthorityProjection {
  return { projectionId: `${evidence.source.sourceId}@${evidence.source.producerRevision}`, authorityRef, ownerId, sourceId: evidence.source.sourceId, sourceRevision: evidence.source.producerRevision, locality: evidence.source.locality, populationRef: evidence.source.populationRef, currentness: evidence.currentness, evidenceState: evidence.evidenceState, origin };
}

export function isOperatorProjectionAuthoritative(projection: OperatorAuthorityProjection): boolean {
  return projection.origin === "AUTHORITATIVE_SOURCE" && Boolean(projection.authorityRef.trim()) && Boolean(projection.ownerId.trim()) && projection.currentness === "CURRENT" && projection.evidenceState === "KNOWN";
}

export function canOperatorProjectionClaimConvergence(projection: OperatorAuthorityProjection, effect: OperatorEffectEvidence): boolean {
  if (!isOperatorProjectionAuthoritative(projection)) return false;
  if (projection.authorityRef !== effect.authorityRef || projection.ownerId !== effect.ownerId) return false;
  if (projection.locality !== effect.locality || projection.populationRef !== effect.populationRef) return false;
  if (projection.sourceId !== effect.evidence.source.sourceId || projection.sourceRevision !== effect.evidence.source.producerRevision) return false;
  if (projection.sourceRevision !== effect.requestedRevision) return false;
  return effect.disposition === "CONVERGED" && Boolean(effect.effectRevision) && !requireReconciliationBeforeRetry(effect.evidence);
}

export function canPromoteConditionToAlert(condition: EvaluatedCondition): boolean { return condition.outcome === "TRUE" && condition.evidence.currentness === "CURRENT" && condition.evidence.evidenceState === "KNOWN"; }
export function requireReconciliationBeforeRetry(evidence: ObservabilityEvidence): boolean { return evidence.currentness !== "CURRENT" || evidence.evidenceState !== "KNOWN"; }
export function isObservationComplete(observation: SliObservation): boolean { return observation.value !== undefined && observation.gaps.length === 0 && !requireReconciliationBeforeRetry(observation.evidence); }
export function canAggregatePopulationCoverage(coverage: readonly PopulationCoverage[]): boolean { return coverage.length > 0 && coverage.every((entry) => entry.currentness === "CURRENT" && entry.evidenceState === "KNOWN"); }
function hasExactPopulation(expected: readonly string[], actual: readonly string[]): boolean { if (expected.length === 0 || expected.length !== actual.length) return false; const expectedSet = new Set(expected); const actualSet = new Set(actual); return expectedSet.size === expected.length && actualSet.size === actual.length && expectedSet.size === actualSet.size && [...expectedSet].every((populationRef) => actualSet.has(populationRef)); }
export function isReconciliationPopulationComplete(job: ReconciliationJob, evidence: ReconciliationEvidence): boolean { if (job.jobId !== evidence.jobId || job.reconcilerRevision !== evidence.reconcilerRevision) return false; if (job.locality !== evidence.locality || job.sourceRevision !== evidence.sourceRevision) return false; if (evidence.currentness !== "CURRENT" || evidence.evidenceState !== "KNOWN") return false; return hasExactPopulation(job.intendedPopulationRefs, evidence.intendedPopulationRefs) && hasExactPopulation(job.intendedPopulationRefs, evidence.attemptedPopulationRefs) && hasExactPopulation(job.intendedPopulationRefs, evidence.observedPopulationRefs); }
export function canClaimReconciliationConvergence(job: ReconciliationJob, evidence: ReconciliationEvidence): boolean { return evidence.disposition === "CONVERGED" && Boolean(evidence.effectRevision) && isReconciliationPopulationComplete(job, evidence); }
export function requiresReconciliationBeforeDisposition(job: ReconciliationJob, evidence: ReconciliationEvidence): boolean { return evidence.disposition === "UNKNOWN" || !isReconciliationPopulationComplete(job, evidence); }
export function canClaimOperatorEffectConvergence(acknowledgement: OperatorRequestAcknowledgement, effect: OperatorEffectEvidence): boolean { if (acknowledgement.requestId !== effect.requestId || acknowledgement.authorityRef !== effect.authorityRef || acknowledgement.ownerId !== effect.ownerId) return false; if (acknowledgement.requestedRevision !== effect.requestedRevision || acknowledgement.locality !== effect.locality || acknowledgement.populationRef !== effect.populationRef) return false; if (effect.evidence.source.locality !== effect.locality || effect.evidence.source.populationRef !== effect.populationRef) return false; return effect.disposition === "CONVERGED" && Boolean(effect.effectRevision) && !requireReconciliationBeforeRetry(effect.evidence); }
export function requiresOperatorEffectReconciliation(effect: OperatorEffectEvidence): boolean { return effect.disposition === "UNKNOWN" || !effect.effectRevision || requireReconciliationBeforeRetry(effect.evidence); }

export function isOperatorReconnectReconciliationQualified(acknowledgement: OperatorRequestAcknowledgement, reconciliation: OperatorReconnectReconciliation): boolean {
  return acknowledgement.requestId === reconciliation.requestId && acknowledgement.authorityRef === reconciliation.authorityRef && acknowledgement.ownerId === reconciliation.ownerId && acknowledgement.requestedRevision === reconciliation.requestedRevision && acknowledgement.locality === reconciliation.locality && acknowledgement.populationRef === reconciliation.populationRef && reconciliation.sourceRevision === acknowledgement.requestedRevision && reconciliation.currentness === "CURRENT" && reconciliation.evidenceState === "KNOWN" && reconciliation.disposition !== "UNKNOWN";
}

export function canRetryOperatorRequestAfterReconnect(acknowledgement: OperatorRequestAcknowledgement, reconciliation: OperatorReconnectReconciliation): boolean {
  return isOperatorReconnectReconciliationQualified(acknowledgement, reconciliation) && reconciliation.disposition === "DIVERGED";
}

export function canClaimOperatorReconnectConvergence(acknowledgement: OperatorRequestAcknowledgement, reconciliation: OperatorReconnectReconciliation): boolean {
  return isOperatorReconnectReconciliationQualified(acknowledgement, reconciliation) && reconciliation.disposition === "CONVERGED" && Boolean(reconciliation.effectRevision);
}

export function assertSloTargetsSliRevision(slo: ServiceLevelObjectiveTarget, sli: ServiceLevelIndicatorDefinition): void { if (slo.sliId !== sli.sliId || slo.sliRevision !== sli.revision) throw new TypeError("SLO target must reference the exact SLI id and revision"); }
export function assertIncidentAuthority(incident: ObservabilityIncident): void { if (incident.alertIds.length === 0) throw new TypeError("incident requires at least one alert reference"); if (!incident.authorityRef.trim()) throw new TypeError("incident requires explicit authorityRef"); if (!incident.confirmedAt.trim()) throw new TypeError("incident requires explicit confirmedAt"); }
