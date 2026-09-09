import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalPrecisionTemporalBinding,
  type AnalyticalPrecisionTemporalBinding,
} from "./index.js";

export const VECTOR_LOCALITY_LEVELS = ["STATION", "FLEET", "GLOBAL"] as const;
export type VectorLocalityLevel = (typeof VECTOR_LOCALITY_LEVELS)[number];

export type VectorBasis = Readonly<{
  basisRef: string;
  basisRevision: string;
  dimension: number;
  coordinateOrder: readonly string[];
}>;

export type VectorLocality = Readonly<{
  level: VectorLocalityLevel;
  localityOwner: string;
  localityRef: string;
  localityRevision: string;
}>;

export type AnalyticalVectorBinding = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  shape: "VECTOR";
  vectorRef: string;
  qualifiedValue: AnalyticalPrecisionTemporalBinding;
  basis: VectorBasis;
  coordinates: readonly string[];
  locality: VectorLocality;
}>;

export type QualifiedVectorTransform = Readonly<{
  transformRef: string;
  transformRevision: string;
  transformOwner: string;
  sourceBasisRef: string;
  sourceBasisRevision: string;
  targetBasisRef: string;
  targetBasisRevision: string;
  sourceDimension: number;
  targetDimension: number;
  sourceCoordinateOrder: readonly string[];
  targetCoordinateOrder: readonly string[];
  sourceLocality: VectorLocality;
  targetLocality: VectorLocality;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function exact(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function positiveInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) throw new Error(`${field} must be a positive integer`);
  return value;
}

function stringList(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((item, index) => nonEmpty(item, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${field} entries must be unique`);
  return Object.freeze(normalized);
}

function oneOfLocality(value: unknown): VectorLocalityLevel {
  if (typeof value !== "string" || !VECTOR_LOCALITY_LEVELS.includes(value as VectorLocalityLevel)) {
    throw new Error(`locality level must be one of ${VECTOR_LOCALITY_LEVELS.join(", ")}`);
  }
  return value as VectorLocalityLevel;
}

export function normalizeVectorBasis(input: unknown): VectorBasis {
  const record = asRecord(input, "vector basis");
  exact(record, ["basisRef", "basisRevision", "dimension", "coordinateOrder"], "vector basis");
  const dimension = positiveInteger(record.dimension, "vector dimension");
  const coordinateOrder = stringList(record.coordinateOrder, "coordinateOrder");
  if (coordinateOrder.length !== dimension) throw new Error("vector dimension must match coordinate order length");
  return Object.freeze({
    basisRef: nonEmpty(record.basisRef, "basisRef"),
    basisRevision: nonEmpty(record.basisRevision, "basisRevision"),
    dimension,
    coordinateOrder,
  });
}

export function normalizeVectorLocality(input: unknown): VectorLocality {
  const record = asRecord(input, "vector locality");
  exact(record, ["level", "localityOwner", "localityRef", "localityRevision"], "vector locality");
  return Object.freeze({
    level: oneOfLocality(record.level),
    localityOwner: nonEmpty(record.localityOwner, "localityOwner"),
    localityRef: nonEmpty(record.localityRef, "localityRef"),
    localityRevision: nonEmpty(record.localityRevision, "localityRevision"),
  });
}

function revisionKey(value: AnalyticalPrecisionTemporalBinding): string {
  const ref = value.producingAnalyticalRevision;
  return [ref.semanticOwner, ref.semanticKind, ref.canonicalRef, ref.definitionRef, ref.revisionOwner, ref.revisionDimension, ref.revisionRef].join("\u0000");
}

function sourceRevisionKey(value: AnalyticalPrecisionTemporalBinding): string {
  const ref = value.sourceRevision;
  return [ref.semanticOwner, ref.semanticKind, ref.canonicalRef, ref.definitionRef, ref.revisionOwner, ref.revisionDimension, ref.revisionRef].join("\u0000");
}

function unitKey(value: AnalyticalPrecisionTemporalBinding): string {
  return JSON.stringify(value.unit);
}

function precisionKey(value: AnalyticalPrecisionTemporalBinding): string {
  return JSON.stringify(value.precisionPolicy);
}

function temporalKey(value: AnalyticalPrecisionTemporalBinding): string {
  return JSON.stringify(value.temporalContext);
}

function assertQualifiedValuePreserved(actual: AnalyticalPrecisionTemporalBinding, expected: AnalyticalPrecisionTemporalBinding): void {
  if (actual.valueRef !== expected.valueRef || revisionKey(actual) !== revisionKey(expected) || sourceRevisionKey(actual) !== sourceRevisionKey(expected)) {
    throw new Error("vector binding must preserve analytical value and revision lineage");
  }
  if (unitKey(actual) !== unitKey(expected)) throw new Error("vector binding must preserve unit qualification");
  if (precisionKey(actual) !== precisionKey(expected)) throw new Error("vector binding must preserve precision qualification");
  if (temporalKey(actual) !== temporalKey(expected)) throw new Error("vector binding must preserve temporal qualification");
}

export function normalizeAnalyticalVectorBinding(
  input: unknown,
  expectedQualifiedValue: AnalyticalPrecisionTemporalBinding,
): AnalyticalVectorBinding {
  const record = asRecord(input, "analytical vector binding");
  exact(record, ["contractVersion", "shape", "vectorRef", "qualifiedValue", "basis", "coordinates", "locality"], "analytical vector binding");
  if (record.contractVersion !== MATHEMATICAL_SEMANTICS_CONTRACT_VERSION) throw new Error("unsupported mathematical semantics contract version");
  if (record.shape !== "VECTOR") throw new Error("analytical vector binding shape must remain VECTOR");
  const basis = normalizeVectorBasis(record.basis);
  const coordinates = stringList(record.coordinates, "coordinates");
  if (coordinates.length !== basis.dimension) throw new Error("vector dimension must match coordinate count");
  if (coordinates.some((coordinate, index) => coordinate !== basis.coordinateOrder[index])) {
    throw new Error("vector coordinates must preserve declared basis order");
  }

  const expectedPolicy = {
    policyRef: expectedQualifiedValue.precisionPolicy.policyRef,
    policyRevision: expectedQualifiedValue.precisionPolicy.policyRevision,
  };
  const qualifiedValue = normalizeAnalyticalPrecisionTemporalBinding(
    record.qualifiedValue,
    {
      contractVersion: expectedQualifiedValue.contractVersion,
      valueRef: expectedQualifiedValue.valueRef,
      producingAnalyticalRevision: expectedQualifiedValue.producingAnalyticalRevision,
      sourceRevision: expectedQualifiedValue.sourceRevision,
      unit: expectedQualifiedValue.unit,
    },
    expectedPolicy,
  );
  assertQualifiedValuePreserved(qualifiedValue, expectedQualifiedValue);

  return Object.freeze({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR" as const,
    vectorRef: nonEmpty(record.vectorRef, "vectorRef"),
    qualifiedValue,
    basis,
    coordinates,
    locality: normalizeVectorLocality(record.locality),
  });
}

function basisKey(basis: VectorBasis): string {
  return [basis.basisRef, basis.basisRevision, String(basis.dimension), ...basis.coordinateOrder].join("\u0000");
}

function localityKey(locality: VectorLocality): string {
  return [locality.level, locality.localityOwner, locality.localityRef, locality.localityRevision].join("\u0000");
}

export function normalizeQualifiedVectorTransform(input: unknown): QualifiedVectorTransform {
  const record = asRecord(input, "qualified vector transform");
  exact(record, [
    "transformRef", "transformRevision", "transformOwner", "sourceBasisRef", "sourceBasisRevision",
    "targetBasisRef", "targetBasisRevision", "sourceDimension", "targetDimension", "sourceCoordinateOrder",
    "targetCoordinateOrder", "sourceLocality", "targetLocality",
  ], "qualified vector transform");
  const sourceDimension = positiveInteger(record.sourceDimension, "sourceDimension");
  const targetDimension = positiveInteger(record.targetDimension, "targetDimension");
  const sourceCoordinateOrder = stringList(record.sourceCoordinateOrder, "sourceCoordinateOrder");
  const targetCoordinateOrder = stringList(record.targetCoordinateOrder, "targetCoordinateOrder");
  if (sourceCoordinateOrder.length !== sourceDimension || targetCoordinateOrder.length !== targetDimension) {
    throw new Error("qualified vector transform dimensions must match declared coordinate orders");
  }
  return Object.freeze({
    transformRef: nonEmpty(record.transformRef, "transformRef"),
    transformRevision: nonEmpty(record.transformRevision, "transformRevision"),
    transformOwner: nonEmpty(record.transformOwner, "transformOwner"),
    sourceBasisRef: nonEmpty(record.sourceBasisRef, "sourceBasisRef"),
    sourceBasisRevision: nonEmpty(record.sourceBasisRevision, "sourceBasisRevision"),
    targetBasisRef: nonEmpty(record.targetBasisRef, "targetBasisRef"),
    targetBasisRevision: nonEmpty(record.targetBasisRevision, "targetBasisRevision"),
    sourceDimension,
    targetDimension,
    sourceCoordinateOrder,
    targetCoordinateOrder,
    sourceLocality: normalizeVectorLocality(record.sourceLocality),
    targetLocality: normalizeVectorLocality(record.targetLocality),
  });
}

export function assertVectorTransitionQualified(
  source: AnalyticalVectorBinding,
  target: AnalyticalVectorBinding,
  transform?: QualifiedVectorTransform,
): void {
  const unchanged = basisKey(source.basis) === basisKey(target.basis) && localityKey(source.locality) === localityKey(target.locality);
  if (unchanged) return;
  if (!transform) throw new Error("vector basis/order/dimension/locality change requires an explicit owner-qualified transform");
  const normalized = normalizeQualifiedVectorTransform(transform);
  if (
    normalized.sourceBasisRef !== source.basis.basisRef ||
    normalized.sourceBasisRevision !== source.basis.basisRevision ||
    normalized.targetBasisRef !== target.basis.basisRef ||
    normalized.targetBasisRevision !== target.basis.basisRevision ||
    normalized.sourceDimension !== source.basis.dimension ||
    normalized.targetDimension !== target.basis.dimension ||
    normalized.sourceCoordinateOrder.join("\u0000") !== source.basis.coordinateOrder.join("\u0000") ||
    normalized.targetCoordinateOrder.join("\u0000") !== target.basis.coordinateOrder.join("\u0000") ||
    localityKey(normalized.sourceLocality) !== localityKey(source.locality) ||
    localityKey(normalized.targetLocality) !== localityKey(target.locality)
  ) {
    throw new Error("qualified vector transform must exactly bind the source and target vector semantics");
  }
}
