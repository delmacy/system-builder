import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { sha256Text } from "../../packages/deterministic/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const files = [
  { path: "runtime-entry.mjs", content: "console.log('ok')", contentHash: `sha256:${"b".repeat(64)}` },
  { path: "manifest.json", content: "{}", contentHash: `sha256:${"c".repeat(64)}` },
] as const;

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:artifact-store:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:artifact-store:1"],
  contentHash: `sha256:${"1".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"2".repeat(64)}`,
};

function compilationFixture() {
  return compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "LOG_LEVEL", kind: "config", required: false },
    ],
  });
}

test("artifact payload repository publishes and retrieves immutable deterministic snapshots", () => {
  const repository = new InMemoryArtifactPayloadRepository();
  const published = repository.publish({ artifactHash, files });
  const retrieved = repository.get(artifactHash);

  assert.deepEqual(published, retrieved);
  assert.deepEqual(retrieved.files.map((file) => file.path), ["manifest.json", "runtime-entry.mjs"]);
  assert.ok(Object.isFrozen(retrieved));
  assert.ok(Object.isFrozen(retrieved.files));
  assert.ok(retrieved.files.every((file) => Object.isFrozen(file)));
  assert.notEqual(retrieved, published);
  assert.notEqual(retrieved.files, published.files);
});

test("artifact payload repository makes identical publication idempotent and rejects conflicting overwrite", () => {
  const repository = new InMemoryArtifactPayloadRepository();
  const first = repository.publish({ artifactHash, files });
  const second = repository.publish({ artifactHash, files: [...files].reverse() });
  assert.deepEqual(first, second);

  assert.throws(
    () => repository.publish({
      artifactHash,
      files: [{ ...files[0], content: "substituted" }],
    }),
    new RegExp(`^Error: ARTIFACT_PAYLOAD_CONFLICT:${artifactHash}$`),
  );
});

test("artifact payload repository fails explicitly for missing artifact", () => {
  const repository = new InMemoryArtifactPayloadRepository();
  const missing = `sha256:${"d".repeat(64)}`;
  assert.throws(
    () => repository.get(missing),
    new RegExp(`^Error: ARTIFACT_PAYLOAD_NOT_FOUND:${missing}$`),
  );
});

test("verified retrieval reproduces actual Compiler per-file and aggregate identity", () => {
  const compilation = compilationFixture();
  const repository = new InMemoryArtifactPayloadRepository();
  repository.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });

  const verified = repository.getVerified(compilation.artifact);
  assert.equal(verified.verified, true);
  assert.equal(verified.artifactHash, compilation.artifact.artifactHash);
  assert.deepEqual(verified.files, compilation.files);
  assert.ok(Object.isFrozen(verified));
});

test("verified retrieval rejects modified content and substituted content hash", () => {
  const compilation = compilationFixture();
  const original = compilation.files[0];
  assert.ok(original);

  const modifiedContentRepository = new InMemoryArtifactPayloadRepository();
  modifiedContentRepository.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.map((file, index) => index === 0 ? { ...file, content: `${file.content}\ncorrupt` } : file),
  });
  assert.throws(
    () => modifiedContentRepository.getVerified(compilation.artifact),
    /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH/,
  );

  const substitutedHashRepository = new InMemoryArtifactPayloadRepository();
  substitutedHashRepository.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.map((file, index) => index === 0 ? { ...file, contentHash: sha256Text("substituted") } : file),
  });
  assert.throws(
    () => substitutedHashRepository.getVerified(compilation.artifact),
    /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH/,
  );
});

test("verified retrieval rejects missing, extra and duplicate paths", () => {
  const compilation = compilationFixture();

  const missingRepository = new InMemoryArtifactPayloadRepository();
  missingRepository.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.slice(1),
  });
  assert.throws(() => missingRepository.getVerified(compilation.artifact), /ARTIFACT_PAYLOAD_MANIFEST_MISMATCH/);

  const extraRepository = new InMemoryArtifactPayloadRepository();
  extraRepository.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: [...compilation.files, { path: "extra.txt", content: "extra", contentHash: sha256Text("extra") }],
  });
  assert.throws(() => extraRepository.getVerified(compilation.artifact), /ARTIFACT_PAYLOAD_MANIFEST_MISMATCH/);

  const duplicateRepository = new InMemoryArtifactPayloadRepository();
  duplicateRepository.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: [...compilation.files, compilation.files[0]!],
  });
  assert.throws(() => duplicateRepository.getVerified(compilation.artifact), /ARTIFACT_PAYLOAD_DUPLICATE_PATH/);
});

test("verified retrieval rejects manifest or aggregate metadata substitution", () => {
  const compilation = compilationFixture();
  const repository = new InMemoryArtifactPayloadRepository();
  repository.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });

  assert.throws(
    () => repository.getVerified({
      ...compilation.artifact,
      manifest: { ...compilation.artifact.manifest, files: compilation.artifact.manifest.files.slice(1) },
    }),
    /ARTIFACT_PAYLOAD_MANIFEST_MISMATCH/,
  );

  assert.throws(
    () => repository.getVerified({ ...compilation.artifact, assemblyPlanRef: `sha256:${"9".repeat(64)}` }),
    /ARTIFACT_PAYLOAD_AGGREGATE_HASH_MISMATCH/,
  );
});
