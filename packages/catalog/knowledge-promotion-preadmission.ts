import {
  deriveKnowledgeGenericityEvidence,
  type KnowledgeGenericityEvidenceKind,
  type KnowledgeGenericityEvidenceResult,
} from "../contracts/knowledge-boundary/genericity-evidence.js";
import {
  deriveKnowledgePromotionCandidateDescriptor,
  type KnowledgePromotionCandidateDerivationInput,
} from "../contracts/knowledge-boundary/promotion-candidate.js";
import {
  deriveKnowledgeTransformationResult,
  type KnowledgeTransformationKind,
  type KnowledgeTransformationPolicy,
} from "../contracts/knowledge-boundary/transformation-result.js";

export const CATALOG_KNOWLEDGE_PROMOTION_PREADMISSION_VERSION = "1.0.0" as const;

export type CatalogKnowledgePromotionPreAdmissionInput = Readonly<{
  candidateRef: string;
  predecessor: KnowledgePromotionCandidateDerivationInput["predecessor"];
  transformation: Readonly<{
    transformationRef: string;
    policy: KnowledgeTransformationPolicy;
    kind: KnowledgeTransformationKind;
  }>;
  genericityEvidence: Readonly<{
    evidenceRef: string;
    evidenceKind: KnowledgeGenericityEvidenceKind;
    result: KnowledgeGenericityEvidenceResult;
    sourceRef: string;
  }>;
}>;

export type CatalogKnowledgePromotionPreAdmission = Readonly<{
  contractVersion: typeof CATALOG_KNOWLEDGE_PROMOTION_PREADMISSION_VERSION;
  status: "review-ready";
  candidateRef: string;
  classificationDecisionRef: string;
  enforcementRef: string;
  eligibilityRef: string;
  transformationRef: string;
  genericityEvidenceRef: string;
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

function assertInputShape(input: CatalogKnowledgePromotionPreAdmissionInput): void {
  assertExactKeys(
    input,
    ["candidateRef", "predecessor", "transformation", "genericityEvidence"],
    "catalog knowledge promotion pre-admission input",
  );
  assertExactKeys(
    input.transformation,
    ["transformationRef", "policy", "kind"],
    "catalog knowledge promotion transformation",
  );
  assertExactKeys(
    input.transformation.policy,
    ["policyRef", "permittedKinds"],
    "catalog knowledge promotion transformation policy",
  );
  assertExactKeys(
    input.genericityEvidence,
    ["evidenceRef", "evidenceKind", "result", "sourceRef"],
    "catalog knowledge promotion genericity evidence",
  );
}

export function evaluateCatalogKnowledgePromotionPreAdmission(
  input: CatalogKnowledgePromotionPreAdmissionInput,
): CatalogKnowledgePromotionPreAdmission {
  assertInputShape(input);

  const candidate = deriveKnowledgePromotionCandidateDescriptor({
    candidateRef: input.candidateRef,
    predecessor: input.predecessor,
  });
  const transformation = deriveKnowledgeTransformationResult({
    transformationRef: input.transformation.transformationRef,
    candidate,
    policy: input.transformation.policy,
    kind: input.transformation.kind,
  });
  const genericityEvidence = deriveKnowledgeGenericityEvidence({
    evidenceRef: input.genericityEvidence.evidenceRef,
    candidate,
    transformation,
    evidenceKind: input.genericityEvidence.evidenceKind,
    result: input.genericityEvidence.result,
    sourceRef: input.genericityEvidence.sourceRef,
  });

  if (genericityEvidence.result !== "supports-genericity") {
    throw new Error("catalog knowledge promotion pre-admission requires genericity-supporting evidence");
  }

  return Object.freeze({
    contractVersion: CATALOG_KNOWLEDGE_PROMOTION_PREADMISSION_VERSION,
    status: "review-ready",
    candidateRef: candidate.candidateRef,
    classificationDecisionRef: candidate.classificationDecisionRef,
    enforcementRef: candidate.enforcementRef,
    eligibilityRef: candidate.eligibilityRef,
    transformationRef: transformation.transformationRef,
    genericityEvidenceRef: genericityEvidence.evidenceRef,
  });
}
