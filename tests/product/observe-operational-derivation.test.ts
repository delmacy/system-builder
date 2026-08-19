import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentOperationMetadata,
  type DeploymentExecutionContext,
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
  if (!result.ok) throw new Error("TASK138_DEPLOY_FAILED");
  return result.record;
}

function context(overrides: Partial<DeploymentExecutionContext> = {}): DeploymentExecutionContext {
  const record = produceRecord();
  return {
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
    ...overrides,
  };
}

test("DeploymentOperationMetadata.fromExecutionContext derives deterministically from equal execution contexts", () => {
  const left = DeploymentOperationMetadata.fromExecutionContext(context());
  const right = DeploymentOperationMetadata.fromExecutionContext(context());

  assert.equal(left.operationId, right.operationId);
  assert.deepEqual(left, right);
});

test("DeploymentOperationMetadata.fromExecutionContext correlates with the real DeploymentRecord", () => {
  const metadata = DeploymentOperationMetadata.fromExecutionContext(context());

  assert.equal(metadata.kind, "DeploymentOperationMetadata");
  assert.match(metadata.operationId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(metadata.executorRef, "user://maintainer");
  assert.equal(metadata.source, "manual");
  assert.equal(metadata.mode, "execute");
  assert.equal(metadata.runtimeRef, "runtime://managed-a");
  assert.equal(metadata.processRef, "process://a-1");
  assert.equal(metadata.sessionRef, "session://s1");
});

test("DeploymentOperationMetadata.fromExecutionContext identity changes when the deployment correlation changes", () => {
  const record = produceRecord();
  const base = DeploymentOperationMetadata.fromExecutionContext(context());
  const changedEnv = DeploymentOperationMetadata.fromExecutionContext(context({
    environmentRef: "env:other",
    deploymentId: record.deploymentId,
  }));

  assert.notEqual(changedEnv.operationId, base.operationId);
});

test("DeploymentOperationMetadata.fromExecutionContext identity changes when the executor/source changes", () => {
  const base = DeploymentOperationMetadata.fromExecutionContext(context());
  const changedExecutor = DeploymentOperationMetadata.fromExecutionContext(context({ executorRef: "user://other" }));
  const changedSource = DeploymentOperationMetadata.fromExecutionContext(context({ source: "automation" }));

  assert.notEqual(changedExecutor.operationId, base.operationId);
  assert.notEqual(changedSource.operationId, base.operationId);
});

test("DeploymentOperationMetadata.fromExecutionContext rejects a resolved secret value deterministically", () => {
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext(context({ executorRef: "password=supersecret" })),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/,
  );
});

test("DeploymentOperationMetadata.fromExecutionContext rejects a resolved CA/credential value deterministically", () => {
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext(context({ runtimeRef: "-----BEGIN CERTIFICATE-----" })),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:runtimeRef/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext(context({ sessionRef: "Bearer abcdef0123456789" })),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:sessionRef/,
  );
});

test("DeploymentOperationMetadata.fromExecutionContext rejects malformed correlation fields deterministically", () => {
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext(context({ deploymentId: "" })),
    /OBSERVE_INVALID_OPERATION_METADATA:MALFORMED:deploymentId/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext(context({ releaseHash: "" })),
    /OBSERVE_INVALID_OPERATION_METADATA:MALFORMED:releaseHash/,
  );
});