import assert from "node:assert/strict";
import test from "node:test";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import { evaluateProbabilisticDecisionAvailability } from "../../packages/contracts/decision-boundary/probabilistic-availability.js";
import { evaluateProbabilisticFallback } from "../../packages/contracts/decision-boundary/probabilistic-fallback.js";

const critical = { risk: "high", criticality: "critical" } as const;
const sourceDescriptor = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:release-risk",
  category: "probabilistic",
} as const;
const sourceMetadata = {
  inferenceRef: "inference:release-risk",
  inferenceContext: {
    confidence: 0.82,
    modelRef: "model:release-risk-v1",
    contextRef: "context:release-88",
  },
} as const;

function sourceAvailability(status: "available" | "unavailable") {
  return evaluateProbabilisticDecisionAvailability({
    descriptor: sourceDescriptor,
    metadata: sourceMetadata,
    riskCriticality: critical,
    availability:
      status === "available"
        ? { status: "available" }
        : { status: "unavailable", diagnostic: "probabilistic evidence unavailable" },
  });
}

test("available probabilistic critical evidence remains canonically auditable and provider-neutral", () => {
  const availability = sourceAvailability("available");
  assert.equal(availability.status, "available");
  if (availability.status !== "available") return;

  const audit = projectCriticalDecisionAuditEvidence({
    descriptor: sourceDescriptor,
    metadata: sourceMetadata,
    riskCriticality: critical,
    verificationResult: availability.verification,
  });

  assert.deepEqual(audit, {
    decisionId: "decision:release-risk",
    category: "probabilistic",
    risk: "high",
    criticality: "critical",
    verificationStatus: "valid",
    reference: { kind: "inference", ref: "inference:release-risk" },
    inferenceContext: sourceMetadata.inferenceContext,
  });
  for (const forbidden of ["provider", "endpoint", "credential", "secret", "payload", "authorized", "approved"]) {
    assert.equal(forbidden in audit, false);
  }
});

test("unavailable probabilistic evidence stays explicit, auditable and non-authoritative without fabricated verification", () => {
  const unavailable = sourceAvailability("unavailable");
  assert.deepEqual(unavailable, {
    status: "unavailable",
    decisionId: "decision:release-risk",
    inferenceRef: "inference:release-risk",
    diagnostic: "probabilistic evidence unavailable",
  });
  assert.equal("verification" in unavailable, false);
  for (const forbidden of ["provider", "endpoint", "credential", "secret", "payload", "authorized", "approved"]) {
    assert.equal(forbidden in unavailable, false);
  }
});

test("explicit deterministic fallback audits only existing deterministic evidence", () => {
  const unavailable = sourceAvailability("unavailable");
  const descriptor = {
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: "decision:release-safe",
    category: "deterministic",
  } as const;
  const metadata = { invariantRef: "invariant:release-safe" } as const;

  const fallback = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:release-safe",
      sourceDecisionId: sourceDescriptor.decisionId,
      targetDecisionId: descriptor.decisionId,
      targetCategory: descriptor.category,
    },
    candidateDescriptor: descriptor,
    candidateMetadata: metadata,
    candidateRiskCriticality: critical,
  });
  assert.equal(fallback.status, "bounded");
  if (fallback.status !== "bounded") return;

  const audit = projectCriticalDecisionAuditEvidence({
    descriptor,
    metadata,
    riskCriticality: critical,
    verificationResult: fallback.verification,
  });
  assert.deepEqual(audit.reference, { kind: "invariant", ref: "invariant:release-safe" });
  assert.equal(audit.category, "deterministic");
  assert.equal("fallbackRef" in audit, false);
  assert.equal("authorized" in audit, false);
  assert.equal("approved" in audit, false);
});

test("human-decision fallback stays human-reserved and mismatched fallback/audit references fail closed", () => {
  const unavailable = sourceAvailability("unavailable");
  const descriptor = {
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: "decision:release-approval",
    category: "human-decision",
  } as const;
  const metadata = { authorityRef: "authority:release-owner" } as const;

  const fallback = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:human-review",
      sourceDecisionId: sourceDescriptor.decisionId,
      targetDecisionId: descriptor.decisionId,
      targetCategory: descriptor.category,
    },
    candidateDescriptor: descriptor,
    candidateMetadata: metadata,
    candidateRiskCriticality: critical,
  });
  assert.equal(fallback.status, "bounded");
  if (fallback.status !== "bounded") return;

  const audit = projectCriticalDecisionAuditEvidence({
    descriptor,
    metadata,
    riskCriticality: critical,
    verificationResult: fallback.verification,
  });
  assert.deepEqual(audit.reference, { kind: "authority", ref: "authority:release-owner" });
  assert.equal("approval" in audit, false);
  assert.equal("approved" in audit, false);
  assert.equal("authorized" in audit, false);

  assert.throws(
    () =>
      projectCriticalDecisionAuditEvidence({
        descriptor: { ...descriptor, decisionId: "decision:other-human" },
        metadata,
        riskCriticality: critical,
        verificationResult: fallback.verification,
      }),
    /verification result does not match normalized decision evidence/,
  );

  const mismatchedFallback = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:mismatch",
      sourceDecisionId: sourceDescriptor.decisionId,
      targetDecisionId: "decision:not-release-approval",
      targetCategory: "human-decision",
    },
    candidateDescriptor: descriptor,
    candidateMetadata: metadata,
    candidateRiskCriticality: critical,
  });
  assert.equal(mismatchedFallback.status, "rejected");
});
