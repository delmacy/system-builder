import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDecisionCategoryMetadata } from "../../packages/contracts/decision-boundary/index.js";

test("category metadata normalizes only explicit category-appropriate references", () => {
  assert.deepEqual(normalizeDecisionCategoryMetadata("deterministic", { invariantRef: "invariant:ledger-balanced" }), {
    category: "deterministic",
    metadata: { invariantRef: "invariant:ledger-balanced" },
  });
  assert.deepEqual(normalizeDecisionCategoryMetadata("human-decision", { authorityRef: "approval:release-manager" }), {
    category: "human-decision",
    metadata: { authorityRef: "approval:release-manager" },
  });
  assert.deepEqual(normalizeDecisionCategoryMetadata("probabilistic", { inferenceRef: "inference:risk-score" }), {
    category: "probabilistic",
    metadata: { inferenceRef: "inference:risk-score" },
  });
});

test("category metadata rejects cross-category substitution and hidden defaults", () => {
  assert.throws(
    () => normalizeDecisionCategoryMetadata("human-decision", { inferenceRef: "inference:approval" }),
    /unexpected field inferenceRef/,
  );
  assert.throws(() => normalizeDecisionCategoryMetadata("probabilistic", {}), /expected non-empty token/);
  assert.throws(
    () => normalizeDecisionCategoryMetadata("deterministic", { invariantRef: "invariant:x", authorized: true }),
    /unexpected field authorized/,
  );
});
