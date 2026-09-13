import assert from "node:assert/strict";
import test from "node:test";
import {
  artifactPreservesBuildOutputLineage,
  buildOutputIsCanonicalArtifact,
  canonicalArtifactIsRelease,
  evaluateArtifactAdoption,
  mutableTagEstablishesCanonicalArtifactIdentity,
  providerIdentityEstablishesCanonicalArtifactIdentity,
  type CanonicalArtifact,
  type QualifiedBuildOutput,
} from "../../packages/contracts/artifact-supply/artifact-identity";

const at = "2026-09-13T10:00:00Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-13T09:00:00Z", validUntil: "2026-09-13T11:00:00Z" };
const output: QualifiedBuildOutput = {
  buildOutputRef: "build-output:42", producingRevisionRef: "git:abc", materialBoundaryRef: "materials:42",
  provenanceRef: "prov:42", contentDigest: "sha256:aaa", completeness: "KNOWN", currentness,
};
const artifact: CanonicalArtifact = {
  artifactRef: "artifact:system", artifactRevisionRef: "artifact-rev:42", adoptedBuildOutputRef: output.buildOutputRef,
  producingRevisionRef: output.producingRevisionRef, materialBoundaryRef: output.materialBoundaryRef,
  provenanceRef: output.provenanceRef, contentDigest: output.contentDigest, providerRef: "registry:a",
  providerLocalId: "local:1", mutableTag: "latest", completeness: "KNOWN", currentness,
};

test("qualified build output can be adopted only with preserved canonical lineage", () => {
  assert.equal(artifactPreservesBuildOutputLineage(artifact, output), true);
  assert.equal(evaluateArtifactAdoption(artifact, output, at), "ADOPT");
  assert.equal(buildOutputIsCanonicalArtifact(output, artifact), false);
  assert.equal(canonicalArtifactIsRelease(artifact), false);
});

test("provider ids and mutable tags never establish canonical authority", () => {
  const collision = { ...artifact, artifactRef: "artifact:other", providerLocalId: artifact.providerLocalId, mutableTag: artifact.mutableTag };
  assert.equal(providerIdentityEstablishesCanonicalArtifactIdentity(collision), false);
  assert.equal(mutableTagEstablishesCanonicalArtifactIdentity(collision), false);
});

test("stale, partial and ambiguous adoption cannot strengthen authority", () => {
  assert.equal(evaluateArtifactAdoption({ ...artifact, completeness: "PARTIAL" }, output, at), "REJECT");
  assert.equal(evaluateArtifactAdoption({ ...artifact, currentness: { ...currentness, state: "STALE" } }, output, at), "REJECT");
  assert.equal(evaluateArtifactAdoption({ ...artifact, completeness: "UNKNOWN" }, output, at), "RECONCILE_BEFORE_RETRY");
  assert.equal(evaluateArtifactAdoption({ ...artifact, contentDigest: "sha256:wrong" }, output, at), "REJECT");
});
