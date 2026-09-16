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

export type TelemetrySignal = Readonly<{
  kind: "signal";
  signalId: string;
  name: string;
  evidence: ObservabilityEvidence;
}>;

export type EvaluatedCondition = Readonly<{
  kind: "condition";
  conditionId: string;
  signalId: string;
  evaluatorRevision: string;
  outcome: "TRUE" | "FALSE" | "UNKNOWN";
  evidence: ObservabilityEvidence;
}>;

export type ObservabilityAlert = Readonly<{
  kind: "alert";
  alertId: string;
  conditionId: string;
  policyRevision: string;
  evidence: ObservabilityEvidence;
}>;

export type ObservabilityIncident = Readonly<{
  kind: "incident";
  incidentId: string;
  alertIds: readonly string[];
  authorityRef: string;
  confirmedAt: string;
}>;

export type ObservabilityIdentity = TelemetrySignal | EvaluatedCondition | ObservabilityAlert | ObservabilityIncident;

export function canPromoteConditionToAlert(condition: EvaluatedCondition): boolean {
  return condition.outcome === "TRUE" && condition.evidence.currentness === "CURRENT" && condition.evidence.evidenceState === "KNOWN";
}

export function requireReconciliationBeforeRetry(evidence: ObservabilityEvidence): boolean {
  return evidence.currentness !== "CURRENT" || evidence.evidenceState !== "KNOWN";
}

export function assertIncidentAuthority(incident: ObservabilityIncident): void {
  if (incident.alertIds.length === 0) throw new TypeError("incident requires at least one alert reference");
  if (!incident.authorityRef.trim()) throw new TypeError("incident requires explicit authorityRef");
  if (!incident.confirmedAt.trim()) throw new TypeError("incident requires explicit confirmedAt");
}
