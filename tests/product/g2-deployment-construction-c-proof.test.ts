import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateDeploymentConvergence,
  providerAcknowledgementEstablishesEffectiveRuntime,
  type CanonicalDeploymentIntent,
  type DeploymentRuntimeObservation,
} from "../../packages/contracts/deployment-runtime/deployment-generation";
import {
  providerAcknowledgementEstablishesActuationOutcome,
  providerAcknowledgementEstablishesEffectiveGeneration,
  retryDispositionAfterReconciliation,
  retryDispositionForActuation,
  type DeploymentActuationReconciliation,
  type DeploymentActuationResult,
} from "../../packages/contracts/deployment-runtime/deployment-actuation";
import {
  cohortDrainageQualified,
  evaluateRuntimeConvergence,
  providerAcknowledgementEstablishesRuntimeConvergence,
  retainedAutonomyRequiresControlPlaneAvailability,
  type RuntimeConvergenceEvidence,
  type RuntimeResidualCohort,
} from "../../packages/contracts/deployment-runtime/runtime-convergence";

const currentness = {
  state: "CURRENT" as const,
  assessedAt: "2026-09-13T20:00:00Z",
  validUntil: "2026-09-14T20:00:00Z",
};
const at = "2026-09-13T21:00:00Z";

const intent: CanonicalDeploymentIntent = {
  deploymentRef: "deployment:customer-a:prod",
  deploymentRevisionRef: "deployment-revision:42",
  environmentRef: "environment:prod",
  releaseRef: "release:2026.09.13",
  releaseRevisionRef: "release-revision:abc123",
  desiredGeneration: 8,
  sourceOfTruthRef: "sot:deployments",
};

const convergedObservation: DeploymentRuntimeObservation = {
  deploymentRef: intent.deploymentRef,
  deploymentRevisionRef: intent.deploymentRevisionRef,
  environmentRef: intent.environmentRef,
  providerRef: "provider:any",
  providerResourceId: "provider-resource:opaque-991",
  processId: "pid:opaque-88",
  observedGeneration: 8,
  observedCurrentness: currentness,
  effectiveGeneration: 8,
  effectiveCurrentness: currentness,
  completeness: "KNOWN",
};

const unknownActuation: DeploymentActuationResult = {
  deploymentRef: intent.deploymentRef,
  deploymentRevisionRef: intent.deploymentRevisionRef,
  environmentRef: intent.environmentRef,
  desiredGeneration: 8,
  actuationRef: "actuation:8",
  providerRef: "provider:any",
  providerOperationRef: "provider-op:123",
  providerAcknowledged: true,
  outcome: "UNKNOWN",
};

const reconciliation = (
  overrides: Partial<DeploymentActuationReconciliation> = {},
): DeploymentActuationReconciliation => ({
  actuationRef: unknownActuation.actuationRef,
  desiredGeneration: 8,
  observedGeneration: 7,
  observedCurrentness: currentness,
  effectiveGeneration: 7,
  effectiveCurrentness: currentness,
  evidence: "KNOWN",
  evaluatedAt: at,
  ...overrides,
});

const runtimeEvidence = (
  overrides: Partial<RuntimeConvergenceEvidence> = {},
): RuntimeConvergenceEvidence => ({
  observation: convergedObservation,
  autonomy: "RETAINED",
  controlPlaneAvailable: false,
  coexistence: {
    sourceOfTruthRef: intent.sourceOfTruthRef,
    direction: "ROLL_FORWARD",
    priorGeneration: 7,
    targetGeneration: 8,
    actuationQualified: true,
    releaseEligibilityQualified: true,
    stateDataRecoveryQualified: true,
  },
  residualCohorts: [],
  ...overrides,
});

test("integrated chain preserves release, deployment, observed runtime and effective runtime as distinct authorities", () => {
  assert.notEqual(intent.releaseRef, intent.deploymentRef);
  assert.notEqual(intent.releaseRevisionRef, intent.deploymentRevisionRef);
  assert.notEqual(convergedObservation.providerResourceId, intent.deploymentRef);
  assert.notEqual(convergedObservation.processId, intent.deploymentRevisionRef);
  assert.equal(evaluateDeploymentConvergence(intent, convergedObservation, at), "CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence(), at), "CONVERGED");
});

test("observed and effective runtime generation/currentness remain independent evidence domains", () => {
  const observedBehind = {
    ...convergedObservation,
    observedGeneration: 7,
  };
  assert.equal(observedBehind.effectiveGeneration, 8);
  assert.equal(evaluateDeploymentConvergence(intent, observedBehind, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ observation: observedBehind }), at), "NOT_CONVERGED");

  const effectiveBehind = {
    ...convergedObservation,
    effectiveGeneration: 7,
  };
  assert.equal(effectiveBehind.observedGeneration, 8);
  assert.equal(evaluateDeploymentConvergence(intent, effectiveBehind, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ observation: effectiveBehind }), at), "NOT_CONVERGED");

  const observedStale = {
    ...convergedObservation,
    observedCurrentness: { ...currentness, state: "STALE" as const },
  };
  assert.equal(observedStale.effectiveCurrentness.state, "CURRENT");
  assert.equal(evaluateDeploymentConvergence(intent, observedStale, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ observation: observedStale }), at), "NOT_CONVERGED");

  const effectiveStale = {
    ...convergedObservation,
    effectiveCurrentness: { ...currentness, state: "STALE" as const },
  };
  assert.equal(effectiveStale.observedCurrentness.state, "CURRENT");
  assert.equal(evaluateDeploymentConvergence(intent, effectiveStale, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ observation: effectiveStale }), at), "NOT_CONVERGED");
});

test("provider acknowledgement cannot manufacture actuation, effective runtime, currentness or convergence", () => {
  assert.equal(providerAcknowledgementEstablishesActuationOutcome(unknownActuation), false);
  assert.equal(providerAcknowledgementEstablishesEffectiveGeneration(unknownActuation), false);
  assert.equal(providerAcknowledgementEstablishesEffectiveRuntime(convergedObservation), false);
  assert.equal(providerAcknowledgementEstablishesRuntimeConvergence(), false);
  assert.equal(retryDispositionForActuation(unknownActuation), "RECONCILE_BEFORE_RETRY");

  const stale = {
    ...convergedObservation,
    effectiveCurrentness: { ...currentness, state: "STALE" as const },
  };
  assert.equal(evaluateDeploymentConvergence(intent, stale, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ observation: stale }), at), "NOT_CONVERGED");
});

test("ambiguous unsafe mutation remains reconcile-before-retry until qualified current evidence resolves it", () => {
  assert.equal(retryDispositionAfterReconciliation(unknownActuation, reconciliation({ evidence: "UNKNOWN" })), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDispositionAfterReconciliation(unknownActuation, reconciliation({ evidence: "INCONCLUSIVE" })), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDispositionAfterReconciliation(unknownActuation, reconciliation({ evidence: "PARTIAL" })), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDispositionAfterReconciliation(unknownActuation, reconciliation()), "RETRY_ALLOWED");
  assert.equal(retryDispositionAfterReconciliation(unknownActuation, reconciliation({ observedGeneration: 8, effectiveGeneration: 8 })), "NO_RETRY");
  assert.equal(retryDispositionAfterReconciliation(unknownActuation, reconciliation({ observedGeneration: 9, effectiveGeneration: 9 })), "NO_RETRY");
});

test("PARTIAL, UNKNOWN and INCONCLUSIVE evidence never strengthens convergence or drainage", () => {
  const partialObservation = { ...convergedObservation, completeness: "PARTIAL" as const };
  const unknownObservation = { ...convergedObservation, completeness: "UNKNOWN" as const };
  const inconclusiveObservation = { ...convergedObservation, completeness: "INCONCLUSIVE" as const };
  assert.equal(evaluateDeploymentConvergence(intent, partialObservation, at), "NOT_CONVERGED");
  assert.equal(evaluateDeploymentConvergence(intent, unknownObservation, at), "RECONCILE_BEFORE_RETRY");
  assert.equal(evaluateDeploymentConvergence(intent, inconclusiveObservation, at), "RECONCILE_BEFORE_RETRY");

  const cohort: RuntimeResidualCohort = {
    cohortRef: "sessions:g7",
    kind: "SESSION",
    generation: 7,
    population: 0,
    currentness,
    completeness: "PARTIAL",
    disposition: "DRAINED",
  };
  assert.equal(cohortDrainageQualified(cohort, at), false);
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ residualCohorts: [cohort] }), at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ residualCohorts: [{ ...cohort, completeness: "UNKNOWN" }] }), at), "RECONCILE");
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ residualCohorts: [{ ...cohort, completeness: "INCONCLUSIVE" }] }), at), "RECONCILE");
});

test("retained runtime stays closed without the control plane and residual cohorts stay visible until qualified drainage", () => {
  const draining: RuntimeResidualCohort = {
    cohortRef: "workers:g7",
    kind: "WORKER",
    generation: 7,
    population: 2,
    currentness,
    completeness: "KNOWN",
    disposition: "DRAINING",
  };
  const evidence = runtimeEvidence({ residualCohorts: [draining] });
  assert.equal(retainedAutonomyRequiresControlPlaneAvailability(evidence), false);
  assert.equal(evaluateRuntimeConvergence(intent, evidence, at), "NOT_CONVERGED");

  const drained = { ...draining, population: 0, disposition: "DRAINED" as const };
  assert.equal(cohortDrainageQualified(drained, at), true);
  assert.equal(evaluateRuntimeConvergence(intent, runtimeEvidence({ residualCohorts: [drained] }), at), "CONVERGED");
});
