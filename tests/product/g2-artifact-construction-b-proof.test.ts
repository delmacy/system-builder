import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOutputIsCanonicalArtifact,
  canonicalArtifactIsRelease,
  evaluateArtifactAdoption,
  type CanonicalArtifact,
  type QualifiedBuildOutput,
} from "../../packages/contracts/artifact-supply/artifact-identity";
import {
  attestationPresenceEstablishesTrustOrAdmission,
  evaluateArtifactEvidence,
  providerAcknowledgementEstablishesEvidenceAuthority,
  signaturePresenceEstablishesTrustOrAdmission,
  type ArtifactSupplyEvidence,
} from "../../packages/contracts/artifact-supply/artifact-provenance";
import {
  canonicalArtifactIsEffectiveRuntime,
  evaluateReleaseAdoption,
  evaluateResidualReleaseDrainage,
  providerAcknowledgementEstablishesEffectiveReleaseAdoption,
  releasePublicationEstablishesDeployedRuntime,
  type CanonicalRelease,
  type ReleaseCohort,
} from "../../packages/contracts/artifact-supply/release-lifecycle";

const at = "2026-09-13T13:00:00Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-13T12:00:00Z", validUntil: "2026-09-13T14:00:00Z" };
const output: QualifiedBuildOutput = { buildOutputRef: "build-output:42", producingRevisionRef: "git:abc", materialBoundaryRef: "materials:42", provenanceRef: "prov:42", contentDigest: "sha256:aaa", completeness: "KNOWN", currentness };
const artifact: CanonicalArtifact = { artifactRef: "artifact:system", artifactRevisionRef: "artifact-rev:42", adoptedBuildOutputRef: output.buildOutputRef, producingRevisionRef: output.producingRevisionRef, materialBoundaryRef: output.materialBoundaryRef, provenanceRef: output.provenanceRef, contentDigest: output.contentDigest, providerRef: "registry:a", providerLocalId: "local:1", mutableTag: "latest", completeness: "KNOWN", currentness };
const evidence: ArtifactSupplyEvidence = { evidenceRef: "evidence:sbom:42", kind: "SBOM", artifactRef: artifact.artifactRef, artifactRevisionRef: artifact.artifactRevisionRef, contentDigest: artifact.contentDigest, sourceRef: "source:builder", producerRef: "producer:sbom-tool", providerRef: "provider:a", providerAcknowledged: true, observedAt: "2026-09-13T12:30:00Z", completeness: "KNOWN", currentness, locality: { localityRef: "runner:trusted", populationRef: "population:g2" } };
const release: CanonicalRelease = { releaseRef: "release:system", releaseRevisionRef: "release-rev:42", artifactRef: artifact.artifactRef, artifactRevisionRef: artifact.artifactRevisionRef, artifactDigest: artifact.contentDigest, adoptionEvidenceRef: evidence.evidenceRef, sourceOfTruthRef: "release-ledger:system", providerRef: "registry:b", providerLocalId: "provider-release:99", channelRef: "stable", completeness: "KNOWN", currentness };
const drained: ReleaseCohort = { cohortRef: "cohort:previous", releaseRef: "release:system", releaseRevisionRef: "release-rev:41", populationRef: "population:release-41", knownPopulation: 12, residualPopulation: 0, completeness: "KNOWN", currentness };

test("integrated lineage qualifies build output, canonical artifact, evidence and release without collapsing identities", () => {
  assert.equal(evaluateArtifactAdoption(artifact, output, at), "ADOPT");
  assert.equal(evaluateArtifactEvidence(evidence, artifact, at), "QUALIFIED");
  assert.equal(evaluateReleaseAdoption(release, artifact, at), "ADOPT");
  assert.equal(buildOutputIsCanonicalArtifact(output, artifact), false);
  assert.equal(canonicalArtifactIsRelease(artifact), false);
  assert.equal(canonicalArtifactIsEffectiveRuntime(artifact), false);
  assert.equal(releasePublicationEstablishesDeployedRuntime(release), false);
});

test("canonical identity and provenance survive provider substitution without provider authority", () => {
  const substitutedArtifact = { ...artifact, providerRef: "registry:other", providerLocalId: "other:77", mutableTag: "candidate" };
  const substitutedEvidence = { ...evidence, providerRef: "provider:other", providerAcknowledged: true };
  assert.equal(evaluateArtifactAdoption(substitutedArtifact, output, at), "ADOPT");
  assert.equal(evaluateArtifactEvidence(substitutedEvidence, substitutedArtifact, at), "QUALIFIED");
  assert.equal(providerAcknowledgementEstablishesEvidenceAuthority(substitutedEvidence), false);
  assert.equal(providerAcknowledgementEstablishesEffectiveReleaseAdoption(release), false);
});

test("signature and attestation presence never become trust or admission", () => {
  assert.equal(signaturePresenceEstablishesTrustOrAdmission({ ...evidence, kind: "SIGNATURE" }), false);
  assert.equal(attestationPresenceEstablishesTrustOrAdmission({ ...evidence, kind: "ATTESTATION" }), false);
});

test("PARTIAL and UNKNOWN remain non-strengthening across artifact, evidence and release", () => {
  assert.equal(evaluateArtifactAdoption({ ...artifact, completeness: "PARTIAL" }, output, at), "REJECT");
  assert.equal(evaluateArtifactAdoption({ ...artifact, completeness: "UNKNOWN" }, output, at), "RECONCILE_BEFORE_RETRY");
  assert.equal(evaluateArtifactEvidence({ ...evidence, completeness: "PARTIAL" }, artifact, at), "REJECTED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, completeness: "UNKNOWN" }, artifact, at), "RECONCILE_BEFORE_RETRY");
  assert.equal(evaluateReleaseAdoption({ ...release, completeness: "PARTIAL" }, artifact, at), "REJECT");
  assert.equal(evaluateReleaseAdoption({ ...release, completeness: "UNKNOWN" }, artifact, at), "RECONCILE_BEFORE_RETRY");
});

test("release residual drainage requires qualified population/currentness and does not claim Production Readiness", () => {
  assert.equal(evaluateResidualReleaseDrainage(drained, at), "DRAINED");
  assert.equal(evaluateResidualReleaseDrainage({ ...drained, residualPopulation: 1 }, at), "NOT_DRAINED");
  assert.equal(evaluateResidualReleaseDrainage({ ...drained, knownPopulation: null }, at), "RECONCILE_BEFORE_RETRY");
  assert.equal(evaluateResidualReleaseDrainage({ ...drained, currentness: { ...currentness, state: "STALE" } }, at), "NOT_DRAINED");
  assert.equal(releasePublicationEstablishesDeployedRuntime(release), false);
});
