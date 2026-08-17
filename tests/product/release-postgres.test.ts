import assert from "node:assert/strict";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { PostgresReleaseRecordStorage } from "../../packages/release/postgres.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const artifact = Object.freeze({ kind: "ReleaseArtifact" as const, artifactHash: `sha256:${"a".repeat(64)}`, validationEvidenceRef: `sha256:${"b".repeat(64)}` });

test("postgres release provider survives reconstruction", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const firstStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task095");
  const firstRegistry = new ReleaseRegistry(firstStorage);
  const published = firstRegistry.publish({ releaseId: "durable-app", version: "1.0.0", artifact, publishedAt: "2026-08-17T15:00:00Z" });
  await firstStorage.flush();

  const reconstructedStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task095");
  const reconstructedRegistry = new ReleaseRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.get("durable-app", "1.0.0"), published);
  assert.equal(Object.isFrozen(reconstructedRegistry.get("durable-app", "1.0.0")), true);
  assert.throws(() => reconstructedRegistry.publish({ releaseId: "durable-app", version: "1.0.0", artifact, publishedAt: "2026-08-17T15:01:00Z" }), /RELEASE_DUPLICATE_IDENTITY:durable-app@1\.0\.0/);
  assert.equal(reconstructedRegistry.transition("durable-app", "1.0.0", "deprecated").status, "deprecated");
  await reconstructedStorage.flush();

  const secondStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task095");
  const secondRegistry = new ReleaseRegistry(secondStorage);
  assert.equal(secondRegistry.get("durable-app", "1.0.0")?.status, "deprecated");
  assert.throws(() => secondRegistry.transition("durable-app", "1.0.0", "published"), /RELEASE_INVALID_TRANSITION:deprecated->published/);
  assert.equal(secondRegistry.transition("durable-app", "1.0.0", "archived").status, "archived");
  await secondStorage.flush();

  const finalStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task095");
  const finalRecord = new ReleaseRegistry(finalStorage).get("durable-app", "1.0.0");
  assert.equal(finalRecord?.status, "archived");
  assert.equal(JSON.stringify(finalRecord).includes(postgresUrl), false);
  await finalStorage.close();
  await secondStorage.close();
  await reconstructedStorage.close();
  await firstStorage.close();
});

test("postgres release provider sanitizes invalid connection diagnostics", async () => {
  const connectionString = "postgres://secret-user:super-secret@127.0.0.1:0/system_builder";
  await assert.rejects(() => PostgresReleaseRecordStorage.open(connectionString, "task095_failure"), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.equal(error.message, "RELEASE_POSTGRES_URL_INVALID");
    assert.equal(error.message.includes("secret-user"), false);
    assert.equal(error.message.includes("super-secret"), false);
    assert.equal(error.message.includes(connectionString), false);
    return true;
  });
});

test("durable release and artifact providers reconstruct actual Compiler output together", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const assemblyPlan = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:task097:1",
    components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
    sourceRefs: ["system-definition:task097:1"],
    contentHash: `sha256:${"3".repeat(64)}`,
  };
  const validationEvidence = {
    kind: "ValidationEvidence" as const,
    assemblyPlanRef: assemblyPlan.contentHash,
    decision: "PASS" as const,
    evidenceHash: `sha256:${"4".repeat(64)}`,
  };
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
  });

  const releaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task097_release");
  const artifactRepository = await PostgresArtifactPayloadRepository.open(postgresUrl, "task097_artifact");
  const releaseRegistry = new ReleaseRegistry(releaseStorage);
  const publishedRelease = releaseRegistry.publish({
    releaseId: "factory-task097",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-17T15:15:00Z",
  });
  const publishedPayload = artifactRepository.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  await releaseStorage.flush();
  await artifactRepository.flush();

  const reconstructedReleaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task097_release");
  const reconstructedArtifactRepository = await PostgresArtifactPayloadRepository.open(postgresUrl, "task097_artifact");
  const reconstructedReleaseRegistry = new ReleaseRegistry(reconstructedReleaseStorage);
  assert.deepEqual(reconstructedReleaseRegistry.get("factory-task097", "1.0.0"), publishedRelease);
  assert.deepEqual(reconstructedArtifactRepository.get(compilation.artifact.artifactHash), publishedPayload);
  assert.deepEqual(reconstructedArtifactRepository.getVerified(compilation.artifact).files, compilation.files);

  assert.throws(() => reconstructedReleaseRegistry.publish({
    releaseId: "factory-task097", version: "1.0.0", artifact: compilation.artifact, publishedAt: "2026-08-17T15:16:00Z",
  }), /RELEASE_DUPLICATE_IDENTITY:factory-task097@1\.0\.0/);
  assert.throws(() => reconstructedArtifactRepository.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.map((file, index) => index === 0 ? { ...file, content: `${file.content}\nconflict` } : file),
  }), /ARTIFACT_PAYLOAD_CONFLICT/);
  assert.throws(() => reconstructedArtifactRepository.get(`sha256:${"e".repeat(64)}`), /ARTIFACT_PAYLOAD_NOT_FOUND/);
  assert.throws(() => reconstructedArtifactRepository.getVerified({ ...compilation.artifact, assemblyPlanRef: `sha256:${"9".repeat(64)}` }), /ARTIFACT_PAYLOAD_AGGREGATE_HASH_MISMATCH/);

  assert.equal(reconstructedReleaseRegistry.transition("factory-task097", "1.0.0", "deprecated").status, "deprecated");
  await reconstructedReleaseStorage.flush();
  const finalReleaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, "task097_release");
  assert.equal(new ReleaseRegistry(finalReleaseStorage).get("factory-task097", "1.0.0")?.status, "deprecated");

  const evidenceText = JSON.stringify({
    release: new ReleaseRegistry(finalReleaseStorage).get("factory-task097", "1.0.0"),
    payload: reconstructedArtifactRepository.get(compilation.artifact.artifactHash),
  });
  assert.equal(evidenceText.includes(postgresUrl), false);
  assert.equal(evidenceText.includes("postgres://"), false);
  assert.equal(evidenceText.includes("secret://"), false);

  await finalReleaseStorage.close();
  await reconstructedArtifactRepository.close();
  await reconstructedReleaseStorage.close();
  await artifactRepository.close();
  await releaseStorage.close();
});
