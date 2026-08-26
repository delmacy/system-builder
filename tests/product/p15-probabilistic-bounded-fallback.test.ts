import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import { evaluateProbabilisticFallback } from "../../packages/contracts/decision-boundary/probabilistic-fallback.js";
import { evaluateProbabilisticDecisionAvailability } from "../../packages/contracts/decision-boundary/probabilistic-availability.js";

const sourceDescriptor = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:risk-assessment",
  category: "probabilistic",
} as const;
const sourceMetadata = {
  inferenceRef: "inference:risk-assessment",
  inferenceContext: { confidence: 0.4, modelRef: "model:risk-v2", contextRef: "context:release-42" },
} as const;
const critical = { risk: "high", criticality: "critical" } as const;

const unavailable = evaluateProbabilisticDecisionAvailability({
  descriptor: sourceDescriptor,
  metadata: sourceMetadata,
  riskCriticality: critical,
  availability: { status: "unavailable", diagnostic: "inference source unavailable" },
});

test("explicit unavailable probabilistic evidence can be bounded to existing deterministic evidence", () => {
  const result = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:release-safe",
      sourceDecisionId: "decision:risk-assessment",
      targetDecisionId: "decision:release-safe",
      targetCategory: "deterministic",
    },
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:release-safe",
      category: "deterministic",
    },
    candidateMetadata: { invariantRef: "invariant:release-safe" },
    candidateRiskCriticality: critical,
  });

  assert.equal(result.status, "bounded");
  if (result.status !== "bounded") return;
  assert.equal(result.targetCategory, "deterministic");
  assert.equal(result.verification.status, "valid");
  assert.equal("authorized" in result, false);
  assert.equal("approved" in result, false);
});

test("human-decision fallback remains human-reserved and does not manufacture approval", () => {
  const result = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:human-review",
      sourceDecisionId: "decision:risk-assessment",
      targetDecisionId: "decision:release-approval",
      targetCategory: "human-decision",
    },
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:release-approval",
      category: "human-decision",
    },
    candidateMetadata: { authorityRef: "authority:release-approver" },
    candidateRiskCriticality: critical,
  });

  assert.equal(result.status, "bounded");
  if (result.status !== "bounded") return;
  assert.equal(result.targetCategory, "human-decision");
  assert.equal(result.verification.status, "valid");
  if (result.verification.status !== "valid") return;
  assert.deepEqual(result.verification.reference, { kind: "authority", ref: "authority:release-approver" });
  assert.equal("approval" in result, false);
  assert.equal("approved" in result, false);
  assert.equal("authorized" in result, false);
});

test("fallback fails closed for available, implicit, mismatched and probabilistic targets", () => {
  const available = evaluateProbabilisticDecisionAvailability({
    descriptor: sourceDescriptor,
    metadata: sourceMetadata,
    riskCriticality: critical,
    availability: { status: "available" },
  });
  const baseCandidate = {
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:release-safe",
      category: "deterministic",
    },
    candidateMetadata: { invariantRef: "invariant:release-safe" },
    candidateRiskCriticality: critical,
  } as const;

  const whenAvailable = evaluateProbabilisticFallback({
    sourceAvailability: available,
    fallback: {
      fallbackRef: "fallback:release-safe",
      sourceDecisionId: "decision:risk-assessment",
      targetDecisionId: "decision:release-safe",
      targetCategory: "deterministic",
    },
    ...baseCandidate,
  });
  assert.equal(whenAvailable.status, "rejected");

  const implicit = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {},
    ...baseCandidate,
  });
  assert.equal(implicit.status, "invalid");

  const mismatched = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:release-safe",
      sourceDecisionId: "decision:other",
      targetDecisionId: "decision:release-safe",
      targetCategory: "deterministic",
    },
    ...baseCandidate,
  });
  assert.equal(mismatched.status, "rejected");

  const probabilisticTarget = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:another-model",
      sourceDecisionId: "decision:risk-assessment",
      targetDecisionId: "decision:risk-assessment-2",
      targetCategory: "probabilistic",
    },
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:risk-assessment-2",
      category: "probabilistic",
    },
    candidateMetadata: sourceMetadata,
    candidateRiskCriticality: critical,
  });
  assert.equal(probabilisticTarget.status, "rejected");
});
