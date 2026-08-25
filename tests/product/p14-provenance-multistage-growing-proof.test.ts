import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import type { EvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";
import { normalizeEvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { DeploymentObservation } from "../../packages/observe/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-full-lineage:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-full-lineage:1"],
  contentHash: `sha256:${"5".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"6".repeat(64)}`,
};
const provenance: EvidenceProvenanceExtension = {
  extensionVersion: "1.0.0",
  evidenceId: "urn:evidence:p14-full-lineage",
  sources: [
    { sourceId: "urn:source:case-42", sourceType: "external.case-file", correlationRef: "urn:correlation:case-42" },
    { sourceId: "urn:source:artifact-17", sourceType: "artifact", capturedAt: "2026-08-25T05:50:00Z", authorRef: "actor:analyst" },
  ],
  classification: { label: "verified", confidence: 0.96 },
  transformations: [
    { descriptorId: "compiler.release", descriptorVersion: "1.0.0", tool: { id: "system-builder.compiler", version: "14.0.0" } },
  ],
  lineage: { predecessorEvidenceIds: ["urn:evidence:source-b", "urn:evidence:source-a"] },
};
const secretReference = "secret://p14/database-url";
const resolvedSecret = "postgres://user:password@db.internal/system_builder";
const providerResource = "provider://resource/abc123";
const storageLocator = "s3://private-bucket/private-key";
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:p14-full-lineage",
  runtimeVersions: Object.freeze(["14.0.0"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: secretReference }),
  ]),
});

function fullChain(includeProvenance: boolean) {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    ...(includeProvenance ? { evidenceProvenance: provenance } : {}),
  });
  const release = new ReleaseRegistry().publish({
    releaseId: includeProvenance ? "release:p14-full-lineage" : "release:p14-full-lineage-historical",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-25T05:50:01Z",
  });
  const deploymentResult = dryRunDeploy({
    publishedRelease: release,
    releaseArtifact: {
      kind: "ReleaseArtifact",
      artifactHash: compilation.artifact.artifactHash,
      manifest: { runtimeVersion: compilation.artifact.manifest.runtimeVersion },
      environmentSchema: compilation.artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-25T05:50:02Z",
    completedAt: "2026-08-25T05:50:03Z",
  });
  assert.equal(deploymentResult.ok, true);
  if (!deploymentResult.ok) throw new Error("expected successful deployment");
  const observation = DeploymentObservation.fromDeploymentRecord(deploymentResult.record);
  return { compilation, release, deployment: deploymentResult.record, observation };
}

test("full Compiler -> Release -> Deploy -> Observe chain preserves evidence identity and lineage", () => {
  const expected = normalizeEvidenceProvenanceExtension(provenance);
  const result = fullChain(true);

  assert.deepEqual(result.compilation.artifact.evidenceProvenance, expected);
  assert.deepEqual(result.release.evidenceProvenance, expected);
  assert.deepEqual(result.deployment.evidenceProvenance, expected);
  assert.deepEqual(result.observation.evidenceProvenance, expected);
  assert.equal(result.observation.evidenceProvenance?.sources[1]?.sourceType, "external.case-file");
  assert.deepEqual(result.observation.evidenceProvenance?.lineage.predecessorEvidenceIds, [
    "urn:evidence:source-a",
    "urn:evidence:source-b",
  ]);

  const restored = DeploymentObservation.fromJson(DeploymentObservation.toJson(result.observation));
  assert.deepEqual(restored, result.observation);
});

test("full chain is deterministic and provenance does not affect execution authority", () => {
  const first = fullChain(true);
  const second = fullChain(true);
  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.equal(first.deployment.deploymentId, second.deployment.deploymentId);
  assert.equal(first.observation.observationId, second.observation.observationId);
  assert.deepEqual(first.observation.evidenceProvenance, second.observation.evidenceProvenance);
  assert.equal(first.deployment.status, "succeeded");
});

test("historical full chain remains valid without provenance", () => {
  const result = fullChain(false);
  assert.equal("evidenceProvenance" in result.compilation.artifact, false);
  assert.equal("evidenceProvenance" in result.release, false);
  assert.equal("evidenceProvenance" in result.deployment, false);
  assert.equal("evidenceProvenance" in result.observation, false);
  assert.deepEqual(DeploymentObservation.fromJson(DeploymentObservation.toJson(result.observation)), result.observation);
});

test("malformed provenance fails at the first boundary and serialized evidence leaks no secret/resource locator", () => {
  const malformed = {
    ...provenance,
    sources: [{ sourceId: "urn:source:unsafe", sourceType: "document", credential: resolvedSecret }],
  } as unknown as EvidenceProvenanceExtension;
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence,
      compilerVersion: "14.0.0",
      runtimeVersion: "14.0.0",
      evidenceProvenance: malformed,
    }),
    /unexpected field credential/,
  );

  const result = fullChain(true);
  const serialized = JSON.stringify({
    artifact: result.compilation.artifact,
    release: result.release,
    deployment: result.deployment,
    observation: result.observation,
  });
  for (const forbidden of [resolvedSecret, secretReference, providerResource, storageLocator]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});
