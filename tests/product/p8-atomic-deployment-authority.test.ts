import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentRegistry, type DeploymentRecord } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";

const authenticatedPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;

function record(seed: string, environmentRef: string, status: "succeeded" | "failed", release: string): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: `sha256:${seed.repeat(64).slice(0, 64)}`,
    publishedReleaseRef: release,
    environmentRef,
    releaseHash: `sha256:${seed.repeat(64).slice(0, 64)}`,
    startedAt: "2026-08-17T21:15:00Z",
    completedAt: "2026-08-17T21:15:01Z",
    status,
    healthChecks: Object.freeze([
      Object.freeze({ name: "atomic-authority", status: status === "succeeded" ? "PASS" as const : "FAIL" as const }),
    ]),
  });
}

test("two authenticated PostgreSQL writers admit one authority transition and reject the stale contender", { skip: authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const scope = "task115_multi_writer";
  const environmentRef = "env:p8-multi-writer";
  const activeA = record("a", environmentRef, "succeeded", "p8@A");
  const candidateB = record("b", environmentRef, "succeeded", "p8@B");
  const candidateC = record("c", environmentRef, "succeeded", "p8@C");
  const failedD = record("d", environmentRef, "failed", "p8@D");

  const bootstrapStorage = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const bootstrapRegistry = new DeploymentRegistry(bootstrapStorage);
  const initial = await bootstrapRegistry.activateCandidateAtomically(activeA, null);
  assert.equal(initial.outcome, "activated");
  assert.equal(initial.resultingActiveDeploymentId, activeA.deploymentId);
  await bootstrapStorage.close();

  const storageB = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const storageC = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const registryB = new DeploymentRegistry(storageB);
  const registryC = new DeploymentRegistry(storageC);
  assert.deepEqual(registryB.getActive(environmentRef), activeA);
  assert.deepEqual(registryC.getActive(environmentRef), activeA);

  const [decisionB, decisionC] = await Promise.all([
    registryB.activateCandidateAtomically(candidateB, activeA.deploymentId),
    registryC.activateCandidateAtomically(candidateC, activeA.deploymentId),
  ]);
  assert.deepEqual([decisionB.outcome, decisionC.outcome].sort(), ["activated", "stale-active"]);

  const winnerDecision = decisionB.outcome === "activated" ? decisionB : decisionC;
  const staleDecision = decisionB.outcome === "stale-active" ? decisionB : decisionC;
  const winner = winnerDecision.candidateDeploymentId === candidateB.deploymentId ? candidateB : candidateC;
  assert.equal(winnerDecision.previousActiveDeploymentId, activeA.deploymentId);
  assert.equal(winnerDecision.resultingActiveDeploymentId, winner.deploymentId);
  assert.equal(staleDecision.previousActiveDeploymentId, winner.deploymentId);
  assert.equal(staleDecision.resultingActiveDeploymentId, winner.deploymentId);
  assert.notEqual(staleDecision.candidateDeploymentId, winner.deploymentId);

  const retained = await registryB.activateCandidateAtomically(failedD, winner.deploymentId);
  assert.equal(retained.outcome, "retained-active");
  assert.equal(retained.resultingActiveDeploymentId, winner.deploymentId);

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(authenticatedPostgresUrl, scope);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.getActive(environmentRef), winner);
  assert.deepEqual(
    reconstructedRegistry.list().map((item) => item.deploymentId),
    [activeA, candidateB, candidateC, failedD].map((item) => item.deploymentId).sort(),
  );

  const evidence = JSON.stringify({
    decisions: [decisionB, decisionC, retained],
    history: reconstructedRegistry.list(),
    active: reconstructedRegistry.getActive(environmentRef),
  });
  const connection = new URL(authenticatedPostgresUrl);
  assert.equal(evidence.includes(authenticatedPostgresUrl), false);
  assert.equal(evidence.includes(decodeURIComponent(connection.username)), false);
  assert.equal(evidence.includes(decodeURIComponent(connection.password)), false);
  assert.equal(evidence.includes("postgres://"), false);

  await reconstructedStorage.close();
  await storageC.close();
  await storageB.close();
});
