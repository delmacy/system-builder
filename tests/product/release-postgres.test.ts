import assert from "node:assert/strict";
import test from "node:test";
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
