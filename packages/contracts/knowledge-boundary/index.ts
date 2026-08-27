import {
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  normalizeDecisionRiskCriticality,
  verifyDecisionBoundary,
  type DecisionBoundaryDescriptor,
  type DecisionRiskCriticality,
} from "../decision-boundary/index.js";

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

export type KnowledgeHumanDecisionAuthority = Readonly<{
  descriptor: DecisionBoundaryDescriptor & Readonly<{ category: "human-decision" }>;
  metadata: Readonly<{ authorityRef: string }>;
  riskCriticality: DecisionRiskCriticality;
}>;

export type KnowledgeClassificationDecision =
  | Readonly<{
      contractVersion: typeof KNOWLEDGE_CLASSIFICATION_DECISION_VERSION;
      mode: "manual";
      knowledgeClass: KnowledgeClass;
      decisionActorRef: string;
      decisionRef: string;
      humanAuthority: KnowledgeHumanDecisionAuthority;
    }>
  | Readonly<{
      contractVersion: typeof KNOWLEDGE_CLASSIFICATION_DECISION_VERSION;
      mode: "assisted";
      knowledgeClass: KnowledgeClass;
      decisionActorRef: string;
      decisionRef: string;
      proposalRef: string;
      humanAuthority: KnowledgeHumanDecisionAuthority;
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

function assertClassificationDecisionVersion(value: unknown): typeof KNOWLEDGE_CLASSIFICATION_DECISION_VERSION {
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

function normalizeHumanDecisionAuthority(value: unknown): KnowledgeHumanDecisionAuthority {
  const record = asRecord(value, "knowledge human decision authority");
  assertExactFields(record, ["descriptor", "metadata", "riskCriticality"], "knowledge human decision authority");
  const descriptor = normalizeDecisionBoundaryDescriptor(record.descriptor);
  if (descriptor.category !== "human-decision") {
    throw new Error("classification decision requires Decision Boundary category human-decision");
  }
  const categoryMetadata = normalizeDecisionCategoryMetadata(descriptor.category, record.metadata);
  if (categoryMetadata.category !== "human-decision") {
    throw new Error("classification decision requires human-decision metadata");
  }
  const riskCriticality = normalizeDecisionRiskCriticality(record.riskCriticality);
  const verification = verifyDecisionBoundary({
    descriptor,
    metadata: categoryMetadata.metadata,
    riskCriticality,
    expectedCategory: "human-decision",
  });
  if (verification.status !== "valid" || verification.category !== "human-decision" || verification.reference.kind !== "authority") {
    throw new Error("classification decision human authority failed Decision Boundary verification");
  }
  return {
    descriptor: { ...descriptor, category: "human-decision" },
    metadata: { authorityRef: categoryMetadata.metadata.authorityRef },
    riskCriticality,
  };
}

export function normalizeKnowledgeClassificationDescriptor(value: unknown): KnowledgeClassificationDescriptor {
  const record = asRecord(value, "knowledge classification descriptor");
  assertExactFields(record, ["contractVersion", "knowledgeClass", "ownerRef"], "knowledge classification descriptor");
  return {
    contractVersion: assertClassificationVersion(record.contractVersion),
    knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
    ownerRef: asNonEmptyTrimmedString(record.ownerRef, "ownerRef"),
  };
}

export function normalizeKnowledgeUsePolicyDescriptor(value: unknown): KnowledgeUsePolicyDescriptor {
  const record = asRecord(value, "knowledge use policy descriptor");
  assertExactFields(record, ["contractVersion", "purposeIds", "restrictionIds"], "knowledge use policy descriptor");
  return {
    contractVersion: assertUsePolicyVersion(record.contractVersion),
    purposeIds: asCanonicalUniqueStringList(record.purposeIds, "purposeIds"),
    restrictionIds: asCanonicalUniqueStringList(record.restrictionIds, "restrictionIds"),
  };
}

export function normalizeKnowledgeClassificationDecision(value: unknown): KnowledgeClassificationDecision {
  const record = asRecord(value, "knowledge classification decision");
  const mode = assertClassificationDecisionMode(record.mode);
  const commonFields = ["contractVersion", "mode", "knowledgeClass", "decisionActorRef", "decisionRef", "humanAuthority"] as const;
  if (mode === "manual") {
    assertExactFields(record, commonFields, "knowledge classification decision");
  } else {
    assertExactFields(record, [...commonFields, "proposalRef"], "knowledge classification decision");
  }

  const decisionActorRef = asNonEmptyTrimmedString(record.decisionActorRef, "decisionActorRef");
  const humanAuthority = normalizeHumanDecisionAuthority(record.humanAuthority);
  if (decisionActorRef !== humanAuthority.metadata.authorityRef) {
    throw new Error("decisionActorRef must match verified human authorityRef");
  }

  const common = {
    contractVersion: assertClassificationDecisionVersion(record.contractVersion),
    knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
    decisionActorRef,
    decisionRef: asNonEmptyTrimmedString(record.decisionRef, "decisionRef"),
    humanAuthority,
  } as const;

  if (mode === "manual") return { ...common, mode };
  return {
    ...common,
    mode,
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

function assertAssistedClassificationProposalVersion(value: unknown): typeof ASSISTED_CLASSIFICATION_PROPOSAL_VERSION {
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
  assertExactFields(record, ["contractVersion", "proposalRef", "proposedClass", "confidence", "modelRef", "contextRef", "evidenceRefs"], "assisted classification proposal");
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

export const KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION = "1.0.0" as const;

export type KnowledgeClassificationEvidenceProjection = Readonly<{
  contractVersion: typeof KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION;
  knowledgeClass: KnowledgeClass;
  ownerRef: string;
  purposeIds: readonly string[];
  decisionRef: string;
  proposalRef: string | null;
  evidenceRefs: readonly string[];
}>;

function assertClassificationEvidenceProjectionVersion(value: unknown): typeof KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION {
  if (value !== KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION) {
    throw new Error(`unsupported knowledge classification evidence projection version: ${String(value)}`);
  }
  return KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION;
}

function asNullableReference(value: unknown, field: string): string | null {
  if (value === null) return null;
  return asNonEmptyTrimmedString(value, field);
}

export function normalizeKnowledgeClassificationEvidenceProjection(value: unknown): KnowledgeClassificationEvidenceProjection {
  const record = asRecord(value, "knowledge classification evidence projection");
  assertExactFields(record, ["contractVersion", "knowledgeClass", "ownerRef", "purposeIds", "decisionRef", "proposalRef", "evidenceRefs"], "knowledge classification evidence projection");
  return {
    contractVersion: assertClassificationEvidenceProjectionVersion(record.contractVersion),
    knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
    ownerRef: asNonEmptyTrimmedString(record.ownerRef, "ownerRef"),
    purposeIds: asCanonicalUniqueStringList(record.purposeIds, "purposeIds"),
    decisionRef: asNonEmptyTrimmedString(record.decisionRef, "decisionRef"),
    proposalRef: asNullableReference(record.proposalRef, "proposalRef"),
    evidenceRefs: asCanonicalUniqueStringList(record.evidenceRefs, "evidenceRefs"),
  };
}

export const KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION = "1.0.0" as const;

export const KNOWLEDGE_ENFORCEMENT_OUTCOMES = ["allow", "deny", "isolate"] as const;

export type KnowledgeEnforcementOutcome = (typeof KNOWLEDGE_ENFORCEMENT_OUTCOMES)[number];

export type KnowledgeEnforcementDisposition = Readonly<{
  contractVersion: typeof KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION;
  enforcementRef: string;
  classificationDecisionRef: string;
  usePolicyRef: string;
  purposeId: string;
  outcome: KnowledgeEnforcementOutcome;
  reasonIds: readonly string[];
}>;

function assertEnforcementDispositionVersion(value: unknown): typeof KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION {
  if (value !== KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION) {
    throw new Error(`unsupported knowledge enforcement disposition version: ${String(value)}`);
  }
  return KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION;
}

function assertKnowledgeEnforcementOutcome(value: unknown): KnowledgeEnforcementOutcome {
  if (typeof value !== "string" || !KNOWLEDGE_ENFORCEMENT_OUTCOMES.includes(value as KnowledgeEnforcementOutcome)) {
    throw new Error(`unsupported knowledge enforcement outcome: ${String(value)}`);
  }
  return value as KnowledgeEnforcementOutcome;
}

export function normalizeKnowledgeEnforcementDisposition(value: unknown): KnowledgeEnforcementDisposition {
  const record = asRecord(value, "knowledge enforcement disposition");
  assertExactFields(
    record,
    ["contractVersion", "enforcementRef", "classificationDecisionRef", "usePolicyRef", "purposeId", "outcome", "reasonIds"],
    "knowledge enforcement disposition",
  );
  const reasonIds = asCanonicalUniqueStringList(record.reasonIds, "reasonIds");
  if (reasonIds.length === 0) throw new Error("reasonIds must contain at least one explicit reason");
  return {
    contractVersion: assertEnforcementDispositionVersion(record.contractVersion),
    enforcementRef: asNonEmptyTrimmedString(record.enforcementRef, "enforcementRef"),
    classificationDecisionRef: asNonEmptyTrimmedString(record.classificationDecisionRef, "classificationDecisionRef"),
    usePolicyRef: asNonEmptyTrimmedString(record.usePolicyRef, "usePolicyRef"),
    purposeId: asNonEmptyTrimmedString(record.purposeId, "purposeId"),
    outcome: assertKnowledgeEnforcementOutcome(record.outcome),
    reasonIds,
  };
}
