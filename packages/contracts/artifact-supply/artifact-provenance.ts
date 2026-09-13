import {
  type ArtifactCurrentness,
  type ArtifactEvidenceCompleteness,
  type CanonicalArtifact,
} from "./artifact-identity";

export const ARTIFACT_PROVENANCE_CONTRACT_VERSION = "1.0.0" as const;

export type ArtifactEvidenceKind = "SBOM" | "PROVENANCE" | "ATTESTATION" | "SIGNATURE";
export type ArtifactEvidenceQualification = "QUALIFIED" | "REJECTED" | "RECONCILE_BEFORE_RETRY";

export type ArtifactEvidenceLocality = Readonly<{
  localityRef: string | null;
  populationRef: string | null;
}>;

export type ArtifactSupplyEvidence = Readonly<{
  evidenceRef: string;
  kind: ArtifactEvidenceKind;
  artifactRef: string;
  artifactRevisionRef: string;
  contentDigest: string;
  sourceRef: string;
  producerRef: string | null;
  providerRef: string | null;
  providerAcknowledged: boolean;
  observedAt: string;
  completeness: ArtifactEvidenceCompleteness;
  currentness: ArtifactCurrentness;
  locality: ArtifactEvidenceLocality;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentAt(currentness: ArtifactCurrentness, evaluatedAt: string): boolean {
  if (currentness.state !== "CURRENT" || !validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
}

export function evidenceMatchesCanonicalArtifact(evidence: ArtifactSupplyEvidence, artifact: CanonicalArtifact): boolean {
  return evidence.artifactRef === artifact.artifactRef
    && evidence.artifactRevisionRef === artifact.artifactRevisionRef
    && evidence.contentDigest === artifact.contentDigest;
}

export function evaluateArtifactEvidence(
  evidence: ArtifactSupplyEvidence,
  artifact: CanonicalArtifact,
  evaluatedAt: string,
): ArtifactEvidenceQualification {
  if (evidence.completeness === "UNKNOWN" || evidence.currentness.state === "UNKNOWN") return "RECONCILE_BEFORE_RETRY";
  if (evidence.completeness !== "KNOWN") return "REJECTED";
  if (!nonEmpty(evidence.evidenceRef) || !nonEmpty(evidence.sourceRef) || !validTime(evidence.observedAt)) return "REJECTED";
  if (!currentAt(evidence.currentness, evaluatedAt)) return "REJECTED";
  if (!evidenceMatchesCanonicalArtifact(evidence, artifact)) return "REJECTED";
  if (evidence.locality.localityRef !== null && !nonEmpty(evidence.locality.localityRef)) return "REJECTED";
  if (evidence.locality.populationRef !== null && !nonEmpty(evidence.locality.populationRef)) return "REJECTED";
  return "QUALIFIED";
}

export function signaturePresenceEstablishesTrustOrAdmission(evidence: ArtifactSupplyEvidence): false {
  void evidence;
  return false;
}

export function attestationPresenceEstablishesTrustOrAdmission(evidence: ArtifactSupplyEvidence): false {
  void evidence;
  return false;
}

export function providerAcknowledgementEstablishesEvidenceAuthority(evidence: ArtifactSupplyEvidence): false {
  void evidence;
  return false;
}

export function producerIdentityEstablishesEvidenceCurrentness(evidence: ArtifactSupplyEvidence): false {
  void evidence;
  return false;
}
