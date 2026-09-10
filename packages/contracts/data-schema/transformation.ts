import type { EvidenceProvenanceExtension } from "../evidence-provenance/index.js";
import { normalizeEvidenceProvenanceExtension } from "../evidence-provenance/index.js";
import type { DefinitionRevisionRef } from "../semantic-substrate/index.js";
import { normalizeDefinitionRevisionRef } from "../semantic-substrate/index.js";
import type { PrecisionPolicy, UnitReference } from "../mathematical-semantics/index.js";
import {
  assertCompatibleDimensions,
  normalizePrecisionPolicy,
  normalizeUnitReference,
} from "../mathematical-semantics/index.js";

export const DATA_TRANSFORMATION_CONTRACT_VERSION = "1.0.0" as const;

export type FieldPresenceIntent = "VALUE_REF" | "ABSENT" | "NULL" | "DEFAULT" | "DELETE";
export type TransformationLossiness = "LOSSLESS" | "LOSSY" | "UNKNOWN";
export type TransformationCompatibility = "FULLY_COMPATIBLE" | "PARTIAL" | "INCOMPATIBLE" | "UNKNOWN";

export type UnitConversionQualification = Readonly<{
  sourceUnit: UnitReference;
  targetUnit: UnitReference;
}>;

export type PrecisionTransformationQualification = Readonly<{
  sourcePolicy: PrecisionPolicy;
  targetPolicy: PrecisionPolicy;
}>;

export type QualifiedFieldTransformation = Readonly<{
  contractVersion: typeof DATA_TRANSFORMATION_CONTRACT_VERSION;
  transformationRevision: DefinitionRevisionRef;
  sourceSchemaRevision: DefinitionRevisionRef;
  targetSchemaRevision: DefinitionRevisionRef;
  fieldRef: string;
  sourcePresence: FieldPresenceIntent;
  targetPresence: FieldPresenceIntent;
  defaultDefinitionRevision: DefinitionRevisionRef | null;
  unitConversion: UnitConversionQualification | null;
  precision: PrecisionTransformationQualification | null;
  lossiness: TransformationLossiness;
  compatibility: TransformationCompatibility;
  evidence: EvidenceProvenanceExtension;
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

function sameCanonicalDefinition(left: DefinitionRevisionRef, right: DefinitionRevisionRef): boolean {
  return left.semanticOwner === right.semanticOwner
    && left.semanticKind === right.semanticKind
    && left.canonicalRef === right.canonicalRef
    && left.definitionRef === right.definitionRef;
}

function presence(value: unknown, field: string): FieldPresenceIntent {
  const allowed = new Set<FieldPresenceIntent>(["VALUE_REF", "ABSENT", "NULL", "DEFAULT", "DELETE"]);
  if (typeof value !== "string" || !allowed.has(value as FieldPresenceIntent)) {
    throw new Error(`${field} must be VALUE_REF, ABSENT, NULL, DEFAULT or DELETE`);
  }
  return value as FieldPresenceIntent;
}

function lossiness(value: unknown): TransformationLossiness {
  if (value !== "LOSSLESS" && value !== "LOSSY" && value !== "UNKNOWN") {
    throw new Error("lossiness must be LOSSLESS, LOSSY or UNKNOWN");
  }
  return value;
}

function compatibility(value: unknown): TransformationCompatibility {
  if (value !== "FULLY_COMPATIBLE" && value !== "PARTIAL" && value !== "INCOMPATIBLE" && value !== "UNKNOWN") {
    throw new Error("compatibility must be FULLY_COMPATIBLE, PARTIAL, INCOMPATIBLE or UNKNOWN");
  }
  return value;
}

function normalizeUnitConversion(value: unknown): UnitConversionQualification | null {
  if (value === null) return null;
  const record = asRecord(value, "unit conversion");
  exactFields(record, ["sourceUnit", "targetUnit"], "unit conversion");
  const sourceUnit = normalizeUnitReference(record.sourceUnit);
  const targetUnit = normalizeUnitReference(record.targetUnit);
  if (sourceUnit.state !== "KNOWN" || targetUnit.state !== "KNOWN") {
    throw new Error("unit conversion requires known source and target unit semantics");
  }
  assertCompatibleDimensions(sourceUnit, targetUnit);
  return Object.freeze({ sourceUnit, targetUnit });
}

function normalizePrecision(value: unknown): PrecisionTransformationQualification | null {
  if (value === null) return null;
  const record = asRecord(value, "precision transformation");
  exactFields(record, ["sourcePolicy", "targetPolicy"], "precision transformation");
  return Object.freeze({
    sourcePolicy: normalizePrecisionPolicy(record.sourcePolicy),
    targetPolicy: normalizePrecisionPolicy(record.targetPolicy),
  });
}

function precisionCanDiscardInformation(precision: PrecisionTransformationQualification | null): boolean {
  if (precision === null) return false;
  return precision.targetPolicy.precision < precision.sourcePolicy.precision
    || precision.targetPolicy.scale < precision.sourcePolicy.scale;
}

function assertPresenceTransition(
  sourcePresence: FieldPresenceIntent,
  targetPresence: FieldPresenceIntent,
  defaultDefinitionRevision: DefinitionRevisionRef | null,
): void {
  if (sourcePresence === targetPresence) {
    if (targetPresence === "DEFAULT" && defaultDefinitionRevision === null) {
      throw new Error("DEFAULT presence requires an explicit default definition revision");
    }
    if (targetPresence !== "DEFAULT" && defaultDefinitionRevision !== null) {
      throw new Error("default definition revision is only valid for DEFAULT presence");
    }
    return;
  }

  if (sourcePresence === "ABSENT" && targetPresence === "DEFAULT") {
    if (defaultDefinitionRevision === null) {
      throw new Error("ABSENT to DEFAULT requires an explicit default definition revision");
    }
    return;
  }

  throw new Error(`presence intent transition ${sourcePresence}->${targetPresence} is not permitted`);
}

export function normalizeQualifiedFieldTransformation(input: unknown): QualifiedFieldTransformation {
  const record = asRecord(input, "qualified field transformation");
  exactFields(
    record,
    [
      "contractVersion",
      "transformationRevision",
      "sourceSchemaRevision",
      "targetSchemaRevision",
      "fieldRef",
      "sourcePresence",
      "targetPresence",
      "defaultDefinitionRevision",
      "unitConversion",
      "precision",
      "lossiness",
      "compatibility",
      "evidence",
    ],
    "qualified field transformation",
  );
  if (record.contractVersion !== DATA_TRANSFORMATION_CONTRACT_VERSION) {
    throw new Error("unsupported data transformation contract version");
  }

  const transformationRevision = normalizeDefinitionRevisionRef(record.transformationRevision);
  const sourceSchemaRevision = normalizeDefinitionRevisionRef(record.sourceSchemaRevision);
  const targetSchemaRevision = normalizeDefinitionRevisionRef(record.targetSchemaRevision);
  if (!sameCanonicalDefinition(sourceSchemaRevision, targetSchemaRevision)) {
    throw new Error("transformation schema revisions must belong to the same canonical schema definition");
  }
  if (revisionKey(sourceSchemaRevision) === revisionKey(targetSchemaRevision)) {
    throw new Error("transformation requires distinct source and target schema revisions");
  }

  const sourcePresence = presence(record.sourcePresence, "sourcePresence");
  const targetPresence = presence(record.targetPresence, "targetPresence");
  const defaultDefinitionRevision = record.defaultDefinitionRevision === null
    ? null
    : normalizeDefinitionRevisionRef(record.defaultDefinitionRevision);
  if (defaultDefinitionRevision !== null && !sameCanonicalDefinition(defaultDefinitionRevision, targetSchemaRevision)) {
    throw new Error("default definition revision must remain qualified to the target canonical schema definition");
  }
  assertPresenceTransition(sourcePresence, targetPresence, defaultDefinitionRevision);

  const unitConversion = normalizeUnitConversion(record.unitConversion);
  const precision = normalizePrecision(record.precision);
  const normalizedLossiness = lossiness(record.lossiness);
  const normalizedCompatibility = compatibility(record.compatibility);

  if (precisionCanDiscardInformation(precision) && normalizedLossiness === "LOSSLESS") {
    throw new Error("precision reduction cannot be qualified as LOSSLESS");
  }
  if (normalizedLossiness !== "LOSSLESS" && normalizedCompatibility === "FULLY_COMPATIBLE") {
    throw new Error("lossy or unknown-lossiness transformation cannot be FULLY_COMPATIBLE");
  }

  return Object.freeze({
    contractVersion: DATA_TRANSFORMATION_CONTRACT_VERSION,
    transformationRevision,
    sourceSchemaRevision,
    targetSchemaRevision,
    fieldRef: nonEmpty(record.fieldRef, "fieldRef"),
    sourcePresence,
    targetPresence,
    defaultDefinitionRevision,
    unitConversion,
    precision,
    lossiness: normalizedLossiness,
    compatibility: normalizedCompatibility,
    evidence: normalizeEvidenceProvenanceExtension(record.evidence),
  });
}
