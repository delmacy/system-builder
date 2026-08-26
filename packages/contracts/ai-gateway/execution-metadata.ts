export const AI_GATEWAY_EXECUTION_METADATA_VERSION = "1.0.0" as const;

export type ModelExecutionMetadata = Readonly<{
  contractVersion: typeof AI_GATEWAY_EXECUTION_METADATA_VERSION;
  modelRef: string;
  modelVersion: string;
  cost: Readonly<{ amount: number; unit: string }> | null;
  provenanceRefs: readonly string[];
}>;

export type ModelExecutionMetadataEnvelope = Readonly<{
  metadataPermitted: boolean;
  permissionPolicyId: string;
  metadata: ModelExecutionMetadata | null;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value;
}

function normalizeCost(value: unknown): ModelExecutionMetadata["cost"] {
  if (value === null) return null;
  const record = asRecord(value, "execution metadata cost");
  assertExactFields(record, ["amount", "unit"], "execution metadata cost");
  if (typeof record.amount !== "number" || !Number.isFinite(record.amount) || record.amount < 0) {
    throw new Error("execution metadata cost amount must be finite and non-negative");
  }
  return { amount: record.amount, unit: asNonEmptyString(record.unit, "execution metadata cost unit") };
}

function normalizeProvenanceRefs(value: unknown): readonly string[] {
  if (!Array.isArray(value)) throw new Error("provenanceRefs must be an array");
  const refs = value.map((ref, index) => asNonEmptyString(ref, `provenanceRefs[${index}]`));
  if (new Set(refs).size !== refs.length) throw new Error("provenanceRefs must not contain duplicates");
  return [...refs].sort((left, right) => left.localeCompare(right));
}

export function normalizeModelExecutionMetadata(value: unknown): ModelExecutionMetadata {
  const record = asRecord(value, "model execution metadata");
  assertExactFields(record, ["contractVersion", "modelRef", "modelVersion", "cost", "provenanceRefs"], "model execution metadata");
  if (record.contractVersion !== AI_GATEWAY_EXECUTION_METADATA_VERSION) {
    throw new Error(`unsupported AI Gateway execution metadata version: ${String(record.contractVersion)}`);
  }
  return {
    contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
    modelRef: asNonEmptyString(record.modelRef, "modelRef"),
    modelVersion: asNonEmptyString(record.modelVersion, "modelVersion"),
    cost: normalizeCost(record.cost),
    provenanceRefs: normalizeProvenanceRefs(record.provenanceRefs),
  };
}

export function normalizeModelExecutionMetadataEnvelope(value: unknown): ModelExecutionMetadataEnvelope {
  const record = asRecord(value, "model execution metadata envelope");
  assertExactFields(record, ["metadataPermitted", "permissionPolicyId", "metadata"], "model execution metadata envelope");
  if (typeof record.metadataPermitted !== "boolean") throw new Error("metadataPermitted must be a boolean");
  const permissionPolicyId = asNonEmptyString(record.permissionPolicyId, "permissionPolicyId");
  if (!record.metadataPermitted) {
    if (record.metadata !== null) throw new Error("metadata must be null when metadataPermitted is false");
    return { metadataPermitted: false, permissionPolicyId, metadata: null };
  }
  if (record.metadata === null) return { metadataPermitted: true, permissionPolicyId, metadata: null };
  return { metadataPermitted: true, permissionPolicyId, metadata: normalizeModelExecutionMetadata(record.metadata) };
}
