import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentRegistry, type DeploymentRecord } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";

const authenticatedPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;

function record(seed: string, status: "succeeded" | "failed", release: string): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: `sha256:${seed.repeat(64).slice(0, 64)}`,
    publishedReleaseRef: release,
    environmentRef: "env:p8-authenticated-transport",
    releaseHash: `sha256:${seed.repeat(64).slice(0, 64)}`,
    startedAt: "2026-08-17T20:45:00Z",
    completedAt: "2026-08-17T20:45:01Z",
    status,
    healthChecks: Object.freeze([
      Object.freeze({ name: "authenticated-provider", status: status === "succeeded" ? "PASS" as const : "FAIL" as const }),
    ]),
  });
}

test("authenticated Deploy PostgreSQL state reconstructs equivalent history and active authority without credential leakage", { skip: authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const connection = new URL(authenticatedPostgresUrl);
  connection.searchParams.set("sslmode", "prefer");
  const connectionString = connection.toString();
  const username = decodeURIComponent(connection.username);
  const password = decodeURIComponent(connection.password);

  const firstStorage = await PostgresDeploymentRecordStorage.open(connectionString, "task112_auth");
  const firstRegistry = new DeploymentRegistry(firstStorage);
  const active = firstRegistry.record(record("7", "succeeded", "p8-app@1.0.0"));
  const failed = firstRegistry.record(record("8", "failed", "p8-app@1.1.0"));
  await firstStorage.flush();
  await firstStorage.close();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(connectionString, "task112_auth");
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.get(active.deploymentId), active);
  assert.deepEqual(reconstructedRegistry.get(failed.deploymentId), failed);
  assert.deepEqual(reconstructedRegistry.getActive("env:p8-authenticated-transport"), active);
  assert.deepEqual(
    reconstructedRegistry.list().map((item) => item.deploymentId),
    [active.deploymentId, failed.deploymentId].sort(),
  );
  assert.equal(Object.isFrozen(reconstructedRegistry.get(active.deploymentId)), true);

  const evidence = JSON.stringify({
    history: reconstructedRegistry.list(),
    active: reconstructedRegistry.getActive("env:p8-authenticated-transport"),
  });
  assert.equal(evidence.includes(connectionString), false);
  assert.equal(evidence.includes(authenticatedPostgresUrl), false);
  assert.equal(evidence.includes(username), false);
  assert.equal(evidence.includes(password), false);
  assert.equal(evidence.includes("postgres://"), false);
  await reconstructedStorage.close();

  const wrong = new URL(connectionString);
  wrong.password = "task112-wrong-password";
  await assert.rejects(() => PostgresDeploymentRecordStorage.open(wrong.toString(), "task112_bad_auth"), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.match(error.message, /^DEPLOY_POSTGRES_AUTH_FAILED:/);
    assert.equal(error.message.includes(username), false);
    assert.equal(error.message.includes(password), false);
    assert.equal(error.message.includes(wrong.password), false);
    assert.equal(error.message.includes(wrong.toString()), false);
    return true;
  });
});
