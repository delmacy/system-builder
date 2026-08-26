import assert from "node:assert/strict";
import test from "node:test";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import {
  isCanonicalDecisionBoundaryVerificationResult,
  verifyDecisionBoundary,
  type DecisionBoundaryVerificationResult,
} from "../../packages/contracts/decision-boundary/index.js";

const critical = { risk: "high", criticality: "critical" } as const;

const cases = [
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-deterministic", category: "deterministic" } as const,
    metadata: { invariantRef: "invariant:pre-m16-release" } as const,
    reference: { kind: "invariant", ref: "invariant:pre-m16-release" } as const,
  },
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-human", category: "human-decision" } as const,
    metadata: { authorityRef: "authority:pre-m16-owner" } as const,
    reference: { kind: "authority", ref: "authority:pre-m16-owner" } as const,
  },
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-probabilistic", category: "probabilistic" } as const,
    metadata: {
      inferenceRef: "inference:pre-m16-risk",
      inferenceContext: { confidence: 0.88, modelRef: "model:pre-m16-risk", contextRef: "context:pre-m16-release" },
    } as const,
    reference: { kind: "inference", ref: "inference:pre-m16-risk" } as const,
  },
] as const;

test("canonical verification remains trusted through the real audit consumer for every decision category", () => {
  for (const entry of cases) {
    const verification = verifyDecisionBoundary({
      descriptor: entry.descriptor,
      metadata: entry.metadata,
      riskCriticality: critical,
    });

    assert.equal(verification.status, "valid");
    assert.equal(isCanonicalDecisionBoundaryVerificationResult(verification), true);

    const audit = projectCriticalDecisionAuditEvidence({
      descriptor: entry.descriptor,
      metadata: entry.metadata,
      riskCriticality: critical,
      verificationResult: verification,
    });

    assert.equal(audit.verificationStatus, "valid");
    assert.equal(audit.category, entry.descriptor.category);
    assert.deepEqual(audit.reference, entry.reference);
    assert.equal("approved" in audit, false);
    assert.equal("approval" in audit, false);
    assert.equal("authorized" in audit, false);
    assert.equal("executionAuthority" in audit, false);
  }
});

test("reconstructed matching valid verification fails closed at the audit consumer", () => {
  const human = cases[1];
  const canonical = verifyDecisionBoundary({
    descriptor: human.descriptor,
    metadata: human.metadata,
    riskCriticality: critical,
  });
  assert.equal(canonical.status, "valid");

  const reconstructed = JSON.parse(JSON.stringify(canonical)) as DecisionBoundaryVerificationResult;
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(reconstructed), false);
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({
      descriptor: human.descriptor,
      metadata: human.metadata,
      riskCriticality: critical,
      verificationResult: reconstructed,
    }),
    /not established by canonical verification boundary/,
  );
});

test("synthetic structurally matching valid verification cannot acquire canonical audit trust", () => {
  const deterministic = cases[0];
  const canonical = verifyDecisionBoundary({
    descriptor: deterministic.descriptor,
    metadata: deterministic.metadata,
    riskCriticality: critical,
  });
  assert.equal(canonical.status, "valid");
  if (canonical.status !== "valid") return;

  const forged: DecisionBoundaryVerificationResult = {
    status: "valid",
    decisionId: canonical.decisionId,
    category: canonical.category,
    risk: canonical.risk,
    criticality: canonical.criticality,
    reference: { ...canonical.reference },
  };

  assert.equal(isCanonicalDecisionBoundaryVerificationResult(forged), false);
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({
      descriptor: deterministic.descriptor,
      metadata: deterministic.metadata,
      riskCriticality: critical,
      verificationResult: forged,
    }),
    /not established by canonical verification boundary/,
  );
});

test("canonically rejected verification remains auditable without creating human authority", () => {
  const human = cases[1];
  const rejected = verifyDecisionBoundary({
    descriptor: human.descriptor,
    metadata: human.metadata,
    riskCriticality: critical,
    expectedCategory: "deterministic",
  });

  assert.equal(rejected.status, "rejected");
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(rejected), true);

  const audit = projectCriticalDecisionAuditEvidence({
    descriptor: human.descriptor,
    metadata: human.metadata,
    riskCriticality: critical,
    verificationResult: rejected,
  });

  assert.equal(audit.verificationStatus, "rejected");
  assert.deepEqual(audit.reference, human.reference);
  assert.equal("approved" in audit, false);
  assert.equal("approval" in audit, false);
  assert.equal("authorized" in audit, false);
  assert.equal("executionAuthority" in audit, false);
});
