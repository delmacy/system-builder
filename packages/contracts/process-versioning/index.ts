export const PROCESS_VERSION_IDENTITY_VERSION = "1.0.0" as const;

export type ProcessArtifactIdentity = Readonly<{
  contractVersion: typeof PROCESS_VERSION_IDENTITY_VERSION;
  artifactRef: string;
}>;

export type ProcessRevisionIdentity = Readonly<{
  contractVersion: typeof PROCESS_VERSION_IDENTITY_VERSION;
  artifactRef: string;
  revisionRef: string;
  revisionNumber: number;
  previousRevisionRef: string | null;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of fields) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function version(value: unknown): typeof PROCESS_VERSION_IDENTITY_VERSION {
  if (value !== PROCESS_VERSION_IDENTITY_VERSION) {
    throw new Error(`unsupported process version identity contract version: ${String(value)}`);
  }
  return PROCESS_VERSION_IDENTITY_VERSION;
}

export function normalizeProcessArtifactIdentity(input: unknown): ProcessArtifactIdentity {
  const record = asRecord(input, "process artifact identity");
  assertExactFields(record, ["contractVersion", "artifactRef"], "process artifact identity");
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    artifactRef: nonEmpty(record.artifactRef, "artifactRef"),
  });
}

export function normalizeProcessRevisionIdentity(input: unknown): ProcessRevisionIdentity {
  const record = asRecord(input, "process revision identity");
  assertExactFields(
    record,
    ["contractVersion", "artifactRef", "revisionRef", "revisionNumber", "previousRevisionRef"],
    "process revision identity",
  );
  const artifactRef = nonEmpty(record.artifactRef, "artifactRef");
  const revisionRef = nonEmpty(record.revisionRef, "revisionRef");
  if (artifactRef === revisionRef) throw new Error("artifactRef and revisionRef must be distinct");
  if (!Number.isSafeInteger(record.revisionNumber) || (record.revisionNumber as number) < 1) {
    throw new Error("revisionNumber must be a positive safe integer");
  }
  let previousRevisionRef: string | null = null;
  if (record.previousRevisionRef !== null) {
    previousRevisionRef = nonEmpty(record.previousRevisionRef, "previousRevisionRef");
    if (previousRevisionRef === revisionRef) throw new Error("previousRevisionRef must differ from revisionRef");
  }
  if ((record.revisionNumber as number) === 1 && previousRevisionRef !== null) {
    throw new Error("first revision cannot declare previousRevisionRef");
  }
  if ((record.revisionNumber as number) > 1 && previousRevisionRef === null) {
    throw new Error("successor revision must declare previousRevisionRef");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    artifactRef,
    revisionRef,
    revisionNumber: record.revisionNumber as number,
    previousRevisionRef,
  });
}
