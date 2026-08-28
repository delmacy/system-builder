import {
  normalizeKnowledgePromotionCandidateDescriptor,
  type KnowledgePromotionCandidateDescriptor,
} from "./promotion-candidate.js";
import {
  normalizeKnowledgeTransformationResult,
  type KnowledgeTransformationResult,
} from "./transformation-result.js";

export const KNOWLEDGE_GENERICITY_EVIDENCE_VERSION = "1.0.0" as const;
export const KNOWLEDGE_GENERICITY_EVIDENCE_KINDS = [
  "human-review",
  "deterministic-test",
  "probabilistic-assessment",
] as const;
export const KNOWLEDGE_GENERICITY_EVIDENCE_RESULTS = [
  "supports-genericity",
  "rejects-genericity",
] as const;

export type KnowledgeGenericityEvidenceKind = (typeof KNOWLEDGE_GENERICITY_EVIDENCE_KINDS)[number];
export type KnowledgeGenericityEvidenceResult = (typeof KNOWLEDGE_GENERICITY_EVIDENCE_RESULTS)[number];

export type KnowledgeGenericityEvidence = Readonly<{
  contractVersion: typeof KNOWLEDGE_GENERICITY_EVIDENCE_VERSION;
  evidenceRef: string;
  candidateRef: string;
  transformationRef: string;
  evidenceKind: KnowledgeGenericityEvidenceKind;
  result: KnowledgeGenericityEvidenceResult;
  sourceRef: string;
}>;

export type KnowledgeGenericityEvidenceInput = Readonly<{
  evidenceRef: string;
  candidate: unknown;
  transformation: unknown;
  evidenceKind: KnowledgeGenericityEvidenceKind;
  result: KnowledgeGenericityEvidenceResult;
  sourceRef: string;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("knowledge genericity evidence must be an object");
  }
  return value as UnknownRecord;
}

function asRef(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function asKind(value: unknown): KnowledgeGenericityEvidenceKind {
  if (
    typeof value !== "string" ||
    !KNOWLEDGE_GENERICITY_EVIDENCE_KINDS.includes(value as KnowledgeGenericityEvidenceKind)
  ) {
    throw new Error(`unsupported genericity evidence kind: ${String(value)}`);
  }
  return value as KnowledgeGenericityEvidenceKind;
}

function asResult(value: unknown): KnowledgeGenericityEvidenceResult {
  if (
    typeof value !== "string" ||
    !KNOWLEDGE_GENERICITY_EVIDENCE_RESULTS.includes(value as KnowledgeGenericityEvidenceResult)
  ) {
    throw new Error(`unsupported genericity evidence result: ${String(value)}`);
  }
  return value as KnowledgeGenericityEvidenceResult;
}

function assertExactFields(record: UnknownRecord): void {
  const allowed = [
    "contractVersion",
    "evidenceRef",
    "candidateRef",
    "transformationRef",
    "evidenceKind",
    "result",
    "sourceRef",
  ] as const;
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key as (typeof allowed)[number])) {
      throw new Error(`knowledge genericity evidence has unexpected field ${key}`);
    }
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`knowledge genericity evidence is missing field ${key}`);
  }
}

export function normalizeKnowledgeGenericityEvidence(value: unknown): KnowledgeGenericityEvidence {
  const record = asRecord(value);
  assertExactFields(record);
  if (record.contractVersion !== KNOWLEDGE_GENERICITY_EVIDENCE_VERSION) {
    throw new Error(`unsupported knowledge genericity evidence version: ${String(record.contractVersion)}`);
  }
  return {
    contractVersion: KNOWLEDGE_GENERICITY_EVIDENCE_VERSION,
    evidenceRef: asRef(record.evidenceRef, "evidenceRef"),
    candidateRef: asRef(record.candidateRef, "candidateRef"),
    transformationRef: asRef(record.transformationRef, "transformationRef"),
    evidenceKind: asKind(record.evidenceKind),
    result: asResult(record.result),
    sourceRef: asRef(record.sourceRef, "sourceRef"),
  };
}

function assertPredecessorMatch(
  candidate: KnowledgePromotionCandidateDescriptor,
  transformation: KnowledgeTransformationResult,
): void {
  if (transformation.sourceCandidateRef !== candidate.candidateRef) {
    throw new Error("genericity evidence candidateRef must match transformation sourceCandidateRef");
  }
  if (transformation.classificationDecisionRef !== candidate.classificationDecisionRef) {
    throw new Error("genericity evidence classificationDecisionRef predecessor mismatch");
  }
  if (transformation.enforcementRef !== candidate.enforcementRef) {
    throw new Error("genericity evidence enforcementRef predecessor mismatch");
  }
  if (transformation.eligibilityRef !== candidate.eligibilityRef) {
    throw new Error("genericity evidence eligibilityRef predecessor mismatch");
  }
}

export function deriveKnowledgeGenericityEvidence(
  input: KnowledgeGenericityEvidenceInput,
): KnowledgeGenericityEvidence {
  const candidate = normalizeKnowledgePromotionCandidateDescriptor(input.candidate);
  const transformation = normalizeKnowledgeTransformationResult(input.transformation);
  assertPredecessorMatch(candidate, transformation);

  return normalizeKnowledgeGenericityEvidence({
    contractVersion: KNOWLEDGE_GENERICITY_EVIDENCE_VERSION,
    evidenceRef: input.evidenceRef,
    candidateRef: candidate.candidateRef,
    transformationRef: transformation.transformationRef,
    evidenceKind: input.evidenceKind,
    result: input.result,
    sourceRef: input.sourceRef,
  });
}
