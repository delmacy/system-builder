import { evaluateKnowledgeEnforcement, type KnowledgeEnforcementEvaluationInput } from "./enforcement-composition.js";
import { KNOWLEDGE_CLASSES, type KnowledgeClass } from "./index.js";

export const KNOWLEDGE_PROMOTION_CANDIDATE_VERSION = "1.0.0" as const;

export type KnowledgePromotionCandidateDescriptor = Readonly<{
  contractVersion: typeof KNOWLEDGE_PROMOTION_CANDIDATE_VERSION;
  candidateRef: string;
  classificationDecisionRef: string;
  enforcementRef: string;
  eligibilityRef: string;
  knowledgeClass: KnowledgeClass;
}>;

export type KnowledgePromotionCandidateDerivationInput = Readonly<{
  candidateRef: string;
  predecessor: KnowledgeEnforcementEvaluationInput;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("knowledge promotion candidate must be an object");
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord): void {
  const allowed = [
    "contractVersion",
    "candidateRef",
    "classificationDecisionRef",
    "enforcementRef",
    "eligibilityRef",
    "knowledgeClass",
  ] as const;
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key as (typeof allowed)[number])) {
      throw new Error(`knowledge promotion candidate has unexpected field ${key}`);
    }
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`knowledge promotion candidate is missing field ${key}`);
  }
}

function asRef(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function asKnowledgeClass(value: unknown): KnowledgeClass {
  if (typeof value !== "string" || !KNOWLEDGE_CLASSES.includes(value as KnowledgeClass)) {
    throw new Error(`unsupported knowledge class: ${String(value)}`);
  }
  return value as KnowledgeClass;
}

export function normalizeKnowledgePromotionCandidateDescriptor(value: unknown): KnowledgePromotionCandidateDescriptor {
  const record = asRecord(value);
  assertExactFields(record);
  if (record.contractVersion !== KNOWLEDGE_PROMOTION_CANDIDATE_VERSION) {
    throw new Error(`unsupported knowledge promotion candidate version: ${String(record.contractVersion)}`);
  }
  return {
    contractVersion: KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
    candidateRef: asRef(record.candidateRef, "candidateRef"),
    classificationDecisionRef: asRef(record.classificationDecisionRef, "classificationDecisionRef"),
    enforcementRef: asRef(record.enforcementRef, "enforcementRef"),
    eligibilityRef: asRef(record.eligibilityRef, "eligibilityRef"),
    knowledgeClass: asKnowledgeClass(record.knowledgeClass),
  };
}

export function deriveKnowledgePromotionCandidateDescriptor(
  input: KnowledgePromotionCandidateDerivationInput,
): KnowledgePromotionCandidateDescriptor {
  const predecessor = evaluateKnowledgeEnforcement(input.predecessor);
  if (predecessor.eligibilityStatus !== "eligible") {
    throw new Error("knowledge promotion candidate requires canonical eligible predecessor state");
  }
  return normalizeKnowledgePromotionCandidateDescriptor({
    contractVersion: KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
    candidateRef: input.candidateRef,
    classificationDecisionRef: predecessor.classificationDecisionRef,
    enforcementRef: predecessor.enforcementRef,
    eligibilityRef: predecessor.eligibilityRef,
    knowledgeClass: predecessor.knowledgeClass,
  });
}
