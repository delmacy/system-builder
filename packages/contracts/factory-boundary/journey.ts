export const FACTORY_JOURNEY_CONTRACT_VERSION = "1.0.0" as const;

export const FACTORY_JOURNEY_STAGE_KINDS = [
  "approved-process",
  "analysis-definition",
  "capability-assembly",
  "validation",
  "compiler-release",
  "deployment",
] as const;

export type FactoryJourneyStageKind = (typeof FACTORY_JOURNEY_STAGE_KINDS)[number];

export type FactoryJourneyStageDescriptor = Readonly<{
  kind: FactoryJourneyStageKind;
  identityRef: string;
  provenanceRef: string;
}>;

export type FactoryJourneyEnvelope = Readonly<{
  contractVersion: typeof FACTORY_JOURNEY_CONTRACT_VERSION;
  stages: readonly FactoryJourneyStageDescriptor[];
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

function normalizeStage(value: unknown, index: number): FactoryJourneyStageDescriptor {
  const record = asRecord(value, `factory journey stage ${index + 1}`);
  assertExactFields(record, ["kind", "identityRef", "provenanceRef"], `factory journey stage ${index + 1}`);
  const expectedKind = FACTORY_JOURNEY_STAGE_KINDS[index];
  if (record.kind !== expectedKind) {
    throw new Error(`factory journey stage ${index + 1} must be ${expectedKind}`);
  }
  return Object.freeze({
    kind: expectedKind,
    identityRef: nonEmpty(record.identityRef, `stages[${index}].identityRef`),
    provenanceRef: nonEmpty(record.provenanceRef, `stages[${index}].provenanceRef`),
  });
}

export function normalizeFactoryJourneyEnvelope(input: unknown): FactoryJourneyEnvelope {
  const record = asRecord(input, "factory journey envelope");
  assertExactFields(record, ["contractVersion", "stages"], "factory journey envelope");
  if (record.contractVersion !== FACTORY_JOURNEY_CONTRACT_VERSION) {
    throw new Error(`unsupported factory journey contract version: ${String(record.contractVersion)}`);
  }
  if (!Array.isArray(record.stages) || record.stages.length !== FACTORY_JOURNEY_STAGE_KINDS.length) {
    throw new Error(`factory journey must contain exactly ${FACTORY_JOURNEY_STAGE_KINDS.length} ordered stages`);
  }
  const stages = record.stages.map((stage, index) => normalizeStage(stage, index));
  return Object.freeze({
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    stages: Object.freeze(stages),
  });
}
