import {
  normalizeDefinitionRevisionRef,
  type DefinitionRevisionRef,
} from "../semantic-substrate/index.js";

export const MATHEMATICAL_SEMANTICS_CONTRACT_VERSION = "1.0.0" as const;
export const ANALYTICAL_DEFINITION_KINDS = ["EXPRESSION", "RULE", "MODEL", "DERIVATION"] as const;
export const ANALYTICAL_VALUE_TYPES = ["NUMBER", "BOOLEAN", "STRING", "TEMPORAL", "VECTOR", "STRUCTURED"] as const;

export type AnalyticalDefinitionKind = (typeof ANALYTICAL_DEFINITION_KINDS)[number];
export type AnalyticalValueType = (typeof ANALYTICAL_VALUE_TYPES)[number];

export type AnalyticalDefinitionRevision = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  ref: DefinitionRevisionRef;
  kind: AnalyticalDefinitionKind;
}>;

export type AnalyticalInputBinding = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  inputRef: string;
  producingAnalyticalRevision: DefinitionRevisionRef;
  sourceRevision: DefinitionRevisionRef;
  valueType: AnalyticalValueType;
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

function version(value: unknown): typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION {
  if (value !== MATHEMATICAL_SEMANTICS_CONTRACT_VERSION) throw new Error(`unsupported mathematical semantics contract version: ${String(value)}`);
  return MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of ${allowed.join(", ")}`);
  return value as T[number];
}

function revisionKey(ref: DefinitionRevisionRef): string {
  return [ref.semanticOwner, ref.semanticKind, ref.canonicalRef, ref.definitionRef, ref.revisionOwner, ref.revisionDimension, ref.revisionRef].join("\u0000");
}

export function normalizeAnalyticalDefinitionRevision(input: unknown): AnalyticalDefinitionRevision {
  const record = asRecord(input, "analytical definition revision");
  exact(record, ["contractVersion", "ref", "kind"], "analytical definition revision");
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    ref: normalizeDefinitionRevisionRef(record.ref),
    kind: oneOf(record.kind, ANALYTICAL_DEFINITION_KINDS, "kind"),
  });
}

export function normalizeAnalyticalInputBinding(
  input: unknown,
  expectedProducingRevision: DefinitionRevisionRef,
): AnalyticalInputBinding {
  const record = asRecord(input, "analytical input binding");
  exact(record, ["contractVersion", "inputRef", "producingAnalyticalRevision", "sourceRevision", "valueType"], "analytical input binding");
  const producingAnalyticalRevision = normalizeDefinitionRevisionRef(record.producingAnalyticalRevision);
  const expected = normalizeDefinitionRevisionRef(expectedProducingRevision);
  if (revisionKey(producingAnalyticalRevision) !== revisionKey(expected)) {
    throw new Error("analytical input binding producing revision must exactly match the requested analytical revision");
  }
  const sourceRevision = normalizeDefinitionRevisionRef(record.sourceRevision);
  if (revisionKey(sourceRevision) === revisionKey(producingAnalyticalRevision)) {
    throw new Error("analytical input binding source revision must remain independently identified from the producing analytical revision");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    inputRef: nonEmpty(record.inputRef, "inputRef"),
    producingAnalyticalRevision,
    sourceRevision,
    valueType: oneOf(record.valueType, ANALYTICAL_VALUE_TYPES, "valueType"),
  });
}

export type DimensionTerm = Readonly<{
  axis: string;
  exponent: number;
}>;

export type DimensionSignature = Readonly<{
  terms: readonly DimensionTerm[];
}>;

export type KnownUnitReference = Readonly<{
  state: "KNOWN";
  unitRef: string;
  unitRevision: string;
  dimension: DimensionSignature;
}>;

export type UnknownUnitReference = Readonly<{
  state: "UNKNOWN";
  reason: string;
}>;

export type UnitReference = KnownUnitReference | UnknownUnitReference;

export type AnalyticalUnitBinding = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  valueRef: string;
  producingAnalyticalRevision: DefinitionRevisionRef;
  sourceRevision: DefinitionRevisionRef;
  unit: UnitReference;
}>;

function finiteInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(`${field} must be a finite integer`);
  }
  return value;
}

export function normalizeDimensionSignature(input: unknown): DimensionSignature {
  const record = asRecord(input, "dimension signature");
  exact(record, ["terms"], "dimension signature");
  if (!Array.isArray(record.terms)) throw new Error("dimension signature terms must be an array");

  const seen = new Set<string>();
  const terms = record.terms.map((raw, index) => {
    const term = asRecord(raw, `dimension term ${index}`);
    exact(term, ["axis", "exponent"], `dimension term ${index}`);
    const axis = nonEmpty(term.axis, `dimension term ${index} axis`);
    const exponent = finiteInteger(term.exponent, `dimension term ${index} exponent`);
    if (exponent === 0) throw new Error("dimension terms must omit zero exponents");
    if (seen.has(axis)) throw new Error(`dimension axis ${axis} must appear only once`);
    seen.add(axis);
    return Object.freeze({ axis, exponent });
  });

  terms.sort((left, right) => left.axis.localeCompare(right.axis));
  return Object.freeze({ terms: Object.freeze(terms) });
}

export function normalizeUnitReference(input: unknown): UnitReference {
  const record = asRecord(input, "unit reference");
  const state = oneOf(record.state, ["KNOWN", "UNKNOWN"] as const, "unit state");
  if (state === "UNKNOWN") {
    exact(record, ["state", "reason"], "unknown unit reference");
    return Object.freeze({
      state,
      reason: nonEmpty(record.reason, "unknown unit reason"),
    });
  }

  exact(record, ["state", "unitRef", "unitRevision", "dimension"], "known unit reference");
  return Object.freeze({
    state,
    unitRef: nonEmpty(record.unitRef, "unitRef"),
    unitRevision: nonEmpty(record.unitRevision, "unitRevision"),
    dimension: normalizeDimensionSignature(record.dimension),
  });
}

function dimensionKey(dimension: DimensionSignature): string {
  const normalized = normalizeDimensionSignature(dimension);
  return normalized.terms.map((term) => `${term.axis}:${term.exponent}`).join("|");
}

export function assertCompatibleDimensions(left: UnitReference, right: UnitReference): void {
  if (left.state !== "KNOWN" || right.state !== "KNOWN") {
    throw new Error("unit compatibility is unresolved while either unit semantics are UNKNOWN");
  }
  if (dimensionKey(left.dimension) !== dimensionKey(right.dimension)) {
    throw new Error("unit dimensions are incompatible");
  }
}

export function normalizeAnalyticalUnitBinding(
  input: unknown,
  expectedInputBinding: AnalyticalInputBinding,
): AnalyticalUnitBinding {
  const record = asRecord(input, "analytical unit binding");
  exact(record, ["contractVersion", "valueRef", "producingAnalyticalRevision", "sourceRevision", "unit"], "analytical unit binding");

  const producingAnalyticalRevision = normalizeDefinitionRevisionRef(record.producingAnalyticalRevision);
  const sourceRevision = normalizeDefinitionRevisionRef(record.sourceRevision);

  if (revisionKey(producingAnalyticalRevision) !== revisionKey(expectedInputBinding.producingAnalyticalRevision)) {
    throw new Error("unit binding producing revision must preserve the analytical input producing revision");
  }
  if (revisionKey(sourceRevision) !== revisionKey(expectedInputBinding.sourceRevision)) {
    throw new Error("unit binding source revision must preserve the analytical input source revision");
  }

  return Object.freeze({
    contractVersion: version(record.contractVersion),
    valueRef: nonEmpty(record.valueRef, "valueRef"),
    producingAnalyticalRevision,
    sourceRevision,
    unit: normalizeUnitReference(record.unit),
  });
}
