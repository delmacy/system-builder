import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { ReleaseRegistry, type ReleaseArtifactInput } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-release:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-release:1"],
  contentHash: `sha256:${"c".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"d".repeat(64)}`,
};
const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:release-source",
  sources: [
    { sourceId: "urn:source:z", sourceType: "document" },
    { sourceId: "urn:source:a", sourceType: "artifact" },
  ],
  transformations: [{ descriptorId: "compiler.release", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: ["urn:evidence:z", "urn:evidence:a"] },
};

function compiledArtifact() {
  return compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    evidenceProvenance: provenance,
  }).artifact;
}

test("release publication preserves Compiler provenance through get and transition", () => {
  const registry = new ReleaseRegistry();
  const artifact = compiledArtifact();
  const published = registry.publish({
    releaseId: "release:p14",
    version: "1.0.0",
    artifact,
    publishedAt: "2026-08-25T05:20:00Z",
  });

  assert.deepEqual(published.evidenceProvenance, artifact.evidenceProvenance);
  assert.deepEqual(registry.get("release:p14", "1.0.0")?.evidenceProvenance, artifact.evidenceProvenance);
  assert.deepEqual(registry.transition("release:p14", "1.0.0", "deprecated").evidenceProvenance, artifact.evidenceProvenance);
  assert.deepEqual(registry.transition("release:p14", "1.0.0", "archived").evidenceProvenance, artifact.evidenceProvenance);
});

test("release publication remains backward compatible without provenance", () => {
  const registry = new ReleaseRegistry();
  const artifact = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
  }).artifact;
  const published = registry.publish({
    releaseId: "release:historical",
    version: "1.0.0",
    artifact,
    publishedAt: "2026-08-25T05:20:00Z",
  });
  assert.equal("evidenceProvenance" in published, false);
});

test("release rejects malformed explicit provenance before publication", () => {
  const registry = new ReleaseRegistry();
  const artifact = {
    ...compiledArtifact(),
    evidenceProvenance: {
      ...provenance,
      sources: [{ sourceId: "urn:source:unsafe", sourceType: "document", credential: "secret-value" }],
    },
  } as unknown as ReleaseArtifactInput;

  assert.throws(
    () => registry.publish({
      releaseId: "release:invalid",
      version: "1.0.0",
      artifact,
      publishedAt: "2026-08-25T05:20:00Z",
    }),
    /unexpected field credential/,
  );
  assert.equal(registry.get("release:invalid", "1.0.0"), undefined);
});
