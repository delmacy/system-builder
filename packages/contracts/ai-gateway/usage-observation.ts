export const AI_GATEWAY_USAGE_OBSERVATION_VERSION = "1.0.0" as const;

export type UsageObservationPermissions = Readonly<{
  quality: boolean;
  failure: boolean;
  cost: boolean;
}>;

export type QualityObservation = Readonly<{ score: number; scale: string }>;
export type FailureObservation = Readonly<{ code: string; category: string }>;
export type CostObservation = Readonly<{ amount: number; unit: string }>;

export type ModelUsageObservation = Readonly<{
  contractVersion: typeof AI_GATEWAY_USAGE_OBSERVATION_VERSION;
  observationId: string;
  requestId: string;
  responseId: string | null;
  quality: QualityObservation | null;
  failure: FailureObservation | null;
  cost: CostObservation | null;
  evidenceRefs: readonly string[];
}>;

export type ModelUsageObservationEnvelope = Readonly<{
  permissionPolicyId: string;
  permissions: UsageObservationPermissions;
  observation: ModelUsageObservation;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, allowed: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!allowed.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of allowed) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value;
}

function asBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${field} must be a boolean`);
  return value;
}

function asFiniteNonNegative(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error(`${field} must be finite and non-negative`);
  return value;
}

function normalizePermissions(value: unknown): UsageObservationPermissions {
  const record = asRecord(value, "usage observation permissions");
  assertExactFields(record, ["quality", "failure", "cost"], "usage observation permissions");
  return {
    quality: asBoolean(record.quality, "permissions.quality"),
    failure: asBoolean(record.failure, "permissions.failure"),
    cost: asBoolean(record.cost, "permissions.cost"),
  };
}

function normalizeQuality(value: unknown): QualityObservation | null {
  if (value === null) return null;
  const record = asRecord(value, "quality observation");
  assertExactFields(record, ["score", "scale"], "quality observation");
  return { score: asFiniteNonNegative(record.score, "quality.score"), scale: asNonEmptyString(record.scale, "quality.scale") };
}

function normalizeFailure(value: unknown): FailureObservation | null {
  if (value === null) return null;
  const record = asRecord(value, "failure observation");
  assertExactFields(record, ["code", "category"], "failure observation");
  return { code: asNonEmptyString(record.code, "failure.code"), category: asNonEmptyString(record.category, "failure.category") };
}

function normalizeCost(value: unknown): CostObservation | null {
  if (value === null) return null;
  const record = asRecord(value, "cost observation");
  assertExactFields(record, ["amount", "unit"], "cost observation");
  return { amount: asFiniteNonNegative(record.amount, "cost.amount"), unit: asNonEmptyString(record.unit, "cost.unit") };
}

function normalizeEvidenceRefs(value: unknown): readonly string[] {
  if (!Array.isArray(value)) throw new Error("evidenceRefs must be an array");
  const refs = value.map((ref, index) => asNonEmptyString(ref, `evidenceRefs[${index}]`));
  if (new Set(refs).size !== refs.length) throw new Error("evidenceRefs must not contain duplicates");
  return [...refs].sort((left, right) => left.localeCompare(right));
}

function normalizeObservation(value: unknown): ModelUsageObservation {
  const record = asRecord(value, "model usage observation");
  assertExactFields(record, ["contractVersion", "observationId", "requestId", "responseId", "quality", "failure", "cost", "evidenceRefs"], "model usage observation");
  if (record.contractVersion !== AI_GATEWAY_USAGE_OBSERVATION_VERSION) throw new Error(`unsupported AI Gateway usage observation version: ${String(record.contractVersion)}`);
  if (record.responseId !== null && (typeof record.responseId !== "string" || record.responseId.trim().length === 0)) throw new Error("responseId must be null or a non-empty string");
  return {
    contractVersion: AI_GATEWAY_USAGE_OBSERVATION_VERSION,
    observationId: asNonEmptyString(record.observationId, "observationId"),
    requestId: asNonEmptyString(record.requestId, "requestId"),
    responseId: record.responseId as string | null,
    quality: normalizeQuality(record.quality),
    failure: normalizeFailure(record.failure),
    cost: normalizeCost(record.cost),
    evidenceRefs: normalizeEvidenceRefs(record.evidenceRefs),
  };
}

export function normalizeModelUsageObservationEnvelope(value: unknown): ModelUsageObservationEnvelope {
  const record = asRecord(value, "model usage observation envelope");
  assertExactFields(record, ["permissionPolicyId", "permissions", "observation"], "model usage observation envelope");
  const permissionPolicyId = asNonEmptyString(record.permissionPolicyId, "permissionPolicyId");
  const permissions = normalizePermissions(record.permissions);
  const observation = normalizeObservation(record.observation);
  if (!permissions.quality && observation.quality !== null) throw new Error("quality observation must be null when quality permission is denied");
  if (!permissions.failure && observation.failure !== null) throw new Error("failure observation must be null when failure permission is denied");
  if (!permissions.cost && observation.cost !== null) throw new Error("cost observation must be null when cost permission is denied");
  return { permissionPolicyId, permissions, observation };
}
