import {
  isCanonicalDecisionBoundaryVerificationResult,
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  normalizeDecisionRiskCriticality,
  type DecisionBoundaryVerificationReference,
  type DecisionBoundaryVerificationResult,
  type DecisionCategory,
  type DecisionRiskLevel,
  type ProbabilisticInferenceContext,
} from "./index.js";

export type CriticalDecisionAuditProjection = Readonly<{
  decisionId: string;
  category: DecisionCategory;
  risk: DecisionRiskLevel;
  criticality: "critical";
  verificationStatus: "valid" | "rejected";
  reference: DecisionBoundaryVerificationReference;
  inferenceContext?: ProbabilisticInferenceContext;
}>;

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid critical decision audit evidence at ${path}: ${reason}`);
}

function sameReference(left: DecisionBoundaryVerificationReference, right: DecisionBoundaryVerificationReference): boolean {
  return left.kind === right.kind && left.ref === right.ref;
}

export function projectCriticalDecisionAuditEvidence(input: Readonly<{
  descriptor: unknown;
  metadata: unknown;
  riskCriticality: unknown;
  verificationResult: DecisionBoundaryVerificationResult;
}>): CriticalDecisionAuditProjection {
  const descriptor = normalizeDecisionBoundaryDescriptor(input.descriptor);
  const metadata = normalizeDecisionCategoryMetadata(descriptor.category, input.metadata);
  const riskCriticality = normalizeDecisionRiskCriticality(input.riskCriticality);

  if (riskCriticality.criticality !== "critical") fail("$audit.riskCriticality.criticality", "critical decision required");
  if (input.verificationResult.status === "invalid") fail("$audit.verificationResult.status", "invalid verification result cannot be audited");
  if (!isCanonicalDecisionBoundaryVerificationResult(input.verificationResult)) {
    fail("$audit.verificationResult", "verification result was not established by canonical verification boundary");
  }

  const expectedReference: DecisionBoundaryVerificationReference =
    metadata.category === "deterministic"
      ? { kind: "invariant", ref: metadata.metadata.invariantRef }
      : metadata.category === "human-decision"
        ? { kind: "authority", ref: metadata.metadata.authorityRef }
        : { kind: "inference", ref: metadata.metadata.inferenceRef };

  const verification = input.verificationResult;
  if (
    verification.decisionId !== descriptor.decisionId ||
    verification.category !== descriptor.category ||
    verification.risk !== riskCriticality.risk ||
    verification.criticality !== riskCriticality.criticality ||
    !sameReference(verification.reference, expectedReference)
  ) {
    fail("$audit.verificationResult", "verification result does not match normalized decision evidence");
  }

  const common = {
    decisionId: descriptor.decisionId,
    category: descriptor.category,
    risk: riskCriticality.risk,
    criticality: "critical" as const,
    verificationStatus: verification.status,
    reference: expectedReference,
  };

  if (metadata.category !== "probabilistic") return common;
  return {
    ...common,
    inferenceContext: {
      confidence: metadata.metadata.inferenceContext.confidence,
      modelRef: metadata.metadata.inferenceContext.modelRef,
      contextRef: metadata.metadata.inferenceContext.contextRef,
    },
  };
}
