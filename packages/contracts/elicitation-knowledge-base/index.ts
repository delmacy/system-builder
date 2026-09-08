import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeDefinitionRevisionRef,
  normalizeOccurrenceRef,
  type DefinitionRevisionRef,
  type OccurrenceRef,
} from "../semantic-substrate/index.js";

export const ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION = "1.0.0" as const;
export const EKB_QUESTION_SEMANTIC_KIND = "elicitation-question" as const;

type UnknownRecord = Record<string, unknown>;

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

export function normalizeQuestionOccurrence(input: unknown): QuestionOccurrence {
  const record = asRecord(input, "question occurrence");
  assertExactFields(record, ["contractVersion", "ref", "definitionRevision", "context"], "question occurrence");
  const identityRecord = asRecord(record.ref, "question occurrence identity");
  assertExactFields(identityRecord, ["occurrence", "producingDefinitionRevision"], "question occurrence identity");
  const occurrenceRef = normalizeOccurrenceRef(identityRecord.occurrence);
  const producingDefinitionRevision = normalizeDefinitionRevisionRef(identityRecord.producingDefinitionRevision);
  const definitionRevision = normalizeDefinitionRevisionRef(record.definitionRevision);
  assertQuestionKind(occurrenceRef, "question occurrence ref");
  assertQuestionKind(producingDefinitionRevision, "question occurrence producing definition revision");
  assertQuestionKind(definitionRevision, "question occurrence definition revision");
  if (occurrenceRef.semanticOwner !== definitionRevision.semanticOwner) throw new Error("question occurrence owner must match definition revision owner");
  if (occurrenceRef.canonicalRef !== definitionRevision.canonicalRef) throw new Error("question occurrence canonical identity must match definition revision");
  if (definitionRevisionKey(producingDefinitionRevision) !== definitionRevisionKey(definitionRevision)) {
    throw new Error("question occurrence definition revision must match producing revision pinned by occurrence identity");
  }
  return Object.freeze({
    contractVersion: ekbVersion(record.contractVersion),
    ref: Object.freeze({ occurrence: occurrenceRef, producingDefinitionRevision }),
    definitionRevision,
    context: normalizeQuestionOccurrenceContext(record.context),
  });
}

export { SEMANTIC_SUBSTRATE_CONTRACT_VERSION };
