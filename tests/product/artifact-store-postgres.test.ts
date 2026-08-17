import assert from "node:assert/strict";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:task096:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:task096:1"],
  contentHash: `sha256:${"1".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"2".repeat(64)}`,
};
function compilationFixture() {
  return compileSyntheticRelease({ assemblyPlan, validationEvidence, compilerVersion: "0.1.0", runtimeVersion: "0.1.0", environmentSchema: [
    { name: "DATABASE_URL", kind: "secret-reference", required: true },
    { name: "LOG_LEVEL", kind: "config", required: false },
  ] });
}

test("postgres artifact repository preserves publication and verification across reconstruction", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const compilation = compilationFixture();
  const first = await PostgresArtifactPayloadRepository.open(postgresUrl, "task096");
  const published = first.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  await first.flush();

  const reconstructed = await PostgresArtifactPayloadRepository.open(postgresUrl, "task096");
  assert.deepEqual(reconstructed.get(compilation.artifact.artifactHash), published);
  assert.deepEqual(reconstructed.publish({ artifactHash: compilation.artifact.artifactHash, files: [...compilation.files].reverse() }), published);
  assert.equal(reconstructed.getVerified(compilation.artifact).verified, true);
  assert.throws(() => reconstructed.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.map((file, index) => index === 0 ? { ...file, content: `${file.content}\nconflict` } : file),
  }), new RegExp(`^Error: ARTIFACT_PAYLOAD_CONFLICT:${compilation.artifact.artifactHash}$`));
  assert.throws(() => reconstructed.get(`sha256:${"d".repeat(64)}`), /ARTIFACT_PAYLOAD_NOT_FOUND/);
  assert.equal(JSON.stringify(reconstructed.get(compilation.artifact.artifactHash)).includes(postgresUrl), false);
  await reconstructed.close();
  await first.close();
});

test("postgres artifact repository delegates tamper detection to existing verification semantics", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const compilation = compilationFixture();
  const first = await PostgresArtifactPayloadRepository.open(postgresUrl, "task096_corrupt");
  first.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.map((file, index) => index === 0 ? { ...file, content: `${file.content}\ncorrupt` } : file),
  });
  await first.flush();
  const reconstructed = await PostgresArtifactPayloadRepository.open(postgresUrl, "task096_corrupt");
  assert.throws(() => reconstructed.getVerified(compilation.artifact), /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH/);
  await reconstructed.close();
  await first.close();
});

test("postgres artifact provider sanitizes invalid connection diagnostics", async () => {
  const connectionString = "postgres://secret-user:super-secret@127.0.0.1:0/system_builder";
  await assert.rejects(() => PostgresArtifactPayloadRepository.open(connectionString, "task096_failure"), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.equal(error.message, "ARTIFACT_POSTGRES_URL_INVALID");
    assert.equal(error.message.includes("secret-user"), false);
    assert.equal(error.message.includes("super-secret"), false);
    assert.equal(error.message.includes(connectionString), false);
    return true;
  });
});
