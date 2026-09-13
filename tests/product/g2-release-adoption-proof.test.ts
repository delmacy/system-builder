import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalArtifact } from "../../packages/contracts/artifact-supply/artifact-identity";
import {
  canonicalArtifactIsEffectiveRuntime,
  channelIdentityEstablishesReleaseAuthority,
  evaluateReleaseAdoption,
  evaluateResidualReleaseDrainage,
  providerAcknowledgementEstablishesEffectiveReleaseAdoption,
  releaseCoexistenceIsExplicit,
  releasePreservesArtifactIdentity,
  releasePublicationEstablishesDeployedRuntime,
  type CanonicalRelease,
  type ReleaseCohort,
} from "../../packages/contracts/artifact-supply/release-lifecycle";

const at = "2026-09-13T13:00:00Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-13T12:00:00Z", validUntil: "2026-09-13T14:00:00Z" };
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
const release: CanonicalRelease = {
  releaseRef: "release:system",
  releaseRevisionRef: "release-rev:42",
  artifactRef: artifact.artifactRef,
  artifactRevisionRef: artifact.artifactRevisionRef,
  artifactDigest: artifact.contentDigest,
  adoptionEvidenceRef: "evidence:release:42",
  sourceOfTruthRef: "release-ledger:system",
  providerRef: "registry:a",
  providerLocalId: "provider-release:99",
  channelRef: "stable",
  completeness: "KNOWN",
  currentness,
};
const cohort: ReleaseCohort = {
  cohortRef: "cohort:previous-release",
  releaseRef: "release:system",
  releaseRevisionRef: "release-rev:41",
  populationRef: "population:release-41",
  knownPopulation: 12,
  residualPopulation: 0,
  completeness: "KNOWN",
  currentness,
};

test("release adoption is evidence-backed and bound to the exact canonical artifact", () => {
  assert.equal(releasePreservesArtifactIdentity(release, artifact), true);
  assert.equal(evaluateReleaseAdoption(release, artifact, at), "ADOPT");
  assert.equal(evaluateReleaseAdoption({ ...release, artifactRevisionRef: "artifact-rev:41" }, artifact, at), "REJECT");
  assert.equal(evaluateReleaseAdoption({ ...release, artifactDigest: "sha256:wrong" }, artifact, at), "REJECT");
  assert.equal(evaluateReleaseAdoption({ ...release, adoptionEvidenceRef: null }, artifact, at), "REJECT");
});

test("stale, PARTIAL and UNKNOWN release observations cannot strengthen adoption", () => {
  assert.equal(evaluateReleaseAdoption({ ...release, currentness: { ...currentness, state: "STALE" } }, artifact, at), "REJECT");
  assert.equal(evaluateReleaseAdoption({ ...release, completeness: "PARTIAL" }, artifact, at), "REJECT");
  assert.equal(evaluateReleaseAdoption({ ...release, completeness: "UNKNOWN" }, artifact, at), "RECONCILE_BEFORE_RETRY");
});

test("coexistence keeps source-of-truth and rollback state explicit", () => {
  assert.equal(releaseCoexistenceIsExplicit({ sourceOfTruthReleaseRef: release.releaseRef, activeReleaseRefs: ["release:system", "release:system:previous"], rollbackReleaseRef: "release:system:previous" }), true);
  assert.equal(releaseCoexistenceIsExplicit({ sourceOfTruthReleaseRef: "", activeReleaseRefs: [release.releaseRef], rollbackReleaseRef: null }), false);
});

test("residual cohorts drain only with known population, zero residuals and current evidence", () => {
  assert.equal(evaluateResidualReleaseDrainage(cohort, at), "DRAINED");
  assert.equal(evaluateResidualReleaseDrainage({ ...cohort, residualPopulation: 1 }, at), "NOT_DRAINED");
  assert.equal(evaluateResidualReleaseDrainage({ ...cohort, currentness: { ...currentness, state: "STALE" } }, at), "NOT_DRAINED");
  assert.equal(evaluateResidualReleaseDrainage({ ...cohort, completeness: "PARTIAL" }, at), "NOT_DRAINED");
  assert.equal(evaluateResidualReleaseDrainage({ ...cohort, knownPopulation: null }, at), "RECONCILE_BEFORE_RETRY");
  assert.equal(evaluateResidualReleaseDrainage({ ...cohort, residualPopulation: null }, at), "RECONCILE_BEFORE_RETRY");
});

test("provider/channel acknowledgement and publication never establish runtime convergence", () => {
  assert.equal(providerAcknowledgementEstablishesEffectiveReleaseAdoption(release), false);
  assert.equal(channelIdentityEstablishesReleaseAuthority(release), false);
  assert.equal(releasePublicationEstablishesDeployedRuntime(release), false);
  assert.equal(canonicalArtifactIsEffectiveRuntime(artifact), false);
});
