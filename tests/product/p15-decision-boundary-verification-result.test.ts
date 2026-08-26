import assert from "node:assert/strict";
import test from "node:test";
import {
  DECISION_BOUNDARY_VERSION,
  verifyDecisionBoundary,
} from "../../packages/contracts/decision-boundary/index.js";

const deterministicDescriptor = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:deterministic-release",
  category: "deterministic",
} as const;

const probabilisticDescriptor = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:risk-assessment",
  category: "probabilistic",
} as const;

const probabilisticMetadata = {
  inferenceRef: "inference:risk-assessment",
  inferenceContext: {
    confidence: 0.91,
    modelRef: "model:risk-v1",
    contextRef: "context:release-42",
  },
} as const;

test("decision-boundary verification returns deterministic valid evidence without authority semantics", () => {
  const result = verifyDecisionBoundary({
    descriptor: probabilisticDescriptor,
    metadata: probabilisticMetadata,
    riskCriticality: { risk: "high", criticality: "critical" },
    expectedCategory: "probabilistic",
  });

  assert.deepEqual(result, {
    status: "valid",
    decisionId: "decision:risk-assessment",
    category: "probabilistic",
    risk: "high",
    criticality: "critical",
    reference: { kind: "inference", ref: "inference:risk-assessment" },
  });
  assert.equal("approved" in result, false);
  assert.equal("authorized" in result, false);
  assert.equal("executionAuthority" in result, false);
});

test("decision-boundary verification rejects a valid descriptor when the required category does not match", () => {
  const result = verifyDecisionBoundary({
    descriptor: deterministicDescriptor,
    metadata: { invariantRef: "invariant:release-safe" },
    riskCriticality: { risk: "medium", criticality: "standard" },
    expectedCategory: "human-decision",
  });

  assert.deepEqual(result, {
    status: "rejected",
    decisionId: "decision:deterministic-release",
    category: "deterministic",
    risk: "medium",
    criticality: "standard",
    reference: { kind: "invariant", ref: "invariant:release-safe" },
    diagnostic: "decision category deterministic does not match expected category human-decision",
  });
});

test("decision-boundary verification fails malformed and category-incompatible evidence closed", () => {
  const malformedDescriptor = verifyDecisionBoundary({
    descriptor: { ...probabilisticDescriptor, category: "automatic" },
    metadata: probabilisticMetadata,
    riskCriticality: { risk: "high", criticality: "critical" },
  });
  assert.equal(malformedDescriptor.status, "invalid");
  if (malformedDescriptor.status === "invalid") assert.match(malformedDescriptor.diagnostic, /unsupported category/);

  const incompatibleMetadata = verifyDecisionBoundary({
    descriptor: deterministicDescriptor,
    metadata: { authorityRef: "authority:release-approver" },
    riskCriticality: { risk: "high", criticality: "critical" },
  });
  assert.equal(incompatibleMetadata.status, "invalid");
  if (incompatibleMetadata.status === "invalid") assert.match(incompatibleMetadata.diagnostic, /unexpected field authorityRef/);

  const malformedRisk = verifyDecisionBoundary({
    descriptor: deterministicDescriptor,
    metadata: { invariantRef: "invariant:release-safe" },
    riskCriticality: { risk: "extreme", criticality: "critical" },
  });
  assert.equal(malformedRisk.status, "invalid");
  if (malformedRisk.status === "invalid") assert.match(malformedRisk.diagnostic, /unsupported risk level/);
});
