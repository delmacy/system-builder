import {
  normalizeCurrentnessQualification,
  normalizeDefinitionRevisionRef,
  type CurrentnessQualification,
  type DefinitionRevisionRef,
} from "../semantic-substrate/index.js";
import {
  normalizeLocalityQualification,
  type LocalityQualification,
} from "../semantic-substrate/federation.js";

export const SECRET_CONFIG_LINEAGE_CONTRACT_VERSION = "1.0.0" as const;
export type PresenceIntent = "VALUE_REF" | "ABSENT" | "NULL" | "DEFAULT" | "DELETE";
export type AdoptionState = "CURRENT" | "PARTIAL" | "STALE" | "UNKNOWN";
export type SecretConfigReference = Readonly<{
  contractVersion: typeof SECRET_CONFIG_LINEAGE_CONTRACT_VERSION;
  definition: DefinitionRevisionRef;
  providerRealizationRef?: string;
}>;
export type DesiredSecretConfigState = Readonly<{
  contractVersion: typeof SECRET_CONFIG_LINEAGE_CONTRACT_VERSION;
  reference: SecretConfigReference;
  desiredRevision: DefinitionRevisionRef;
  presence: PresenceIntent;
  locality: LocalityQualification;
}>;
export type MaterializedSecretConfigState = Readonly<{
  contractVersion: typeof SECRET_CONFIG_LINEAGE_CONTRACT_VERSION;
  desired: DesiredSecretConfigState;
  materializedGeneration: DefinitionRevisionRef;
  evidence: DefinitionRevisionRef;
  currentness: CurrentnessQualification;
  locality: LocalityQualification;
}>;
export type ConsumerEffectiveSecretConfigState = Readonly<{
  contractVersion: typeof SECRET_CONFIG_LINEAGE_CONTRACT_VERSION;
  materialized: MaterializedSecretConfigState;
  consumerPopulation: string;
  effectiveGeneration: DefinitionRevisionRef;
  adoption: AdoptionState;
  evidence: DefinitionRevisionRef;
  currentness: CurrentnessQualification;
  locality: LocalityQualification;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(
  record: UnknownRecord,
  required: readonly string[],
  optional: readonly string[],
  label: string,
): void {
  for (const key of Object.keys(record)) {
    if (!required.includes(key) && !optional.includes(key)) {
      throw new Error(`${label} has unexpected field ${key}`);
    }
  }
  for (const key of required) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function version(value: unknown): typeof SECRET_CONFIG_LINEAGE_CONTRACT_VERSION {
  if (value !== SECRET_CONFIG_LINEAGE_CONTRACT_VERSION) {
    throw new Error("unsupported secret/config lineage contract version");
  }
  return value;
}

function nonEmpty(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be non-empty`);
  }
  return value.trim();
}

function revisionKey(value: DefinitionRevisionRef): string {
  return [
    value.semanticOwner,
    value.semanticKind,
    value.canonicalRef,
    value.definitionRef,
    value.revisionOwner,
    value.revisionDimension,
    value.revisionRef,
  ].join("\0");
}

function definitionKey(value: DefinitionRevisionRef): string {
  return [
    value.semanticOwner,
    value.semanticKind,
    value.canonicalRef,
    value.definitionRef,
  ].join("\0");
}

function localityKey(value: LocalityQualification): string {
  return `${value.scopeKind}\0${value.localityRef}`;
}

export function normalizeSecretConfigReference(input: unknown): SecretConfigReference {
  const record = asRecord(input, "secret/config reference");
  if ("value" in record || "secretValue" in record || "privateKey" in record) {
    throw new Error("secret material is not admissible");
  }
  assertExactFields(
    record,
    ["contractVersion", "definition"],
    ["providerRealizationRef"],
    "secret/config reference",
  );
  const definition = normalizeDefinitionRevisionRef(record.definition);
  const providerRealizationRef =
    record.providerRealizationRef === undefined
      ? undefined
      : nonEmpty(record.providerRealizationRef, "provider realization ref");
  if (providerRealizationRef === definition.canonicalRef) {
    throw new Error("provider realization id cannot become canonical reference");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    definition,
    ...(providerRealizationRef ? { providerRealizationRef } : {}),
  });
}

export function normalizeDesiredSecretConfigState(input: unknown): DesiredSecretConfigState {
  const record = asRecord(input, "desired secret/config state");
  assertExactFields(
    record,
    ["contractVersion", "reference", "desiredRevision", "presence", "locality"],
    [],
    "desired secret/config state",
  );
  const reference = normalizeSecretConfigReference(record.reference);
  const desiredRevision = normalizeDefinitionRevisionRef(record.desiredRevision);
  const locality = normalizeLocalityQualification(record.locality);
  if (definitionKey(desiredRevision) !== definitionKey(reference.definition)) {
    throw new Error("desired revision must remain on the referenced definition lineage");
  }
  if (!["VALUE_REF", "ABSENT", "NULL", "DEFAULT", "DELETE"].includes(String(record.presence))) {
    throw new Error("invalid presence intent");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    reference,
    desiredRevision,
    presence: record.presence as PresenceIntent,
    locality,
  });
}

export function normalizeMaterializedSecretConfigState(input: unknown): MaterializedSecretConfigState {
  const record = asRecord(input, "materialized secret/config state");
  assertExactFields(
    record,
    ["contractVersion", "desired", "materializedGeneration", "evidence", "currentness", "locality"],
    [],
    "materialized secret/config state",
  );
  const desired = normalizeDesiredSecretConfigState(record.desired);
  const materializedGeneration = normalizeDefinitionRevisionRef(record.materializedGeneration);
  const evidence = normalizeDefinitionRevisionRef(record.evidence);
  const currentness = normalizeCurrentnessQualification(record.currentness);
  const locality = normalizeLocalityQualification(record.locality);
  if (definitionKey(materializedGeneration) !== definitionKey(desired.desiredRevision)) {
    throw new Error("materialized generation must remain on the desired definition lineage");
  }
  if (revisionKey(currentness.subject) !== revisionKey(evidence)) {
    throw new Error("materialization currentness must qualify exact evidence revision");
  }
  if (
    localityKey(locality) !== localityKey(desired.locality) ||
    currentness.localityScope !== locality.localityRef
  ) {
    throw new Error("materialization locality cannot strengthen or substitute desired locality");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    desired,
    materializedGeneration,
    evidence,
    currentness,
    locality,
  });
}

export function normalizeConsumerEffectiveSecretConfigState(
  input: unknown,
): ConsumerEffectiveSecretConfigState {
  const record = asRecord(input, "consumer-effective secret/config state");
  assertExactFields(
    record,
    [
      "contractVersion",
      "materialized",
      "consumerPopulation",
      "effectiveGeneration",
      "adoption",
      "evidence",
      "currentness",
      "locality",
    ],
    [],
    "consumer-effective secret/config state",
  );
  const materialized = normalizeMaterializedSecretConfigState(record.materialized);
  const effectiveGeneration = normalizeDefinitionRevisionRef(record.effectiveGeneration);
  const evidence = normalizeDefinitionRevisionRef(record.evidence);
  const currentness = normalizeCurrentnessQualification(record.currentness);
  const locality = normalizeLocalityQualification(record.locality);
  const consumerPopulation = nonEmpty(record.consumerPopulation, "consumer population");
  if (definitionKey(effectiveGeneration) !== definitionKey(materialized.materializedGeneration)) {
    throw new Error("effective generation must remain on the materialized definition lineage");
  }
  if (!["CURRENT", "PARTIAL", "STALE", "UNKNOWN"].includes(String(record.adoption))) {
    throw new Error("invalid adoption state");
  }
  if (revisionKey(currentness.subject) !== revisionKey(evidence)) {
    throw new Error("consumer currentness must qualify exact evidence revision");
  }
  if (
    localityKey(locality) !== localityKey(materialized.locality) ||
    currentness.localityScope !== locality.localityRef
  ) {
    throw new Error("consumer locality cannot strengthen or substitute materialized locality");
  }
  if (
    record.adoption === "CURRENT" &&
    (currentness.state !== "CURRENT" ||
      revisionKey(effectiveGeneration) !== revisionKey(materialized.materializedGeneration))
  ) {
    throw new Error("CURRENT adoption requires current evidence and exact materialized generation");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    materialized,
    consumerPopulation,
    effectiveGeneration,
    adoption: record.adoption as AdoptionState,
    evidence,
    currentness,
    locality,
  });
}
