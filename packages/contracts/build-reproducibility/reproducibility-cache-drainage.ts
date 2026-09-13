export const REPRODUCIBILITY_CACHE_DRAINAGE_CONTRACT_VERSION = "1.0.0" as const;

export type ReproducibilityEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type ReproducibilityCurrentness = "CURRENT" | "STALE" | "UNKNOWN";
export type BuildOutcome = "SUCCEEDED" | "FAILED" | "UNKNOWN";
export type ReproducibilityVerdict = "PASS" | "FAIL" | "INCONCLUSIVE";
export type ResidualCohortKind = "RUNNER" | "CACHE";

export type QualifiedEvidence = Readonly<{
  evidenceRef: string | null;
  completeness: ReproducibilityEvidenceCompleteness;
  currentness: ReproducibilityCurrentness;
}>;

export type ReproducibilityObservation = Readonly<{
  observationRef: string;
  buildRevisionRef: string;
  environmentRef: string;
  populationRef: string;
  executionContextRef: string;
  materialBoundaryRef: string;
  outputDigest: string | null;
  outcome: BuildOutcome;
  evidence: QualifiedEvidence;
}>;

export type CacheLineage = Readonly<{
  cacheEntryRef: string;
  cacheEpochRef: string;
  producingRevisionRef: string;
  producingExecutionContextRef: string;
  producingMaterialBoundaryRef: string;
  contentDigest: string | null;
  provenance: QualifiedEvidence;
}>;

export type ResidualBuildCohort = Readonly<{
  cohortRef: string;
  kind: ResidualCohortKind;
  epochRef: string;
  populationRef: string | null;
  residualCount: number | null;
  evidence: QualifiedEvidence;
}>;

export type ReproducibilityClaim = Readonly<{
  claimRef: string;
  left: ReproducibilityObservation;
  right: ReproducibilityObservation;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;

export function evidenceIsAuthoritative(evidence: QualifiedEvidence): boolean {
  return nonEmpty(evidence.evidenceRef)
    && evidence.completeness === "KNOWN"
    && evidence.currentness === "CURRENT";
}

function observationIsQualified(observation: ReproducibilityObservation): boolean {
  return nonEmpty(observation.observationRef)
    && nonEmpty(observation.buildRevisionRef)
    && nonEmpty(observation.environmentRef)
    && nonEmpty(observation.populationRef)
    && nonEmpty(observation.executionContextRef)
    && nonEmpty(observation.materialBoundaryRef)
    && observation.outcome === "SUCCEEDED"
    && nonEmpty(observation.outputDigest)
    && evidenceIsAuthoritative(observation.evidence);
}

export function evaluateReproducibilityClaim(claim: ReproducibilityClaim): ReproducibilityVerdict {
  const { left, right } = claim;
  if (!nonEmpty(claim.claimRef) || !observationIsQualified(left) || !observationIsQualified(right)) return "INCONCLUSIVE";
  if (left.buildRevisionRef !== right.buildRevisionRef) return "INCONCLUSIVE";
  if (left.environmentRef !== right.environmentRef) return "INCONCLUSIVE";
  if (left.populationRef !== right.populationRef) return "INCONCLUSIVE";
  if (left.materialBoundaryRef !== right.materialBoundaryRef) return "INCONCLUSIVE";
  return left.outputDigest === right.outputDigest ? "PASS" : "FAIL";
}

export function cacheEntryIsCurrentAndProvenanced(lineage: CacheLineage): boolean {
  return nonEmpty(lineage.cacheEntryRef)
    && nonEmpty(lineage.cacheEpochRef)
    && nonEmpty(lineage.producingRevisionRef)
    && nonEmpty(lineage.producingExecutionContextRef)
    && nonEmpty(lineage.producingMaterialBoundaryRef)
    && nonEmpty(lineage.contentDigest)
    && evidenceIsAuthoritative(lineage.provenance);
}

export function cacheHitEstablishesTrustedCurrentMaterial(lineage: CacheLineage): false {
  void lineage;
  return false;
}

export function successfulBuildsEstablishReproducibility(
  left: ReproducibilityObservation,
  right: ReproducibilityObservation,
): false {
  void left;
  void right;
  return false;
}

export function residualCohortIsDrained(cohort: ResidualBuildCohort): boolean {
  return nonEmpty(cohort.cohortRef)
    && nonEmpty(cohort.epochRef)
    && nonEmpty(cohort.populationRef)
    && cohort.residualCount === 0
    && evidenceIsAuthoritative(cohort.evidence);
}

export function allResidualBuildCohortsAreDrained(cohorts: readonly ResidualBuildCohort[]): boolean {
  return cohorts.length > 0 && cohorts.every(residualCohortIsDrained);
}
