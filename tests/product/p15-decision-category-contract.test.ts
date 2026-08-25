import assert from "node:assert/strict";
import test from "node:test";
import {
  DECISION_BOUNDARY_VERSION,
  DECISION_CATEGORIES,
  isDecisionCategory,
  normalizeDecisionBoundaryDescriptor,
} from "../../packages/contracts/decision-boundary/index.js";

test("decision boundary exposes exactly the canonical WBS 15 categories", () => {
  assert.deepEqual(DECISION_CATEGORIES, ["deterministic", "human-decision", "probabilistic"]);
  for (const category of DECISION_CATEGORIES) assert.equal(isDecisionCategory(category), true);
  assert.equal(isDecisionCategory("automatic"), false);
});

test("decision boundary descriptor normalizes an explicit category without granting authority", () => {
  const descriptor = normalizeDecisionBoundaryDescriptor({
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: "decision:invoice-release",
    category: "human-decision",
  });

  assert.deepEqual(descriptor, {
    boundaryVersion: "1.0.0",
    decisionId: "decision:invoice-release",
    category: "human-decision",
  });
  assert.equal("approved" in descriptor, false);
  assert.equal("authorized" in descriptor, false);
});

test("decision boundary fails explicitly for unknown category, version and fields", () => {
  assert.throws(
    () => normalizeDecisionBoundaryDescriptor({ boundaryVersion: "1.0.0", decisionId: "decision:x", category: "ai" }),
    /unsupported category/,
  );
  assert.throws(
    () => normalizeDecisionBoundaryDescriptor({ boundaryVersion: "2.0.0", decisionId: "decision:x", category: "deterministic" }),
    /unsupported version/,
  );
  assert.throws(
    () => normalizeDecisionBoundaryDescriptor({ boundaryVersion: "1.0.0", decisionId: "decision:x", category: "deterministic", authority: true }),
    /unexpected field authority/,
  );
});
