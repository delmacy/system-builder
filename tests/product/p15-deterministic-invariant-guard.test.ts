import assert from "node:assert/strict";
import test from "node:test";
import { evaluateDeterministicInvariantControl } from "../../packages/contracts/decision-boundary/index.js";

const deterministic = {
  boundaryVersion: "1.0.0",
  decisionId: "decision:ledger-balance",
  category: "deterministic",
} as const;
const probabilistic = {
  boundaryVersion: "1.0.0",
  decisionId: "decision:risk-score",
  category: "probabilistic",
} as const;
const probabilisticMetadata = {
  inferenceRef: "inference:risk-score",
  inferenceContext: {
    confidence: 0.84,
    modelRef: "model:risk-score-v1",
    contextRef: "context:release-risk",
  },
} as const;

test("deterministic input may satisfy its explicitly matching invariant", () => {
  assert.deepEqual(
    evaluateDeterministicInvariantControl({
      descriptor: deterministic,
      metadata: { invariantRef: "invariant:ledger-balanced" },
      invariantRef: "invariant:ledger-balanced",
    }),
    {
      status: "compatible",
      decisionId: "decision:ledger-balance",
      invariantRef: "invariant:ledger-balanced",
    },
  );
});

test("probabilistic input fails closed without an explicit compatible gate", () => {
  assert.deepEqual(
    evaluateDeterministicInvariantControl({
      descriptor: probabilistic,
      metadata: probabilisticMetadata,
      invariantRef: "invariant:release-safe",
    }),
    {
      status: "rejected",
      decisionId: "decision:risk-score",
      invariantRef: "invariant:release-safe",
      diagnostic: "probabilistic decision requires an explicit compatible gate",
    },
  );

  assert.equal(
    evaluateDeterministicInvariantControl({
      descriptor: probabilistic,
      metadata: probabilisticMetadata,
      invariantRef: "invariant:release-safe",
      gate: {
        gateRef: "gate:risk-to-release",
        sourceCategory: "probabilistic",
        targetCategory: "deterministic",
        invariantRef: "invariant:other",
      },
    }).status,
    "rejected",
  );
});

test("explicit compatible gate permits compatibility without creating authorization", () => {
  const result = evaluateDeterministicInvariantControl({
    descriptor: probabilistic,
    metadata: probabilisticMetadata,
    invariantRef: "invariant:release-safe",
    gate: {
      gateRef: "gate:risk-to-release",
      sourceCategory: "probabilistic",
      targetCategory: "deterministic",
      invariantRef: "invariant:release-safe",
    },
  });

  assert.deepEqual(result, {
    status: "compatible",
    decisionId: "decision:risk-score",
    invariantRef: "invariant:release-safe",
    gateRef: "gate:risk-to-release",
  });
  assert.equal("authorized" in result, false);
  assert.equal("approved" in result, false);
});

test("invalid descriptors and silent category coercion fail explicitly", () => {
  const invalid = evaluateDeterministicInvariantControl({
    descriptor: { ...probabilistic, category: "deterministic" },
    metadata: probabilisticMetadata,
    invariantRef: "invariant:release-safe",
  });
  assert.equal(invalid.status, "invalid");
  assert.match(invalid.diagnostic, /unexpected field inferenceContext/);

  const unknown = evaluateDeterministicInvariantControl({
    descriptor: { ...probabilistic, category: "ai" },
    metadata: probabilisticMetadata,
    invariantRef: "invariant:release-safe",
  });
  assert.equal(unknown.status, "invalid");
  assert.match(unknown.diagnostic, /unsupported category/);
});
