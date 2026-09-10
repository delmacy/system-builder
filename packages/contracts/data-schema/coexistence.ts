import type { CurrentnessQualification, DefinitionRevisionRef } from "../semantic-substrate/index.js";
import { normalizeCurrentnessQualification, normalizeDefinitionRevisionRef } from "../semantic-substrate/index.js";

export const DATA_SCHEMA_COEXISTENCE_CONTRACT_VERSION = "1.0.0" as const;

export type CohortRole = "READER" | "WRITER";
export type CohortPopulationCount = number | "UNKNOWN";
export type CohortCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type CohortCompatibility = "COMPATIBLE" | "PARTIAL" | "INCOMPATIBLE" | "UNKNOWN" | "INCONCLUSIVE";

export type SchemaRevisionCohort = Readonly<{
  role: CohortRole;
  cohortRef: string;
  schemaRevision: DefinitionRevisionRef;
  populationScope: string;
  localityScope: string;
  populationCount: CohortPopulationCount;
  completeness: CohortCompleteness;
  compatibility: CohortCompatibility;
  currentness: CurrentnessQualification;
}>;

export type HistoricalSchemaRecord = Readonly<{
  recordRef: string;
  producingSchemaRevision: DefinitionRevisionRef;
  sourceRevision: DefinitionRevisionRef;
}>;

export type ReaderWriterCoexistence = Readonly<{
  contractVersion: typeof DATA_SCHEMA_COEXISTENCE_CONTRACT_VERSION;
  coexistenceRevision: DefinitionRevisionRef;
  evaluatedAt: string;
  historicalRecords: readonly HistoricalSchemaRecord[];
  readerCohorts: readonly SchemaRevisionCohort[];
  writerCohorts: readonly SchemaRevisionCohort[];
}>;

type UnknownRecord = Record<string, unknown>;
const asRecord = (value: unknown, label: string): UnknownRecord => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
};
const exactFields = (record: UnknownRecord, fields: readonly string[], label: string): void => {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
};
const nonEmpty = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};
const timestamp = (value: unknown, label: string): string => {
  const normalized = nonEmpty(value, label);
  if (!Number.isFinite(Date.parse(normalized))) throw new Error(`${label} must be an ISO timestamp`);
  return normalized;
};
const revisionKey = (value: DefinitionRevisionRef): string => [value.semanticOwner,value.semanticKind,value.canonicalRef,value.definitionRef,value.revisionOwner,value.revisionDimension,value.revisionRef].join("\u0000");
const sameRevision = (left: DefinitionRevisionRef, right: DefinitionRevisionRef): boolean => revisionKey(left) === revisionKey(right);

function normalizeCount(value: unknown): CohortPopulationCount {
  if (value === "UNKNOWN") return value;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new Error("populationCount must be a non-negative integer or UNKNOWN");
  return value;
}

function normalizeCohort(value: unknown, expectedRole: CohortRole, evaluatedAt: string): SchemaRevisionCohort {
  const record = asRecord(value, `${expectedRole.toLowerCase()} cohort`);
  exactFields(record,["role","cohortRef","schemaRevision","populationScope","localityScope","populationCount","completeness","compatibility","currentness"],`${expectedRole.toLowerCase()} cohort`);
  if (record.role !== expectedRole) throw new Error(`cohort role must be ${expectedRole}`);
  if (record.completeness !== "KNOWN" && record.completeness !== "PARTIAL" && record.completeness !== "UNKNOWN") throw new Error("invalid cohort completeness");
  if (!["COMPATIBLE","PARTIAL","INCOMPATIBLE","UNKNOWN","INCONCLUSIVE"].includes(String(record.compatibility))) throw new Error("invalid cohort compatibility");
  const schemaRevision = normalizeDefinitionRevisionRef(record.schemaRevision);
  const populationScope = nonEmpty(record.populationScope,"populationScope");
  const localityScope = nonEmpty(record.localityScope,"localityScope");
  const populationCount = normalizeCount(record.populationCount);
  const currentness = normalizeCurrentnessQualification(record.currentness);
  if (!sameRevision(currentness.subject, schemaRevision)) throw new Error("cohort currentness subject must exactly match cohort schema revision");
  if (currentness.populationScope !== populationScope) throw new Error("cohort currentness population scope must exactly match cohort population scope");
  if (currentness.localityScope !== localityScope) throw new Error("cohort currentness locality scope must exactly match cohort locality scope");
  if ((record.completeness === "PARTIAL" || record.completeness === "UNKNOWN") && populationCount !== "UNKNOWN") throw new Error("PARTIAL/UNKNOWN cohort completeness must preserve populationCount as UNKNOWN");
  if (record.compatibility === "COMPATIBLE") {
    if (currentness.state !== "CURRENT") throw new Error("non-current cohort cannot be promoted to COMPATIBLE");
    const evaluated = Date.parse(evaluatedAt);
    if (evaluated < Date.parse(currentness.currentnessHorizon.assessedAt) || evaluated > Date.parse(currentness.currentnessHorizon.validUntil)) throw new Error("COMPATIBLE cohort evidence cannot be reused outside its currentness horizon");
  }
  return Object.freeze({role:expectedRole,cohortRef:nonEmpty(record.cohortRef,"cohortRef"),schemaRevision,populationScope,localityScope,populationCount,completeness:record.completeness as CohortCompleteness,compatibility:record.compatibility as CohortCompatibility,currentness});
}

function normalizeHistoricalRecord(value: unknown): HistoricalSchemaRecord {
  const record = asRecord(value,"historical record");
  exactFields(record,["recordRef","producingSchemaRevision","sourceRevision"],"historical record");
  return Object.freeze({recordRef:nonEmpty(record.recordRef,"recordRef"),producingSchemaRevision:normalizeDefinitionRevisionRef(record.producingSchemaRevision),sourceRevision:normalizeDefinitionRevisionRef(record.sourceRevision)});
}

export function normalizeReaderWriterCoexistence(input: unknown): ReaderWriterCoexistence {
  const record = asRecord(input,"reader writer coexistence");
  exactFields(record,["contractVersion","coexistenceRevision","evaluatedAt","historicalRecords","readerCohorts","writerCohorts"],"reader writer coexistence");
  if (record.contractVersion !== DATA_SCHEMA_COEXISTENCE_CONTRACT_VERSION) throw new Error("unsupported data schema coexistence contract version");
  if (!Array.isArray(record.historicalRecords) || !Array.isArray(record.readerCohorts) || !Array.isArray(record.writerCohorts)) throw new Error("historicalRecords, readerCohorts and writerCohorts must be arrays");
  const evaluatedAt = timestamp(record.evaluatedAt,"evaluatedAt");
  const readerCohorts = record.readerCohorts.map((value)=>normalizeCohort(value,"READER",evaluatedAt));
  const writerCohorts = record.writerCohorts.map((value)=>normalizeCohort(value,"WRITER",evaluatedAt));
  if (readerCohorts.length === 0 || writerCohorts.length === 0) throw new Error("coexistence requires explicit reader and writer cohorts");
  return Object.freeze({contractVersion:DATA_SCHEMA_COEXISTENCE_CONTRACT_VERSION,coexistenceRevision:normalizeDefinitionRevisionRef(record.coexistenceRevision),evaluatedAt,historicalRecords:Object.freeze(record.historicalRecords.map(normalizeHistoricalRecord)),readerCohorts:Object.freeze(readerCohorts),writerCohorts:Object.freeze(writerCohorts)});
}

export function historicalRecordUsesExactProducingRevision(record: HistoricalSchemaRecord, requestedRevision: DefinitionRevisionRef): boolean {
  return sameRevision(record.producingSchemaRevision, requestedRevision);
}
