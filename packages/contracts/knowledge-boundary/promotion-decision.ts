import { verifyDecisionBoundary } from "../decision-boundary/index.js";
import {
  normalizeKnowledgeGenericityEvidence,
  type KnowledgeGenericityEvidence,
} from "./genericity-evidence.js";
import {
  normalizeKnowledgePromotionCandidateDescriptor,
  type KnowledgePromotionCandidateDescriptor,
} from "./promotion-candidate.js";
import {
  normalizeKnowledgeTransformationResult,
  type KnowledgeTransformationResult,
} from "./transformation-result.js";

export const KNOWLEDGE_PROMOTION_DECISION_VERSION = "1.0.0" as const;
export const KNOWLEDGE_PROMOTION_DISPOSITIONS = ["promote", "reject"] as const;

export type KnowledgePromotionDisposition = (typeof KNOWLEDGE_PROMOTION_DISPOSITIONS)[number];

export type KnowledgePromotionDecision = Readonly<{
  contractVersion: typeof KNOWLEDGE_PROMOTION_DECISION_VERSION;
  decisionRef: string;
  disposition: KnowledgePromotionDisposition;
  decisionActorRef: string;
  humanDecisionId: string;
  humanAuthorityRef: string;
  candidateRef: string;
  transformationRef: string;
  genericityEvidenceRef: string;
}>;

export type KnowledgePromotionDecisionInput = Readonly<{
  decisionRef: string;
  disposition: KnowledgePromotionDisposition;
  decisionActorRef: string;
  candidate: unknown;
  transformation: unknown;
  genericityEvidence: unknown;
  humanAuthority: Readonly<{
    descriptor: unknown;
    metadata: unknown;
    riskCriticality: unknown;
  }>;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("knowledge promotion decision must be an object");
  }
  return value as UnknownRecord;
}

function asRef(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function asDisposition(value: unknown): KnowledgePromotionDisposition {
  if (typeof value !== "string" || !KNOWLEDGE_PROMOTION_DISPOSITIONS.includes(value as KnowledgePromotionDisposition)) {
    throw new Error(`unsupported knowledge promotion disposition: ${String(value)}`);
  }
  return value as KnowledgePromotionDisposition;
}

function assertExactFields(record: UnknownRecord): void {
  const allowed = [
    "contractVersion",
    "decisionRef",
    "disposition",
    "decisionActorRef",
    "humanDecisionId",
    "humanAuthorityRef",
    "candidateRef",
    "transformationRef",
    "genericityEvidenceRef",
  ] as const;
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key as (typeof allowed)[number])) {
      throw new Error(`knowledge promotion decision has unexpected field ${key}`);
    }
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`knowledge promotion decision is missing field ${key}`);
  }
}

export function normalizeKnowledgePromotionDecision(value: unknown): KnowledgePromotionDecision {
  const record = asRecord(value);
  assertExactFields(record);
  if (record.contractVersion !== KNOWLEDGE_PROMOTION_DECISION_VERSION) {
    throw new Error(`unsupported knowledge promotion decision version: ${String(record.contractVersion)}`);
  }
  return {
    contractVersion: KNOWLEDGE_PROMOTION_DECISION_VERSION,
    decisionRef: asRef(record.decisionRef, "decisionRef"),
    disposition: asDisposition(record.disposition),
    decisionActorRef: asRef(record.decisionActorRef, "decisionActorRef"),
    humanDecisionId: asRef(record.humanDecisionId, "humanDecisionId"),
    humanAuthorityRef: asRef(record.humanAuthorityRef, "humanAuthorityRef"),
    candidateRef: asRef(record.candidateRef, "candidateRef"),
    transformationRef: asRef(record.transformationRef, "transformationRef"),
    genericityEvidenceRef: asRef(record.genericityEvidenceRef, "genericityEvidenceRef"),
  };
}

function assertEvidenceChain(
  candidate: KnowledgePromotionCandidateDescriptor,
  transformation: KnowledgeTransformationResult,
  evidence: KnowledgeGenericityEvidence,
): void {
  if (transformation.sourceCandidateRef !== candidate.candidateRef) {
    throw new Error("promotion decision candidate/transformation mismatch");
  }
  if (evidence.candidateRef !== candidate.candidateRef) {
    throw new Error("promotion decision genericity evidence candidate mismatch");
  }
  if (evidence.transformationRef !== transformation.transformationRef) {
    throw new Error("promotion decision genericity evidence transformation mismatch");
  }
}

export function deriveKnowledgePromotionDecision(input: KnowledgePromotionDecisionInput): KnowledgePromotionDecision {
  const candidate = normalizeKnowledgePromotionCandidateDescriptor(input.candidate);
  const transformation = normalizeKnowledgeTransformationResult(input.transformation);
  const evidence = normalizeKnowledgeGenericityEvidence(input.genericityEvidence);
  assertEvidenceChain(candidate, transformation, evidence);

  const disposition = asDisposition(input.disposition);
  if (disposition === "promote" && evidence.result !== "supports-genericity") {
    throw new Error("promotion decision cannot promote when genericity evidence rejects genericity");
  }

  const verification = verifyDecisionBoundary({
    descriptor: input.humanAuthority.descriptor,
    metadata: input.humanAuthority.metadata,
    riskCriticality: input.humanAuthority.riskCriticality,
    expectedCategory: "human-decision",
  });
  if (verification.status !== "valid" || verification.category !== "human-decision" || verification.reference.kind !== "authority") {
    throw new Error("promotion decision requires verified human-decision authority");
  }

  const decisionActorRef = asRef(input.decisionActorRef, "decisionActorRef");
  if (decisionActorRef !== verification.reference.ref) {
    throw new Error("promotion decision actor must match verified human authorityRef");
  }

  return normalizeKnowledgePromotionDecision({
    contractVersion: KNOWLEDGE_PROMOTION_DECISION_VERSION,
    decisionRef: input.decisionRef,
    disposition,
    decisionActorRef,
    humanDecisionId: verification.decisionId,
    humanAuthorityRef: verification.reference.ref,
    candidateRef: candidate.candidateRef,
    transformationRef: transformation.transformationRef,
    genericityEvidenceRef: evidence.evidenceRef,
  });
}
