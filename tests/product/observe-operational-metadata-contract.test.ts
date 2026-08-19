import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentOperationMetadata, type DeploymentOperationMetadataFields } from "../../packages/observe/index.js";

function fields(overrides: Partial<DeploymentOperationMetadataFields> = {}): DeploymentOperationMetadataFields {
  return {
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    sourceRef: "cli:sb-deploy",
    triggeredAt: "2026-08-19T10:00:00Z",
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
    ...overrides,
  };
}

test("DeploymentOperationMetadata contract carries executor, source and mode with a content-addressed operationId", () => {
  const metadata = DeploymentOperationMetadata.create(fields());

  assert.equal(metadata.kind, "DeploymentOperationMetadata");
  assert.match(metadata.operationId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(metadata.executorRef, "user://maintainer");
  assert.equal(metadata.source, "manual");
  assert.equal(metadata.mode, "execute");
  assert.equal(metadata.sourceRef, "cli:sb-deploy");
  assert.equal(metadata.runtimeRef, "runtime://managed-a");
  assert.equal(metadata.processRef, "process://a-1");
  assert.equal(metadata.sessionRef, "session://s1");
});

test("DeploymentOperationMetadata is deterministic: equal inputs produce equal operationId", () => {
  const left = DeploymentOperationMetadata.create(fields());
  const right = DeploymentOperationMetadata.create(fields());

  assert.equal(left.operationId, right.operationId);
  assert.deepEqual(left, right);
});

test("DeploymentOperationMetadata identity is content-addressed: a changed field changes the operationId", () => {
  const base = DeploymentOperationMetadata.create(fields());
  const changedSource = DeploymentOperationMetadata.create(fields({ source: "automation" }));
  const changedExecutor = DeploymentOperationMetadata.create(fields({ executorRef: "user://other" }));
  const changedMode = DeploymentOperationMetadata.create(fields({ mode: "dry-run" }));

  assert.notEqual(changedSource.operationId, base.operationId);
  assert.notEqual(changedExecutor.operationId, base.operationId);
  assert.notEqual(changedMode.operationId, base.operationId);
});

test("DeploymentOperationMetadata rejects a missing executor reference deterministically", () => {
  assert.throws(
    () => DeploymentOperationMetadata.create(fields({ executorRef: "" })),
    /OBSERVE_INVALID_OPERATION_METADATA:MALFORMED:executorRef/,
  );
});

test("DeploymentOperationMetadata rejects unsupported source and mode values deterministically", () => {
  assert.throws(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => DeploymentOperationMetadata.create(fields({ source: "unknown" as any })),
    /OBSERVE_INVALID_OPERATION_METADATA:UNSUPPORTED_SOURCE/,
  );
  assert.throws(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => DeploymentOperationMetadata.create(fields({ mode: "plan" as any })),
    /OBSERVE_INVALID_OPERATION_METADATA:UNSUPPORTED_MODE/,
  );
});

test("DeploymentOperationMetadata optional correlation refs are preserved when present and omitted when absent", () => {
  const complete = DeploymentOperationMetadata.create(fields());
  assert.equal(complete.runtimeRef, "runtime://managed-a");

  const minimal = DeploymentOperationMetadata.create({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
  });
  assert.equal(minimal.sourceRef, undefined);
  assert.equal(minimal.triggeredAt, undefined);
  assert.equal(minimal.runtimeRef, undefined);
  assert.equal(minimal.processRef, undefined);
  assert.equal(minimal.sessionRef, undefined);
  assert.match(minimal.operationId, /^sha256:[a-f0-9]{64}$/);
});