import type { KnowledgeEnforcementEvaluationInput } from "./enforcement-composition.js";
import {
  deriveKnowledgeGenericityEvidence,
  type KnowledgeGenericityEvidence,
  type KnowledgeGenericityEvidenceKind,
  type KnowledgeGenericityEvidenceResult,
} from "./genericity-evidence.js";
import {
  deriveKnowledgePromotionCandidateDescriptor,
  type KnowledgePromotionCandidateDescriptor,
} from "./promotion-candidate.js";
import {
  deriveKnowledgePromotionDecision,
  type KnowledgePromotionDecision,
  type KnowledgePromotionDisposition,
} from "./promotion-decision.js";
import {
  deriveKnowledgeTransformationResult,
  type KnowledgeTransformationKind,
  type KnowledgeTransformationPolicy,
  type KnowledgeTransformationResult,
} from "./transformation-result.js";

export const KNOWLEDGE_PROMOTION_CONTROL_COMPOSITION_VERSION = "1.0.0" as const;

export type KnowledgePromotionControlComposition = Readonly<{
  contractVersion: typeof KNOWLEDGE_PROMOTION_CONTROL_COMPOSITION_VERSION;
  candidate: KnowledgePromotionCandidateDescriptor;
  transformation: KnowledgeTransformationResult;
  genericityEvidence: KnowledgeGenericityEvidence;
  decision: KnowledgePromotionDecision;
}>;

export type KnowledgePromotionControlCompositionInput = Readonly<{
  candidateRef: string;
  predecessor: KnowledgeEnforcementEvaluationInput;
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
  promotionDecision: Readonly<{
    decisionRef: string;
    disposition: KnowledgePromotionDisposition;
    decisionActorRef: string;
    humanAuthority: Readonly<{
      descriptor: unknown;
      metadata: unknown;
      riskCriticality: unknown;
    }>;
  }>;
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

function assertCompositionInputShape(input: KnowledgePromotionControlCompositionInput): void {
  assertExactKeys(
    input,
    ["candidateRef", "predecessor", "transformation", "genericityEvidence", "promotionDecision"],
    "knowledge promotion composition input",
  );
  assertExactKeys(
    input.predecessor,
    ["bundle", "usePolicyRef", "enforcement", "eligibilityRef", "permissionRef"],
    "knowledge promotion predecessor",
  );
  assertExactKeys(
    input.transformation,
    ["transformationRef", "policy", "kind"],
    "knowledge promotion transformation request",
  );
  assertExactKeys(
    input.transformation.policy,
    ["policyRef", "permittedKinds"],
    "knowledge promotion transformation policy",
  );
  assertExactKeys(
    input.genericityEvidence,
    ["evidenceRef", "evidenceKind", "result", "sourceRef"],
    "knowledge promotion genericity request",
  );
  assertExactKeys(
    input.promotionDecision,
    ["decisionRef", "disposition", "decisionActorRef", "humanAuthority"],
    "knowledge promotion decision request",
  );
  assertExactKeys(
    input.promotionDecision.humanAuthority,
    ["descriptor", "metadata", "riskCriticality"],
    "knowledge promotion human authority",
  );
}

export function composeKnowledgePromotionControl(
  input: KnowledgePromotionControlCompositionInput,
): KnowledgePromotionControlComposition {
  assertCompositionInputShape(input);

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

  const decision = deriveKnowledgePromotionDecision({
    decisionRef: input.promotionDecision.decisionRef,
    disposition: input.promotionDecision.disposition,
    decisionActorRef: input.promotionDecision.decisionActorRef,
    candidate,
    transformation,
    genericityEvidence,
    humanAuthority: input.promotionDecision.humanAuthority,
  });

  return {
    contractVersion: KNOWLEDGE_PROMOTION_CONTROL_COMPOSITION_VERSION,
    candidate,
    transformation,
    genericityEvidence,
    decision,
  };
}
