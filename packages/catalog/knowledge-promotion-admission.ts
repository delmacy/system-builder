import {
  composeKnowledgePromotionControl,
  type KnowledgePromotionControlCompositionInput,
} from "@system-builder/contracts/knowledge-boundary";

import {
  evaluateCatalogKnowledgePromotionPreAdmission,
  type CatalogKnowledgePromotionPreAdmissionInput,
} from "./knowledge-promotion-preadmission.js";

export const CATALOG_KNOWLEDGE_PROMOTION_ADMISSION_VERSION = "1.0.0" as const;

export type CatalogKnowledgePromotionAdmissionInput = Readonly<{
  review: CatalogKnowledgePromotionPreAdmissionInput;
  promotionDecision: KnowledgePromotionControlCompositionInput["promotionDecision"];
}>;

export type CatalogKnowledgePromotionAdmission = Readonly<{
  contractVersion: typeof CATALOG_KNOWLEDGE_PROMOTION_ADMISSION_VERSION;
  status: "admitted";
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

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactKeys(value: unknown, allowed: readonly string[], label: string): void {
  const record = asRecord(value, label);
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function assertInputShape(input: CatalogKnowledgePromotionAdmissionInput): void {
  assertExactKeys(input, ["review", "promotionDecision"], "catalog knowledge promotion admission input");
  assertExactKeys(
    input.promotionDecision,
    ["decisionRef", "disposition", "decisionActorRef", "humanAuthority"],
    "catalog knowledge promotion decision",
  );
  assertExactKeys(
    input.promotionDecision.humanAuthority,
    ["descriptor", "metadata", "riskCriticality"],
    "catalog knowledge promotion human authority",
  );
}

export function evaluateCatalogKnowledgePromotionAdmission(
  input: CatalogKnowledgePromotionAdmissionInput,
): CatalogKnowledgePromotionAdmission {
  assertInputShape(input);

  const review = evaluateCatalogKnowledgePromotionPreAdmission(input.review);
  const composition = composeKnowledgePromotionControl({
    candidateRef: input.review.candidateRef,
    predecessor: input.review.predecessor,
    transformation: input.review.transformation,
    genericityEvidence: input.review.genericityEvidence,
    promotionDecision: input.promotionDecision,
  });

  if (composition.decision.disposition !== "promote") {
    throw new Error("catalog knowledge promotion admission requires canonical promote decision");
  }
  if (
    review.candidateRef !== composition.decision.candidateRef ||
    review.transformationRef !== composition.decision.transformationRef ||
    review.genericityEvidenceRef !== composition.decision.genericityEvidenceRef
  ) {
    throw new Error("catalog knowledge promotion admission decision provenance mismatch");
  }

  return Object.freeze({
    contractVersion: CATALOG_KNOWLEDGE_PROMOTION_ADMISSION_VERSION,
    status: "admitted",
    candidateRef: review.candidateRef,
    classificationDecisionRef: review.classificationDecisionRef,
    enforcementRef: review.enforcementRef,
    eligibilityRef: review.eligibilityRef,
    transformationRef: review.transformationRef,
    genericityEvidenceRef: review.genericityEvidenceRef,
    promotionDecisionRef: composition.decision.decisionRef,
    humanDecisionId: composition.decision.humanDecisionId,
    humanAuthorityRef: composition.decision.humanAuthorityRef,
  });
}
