import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  publish,
  publishEnriched,
} from "../../packages/observe/index.js";
import { dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const release = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "observe-app",
  version: "1.0.0",
  artifactRef: artifactHash,
  artifactHash,
  validationEvidenceRef: `sha256:${"b".repeat(64)}`,
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
  environmentRef: "env:observe",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://observe-database" }),
  ]),
});

function produceRecord(): DeploymentRecord {
  const result = dryRunDeploy({
    publishedRelease: release,
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK143_DEPLOY_FAILED");
  return result.record;
}

function observation() {
  return DeploymentObservation.fromDeploymentRecord(produceRecord());
}

function operation() {
  const record = produceRecord();
  return DeploymentOperationMetadata.fromExecutionContext({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    sourceRef: "cli:sb-deploy",
    triggeredAt: "2026-08-19T10:00:00Z",
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
    deploymentId: record.deploymentId,
    publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef,
    releaseHash: record.releaseHash,
  });
}

test("publish returns not-configured when no observer is configured for enriched observations", async () => {
  const obs = observation();
  const result = await publishEnriched(obs, operation());

  assert.deepEqual(result, { ok: true, outcome: "not-configured", observationId: null });
});

test("publish delivers enriched observations deterministically when the channel succeeds", async () => {
  const obs = observation();
  const op = operation();
  const delivered: unknown[] = [];
  const result = await publishEnriched(obs, op, {
    deliver: (value) => {
      delivered.push(value);
    },
  });

  assert.deepEqual(result, { ok: true, outcome: "delivered", observationId: obs.observationId });
  assert.equal(delivered.length, 1);
  const payload = delivered[0] as { kind: string; operation: { operationId: string } };
  assert.equal(payload.kind, "EnrichedDeploymentObservation");
  assert.equal(payload.operation.operationId, op.operationId);
});

test("publish fails open with channel-failed when the channel throws, never propagating", async () => {
  const obs = observation();
  const op = operation();
  let reached = false;
  const result = await publishEnriched(obs, op, {
    deliver: () => {
      reached = true;
      throw new Error("channel down");
    },
  });

  assert.equal(reached, true);
  assert.deepEqual(result, {
    ok: false,
    outcome: "channel-failed",
    observationId: obs.observationId,
    diagnostic: { code: "OBSERVE_CHANNEL_FAILED", detail: "observe channel unavailable; deployment outcome unchanged" },
  });
});

test("publish fails open with metadata-failed when metadata production/validation fails", async () => {
  const obs = observation();
  const leaky = { ...operation(), executorRef: "password=hunter2" };
  const result = await publishEnriched(obs, leaky);

  assert.deepEqual(result, {
    ok: false,
    outcome: "metadata-failed",
    observationId: obs.observationId,
    diagnostic: { code: "OBSERVE_METADATA_FAILED", detail: "operational metadata unavailable; deployment outcome unchanged" },
  });
});

test("publish fails open with metadata-failed and never echoes the resolved value", async () => {
  const obs = observation();
  const leaky = { ...operation(), executorRef: "password=hunter2" };
  const result = await publishEnriched(obs, leaky);

  assert.equal(JSON.stringify(result).includes("hunter2"), false);
  assert.equal(JSON.stringify(result).includes("secret://observe-database"), false);
});

test("publish still fails open for plain observations (Sprint 1 invariant preserved)", async () => {
  const obs = observation();
  const notConfigured = await publish(obs);
  assert.deepEqual(notConfigured, { ok: true, outcome: "not-configured", observationId: null });

  const failed = await publish(obs, {
    deliver: () => {
      throw new Error("down");
    },
  });
  assert.equal(failed.ok, false);
  assert.equal(failed.outcome, "channel-failed");
  assert.equal(JSON.stringify(failed).includes("down"), false);
});