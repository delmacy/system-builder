export const ARTIFACT_IDENTITY_CONTRACT_VERSION = "1.0.0" as const;

export type ArtifactEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type ArtifactCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type ArtifactAdoptionVerdict = "ADOPT" | "REJECT" | "RECONCILE_BEFORE_RETRY";

export type ArtifactCurrentness = Readonly<{
  state: ArtifactCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type QualifiedBuildOutput = Readonly<{
  buildOutputRef: string;
  producingRevisionRef: string;
  materialBoundaryRef: string;
  provenanceRef: string | null;
  contentDigest: string;
  completeness: ArtifactEvidenceCompleteness;
  currentness: ArtifactCurrentness;
}>;

export type CanonicalArtifact = Readonly<{
  artifactRef: string;
  artifactRevisionRef: string;
  adoptedBuildOutputRef: string;
  producingRevisionRef: string;
  materialBoundaryRef: string;
  provenanceRef: string | null;
  contentDigest: string;
  providerRef: string | null;
  providerLocalId: string | null;
  mutableTag: string | null;
  completeness: ArtifactEvidenceCompleteness;
  currentness: ArtifactCurrentness;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentAt(currentness: ArtifactCurrentness, evaluatedAt: string): boolean {
  if (currentness.state !== "CURRENT" || !validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
}

export function buildOutputIsQualified(output: QualifiedBuildOutput, evaluatedAt: string): boolean {
  return nonEmpty(output.buildOutputRef)
    && nonEmpty(output.producingRevisionRef)
    && nonEmpty(output.materialBoundaryRef)
    && nonEmpty(output.provenanceRef)
    && nonEmpty(output.contentDigest)
    && output.completeness === "KNOWN"
    && currentAt(output.currentness, evaluatedAt);
}

export function artifactPreservesBuildOutputLineage(artifact: CanonicalArtifact, output: QualifiedBuildOutput): boolean {
  return artifact.adoptedBuildOutputRef === output.buildOutputRef
    && artifact.producingRevisionRef === output.producingRevisionRef
    && artifact.materialBoundaryRef === output.materialBoundaryRef
    && artifact.provenanceRef === output.provenanceRef
    && artifact.contentDigest === output.contentDigest;
}

export function evaluateArtifactAdoption(artifact: CanonicalArtifact, output: QualifiedBuildOutput, evaluatedAt: string): ArtifactAdoptionVerdict {
  if (artifact.completeness === "UNKNOWN" || artifact.currentness.state === "UNKNOWN") return "RECONCILE_BEFORE_RETRY";
  if (!buildOutputIsQualified(output, evaluatedAt)) return "REJECT";
  if (!nonEmpty(artifact.artifactRef) || !nonEmpty(artifact.artifactRevisionRef) || !nonEmpty(artifact.provenanceRef)) return "REJECT";
  if (artifact.completeness !== "KNOWN" || !currentAt(artifact.currentness, evaluatedAt)) return "REJECT";
  return artifactPreservesBuildOutputLineage(artifact, output) ? "ADOPT" : "REJECT";
}

export function providerIdentityEstablishesCanonicalArtifactIdentity(_artifact: CanonicalArtifact): false { return false; }
export function mutableTagEstablishesCanonicalArtifactIdentity(_artifact: CanonicalArtifact): false { return false; }
export function buildOutputIsCanonicalArtifact(_output: QualifiedBuildOutput, _artifact: CanonicalArtifact): false { return false; }
export function canonicalArtifactIsRelease(_artifact: CanonicalArtifact): false { return false; }
