import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeDefinitionRevisionRef,
  normalizeOccurrenceRef,
  type DefinitionRevisionRef,
  type OccurrenceRef,
} from "../semantic-substrate/index.js";

export const ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION = "1.0.0" as const;
export const EKB_QUESTION_SEMANTIC_KIND = "elicitation-question" as const;
export const EKB_INFORMATION_KINDS = [
  "Fact",
  "Claim",
  "Assumption",
  "InferredCandidate",
  "Decision",
  "Requirement",
  "Constraint",
  "OpenQuestion",
  "Conflict",
  "Unknown",
  "OutOfScope",
  "Deferred",
] as const;
export const EKB_INFORMATION_ORIGINS = ["Human", "AI", "Imported"] as const;
export const EKB_INFORMATION_LINEAGE_TRANSITIONS = ["Qualification", "Correction", "Supersession"] as const;

type UnknownRecord = Record<string, unknown>;

export type InformationKind = (typeof EKB_INFORMATION_KINDS)[number];
export type InformationOrigin = (typeof EKB_INFORMATION_ORIGINS)[number];
export type InformationLineageTransition = (typeof EKB_INFORMATION_LINEAGE_TRANSITIONS)[number];

export type QuestionDefinitionRevision = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  ref: DefinitionRevisionRef;
  text: string;
}>;

export type QuestionOccurrenceContext = Readonly<{
  contextRef: string;
  populationScope: string;
  localityScope: string;
}>;

export type QuestionOccurrenceIdentity = Readonly<{
  occurrence: OccurrenceRef;
  producingDefinitionRevision: DefinitionRevisionRef;
}>;

export type QuestionOccurrence = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  ref: QuestionOccurrenceIdentity;
  definitionRevision: DefinitionRevisionRef;
  context: QuestionOccurrenceContext;
}>;

export type ExternalAuthorityReference = Readonly<{
  ownerRef: string;
  authorityRef: string;
}>;

export type InformationRecordLineage = Readonly<{
  transition: InformationLineageTransition;
  fromRecordRef: string;
  fromKind: InformationKind;
  authority: ExternalAuthorityReference;
  reason: string;
}>;

export type InformationRecord = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  recordRef: string;
  questionOccurrence: QuestionOccurrenceIdentity;
  kind: InformationKind;
  text: string;
  origin: InformationOrigin;
  lineage: InformationRecordLineage | null;
}>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function ekbVersion(value: unknown): typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION {
  if (value !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(value)}`);
  return ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
}

function assertQuestionKind(ref: { semanticKind: string }, label: string): void {
  if (ref.semanticKind !== EKB_QUESTION_SEMANTIC_KIND) throw new Error(`${label}.semanticKind must be ${EKB_QUESTION_SEMANTIC_KIND}`);
}

function definitionRevisionKey(ref: DefinitionRevisionRef): string {
  return [
    ref.semanticOwner,
    ref.semanticKind,
    ref.canonicalRef,
    ref.definitionRef,
    ref.revisionOwner,
    ref.revisionDimension,
    ref.revisionRef,
  ].join("\u0000");
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of ${allowed.join(", ")}`);
  return value as T[number];
}

export function normalizeQuestionDefinitionRevision(input: unknown): QuestionDefinitionRevision {
  const record = asRecord(input, "question definition revision");
  assertExactFields(record, ["contractVersion", "ref", "text"], "question definition revision");
  const ref = normalizeDefinitionRevisionRef(record.ref);
  assertQuestionKind(ref, "question definition revision ref");
  if (ref.revisionOwner !== ref.semanticOwner) throw new Error("question definition revision owner must match semantic owner");
  return Object.freeze({
    contractVersion: ekbVersion(record.contractVersion),
    ref,
    text: nonEmpty(record.text, "question definition text"),
  });
}

export function normalizeQuestionOccurrenceContext(input: unknown): QuestionOccurrenceContext {
  const record = asRecord(input, "question occurrence context");
  assertExactFields(record, ["contextRef", "populationScope", "localityScope"], "question occurrence context");
  return Object.freeze({
    contextRef: nonEmpty(record.contextRef, "contextRef"),
    populationScope: nonEmpty(record.populationScope, "populationScope"),
    localityScope: nonEmpty(record.localityScope, "localityScope"),
  });
}

export function normalizeQuestionOccurrenceIdentity(input: unknown): QuestionOccurrenceIdentity {
  const identityRecord = asRecord(input, "question occurrence identity");
  assertExactFields(identityRecord, ["occurrence", "producingDefinitionRevision"], "question occurrence identity");
  const occurrence = normalizeOccurrenceRef(identityRecord.occurrence);
  const producingDefinitionRevision = normalizeDefinitionRevisionRef(identityRecord.producingDefinitionRevision);
  assertQuestionKind(occurrence, "question occurrence ref");
  assertQuestionKind(producingDefinitionRevision, "question occurrence producing definition revision");
  if (occurrence.semanticOwner !== producingDefinitionRevision.semanticOwner) throw new Error("question occurrence owner must match producing definition revision owner");
  if (occurrence.canonicalRef !== producingDefinitionRevision.canonicalRef) throw new Error("question occurrence canonical identity must match producing definition revision");
  return Object.freeze({ occurrence, producingDefinitionRevision });
}

export function normalizeQuestionOccurrence(input: unknown): QuestionOccurrence {
  const record = asRecord(input, "question occurrence");
  assertExactFields(record, ["contractVersion", "ref", "definitionRevision", "context"], "question occurrence");
  const identity = normalizeQuestionOccurrenceIdentity(record.ref);
  const definitionRevision = normalizeDefinitionRevisionRef(record.definitionRevision);
  assertQuestionKind(definitionRevision, "question occurrence definition revision");
  if (definitionRevisionKey(identity.producingDefinitionRevision) !== definitionRevisionKey(definitionRevision)) {
    throw new Error("question occurrence definition revision must match producing revision pinned by occurrence identity");
  }
  return Object.freeze({
    contractVersion: ekbVersion(record.contractVersion),
    ref: identity,
    definitionRevision,
    context: normalizeQuestionOccurrenceContext(record.context),
  });
}

function normalizeExternalAuthorityReference(input: unknown): ExternalAuthorityReference {
  const record = asRecord(input, "external authority reference");
  assertExactFields(record, ["ownerRef", "authorityRef"], "external authority reference");
  return Object.freeze({
    ownerRef: nonEmpty(record.ownerRef, "authority.ownerRef"),
    authorityRef: nonEmpty(record.authorityRef, "authority.authorityRef"),
  });
}

function normalizeInformationRecordLineage(input: unknown, targetKind: InformationKind): InformationRecordLineage | null {
  if (input === null) return null;
  const record = asRecord(input, "information record lineage");
  assertExactFields(record, ["transition", "fromRecordRef", "fromKind", "authority", "reason"], "information record lineage");
  const transition = oneOf(record.transition, EKB_INFORMATION_LINEAGE_TRANSITIONS, "lineage.transition");
  const fromKind = oneOf(record.fromKind, EKB_INFORMATION_KINDS, "lineage.fromKind");
  if (transition === "Qualification" && fromKind === targetKind) throw new Error("qualification transition must change information kind");
  if (transition !== "Qualification" && fromKind !== targetKind) throw new Error("information kind changes require an explicit Qualification transition");
  return Object.freeze({
    transition,
    fromRecordRef: nonEmpty(record.fromRecordRef, "lineage.fromRecordRef"),
    fromKind,
    authority: normalizeExternalAuthorityReference(record.authority),
    reason: nonEmpty(record.reason, "lineage.reason"),
  });
}

export function normalizeInformationRecord(input: unknown): InformationRecord {
  const record = asRecord(input, "information record");
  assertExactFields(record, ["contractVersion", "recordRef", "questionOccurrence", "kind", "text", "origin", "lineage"], "information record");
  const kind = oneOf(record.kind, EKB_INFORMATION_KINDS, "information kind");
  const origin = oneOf(record.origin, EKB_INFORMATION_ORIGINS, "information origin");
  const lineage = normalizeInformationRecordLineage(record.lineage, kind);
  if (origin === "AI" && kind !== "InferredCandidate") {
    if (lineage?.transition !== "Qualification" || lineage.fromKind !== "InferredCandidate") {
      throw new Error("AI-originated material must remain InferredCandidate absent an explicit owner-governed qualification transition");
    }
  }
  return Object.freeze({
    contractVersion: ekbVersion(record.contractVersion),
    recordRef: nonEmpty(record.recordRef, "recordRef"),
    questionOccurrence: normalizeQuestionOccurrenceIdentity(record.questionOccurrence),
    kind,
    text: nonEmpty(record.text, "information text"),
    origin,
    lineage,
  });
}

export { SEMANTIC_SUBSTRATE_CONTRACT_VERSION };
