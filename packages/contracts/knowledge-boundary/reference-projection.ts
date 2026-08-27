import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  normalizeKnowledgeClassificationBundle,
  normalizeKnowledgeClassificationDecision,
  type KnowledgeClass,
  type KnowledgeHumanDecisionAuthority,
} from "./index.js";

export const KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION = "1.0.0" as const;

export type KnowledgeClassificationReferenceProjection = Readonly<{
  contractVersion: typeof KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION;
  knowledgeClass: KnowledgeClass;
  ownerRef: string;
  purposeIds: readonly string[];
  restrictionIds: readonly string[];
  decisionMode: "manual" | "assisted";
  decisionRef: string;
  proposalRef: string | null;
  humanAuthority: KnowledgeHumanDecisionAuthority;
  evidenceRefs: readonly string[];
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, allowed: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function asNonEmptyTrimmedString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function asCanonicalUniqueStringList(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((item, index) => asNonEmptyTrimmedString(item, `${field}[${index}]`));
  const seen = new Set<string>();
  for (const item of normalized) {
    if (seen.has(item)) throw new Error(`${field} contains duplicate value ${item}`);
    seen.add(item);
  }
  return [...normalized].sort((left, right) => left.localeCompare(right));
}

function asKnowledgeClass(value: unknown): KnowledgeClass {
  if (value !== "generic" && value !== "client-proprietary" && value !== "personal" && value !== "trade-secret") {
    throw new Error(`unsupported knowledge class: ${String(value)}`);
  }
  return value;
}

function asDecisionMode(value: unknown): "manual" | "assisted" {
  if (value !== "manual" && value !== "assisted") {
    throw new Error(`unsupported knowledge classification decision mode: ${String(value)}`);
  }
  return value;
}

function asNullableReference(value: unknown, field: string): string | null {
  if (value === null) return null;
  return asNonEmptyTrimmedString(value, field);
}

function normalizeProjectionHumanAuthority(input: Readonly<{
  humanAuthority: unknown;
  knowledgeClass: KnowledgeClass;
  decisionMode: "manual" | "assisted";
  decisionRef: string;
  proposalRef: string | null;
}>): KnowledgeHumanDecisionAuthority {
  const authorityRecord = asRecord(input.humanAuthority, "humanAuthority");
  const descriptorRecord = asRecord(authorityRecord.descriptor, "humanAuthority.descriptor");
  if (descriptorRecord.category !== "human-decision") {
    throw new Error("classification decision requires Decision Boundary category human-decision");
  }
  const metadataRecord = asRecord(authorityRecord.metadata, "humanAuthority.metadata");
  const decisionActorRef = asNonEmptyTrimmedString(metadataRecord.authorityRef, "humanAuthority.metadata.authorityRef");
  const common = {
    contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
    mode: input.decisionMode,
    knowledgeClass: input.knowledgeClass,
    decisionActorRef,
    decisionRef: input.decisionRef,
    humanAuthority: input.humanAuthority,
  } as const;
  const decision = input.decisionMode === "manual"
    ? normalizeKnowledgeClassificationDecision(common)
    : normalizeKnowledgeClassificationDecision({ ...common, proposalRef: input.proposalRef });
  return decision.humanAuthority;
}

export function normalizeKnowledgeClassificationReferenceProjection(value: unknown): KnowledgeClassificationReferenceProjection {
  const record = asRecord(value, "knowledge classification reference projection");
  assertExactFields(
    record,
    [
      "contractVersion",
      "knowledgeClass",
      "ownerRef",
      "purposeIds",
      "restrictionIds",
      "decisionMode",
      "decisionRef",
      "proposalRef",
      "humanAuthority",
      "evidenceRefs",
    ],
    "knowledge classification reference projection",
  );
  if (record.contractVersion !== KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION) {
    throw new Error(`unsupported knowledge classification reference projection version: ${String(record.contractVersion)}`);
  }
  const knowledgeClass = asKnowledgeClass(record.knowledgeClass);
  const decisionMode = asDecisionMode(record.decisionMode);
  const decisionRef = asNonEmptyTrimmedString(record.decisionRef, "decisionRef");
  const proposalRef = asNullableReference(record.proposalRef, "proposalRef");
  if (decisionMode === "manual" && proposalRef !== null) {
    throw new Error("manual classification reference projection cannot carry proposalRef");
  }
  if (decisionMode === "assisted" && proposalRef === null) {
    throw new Error("assisted classification reference projection requires proposalRef");
  }
  const humanAuthority = normalizeProjectionHumanAuthority({
    humanAuthority: record.humanAuthority,
    knowledgeClass,
    decisionMode,
    decisionRef,
    proposalRef,
  });
  return {
    contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
    knowledgeClass,
    ownerRef: asNonEmptyTrimmedString(record.ownerRef, "ownerRef"),
    purposeIds: asCanonicalUniqueStringList(record.purposeIds, "purposeIds"),
    restrictionIds: asCanonicalUniqueStringList(record.restrictionIds, "restrictionIds"),
    decisionMode,
    decisionRef,
    proposalRef,
    humanAuthority,
    evidenceRefs: asCanonicalUniqueStringList(record.evidenceRefs, "evidenceRefs"),
  };
}

export function projectKnowledgeClassificationReference(
  bundleValue: unknown,
  evidenceRefsValue: unknown,
): KnowledgeClassificationReferenceProjection {
  const bundle = normalizeKnowledgeClassificationBundle(bundleValue);
  const evidenceRefs = asCanonicalUniqueStringList(evidenceRefsValue, "evidenceRefs");
  return normalizeKnowledgeClassificationReferenceProjection({
    contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
    knowledgeClass: bundle.classification.knowledgeClass,
    ownerRef: bundle.classification.ownerRef,
    purposeIds: bundle.usePolicy.purposeIds,
    restrictionIds: bundle.usePolicy.restrictionIds,
    decisionMode: bundle.decision.mode,
    decisionRef: bundle.decision.decisionRef,
    proposalRef: bundle.decision.mode === "assisted" ? bundle.decision.proposalRef : null,
    humanAuthority: bundle.decision.humanAuthority,
    evidenceRefs,
  });
}
