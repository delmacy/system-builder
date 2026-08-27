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

function assertKnowledgeClass(value: unknown): KnowledgeClass {
  if (typeof value !== "string" || !KNOWLEDGE_CLASSES.includes(value as KnowledgeClass)) {
    throw new Error(`unsupported knowledge class: ${String(value)}`);
  }
  return value as KnowledgeClass;
}

function assertVersion(value: unknown): typeof KNOWLEDGE_CLASSIFICATION_VERSION {
  if (value !== KNOWLEDGE_CLASSIFICATION_VERSION) {
    throw new Error(`unsupported knowledge classification contract version: ${String(value)}`);
  }
  return KNOWLEDGE_CLASSIFICATION_VERSION;
}

export function normalizeKnowledgeClassificationDescriptor(value: unknown): KnowledgeClassificationDescriptor {
  const record = asRecord(value, "knowledge classification descriptor");
  assertExactFields(
    record,
    ["contractVersion", "knowledgeClass", "ownerRef"],
    "knowledge classification descriptor",
  );

  return {
    contractVersion: assertVersion(record.contractVersion),
    knowledgeClass: assertKnowledgeClass(record.knowledgeClass),
    ownerRef: asNonEmptyTrimmedString(record.ownerRef, "ownerRef"),
  };
}
