import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION, EKB_INFORMATION_KINDS, type InformationKind } from "./index.js";

export const EKB_DERIVATION_KINDS = ["REQUIREMENT", "CONSTRAINT", "STORY", "USE_CASE", "SCENARIO", "ACCEPTANCE", "PROOF"] as const;
export const EKB_TRACE_CURRENTNESS = ["CURRENT", "STALE", "UNKNOWN", "UNRESOLVED"] as const;
export const EKB_TRACE_STATES = ["ACTIVE", "UNRESOLVED", "SUPERSEDED"] as const;
export const EKB_TRACE_AUTHORITY_MODE = "REFERENCE_ONLY" as const;

export type EKBDerivationKind = (typeof EKB_DERIVATION_KINDS)[number];
export type EKBTraceCurrentness = (typeof EKB_TRACE_CURRENTNESS)[number];
export type EKBTraceState = (typeof EKB_TRACE_STATES)[number];

export type EKBDerivedTraceabilityRecord = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  traceRef: string;
  sourceOccurrenceRef: string;
  sourceArtifactRef: string;
  sourceRevisionRef: string;
  sourceInformationKind: InformationKind;
  sourceCurrentness: EKBTraceCurrentness;
  targetArtifactRef: string;
  targetRevisionRef: string;
  targetSemanticOwnerRef: string;
  derivationKind: EKBDerivationKind;
  rationale: string;
  evidenceRefs: readonly string[];
  contradictionRefs: readonly string[];
  negationRef: string | null;
  traceState: EKBTraceState;
  authorityMode: typeof EKB_TRACE_AUTHORITY_MODE;
  supersedesTraceRef: string | null;
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

function nullableString(value: unknown, field: string): string | null {
  return value === null ? null : nonEmpty(value, field);
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of ${allowed.join(", ")}`);
  return value as T[number];
}

function refs(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((entry) => nonEmpty(entry, field));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${field} must not contain duplicates`);
  return Object.freeze(normalized);
}

export function normalizeEKBDerivedTraceabilityRecord(input: unknown): EKBDerivedTraceabilityRecord {
  const record = asRecord(input, "EKB derived traceability record");
  exact(record, ["contractVersion", "traceRef", "sourceOccurrenceRef", "sourceArtifactRef", "sourceRevisionRef", "sourceInformationKind", "sourceCurrentness", "targetArtifactRef", "targetRevisionRef", "targetSemanticOwnerRef", "derivationKind", "rationale", "evidenceRefs", "contradictionRefs", "negationRef", "traceState", "authorityMode", "supersedesTraceRef"], "EKB derived traceability record");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  if (record.authorityMode !== EKB_TRACE_AUTHORITY_MODE) throw new Error("derived traceability is reference-only and cannot become semantic authority");

  const sourceInformationKind = oneOf(record.sourceInformationKind, EKB_INFORMATION_KINDS, "sourceInformationKind");
  const sourceCurrentness = oneOf(record.sourceCurrentness, EKB_TRACE_CURRENTNESS, "sourceCurrentness");
  const traceState = oneOf(record.traceState, EKB_TRACE_STATES, "traceState");
  const evidenceRefs = refs(record.evidenceRefs, "evidenceRefs");
  const contradictionRefs = refs(record.contradictionRefs, "contradictionRefs");
  const supersedesTraceRef = nullableString(record.supersedesTraceRef, "supersedesTraceRef");

  if ((sourceCurrentness === "STALE" || sourceCurrentness === "UNKNOWN" || sourceCurrentness === "UNRESOLVED") && traceState !== "UNRESOLVED") {
    throw new Error("stale, unknown or unresolved source must yield UNRESOLVED traceability");
  }
  if (traceState === "SUPERSEDED" && supersedesTraceRef === null) throw new Error("SUPERSEDED traceability requires supersedesTraceRef");
  if (traceState !== "SUPERSEDED" && supersedesTraceRef !== null) throw new Error("supersedesTraceRef is only valid for SUPERSEDED traceability");
  if ((sourceInformationKind === "Claim" || sourceInformationKind === "Assumption" || sourceInformationKind === "InferredCandidate") && record.derivationKind === "REQUIREMENT" && traceState === "ACTIVE") {
    // The edge may point at an external requirement identity, but it never changes the source epistemic kind.
  }

  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    traceRef: nonEmpty(record.traceRef, "traceRef"),
    sourceOccurrenceRef: nonEmpty(record.sourceOccurrenceRef, "sourceOccurrenceRef"),
    sourceArtifactRef: nonEmpty(record.sourceArtifactRef, "sourceArtifactRef"),
    sourceRevisionRef: nonEmpty(record.sourceRevisionRef, "sourceRevisionRef"),
    sourceInformationKind,
    sourceCurrentness,
    targetArtifactRef: nonEmpty(record.targetArtifactRef, "targetArtifactRef"),
    targetRevisionRef: nonEmpty(record.targetRevisionRef, "targetRevisionRef"),
    targetSemanticOwnerRef: nonEmpty(record.targetSemanticOwnerRef, "targetSemanticOwnerRef"),
    derivationKind: oneOf(record.derivationKind, EKB_DERIVATION_KINDS, "derivationKind"),
    rationale: nonEmpty(record.rationale, "rationale"),
    evidenceRefs,
    contradictionRefs,
    negationRef: nullableString(record.negationRef, "negationRef"),
    traceState,
    authorityMode: EKB_TRACE_AUTHORITY_MODE,
    supersedesTraceRef,
  });
}

export function validateEKBDerivedTraceabilitySet(records: readonly EKBDerivedTraceabilityRecord[]): readonly EKBDerivedTraceabilityRecord[] {
  const traceRefs = new Set<string>();
  const occurrenceTargets = new Set<string>();
  for (const record of records) {
    if (traceRefs.has(record.traceRef)) throw new Error(`duplicate traceRef ${record.traceRef}`);
    traceRefs.add(record.traceRef);
    const occurrenceTargetKey = `${record.sourceOccurrenceRef}\u0000${record.targetArtifactRef}\u0000${record.targetRevisionRef}`;
    if (occurrenceTargets.has(occurrenceTargetKey)) throw new Error("source occurrence cannot silently fan out duplicate canonical traceability");
    occurrenceTargets.add(occurrenceTargetKey);
  }
  return Object.freeze([...records]);
}
