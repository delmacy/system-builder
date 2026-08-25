import assert from "node:assert/strict";
import test from "node:test";
import {
  DECISION_CATEGORIES,
  DECISION_CRITICALITY_LEVELS,
  DECISION_RISK_LEVELS,
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionRiskCriticality,
} from "../../packages/contracts/decision-boundary/index.js";

test("decision risk and criticality use stable explicit vocabularies", () => {
  assert.deepEqual(DECISION_RISK_LEVELS, ["low", "medium", "high"]);
  assert.deepEqual(DECISION_CRITICALITY_LEVELS, ["standard", "critical"]);

  for (const risk of DECISION_RISK_LEVELS) {
    for (const criticality of DECISION_CRITICALITY_LEVELS) {
      assert.deepEqual(normalizeDecisionRiskCriticality({ risk, criticality }), { risk, criticality });
    }
  }
});

test("risk and criticality are required, descriptive, and reject unknown values", () => {
  assert.throws(() => normalizeDecisionRiskCriticality({ criticality: "standard" }), /unsupported risk level/);
  assert.throws(() => normalizeDecisionRiskCriticality({ risk: "medium" }), /unsupported criticality level/);
  assert.throws(() => normalizeDecisionRiskCriticality({ risk: "extreme", criticality: "critical" }), /unsupported risk level/);
  assert.throws(() => normalizeDecisionRiskCriticality({ risk: "high", criticality: "fatal" }), /unsupported criticality level/);
  assert.throws(
    () => normalizeDecisionRiskCriticality({ risk: "low", criticality: "standard", authorized: true }),
    /unexpected field authorized/,
  );
});

test("risk and criticality stay orthogonal to decision category and grant no authority", () => {
  for (const category of DECISION_CATEGORIES) {
    const descriptor = normalizeDecisionBoundaryDescriptor({
      boundaryVersion: "1.0.0",
      decisionId: `decision:${category}`,
      category,
    });
    const classification = normalizeDecisionRiskCriticality({ risk: "high", criticality: "critical" });

    assert.equal(descriptor.category, category);
    assert.deepEqual(classification, { risk: "high", criticality: "critical" });
    assert.equal("authorized" in classification, false);
    assert.equal("category" in classification, false);
  }
});
