import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION } from "./index.js";
import { EKB_CURRENTNESS_STATES, type EKBCurrentnessState } from "./coverage.js";
import { EKB_CONTRADICTION_SEVERITIES, type EKBContradictionSeverity } from "./routing.js";

export const EKB_NEGATIVE_SPACE_KINDS = ["STAKEHOLDER", "SOURCE", "APPLICABLE_DIMENSION"] as const;
export const EKB_NEGATIVE_SPACE_STATES = ["UNKNOWN", "PARTIAL", "UNTOUCHED", "CONFLICTED", "BLOCKED", "NOT_APPLICABLE"] as const;

export type EKBNegativeSpaceKind = (typeof EKB_NEGATIVE_SPACE_KINDS)[number];
export type EKBNegativeSpaceState = (typeof EKB_NEGATIVE_SPACE_STATES)[number];

export type EKBNegativeSpaceCoverageRecord = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  negativeSpaceRef: string;
  sourceCapabilityRouteRef: string;
  kind: EKBNegativeSpaceKind;
  expectedRef: string;
  populationScope: string;
  localityScope: string;
  state: EKBNegativeSpaceState;
  currentnessState: EKBCurrentnessState;
  severity: EKBContradictionSeverity;
  evidenceRef: string | null;
  applicabilityRef: string | null;
  rationale: string | null;
  contradictionRefs: readonly string[];
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

function refs(value: unknown): readonly string[] {
  if (!Array.isArray(value)) throw new Error("contradictionRefs must be an array");
  const normalized = value.map((entry) => nonEmpty(entry, "contradictionRefs"));
  if (new Set(normalized).size !== normalized.length) throw new Error("contradictionRefs must not contain duplicates");
  return Object.freeze(normalized);
}

export function normalizeEKBNegativeSpaceCoverageRecord(input: unknown): EKBNegativeSpaceCoverageRecord {
  const record = asRecord(input, "EKB negative-space coverage record");
  exact(record, ["contractVersion", "negativeSpaceRef", "sourceCapabilityRouteRef", "kind", "expectedRef", "populationScope", "localityScope", "state", "currentnessState", "severity", "evidenceRef", "applicabilityRef", "rationale", "contradictionRefs"], "EKB negative-space coverage record");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  const state = oneOf(record.state, EKB_NEGATIVE_SPACE_STATES, "state");
  const currentnessState = oneOf(record.currentnessState, EKB_CURRENTNESS_STATES, "currentnessState");
  const severity = oneOf(record.severity, EKB_CONTRADICTION_SEVERITIES, "severity");
  const evidenceRef = nullableString(record.evidenceRef, "evidenceRef");
  const applicabilityRef = nullableString(record.applicabilityRef, "applicabilityRef");
  const rationale = nullableString(record.rationale, "rationale");
  const contradictionRefs = refs(record.contradictionRefs);
  if (state === "NOT_APPLICABLE" && (applicabilityRef === null || rationale === null || evidenceRef === null || currentnessState !== "CURRENT")) throw new Error("NOT_APPLICABLE requires CURRENT qualified applicability evidence and rationale");
  if (state === "CONFLICTED" && contradictionRefs.length === 0) throw new Error("CONFLICTED negative-space coverage requires explicit contradiction references");
  if (state !== "CONFLICTED" && contradictionRefs.length > 0) throw new Error("contradiction references require CONFLICTED state");
  if ((currentnessState === "STALE" || currentnessState === "INSUFFICIENT") && state === "NOT_APPLICABLE") throw new Error("stale or insufficient evidence cannot establish NOT_APPLICABLE");
  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    negativeSpaceRef: nonEmpty(record.negativeSpaceRef, "negativeSpaceRef"),
    sourceCapabilityRouteRef: nonEmpty(record.sourceCapabilityRouteRef, "sourceCapabilityRouteRef"),
    kind: oneOf(record.kind, EKB_NEGATIVE_SPACE_KINDS, "kind"),
    expectedRef: nonEmpty(record.expectedRef, "expectedRef"),
    populationScope: nonEmpty(record.populationScope, "populationScope"),
    localityScope: nonEmpty(record.localityScope, "localityScope"),
    state,
    currentnessState,
    severity,
    evidenceRef,
    applicabilityRef,
    rationale,
    contradictionRefs,
  });
}

export function collectEKBNegativeSpaceBlockers(records: readonly EKBNegativeSpaceCoverageRecord[]): readonly string[] {
  const blockers = records
    .filter((record) => (record.severity === "HIGH" || record.severity === "CRITICAL") && record.state !== "NOT_APPLICABLE")
    .map((record) => record.negativeSpaceRef);
  return Object.freeze([...new Set(blockers)].sort());
}
