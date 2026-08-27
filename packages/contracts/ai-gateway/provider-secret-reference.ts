export const AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION = "1.0.0" as const;

export type ProviderSecretReferenceDescriptor = Readonly<{
  contractVersion: typeof AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION;
  secretRef: string;
}>;

type UnknownRecord = Record<string, unknown>;

const SECRET_REFERENCE_PREFIX = "secret-ref:";

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

function assertVersion(value: unknown): typeof AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION {
  if (value !== AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION) {
    throw new Error(`unsupported AI Gateway provider secret reference contract version: ${String(value)}`);
  }
  return AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION;
}

function normalizeOpaqueSecretRef(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("secretRef must be a non-empty string");
  }
  if (value !== value.trim()) throw new Error("secretRef must not contain surrounding whitespace");
  if (!value.startsWith(SECRET_REFERENCE_PREFIX) || value.length === SECRET_REFERENCE_PREFIX.length) {
    throw new Error(`secretRef must use the ${SECRET_REFERENCE_PREFIX}<opaque-id> reference form`);
  }
  if (/\s/.test(value)) throw new Error("secretRef must not contain whitespace");
  return value;
}

export function normalizeProviderSecretReferenceDescriptor(value: unknown): ProviderSecretReferenceDescriptor {
  const record = asRecord(value, "provider secret reference descriptor");
  assertExactFields(record, ["contractVersion", "secretRef"], "provider secret reference descriptor");

  return {
    contractVersion: assertVersion(record.contractVersion),
    secretRef: normalizeOpaqueSecretRef(record.secretRef),
  };
}
