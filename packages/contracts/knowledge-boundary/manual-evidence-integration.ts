import {
  normalizeKnowledgeClassificationReferenceProjection,
  type KnowledgeClassificationReferenceProjection,
} from "./reference-projection.js";
import type { KnowledgeClass, KnowledgeHumanDecisionAuthority } from "./index.js";

export const MANUAL_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION = "1.0.0" as const;

export type ManualKnowledgeClassificationEvidenceExpectation = Readonly<{
  knowledgeClass: KnowledgeClass;
  ownerRef: string;
  decisionRef: string;
  evidenceRef: string;
}>;

export type ManualKnowledgeClassificationEvidenceView = Readonly<{
  contractVersion: typeof MANUAL_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION;
  knowledgeClass: KnowledgeClass;
  ownerRef: string;
  purposeIds: readonly string[];
  restrictionIds: readonly string[];
  decisionRef: string;
  humanAuthority: KnowledgeHumanDecisionAuthority;
  evidenceRefs: readonly string[];
}>;

function asNonEmptyTrimmedString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function asKnowledgeClass(value: unknown): KnowledgeClass {
  if (value !== "generic" && value !== "client-proprietary" && value !== "personal" && value !== "trade-secret") {
    throw new Error(`unsupported knowledge class: ${String(value)}`);
  }
  return value;
}

function normalizeExpectation(value: unknown): ManualKnowledgeClassificationEvidenceExpectation {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("manual knowledge evidence expectation must be an object");
  }
  const record = value as Record<string, unknown>;
  const allowed = ["knowledgeClass", "ownerRef", "decisionRef", "evidenceRef"] as const;
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key as (typeof allowed)[number])) {
      throw new Error(`manual knowledge evidence expectation has unexpected field ${key}`);
    }
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`manual knowledge evidence expectation is missing field ${key}`);
  }
  return {
    knowledgeClass: asKnowledgeClass(record.knowledgeClass),
    ownerRef: asNonEmptyTrimmedString(record.ownerRef, "ownerRef"),
    decisionRef: asNonEmptyTrimmedString(record.decisionRef, "decisionRef"),
    evidenceRef: asNonEmptyTrimmedString(record.evidenceRef, "evidenceRef"),
  };
}

export function consumeManualKnowledgeClassificationEvidence(
  projectionValue: unknown,
  expectationValue: unknown,
): ManualKnowledgeClassificationEvidenceView {
  const projection: KnowledgeClassificationReferenceProjection =
    normalizeKnowledgeClassificationReferenceProjection(projectionValue);
  const expectation = normalizeExpectation(expectationValue);

  if (projection.decisionMode !== "manual" || projection.proposalRef !== null) {
    throw new Error("manual knowledge evidence consumption requires a manual classification decision");
  }
  if (projection.knowledgeClass !== expectation.knowledgeClass) {
    throw new Error("manual knowledge evidence knowledgeClass mismatch");
  }
  if (projection.ownerRef !== expectation.ownerRef) {
    throw new Error("manual knowledge evidence ownerRef mismatch");
  }
  if (projection.decisionRef !== expectation.decisionRef) {
    throw new Error("manual knowledge evidence decisionRef mismatch");
  }
  if (!projection.evidenceRefs.includes(expectation.evidenceRef)) {
    throw new Error("manual knowledge evidence reference is not linked to classification evidence");
  }

  return {
    contractVersion: MANUAL_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION,
    knowledgeClass: projection.knowledgeClass,
    ownerRef: projection.ownerRef,
    purposeIds: projection.purposeIds,
    restrictionIds: projection.restrictionIds,
    decisionRef: projection.decisionRef,
    humanAuthority: projection.humanAuthority,
    evidenceRefs: projection.evidenceRefs,
  };
}
