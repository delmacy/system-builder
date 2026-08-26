import assert from "node:assert/strict";
import test from "node:test";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import { evaluateProbabilisticDecisionAvailability } from "../../packages/contracts/decision-boundary/probabilistic-availability.js";
import { evaluateProbabilisticFallback } from "../../packages/contracts/decision-boundary/probabilistic-fallback.js";

const critical = { risk: "high", criticality: "critical" } as const;
const probabilisticDescriptor = {
  boundaryVersion: DECISION_BOUNDARY_VERSION,
  decisionId: "decision:deployment-risk",
  category: "probabilistic",
} as const;
const probabilisticMetadata = {
  inferenceRef: "inference:deployment-risk",
  inferenceContext: {
    confidence: 0.76,
    modelRef: "model:deployment-risk-v1",
    contextRef: "context:release-144",
  },
} as const;

function availability(status: "available" | "unavailable") {
  return evaluateProbabilisticDecisionAvailability({
    descriptor: probabilisticDescriptor,
    metadata: probabilisticMetadata,
    riskCriticality: critical,
    availability:
      status === "available"
        ? { status: "available" }
        : { status: "unavailable", diagnostic: "inference source unavailable" },
  });
}

function boundedFallback(
  targetCategory: "deterministic" | "human-decision",
  targetDecisionId: string,
  candidateMetadata: Readonly<{ invariantRef: string }> | Readonly<{ authorityRef: string }>,
) {
  const sourceAvailability = availability("unavailable");
  return evaluateProbabilisticFallback({
    sourceAvailability,
    fallback: {
      fallbackRef: `fallback:${targetCategory}`,
      sourceDecisionId: probabilisticDescriptor.decisionId,
      targetDecisionId,
      targetCategory,
    },
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: targetDecisionId,
      category: targetCategory,
    },
    candidateMetadata,
    candidateRiskCriticality: critical,
  });
}

test("integrated resilience matrix keeps available probabilistic evidence explicit and auditable", () => {
  const result = availability("available");
  assert.equal(result.status, "available");
  if (result.status !== "available") return;

  const audit = projectCriticalDecisionAuditEvidence({
    descriptor: probabilisticDescriptor,
    metadata: probabilisticMetadata,
    riskCriticality: critical,
    verificationResult: result.verification,
  });

  assert.deepEqual(audit, {
    decisionId: probabilisticDescriptor.decisionId,
    category: "probabilistic",
    risk: "high",
    criticality: "critical",
    verificationStatus: "valid",
    reference: { kind: "inference", ref: probabilisticMetadata.inferenceRef },
    inferenceContext: probabilisticMetadata.inferenceContext,
  });
  for (const forbidden of ["provider", "endpoint", "credential", "secret", "payload", "authorized", "approved"]) {
    assert.equal(forbidden in audit, false);
  }
});

test("integrated resilience matrix keeps unavailability explicit and requires an explicit bounded fallback", () => {
  const unavailable = availability("unavailable");
  assert.deepEqual(unavailable, {
    status: "unavailable",
    decisionId: probabilisticDescriptor.decisionId,
    inferenceRef: probabilisticMetadata.inferenceRef,
    diagnostic: "inference source unavailable",
  });
  assert.equal("verification" in unavailable, false);

  const implicit = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {},
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:safe-deploy",
      category: "deterministic",
    },
    candidateMetadata: { invariantRef: "invariant:safe-deploy" },
    candidateRiskCriticality: critical,
  });
  assert.equal(implicit.status, "invalid");

  const mismatched = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:mismatch",
      sourceDecisionId: "decision:other-source",
      targetDecisionId: "decision:safe-deploy",
      targetCategory: "deterministic",
    },
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:safe-deploy",
      category: "deterministic",
    },
    candidateMetadata: { invariantRef: "invariant:safe-deploy" },
    candidateRiskCriticality: critical,
  });
  assert.equal(mismatched.status, "rejected");
});

test("integrated deterministic fallback preserves invariant evidence and cannot be satisfied by probabilistic output", () => {
  const fallback = boundedFallback("deterministic", "decision:safe-deploy", {
    invariantRef: "invariant:safe-deploy",
  });
  assert.equal(fallback.status, "bounded");
  if (fallback.status !== "bounded") return;
  assert.equal(fallback.targetCategory, "deterministic");
  assert.equal(fallback.verification.status, "valid");
  if (fallback.verification.status !== "valid") return;
  assert.deepEqual(fallback.verification.reference, { kind: "invariant", ref: "invariant:safe-deploy" });

  const unavailable = availability("unavailable");
  const probabilisticTarget = evaluateProbabilisticFallback({
    sourceAvailability: unavailable,
    fallback: {
      fallbackRef: "fallback:another-model",
      sourceDecisionId: probabilisticDescriptor.decisionId,
      targetDecisionId: "decision:another-model",
      targetCategory: "probabilistic",
    },
    candidateDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:another-model",
      category: "probabilistic",
    },
    candidateMetadata: probabilisticMetadata,
    candidateRiskCriticality: critical,
  });
  assert.equal(probabilisticTarget.status, "rejected");
});

test("integrated human fallback remains reservation evidence, never approval or authorization", () => {
  const fallback = boundedFallback("human-decision", "decision:deployment-approval", {
    authorityRef: "authority:deployment-owner",
  });
  assert.equal(fallback.status, "bounded");
  if (fallback.status !== "bounded") return;

  const descriptor = {
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: "decision:deployment-approval",
    category: "human-decision",
  } as const;
  const metadata = { authorityRef: "authority:deployment-owner" } as const;
  const audit = projectCriticalDecisionAuditEvidence({
    descriptor,
    metadata,
    riskCriticality: critical,
    verificationResult: fallback.verification,
  });

  assert.equal(audit.category, "human-decision");
  assert.equal(audit.risk, "high");
  assert.equal(audit.criticality, "critical");
  assert.deepEqual(audit.reference, { kind: "authority", ref: "authority:deployment-owner" });
  for (const forbidden of ["approval", "approved", "authorization", "authorized", "provider", "payload", "secret"]) {
    assert.equal(forbidden in audit, false);
    assert.equal(forbidden in fallback, false);
  }
});
