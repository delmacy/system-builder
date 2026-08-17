import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"6".repeat(64)}`;
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
  environmentRef: "env:rollback-evidence",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://rollback-database" }),
  ]),
});

function release(version: string) {
  return Object.freeze({
    kind: "PublishedRelease" as const,
    releaseId: "rollback-app",
    version,
    artifactRef: artifactHash,
    artifactHash,
    validationEvidenceRef: `sha256:${"7".repeat(64)}`,
    publishedAt: "2026-08-17T19:30:00Z",
    status: "published" as const,
  });
}

function buildEvidence(registry: DeploymentRegistry) {
  const deploymentA = dryRunDeploy({
    publishedRelease: release("1.0.0"),
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "runtime-health", pass: true }, { name: "schema", pass: true }],
    startedAt: "2026-08-17T19:30:01Z",
    completedAt: "2026-08-17T19:30:02Z",
  });
  assert.equal(deploymentA.ok, true);
  if (!deploymentA.ok) throw new Error("TASK105_DEPLOYMENT_A_EXPECTED");
  const activationA = registry.activateCandidate(deploymentA.record);

  const deploymentB = dryRunDeploy({
    publishedRelease: release("1.1.0"),
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "runtime-health", pass: false }, { name: "schema", pass: true }],
    startedAt: "2026-08-17T19:30:03Z",
    completedAt: "2026-08-17T19:30:04Z",
  });
  assert.equal(deploymentB.ok, true);
  if (!deploymentB.ok) throw new Error("TASK105_DEPLOYMENT_B_EXPECTED");
  const decisionB = registry.activateCandidate(deploymentB.record);

  return Object.freeze({ deploymentA, activationA, deploymentB, decisionB });
}

test("failed acceptance candidate retains last known good active deployment with deterministic evidence", () => {
  const firstRegistry = new DeploymentRegistry();
  const first = buildEvidence(firstRegistry);

  assert.equal(first.deploymentA.record.status, "succeeded");
  assert.equal(first.activationA.outcome, "activated");
  assert.equal(first.activationA.resultingActiveDeploymentId, first.deploymentA.record.deploymentId);

  assert.equal(first.deploymentB.record.status, "failed");
  assert.deepEqual(first.deploymentB.record.healthChecks, [
    { name: "runtime-health", status: "FAIL" },
    { name: "schema", status: "PASS" },
  ]);
  assert.equal(first.decisionB.outcome, "retained-active");
  assert.equal(first.decisionB.previousActiveDeploymentId, first.deploymentA.record.deploymentId);
  assert.equal(first.decisionB.resultingActiveDeploymentId, first.deploymentA.record.deploymentId);
  assert.deepEqual(firstRegistry.getActive(environment.environmentRef), first.deploymentA.record);
  assert.deepEqual(firstRegistry.get(first.deploymentB.record.deploymentId), first.deploymentB.record);
  assert.equal(Object.isFrozen(first.deploymentB.record), true);
  assert.equal(Object.isFrozen(first.deploymentB.record.healthChecks), true);
  assert.equal(Object.isFrozen(first.decisionB), true);

  const secondRegistry = new DeploymentRegistry();
  const second = buildEvidence(secondRegistry);
  assert.deepEqual(second.decisionB, first.decisionB);
  assert.deepEqual(secondRegistry.getActive(environment.environmentRef), first.deploymentA.record);

  const serialized = JSON.stringify({
    active: firstRegistry.getActive(environment.environmentRef),
    failed: firstRegistry.get(first.deploymentB.record.deploymentId),
    decision: first.decisionB,
  });
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("password"), false);
  assert.equal(serialized.includes("secret-value"), false);
});
