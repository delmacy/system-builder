import assert from "node:assert/strict";
import test from "node:test";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import { verifyDecisionBoundary } from "../../packages/contracts/decision-boundary/index.js";

const critical = { risk: "high", criticality: "critical" } as const;

const cases = [
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:deterministic-release", category: "deterministic" } as const,
    metadata: { invariantRef: "invariant:release-safe" } as const,
    reference: { kind: "invariant", ref: "invariant:release-safe" } as const,
  },
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:human-release", category: "human-decision" } as const,
    metadata: { authorityRef: "authority:release-owner" } as const,
    reference: { kind: "authority", ref: "authority:release-owner" } as const,
  },
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:probabilistic-risk", category: "probabilistic" } as const,
    metadata: {
      inferenceRef: "inference:release-risk",
      inferenceContext: { confidence: 0.91, modelRef: "model:risk-v3", contextRef: "context:release-77" },
    } as const,
    reference: { kind: "inference", ref: "inference:release-risk" } as const,
  },
] as const;

test("growing proof verifies every canonical decision category and projects critical audit evidence", () => {
  for (const entry of cases) {
    const verification = verifyDecisionBoundary({
      descriptor: entry.descriptor,
      metadata: entry.metadata,
      riskCriticality: critical,
    });
    assert.equal(verification.status, "valid");

    const audit = projectCriticalDecisionAuditEvidence({
      descriptor: entry.descriptor,
      metadata: entry.metadata,
      riskCriticality: critical,
      verificationResult: verification,
    });

    assert.equal(audit.decisionId, entry.descriptor.decisionId);
    assert.equal(audit.category, entry.descriptor.category);
    assert.equal(audit.verificationStatus, "valid");
    assert.deepEqual(audit.reference, entry.reference);
    assert.equal("authorized" in audit, false);
    assert.equal("approved" in audit, false);
    assert.equal("executionAuthority" in audit, false);
    assert.equal("provider" in audit, false);
    assert.equal("credential" in audit, false);
    assert.equal("payload" in audit, false);
  }
});

test("growing proof fails closed for invalid and authority-confusing evidence", () => {
  const probabilistic = cases[2];
  const wrongCategory = verifyDecisionBoundary({
    descriptor: probabilistic.descriptor,
    metadata: probabilistic.metadata,
    riskCriticality: critical,
    expectedCategory: "human-decision",
  });
  assert.equal(wrongCategory.status, "rejected");

  const rejectedAudit = projectCriticalDecisionAuditEvidence({
    descriptor: probabilistic.descriptor,
    metadata: probabilistic.metadata,
    riskCriticality: critical,
    verificationResult: wrongCategory,
  });
  assert.equal(rejectedAudit.verificationStatus, "rejected");
  assert.equal("authorized" in rejectedAudit, false);
  assert.equal("approved" in rejectedAudit, false);

  const human = cases[1];
  const humanVerification = verifyDecisionBoundary({
    descriptor: human.descriptor,
    metadata: human.metadata,
    riskCriticality: critical,
  });
  assert.equal(humanVerification.status, "valid");

  assert.throws(
    () => projectCriticalDecisionAuditEvidence({
      descriptor: probabilistic.descriptor,
      metadata: probabilistic.metadata,
      riskCriticality: critical,
      verificationResult: humanVerification,
    }),
    /verification result does not match normalized decision evidence/,
  );

  const humanAudit = projectCriticalDecisionAuditEvidence({
    descriptor: human.descriptor,
    metadata: human.metadata,
    riskCriticality: critical,
    verificationResult: humanVerification,
  });
  assert.equal("approval" in humanAudit, false);
  assert.equal("approved" in humanAudit, false);

  const invalid = verifyDecisionBoundary({
    descriptor: { ...human.descriptor, decisionId: "not a token" },
    metadata: human.metadata,
    riskCriticality: critical,
  });
  assert.equal(invalid.status, "invalid");
});

test("probabilistic audit evidence remains bounded to model/context references and confidence", () => {
  const probabilistic = cases[2];
  const verification = verifyDecisionBoundary({
    descriptor: probabilistic.descriptor,
    metadata: probabilistic.metadata,
    riskCriticality: critical,
  });
  assert.equal(verification.status, "valid");

  const audit = projectCriticalDecisionAuditEvidence({
    descriptor: probabilistic.descriptor,
    metadata: probabilistic.metadata,
    riskCriticality: critical,
    verificationResult: verification,
  });

  assert.deepEqual(audit.inferenceContext, {
    confidence: 0.91,
    modelRef: "model:risk-v3",
    contextRef: "context:release-77",
  });
  assert.deepEqual(Object.keys(audit.inferenceContext ?? {}).sort(), ["confidence", "contextRef", "modelRef"]);
});
