import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const artifactHash = `sha256:${"8".repeat(64)}`;
const artifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash,
  manifest: Object.freeze({ runtimeVersion: "runtime-1" }),
  environmentSchema: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
  ]),
});
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:task106-rollback",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://task106-database" }),
  ]),
});

function release(version: string) {
  return Object.freeze({
    kind: "PublishedRelease" as const,
    releaseId: "task106-app",
    version,
    artifactRef: artifactHash,
    artifactHash,
    validationEvidenceRef: `sha256:${"9".repeat(64)}`,
    publishedAt: "2026-08-17T19:35:00Z",
    status: "published" as const,
  });
}

function deployment(version: string, pass: boolean, startedAt: string, completedAt: string) {
  const result = dryRunDeploy({
    publishedRelease: release(version),
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "runtime-health", pass }, { name: "schema", pass: true }],
    startedAt,
    completedAt,
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error(`TASK106_DEPLOYMENT_EXPECTED:${version}`);
  return result.record;
}

test("postgres reconstruction preserves active A, failed B and deterministic retention evidence", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const recordA = deployment("1.0.0", true, "2026-08-17T19:35:01Z", "2026-08-17T19:35:02Z");
  const recordB = deployment("1.1.0", false, "2026-08-17T19:35:03Z", "2026-08-17T19:35:04Z");

  const firstStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task106_rollback");
  const firstRegistry = new DeploymentRegistry(firstStorage);
  const activationA = firstRegistry.activateCandidate(recordA);
  const retentionB = firstRegistry.activateCandidate(recordB);

  assert.equal(activationA.outcome, "activated");
  assert.equal(retentionB.outcome, "retained-active");
  assert.equal(retentionB.previousActiveDeploymentId, recordA.deploymentId);
  assert.equal(retentionB.resultingActiveDeploymentId, recordA.deploymentId);
  assert.equal(recordB.status, "failed");
  await firstStorage.flush();
  await firstStorage.close();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task106_rollback");
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);

  assert.deepEqual(reconstructedRegistry.getActive(environment.environmentRef), recordA);
  assert.deepEqual(reconstructedRegistry.get(recordA.deploymentId), recordA);
  assert.deepEqual(reconstructedRegistry.get(recordB.deploymentId), recordB);
  assert.equal(reconstructedRegistry.get(recordB.deploymentId)?.status, "failed");
  assert.deepEqual(
    reconstructedRegistry.list().map((record) => record.deploymentId),
    [recordA.deploymentId, recordB.deploymentId].sort(),
  );

  const reconstructedRetention = reconstructedRegistry.activateCandidate(recordB);
  assert.deepEqual(reconstructedRetention, retentionB);
  assert.deepEqual(reconstructedRegistry.getActive(environment.environmentRef), recordA);
  await reconstructedStorage.flush();

  const evidence = JSON.stringify({
    history: reconstructedRegistry.list(),
    active: reconstructedRegistry.getActive(environment.environmentRef),
    decision: reconstructedRetention,
  });
  assert.equal(evidence.includes(postgresUrl), false);
  assert.equal(evidence.includes("postgres://"), false);
  assert.equal(evidence.includes("system_builder@"), false);
  assert.equal(evidence.includes("inline-secret-value"), false);

  await reconstructedStorage.close();
});
