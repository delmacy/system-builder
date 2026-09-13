import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deploymentIdentityMatches,
  evaluateDeploymentConvergence,
  processIdentityEstablishesCanonicalDeploymentIdentity,
  providerAcknowledgementEstablishesEffectiveRuntime,
  providerResourceIdentityEstablishesCanonicalDeploymentIdentity,
  type CanonicalDeploymentIntent,
  type DeploymentRuntimeObservation,
} from "../../packages/contracts/deployment-runtime/deployment-generation";

const intent: CanonicalDeploymentIntent = {
  deploymentRef: "deployment:orders",
  deploymentRevisionRef: "deployment:orders@7",
  environmentRef: "environment:prod",
  releaseRef: "release:orders",
  releaseRevisionRef: "release:orders@12",
  desiredGeneration: 7,
  sourceOfTruthRef: "deployment-record:orders",
};

const currentness = { state: "CURRENT", assessedAt: "2026-09-13T17:00:00Z", validUntil: "2026-09-13T19:00:00Z" } as const;

const observation: DeploymentRuntimeObservation = {
  deploymentRef: intent.deploymentRef,
  deploymentRevisionRef: intent.deploymentRevisionRef,
  environmentRef: intent.environmentRef,
  providerRef: "provider:a",
  providerResourceId: "resource-123",
  processId: "pid-44",
  observedGeneration: 7,
  observedCurrentness: currentness,
  effectiveGeneration: 7,
  effectiveCurrentness: currentness,
  completeness: "KNOWN",
};

const at = "2026-09-13T18:00:00Z";

describe("G2 deployment generation semantics", () => {
  it("requires desired, observed and effective generation to converge", () => {
    assert.equal(evaluateDeploymentConvergence(intent, observation, at), "CONVERGED");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, observedGeneration: 6 }, at), "NOT_CONVERGED");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, effectiveGeneration: 6 }, at), "NOT_CONVERGED");
  });

  it("keeps observed and effective currentness independently evidence-bearing", () => {
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, observedCurrentness: { ...currentness, state: "STALE" } }, at), "NOT_CONVERGED");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, effectiveCurrentness: { ...currentness, state: "STALE" } }, at), "NOT_CONVERGED");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, observedCurrentness: { ...currentness, state: "UNKNOWN" } }, at), "RECONCILE_BEFORE_RETRY");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, effectiveCurrentness: { ...currentness, state: "UNKNOWN" } }, at), "RECONCILE_BEFORE_RETRY");
  });

  it("does not strengthen PARTIAL, UNKNOWN or INCONCLUSIVE evidence", () => {
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, completeness: "PARTIAL" }, at), "NOT_CONVERGED");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, completeness: "UNKNOWN" }, at), "RECONCILE_BEFORE_RETRY");
    assert.equal(evaluateDeploymentConvergence(intent, { ...observation, completeness: "INCONCLUSIVE" }, at), "RECONCILE_BEFORE_RETRY");
  });

  it("keeps canonical identity independent of provider and process identifiers", () => {
    const substituted = { ...observation, providerRef: "provider:b", providerResourceId: "resource-999", processId: "pid-99" };
    assert.equal(deploymentIdentityMatches(intent, substituted), true);
    assert.equal(evaluateDeploymentConvergence(intent, substituted, at), "CONVERGED");
    assert.equal(providerAcknowledgementEstablishesEffectiveRuntime(substituted), false);
    assert.equal(providerResourceIdentityEstablishesCanonicalDeploymentIdentity(substituted), false);
    assert.equal(processIdentityEstablishesCanonicalDeploymentIdentity(substituted), false);
  });

  it("rejects provider-id collision when canonical deployment identity differs", () => {
    const collision = { ...observation, deploymentRef: "deployment:other", deploymentRevisionRef: "deployment:other@7" };
    assert.equal(collision.providerResourceId, observation.providerResourceId);
    assert.equal(deploymentIdentityMatches(intent, collision), false);
    assert.equal(evaluateDeploymentConvergence(intent, collision, at), "NOT_CONVERGED");
  });
});
