import assert from "node:assert/strict";
import test from "node:test";
import {
  assertIncidentAuthority,
  assertSloTargetsSliRevision,
  canAggregatePopulationCoverage,
  canClaimReconciliationConvergence,
  canPromoteConditionToAlert,
  isObservationComplete,
  isReconciliationPopulationComplete,
  requireReconciliationBeforeRetry,
  requiresReconciliationBeforeDisposition,
  type EvaluatedCondition,
  type ObservabilityEvidence,
  type ObservabilityIncident,
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
  jobId: reconciled.jobId,
  reconcilerRevision: reconciled.reconcilerRevision,
  locality: reconciled.locality,
  sourceRevision: reconciled.sourceRevision,
  intendedPopulationRefs: reconciled.intendedPopulationRefs,
  attemptedPopulationRefs: reconciled.attemptedPopulationRefs,
  observedPopulationRefs: reconciled.observedPopulationRefs,
  observedAt: reconciled.observedAt,
  currentness: reconciled.currentness,
  evidenceState: reconciled.evidenceState,
  disposition: reconciled.disposition,
};

test("reconciliation convergence is qualified by exact intended, attempted and observed populations, locality and revisions", () => {
  assert.equal(isReconciliationPopulationComplete(reconciliationJob, reconciled), true);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, reconciled), true);
  assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, reconciled), false);
});

test("partial or unscoped population cannot imply global convergence", () => {
  const partial = { ...reconciled, observedPopulationRefs: ["station:alpha"], evidenceState: "PARTIAL" as const };
  assert.equal(isReconciliationPopulationComplete(reconciliationJob, partial), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, partial), false);
  assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, partial), true);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, attemptedPopulationRefs: ["station:alpha"] }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, observedPopulationRefs: ["station:alpha", "station:beta", "station:gamma"] }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, intendedPopulationRefs: ["station:alpha"] }), false);
});

test("stale, locality-mismatched or revision-mismatched evidence cannot converge", () => {
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, currentness: "STALE" }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, locality: "STATION" }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, { ...reconciled, sourceRevision: "inventory@11" }), false);
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, withoutEffectRevision), false);
});

test("UNKNOWN reconciliation requires reconcile-before-retry", () => {
  const unknown: ReconciliationEvidence = { ...withoutEffectRevision, disposition: "UNKNOWN", currentness: "UNKNOWN", evidenceState: "UNKNOWN" };
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, unknown), false);
  assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, unknown), true);
});

test("Construction A integrated proof never strengthens uncertain evidence across identity, SLO, aggregation and reconciliation boundaries", () => {
  const uncertainEvidence: ObservabilityEvidence = { ...knownEvidence, currentness: "UNKNOWN", evidenceState: "UNKNOWN" };
  const uncertainCondition: EvaluatedCondition = { kind: "condition", conditionId: "condition:integrated", signalId: "signal:integrated", evaluatorRevision: "policy:cpu@3", outcome: "TRUE", evidence: uncertainEvidence };
  assert.equal(canPromoteConditionToAlert(uncertainCondition), false);
  assert.equal(requireReconciliationBeforeRetry(uncertainEvidence), true);

  const sli: ServiceLevelIndicatorDefinition = { sliId: "sli:integrated", revision: "8", name: "integrated", unit: "ratio", populationRef: "fleet:integrated", locality: "FLEET" };
  const slo: ServiceLevelObjectiveTarget = { sloId: "slo:integrated", revision: "2", sliId: sli.sliId, sliRevision: sli.revision, target: 0.99, window: "7d" };
  assert.doesNotThrow(() => assertSloTargetsSliRevision(slo, sli));
  assert.throws(() => assertSloTargetsSliRevision({ ...slo, sliRevision: "7" }, sli), /exact SLI id and revision/);

  assert.equal(canAggregatePopulationCoverage([{ populationRef: "station:alpha", locality: "STATION", currentness: "CURRENT", evidenceState: "KNOWN" }, { populationRef: "station:beta", locality: "STATION", currentness: "UNKNOWN", evidenceState: "UNKNOWN" }]), false);

  const partialReconciliation: ReconciliationEvidence = { ...reconciled, observedPopulationRefs: ["station:alpha"], currentness: "UNKNOWN", evidenceState: "PARTIAL", disposition: "UNKNOWN" };
  assert.equal(canClaimReconciliationConvergence(reconciliationJob, partialReconciliation), false);
  assert.equal(requiresReconciliationBeforeDisposition(reconciliationJob, partialReconciliation), true);
});
