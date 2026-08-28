import {
  normalizeKnowledgePromotionCandidateDescriptor,
  type KnowledgePromotionCandidateDescriptor,
} from "./promotion-candidate.js";

export const KNOWLEDGE_TRANSFORMATION_RESULT_VERSION = "1.0.0" as const;
export const KNOWLEDGE_TRANSFORMATION_KINDS = ["anonymization", "generalization"] as const;
export const KNOWLEDGE_TRANSFORMATION_STATUSES = ["applied"] as const;

export type KnowledgeTransformationKind = (typeof KNOWLEDGE_TRANSFORMATION_KINDS)[number];
export type KnowledgeTransformationStatus = (typeof KNOWLEDGE_TRANSFORMATION_STATUSES)[number];

export type KnowledgeTransformationPolicy = Readonly<{
  policyRef: string;
  permittedKinds: readonly KnowledgeTransformationKind[];
}>;

export type KnowledgeTransformationResult = Readonly<{
  contractVersion: typeof KNOWLEDGE_TRANSFORMATION_RESULT_VERSION;
  transformationRef: string;
  sourceCandidateRef: string;
  classificationDecisionRef: string;
  enforcementRef: string;
  eligibilityRef: string;
  policyRef: string;
  kind: KnowledgeTransformationKind;
  status: KnowledgeTransformationStatus;
}>;

export type KnowledgeTransformationDerivationInput = Readonly<{
  transformationRef: string;
  candidate: unknown;
  policy: KnowledgeTransformationPolicy;
  kind: KnowledgeTransformationKind;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("knowledge transformation result must be an object");
  }
  return value as UnknownRecord;
}

function asRef(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function asKind(value: unknown): KnowledgeTransformationKind {
  if (typeof value !== "string" || !KNOWLEDGE_TRANSFORMATION_KINDS.includes(value as KnowledgeTransformationKind)) {
    throw new Error(`unsupported knowledge transformation kind: ${String(value)}`);
  }
  return value as KnowledgeTransformationKind;
}

function asStatus(value: unknown): KnowledgeTransformationStatus {
  if (value !== "applied") throw new Error(`unsupported knowledge transformation status: ${String(value)}`);
  return "applied";
}

function assertExactFields(record: UnknownRecord): void {
  const allowed = [
    "contractVersion",
    "transformationRef",
    "sourceCandidateRef",
    "classificationDecisionRef",
    "enforcementRef",
    "eligibilityRef",
    "policyRef",
    "kind",
    "status",
  ] as const;
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key as (typeof allowed)[number])) {
      throw new Error(`knowledge transformation result has unexpected field ${key}`);
    }
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`knowledge transformation result is missing field ${key}`);
  }
}

export function normalizeKnowledgeTransformationResult(value: unknown): KnowledgeTransformationResult {
  const record = asRecord(value);
  assertExactFields(record);
  if (record.contractVersion !== KNOWLEDGE_TRANSFORMATION_RESULT_VERSION) {
    throw new Error(`unsupported knowledge transformation result version: ${String(record.contractVersion)}`);
  }
  return {
    contractVersion: KNOWLEDGE_TRANSFORMATION_RESULT_VERSION,
    transformationRef: asRef(record.transformationRef, "transformationRef"),
    sourceCandidateRef: asRef(record.sourceCandidateRef, "sourceCandidateRef"),
    classificationDecisionRef: asRef(record.classificationDecisionRef, "classificationDecisionRef"),
    enforcementRef: asRef(record.enforcementRef, "enforcementRef"),
    eligibilityRef: asRef(record.eligibilityRef, "eligibilityRef"),
    policyRef: asRef(record.policyRef, "policyRef"),
    kind: asKind(record.kind),
    status: asStatus(record.status),
  };
}

function normalizePolicy(policy: KnowledgeTransformationPolicy): KnowledgeTransformationPolicy {
  const policyRef = asRef(policy.policyRef, "policyRef");
  if (!Array.isArray(policy.permittedKinds)) throw new Error("permittedKinds must be an array");
  const permittedKinds = policy.permittedKinds.map(asKind);
  if (new Set(permittedKinds).size !== permittedKinds.length) {
    throw new Error("permittedKinds contains duplicate transformation kind");
  }
  return { policyRef, permittedKinds: [...permittedKinds].sort() };
}

export function deriveKnowledgeTransformationResult(
  input: KnowledgeTransformationDerivationInput,
): KnowledgeTransformationResult {
  const candidate: KnowledgePromotionCandidateDescriptor = normalizeKnowledgePromotionCandidateDescriptor(input.candidate);
  const policy = normalizePolicy(input.policy);
  const kind = asKind(input.kind);
  if (!policy.permittedKinds.includes(kind)) {
    throw new Error(`knowledge transformation kind ${kind} is not permitted by policy`);
  }

  return normalizeKnowledgeTransformationResult({
    contractVersion: KNOWLEDGE_TRANSFORMATION_RESULT_VERSION,
    transformationRef: input.transformationRef,
    sourceCandidateRef: candidate.candidateRef,
    classificationDecisionRef: candidate.classificationDecisionRef,
    enforcementRef: candidate.enforcementRef,
    eligibilityRef: candidate.eligibilityRef,
    policyRef: policy.policyRef,
    kind,
    status: "applied",
  });
}
