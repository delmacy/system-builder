import {
  evaluateKnowledgeEnforcement,
  type KnowledgeEnforcementEvaluationInput,
} from "./enforcement-composition.js";

export const KNOWLEDGE_CATALOG_ADMISSION_VERSION = "1.0.0" as const;

export type KnowledgeCatalogAdmission = Readonly<{
  contractVersion: typeof KNOWLEDGE_CATALOG_ADMISSION_VERSION;
  status: "admit" | "reject";
  enforcementRef: string;
  classificationDecisionRef: string;
  eligibilityRef: string;
  authorityRef: string;
  reasonIds: readonly string[];
}>;

export function evaluateKnowledgeCatalogAdmission(
  input: KnowledgeEnforcementEvaluationInput,
): KnowledgeCatalogAdmission {
  const enforcement = evaluateKnowledgeEnforcement(input);
  const admitted = enforcement.enforcementOutcome === "allow" && enforcement.eligibilityStatus === "eligible";

  return Object.freeze({
    contractVersion: KNOWLEDGE_CATALOG_ADMISSION_VERSION,
    status: admitted ? "admit" : "reject",
    enforcementRef: enforcement.enforcementRef,
    classificationDecisionRef: enforcement.classificationDecisionRef,
    eligibilityRef: enforcement.eligibilityRef,
    authorityRef: enforcement.authorityRef,
    reasonIds: Object.freeze([...enforcement.reasonIds]),
  });
}
