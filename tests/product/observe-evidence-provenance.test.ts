import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { DeploymentObservation } from "../../packages/observe/index.js";

const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:observe-source",
  sources: [
    { sourceId: "urn:source:z", sourceType: "document" },
    { sourceId: "urn:source:a", sourceType: "artifact" },
  ],
  classification: { label: "verified", confidence: 0.9 },
  transformations: [{ descriptorId: "compiler.release", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: ["urn:evidence:z", "urn:evidence:a"] },
};

const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:p14-observe",
  runtimeVersions: Object.freeze(["14.0.0"]),
  bindings: Object.freeze([]),
});

function deployment(withProvenance: boolean) {
  const assemblyPlan = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p14-observe:1",
    components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
    sourceRefs: ["system-definition:p14-observe:1"],
    contentHash: `sha256:${"1".repeat(64)}`,
  };
  const validationEvidence = {
    kind: "ValidationEvidence" as const,
    assemblyPlanRef: assemblyPlan.contentHash,
    decision: "PASS" as const,
    evidenceHash: `sha256:${"2".repeat(64)}`,
  };
  const artifact = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    ...(withProvenance ? { evidenceProvenance: provenance } : {}),
  }).artifact;
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId: withProvenance ? "release:p14-observe" : "release:p14-observe-historical",
    version: "1.0.0",
    artifact,
    publishedAt: "2026-08-25T05:40:00Z",
  });
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
    startedAt: "2026-08-25T05:40:01Z",
    completedAt: "2026-08-25T05:40:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("expected successful deployment fixture");
  return result.record;
}

test("observe preserves DeploymentRecord provenance and deterministic normalization", () => {
  const record = deployment(true);
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  assert.deepEqual(observation.evidenceProvenance, record.evidenceProvenance);
  assert.deepEqual(observation.evidenceProvenance?.sources.map((source) => source.sourceId), ["urn:source:a", "urn:source:z"]);
  assert.deepEqual(observation.evidenceProvenance?.lineage.predecessorEvidenceIds, ["urn:evidence:a", "urn:evidence:z"]);
  assert.match(observation.observationId, /^sha256:[a-f0-9]{64}$/);
});

test("observe provenance survives toJson/fromJson losslessly", () => {
  const observation = DeploymentObservation.fromDeploymentRecord(deployment(true));
  const serialized = DeploymentObservation.toJson(observation);
  const restored = DeploymentObservation.fromJson(serialized);
  assert.deepEqual(restored, observation);
  assert.deepEqual(restored.evidenceProvenance, observation.evidenceProvenance);
});

test("observe rejects malformed provenance explicitly", () => {
  const record = deployment(true);
  const malformed = {
    ...record,
    evidenceProvenance: {
      ...record.evidenceProvenance,
      sources: [{ sourceId: "urn:source:unsafe", sourceType: "document", credential: "must-not-cross" }],
    },
  };
  assert.throws(
    () => DeploymentObservation.fromDeploymentRecord(malformed),
    /OBSERVE_INVALID_DEPLOYMENT_RECORD:PROVENANCE:.*unexpected field credential/,
  );
});

test("observe remains backward compatible for historical DeploymentRecord without provenance", () => {
  const observation = DeploymentObservation.fromDeploymentRecord(deployment(false));
  assert.equal("evidenceProvenance" in observation, false);
  const restored = DeploymentObservation.fromJson(DeploymentObservation.toJson(observation));
  assert.deepEqual(restored, observation);
});
