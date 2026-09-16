import assert from "node:assert/strict";
import test from "node:test";
import {
  assertIncidentAuthority,
  canPromoteConditionToAlert,
  requireReconciliationBeforeRetry,
  type EvaluatedCondition,
  type ObservabilityEvidence,
  type ObservabilityIncident,
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
