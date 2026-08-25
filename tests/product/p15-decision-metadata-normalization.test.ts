import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDecisionCategoryMetadata } from "../../packages/contracts/decision-boundary/index.js";

const probabilisticMetadata = {
  inferenceRef: "inference:risk-score",
  inferenceContext: {
    confidence: 0.84,
    modelRef: "model:risk-score-v1",
    contextRef: "context:release-risk",
  },
} as const;

test("category metadata normalizes only explicit category-appropriate references", () => {
  assert.deepEqual(normalizeDecisionCategoryMetadata("deterministic", { invariantRef: "invariant:ledger-balanced" }), {
    category: "deterministic",
    metadata: { invariantRef: "invariant:ledger-balanced" },
  });
  assert.deepEqual(normalizeDecisionCategoryMetadata("human-decision", { authorityRef: "approval:release-manager" }), {
    category: "human-decision",
    metadata: { authorityRef: "approval:release-manager" },
  });
  assert.deepEqual(normalizeDecisionCategoryMetadata("probabilistic", probabilisticMetadata), {
    category: "probabilistic",
    metadata: probabilisticMetadata,
  });
});

test("category metadata rejects cross-category substitution and hidden defaults", () => {
  assert.throws(
    () => normalizeDecisionCategoryMetadata("human-decision", { inferenceRef: "inference:approval" }),
    /unexpected field inferenceRef/,
  );
  assert.throws(
    () => normalizeDecisionCategoryMetadata("probabilistic", { inferenceRef: "inference:risk-score" }),
    /expected object/,
  );
  assert.throws(
    () => normalizeDecisionCategoryMetadata("deterministic", { invariantRef: "invariant:x", authorized: true }),
    /unexpected field authorized/,
  );
});
