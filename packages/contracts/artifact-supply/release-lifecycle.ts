import type { CanonicalArtifact } from "./artifact-identity";

export const RELEASE_LIFECYCLE_CONTRACT_VERSION = "1.0.0" as const;

export type ReleaseEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type ReleaseCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type ReleaseAdoptionVerdict = "ADOPT" | "REJECT" | "RECONCILE_BEFORE_RETRY";
export type ResidualDrainageVerdict = "DRAINED" | "NOT_DRAINED" | "RECONCILE_BEFORE_RETRY";

export type ReleaseCurrentness = Readonly<{
  state: ReleaseCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type CanonicalRelease = Readonly<{
  releaseRef: string;
  releaseRevisionRef: string;
  artifactRef: string;
  artifactRevisionRef: string;
  artifactDigest: string;
  adoptionEvidenceRef: string | null;
  sourceOfTruthRef: string;
  providerRef: string | null;
  providerLocalId: string | null;
  channelRef: string | null;
  completeness: ReleaseEvidenceCompleteness;
  currentness: ReleaseCurrentness;
}>;

export type ReleaseCohort = Readonly<{
  cohortRef: string;
  releaseRef: string;
  releaseRevisionRef: string;
  populationRef: string | null;
  knownPopulation: number | null;
  residualPopulation: number | null;
  completeness: ReleaseEvidenceCompleteness;
  currentness: ReleaseCurrentness;
}>;

export type ReleaseCoexistence = Readonly<{
  sourceOfTruthReleaseRef: string;
  activeReleaseRefs: readonly string[];
  rollbackReleaseRef: string | null;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentAt(currentness: ReleaseCurrentness, evaluatedAt: string): boolean {
  if (currentness.state !== "CURRENT" || !validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
}

export function releasePreservesArtifactIdentity(release: CanonicalRelease, artifact: CanonicalArtifact): boolean {
  return release.artifactRef === artifact.artifactRef
    && release.artifactRevisionRef === artifact.artifactRevisionRef
    && release.artifactDigest === artifact.contentDigest;
}

export function evaluateReleaseAdoption(release: CanonicalRelease, artifact: CanonicalArtifact, evaluatedAt: string): ReleaseAdoptionVerdict {
  if (release.completeness === "UNKNOWN" || release.currentness.state === "UNKNOWN") return "RECONCILE_BEFORE_RETRY";
  if (release.completeness !== "KNOWN" || !currentAt(release.currentness, evaluatedAt)) return "REJECT";
  if (!nonEmpty(release.releaseRef) || !nonEmpty(release.releaseRevisionRef) || !nonEmpty(release.adoptionEvidenceRef) || !nonEmpty(release.sourceOfTruthRef)) return "REJECT";
  return releasePreservesArtifactIdentity(release, artifact) ? "ADOPT" : "REJECT";
}

export function releaseCoexistenceIsExplicit(state: ReleaseCoexistence): boolean {
  return nonEmpty(state.sourceOfTruthReleaseRef)
    && state.activeReleaseRefs.length > 0
    && state.activeReleaseRefs.every((releaseRef) => nonEmpty(releaseRef));
}

export function evaluateResidualReleaseDrainage(cohort: ReleaseCohort, evaluatedAt: string): ResidualDrainageVerdict {
  if (cohort.completeness === "UNKNOWN" || cohort.currentness.state === "UNKNOWN" || cohort.knownPopulation === null || cohort.residualPopulation === null || !nonEmpty(cohort.populationRef)) {
    return "RECONCILE_BEFORE_RETRY";
  }
  if (cohort.completeness !== "KNOWN" || !currentAt(cohort.currentness, evaluatedAt)) return "NOT_DRAINED";
  if (cohort.knownPopulation < 0 || cohort.residualPopulation < 0 || cohort.residualPopulation > cohort.knownPopulation) return "NOT_DRAINED";
  return cohort.residualPopulation === 0 ? "DRAINED" : "NOT_DRAINED";
}

export function providerAcknowledgementEstablishesEffectiveReleaseAdoption(release: CanonicalRelease): false {
  void release;
  return false;
}

export function channelIdentityEstablishesReleaseAuthority(release: CanonicalRelease): false {
  void release;
  return false;
}

export function releasePublicationEstablishesDeployedRuntime(release: CanonicalRelease): false {
  void release;
  return false;
}

export function canonicalArtifactIsEffectiveRuntime(artifact: CanonicalArtifact): false {
  void artifact;
  return false;
}
