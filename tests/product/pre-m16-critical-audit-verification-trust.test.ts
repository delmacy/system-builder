import assert from "node:assert/strict";
import test from "node:test";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import {
  isCanonicalDecisionBoundaryVerificationResult,
  verifyDecisionBoundary,
  type DecisionBoundaryVerificationResult,
} from "../../packages/contracts/decision-boundary/index.js";

const descriptor = { boundaryVersion: "1.0.0", decisionId: "decision:critical-release", category: "human-decision" } as const;
const metadata = { authorityRef: "authority:release-owner" } as const;
const critical = { risk: "high", criticality: "critical" } as const;

test("critical audit accepts verification established by the canonical boundary without creating approval", () => {
  const canonical = verifyDecisionBoundary({ descriptor, metadata, riskCriticality: critical });
  assert.equal(canonical.status, "valid");
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(canonical), true);

  const audit = projectCriticalDecisionAuditEvidence({ descriptor, metadata, riskCriticality: critical, verificationResult: canonical });
  assert.equal(audit.verificationStatus, "valid");
  assert.deepEqual(audit.reference, { kind: "authority", ref: "authority:release-owner" });
  assert.equal("approved" in audit, false);
  assert.equal("approval" in audit, false);
  assert.equal("authorized" in audit, false);
});

test("structurally matching caller-forged valid verdict cannot become canonical audit evidence", () => {
  const canonical = verifyDecisionBoundary({ descriptor, metadata, riskCriticality: critical });
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
    () => projectCriticalDecisionAuditEvidence({ descriptor, metadata, riskCriticality: critical, verificationResult: forged }),
    /not established by canonical verification boundary/,
  );
});

test("serialized or reconstructed verification loses canonical trust and fails closed", () => {
  const canonical = verifyDecisionBoundary({ descriptor, metadata, riskCriticality: critical });
  const reconstructed = JSON.parse(JSON.stringify(canonical)) as DecisionBoundaryVerificationResult;
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(reconstructed), false);
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({ descriptor, metadata, riskCriticality: critical, verificationResult: reconstructed }),
    /not established by canonical verification boundary/,
  );
});

test("canonically established rejected verification remains auditable as rejected", () => {
  const rejected = verifyDecisionBoundary({
    descriptor,
    metadata,
    riskCriticality: critical,
    expectedCategory: "deterministic",
  });
  assert.equal(rejected.status, "rejected");
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(rejected), true);
  const audit = projectCriticalDecisionAuditEvidence({ descriptor, metadata, riskCriticality: critical, verificationResult: rejected });
  assert.equal(audit.verificationStatus, "rejected");
  assert.equal("approved" in audit, false);
});
