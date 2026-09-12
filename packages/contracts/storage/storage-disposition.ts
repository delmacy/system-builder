import {
  assessFiniteFlow,
  type DrainageAssumptions,
  type FiniteFlowAssessment,
  type FiniteFlowPopulationIdentity,
} from "../finite-flow/finite-flow.js";
import type { CanonicalStorageIdentity } from "./storage-identity.js";

export const STORAGE_DISPOSITION_CONTRACT_VERSION = "1.0.0" as const;

export type DispositionKnowledge = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type StorageDrainageState = "DRAINED" | "DRAINABLE" | "RESIDUAL" | "UNKNOWN" | "INVALID";

export type DispositionTargetPopulation = Readonly<{
  populationRef: string;
  scopeRef: string;
  authorityRef: string;
  authorityRevisionRef: string;
  providerCopyRefs: readonly string[];
  transferLineageRefs: readonly string[];
}>;

export type ResidualCopyCohort = Readonly<{
  cohortRef: string;
  populationRef: string;
  scopeRef: string;
  providerCopyRefs: readonly string[];
  knowledge: DispositionKnowledge;
  telemetryComplete: boolean;
}>;

export type StorageDispositionEvidence = Readonly<{
  contractVersion: typeof STORAGE_DISPOSITION_CONTRACT_VERSION;
  dispositionRef: string;
  canonicalObjectRef: string;
  canonicalRevisionRef: string;
  target: DispositionTargetPopulation;
  acknowledgedCopyRefs: readonly string[];
  residualCohorts: readonly ResidualCopyCohort[];
  knowledge: DispositionKnowledge;
  sourceOfTruthEvidencePreserved: boolean;
  lifecycleEvidencePreserved: boolean;
}>;

export type StorageDispositionAssessment = Readonly<{
  valid: boolean;
  drainage: StorageDrainageState;
  residualCopyCount: number | null;
  finiteFlow: FiniteFlowAssessment;
  reasons: readonly string[];
}>;

type R = Record<string, unknown>;
const rec = (value: unknown, label: string): R => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as R;
};
const exact = (record: R, fields: readonly string[], label: string): void => {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
};
const str = (value: unknown, label: string): string => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};
const bool = (value: unknown, label: string): boolean => {
  if (typeof value !== "boolean") throw new Error(`${label} must be boolean`);
  return value;
};
const knowledge = (value: unknown, label: string): DispositionKnowledge => {
  if (!(["KNOWN", "PARTIAL", "UNKNOWN"] as const).includes(value as DispositionKnowledge)) throw new Error(`invalid ${label}`);
  return value as DispositionKnowledge;
};
const strings = (value: unknown, label: string): readonly string[] => {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  const normalized = value.map((entry, index) => str(entry, `${label}[${index}]`));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${label} must not contain duplicates`);
  return Object.freeze(normalized);
};

function normalizeTarget(value: unknown): DispositionTargetPopulation {
  const record = rec(value, "disposition target");
  exact(record, ["populationRef", "scopeRef", "authorityRef", "authorityRevisionRef", "providerCopyRefs", "transferLineageRefs"], "disposition target");
  return Object.freeze({
    populationRef: str(record.populationRef, "target populationRef"),
    scopeRef: str(record.scopeRef, "target scopeRef"),
    authorityRef: str(record.authorityRef, "target authorityRef"),
    authorityRevisionRef: str(record.authorityRevisionRef, "target authorityRevisionRef"),
    providerCopyRefs: strings(record.providerCopyRefs, "target providerCopyRefs"),
    transferLineageRefs: strings(record.transferLineageRefs, "target transferLineageRefs"),
  });
}

function normalizeResidualCohort(value: unknown): ResidualCopyCohort {
  const record = rec(value, "residual cohort");
  exact(record, ["cohortRef", "populationRef", "scopeRef", "providerCopyRefs", "knowledge", "telemetryComplete"], "residual cohort");
  return Object.freeze({
    cohortRef: str(record.cohortRef, "cohortRef"),
    populationRef: str(record.populationRef, "cohort populationRef"),
    scopeRef: str(record.scopeRef, "cohort scopeRef"),
    providerCopyRefs: strings(record.providerCopyRefs, "cohort providerCopyRefs"),
    knowledge: knowledge(record.knowledge, "cohort knowledge"),
    telemetryComplete: bool(record.telemetryComplete, "cohort telemetryComplete"),
  });
}

export function normalizeStorageDispositionEvidence(input: unknown): StorageDispositionEvidence {
  const record = rec(input, "storage disposition evidence");
  exact(record, ["contractVersion", "dispositionRef", "canonicalObjectRef", "canonicalRevisionRef", "target", "acknowledgedCopyRefs", "residualCohorts", "knowledge", "sourceOfTruthEvidencePreserved", "lifecycleEvidencePreserved"], "storage disposition evidence");
  if (record.contractVersion !== STORAGE_DISPOSITION_CONTRACT_VERSION) throw new Error("unsupported storage disposition contract version");
  if (!Array.isArray(record.residualCohorts)) throw new Error("residualCohorts must be an array");
  const target = normalizeTarget(record.target);
  const acknowledgedCopyRefs = strings(record.acknowledgedCopyRefs, "acknowledgedCopyRefs");
  const residualCohorts = record.residualCohorts.map(normalizeResidualCohort);
  const targetRefs = new Set(target.providerCopyRefs);
  for (const ref of acknowledgedCopyRefs) if (!targetRefs.has(ref)) throw new Error("acknowledged copy must belong to target population");
  const seenResidual = new Set<string>();
  for (const cohort of residualCohorts) {
    for (const ref of cohort.providerCopyRefs) {
      if (!targetRefs.has(ref)) throw new Error("residual copy must belong to target population");
      if (seenResidual.has(ref)) throw new Error("residual copy must not appear in multiple cohorts");
      seenResidual.add(ref);
    }
  }
  return Object.freeze({
    contractVersion: STORAGE_DISPOSITION_CONTRACT_VERSION,
    dispositionRef: str(record.dispositionRef, "dispositionRef"),
    canonicalObjectRef: str(record.canonicalObjectRef, "canonicalObjectRef"),
    canonicalRevisionRef: str(record.canonicalRevisionRef, "canonicalRevisionRef"),
    target,
    acknowledgedCopyRefs,
    residualCohorts: Object.freeze(residualCohorts),
    knowledge: knowledge(record.knowledge, "disposition knowledge"),
    sourceOfTruthEvidencePreserved: bool(record.sourceOfTruthEvidencePreserved, "sourceOfTruthEvidencePreserved"),
    lifecycleEvidencePreserved: bool(record.lifecycleEvidencePreserved, "lifecycleEvidencePreserved"),
  });
}

export function assessStorageDisposition(
  identity: CanonicalStorageIdentity,
  evidence: StorageDispositionEvidence,
  flowIdentity: FiniteFlowPopulationIdentity,
  assumptions: DrainageAssumptions,
): StorageDispositionAssessment {
  const reasons: string[] = [];
  if (evidence.canonicalObjectRef !== identity.canonicalObjectRef || evidence.canonicalRevisionRef !== identity.canonicalRevisionRef) reasons.push("CANONICAL_IDENTITY_MISMATCH");
  if (evidence.target.authorityRef !== identity.sourceOfTruth.authorityRef || evidence.target.authorityRevisionRef !== identity.sourceOfTruth.authorityRevisionRef) reasons.push("AUTHORITY_SCOPE_MISMATCH");
  if (evidence.target.populationRef !== flowIdentity.populationRef || evidence.target.scopeRef !== flowIdentity.scopeRef) reasons.push("FINITE_FLOW_POPULATION_OR_SCOPE_MISMATCH");

  const identityCopyRefs = new Set(identity.providerCopies.map((copy) => copy.copyRef));
  if (evidence.target.providerCopyRefs.some((ref) => !identityCopyRefs.has(ref))) reasons.push("TARGET_COPY_NOT_IN_CANONICAL_IDENTITY");
  if (!evidence.sourceOfTruthEvidencePreserved) reasons.push("SOURCE_OF_TRUTH_EVIDENCE_NOT_PRESERVED");
  if (!evidence.lifecycleEvidencePreserved) reasons.push("LIFECYCLE_EVIDENCE_NOT_PRESERVED");
  if (assumptions.replay.requestedItems > 0 && evidence.target.transferLineageRefs.length === 0) reasons.push("REPLAY_WITHOUT_TRANSFER_LINEAGE");

  const residualEvidenceKnown = evidence.knowledge === "KNOWN"
    && evidence.residualCohorts.length > 0
    && evidence.residualCohorts.every((cohort) =>
      cohort.knowledge === "KNOWN"
        && cohort.telemetryComplete
        && cohort.populationRef === evidence.target.populationRef
        && cohort.scopeRef === evidence.target.scopeRef);
  if (!residualEvidenceKnown) reasons.push("RESIDUAL_TELEMETRY_NOT_KNOWN");

  const residualCopyCount = residualEvidenceKnown
    ? evidence.residualCohorts.reduce((count, cohort) => count + cohort.providerCopyRefs.length, 0)
    : null;
  if (residualCopyCount !== null && assumptions.backlog.items !== residualCopyCount) reasons.push("BACKLOG_RESIDUAL_COUNT_MISMATCH");

  const finiteFlow = assessFiniteFlow(flowIdentity, assumptions);
  if (!finiteFlow.valid) reasons.push(...finiteFlow.reasons.map((reason) => `FINITE_FLOW_${reason}`));

  const structuralInvalid = reasons.some((reason) =>
    reason === "CANONICAL_IDENTITY_MISMATCH"
      || reason === "AUTHORITY_SCOPE_MISMATCH"
      || reason === "FINITE_FLOW_POPULATION_OR_SCOPE_MISMATCH"
      || reason === "TARGET_COPY_NOT_IN_CANONICAL_IDENTITY"
      || reason === "SOURCE_OF_TRUTH_EVIDENCE_NOT_PRESERVED"
      || reason === "LIFECYCLE_EVIDENCE_NOT_PRESERVED"
      || reason === "REPLAY_WITHOUT_TRANSFER_LINEAGE"
      || reason === "BACKLOG_RESIDUAL_COUNT_MISMATCH"
      || reason.startsWith("FINITE_FLOW_"));

  let drainage: StorageDrainageState;
  if (structuralInvalid) drainage = "INVALID";
  else if (!residualEvidenceKnown || residualCopyCount === null) drainage = "UNKNOWN";
  else if (residualCopyCount === 0 && finiteFlow.drainable) drainage = "DRAINED";
  else if (finiteFlow.drainable) drainage = "DRAINABLE";
  else drainage = "RESIDUAL";

  return Object.freeze({
    valid: reasons.length === 0,
    drainage,
    residualCopyCount,
    finiteFlow,
    reasons: Object.freeze([...new Set(reasons)]),
  });
}
