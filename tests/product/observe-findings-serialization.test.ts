import assert from "node:assert/strict";
import test from "node:test";
import {
  DeploymentFinding,
  type DeploymentFindingFields,
} from "../../packages/observe/index.js";

function fields(overrides: Partial<DeploymentFindingFields> = {}): DeploymentFindingFields {
  return {
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    message: "a health check did not pass for this deployment",
    observationId: `sha256:${"a".repeat(64)}`,
    deploymentId: "deploy:observe-a",
    publishedReleaseRef: "release:observe-app@1.0.0",
    environmentRef: "env:observe",
    releaseHash: `sha256:${"b".repeat(64)}`,
    operationId: `sha256:${"c".repeat(64)}`,
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
    ...overrides,
  };
}

test("DeploymentFinding JSON round-trip is lossless and preserves identity", () => {
  const finding = DeploymentFinding.create(fields());
  const serialized = DeploymentFinding.toJson(finding);
  const restored = DeploymentFinding.fromJson(serialized);

  assert.deepEqual(restored, finding);
  assert.equal(restored.findingId, finding.findingId);
});

test("DeploymentFinding serialization is deterministic (stable order)", () => {
  const finding = DeploymentFinding.create(fields());
  const first = DeploymentFinding.toJson(finding);
  const second = DeploymentFinding.toJson(finding);

  assert.equal(first, second);
});

test("DeploymentFinding round-trip preserves every correlation field", () => {
  const finding = DeploymentFinding.create(fields());
  const restored = DeploymentFinding.fromJson(DeploymentFinding.toJson(finding));

  assert.equal(restored.severity, finding.severity);
  assert.equal(restored.confidence, finding.confidence);
  assert.equal(restored.code, finding.code);
  assert.equal(restored.message, finding.message);
  assert.equal(restored.observationId, finding.observationId);
  assert.equal(restored.deploymentId, finding.deploymentId);
  assert.equal(restored.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(restored.environmentRef, finding.environmentRef);
  assert.equal(restored.releaseHash, finding.releaseHash);
  assert.equal(restored.operationId, finding.operationId);
  assert.equal(restored.runtimeRef, finding.runtimeRef);
  assert.equal(restored.processRef, finding.processRef);
  assert.equal(restored.sessionRef, finding.sessionRef);
});

test("DeploymentFinding round-trip of a create-only finding without optional operation refs is lossless", () => {
  const finding = DeploymentFinding.create({
    severity: "info",
    confidence: "low",
    code: "OBSERVE_FINDING:NO_OP",
    message: "no finding applies",
    observationId: `sha256:${"a".repeat(64)}`,
    deploymentId: "deploy:observe-a",
    publishedReleaseRef: "release:observe-app@1.0.0",
    environmentRef: "env:observe",
    releaseHash: `sha256:${"b".repeat(64)}`,
  });
  const restored = DeploymentFinding.fromJson(DeploymentFinding.toJson(finding));

  assert.deepEqual(restored, finding);
  assert.equal(restored.findingId, finding.findingId);
  assert.equal(restored.operationId, undefined);
  assert.equal(restored.sessionRef, undefined);
});

test("DeploymentFinding fromJson rejects malformed JSON deterministically", () => {
  assert.throws(
    () => DeploymentFinding.fromJson("{not json"),
    /OBSERVE_INVALID_FINDING:JSON/,
  );
});

test("DeploymentFinding fromJson rejects a tampered findingId deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  const tampered = DeploymentFinding.toJson({ ...finding, findingId: "sha256:" + "0".repeat(64) });

  assert.throws(
    () => DeploymentFinding.fromJson(tampered),
    /OBSERVE_INVALID_FINDING:FINDING_ID/,
  );
});

test("DeploymentFinding fromJson rejects a tampered field with unchanged identity deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  const parsed = JSON.parse(DeploymentFinding.toJson(finding)) as Record<string, unknown>;
  parsed["message"] = "changed message";
  const tampered = JSON.stringify(parsed);

  assert.throws(
    () => DeploymentFinding.fromJson(tampered),
    /OBSERVE_INVALID_FINDING:FINDING_ID/,
  );
});

test("DeploymentFinding fromJson rejects an unknown field deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  const parsed = JSON.parse(DeploymentFinding.toJson(finding)) as Record<string, unknown>;
  parsed["rogue"] = "value";
  const tampered = JSON.stringify(parsed);

  assert.throws(
    () => DeploymentFinding.fromJson(tampered),
    /OBSERVE_INVALID_FINDING:UNKNOWN_FIELD:rogue/,
  );
});

test("DeploymentFinding fromJson rejects a resolved secret value deterministically without echoing it", () => {
  const finding = DeploymentFinding.create(fields());
  const secret = "password=hunter2";
  const parsed = JSON.parse(DeploymentFinding.toJson(finding)) as Record<string, unknown>;
  parsed["message"] = secret;
  const tampered = JSON.stringify(parsed);

  try {
    DeploymentFinding.fromJson(tampered);
    assert.fail("expected fromJson to reject a resolved secret value");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    assert.match(message, /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:message/);
    assert.equal(message.includes(secret), false);
  }
});
