import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION } from "./index.js";
import type { EKBContradictionSeverity, EKBRoutingOutcome } from "./routing.js";

export const EKB_COVERAGE_STATES = [
  "UNTOUCHED",
  "DISCOVERING",
  "PARTIAL",
  "RESOLVED",
  "CONFLICTED",
  "BLOCKED",
  "NOT_APPLICABLE",
  "DEFERRED",
] as const;

export const EKB_SUFFICIENCY_STAGES = [
  "SUFFICIENT_FOR_ABSTRACTION",
  "SUFFICIENT_FOR_CANDIDATE_ARCHITECTURE",
  "SUFFICIENT_FOR_IMPLEMENTATION",
  "SUFFICIENT_FOR_PUBLISH_OPERATION",
] as const;

export const EKB_CURRENTNESS_STATES = ["CURRENT", "STALE", "UNKNOWN", "INSUFFICIENT"] as const;
export const EKB_SUFFICIENCY_RESULTS = ["PASS", "FAIL"] as const;

export type EKBCoverageState = (typeof EKB_COVERAGE_STATES)[number];
export type EKBSufficiencyStage = (typeof EKB_SUFFICIENCY_STAGES)[number];
export type EKBCurrentnessState = (typeof EKB_CURRENTNESS_STATES)[number];
export type EKBSufficiencyResult = (typeof EKB_SUFFICIENCY_RESULTS)[number];

export type EKBCoverageRecord = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  coverageRef: string;
  dimensionRef: string;
  objectOrCapabilityRef: string;
  revisionRef: string;
  populationScope: string;
  localityScope: string;
  state: EKBCoverageState;
  requiredStages: readonly EKBSufficiencyStage[];
  qualificationRef: string | null;
  currentnessState: EKBCurrentnessState;
  applicabilityRef: string | null;
  rationale: string | null;
  historicalResolvedEvidenceRef: string | null;
}>;

export type EKBMaterialObligation = Readonly<{
  obligationRef: string;
  contradictionRef: string;
  severity: EKBContradictionSeverity;
  routingOutcome: EKBRoutingOutcome;
  coverageState: EKBCoverageState;
  currentnessState: EKBCurrentnessState;
  applicable: boolean;
}>;

export type EKBSufficiencyAssessment = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  stage: EKBSufficiencyStage;
  result: EKBSufficiencyResult;
  blockerRefs: readonly string[];
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

function oneOf<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== "string" || !values.includes(value)) throw new Error(`${field} must be one of ${values.join(", ")}`);
  return value as T[number];
}

function stages(value: unknown): readonly EKBSufficiencyStage[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error("requiredStages must contain at least one stage");
  const normalized = value.map((entry) => oneOf(entry, EKB_SUFFICIENCY_STAGES, "requiredStages"));
  if (new Set(normalized).size !== normalized.length) throw new Error("requiredStages must not contain duplicates");
  return Object.freeze(normalized);
}

export function normalizeEKBCoverageRecord(input: unknown): EKBCoverageRecord {
  const record = asRecord(input, "EKB coverage record");
  exact(record, ["contractVersion", "coverageRef", "dimensionRef", "objectOrCapabilityRef", "revisionRef", "populationScope", "localityScope", "state", "requiredStages", "qualificationRef", "currentnessState", "applicabilityRef", "rationale", "historicalResolvedEvidenceRef"], "EKB coverage record");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  const state = oneOf(record.state, EKB_COVERAGE_STATES, "state");
  const currentnessState = oneOf(record.currentnessState, EKB_CURRENTNESS_STATES, "currentnessState");
  const qualificationRef = nullableString(record.qualificationRef, "qualificationRef");
  const applicabilityRef = nullableString(record.applicabilityRef, "applicabilityRef");
  const rationale = nullableString(record.rationale, "rationale");
  const historicalResolvedEvidenceRef = nullableString(record.historicalResolvedEvidenceRef, "historicalResolvedEvidenceRef");
  if (state === "NOT_APPLICABLE" && (applicabilityRef === null || rationale === null)) throw new Error("NOT_APPLICABLE requires applicability context and rationale");
  if (state === "RESOLVED" && (qualificationRef === null || currentnessState !== "CURRENT")) throw new Error("RESOLVED coverage requires CURRENT qualified evidence");
  if (currentnessState !== "CURRENT" && state === "RESOLVED") throw new Error("stale or unqualified evidence must reopen current coverage");
  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    coverageRef: nonEmpty(record.coverageRef, "coverageRef"),
    dimensionRef: nonEmpty(record.dimensionRef, "dimensionRef"),
    objectOrCapabilityRef: nonEmpty(record.objectOrCapabilityRef, "objectOrCapabilityRef"),
    revisionRef: nonEmpty(record.revisionRef, "revisionRef"),
    populationScope: nonEmpty(record.populationScope, "populationScope"),
    localityScope: nonEmpty(record.localityScope, "localityScope"),
    state,
    requiredStages: stages(record.requiredStages),
    qualificationRef,
    currentnessState,
    applicabilityRef,
    rationale,
    historicalResolvedEvidenceRef,
  });
}

export function assessEKBSufficiency(input: Readonly<{
  stage: EKBSufficiencyStage;
  coverage: readonly EKBCoverageRecord[];
  obligations: readonly EKBMaterialObligation[];
}>): EKBSufficiencyAssessment {
  const stage = oneOf(input.stage, EKB_SUFFICIENCY_STAGES, "stage");
  const applicableCoverage = input.coverage.filter((entry) => entry.requiredStages.includes(stage));
  const blockers = new Set<string>();
  if (applicableCoverage.length === 0) blockers.add(`stage:${stage}:NO_STAGE_COVERAGE`);
  for (const entry of applicableCoverage) {
    if (entry.state !== "RESOLVED" && entry.state !== "NOT_APPLICABLE") blockers.add(entry.coverageRef);
    if (entry.state !== "NOT_APPLICABLE" && entry.currentnessState !== "CURRENT") blockers.add(entry.coverageRef);
  }
  for (const obligation of input.obligations) {
    if (!obligation.applicable || (obligation.severity !== "HIGH" && obligation.severity !== "CRITICAL")) continue;
    if (["UNRESOLVED", "BLOCKED", "INCONCLUSIVE"].includes(obligation.routingOutcome) || ["CONFLICTED", "BLOCKED"].includes(obligation.coverageState) || obligation.currentnessState !== "CURRENT") blockers.add(obligation.obligationRef);
  }
  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    stage,
    result: blockers.size === 0 ? "PASS" : "FAIL",
    blockerRefs: Object.freeze([...blockers].sort()),
  });
}
