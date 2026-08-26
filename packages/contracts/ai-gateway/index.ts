export const AI_GATEWAY_MODEL_IO_VERSION = "1.0.0" as const;

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
