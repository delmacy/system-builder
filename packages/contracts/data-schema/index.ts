import type { EvidenceProvenanceExtension } from "../evidence-provenance/index.js";
import { normalizeEvidenceProvenanceExtension } from "../evidence-provenance/index.js";
import type {
  CurrentnessQualification,
  DefinitionRevisionRef,
  RealizationIdentityRef,
} from "../semantic-substrate/index.js";
import { normalizeCurrentnessQualification } from "../semantic-substrate/index.js";

export const DATA_SCHEMA_CONTRACT_VERSION = "1.0.0" as const;

export type SchemaOperationDirection = "READ" | "WRITE";
export type SchemaCompatibilityState =
  | "COMPATIBLE"
  | "INCOMPATIBLE"
  | "PARTIAL"
  | "UNKNOWN"
  | "INCONCLUSIVE";
export type SchemaPopulationState = "CURRENT" | "HISTORICAL";
export type SchemaPopulationCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";

export type CanonicalSchemaRevision = Readonly<{
  contractVersion: typeof DATA_SCHEMA_CONTRACT_VERSION;
  schema: DefinitionRevisionRef;
  providerRealizations: readonly RealizationIdentityRef[];
}>;

export type SchemaPopulation = Readonly<{
  populationScope: string;
  producingRevision: DefinitionRevisionRef;
  state: SchemaPopulationState;
  completeness: SchemaPopulationCompleteness;
}>;

export type DirectionalSchemaCompatibilityClaim = Readonly<{
  contractVersion: typeof DATA_SCHEMA_CONTRACT_VERSION;
  claimRevision: DefinitionRevisionRef;
  sourceRevision: DefinitionRevisionRef;
  targetRevision: DefinitionRevisionRef;
  direction: SchemaOperationDirection;
  state: SchemaCompatibilityState;
  population: SchemaPopulation;
  evidence: EvidenceProvenanceExtension;
  currentness: CurrentnessQualification;
}>;

export type SchemaCompatibilityDecision = Readonly<{
  compatible: boolean;
  reason:
    | "EXPLICIT_CURRENT_COMPATIBILITY"
    | "NOT_COMPATIBLE"
    | "NON_CURRENT_EVIDENCE"
    | "POPULATION_NOT_KNOWN";
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function exactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
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

function revisionKey(ref: DefinitionRevisionRef): string {
  return [
    ref.contractVersion,
    ref.semanticOwner,
    ref.semanticKind,
    ref.canonicalRef,
    ref.definitionRef,
    ref.revisionOwner,
    ref.revisionDimension,
    ref.revisionRef,
  ].join("\u0000");
}

function sameRevision(left: DefinitionRevisionRef, right: DefinitionRevisionRef): boolean {
  return revisionKey(left) === revisionKey(right);
}

function normalizeRevision(value: unknown, label: string): DefinitionRevisionRef {
  const record = asRecord(value, label);
  const fields = [
    "contractVersion",
    "semanticOwner",
    "semanticKind",
    "canonicalRef",
    "definitionRef",
    "revisionOwner",
    "revisionDimension",
    "revisionRef",
  ] as const;
  exactFields(record, fields, label);
  if (record.contractVersion !== "1.0.0") throw new Error(`${label}.contractVersion must be 1.0.0`);
  return Object.freeze({
    contractVersion: "1.0.0",
    semanticOwner: nonEmpty(record.semanticOwner, `${label}.semanticOwner`),
    semanticKind: nonEmpty(record.semanticKind, `${label}.semanticKind`),
    canonicalRef: nonEmpty(record.canonicalRef, `${label}.canonicalRef`),
    definitionRef: nonEmpty(record.definitionRef, `${label}.definitionRef`),
    revisionOwner: nonEmpty(record.revisionOwner, `${label}.revisionOwner`),
    revisionDimension: nonEmpty(record.revisionDimension, `${label}.revisionDimension`),
    revisionRef: nonEmpty(record.revisionRef, `${label}.revisionRef`),
  });
}

function normalizeRealization(value: unknown, label: string): RealizationIdentityRef {
  const record = asRecord(value, label);
  exactFields(record, ["contractVersion", "semanticOwner", "semanticKind", "realizationProvider", "realizationRef"], label);
  if (record.contractVersion !== "1.0.0") throw new Error(`${label}.contractVersion must be 1.0.0`);
  return Object.freeze({
    contractVersion: "1.0.0",
    semanticOwner: nonEmpty(record.semanticOwner, `${label}.semanticOwner`),
    semanticKind: nonEmpty(record.semanticKind, `${label}.semanticKind`),
    realizationProvider: nonEmpty(record.realizationProvider, `${label}.realizationProvider`),
    realizationRef: nonEmpty(record.realizationRef, `${label}.realizationRef`),
  });
}

export function normalizeCanonicalSchemaRevision(input: unknown): CanonicalSchemaRevision {
  const record = asRecord(input, "canonical schema revision");
  exactFields(record, ["contractVersion", "schema", "providerRealizations"], "canonical schema revision");
  if (record.contractVersion !== DATA_SCHEMA_CONTRACT_VERSION) throw new Error("unsupported data schema contract version");
  if (!Array.isArray(record.providerRealizations)) throw new Error("providerRealizations must be an array");
  const schema = normalizeRevision(record.schema, "schema");
  const providerRealizations = record.providerRealizations.map((value, index) =>
    normalizeRealization(value, `providerRealizations[${index}]`),
  );
  for (const realization of providerRealizations) {
    if (realization.semanticOwner !== schema.semanticOwner || realization.semanticKind !== schema.semanticKind) {
      throw new Error("provider realization must preserve schema semantic owner and kind");
    }
  }
  return Object.freeze({ contractVersion: DATA_SCHEMA_CONTRACT_VERSION, schema, providerRealizations: Object.freeze(providerRealizations) });
}

export function normalizeSchemaPopulation(input: unknown): SchemaPopulation {
  const record = asRecord(input, "schema population");
  exactFields(record, ["populationScope", "producingRevision", "state", "completeness"], "schema population");
  if (record.state !== "CURRENT" && record.state !== "HISTORICAL") throw new Error("schema population state must be CURRENT or HISTORICAL");
  if (record.completeness !== "KNOWN" && record.completeness !== "PARTIAL" && record.completeness !== "UNKNOWN") {
    throw new Error("schema population completeness must be KNOWN, PARTIAL or UNKNOWN");
  }
  return Object.freeze({
    populationScope: nonEmpty(record.populationScope, "populationScope"),
    producingRevision: normalizeRevision(record.producingRevision, "producingRevision"),
    state: record.state,
    completeness: record.completeness,
  });
}

export function normalizeDirectionalSchemaCompatibilityClaim(input: unknown): DirectionalSchemaCompatibilityClaim {
  const record = asRecord(input, "schema compatibility claim");
  exactFields(
    record,
    ["contractVersion", "claimRevision", "sourceRevision", "targetRevision", "direction", "state", "population", "evidence", "currentness"],
    "schema compatibility claim",
  );
  if (record.contractVersion !== DATA_SCHEMA_CONTRACT_VERSION) throw new Error("unsupported data schema contract version");
  if (record.direction !== "READ" && record.direction !== "WRITE") throw new Error("direction must be READ or WRITE");
  const validStates = new Set<SchemaCompatibilityState>(["COMPATIBLE", "INCOMPATIBLE", "PARTIAL", "UNKNOWN", "INCONCLUSIVE"]);
  if (typeof record.state !== "string" || !validStates.has(record.state as SchemaCompatibilityState)) {
    throw new Error("invalid schema compatibility state");
  }
  const claimRevision = normalizeRevision(record.claimRevision, "claimRevision");
  const sourceRevision = normalizeRevision(record.sourceRevision, "sourceRevision");
  const targetRevision = normalizeRevision(record.targetRevision, "targetRevision");
  if (sameRevision(sourceRevision, targetRevision)) throw new Error("compatibility requires distinct source and target revisions");
  if (sourceRevision.canonicalRef !== targetRevision.canonicalRef || sourceRevision.definitionRef !== targetRevision.definitionRef) {
    throw new Error("compatibility revisions must belong to the same canonical schema definition");
  }
  const population = normalizeSchemaPopulation(record.population);
  if (!sameRevision(population.producingRevision, sourceRevision)) {
    throw new Error("population producing revision must exactly match compatibility source revision");
  }
  const evidence = normalizeEvidenceProvenanceExtension(record.evidence);
  const currentness = normalizeCurrentnessQualification(record.currentness);
  if (!sameRevision(currentness.subject, claimRevision)) {
    throw new Error("currentness subject must exactly match compatibility claim revision");
  }
  if (currentness.populationScope !== population.populationScope) {
    throw new Error("currentness population scope must exactly match compatibility population scope");
  }
  return Object.freeze({
    contractVersion: DATA_SCHEMA_CONTRACT_VERSION,
    claimRevision,
    sourceRevision,
    targetRevision,
    direction: record.direction,
    state: record.state as SchemaCompatibilityState,
    population,
    evidence,
    currentness,
  });
}

export function decideDirectionalSchemaCompatibility(claim: DirectionalSchemaCompatibilityClaim): SchemaCompatibilityDecision {
  if (claim.currentness.state !== "CURRENT") {
    return Object.freeze({ compatible: false, reason: "NON_CURRENT_EVIDENCE" });
  }
  if (claim.population.completeness !== "KNOWN") {
    return Object.freeze({ compatible: false, reason: "POPULATION_NOT_KNOWN" });
  }
  if (claim.state !== "COMPATIBLE") {
    return Object.freeze({ compatible: false, reason: "NOT_COMPATIBLE" });
  }
  return Object.freeze({ compatible: true, reason: "EXPLICIT_CURRENT_COMPATIBILITY" });
}

export function claimMatchesExactOperation(
  claim: DirectionalSchemaCompatibilityClaim,
  sourceRevision: DefinitionRevisionRef,
  targetRevision: DefinitionRevisionRef,
  direction: SchemaOperationDirection,
): boolean {
  return sameRevision(claim.sourceRevision, sourceRevision)
    && sameRevision(claim.targetRevision, targetRevision)
    && claim.direction === direction;
}
