import {
  composeKnowledgePromotionControl,
  type KnowledgePromotionControlCompositionInput,
} from "@system-builder/contracts/knowledge-boundary";

export const OBSERVE_KNOWLEDGE_PROMOTION_PROVENANCE_VERSION = "1.0.0" as const;

export type ObserveKnowledgePromotionProvenanceProjection = Readonly<{
  contractVersion: typeof OBSERVE_KNOWLEDGE_PROMOTION_PROVENANCE_VERSION;
  disposition: "promote" | "reject";
  candidateRef: string;
  classificationDecisionRef: string;
  enforcementRef: string;
  eligibilityRef: string;
  transformationRef: string;
  genericityEvidenceRef: string;
  promotionDecisionRef: string;
  humanDecisionId: string;
  humanAuthorityRef: string;
}>;

function assertUniqueProvenanceReferences(references: readonly string[]): void {
  if (new Set(references).size !== references.length) {
    throw new Error("knowledge promotion observation provenance must not contain duplicate references");
  }
}

/**
 * Projects WBS 17.3 promotion/rejection truth into Observe while keeping
 * canonical validation inside the boundary. Callers provide only the
 * canonical composition input; they cannot inject a validator/normalizer.
 */
export function projectKnowledgePromotionProvenanceForObservation(
  input: KnowledgePromotionControlCompositionInput,
): ObserveKnowledgePromotionProvenanceProjection {
  const composition = composeKnowledgePromotionControl(input);
  const references = [
    composition.candidate.candidateRef,
    composition.candidate.classificationDecisionRef,
    composition.candidate.enforcementRef,
    composition.candidate.eligibilityRef,
    composition.transformation.transformationRef,
    composition.genericityEvidence.evidenceRef,
    composition.decision.decisionRef,
    composition.decision.humanDecisionId,
    composition.decision.humanAuthorityRef,
  ] as const;
  assertUniqueProvenanceReferences(references);

  return Object.freeze({
    contractVersion: OBSERVE_KNOWLEDGE_PROMOTION_PROVENANCE_VERSION,
    disposition: composition.decision.disposition,
    candidateRef: composition.candidate.candidateRef,
    classificationDecisionRef: composition.candidate.classificationDecisionRef,
    enforcementRef: composition.candidate.enforcementRef,
    eligibilityRef: composition.candidate.eligibilityRef,
    transformationRef: composition.transformation.transformationRef,
    genericityEvidenceRef: composition.genericityEvidence.evidenceRef,
    promotionDecisionRef: composition.decision.decisionRef,
    humanDecisionId: composition.decision.humanDecisionId,
    humanAuthorityRef: composition.decision.humanAuthorityRef,
  });
}
