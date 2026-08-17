import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const artifactHash = `sha256:${"6".repeat(64)}`;
const artifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash,
  manifest: Object.freeze({ runtimeVersion: "runtime-1" }),
  environmentSchema: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
    Object.freeze({ name: "PORT", kind: "config" as const, required: true }),
  ]),
});
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:task103",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://task103/database" }),
    Object.freeze({ name: "PORT", kind: "config" as const, reference: "config://PORT" }),
  ]),
});

function release(version: string) {
  return Object.freeze({
    kind: "PublishedRelease" as const,
    releaseId: "durable-deploy-task103",
    version,
    artifactRef: artifactHash,
    artifactHash,
    validationEvidenceRef: `sha256:${"7".repeat(64)}`,
    publishedAt: "2026-08-17T18:30:00Z",
    status: "published" as const,
  });
}

test("actual Deploy output reconstructs durable history and active release without leaking provider material", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const successfulDeploy = dryRunDeploy({
    publishedRelease: release("1.0.0"),
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "runtime-health", pass: true }],
    startedAt: "2026-08-17T18:30:01Z",
    completedAt: "2026-08-17T18:30:02Z",
  });
  assert.equal(successfulDeploy.ok, true);
  if (!successfulDeploy.ok) return;

  const firstStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task103");
  const firstRegistry = new DeploymentRegistry(firstStorage);
  firstRegistry.record(successfulDeploy.record);
  await firstStorage.flush();
  await firstStorage.close();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task103");
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.get(successfulDeploy.record.deploymentId), successfulDeploy.record);
  assert.deepEqual(reconstructedRegistry.getActive(environment.environmentRef), successfulDeploy.record);
  assert.equal(reconstructedRegistry.getActive(environment.environmentRef)?.publishedReleaseRef, "durable-deploy-task103@1.0.0");

  const failedDeploy = dryRunDeploy({
    publishedRelease: release("1.0.1"),
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "runtime-health", pass: false }],
    startedAt: "2026-08-17T18:31:01Z",
    completedAt: "2026-08-17T18:31:02Z",
  });
  assert.equal(failedDeploy.ok, true);
  if (!failedDeploy.ok) return;
  reconstructedRegistry.record(failedDeploy.record);
  await reconstructedStorage.flush();
  await reconstructedStorage.close();

  const finalStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, "task103");
  const finalRegistry = new DeploymentRegistry(finalStorage);
  assert.deepEqual(finalRegistry.getActive(environment.environmentRef), successfulDeploy.record);
  assert.deepEqual(finalRegistry.list().map((item) => item.deploymentId), [...finalRegistry.list().map((item) => item.deploymentId)].sort());
  assert.equal(finalRegistry.list().some((item) => item.deploymentId === failedDeploy.record.deploymentId && item.status === "failed"), true);

  const evidence = JSON.stringify({ history: finalRegistry.list(), active: finalRegistry.getActive(environment.environmentRef) });
  assert.equal(evidence.includes(postgresUrl), false);
  assert.equal(evidence.includes("postgres://"), false);
  assert.equal(evidence.includes("super-secret"), false);
  assert.equal(evidence.includes('"value"'), false);
  await finalStorage.close();
});
