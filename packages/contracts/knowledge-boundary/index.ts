export const KNOWLEDGE_CLASSIFICATION_VERSION = "1.0.0" as const;

export const KNOWLEDGE_CLASSES = [
  "generic",
  "client-proprietary",
  "personal",
  "trade-secret",
] as const;

export type KnowledgeClass = (typeof KNOWLEDGE_CLASSES)[number];

export type KnowledgeClassificationDescriptor = Readonly<{
  contractVersion: typeof KNOWLEDGE_CLASSIFICATION_VERSION;
  knowledgeClass: KnowledgeClass;
  ownerRef: string;
}>;

export const KNOWLEDGE_USE_POLICY_VERSION = "1.0.0" as const;

export type KnowledgeUsePolicyDescriptor = Readonly<{
  contractVersion: typeof KNOWLEDGE_USE_POLICY_VERSION;
  purposeIds: readonly string[];
  restrictionIds: readonly string[];
}>;

export const KNOWLEDGE_CLASSIFICATION_DECISION_VERSION = "1.0.0" as const;

export type KnowledgeClassificationDecisionMode = "manual" | "assisted";

export type KnowledgeClassificationDecision =
  | Readonly<{
      contractVersion: typeof KNOWLEDGE_CLASSIFICATION_DECISION_VERSION;
      mode: "manual";
      knowledgeClass: KnowledgeClass;
      decisionActorRef: string;
      decisionRef: string;
    }>
  | Readonly<{
      contractVersion: typeof KNOWLEDGE_CLASSIFICATION_DECISION_VERSION;
      mode: "assisted";
      knowledgeClass: KnowledgeClass;
      decisionActorRef: string;
      decisionRef: string;
      proposalRef: string;
    }>;

export type KnowledgeClassificationBundle = Readonly<{
  classification: KnowledgeClassificationDescriptor;
  usePolicy: KnowledgeUsePolicyDescriptor;
  decision: KnowledgeClassificationDecision;
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

function assertKnowledgeClass(value: unknown): KnowledgeClass {
  if (typeof value !== "string" || !KNOWLEDGE_CLASSES.includes(value as KnowledgeClass)) {
    throw new Error(`unsupported knowledge class: ${String(value)}`);
  }
  return value as KnowledgeClass;
}

function assertClassificationVersion(value: unknown): typeof KNOWLEDGE_CLASSIFICATION_VERSION {
  if (value !== KNOWLEDGE_CLASSIFICATION_VERSION) {
    throw new Error(`unsupported knowledge classification contract version: ${String(value)}`);
  }
  return KNOWLEDGE_CLASSIFICATION_VERSION;
}

function assertUsePolicyVersion(value: unknown): typeof KNOWLEDGE_USE_POLICY_VERSION {
  if (value !== KNOWLEDGE_USE_POLICY_VERSION) {
    throw new Error(`unsupported knowledge use policy contract version: ${String(value)}`);
  }
  return KNOWLEDGE_USE_POLICY_VERSION;
}

function assertClassificationDecisionVersion(
  value: unknown,
): typeof KNOWLEDGE_CLASSIFICATION_DECISION_VERSION {
  if (value !== KNOWLEDGE_CLASSIFICATION_DECISION_VERSION) {
    throw new Error(`unsupported knowledge classification decision contract version: ${String(value)}`);
  }
  return KNOWLEDGE_CLASSIFICATION_DECISION_VERSION;
}

function assertClassificationDecisionMode(value: unknown): KnowledgeClassificationDecisionMode {
  if (value !== "manual" && value !== "assisted") {
    throw new Error(`unsupported knowledge classification decision mode: ${String(value)}`);
  }
  return value;
}

export function normalizeKnowledgeClassificationDescriptor(value: unknown): KnowledgeClassificationDescriptor {
  const record = asRecord(value, "knowledge classification descriptor");
  assertExactFields(
    record,
    ["contractVersion", "knowledgeClass", "ownerRef"],
    "knowledge classification descriptor",
  );

  return {
    contractVersion: assertClassificationVersion(record.contractVersion),
    knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
    ownerRef: asNonEmptyTrimmedString(record.ownerRef, "ownerRef"),
  };
}

export function normalizeKnowledgeUsePolicyDescriptor(value: unknown): KnowledgeUsePolicyDescriptor {
  const record = asRecord(value, "knowledge use policy descriptor");
  assertExactFields(
    record,
    ["contractVersion", "purposeIds", "restrictionIds"],
    "knowledge use policy descriptor",
  );

  return {
    contractVersion: assertUsePolicyVersion(record.contractVersion),
    purposeIds: asCanonicalUniqueStringList(record.purposeIds, "purposeIds"),
    restrictionIds: asCanonicalUniqueStringList(record.restrictionIds, "restrictionIds"),
  };
}

export function normalizeKnowledgeClassificationDecision(value: unknown): KnowledgeClassificationDecision {
  const record = asRecord(value, "knowledge classification decision");
  const mode = assertClassificationDecisionMode(record.mode);

  if (mode === "manual") {
    assertExactFields(
      record,
      ["contractVersion", "mode", "knowledgeClass", "decisionActorRef", "decisionRef"],
      "knowledge classification decision",
    );
    return {
      contractVersion: assertClassificationDecisionVersion(record.contractVersion),
      mode,
      knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
      decisionActorRef: asNonEmptyTrimmedString(record.decisionActorRef, "decisionActorRef"),
      decisionRef: asNonEmptyTrimmedString(record.decisionRef, "decisionRef"),
    };
  }

  assertExactFields(
    record,
    ["contractVersion", "mode", "knowledgeClass", "decisionActorRef", "decisionRef", "proposalRef"],
    "knowledge classification decision",
  );
  return {
    contractVersion: assertClassificationDecisionVersion(record.contractVersion),
    mode,
    knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
    decisionActorRef: asNonEmptyTrimmedString(record.decisionActorRef, "decisionActorRef"),
    decisionRef: asNonEmptyTrimmedString(record.decisionRef, "decisionRef"),
    proposalRef: asNonEmptyTrimmedString(record.proposalRef, "proposalRef"),
  };
}

export function normalizeKnowledgeClassificationBundle(value: unknown): KnowledgeClassificationBundle {
  const record = asRecord(value, "knowledge classification bundle");
  assertExactFields(record, ["classification", "usePolicy", "decision"], "knowledge classification bundle");

  const classification = normalizeKnowledgeClassificationDescriptor(record.classification);
  const usePolicy = normalizeKnowledgeUsePolicyDescriptor(record.usePolicy);
  const decision = normalizeKnowledgeClassificationDecision(record.decision);

  if (classification.knowledgeClass !== decision.knowledgeClass) {
    throw new Error("classification decision knowledgeClass must match classification descriptor");
  }

  return { classification, usePolicy, decision };
}

export const ASSISTED_CLASSIFICATION_PROPOSAL_VERSION = "1.0.0" as const;

export type AssistedClassificationProposal = Readonly<{
  contractVersion: typeof ASSISTED_CLASSIFICATION_PROPOSAL_VERSION;
  proposalRef: string;
  proposedClass: KnowledgeClass;
  confidence: number;
  modelRef: string;
  contextRef: string;
  evidenceRefs: readonly string[];
}>;

function assertAssistedClassificationProposalVersion(
  value: unknown,
): typeof ASSISTED_CLASSIFICATION_PROPOSAL_VERSION {
  if (value !== ASSISTED_CLASSIFICATION_PROPOSAL_VERSION) {
    throw new Error(`unsupported assisted classification proposal contract version: ${String(value)}`);
  }
  return ASSISTED_CLASSIFICATION_PROPOSAL_VERSION;
}

function asBoundedConfidence(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error("confidence must be a finite number between 0 and 1");
  }
  return value;
}

export function normalizeAssistedClassificationProposal(value: unknown): AssistedClassificationProposal {
  const record = asRecord(value, "assisted classification proposal");
  assertExactFields(
    record,
    ["contractVersion", "proposalRef", "proposedClass", "confidence", "modelRef", "contextRef", "evidenceRefs"],
    "assisted classification proposal",
  );

  return {
    contractVersion: assertAssistedClassificationProposalVersion(record.contractVersion),
    proposalRef: asNonEmptyTrimmedString(record.proposalRef, "proposalRef"),
    proposedClass: assertKnowledgeClass(record.proposedClass),
    confidence: asBoundedConfidence(record.confidence),
    modelRef: asNonEmptyTrimmedString(record.modelRef, "modelRef"),
    contextRef: asNonEmptyTrimmedString(record.contextRef, "contextRef"),
    evidenceRefs: asCanonicalUniqueStringList(record.evidenceRefs, "evidenceRefs"),
  };
}
