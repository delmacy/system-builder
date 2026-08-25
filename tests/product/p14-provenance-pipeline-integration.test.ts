import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { normalizeEvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-pipeline:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-pipeline:1"],
  contentHash: `sha256:${"3".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"4".repeat(64)}`,
};
const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:p14-pipeline",
  sources: [
    { sourceId: "urn:source:zeta", sourceType: "document", correlationRef: "urn:correlation:p14" },
    { sourceId: "urn:source:alpha", sourceType: "artifact", capturedAt: "2026-08-25T05:45:00Z" },
  ],
  classification: { label: "verified", confidence: 0.97 },
  transformations: [
    { descriptorId: "compiler.release", descriptorVersion: "1.0.0", tool: { id: "system-builder.compiler", version: "14.0.0" } },
  ],
  lineage: { predecessorEvidenceIds: ["urn:evidence:z", "urn:evidence:a"] },
};
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:p14-pipeline",
  runtimeVersions: Object.freeze(["14.0.0"]),
  bindings: Object.freeze([]),
});

function executeChain(includeProvenance: boolean) {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    ...(includeProvenance ? { evidenceProvenance: provenance } : {}),
  });
  const release = new ReleaseRegistry().publish({
    releaseId: "release:p14-pipeline",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-25T05:45:01Z",
  });
  const deployment = dryRunDeploy({
    publishedRelease: release,
    releaseArtifact: {
      kind: "ReleaseArtifact",
      artifactHash: compilation.artifact.artifactHash,
      manifest: { runtimeVersion: compilation.artifact.manifest.runtimeVersion },
      environmentSchema: compilation.artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-25T05:45:02Z",
    completedAt: "2026-08-25T05:45:03Z",
  });
  assert.equal(deployment.ok, true);
  if (!deployment.ok) throw new Error("expected deployment success");
  return { compilation, release, deployment: deployment.record };
}

test("actual Compiler -> Release -> Deploy chain preserves canonical provenance", () => {
  const expected = normalizeEvidenceProvenanceExtension(provenance);
  const result = executeChain(true);

  assert.deepEqual(result.compilation.artifact.evidenceProvenance, expected);
  assert.deepEqual(result.release.evidenceProvenance, expected);
  assert.deepEqual(result.deployment.evidenceProvenance, expected);
  assert.equal(result.compilation.artifact.evidenceProvenance?.evidenceId, provenance.evidenceId);
  assert.deepEqual(result.deployment.evidenceProvenance?.sources.map((source) => source.sourceId), ["urn:source:alpha", "urn:source:zeta"]);
  assert.deepEqual(result.deployment.evidenceProvenance?.lineage.predecessorEvidenceIds, ["urn:evidence:a", "urn:evidence:z"]);
});

test("repeating the real chain preserves provenance and stable existing identities", () => {
  const first = executeChain(true);
  const second = executeChain(true);

  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.equal(first.release.artifactHash, second.release.artifactHash);
  assert.equal(first.deployment.deploymentId, second.deployment.deploymentId);
  assert.deepEqual(first.compilation.artifact.evidenceProvenance, second.compilation.artifact.evidenceProvenance);
  assert.deepEqual(first.release.evidenceProvenance, second.release.evidenceProvenance);
  assert.deepEqual(first.deployment.evidenceProvenance, second.deployment.evidenceProvenance);
});

test("historical Compiler -> Release -> Deploy chain remains provenance-free", () => {
  const result = executeChain(false);
  assert.equal("evidenceProvenance" in result.compilation.artifact, false);
  assert.equal("evidenceProvenance" in result.release, false);
  assert.equal("evidenceProvenance" in result.deployment, false);
});
