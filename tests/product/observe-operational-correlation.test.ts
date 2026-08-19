import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { correlateOperation, DeploymentOperationMetadata } from "../../packages/observe/index.js";
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
  if (!result.ok) throw new Error("TASK141_DEPLOY_FAILED");
  return result.record;
}

function fromContext() {
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

test("DeploymentOperationCorrelation binds deployment and operational metadata deterministically", () => {
  const operation = fromContext();
  const correlation = correlateOperation(operation);

  assert.equal(correlation.kind, "DeploymentOperationCorrelation");
  assert.match(correlation.correlationId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(correlation.deploymentId, operation.deploymentId);
  assert.equal(correlation.publishedReleaseRef, operation.publishedReleaseRef);
  assert.equal(correlation.environmentRef, operation.environmentRef);
  assert.equal(correlation.releaseHash, operation.releaseHash);
  assert.equal(correlation.operationId, operation.operationId);
});

test("DeploymentOperationCorrelation carries provider-neutral runtime/process/session refs when provided", () => {
  const operation = fromContext();
  const correlation = correlateOperation(operation, {
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
  });

  assert.equal(correlation.runtimeRef, "runtime://managed-a");
  assert.equal(correlation.processRef, "process://a-1");
  assert.equal(correlation.sessionRef, "session://s1");
});

test("DeploymentOperationCorrelation is deterministic: equal inputs produce equal correlationId", () => {
  const operation = fromContext();
  const left = correlateOperation(operation, { runtimeRef: "runtime://managed-a" });
  const right = correlateOperation(operation, { runtimeRef: "runtime://managed-a" });

  assert.equal(left.correlationId, right.correlationId);
});

test("DeploymentOperationCorrelation identity is content-addressed: a runtime ref change changes the correlationId", () => {
  const operation = fromContext();
  const base = correlateOperation(operation, { runtimeRef: "runtime://managed-a" });
  const changed = correlateOperation(operation, { runtimeRef: "runtime://managed-b" });

  assert.notEqual(changed.correlationId, base.correlationId);
});

test("DeploymentOperationCorrelation is fail-safe when runtime/process/session refs are absent", () => {
  const operation = fromContext();
  const correlation = correlateOperation(operation);

  assert.equal(correlation.runtimeRef, undefined);
  assert.equal(correlation.processRef, undefined);
  assert.equal(correlation.sessionRef, undefined);
  assert.match(correlation.correlationId, /^sha256:[a-f0-9]{64}$/);
});

test("DeploymentOperationCorrelation rejects a resolved secret value in runtime refs deterministically", () => {
  const operation = fromContext();
  assert.throws(
    () => correlateOperation(operation, { runtimeRef: "password=hunter2" }),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:runtimeRef/,
  );
});

test("DeploymentOperationCorrelation rejects operation metadata without deployment correlation deterministically", () => {
  const operation = DeploymentOperationMetadata.create({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
  });
  assert.throws(
    () => correlateOperation(operation),
    /OBSERVE_INVALID_OPERATION_METADATA:CORRELATION_REQUIRES_DEPLOYMENT/,
  );
});