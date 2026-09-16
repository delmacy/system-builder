import assert from "node:assert/strict";
import test from "node:test";
import {
  assertIncidentAuthority,
  assertSloTargetsSliRevision,
  canAggregatePopulationCoverage,
  canPromoteConditionToAlert,
  isObservationComplete,
  requireReconciliationBeforeRetry,
  type EvaluatedCondition,
  type ObservabilityEvidence,
  type ObservabilityIncident,
  type ServiceLevelIndicatorDefinition,
  type ServiceLevelObjectiveTarget,
  type SliObservation,
  type TelemetrySignal,
} from "../../packages/contracts/observability/index.js";

const knownEvidence: ObservabilityEvidence = {
  source: {
    sourceId: "telemetry:cpu",
    producerId: "provider:otel",
    producerRevision: "1.4.2",
    locality: "STATION",
    populationRef: "station:alpha",
  },
  observedAt: "2026-09-16T07:30:00Z",
  effectiveAt: "2026-09-16T07:29:58Z",
  currentness: "CURRENT",
  evidenceState: "KNOWN",
};

test("signal, condition, alert and incident remain distinct identities", () => {
  const signal: TelemetrySignal = { kind: "signal", signalId: "signal:1", name: "cpu.high", evidence: knownEvidence };
  const condition: EvaluatedCondition = {
    kind: "condition",
    conditionId: "condition:1",
    signalId: signal.signalId,
    evaluatorRevision: "policy:cpu@3",
    outcome: "TRUE",
    evidence: knownEvidence,
  };

  assert.equal(signal.kind, "signal");
  assert.equal(condition.kind, "condition");
  assert.equal(canPromoteConditionToAlert(condition), true);
});

test("PARTIAL, UNKNOWN or stale evidence cannot strengthen into an alert", () => {
  for (const evidence of [
    { ...knownEvidence, evidenceState: "PARTIAL" as const },
    { ...knownEvidence, evidenceState: "UNKNOWN" as const },
    { ...knownEvidence, currentness: "STALE" as const },
  ]) {
    const condition: EvaluatedCondition = {
      kind: "condition",
      conditionId: "condition:uncertain",
      signalId: "signal:uncertain",
      evaluatorRevision: "policy:cpu@3",
      outcome: "TRUE",
      evidence,
    };
    assert.equal(canPromoteConditionToAlert(condition), false);
    assert.equal(requireReconciliationBeforeRetry(evidence), true);
  }
});

test("an incident requires explicit authority and cannot be inferred from a signal", () => {
  const incident: ObservabilityIncident = {
    kind: "incident",
    incidentId: "incident:1",
    alertIds: ["alert:1"],
    authorityRef: "authority:on-call-policy@7",
    confirmedAt: "2026-09-16T07:31:00Z",
  };
  assert.doesNotThrow(() => assertIncidentAuthority(incident));
  assert.throws(() => assertIncidentAuthority({ ...incident, alertIds: [] }), /alert reference/);
  assert.throws(() => assertIncidentAuthority({ ...incident, authorityRef: "" }), /authorityRef/);
});

test("SLO targets are bound to an exact SLI revision", () => {
  const sli: ServiceLevelIndicatorDefinition = {
    sliId: "sli:availability",
    revision: "4",
    name: "availability",
    unit: "ratio",
    populationRef: "fleet:payments",
    locality: "FLEET",
  };
  const slo: ServiceLevelObjectiveTarget = {
    sloId: "slo:availability",
    revision: "9",
    sliId: sli.sliId,
    sliRevision: sli.revision,
    target: 0.999,
    window: "30d",
  };
  assert.doesNotThrow(() => assertSloTargetsSliRevision(slo, sli));
  assert.throws(() => assertSloTargetsSliRevision({ ...slo, sliRevision: "3" }, sli), /exact SLI id and revision/);
});

test("telemetry gaps and stale or partial cohorts remain incomplete", () => {
  const complete: SliObservation = {
    observationId: "obs:1",
    sliId: "sli:availability",
    sliRevision: "4",
    value: 0.9995,
    evidence: knownEvidence,
    gaps: [],
  };
  assert.equal(isObservationComplete(complete), true);
  assert.equal(isObservationComplete({ ...complete, evidence: { ...knownEvidence, currentness: "STALE" } }), false);
  assert.equal(isObservationComplete({ ...complete, gaps: [{ gapId: "gap:1", populationRef: "station:beta", locality: "STATION", reason: "BACKPRESSURE", observedAt: knownEvidence.observedAt, currentness: "CURRENT" }] }), false);
});

test("population aggregation cannot manufacture completeness", () => {
  assert.equal(canAggregatePopulationCoverage([
    { populationRef: "station:alpha", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" },
    { populationRef: "station:beta", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" },
  ]), true);
  assert.equal(canAggregatePopulationCoverage([
    { populationRef: "station:alpha", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" },
    { populationRef: "station:beta", locality: "STATION", currentness: "UNKNOWN", evidenceState: "PARTIAL" },
  ]), false);
  assert.equal(canAggregatePopulationCoverage([]), false);
});
