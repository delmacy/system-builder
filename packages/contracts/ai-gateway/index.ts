export const AI_GATEWAY_MODEL_IO_VERSION = "1.0.0" as const;
export const AI_GATEWAY_MODEL_CAPABILITY_VERSION = "1.0.0" as const;

export type ModelRequest = Readonly<{
  contractVersion: typeof AI_GATEWAY_MODEL_IO_VERSION;
  requestId: string;
  input: unknown;
}>;

export type ModelResponse = Readonly<{
  contractVersion: typeof AI_GATEWAY_MODEL_IO_VERSION;
  requestId: string;
  responseId: string;
  output: unknown;
}>;

export type ModelLimitValue = string | number;

export type ModelCapabilityDescriptor = Readonly<{
  contractVersion: typeof AI_GATEWAY_MODEL_CAPABILITY_VERSION;
  capabilities: readonly string[];
  limits: Readonly<Record<string, ModelLimitValue>>;
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

function assertVersion(value: unknown): typeof AI_GATEWAY_MODEL_IO_VERSION {
  if (value !== AI_GATEWAY_MODEL_IO_VERSION) {
    throw new Error(`unsupported AI Gateway model I/O contract version: ${String(value)}`);
  }
  return AI_GATEWAY_MODEL_IO_VERSION;
}

function assertCapabilityVersion(value: unknown): typeof AI_GATEWAY_MODEL_CAPABILITY_VERSION {
  if (value !== AI_GATEWAY_MODEL_CAPABILITY_VERSION) {
    throw new Error(`unsupported AI Gateway model capability contract version: ${String(value)}`);
  }
  return AI_GATEWAY_MODEL_CAPABILITY_VERSION;
}

function normalizeCapabilities(value: unknown): readonly string[] {
  if (!Array.isArray(value)) throw new Error("capabilities must be an array");
  const normalized = value.map((capability, index) => asNonEmptyString(capability, `capabilities[${index}]`));
  if (new Set(normalized).size !== normalized.length) {
    throw new Error("capabilities must not contain duplicates");
  }
  return normalized;
}

function normalizeLimits(value: unknown): Readonly<Record<string, ModelLimitValue>> {
  const record = asRecord(value, "limits");
  const normalized: Record<string, ModelLimitValue> = {};
  for (const [key, limit] of Object.entries(record)) {
    asNonEmptyString(key, "limit key");
    if (typeof limit === "number") {
      if (!Number.isFinite(limit) || limit < 0) throw new Error(`limit ${key} must be a finite non-negative number`);
      normalized[key] = limit;
      continue;
    }
    if (typeof limit === "string" && limit.trim().length > 0) {
      normalized[key] = limit;
      continue;
    }
    throw new Error(`limit ${key} must be a finite non-negative number or non-empty string`);
  }
  return normalized;
}

export function normalizeModelRequest(value: unknown): ModelRequest {
  const record = asRecord(value, "model request");
  assertExactFields(record, ["contractVersion", "requestId", "input"], "model request");

  return {
    contractVersion: assertVersion(record.contractVersion),
    requestId: asNonEmptyString(record.requestId, "requestId"),
    input: record.input,
  };
}

export function normalizeModelResponse(value: unknown): ModelResponse {
  const record = asRecord(value, "model response");
  assertExactFields(record, ["contractVersion", "requestId", "responseId", "output"], "model response");

  return {
    contractVersion: assertVersion(record.contractVersion),
    requestId: asNonEmptyString(record.requestId, "requestId"),
    responseId: asNonEmptyString(record.responseId, "responseId"),
    output: record.output,
  };
}

export function normalizeModelCapabilityDescriptor(value: unknown): ModelCapabilityDescriptor {
  const record = asRecord(value, "model capability descriptor");
  assertExactFields(record, ["contractVersion", "capabilities", "limits"], "model capability descriptor");

  return {
    contractVersion: assertCapabilityVersion(record.contractVersion),
    capabilities: normalizeCapabilities(record.capabilities),
    limits: normalizeLimits(record.limits),
  };
}
