import assert from "node:assert/strict";
import test from "node:test";
import {
  canClaimOperatorManualEmergencyConvergence,
  canRetryOperatorManualEmergencyAfterReconnect,
  isOperatorManualEmergencyDispositionAuditable,
  type ObservabilityEvidence,
  type OperatorEffectEvidence,
  type OperatorManualEmergencyDisposition,
  type OperatorReconnectReconciliation,
  type OperatorRequestAcknowledgement,
} from "../../packages/contracts/observability/index.js";

const evidence: ObservabilityEvidence = {
  source: {
    sourceId: "telemetry:operator-proof",
    producerId: "provider:otel",
    producerRevision: "1.4.2",
    locality: "STATION",
    populationRef: "station:alpha",
  },
  observedAt: "2026-09-17T21:00:00Z",
  effectiveAt: "2026-09-17T20:59:58Z",
  currentness: "CURRENT",
  evidenceState: "KNOWN",
};

const acknowledgement: OperatorRequestAcknowledgement = {
  requestId: "operator-request:manual-emergency-1",
  authorityRef: "authority:operator-policy@11",
  ownerId: "owner:payments",
  requestedRevision: "service@42",
  locality: "STATION",
  populationRef: "station:alpha",
  acknowledgedAt: "2026-09-17T21:00:01Z",
};

const effect: OperatorEffectEvidence = {
  requestId: acknowledgement.requestId,
  authorityRef: acknowledgement.authorityRef,
  ownerId: acknowledgement.ownerId,
  requestedRevision: acknowledgement.requestedRevision,
  effectRevision: "service@43",
  locality: acknowledgement.locality,
  populationRef: acknowledgement.populationRef,
  evidence,
  disposition: "CONVERGED",
};

const reconnectDiverged: OperatorReconnectReconciliation = {
  requestId: acknowledgement.requestId,
  authorityRef: acknowledgement.authorityRef,
  ownerId: acknowledgement.ownerId,
  requestedRevision: acknowledgement.requestedRevision,
  locality: acknowledgement.locality,
  populationRef: acknowledgement.populationRef,
  sourceRevision: acknowledgement.requestedRevision,
  currentness: "CURRENT",
  evidenceState: "KNOWN",
  disposition: "DIVERGED",
};

const manual: OperatorManualEmergencyDisposition = {
  dispositionId: "operator-disposition:manual-1",
  mode: "MANUAL",
  actorId: "operator:alice",
  requestedAction: "restart service",
  acknowledgement,
  effect,
};

const emergency: OperatorManualEmergencyDisposition = {
  ...manual,
  dispositionId: "operator-disposition:emergency-1",
  mode: "EMERGENCY",
};

test("manual and emergency paths retain actor, requested action, authority lineage and distinct effect evidence", () => {
  for (const record of [manual, emergency]) {
    assert.equal(isOperatorManualEmergencyDispositionAuditable(record), true);
    assert.equal(record.actorId, "operator:alice");
    assert.equal(record.requestedAction, "restart service");
    assert.equal(record.acknowledgement.authorityRef, acknowledgement.authorityRef);
    assert.equal(record.effect?.effectRevision, "service@43");
    assert.equal(canClaimOperatorManualEmergencyConvergence(record), true);
  }
});

test("emergency execution and acknowledgement alone never imply convergence", () => {
  const emergencyWithoutEffect: OperatorManualEmergencyDisposition = { ...emergency, effect: undefined };
  assert.equal(isOperatorManualEmergencyDispositionAuditable(emergencyWithoutEffect), true);
  assert.equal(canClaimOperatorManualEmergencyConvergence(emergencyWithoutEffect), false);
  assert.equal(canRetryOperatorManualEmergencyAfterReconnect(emergencyWithoutEffect), false);
});

test("manual or emergency effect cannot cross authority, owner, revision, locality or population boundaries", () => {
  const mismatches: readonly OperatorEffectEvidence[] = [
    { ...effect, authorityRef: "authority:other@1" },
    { ...effect, ownerId: "owner:other" },
    { ...effect, requestedRevision: "service@41" },
    { ...effect, locality: "LOCAL" },
    { ...effect, populationRef: "station:beta" },
  ];
  for (const mismatchedEffect of mismatches) {
    const record: OperatorManualEmergencyDisposition = { ...emergency, effect: mismatchedEffect };
    assert.equal(isOperatorManualEmergencyDispositionAuditable(record), false);
    assert.equal(canClaimOperatorManualEmergencyConvergence(record), false);
  }
});

test("stale, PARTIAL and UNKNOWN effect evidence cannot be strengthened by emergency mode", () => {
  for (const uncertainEvidence of [
    { ...evidence, currentness: "STALE" as const },
    { ...evidence, evidenceState: "PARTIAL" as const },
    { ...evidence, currentness: "UNKNOWN" as const, evidenceState: "UNKNOWN" as const },
  ]) {
    const record: OperatorManualEmergencyDisposition = { ...emergency, effect: { ...effect, evidence: uncertainEvidence } };
    assert.equal(isOperatorManualEmergencyDispositionAuditable(record), true);
    assert.equal(canClaimOperatorManualEmergencyConvergence(record), false);
  }
});

test("retry after reconnect requires qualified CURRENT KNOWN divergence even for emergency execution", () => {
  const reconciled: OperatorManualEmergencyDisposition = { ...emergency, effect: undefined, reconnectReconciliation: reconnectDiverged };
  assert.equal(isOperatorManualEmergencyDispositionAuditable(reconciled), true);
  assert.equal(canRetryOperatorManualEmergencyAfterReconnect(reconciled), true);
  assert.equal(canClaimOperatorManualEmergencyConvergence(reconciled), false);

  for (const reconciliation of [
    { ...reconnectDiverged, currentness: "STALE" as const },
    { ...reconnectDiverged, evidenceState: "PARTIAL" as const },
    { ...reconnectDiverged, currentness: "UNKNOWN" as const, evidenceState: "UNKNOWN" as const, disposition: "UNKNOWN" as const },
  ]) {
    const unresolved: OperatorManualEmergencyDisposition = { ...reconciled, reconnectReconciliation: reconciliation };
    assert.equal(isOperatorManualEmergencyDispositionAuditable(unresolved), false);
    assert.equal(canRetryOperatorManualEmergencyAfterReconnect(unresolved), false);
    assert.equal(canClaimOperatorManualEmergencyConvergence(unresolved), false);
  }
});

test("reconnect reconciliation cannot cross lineage boundaries or manufacture duplicate retry authority", () => {
  const mismatches: readonly OperatorReconnectReconciliation[] = [
    { ...reconnectDiverged, requestId: "operator-request:other" },
    { ...reconnectDiverged, authorityRef: "authority:other@1" },
    { ...reconnectDiverged, ownerId: "owner:other" },
    { ...reconnectDiverged, requestedRevision: "service@41" },
    { ...reconnectDiverged, sourceRevision: "service@41" },
    { ...reconnectDiverged, locality: "LOCAL" },
    { ...reconnectDiverged, populationRef: "station:beta" },
  ];
  for (const reconciliation of mismatches) {
    const record: OperatorManualEmergencyDisposition = { ...emergency, effect: undefined, reconnectReconciliation: reconciliation };
    assert.equal(isOperatorManualEmergencyDispositionAuditable(record), false);
    assert.equal(canRetryOperatorManualEmergencyAfterReconnect(record), false);
  }

  const unresolved: OperatorManualEmergencyDisposition = {
    ...emergency,
    effect: undefined,
    reconnectReconciliation: { ...reconnectDiverged, disposition: "UNKNOWN" },
  };
  assert.equal(canRetryOperatorManualEmergencyAfterReconnect(unresolved), false);
  assert.equal(canRetryOperatorManualEmergencyAfterReconnect({ ...unresolved, dispositionId: "operator-disposition:emergency-duplicate" }), false);
});

test("auditable records require explicit disposition, actor and requested action identities", () => {
  assert.equal(isOperatorManualEmergencyDispositionAuditable({ ...manual, dispositionId: "" }), false);
  assert.equal(isOperatorManualEmergencyDispositionAuditable({ ...manual, actorId: "" }), false);
  assert.equal(isOperatorManualEmergencyDispositionAuditable({ ...manual, requestedAction: "" }), false);
});
