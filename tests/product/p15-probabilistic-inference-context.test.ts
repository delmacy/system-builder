import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeDecisionCategoryMetadata,
  normalizeProbabilisticInferenceContext,
} from "../../packages/contracts/decision-boundary/index.js";

const inferenceContext = {
  confidence: 0.91,
  modelRef: "model:fraud-score-v2",
  contextRef: "context:invoice-screening",
} as const;

test("probabilistic inference context is explicit, provider-neutral and normalized", () => {
  assert.deepEqual(normalizeProbabilisticInferenceContext(inferenceContext), inferenceContext);
  assert.deepEqual(
    normalizeDecisionCategoryMetadata("probabilistic", {
      inferenceRef: "inference:invoice-fraud-score",
      inferenceContext,
    }),
    {
      category: "probabilistic",
      metadata: {
        inferenceRef: "inference:invoice-fraud-score",
        inferenceContext,
      },
    },
  );
});

test("probabilistic confidence is bounded and finite", () => {
  for (const confidence of [-0.01, 1.01, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(
      () => normalizeProbabilisticInferenceContext({ ...inferenceContext, confidence }),
      /expected finite number between 0 and 1/,
    );
  }

  assert.equal(normalizeProbabilisticInferenceContext({ ...inferenceContext, confidence: 0 }).confidence, 0);
  assert.equal(normalizeProbabilisticInferenceContext({ ...inferenceContext, confidence: 1 }).confidence, 1);
});

test("probabilistic descriptors require explicit model and context identifiers with no hidden defaults", () => {
  assert.throws(
    () => normalizeDecisionCategoryMetadata("probabilistic", { inferenceRef: "inference:x" }),
    /expected object/,
  );
  assert.throws(
    () => normalizeProbabilisticInferenceContext({ confidence: 0.5, modelRef: "model:x" }),
    /expected non-empty token/,
  );
  assert.throws(
    () => normalizeProbabilisticInferenceContext({ ...inferenceContext, provider: "vendor-x" }),
    /unexpected field provider/,
  );
});

test("deterministic and human categories cannot silently acquire probabilistic context", () => {
  assert.throws(
    () => normalizeDecisionCategoryMetadata("deterministic", { invariantRef: "invariant:x", inferenceContext }),
    /unexpected field inferenceContext/,
  );
  assert.throws(
    () => normalizeDecisionCategoryMetadata("human-decision", { authorityRef: "authority:x", inferenceContext }),
    /unexpected field inferenceContext/,
  );
});

test("inference context carries no credentials, endpoint locator or authorization implication", () => {
  const normalized = normalizeProbabilisticInferenceContext(inferenceContext);
  assert.equal("provider" in normalized, false);
  assert.equal("endpoint" in normalized, false);
  assert.equal("credential" in normalized, false);
  assert.equal("secret" in normalized, false);
  assert.equal("authorized" in normalized, false);
  assert.equal("approved" in normalized, false);
});
