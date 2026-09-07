export const SEMANTIC_SUBSTRATE_CONTRACT_VERSION = "1.0.0" as const;

export type CanonicalSemanticIdentityRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
  canonicalRef: string;
}>;

export type DefinitionRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
  canonicalRef: string;
  definitionRef: string;
}>;

export type OccurrenceRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
  canonicalRef: string;
  occurrenceRef: string;
}>;

export type RealizationIdentityRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
  realizationProvider: string;
  realizationRef: string;
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

function version(value: unknown): typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION {
  if (value !== SEMANTIC_SUBSTRATE_CONTRACT_VERSION) {
    throw new Error(`unsupported semantic substrate contract version: ${String(value)}`);
  }
  return SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
}

function semanticCoordinates(record: UnknownRecord): Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
}> {
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    semanticOwner: nonEmpty(record.semanticOwner, "semanticOwner"),
    semanticKind: nonEmpty(record.semanticKind, "semanticKind"),
  });
}

export function normalizeCanonicalSemanticIdentityRef(input: unknown): CanonicalSemanticIdentityRef {
  const record = asRecord(input, "canonical semantic identity");
  assertExactFields(
    record,
    ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef"],
    "canonical semantic identity",
  );
  return Object.freeze({
    ...semanticCoordinates(record),
    canonicalRef: nonEmpty(record.canonicalRef, "canonicalRef"),
  });
}

export function normalizeDefinitionRef(input: unknown): DefinitionRef {
  const record = asRecord(input, "semantic definition ref");
  assertExactFields(
    record,
    ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef", "definitionRef"],
    "semantic definition ref",
  );
  const canonical = normalizeCanonicalSemanticIdentityRef({
    contractVersion: record.contractVersion,
    semanticOwner: record.semanticOwner,
    semanticKind: record.semanticKind,
    canonicalRef: record.canonicalRef,
  });
  return Object.freeze({
    ...canonical,
    definitionRef: nonEmpty(record.definitionRef, "definitionRef"),
  });
}

export function normalizeOccurrenceRef(input: unknown): OccurrenceRef {
  const record = asRecord(input, "semantic occurrence ref");
  assertExactFields(
    record,
    ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef", "occurrenceRef"],
    "semantic occurrence ref",
  );
  const canonical = normalizeCanonicalSemanticIdentityRef({
    contractVersion: record.contractVersion,
    semanticOwner: record.semanticOwner,
    semanticKind: record.semanticKind,
    canonicalRef: record.canonicalRef,
  });
  return Object.freeze({
    ...canonical,
    occurrenceRef: nonEmpty(record.occurrenceRef, "occurrenceRef"),
  });
}

export function normalizeRealizationIdentityRef(input: unknown): RealizationIdentityRef {
  const record = asRecord(input, "semantic realization identity");
  assertExactFields(
    record,
    ["contractVersion", "semanticOwner", "semanticKind", "realizationProvider", "realizationRef"],
    "semantic realization identity",
  );
  return Object.freeze({
    ...semanticCoordinates(record),
    realizationProvider: nonEmpty(record.realizationProvider, "realizationProvider"),
    realizationRef: nonEmpty(record.realizationRef, "realizationRef"),
  });
}
