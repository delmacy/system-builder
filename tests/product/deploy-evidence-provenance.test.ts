import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-deploy:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-deploy:1"],
  contentHash: `sha256:${"e".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"f".repeat(64)}`,
};
const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:deploy-source",
  sources: [{ sourceId: "urn:source:artifact", sourceType: "artifact" }],
  transformations: [{ descriptorId: "compiler.release", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: ["urn:evidence:input"] },
};
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:p14-deploy",
  runtimeVersions: Object.freeze(["14.0.0"]),
  bindings: Object.freeze([]),
});

function chain(withProvenance = true) {
  const artifact = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    ...(withProvenance ? { evidenceProvenance: provenance } : {}),
  }).artifact;
  const registry = new ReleaseRegistry();
  const publishedRelease = registry.publish({
    releaseId: withProvenance ? "release:p14-deploy" : "release:p14-historical",
    version: "1.0.0",
    artifact,
    publishedAt: "2026-08-25T05:30:00Z",
  });
  return { artifact, publishedRelease };
}

test("deploy preserves PublishedRelease provenance without changing deterministic deployment identity", () => {
  const { artifact, publishedRelease } = chain(true);
  const input = {
    publishedRelease,
    releaseArtifact: {
      kind: "ReleaseArtifact" as const,
      artifactHash: artifact.artifactHash,
      manifest: { runtimeVersion: artifact.manifest.runtimeVersion },
      environmentSchema: artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-25T05:30:01Z",
    completedAt: "2026-08-25T05:30:02Z",
  };
  const first = dryRunDeploy(input);
  const second = dryRunDeploy(input);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;
  assert.deepEqual(first.record, second.record);
  assert.deepEqual(first.record.evidenceProvenance, publishedRelease.evidenceProvenance);

  const publishedReleaseWithoutProvenance = {
    kind: publishedRelease.kind,
    releaseId: publishedRelease.releaseId,
    version: publishedRelease.version,
    artifactRef: publishedRelease.artifactRef,
    artifactHash: publishedRelease.artifactHash,
    validationEvidenceRef: publishedRelease.validationEvidenceRef,
    publishedAt: publishedRelease.publishedAt,
    status: publishedRelease.status,
  };
  const withoutProvenance = dryRunDeploy({ ...input, publishedRelease: publishedReleaseWithoutProvenance });
  assert.equal(withoutProvenance.ok, true);
  if (!withoutProvenance.ok) return;
  assert.equal(withoutProvenance.record.deploymentId, first.record.deploymentId);
});

test("deployment registry preserves provenance through storage, listing and activation", () => {
  const { artifact, publishedRelease } = chain(true);
  const result = dryRunDeploy({
    publishedRelease,
    releaseArtifact: {
      kind: "ReleaseArtifact",
      artifactHash: artifact.artifactHash,
      manifest: { runtimeVersion: artifact.manifest.runtimeVersion },
      environmentSchema: artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-25T05:31:01Z",
    completedAt: "2026-08-25T05:31:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const registry = new DeploymentRegistry();
  const decision = registry.activateCandidate(result.record);
  assert.equal(decision.outcome, "activated");
  assert.deepEqual(registry.get(result.record.deploymentId)?.evidenceProvenance, publishedRelease.evidenceProvenance);
  assert.deepEqual(registry.getActive(environment.environmentRef)?.evidenceProvenance, publishedRelease.evidenceProvenance);
  assert.deepEqual(registry.list()[0]?.evidenceProvenance, publishedRelease.evidenceProvenance);
  assert.equal(Object.isFrozen(registry.get(result.record.deploymentId)?.evidenceProvenance), true);
});

test("deploy keeps historical no-provenance shape and failure diagnostics do not expose provenance", () => {
  const historical = chain(false);
  const historicalResult = dryRunDeploy({
    publishedRelease: historical.publishedRelease,
    releaseArtifact: {
      kind: "ReleaseArtifact",
      artifactHash: historical.artifact.artifactHash,
      manifest: { runtimeVersion: historical.artifact.manifest.runtimeVersion },
      environmentSchema: historical.artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [],
    startedAt: "2026-08-25T05:32:01Z",
    completedAt: "2026-08-25T05:32:02Z",
  });
  assert.equal(historicalResult.ok, true);
  if (historicalResult.ok) assert.equal("evidenceProvenance" in historicalResult.record, false);

  const current = chain(true);
  const failed = dryRunDeploy({
    publishedRelease: current.publishedRelease,
    releaseArtifact: {
      kind: "ReleaseArtifact",
      artifactHash: `sha256:${"0".repeat(64)}`,
      manifest: { runtimeVersion: current.artifact.manifest.runtimeVersion },
      environmentSchema: current.artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [],
    startedAt: "2026-08-25T05:32:03Z",
    completedAt: "2026-08-25T05:32:04Z",
  });
  assert.equal(failed.ok, false);
  assert.equal(JSON.stringify(failed).includes(provenance.evidenceId), false);
  assert.equal(JSON.stringify(failed).includes("credential"), false);
});
