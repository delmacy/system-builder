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
  if (!result.ok) throw new Error("TASK140_DEPLOY_FAILED");
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

test("DeploymentOperationMetadata JSON round-trip is lossless and preserves identity", () => {
  const metadata = fromContext();
  const serialized = DeploymentOperationMetadata.toJson(metadata);
  const restored = DeploymentOperationMetadata.fromJson(serialized);

  assert.deepEqual(restored, metadata);
  assert.equal(restored.operationId, metadata.operationId);
});

test("DeploymentOperationMetadata serialization is deterministic (stable order)", () => {
  const metadata = fromContext();
  const first = DeploymentOperationMetadata.toJson(metadata);
  const second = DeploymentOperationMetadata.toJson(metadata);

  assert.equal(first, second);
});

test("DeploymentOperationMetadata round-trip preserves every correlation field", () => {
  const metadata = fromContext();
  const restored = DeploymentOperationMetadata.fromJson(DeploymentOperationMetadata.toJson(metadata));

  assert.equal(restored.executorRef, metadata.executorRef);
  assert.equal(restored.source, metadata.source);
  assert.equal(restored.mode, metadata.mode);
  assert.equal(restored.sourceRef, metadata.sourceRef);
  assert.equal(restored.runtimeRef, metadata.runtimeRef);
  assert.equal(restored.processRef, metadata.processRef);
  assert.equal(restored.sessionRef, metadata.sessionRef);
  assert.equal(restored.deploymentId, metadata.deploymentId);
  assert.equal(restored.publishedReleaseRef, metadata.publishedReleaseRef);
  assert.equal(restored.environmentRef, metadata.environmentRef);
  assert.equal(restored.releaseHash, metadata.releaseHash);
});

test("DeploymentOperationMetadata fromJson rejects malformed JSON deterministically", () => {
  assert.throws(
    () => DeploymentOperationMetadata.fromJson("{not json"),
    /OBSERVE_INVALID_OPERATION_METADATA:JSON/,
  );
});

test("DeploymentOperationMetadata fromJson rejects a tampered operationId deterministically", () => {
  const metadata = fromContext();
  const tampered = DeploymentOperationMetadata.toJson({ ...metadata, mode: "dry-run" });

  assert.throws(
    () => DeploymentOperationMetadata.fromJson(tampered),
    /OBSERVE_INVALID_OPERATION_METADATA:OPERATION_ID/,
  );
});

test("DeploymentOperationMetadata fromJson rejects a tampered field with unchanged identity deterministically", () => {
  const metadata = fromContext();
  const parsed = JSON.parse(DeploymentOperationMetadata.toJson(metadata)) as Record<string, unknown>;
  parsed["executorRef"] = "user://other";
  const tampered = JSON.stringify(parsed);

  assert.throws(
    () => DeploymentOperationMetadata.fromJson(tampered),
    /OBSERVE_INVALID_OPERATION_METADATA:OPERATION_ID/,
  );
});

test("DeploymentOperationMetadata round-trip of a create-only metadata (no deployment correlation) is lossless", () => {
  const metadata = DeploymentOperationMetadata.create({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
  });
  const restored = DeploymentOperationMetadata.fromJson(DeploymentOperationMetadata.toJson(metadata));

  assert.deepEqual(restored, metadata);
  assert.equal(restored.operationId, metadata.operationId);
});