import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentRegistry, type DeploymentRecord } from "../../packages/deploy/index.js";
import { executeDeployPostgresTransaction, PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const authenticatedPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;

function record(seed: string, environmentRef: string, status: "succeeded" | "failed", release = "app@1.0.0"): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: `sha256:${seed.repeat(64).slice(0, 64)}`,
    publishedReleaseRef: release,
    environmentRef,
    releaseHash: `sha256:${"a".repeat(64)}`,
    startedAt: "2026-08-17T18:00:00Z",
    completedAt: "2026-08-17T18:00:01Z",
    status,
    healthChecks: Object.freeze([Object.freeze({ name: "runtime-health", status: status === "succeeded" ? "PASS" as const : "FAIL" as const })]),
  });
}

test("postgres deployment state survives provider reconstruction with active successful version", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const firstStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task102");
  const firstRegistry = new DeploymentRegistry(firstStorage);
  const succeeded = firstRegistry.record(record("1", "env:task102", "succeeded"));
  const failed = firstRegistry.record(record("2", "env:task102", "failed", "app@1.0.1"));
  await firstStorage.flush();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task102");
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.get(succeeded.deploymentId), succeeded);
  assert.deepEqual(reconstructedRegistry.get(failed.deploymentId), failed);
  assert.deepEqual(reconstructedRegistry.getActive("env:task102"), succeeded);
  assert.deepEqual(reconstructedRegistry.list().map((item) => item.deploymentId), [succeeded.deploymentId, failed.deploymentId]);
  assert.equal(Object.isFrozen(reconstructedRegistry.get(succeeded.deploymentId)), true);

  const next = reconstructedRegistry.record(record("3", "env:task102", "succeeded", "app@1.0.2"));
  await reconstructedStorage.flush();
  const finalStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task102");
  const finalRegistry = new DeploymentRegistry(finalStorage);
  assert.deepEqual(finalRegistry.getActive("env:task102"), next);
  const evidence = JSON.stringify({ history: finalRegistry.list(), active: finalRegistry.getActive("env:task102") });
  assert.equal(evidence.includes(postgresUrl), false);
  assert.equal(evidence.includes("postgres://"), false);

  await finalStorage.close();
  await reconstructedStorage.close();
  await firstStorage.close();
});

test("postgres deployment provider accepts authenticated SCRAM service with TLS prefer fallback", { skip: authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const url = new URL(authenticatedPostgresUrl);
  url.searchParams.set("sslmode", "prefer");
  const storage = await PostgresDeploymentRecordStorage.open(url.toString(), "task110_auth");
  await storage.close();
});

test("postgres deployment provider rejects invalid authenticated credentials without leaking material", { skip: authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const url = new URL(authenticatedPostgresUrl);
  const originalPassword = decodeURIComponent(url.password);
  const originalUser = decodeURIComponent(url.username);
  url.password = "definitely-wrong-password";
  await assert.rejects(() => PostgresDeploymentRecordStorage.open(url.toString(), "task110_bad_auth"), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.match(error.message, /^DEPLOY_POSTGRES_AUTH_FAILED:/);
    assert.equal(error.message.includes(originalPassword), false);
    assert.equal(error.message.includes(originalUser), false);
    assert.equal(error.message.includes(url.toString()), false);
    return true;
  });
});

test("postgres deployment provider rejects required TLS when server does not offer it", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const url = new URL(postgresUrl);
  url.searchParams.set("sslmode", "require");
  await assert.rejects(() => PostgresDeploymentRecordStorage.open(url.toString(), "task110_tls_required"), /DEPLOY_POSTGRES_TLS_REQUIRED/);
});

test("postgres deployment provider rejects unsupported sslmode deterministically", async () => {
  await assert.rejects(
    () => PostgresDeploymentRecordStorage.open("postgres://user@127.0.0.1:5432/db?sslmode=verify-full", "task110_sslmode"),
    /DEPLOY_POSTGRES_SSLMODE_INVALID/,
  );
});

test("deploy postgres transaction commits atomically and rolls back on statement failure", { skip: authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const table = "system_builder_deploy_task111_tx";
  await executeDeployPostgresTransaction(authenticatedPostgresUrl, [
    `DROP TABLE IF EXISTS ${table}`,
    `CREATE TABLE ${table} (value TEXT PRIMARY KEY)`,
    `INSERT INTO ${table} (value) VALUES ('committed')`,
  ]);
  const committed = await executeDeployPostgresTransaction(authenticatedPostgresUrl, [`SELECT value FROM ${table} ORDER BY value`]);
  assert.deepEqual(committed, [Object.freeze(["committed"])]);

  await assert.rejects(
    () => executeDeployPostgresTransaction(authenticatedPostgresUrl, [
      `INSERT INTO ${table} (value) VALUES ('rolled-back')`,
      "SELECT * FROM system_builder_deploy_task111_missing_table",
    ]),
    /DEPLOY_POSTGRES_QUERY_FAILED:42P01/,
  );

  const afterFailure = await executeDeployPostgresTransaction(authenticatedPostgresUrl, [`SELECT value FROM ${table} ORDER BY value`]);
  assert.deepEqual(afterFailure, [Object.freeze(["committed"])]);
  await executeDeployPostgresTransaction(authenticatedPostgresUrl, [`DROP TABLE IF EXISTS ${table}`]);
});

test("deploy postgres transaction rejects an empty batch before connection", async () => {
  await assert.rejects(() => executeDeployPostgresTransaction("postgres://user@127.0.0.1:5432/db", []), /DEPLOY_POSTGRES_TRANSACTION_INVALID/);
});

test("postgres deployment provider rejects invalid connection diagnostics without leaking credentials", async () => {
  const connectionString = "postgres://secret-user:super-secret@127.0.0.1:0/system_builder";
  await assert.rejects(() => PostgresDeploymentRecordStorage.open(connectionString, "task102_invalid"), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.equal(error.message, "DEPLOY_POSTGRES_URL_INVALID");
    assert.equal(error.message.includes("secret-user"), false);
    assert.equal(error.message.includes("super-secret"), false);
    assert.equal(error.message.includes(connectionString), false);
    return true;
  });
});

test("postgres atomic activation enforces expected active authority and reconstructs the winner", { skip: authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const scope = "task114_cas";
  const environmentRef = "env:task114";
  const firstStorage = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const secondStorage = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const firstRegistry = new DeploymentRegistry(firstStorage);
  const secondRegistry = new DeploymentRegistry(secondStorage);

  const activeA = record("4", environmentRef, "succeeded", "app@4.0.0");
  const candidateB = record("5", environmentRef, "succeeded", "app@5.0.0");
  const staleC = record("6", environmentRef, "succeeded", "app@6.0.0");
  const failedD = record("7", environmentRef, "failed", "app@7.0.0");

  const first = await firstRegistry.activateCandidateAtomically(activeA, null);
  assert.equal(first.outcome, "activated");
  assert.equal(first.resultingActiveDeploymentId, activeA.deploymentId);

  const promoted = await secondRegistry.activateCandidateAtomically(candidateB, activeA.deploymentId);
  assert.equal(promoted.outcome, "activated");
  assert.equal(promoted.previousActiveDeploymentId, activeA.deploymentId);
  assert.equal(promoted.resultingActiveDeploymentId, candidateB.deploymentId);

  const stale = await firstRegistry.activateCandidateAtomically(staleC, activeA.deploymentId);
  assert.equal(stale.outcome, "stale-active");
  assert.equal(stale.previousActiveDeploymentId, candidateB.deploymentId);
  assert.equal(stale.resultingActiveDeploymentId, candidateB.deploymentId);
  assert.deepEqual(firstRegistry.getActive(environmentRef), candidateB);

  const retained = await firstRegistry.activateCandidateAtomically(failedD, candidateB.deploymentId);
  assert.equal(retained.outcome, "retained-active");
  assert.equal(retained.resultingActiveDeploymentId, candidateB.deploymentId);

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.getActive(environmentRef), candidateB);
  assert.deepEqual(
    reconstructedRegistry.list().map((item) => item.deploymentId),
    [activeA, candidateB, staleC, failedD].map((item) => item.deploymentId).sort(),
  );

  await reconstructedStorage.close();
  await secondStorage.close();
  await firstStorage.close();
});
