import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import { evaluateProbabilisticDecisionAvailability } from "../../packages/contracts/decision-boundary/probabilistic-availability.js";

const descriptor = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:risk-assessment",
  category: "probabilistic",
} as const;

const metadata = {
  inferenceRef: "inference:risk-assessment",
  inferenceContext: {
    confidence: 0.87,
    modelRef: "model:risk-v2",
    contextRef: "context:release-42",
  },
} as const;

const critical = { risk: "high", criticality: "critical" } as const;

test("provider-neutral availability preserves canonical probabilistic evidence and verification", () => {
  const result = evaluateProbabilisticDecisionAvailability({
    descriptor,
    metadata,
    riskCriticality: critical,
    availability: { status: "available" },
  });

  assert.equal(result.status, "available");
  if (result.status !== "available") return;
  assert.equal(result.decisionId, "decision:risk-assessment");
  assert.equal(result.inferenceRef, "inference:risk-assessment");
  assert.deepEqual(result.inferenceContext, metadata.inferenceContext);
  assert.deepEqual(result.verification, {
    status: "valid",
    decisionId: "decision:risk-assessment",
    category: "probabilistic",
    risk: "high",
    criticality: "critical",
    reference: { kind: "inference", ref: "inference:risk-assessment" },
  });
  assert.equal("provider" in result, false);
  assert.equal("endpoint" in result, false);
  assert.equal("credential" in result, false);
  assert.equal("authorized" in result, false);
  assert.equal("approved" in result, false);
});

test("unavailable probabilistic evidence is explicit and cannot silently become a verified decision", () => {
  const result = evaluateProbabilisticDecisionAvailability({
    descriptor,
    metadata,
    riskCriticality: critical,
    availability: { status: "unavailable", diagnostic: "inference source unavailable" },
  });

  assert.deepEqual(result, {
    status: "unavailable",
    decisionId: "decision:risk-assessment",
    inferenceRef: "inference:risk-assessment",
    diagnostic: "inference source unavailable",
  });
  assert.equal("verification" in result, false);
  assert.equal("fallback" in result, false);
  assert.equal("authorized" in result, false);
  assert.equal("approved" in result, false);
});

test("availability evidence rejects provider-specific, malformed and non-probabilistic inputs fail closed", () => {
  const providerSpecific = evaluateProbabilisticDecisionAvailability({
    descriptor,
    metadata,
    riskCriticality: critical,
    availability: { status: "unavailable", diagnostic: "offline", provider: "vendor-a" },
  });
  assert.equal(providerSpecific.status, "invalid");
  if (providerSpecific.status === "invalid") assert.match(providerSpecific.diagnostic, /unexpected field provider/);

  const malformed = evaluateProbabilisticDecisionAvailability({
    descriptor,
    metadata,
    riskCriticality: critical,
    availability: { status: "unavailable", diagnostic: "" },
  });
  assert.equal(malformed.status, "invalid");
  if (malformed.status === "invalid") assert.match(malformed.diagnostic, /non-empty diagnostic/);

  const deterministic = evaluateProbabilisticDecisionAvailability({
    descriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:release-safe",
      category: "deterministic",
    },
    metadata: { invariantRef: "invariant:release-safe" },
    riskCriticality: critical,
    availability: { status: "available" },
  });
  assert.equal(deterministic.status, "invalid");
  if (deterministic.status === "invalid") assert.match(deterministic.diagnostic, /probabilistic decision required/);
});
