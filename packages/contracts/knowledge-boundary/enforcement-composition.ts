import {
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  evaluateKnowledgePromotionEligibility,
  normalizeKnowledgeClassificationBundle,
  normalizeKnowledgeEnforcementDisposition,
  type KnowledgeClass,
  type KnowledgeEnforcementOutcome,
  type KnowledgePromotionEligibilityStatus,
} from "./index.js";

export const KNOWLEDGE_ENFORCEMENT_EVALUATION_VERSION = "1.0.0" as const;

export type KnowledgeEnforcementEvaluationInput = Readonly<{
  bundle: unknown;
  usePolicyRef: string;
  enforcement: unknown;
  eligibilityRef: string;
  permissionRef: string | null;
}>;

export type KnowledgeEnforcementEvaluation = Readonly<{
  contractVersion: typeof KNOWLEDGE_ENFORCEMENT_EVALUATION_VERSION;
  enforcementRef: string;
  eligibilityRef: string;
  classificationDecisionRef: string;
  usePolicyRef: string;
  knowledgeClass: KnowledgeClass;
  ownerRef: string;
  purposeId: string;
  restrictionIds: readonly string[];
  authorityRef: string;
  enforcementOutcome: KnowledgeEnforcementOutcome;
  eligibilityStatus: KnowledgePromotionEligibilityStatus;
  permissionRef: string | null;
  reasonIds: readonly string[];
}>;

function asNonEmptyTrimmedString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

export function evaluateKnowledgeEnforcement(
  input: KnowledgeEnforcementEvaluationInput,
): KnowledgeEnforcementEvaluation {
  const bundle = normalizeKnowledgeClassificationBundle(input.bundle);
  const enforcement = normalizeKnowledgeEnforcementDisposition(input.enforcement);
  const usePolicyRef = asNonEmptyTrimmedString(input.usePolicyRef, "usePolicyRef");
  const eligibilityRef = asNonEmptyTrimmedString(input.eligibilityRef, "eligibilityRef");

  if (enforcement.contractVersion !== KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION) {
    throw new Error("enforcement disposition version mismatch");
  }
  if (enforcement.classificationDecisionRef !== bundle.decision.decisionRef) {
    throw new Error("enforcement classificationDecisionRef must match canonical classification decisionRef");
  }
  if (enforcement.usePolicyRef !== usePolicyRef) {
    throw new Error("enforcement usePolicyRef must match canonical use policy reference");
  }
  if (!bundle.usePolicy.purposeIds.includes(enforcement.purposeId)) {
    throw new Error("enforcement purposeId must be explicitly allowed by canonical use policy");
  }

  const eligibility = evaluateKnowledgePromotionEligibility({
    eligibilityRef,
    knowledgeClass: bundle.classification.knowledgeClass,
    enforcement,
    policyCompatible: true,
    permissionRef: input.permissionRef,
  });

  return {
    contractVersion: KNOWLEDGE_ENFORCEMENT_EVALUATION_VERSION,
    enforcementRef: enforcement.enforcementRef,
    eligibilityRef: eligibility.eligibilityRef,
    classificationDecisionRef: bundle.decision.decisionRef,
    usePolicyRef,
    knowledgeClass: bundle.classification.knowledgeClass,
    ownerRef: bundle.classification.ownerRef,
    purposeId: enforcement.purposeId,
    restrictionIds: bundle.usePolicy.restrictionIds,
    authorityRef: bundle.decision.humanAuthority.metadata.authorityRef,
    enforcementOutcome: enforcement.outcome,
    eligibilityStatus: eligibility.status,
    permissionRef: eligibility.permissionRef,
    reasonIds: eligibility.reasonIds,
  };
}
