import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  type EnrichedDeploymentObservation,
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
  if (!result.ok) throw new Error("TASK142_DEPLOY_FAILED");
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

test("enrichObservation without metadata returns the original observation unchanged (identity preserved)", () => {
  const obs = observation();
  const result = enrichObservation(obs);
  const resultNull = enrichObservation(obs, null);

  assert.deepEqual(result, obs);
  assert.deepEqual(resultNull, obs);
  assert.equal(result.kind, "DeploymentObservation");
});

test("enrichObservation carries Sprint 1 correlation fields plus the operational metadata block", () => {
  const obs = observation();
  const op = operation();
  const enriched = enrichObservation(obs, op) as EnrichedDeploymentObservation;

  assert.equal(enriched.kind, "EnrichedDeploymentObservation");
  assert.match(enriched.enrichedId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(enriched.observationId, obs.observationId);
  assert.equal(enriched.deploymentId, obs.deploymentId);
  assert.equal(enriched.publishedReleaseRef, obs.publishedReleaseRef);
  assert.equal(enriched.environmentRef, obs.environmentRef);
  assert.equal(enriched.releaseHash, obs.releaseHash);
  assert.equal(enriched.startedAt, obs.startedAt);
  assert.equal(enriched.completedAt, obs.completedAt);
  assert.equal(enriched.status, obs.status);
  assert.deepEqual(enriched.healthChecks, obs.healthChecks);
  assert.equal(enriched.operation.operationId, op.operationId);
  assert.equal(enriched.operation.executorRef, op.executorRef);
});

test("enrichObservation identity is deterministic and content-addressed", () => {
  const obs = observation();
  const op = operation();
  const left = enrichObservation(obs, op) as EnrichedDeploymentObservation;
  const right = enrichObservation(obs, op) as EnrichedDeploymentObservation;
  const changed = enrichObservation(obs, DeploymentOperationMetadata.create({
    executorRef: "user://other",
    source: "manual",
    mode: "execute",
  })) as EnrichedDeploymentObservation;

  assert.equal(left.enrichedId, right.enrichedId);
  assert.notEqual(changed.enrichedId, left.enrichedId);
});

test("enrichObservation rejects a resolved secret value in the operational block deterministically", () => {
  const obs = observation();
  const leaky = { ...operation(), executorRef: "password=hunter2" };

  assert.throws(
    () => enrichObservation(obs, leaky as never),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/,
  );
});

test("enrichObservation preserves the no-leak invariant: no resolved value in the enriched payload", () => {
  const obs = observation();
  const op = operation();
  const enriched = enrichObservation(obs, op) as EnrichedDeploymentObservation;
  const serialized = JSON.stringify(enriched);

  assert.equal(serialized.includes("secret://observe-database"), false);
  assert.equal(serialized.includes("hunter2"), false);
});