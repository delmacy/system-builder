import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  publishEnriched,
  type EnrichedDeploymentObservation,
  type EnrichedPublishObserver,
} from "../../packages/observe/index.js";
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
  if (!result.ok) throw new Error("TASK147_DEPLOY_FAILED");
  return registry.record(result.record);
}

function operationalContext(record: DeploymentRecord) {
  return {
    executorRef: "user://maintainer",
    source: "manual" as const,
    mode: "execute" as const,
    sourceRef: "cli:sb-deploy",
    triggeredAt: "2026-08-19T10:00:00Z",
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
    deploymentId: record.deploymentId,
    publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef,
    releaseHash: record.releaseHash,
  };
}

test("durable DeploymentRecord -> enriched observation -> Observe receiver end to end", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.0", "succeeded");
  assert.equal(registry.get(record.deploymentId), record);

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(operationalContext(record));
  const enriched = enrichObservation(observation, op) as EnrichedDeploymentObservation;

  const received: Array<EnrichedDeploymentObservation> = [];
  const observer: EnrichedPublishObserver = {
    deliver: (payload) => {
      if (payload.kind === "EnrichedDeploymentObservation") received.push(payload);
    },
  };
  const result = await publishEnriched(observation, op, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK147_PUBLISH_FAILED");
  assert.equal(result.outcome, "delivered");
  assert.equal(result.observationId, observation.observationId);
  assert.equal(received.length, 1);
  const delivered = received[0];
  assert.ok(delivered, "TASK147_NO_ENRICHED_PAYLOAD");
  assert.equal(delivered.enrichedId, enriched.enrichedId);
  assert.equal(delivered.observationId, observation.observationId);
  assert.equal(delivered.operation.operationId, op.operationId);
});

test("observation is linkable to release/environment/runtime context with operational metadata", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.1", "failed");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(operationalContext(record));
  const enriched = enrichObservation(observation, op) as EnrichedDeploymentObservation;

  assert.equal(enriched.deploymentId, record.deploymentId);
  assert.equal(enriched.publishedReleaseRef, record.publishedReleaseRef);
  assert.equal(enriched.environmentRef, record.environmentRef);
  assert.equal(enriched.releaseHash, record.releaseHash);
  assert.equal(enriched.status, record.status);
  assert.deepEqual(enriched.healthChecks, record.healthChecks);
  assert.equal(enriched.operation.executorRef, "user://maintainer");
  assert.equal(enriched.operation.source, "manual");
  assert.equal(enriched.operation.mode, "execute");
  assert.equal(enriched.operation.runtimeRef, "runtime://managed-a");
  assert.equal(enriched.operation.processRef, "process://a-1");
  assert.equal(enriched.operation.sessionRef, "session://s1");

  const serialized = JSON.stringify(enriched);
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("secret://e2e-database"), false);
  assert.equal(serialized.includes("BEGIN CERTIFICATE"), false);
});

test("Runtime autonomy with Observe not configured (fail-open, Deploy unchanged)", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.2", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(operationalContext(record));

  const result = await publishEnriched(observation, op);
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
  assert.equal(registry.getActive("env:observe-e2e")?.deploymentId, followup.deploymentId);
});

test("Runtime autonomy when the Observe channel is unavailable (fail-open, no propagation)", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.4", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(operationalContext(record));

  const unavailable: EnrichedPublishObserver = {
    deliver: async () => {
      throw new Error("observe unavailable");
    },
  };
  const result = await publishEnriched(observation, op, unavailable);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK147_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");
  assert.equal(result.diagnostic.code, "OBSERVE_CHANNEL_FAILED");
  assert.equal(result.diagnostic.detail.includes("postgres://"), false);

  const runtime = bootstrapAutonomousRuntime({
    runtimeVersion: "runtime-1",
    environment,
    requirements: Object.freeze([{ name: "DATABASE_URL", kind: "secret-reference", required: true }]),
  });
  assert.equal(runtime.ok, true);
  if (!runtime.ok) throw new Error("TASK147_RUNTIME_DOWN");
  assert.equal(runtime.health.status, "UP");
});

test("operational metadata production failure fails open and never breaks the deployment record chain", async () => {
  const registry = new DeploymentRegistry();
  const record = deploy(registry, "1.0.5", "failed");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const leaky = { ...DeploymentOperationMetadata.fromExecutionContext(operationalContext(record)), executorRef: "password=hunter2" };

  const result = await publishEnriched(observation, leaky as never);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK147_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "metadata-failed");
  assert.equal(result.diagnostic.code, "OBSERVE_METADATA_FAILED");
  assert.equal(JSON.stringify(result).includes("hunter2"), false);
  assert.equal(registry.get(record.deploymentId), record);
  assert.equal(registry.getActive("env:observe-e2e"), undefined);
});