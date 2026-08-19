import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  correlateOperation,
  enrichObservation,
  publishEnriched,
  type EnrichedDeploymentObservation,
  type PublishResult,
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
    acceptanceChecks: [
      { name: "health", pass: true },
      { name: "smoke", pass: true },
    ],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK145_DEPLOY_FAILED");
  return result.record;
}

function fullContext() {
  const record = produceRecord();
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
    record,
  };
}

test("real DeploymentRecord flows to an injected receiver as an enriched observation", async () => {
  const { record, ...ctx } = fullContext();
  const obs = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(ctx);
  const correlation = correlateOperation(op, {
    runtimeRef: ctx.runtimeRef,
    processRef: ctx.processRef,
    sessionRef: ctx.sessionRef,
  });
  const enriched = enrichObservation(obs, op) as EnrichedDeploymentObservation;

  const delivered: Array<EnrichedDeploymentObservation> = [];
  const result = await publishEnriched(obs, op, {
    deliver: (payload) => {
      if (payload.kind === "EnrichedDeploymentObservation") delivered.push(payload);
    },
  });

  assert.deepEqual(result, { ok: true, outcome: "delivered", observationId: obs.observationId });
  assert.equal(delivered.length, 1);
  const received = delivered[0];
  assert.ok(received, "TASK145_NO_ENRICHED_PAYLOAD");

  assert.equal(received.observationId, obs.observationId);
  assert.equal(received.enrichedId, enriched.enrichedId);
  assert.equal(received.deploymentId, record.deploymentId);
  assert.equal(received.publishedReleaseRef, record.publishedReleaseRef);
  assert.equal(received.environmentRef, record.environmentRef);
  assert.equal(received.releaseHash, record.releaseHash);
  assert.equal(received.status, record.status);
  assert.deepEqual(received.healthChecks, record.healthChecks);
  assert.equal(correlateOperation(received.operation, {
    runtimeRef: ctx.runtimeRef,
    processRef: ctx.processRef,
    sessionRef: ctx.sessionRef,
  }).correlationId, correlation.correlationId);
});

test("enriched observation carries the operational context (executor/source/mode) deterministically", async () => {
  const { record, ...ctx } = fullContext();
  const obs = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(ctx);
  const enriched = enrichObservation(obs, op) as EnrichedDeploymentObservation;

  assert.equal(enriched.operation.executorRef, ctx.executorRef);
  assert.equal(enriched.operation.source, ctx.source);
  assert.equal(enriched.operation.mode, ctx.mode);
  assert.equal(enriched.operation.sourceRef, ctx.sourceRef);
  assert.equal(enriched.operation.triggeredAt, ctx.triggeredAt);
  assert.equal(enriched.operation.runtimeRef, ctx.runtimeRef);
  assert.equal(enriched.operation.processRef, ctx.processRef);
  assert.equal(enriched.operation.sessionRef, ctx.sessionRef);
  assert.match(enriched.operation.operationId, /^sha256:[a-f0-9]{64}$/);
});

test("deterministic identity is stable for equal inputs", async () => {
  const { record, ...ctx } = fullContext();
  const obsA = DeploymentObservation.fromDeploymentRecord(record);
  const opA = DeploymentOperationMetadata.fromExecutionContext(ctx);
  const obsB = DeploymentObservation.fromDeploymentRecord(produceRecord());
  const opB = DeploymentOperationMetadata.fromExecutionContext(fullContext());

  const left = enrichObservation(obsA, opA) as EnrichedDeploymentObservation;
  const right = enrichObservation(obsB, opB) as EnrichedDeploymentObservation;

  assert.equal(left.enrichedId, right.enrichedId);
  assert.equal(left.operation.operationId, right.operation.operationId);
});

test("positive path never carries a resolved secret/credential/CA value", async () => {
  const { record, ...ctx } = fullContext();
  const obs = DeploymentObservation.fromDeploymentRecord(record);
  const op = DeploymentOperationMetadata.fromExecutionContext(ctx);
  const delivered: string[] = [];
  const result: PublishResult = await publishEnriched(obs, op, {
    deliver: (payload) => void delivered.push(JSON.stringify(payload)),
  });

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK145_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "delivered");
  const serialized = delivered[0] ?? "";
  assert.equal(serialized.includes("secret://observe-database"), false);
  assert.equal(serialized.includes("BEGIN CERTIFICATE"), false);
  assert.equal(serialized.includes("Bearer "), false);
});

test("correlation binds release, environment and status into a stable correlationId", async () => {
  const { record, ...ctx } = fullContext();
  const op = DeploymentOperationMetadata.fromExecutionContext(ctx);
  const correlation = correlateOperation(op, { runtimeRef: ctx.runtimeRef });

  assert.equal(correlation.deploymentId, record.deploymentId);
  assert.equal(correlation.publishedReleaseRef, record.publishedReleaseRef);
  assert.equal(correlation.environmentRef, record.environmentRef);
  assert.equal(correlation.releaseHash, record.releaseHash);
  assert.equal(correlation.runtimeRef, ctx.runtimeRef);
  assert.match(correlation.correlationId, /^sha256:[a-f0-9]{64}$/);
});