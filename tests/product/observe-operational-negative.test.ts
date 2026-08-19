import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  publish,
  publishEnriched,
} from "../../packages/observe/index.js";
import { dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const SECRET = "password=hunter2";

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
  if (!result.ok) throw new Error("TASK146_DEPLOY_FAILED");
  return result.record;
}

function observation() {
  return DeploymentObservation.fromDeploymentRecord(produceRecord());
}

function baseOperation() {
  const record = produceRecord();
  return DeploymentOperationMetadata.fromExecutionContext({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    deploymentId: record.deploymentId,
    publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef,
    releaseHash: record.releaseHash,
  });
}

test("malformed operational metadata is rejected deterministically", () => {
  const valid = baseOperation();

  assert.throws(() => DeploymentOperationMetadata.validate({ ...valid, executorRef: "  " }), /MALFORMED:executorRef/);
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...valid, source: "unknown-source" }),
    /UNSUPPORTED_SOURCE/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...valid, mode: "explode" }),
    /UNSUPPORTED_MODE/,
  );
});

test("unknown and conflicting fields are rejected deterministically", () => {
  const valid = baseOperation();

  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...valid, unexpected: "x" }),
    /OBSERVE_INVALID_OPERATION_METADATA:UNKNOWN_FIELD:unexpected/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...valid, operationId: "sha256:deadbeef" }),
    /OBSERVE_INVALID_OPERATION_METADATA:OPERATION_ID/,
  );
  assert.throws(() => DeploymentOperationMetadata.validate(null), /OBSERVE_INVALID_OPERATION_METADATA:NOT_OBJECT/);
  assert.throws(() => DeploymentOperationMetadata.validate("nope"), /OBSERVE_INVALID_OPERATION_METADATA:NOT_OBJECT/);
});

test("a resolved secret/CA value in metadata is rejected and never echoed", () => {
  const valid = baseOperation();
  const leaky = { ...valid, executorRef: SECRET };

  assert.throws(
    () => DeploymentOperationMetadata.validate(leaky),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/);
      assert.equal(message.includes(SECRET), false);
      return true;
    },
  );
});

test("enrichment with invalid metadata fails safe and never corrupts the payload", () => {
  const obs = observation();
  const leaky = { ...baseOperation(), executorRef: SECRET };

  assert.throws(
    () => enrichObservation(obs, leaky as never),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.equal(message.includes(SECRET), false);
      return true;
    },
  );
});

test("publication not-configured is deterministic and Deploy/Runtime unchanged", async () => {
  const obs = observation();
  const op = baseOperation();

  const plain = await publish(obs);
  assert.deepEqual(plain, { ok: true, outcome: "not-configured", observationId: null });

  const enriched = await publishEnriched(obs, op);
  assert.deepEqual(enriched, { ok: true, outcome: "not-configured", observationId: null });
});

test("publication channel-failed (async and sync throw) never propagates", async () => {
  const obs = observation();
  const op = baseOperation();

  const asyncThrow = await publishEnriched(obs, op, {
    deliver: async () => {
      throw new Error("async down");
    },
  });
  assert.equal(asyncThrow.ok, false);
  if (asyncThrow.ok) throw new Error("TASK146_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(asyncThrow.outcome, "channel-failed");
  assert.equal(asyncThrow.diagnostic.code, "OBSERVE_CHANNEL_FAILED");
  assert.equal(JSON.stringify(asyncThrow).includes("async down"), false);

  const syncThrow = await publishEnriched(obs, op, {
    deliver: () => {
      throw new Error("sync down");
    },
  });
  assert.equal(syncThrow.ok, false);
  if (syncThrow.ok) throw new Error("TASK146_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(syncThrow.outcome, "channel-failed");
  assert.equal(syncThrow.diagnostic.code, "OBSERVE_CHANNEL_FAILED");
  assert.equal(JSON.stringify(syncThrow).includes("sync down"), false);
});

test("metadata-production failure fails open and never echoes the value", async () => {
  const obs = observation();
  const leaky = { ...baseOperation(), executorRef: SECRET };

  const result = await publishEnriched(obs, leaky);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK146_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "metadata-failed");
  assert.equal(result.diagnostic.code, "OBSERVE_METADATA_FAILED");
  assert.equal(JSON.stringify(result).includes(SECRET), false);
  assert.equal(JSON.stringify(result).includes("secret://observe-database"), false);
});

test("diagnostics are stable, deterministic and reference-free", async () => {
  const obs = observation();
  const leaky = { ...baseOperation(), executorRef: SECRET };

  const a = await publishEnriched(obs, leaky);
  const b = await publishEnriched(obs, leaky);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});