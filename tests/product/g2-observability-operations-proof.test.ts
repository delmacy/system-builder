import assert from "node:assert/strict";
import test from "node:test";
import {
  assertIncidentAuthority,
  assertSloTargetsSliRevision,
  canAggregatePopulationCoverage,
  canClaimOperatorEffectConvergence,
  canClaimReconciliationConvergence,
  canPromoteConditionToAlert,
  isObservationComplete,
  isReconciliationPopulationComplete,
  requireReconciliationBeforeRetry,
  requiresOperatorEffectReconciliation,
  requiresReconciliationBeforeDisposition,
  type EvaluatedCondition,
  type ObservabilityEvidence,
  type ObservabilityIncident,
  type OperatorEffectEvidence,
  type OperatorRequestAcknowledgement,
  type ReconciliationEvidence,
  type ReconciliationJob,
  type ServiceLevelIndicatorDefinition,
  type ServiceLevelObjectiveTarget,
  type SliObservation,
  type TelemetrySignal,
} from "../../packages/contracts/observability/index.js";

const knownEvidence: ObservabilityEvidence = {
  source: { sourceId: "telemetry:cpu", producerId: "provider:otel", producerRevision: "1.4.2", locality: "STATION", populationRef: "station:alpha" },
  observedAt: "2026-09-16T07:30:00Z", effectiveAt: "2026-09-16T07:29:58Z", currentness: "CURRENT", evidenceState: "KNOWN",
};

test("signal, condition, alert and incident remain distinct identities", () => {
  const signal: TelemetrySignal = { kind: "signal", signalId: "signal:1", name: "cpu.high", evidence: knownEvidence };
  const condition: EvaluatedCondition = { kind: "condition", conditionId: "condition:1", signalId: signal.signalId, evaluatorRevision: "policy:cpu@3", outcome: "TRUE", evidence: knownEvidence };
  assert.equal(signal.kind, "signal"); assert.equal(condition.kind, "condition"); assert.equal(canPromoteConditionToAlert(condition), true);
});

test("PARTIAL, UNKNOWN or stale evidence cannot strengthen into an alert", () => {
  for (const evidence of [{ ...knownEvidence, evidenceState: "PARTIAL" as const }, { ...knownEvidence, evidenceState: "UNKNOWN" as const }, { ...knownEvidence, currentness: "STALE" as const }]) {
    const condition: EvaluatedCondition = { kind: "condition", conditionId: "condition:uncertain", signalId: "signal:uncertain", evaluatorRevision: "policy:cpu@3", outcome: "TRUE", evidence };
    assert.equal(canPromoteConditionToAlert(condition), false); assert.equal(requireReconciliationBeforeRetry(evidence), true);
  }
});

test("an incident requires explicit authority and cannot be inferred from a signal", () => {
  const incident: ObservabilityIncident = { kind: "incident", incidentId: "incident:1", alertIds: ["alert:1"], authorityRef: "authority:on-call-policy@7", confirmedAt: "2026-09-16T07:31:00Z" };
  assert.doesNotThrow(() => assertIncidentAuthority(incident)); assert.throws(() => assertIncidentAuthority({ ...incident, alertIds: [] }), /alert reference/); assert.throws(() => assertIncidentAuthority({ ...incident, authorityRef: "" }), /authorityRef/);
});

test("SLO targets are bound to an exact SLI revision", () => {
  const sli: ServiceLevelIndicatorDefinition = { sliId: "sli:availability", revision: "4", name: "availability", unit: "ratio", populationRef: "fleet:payments", locality: "FLEET" };
  const slo: ServiceLevelObjectiveTarget = { sloId: "slo:availability", revision: "9", sliId: sli.sliId, sliRevision: sli.revision, target: 0.999, window: "30d" };
  assert.doesNotThrow(() => assertSloTargetsSliRevision(slo, sli)); assert.throws(() => assertSloTargetsSliRevision({ ...slo, sliRevision: "3" }, sli), /exact SLI id and revision/);
});

test("telemetry gaps and stale or partial cohorts remain incomplete", () => {
  const complete: SliObservation = { observationId: "obs:1", sliId: "sli:availability", sliRevision: "4", value: 0.9995, evidence: knownEvidence, gaps: [] };
  assert.equal(isObservationComplete(complete), true); assert.equal(isObservationComplete({ ...complete, evidence: { ...knownEvidence, currentness: "STALE" } }), false);
  assert.equal(isObservationComplete({ ...complete, gaps: [{ gapId: "gap:1", populationRef: "station:beta", locality: "STATION", reason: "BACKPRESSURE", observedAt: knownEvidence.observedAt, currentness: "CURRENT" }] }), false);
});

test("population aggregation cannot manufacture completeness", () => {
  assert.equal(canAggregatePopulationCoverage([{ populationRef: "station:alpha", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" }, { populationRef: "station:beta", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" }]), true);
  assert.equal(canAggregatePopulationCoverage([{ populationRef: "station:alpha", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" }, { populationRef: "station:beta", locality: "STATION", currentness: "UNKNOWN", evidenceState: "PARTIAL" }]), false);
  assert.equal(canAggregatePopulationCoverage([]), false);
});

const reconciliationJob: ReconciliationJob = { jobId: "reconcile:1", reconcilerId: "reconciler:inventory", reconcilerRevision: "7", locality: "FLEET", intendedPopulationRefs: ["station:alpha", "station:beta"], sourceRevision: "inventory@12" };
const reconciled: ReconciliationEvidence = { jobId: reconciliationJob.jobId, reconcilerRevision: reconciliationJob.reconcilerRevision, locality: "FLEET", sourceRevision: reconciliationJob.sourceRevision, effectRevision: "inventory@13", intendedPopulationRefs: reconciliationJob.intendedPopulationRefs, attemptedPopulationRefs: reconciliationJob.intendedPopulationRefs, observedPopulationRefs: ["station:alpha", "station:beta"], observedAt: "2026-09-16T10:00:00Z", currentness: "CURRENT", evidenceState: "KNOWN", disposition: "CONVERGED" };
const withoutEffectRevision: ReconciliationEvidence = {
  jobId: reconciled.jobId, reconcilerRevision: reconciled.reconcilerRevision, locality: reconciled.locality, sourceRevision: reconciled.sourceRevision,
  intendedPopulationRefs: reconciled.intendedPopulationRefs, attemptedPopulationRefs: reconciled.attemptedPopulationRefs, observedPopulationRefs: reconciled.observedPopulationRefs,
  observedAt: reconciled.observedAt, currentness: reconciled.currentness, evidenceState: reconciled.evidenceState, disposition: reconciled.disposition,
};

test("reconciliation convergence is qualified by exact intended, attempted and observed populations, locality and revisions", () => {
  assert.equal(isReconciliationPopulationComplete(reconciliationJob, reconciled), true); assert.equal(canClaimReconciliationConvergence(reconciliationJob, reconciled), true); assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, reconciled), false);
});

test("partial or unscoped population cannot imply global convergence", () => {
  const partial = { ...reconciled, observedPopulationRefs: ["station:alpha"], evidenceState: "PARTIAL" as const };
  assert.equal(isReconciliationPopulationComplete(reconciliationJob, partial), false); assert.equal(canClaimReconciliationConvergence(reconciliationJob, partial), false); assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, partial), true);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, attemptedPopulationRefs: ["station:alpha"] }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, observedPopulationRefs: ["station:alpha", "station:beta", "station:gamma"] }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, intendedPopulationRefs: ["station:alpha"] }), false);
});

test("stale, locality-mismatched or revision-mismatched evidence cannot converge", () => {
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, currentness: "STALE" }), false); assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, locality: "STATION" }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, sourceRevision: "inventory@11" }), false); assert.equal(canClaimReconciliationConvergence(reconciliationJob, withoutEffectRevision), false);
});

test("UNKNOWN reconciliation requires reconcile-before-retry", () => {
  const unknown: ReconciliationEvidence = { ...withoutEffectRevision, disposition: "UNKNOWN", currentness: "UNKNOWN", evidenceState: "UNKNOWN" };
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, unknown), false); assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, unknown), true);
});

test("Construction A integrated proof preserves authority, revision, currentness and population boundaries together", () => {
  const signal: TelemetrySignal = { kind: "signal", signalId: "signal:integrated", name: "availability.low", evidence: knownEvidence };
  const uncertain: EvaluatedCondition = { kind: "condition", conditionId: "condition:integrated", signalId: signal.signalId, evaluatorRevision: "policy:availability@9", outcome: "TRUE", evidence: { ...knownEvidence, evidenceState: "PARTIAL" } };
  const sli: ServiceLevelIndicatorDefinition = { sliId: "sli:integrated", revision: "12", name: "availability", unit: "ratio", populationRef: "fleet:integrated", locality: "FLEET" };
  const slo: ServiceLevelObjectiveTarget = { sloId: "slo:integrated", revision: "3", sliId: sli.sliId, sliRevision: sli.revision, target: 0.999, window: "30d" };
  assert.equal(signal.kind, "signal"); assert.equal(canPromoteConditionToAlert(uncertain), false); assert.equal(requireReconciliationBeforeRetry(uncertain.evidence), true); assert.doesNotThrow(() => assertSloTargetsSliRevision(slo, sli));
  assert.equal(canAggregatePopulationCoverage([{ populationRef: "station:alpha", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" }, { populationRef: "station:beta", locality: "STATION", currentness: "UNKNOWN", evidenceState: "PARTIAL" }]), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, currentness: "STALE" }), false); assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, { ...withoutEffectRevision, disposition: "UNKNOWN", currentness: "UNKNOWN", evidenceState: "UNKNOWN" }), true);
  assert.throws(() => assertIncidentAuthority({ kind: "incident", incidentId: "incident:inferred", alertIds: [], authorityRef: "", confirmedAt: knownEvidence.observedAt }), /alert reference|authorityRef/);
});

const operatorAck: OperatorRequestAcknowledgement = {
  requestId: "operator-request:restart-1", authorityRef: "authority:operator-policy@11", ownerId: "owner:payments", requestedRevision: "service@42",
  locality: "STATION", populationRef: "station:alpha", acknowledgedAt: "2026-09-16T10:01:00Z",
};
const convergedOperatorEffect: OperatorEffectEvidence = {
  requestId: operatorAck.requestId, authorityRef: operatorAck.authorityRef, ownerId: operatorAck.ownerId, requestedRevision: operatorAck.requestedRevision,
  effectRevision: "service@43", locality: operatorAck.locality, populationRef: operatorAck.populationRef, evidence: knownEvidence, disposition: "CONVERGED",
};

test("operator acknowledgement is not effect evidence and convergence requires a distinct qualified observation", () => {
  assert.equal("effectRevision" in operatorAck, false);
  assert.equal("evidence" in operatorAck, false);
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, convergedOperatorEffect), true);
  assert.equal(requiresOperatorEffectReconciliation(convergedOperatorEffect), false);
});

test("operator effect convergence preserves exact authority, owner, revision, locality and population", () => {
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, { ...convergedOperatorEffect, authorityRef: "authority:other@1" }), false);
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, { ...convergedOperatorEffect, ownerId: "owner:other" }), false);
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, { ...convergedOperatorEffect, requestedRevision: "service@41" }), false);
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, { ...convergedOperatorEffect, locality: "LOCAL" }), false);
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, { ...convergedOperatorEffect, populationRef: "station:beta" }), false);
});

test("stale, PARTIAL and UNKNOWN operator effect evidence cannot prove convergence", () => {
  for (const evidence of [
    { ...knownEvidence, currentness: "STALE" as const },
    { ...knownEvidence, evidenceState: "PARTIAL" as const },
    { ...knownEvidence, currentness: "UNKNOWN" as const, evidenceState: "UNKNOWN" as const },
  ]) {
    const effect: OperatorEffectEvidence = { ...convergedOperatorEffect, evidence };
    assert.equal(canClaimOperatorEffectConvergence(operatorAck, effect), false);
    assert.equal(requiresOperatorEffectReconciliation(effect), true);
  }
});

test("unknown or revisionless operator outcome requires reconcile-before-retry", () => {
  const { effectRevision: _effectRevision, ...revisionlessEffect } = convergedOperatorEffect;
  const unknown: OperatorEffectEvidence = { ...revisionlessEffect, disposition: "UNKNOWN", evidence: { ...knownEvidence, currentness: "UNKNOWN", evidenceState: "UNKNOWN" } };
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, unknown), false);
  assert.equal(requiresOperatorEffectReconciliation(unknown), true);
  assert.equal(canClaimOperatorEffectConvergence(operatorAck, revisionlessEffect), false);
});
