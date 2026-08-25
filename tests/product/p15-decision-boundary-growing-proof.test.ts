import assert from "node:assert/strict";
import test from "node:test";
import {
  DECISION_BOUNDARY_VERSION,
  evaluateDeterministicInvariantControl,
  evaluateHumanAuthorityReservation,
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  normalizeDecisionRiskCriticality,
} from "../../packages/contracts/decision-boundary/index.js";

const deterministic = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:ledger-release",
  category: "deterministic",
} as const;
const human = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:manual-release",
  category: "human-decision",
} as const;
const probabilistic = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:release-risk",
  category: "probabilistic",
} as const;
const inferenceMetadata = {
  inferenceRef: "inference:release-risk",
  inferenceContext: {
    confidence: 0.86,
    modelRef: "model:release-risk-v1",
    contextRef: "context:release-candidate",
  },
} as const;

test("Construction A decision boundary composes all three explicit categories without authority leakage", () => {
  assert.deepEqual(normalizeDecisionBoundaryDescriptor(deterministic), deterministic);
  assert.deepEqual(normalizeDecisionBoundaryDescriptor(human), human);
  assert.deepEqual(normalizeDecisionBoundaryDescriptor(probabilistic), probabilistic);

  assert.deepEqual(normalizeDecisionCategoryMetadata("deterministic", { invariantRef: "invariant:ledger-balanced" }), {
    category: "deterministic",
    metadata: { invariantRef: "invariant:ledger-balanced" },
  });
  assert.deepEqual(normalizeDecisionCategoryMetadata("human-decision", { authorityRef: "authority:release-approver" }), {
    category: "human-decision",
    metadata: { authorityRef: "authority:release-approver" },
  });
  assert.deepEqual(normalizeDecisionCategoryMetadata("probabilistic", inferenceMetadata), {
    category: "probabilistic",
    metadata: inferenceMetadata,
  });

  assert.deepEqual(normalizeDecisionRiskCriticality({ risk: "high", criticality: "critical" }), {
    risk: "high",
    criticality: "critical",
  });
});

test("probabilistic inference cannot silently control a deterministic invariant", () => {
  const ungated = evaluateDeterministicInvariantControl({
    descriptor: probabilistic,
    metadata: inferenceMetadata,
    invariantRef: "invariant:release-safe",
  });
  assert.equal(ungated.status, "rejected");
  if (ungated.status === "rejected") assert.match(ungated.diagnostic, /explicit compatible gate/);

  const gated = evaluateDeterministicInvariantControl({
    descriptor: probabilistic,
    metadata: inferenceMetadata,
    invariantRef: "invariant:release-safe",
    gate: {
      gateRef: "gate:risk-to-release",
      sourceCategory: "probabilistic",
      targetCategory: "deterministic",
      invariantRef: "invariant:release-safe",
    },
  });
  assert.deepEqual(gated, {
    status: "compatible",
    decisionId: "decision:release-risk",
    invariantRef: "invariant:release-safe",
    gateRef: "gate:risk-to-release",
  });
  assert.equal("authorized" in gated, false);
  assert.equal("approved" in gated, false);
});

test("probabilistic inference cannot substitute for human-reserved authority", () => {
  const result = evaluateHumanAuthorityReservation({
    descriptor: probabilistic,
    metadata: inferenceMetadata,
    authorityRef: "authority:release-approver",
  });
  assert.equal(result.status, "rejected");
  if (result.status === "rejected") assert.match(result.diagnostic, /cannot satisfy human-reserved authority/);

  assert.deepEqual(
    evaluateHumanAuthorityReservation({
      descriptor: human,
      metadata: { authorityRef: "authority:release-approver" },
      authorityRef: "authority:release-approver",
    }),
    {
      status: "compatible",
      decisionId: "decision:manual-release",
      authorityRef: "authority:release-approver",
    },
  );
});

test("unknown or absent classification fails explicitly and inference stays provider/network/secret neutral", () => {
  assert.throws(
    () => normalizeDecisionBoundaryDescriptor({ boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId: "decision:legacy" }),
    /unsupported category/,
  );
  assert.throws(
    () => normalizeDecisionBoundaryDescriptor({ ...deterministic, category: "automatic" }),
    /unsupported category/,
  );
  assert.throws(() => normalizeDecisionRiskCriticality(undefined), /expected object/);

  const normalized = normalizeDecisionCategoryMetadata("probabilistic", inferenceMetadata);
  assert.equal(normalized.category, "probabilistic");
  if (normalized.category === "probabilistic") {
    assert.equal(normalized.metadata.inferenceContext.confidence, 0.86);
    assert.equal("provider" in normalized.metadata.inferenceContext, false);
    assert.equal("endpoint" in normalized.metadata.inferenceContext, false);
    assert.equal("credential" in normalized.metadata.inferenceContext, false);
    assert.equal("secret" in normalized.metadata.inferenceContext, false);
    assert.equal("authorized" in normalized.metadata.inferenceContext, false);
    assert.equal("approved" in normalized.metadata.inferenceContext, false);
  }
});
