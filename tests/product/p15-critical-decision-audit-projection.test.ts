import assert from "node:assert/strict";
import test from "node:test";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import { verifyDecisionBoundary } from "../../packages/contracts/decision-boundary/index.js";

function verification(descriptor: unknown, metadata: unknown, riskCriticality: unknown) {
  return verifyDecisionBoundary({ descriptor, metadata, riskCriticality });
}

const deterministicDescriptor = { boundaryVersion: "1.0.0", decisionId: "decision:release-invariant", category: "deterministic" } as const;
const deterministicMetadata = { invariantRef: "invariant:release-safe" } as const;
const humanDescriptor = { boundaryVersion: "1.0.0", decisionId: "decision:release-approval", category: "human-decision" } as const;
const humanMetadata = { authorityRef: "authority:release-owner" } as const;
const probabilisticDescriptor = { boundaryVersion: "1.0.0", decisionId: "decision:risk-inference", category: "probabilistic" } as const;
const probabilisticMetadata = {
  inferenceRef: "inference:risk-inference",
  inferenceContext: { confidence: 0.87, modelRef: "model:risk-v2", contextRef: "context:release-42" },
} as const;
const critical = { risk: "high", criticality: "critical" } as const;

test("projects deterministic critical evidence using only the canonical invariant reference", () => {
  const result = projectCriticalDecisionAuditEvidence({
    descriptor: deterministicDescriptor,
    metadata: deterministicMetadata,
    riskCriticality: critical,
    verificationResult: verification(deterministicDescriptor, deterministicMetadata, critical),
  });
  assert.deepEqual(result, {
    decisionId: "decision:release-invariant",
    category: "deterministic",
    risk: "high",
    criticality: "critical",
    verificationStatus: "valid",
    reference: { kind: "invariant", ref: "invariant:release-safe" },
  });
  assert.equal("gateRef" in result, false);
  assert.equal("authorized" in result, false);
});

test("projects human critical evidence without creating approval", () => {
  const result = projectCriticalDecisionAuditEvidence({
    descriptor: humanDescriptor,
    metadata: humanMetadata,
    riskCriticality: critical,
    verificationResult: verification(humanDescriptor, humanMetadata, critical),
  });
  assert.deepEqual(result.reference, { kind: "authority", ref: "authority:release-owner" });
  assert.equal(result.verificationStatus, "valid");
  assert.equal("approved" in result, false);
  assert.equal("approval" in result, false);
});

test("projects probabilistic critical evidence with bounded inference context only", () => {
  const result = projectCriticalDecisionAuditEvidence({
    descriptor: probabilisticDescriptor,
    metadata: probabilisticMetadata,
    riskCriticality: critical,
    verificationResult: verification(probabilisticDescriptor, probabilisticMetadata, critical),
  });
  assert.deepEqual(result, {
    decisionId: "decision:risk-inference",
    category: "probabilistic",
    risk: "high",
    criticality: "critical",
    verificationStatus: "valid",
    reference: { kind: "inference", ref: "inference:risk-inference" },
    inferenceContext: { confidence: 0.87, modelRef: "model:risk-v2", contextRef: "context:release-42" },
  });
  assert.equal("provider" in result, false);
  assert.equal("credential" in result, false);
  assert.equal("payload" in result, false);
});

test("rejects non-critical, invalid, and mismatched verification evidence", () => {
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({
      descriptor: deterministicDescriptor,
      metadata: deterministicMetadata,
      riskCriticality: { risk: "medium", criticality: "standard" },
      verificationResult: verification(deterministicDescriptor, deterministicMetadata, { risk: "medium", criticality: "standard" }),
    }),
    /critical decision required/,
  );

  assert.throws(
    () => projectCriticalDecisionAuditEvidence({
      descriptor: deterministicDescriptor,
      metadata: deterministicMetadata,
      riskCriticality: critical,
      verificationResult: { status: "invalid", diagnostic: "malformed" },
    }),
    /invalid verification result cannot be audited/,
  );

  const mismatched = verification(humanDescriptor, humanMetadata, critical);
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({
      descriptor: deterministicDescriptor,
      metadata: deterministicMetadata,
      riskCriticality: critical,
      verificationResult: mismatched,
    }),
    /does not match normalized decision evidence/,
  );
});
