import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentObservation, publish, type PublishObserver } from "../../packages/observe/index.js";
import { DeploymentRegistry, dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";
import { bootstrapAutonomousRuntime } from "../../packages/runtime-core/index.js";

const artifactHash = `sha256:${"e".repeat(64)}`;
const release = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "observe-e2e-app",
  version: "1.0.0",
  artifactRef: artifactHash,
  artifactHash,
  validationEvidenceRef: `sha256:${"f".repeat(64)}`,
  publishedAt: "2026-08-19T10:00:00Z",
  status: "published" as const,
});
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
  environmentRef: "env:observe-e2e",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://e2e-database" }),
  ]),
});

function deploy(registry: DeploymentRegistry, version: string, status: "succeeded" | "failed"): DeploymentRecord {
  const result = dryRunDeploy({
    publishedRelease: { ...release, version },
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: status === "succeeded" ? [{ name: "health", pass: true }] : [{ name: "health", pass: false }],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK136_DEPLOY_FAILED");
  return registry.record(result.record);
}

test("durable DeploymentRecord -> DeploymentObservation -> Observe receiver end to end", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.0", "succeeded");

  assert.equal(registry.get(record.deploymentId), record);
  const observation = DeploymentObservation.fromDeploymentRecord(record);

  const received: unknown[] = [];
  const observer: PublishObserver = {
    deliver: (payload) => void received.push(payload),
  };
  const result = await publish(observation, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK136_PUBLISH_FAILED");
  assert.equal(result.outcome, "delivered");
  assert.equal(result.observationId, observation.observationId);
  assert.deepEqual(received, [observation]);
});

test("observation correlation matches source release/environment/status/health and carries no resolved secret", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.1", "failed");
  const observation = DeploymentObservation.fromDeploymentRecord(record);

  assert.equal(observation.deploymentId, record.deploymentId);
  assert.equal(observation.publishedReleaseRef, record.publishedReleaseRef);
  assert.equal(observation.environmentRef, record.environmentRef);
  assert.equal(observation.releaseHash, record.releaseHash);
  assert.equal(observation.status, record.status);
  assert.deepEqual(observation.healthChecks, record.healthChecks);

  const serialized = DeploymentObservation.toJson(observation);
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("secret://e2e-database"), false);
  assert.equal(serialized.includes("BEGIN CERTIFICATE"), false);
});

test("Runtime keeps operating with Observe not configured (fail-open, Deploy unchanged)", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.2", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);

  const result = await publish(observation);

  assert.deepEqual(result, Object.freeze({ ok: true, outcome: "not-configured", observationId: null } as const));

  const runtime = bootstrapAutonomousRuntime({
    runtimeVersion: "runtime-1",
    environment,
    requirements: Object.freeze([{ name: "DATABASE_URL", kind: "secret-reference", required: true }]),
  });
  assert.deepEqual(runtime, Object.freeze({
    ok: true,
    health: Object.freeze({
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion: "runtime-1",
      environmentRef: "env:observe-e2e",
      bindingNames: Object.freeze(["DATABASE_URL"]),
    }),
  }));

  const followup = deploy(registry, "1.0.3", "succeeded");
  assert.notEqual(followup.deploymentId, record.deploymentId);
  assert.equal(registry.get(followup.deploymentId), followup);
  assert.equal(registry.getActive("env:observe-e2e")?.deploymentId, followup.deploymentId);
});

test("Runtime keeps operating when the Observe channel is unavailable (fail-open, no propagation)", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.4", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);

  const unavailable: PublishObserver = {
    deliver: async () => {
      throw new Error("observe unavailable");
    },
  };
  const result = await publish(observation, unavailable);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK136_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");
  assert.equal(result.diagnostic.code, "OBSERVE_CHANNEL_FAILED");
  assert.equal(result.diagnostic.detail.includes("postgres://"), false);

  const runtime = bootstrapAutonomousRuntime({
    runtimeVersion: "runtime-1",
    environment,
    requirements: Object.freeze([{ name: "DATABASE_URL", kind: "secret-reference", required: true }]),
  });
  assert.equal(runtime.ok, true);
  if (!runtime.ok) throw new Error("TASK136_RUNTIME_DOWN");
  assert.equal(runtime.health.status, "UP");
});

test("publish never fails the deployment record chain even when the channel throws during a failed deployment", async () => {
  const registry = new DeploymentRegistry();
  const failedRecord = deploy(registry, "1.0.5", "failed");
  const observation = DeploymentObservation.fromDeploymentRecord(failedRecord);

  const throwing: PublishObserver = {
    deliver: () => {
      throw new Error("channel is down");
    },
  };
  const result = await publish(observation, throwing);

  assert.equal(result.ok, false);
  assert.equal(registry.get(failedRecord.deploymentId), failedRecord);
  assert.equal(registry.getActive("env:observe-e2e"), undefined);
});