import assert from "node:assert/strict";
import test from "node:test";
import {
  attestationPresenceEstablishesTrustOrAdmission,
  evaluateArtifactEvidence,
  evidenceMatchesCanonicalArtifact,
  providerAcknowledgementEstablishesEvidenceAuthority,
  producerIdentityEstablishesEvidenceCurrentness,
  signaturePresenceEstablishesTrustOrAdmission,
  type ArtifactSupplyEvidence,
} from "../../packages/contracts/artifact-supply/artifact-provenance";
import type { CanonicalArtifact } from "../../packages/contracts/artifact-supply/artifact-identity";

const at = "2026-09-13T12:00:00Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-13T11:00:00Z", validUntil: "2026-09-13T13:00:00Z" };
const artifact: CanonicalArtifact = {
  artifactRef: "artifact:system",
  artifactRevisionRef: "artifact-rev:42",
  adoptedBuildOutputRef: "build-output:42",
  producingRevisionRef: "git:abc",
  materialBoundaryRef: "materials:42",
  provenanceRef: "prov:42",
  contentDigest: "sha256:aaa",
  providerRef: "registry:a",
  providerLocalId: "local:1",
  mutableTag: "latest",
  completeness: "KNOWN",
  currentness,
};
const evidence: ArtifactSupplyEvidence = {
  evidenceRef: "evidence:sbom:42",
  kind: "SBOM",
  artifactRef: artifact.artifactRef,
  artifactRevisionRef: artifact.artifactRevisionRef,
  contentDigest: artifact.contentDigest,
  sourceRef: "source:builder",
  producerRef: "producer:sbom-tool",
  providerRef: "provider:a",
  providerAcknowledged: true,
  observedAt: "2026-09-13T11:30:00Z",
  completeness: "KNOWN",
  currentness,
  locality: { localityRef: "runner:trusted", populationRef: "population:g2" },
};

test("current SBOM/provenance evidence qualifies only for the exact canonical artifact revision", () => {
  assert.equal(evidenceMatchesCanonicalArtifact(evidence, artifact), true);
  assert.equal(evaluateArtifactEvidence(evidence, artifact, at), "QUALIFIED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, artifactRevisionRef: "artifact-rev:41" }, artifact, at), "REJECTED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, contentDigest: "sha256:wrong" }, artifact, at), "REJECTED");
});

test("stale, PARTIAL and UNKNOWN evidence cannot strengthen artifact qualification", () => {
  assert.equal(evaluateArtifactEvidence({ ...evidence, currentness: { ...currentness, state: "STALE" } }, artifact, at), "REJECTED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, completeness: "PARTIAL" }, artifact, at), "REJECTED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, completeness: "UNKNOWN" }, artifact, at), "RECONCILE_BEFORE_RETRY");
});

test("provider substitution and acknowledgements do not create authority or currentness", () => {
  const substituted = { ...evidence, providerRef: "provider:b", producerRef: "producer:other", providerAcknowledged: true };
  assert.equal(evaluateArtifactEvidence(substituted, artifact, at), "QUALIFIED");
  assert.equal(providerAcknowledgementEstablishesEvidenceAuthority(substituted), false);
  assert.equal(producerIdentityEstablishesEvidenceCurrentness(substituted), false);
});

test("signature and attestation presence remain distinct from trust/admission", () => {
  assert.equal(signaturePresenceEstablishesTrustOrAdmission({ ...evidence, kind: "SIGNATURE" }), false);
  assert.equal(attestationPresenceEstablishesTrustOrAdmission({ ...evidence, kind: "ATTESTATION" }), false);
});

test("missing evidence facts reject qualification", () => {
  assert.equal(evaluateArtifactEvidence({ ...evidence, evidenceRef: "" }, artifact, at), "REJECTED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, sourceRef: "" }, artifact, at), "REJECTED");
  assert.equal(evaluateArtifactEvidence({ ...evidence, observedAt: "not-a-time" }, artifact, at), "REJECTED");
});
