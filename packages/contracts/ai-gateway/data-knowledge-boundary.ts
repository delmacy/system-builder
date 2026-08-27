export const AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION = "1.0.0" as const;

export type DataKnowledgeBoundaryDescriptor = Readonly<{
  contractVersion: typeof AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION;
  boundaryId: string;
  allowedDataClasses: readonly string[];
  allowedKnowledgeRefs: readonly string[];
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

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value;
}

function normalizeStringSet(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((item, index) => asNonEmptyString(item, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${field} must not contain duplicates`);
  }
  return [...normalized].sort((left, right) => left.localeCompare(right));
}

function assertBoundaryVersion(value: unknown): typeof AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION {
  if (value !== AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION) {
    throw new Error(`unsupported AI Gateway data/knowledge boundary contract version: ${String(value)}`);
  }
  return AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION;
}

export function normalizeDataKnowledgeBoundaryDescriptor(value: unknown): DataKnowledgeBoundaryDescriptor {
  const record = asRecord(value, "data/knowledge boundary descriptor");
  assertExactFields(
    record,
    ["contractVersion", "boundaryId", "allowedDataClasses", "allowedKnowledgeRefs"],
    "data/knowledge boundary descriptor",
  );

  return {
    contractVersion: assertBoundaryVersion(record.contractVersion),
    boundaryId: asNonEmptyString(record.boundaryId, "boundaryId"),
    allowedDataClasses: normalizeStringSet(record.allowedDataClasses, "allowedDataClasses"),
    allowedKnowledgeRefs: normalizeStringSet(record.allowedKnowledgeRefs, "allowedKnowledgeRefs"),
  };
}
