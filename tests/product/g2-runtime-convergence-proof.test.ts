import assert from "node:assert/strict";
import test from "node:test";

import {
  cohortDrainageQualified,
  evaluateRuntimeConvergence,
  retainedAutonomyRequiresControlPlaneAvailability,
  type RuntimeConvergenceEvidence,
  type RuntimeResidualCohort,
} from "../../packages/contracts/deployment-runtime/runtime-convergence";
import type { CanonicalDeploymentIntent, DeploymentRuntimeObservation } from "../../packages/contracts/deployment-runtime/deployment-generation";

const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-13T20:00:00Z", validUntil: "2026-09-14T20:00:00Z" };
const intent: CanonicalDeploymentIntent = {
  deploymentRef: "dep:1", deploymentRevisionRef: "dep-rev:1", environmentRef: "env:prod",
  releaseRef: "release:1", releaseRevisionRef: "release-rev:1", desiredGeneration: 8, sourceOfTruthRef: "sot:deployments",
};
const observation: DeploymentRuntimeObservation = {
  deploymentRef: "dep:1", deploymentRevisionRef: "dep-rev:1", environmentRef: "env:prod",
  providerRef: "provider:any", providerResourceId: "opaque", processId: "opaque",
  observedGeneration: 8, observedCurrentness: currentness, effectiveGeneration: 8, effectiveCurrentness: currentness, completeness: "KNOWN",
};
const at = "2026-09-13T21:00:00Z";
const base = (): RuntimeConvergenceEvidence => ({ observation, autonomy: "RETAINED", controlPlaneAvailable: true, coexistence: null, residualCohorts: [] });

test("qualified effective observation converges and retained autonomy survives control-plane loss", () => {
  assert.equal(evaluateRuntimeConvergence(intent, base(), at), "CONVERGED");
  const offline = { ...base(), controlPlaneAvailable: false };
  assert.equal(evaluateRuntimeConvergence(intent, offline, at), "CONVERGED");
  assert.equal(retainedAutonomyRequiresControlPlaneAvailability(offline), false);
});

test("stale or unknown evidence never strengthens convergence", () => {
  const stale = { ...observation, effectiveCurrentness: { ...currentness, state: "STALE" as const } };
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), observation: stale }, at), "NOT_CONVERGED");
  const unknown = { ...observation, completeness: "UNKNOWN" as const };
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), observation: unknown }, at), "RECONCILE");
});

test("mixed-generation coexistence remains explicit until all residual cohorts are qualified drained", () => {
  const draining: RuntimeResidualCohort = { cohortRef: "sessions:g7", kind: "SESSION", generation: 7, population: 3, currentness, completeness: "KNOWN", disposition: "DRAINING" };
  const evidence: RuntimeConvergenceEvidence = {
    ...base(),
    coexistence: { sourceOfTruthRef: intent.sourceOfTruthRef, direction: "ROLL_FORWARD", priorGeneration: 7, targetGeneration: 8, actuationQualified: true, releaseEligibilityQualified: true, stateDataRecoveryQualified: true },
    residualCohorts: [draining],
  };
  assert.equal(evaluateRuntimeConvergence(intent, evidence, at), "NOT_CONVERGED");
  const drained: RuntimeResidualCohort = { ...draining, population: 0, disposition: "DRAINED" };
  assert.equal(cohortDrainageQualified(drained, at), true);
  assert.equal(evaluateRuntimeConvergence(intent, { ...evidence, residualCohorts: [drained] }, at), "CONVERGED");
});

test("coexistence requires explicit prior generation and directionally valid transition identity", () => {
  const qualified = { sourceOfTruthRef: intent.sourceOfTruthRef, direction: "ROLL_FORWARD" as const, priorGeneration: 7, targetGeneration: 8, actuationQualified: true, releaseEligibilityQualified: true, stateDataRecoveryQualified: true };
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), coexistence: qualified }, at), "CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), coexistence: { ...qualified, priorGeneration: null } }, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), coexistence: { ...qualified, priorGeneration: 9 } }, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), coexistence: { ...qualified, direction: "ROLLBACK", priorGeneration: 7 } }, at), "NOT_CONVERGED");
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), coexistence: { ...qualified, direction: "ROLLBACK", priorGeneration: 9 } }, at), "CONVERGED");
});

test("partial, unknown population, and incomplete rollback qualifications cannot prove drainage/convergence", () => {
  const partial = { cohortRef: "workers:g7", kind: "WORKER" as const, generation: 7, population: 0, currentness, completeness: "PARTIAL" as const, disposition: "DRAINED" as const };
  assert.equal(cohortDrainageQualified(partial, at), false);
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), residualCohorts: [partial] }, at), "NOT_CONVERGED");

  const unknownPopulation = { ...partial, completeness: "KNOWN" as const, population: null };
  assert.equal(cohortDrainageQualified(unknownPopulation, at), false);

  const rollback = { sourceOfTruthRef: intent.sourceOfTruthRef, direction: "ROLLBACK" as const, priorGeneration: 9, targetGeneration: 8, actuationQualified: true, releaseEligibilityQualified: true, stateDataRecoveryQualified: false };
  assert.equal(evaluateRuntimeConvergence(intent, { ...base(), coexistence: rollback }, at), "NOT_CONVERGED");
});
