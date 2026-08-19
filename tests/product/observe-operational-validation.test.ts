import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentOperationMetadata } from "../../packages/observe/index.js";
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
  if (!result.ok) throw new Error("TASK139_DEPLOY_FAILED");
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

test("DeploymentOperationMetadata.validate accepts a valid derived metadata document", () => {
  const metadata = fromContext();
  const validated = DeploymentOperationMetadata.validate(metadata);

  assert.equal(validated.kind, "DeploymentOperationMetadata");
  assert.equal(validated.operationId, metadata.operationId);
  assert.equal(validated.executorRef, "user://maintainer");
  assert.equal(validated.runtimeRef, "runtime://managed-a");
});

test("DeploymentOperationMetadata.validate rejects an unknown field deterministically", () => {
  const metadata = fromContext();
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...metadata, rogue: "value" }),
    /OBSERVE_INVALID_OPERATION_METADATA:UNKNOWN_FIELD:rogue/,
  );
});

test("DeploymentOperationMetadata.validate rejects a wrong kind deterministically", () => {
  const metadata = fromContext();
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...metadata, kind: "OtherObservation" }),
    /OBSERVE_INVALID_OPERATION_METADATA:KIND/,
  );
});

test("DeploymentOperationMetadata.validate rejects a tampered identity deterministically", () => {
  const metadata = fromContext();
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...metadata, operationId: "sha256:" + "0".repeat(64) }),
    /OBSERVE_INVALID_OPERATION_METADATA:OPERATION_ID/,
  );
});

test("DeploymentOperationMetadata.validate rejects unsupported enum values deterministically", () => {
  const metadata = fromContext();
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...metadata, source: "cron" }),
    /OBSERVE_INVALID_OPERATION_METADATA:UNSUPPORTED_SOURCE/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.validate({ ...metadata, mode: "plan" }),
    /OBSERVE_INVALID_OPERATION_METADATA:UNSUPPORTED_MODE/,
  );
});

test("DeploymentOperationMetadata.validate rejects a resolved secret value without echoing it", () => {
  const metadata = fromContext();
  const secret = "password=hunter2";
  try {
    DeploymentOperationMetadata.validate({ ...metadata, executorRef: secret });
    assert.fail("expected validation to reject a resolved secret value");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    assert.match(message, /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/);
    assert.equal(message.includes(secret), false);
  }
});

test("DeploymentOperationMetadata.validate accepts a create-only metadata without deployment correlation", () => {
  const metadata = DeploymentOperationMetadata.create({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
  });
  const validated = DeploymentOperationMetadata.validate(metadata);

  assert.equal(validated.operationId, metadata.operationId);
  assert.equal(validated.deploymentId, undefined);
});