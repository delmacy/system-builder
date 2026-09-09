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

export const ROUNDING_MODES = [
  "HALF_EVEN",
  "HALF_UP",
  "HALF_DOWN",
  "TOWARD_ZERO",
  "AWAY_FROM_ZERO",
  "FLOOR",
  "CEILING",
] as const;
export const TEMPORAL_ANCHOR_KINDS = ["OBSERVATION", "EVENT", "EFFECTIVE"] as const;
export const TEMPORAL_BOUNDARIES = ["OPEN", "CLOSED"] as const;

export type RoundingMode = (typeof ROUNDING_MODES)[number];
export type TemporalAnchorKind = (typeof TEMPORAL_ANCHOR_KINDS)[number];
export type TemporalBoundary = (typeof TEMPORAL_BOUNDARIES)[number];

export type PrecisionPolicy = Readonly<{
  policyRef: string;
  policyRevision: string;
  precision: number;
  scale: number;
  roundingMode: RoundingMode;
}>;

export type TemporalAnchor = Readonly<{
  kind: TemporalAnchorKind;
  anchorRef: string;
  anchorRevision: string;
}>;

export type UnknownTemporalContext = Readonly<{
  state: "UNKNOWN";
  reason: string;
}>;

export type InstantTemporalContext = Readonly<{
  state: "INSTANT";
  at: string;
  anchor: TemporalAnchor;
}>;

export type WindowTemporalContext = Readonly<{
  state: "WINDOW";
  start: string;
  end: string;
  startBoundary: TemporalBoundary;
  endBoundary: TemporalBoundary;
  anchor: TemporalAnchor;
}>;

export type TemporalContext = UnknownTemporalContext | InstantTemporalContext | WindowTemporalContext;

export type AnalyticalPrecisionTemporalBinding = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  valueRef: string;
  producingAnalyticalRevision: DefinitionRevisionRef;
  sourceRevision: DefinitionRevisionRef;
  unit: UnitReference;
  precisionPolicy: PrecisionPolicy;
  temporalContext: TemporalContext;
}>;

function nonNegativeInteger(value: unknown, field: string): number {
  const normalized = finiteInteger(value, field);
  if (normalized < 0) throw new Error(`${field} must be non-negative`);
  return normalized;
}

function positiveInteger(value: unknown, field: string): number {
  const normalized = finiteInteger(value, field);
  if (normalized < 1) throw new Error(`${field} must be at least 1`);
  return normalized;
}

export function normalizePrecisionPolicy(
  input: unknown,
  expectedPolicyRevision?: Readonly<{ policyRef: string; policyRevision: string }>,
): PrecisionPolicy {
  const record = asRecord(input, "precision policy");
  exact(record, ["policyRef", "policyRevision", "precision", "scale", "roundingMode"], "precision policy");
  const policyRef = nonEmpty(record.policyRef, "precision policyRef");
  const policyRevision = nonEmpty(record.policyRevision, "precision policyRevision");
  const precision = positiveInteger(record.precision, "precision");
  const scale = nonNegativeInteger(record.scale, "scale");
  if (scale > precision) throw new Error("scale cannot exceed precision");
  if (expectedPolicyRevision) {
    if (policyRef !== nonEmpty(expectedPolicyRevision.policyRef, "expected precision policyRef") ||
        policyRevision !== nonEmpty(expectedPolicyRevision.policyRevision, "expected precision policyRevision")) {
      throw new Error("precision policy must preserve the explicitly requested historical policy revision");
    }
  }
  return Object.freeze({
    policyRef,
    policyRevision,
    precision,
    scale,
    roundingMode: oneOf(record.roundingMode, ROUNDING_MODES, "roundingMode"),
  });
}

function normalizeTemporalAnchor(input: unknown): TemporalAnchor {
  const record = asRecord(input, "temporal anchor");
  exact(record, ["kind", "anchorRef", "anchorRevision"], "temporal anchor");
  return Object.freeze({
    kind: oneOf(record.kind, TEMPORAL_ANCHOR_KINDS, "temporal anchor kind"),
    anchorRef: nonEmpty(record.anchorRef, "temporal anchorRef"),
    anchorRevision: nonEmpty(record.anchorRevision, "temporal anchorRevision"),
  });
}

type UtcInstantParts = Readonly<{
  normalized: string;
  wholeSecondKey: readonly number[];
  fraction: string;
}>;

function utcInstantParts(value: unknown, field: string): UtcInstantParts {
  const normalized = nonEmpty(value, field);
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?Z$/.exec(normalized);
  if (!match) throw new Error(`${field} must be an explicit UTC instant ending in Z`);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = month >= 1 && month <= 12 ? daysInMonth[month - 1] : undefined;
  if (maxDay === undefined || day < 1 || day > maxDay || hour > 23 || minute > 59 || second > 59) {
    throw new Error(`${field} must be a valid UTC calendar instant`);
  }

  return Object.freeze({
    normalized,
    wholeSecondKey: Object.freeze([year, month, day, hour, minute, second]),
    fraction: match[7] ?? "",
  });
}

function utcInstant(value: unknown, field: string): string {
  return utcInstantParts(value, field).normalized;
}

function compareUtcInstants(left: string, right: string): number {
  const leftParts = utcInstantParts(left, "left UTC instant");
  const rightParts = utcInstantParts(right, "right UTC instant");
  for (let index = 0; index < leftParts.wholeSecondKey.length; index += 1) {
    const delta = leftParts.wholeSecondKey[index] - rightParts.wholeSecondKey[index];
    if (delta !== 0) return delta < 0 ? -1 : 1;
  }

  const width = Math.max(leftParts.fraction.length, rightParts.fraction.length);
  const leftFraction = leftParts.fraction.padEnd(width, "0");
  const rightFraction = rightParts.fraction.padEnd(width, "0");
  if (leftFraction === rightFraction) return 0;
  return leftFraction < rightFraction ? -1 : 1;
}

export function normalizeTemporalContext(input: unknown): TemporalContext {
  const record = asRecord(input, "temporal context");
  const state = oneOf(record.state, ["UNKNOWN", "INSTANT", "WINDOW"] as const, "temporal context state");
  if (state === "UNKNOWN") {
    exact(record, ["state", "reason"], "unknown temporal context");
    return Object.freeze({ state, reason: nonEmpty(record.reason, "unknown temporal reason") });
  }
  if (state === "INSTANT") {
    exact(record, ["state", "at", "anchor"], "instant temporal context");
    return Object.freeze({ state, at: utcInstant(record.at, "temporal instant"), anchor: normalizeTemporalAnchor(record.anchor) });
  }

  exact(record, ["state", "start", "end", "startBoundary", "endBoundary", "anchor"], "window temporal context");
  const start = utcInstant(record.start, "temporal window start");
  const end = utcInstant(record.end, "temporal window end");
  if (compareUtcInstants(start, end) >= 0) throw new Error("temporal window start must be strictly before end");
  return Object.freeze({
    state,
    start,
    end,
    startBoundary: oneOf(record.startBoundary, TEMPORAL_BOUNDARIES, "temporal window startBoundary"),
    endBoundary: oneOf(record.endBoundary, TEMPORAL_BOUNDARIES, "temporal window endBoundary"),
    anchor: normalizeTemporalAnchor(record.anchor),
  });
}

function unitKey(unit: UnitReference): string {
  const normalized = normalizeUnitReference(unit);
  if (normalized.state === "UNKNOWN") return `UNKNOWN\u0000${normalized.reason}`;
  return `KNOWN\u0000${normalized.unitRef}\u0000${normalized.unitRevision}\u0000${dimensionKey(normalized.dimension)}`;
}

export function normalizeAnalyticalPrecisionTemporalBinding(
  input: unknown,
  expectedUnitBinding: AnalyticalUnitBinding,
  expectedPolicyRevision: Readonly<{ policyRef: string; policyRevision: string }>,
): AnalyticalPrecisionTemporalBinding {
  const record = asRecord(input, "analytical precision temporal binding");
  exact(
    record,
    ["contractVersion", "valueRef", "producingAnalyticalRevision", "sourceRevision", "unit", "precisionPolicy", "temporalContext"],
    "analytical precision temporal binding",
  );
  const producingAnalyticalRevision = normalizeDefinitionRevisionRef(record.producingAnalyticalRevision);
  const sourceRevision = normalizeDefinitionRevisionRef(record.sourceRevision);
  const unit = normalizeUnitReference(record.unit);

  if (nonEmpty(record.valueRef, "valueRef") !== expectedUnitBinding.valueRef) {
    throw new Error("precision/time binding must preserve the analytical unit valueRef");
  }
  if (revisionKey(producingAnalyticalRevision) !== revisionKey(expectedUnitBinding.producingAnalyticalRevision)) {
    throw new Error("precision/time binding must preserve the historical producing analytical revision");
  }
  if (revisionKey(sourceRevision) !== revisionKey(expectedUnitBinding.sourceRevision)) {
    throw new Error("precision/time binding must preserve the analytical unit source revision");
  }
  if (unitKey(unit) !== unitKey(expectedUnitBinding.unit)) {
    throw new Error("precision/time binding must preserve unit and dimension lineage");
  }

  return Object.freeze({
    contractVersion: version(record.contractVersion),
    valueRef: expectedUnitBinding.valueRef,
    producingAnalyticalRevision,
    sourceRevision,
    unit,
    precisionPolicy: normalizePrecisionPolicy(record.precisionPolicy, expectedPolicyRevision),
    temporalContext: normalizeTemporalContext(record.temporalContext),
  });
}
