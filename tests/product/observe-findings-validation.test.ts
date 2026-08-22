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

test("DeploymentFinding.validate accepts a valid canonical finding and preserves identity", () => {
  const finding = DeploymentFinding.create(fields());
  const validated = DeploymentFinding.validate(finding);

  assert.equal(validated.kind, "DeploymentFinding");
  assert.equal(validated.findingId, finding.findingId);
  assert.equal(validated.severity, "warning");
  assert.equal(validated.confidence, "medium");
  assert.equal(validated.observationId, `sha256:${"a".repeat(64)}`);
  assert.equal(validated.operationId, `sha256:${"c".repeat(64)}`);
  assert.equal(Object.isFrozen(validated), true);
});

test("DeploymentFinding.validate rejects a non-object value deterministically", () => {
  assert.throws(
    () => DeploymentFinding.validate(null),
    /OBSERVE_INVALID_FINDING:NOT_OBJECT/,
  );
  assert.throws(
    () => DeploymentFinding.validate("finding"),
    /OBSERVE_INVALID_FINDING:NOT_OBJECT/,
  );
  assert.throws(
    () => DeploymentFinding.validate([1, 2, 3]),
    /OBSERVE_INVALID_FINDING:NOT_OBJECT/,
  );
});

test("DeploymentFinding.validate rejects an unknown field deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, rogue: "value" }),
    /OBSERVE_INVALID_FINDING:UNKNOWN_FIELD:rogue/,
  );
});

test("DeploymentFinding.validate rejects a wrong kind deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, kind: "OtherObservation" }),
    /OBSERVE_INVALID_FINDING:KIND/,
  );
});

test("DeploymentFinding.validate rejects unsupported severity and confidence deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, severity: "fatal" }),
    /OBSERVE_INVALID_FINDING:UNSUPPORTED_SEVERITY/,
  );
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, confidence: "certain" }),
    /OBSERVE_INVALID_FINDING:UNSUPPORTED_CONFIDENCE/,
  );
});

test("DeploymentFinding.validate rejects missing correlation refs deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  const conflicting = { ...finding } as Record<string, unknown>;
  delete conflicting.deploymentId;
  assert.throws(
    () => DeploymentFinding.validate(conflicting),
    /OBSERVE_INVALID_FINDING:CONFLICTING_CORRELATION/,
  );

  const noCorrelation = { ...finding } as Record<string, unknown>;
  for (const key of ["observationId", "deploymentId", "publishedReleaseRef", "environmentRef", "releaseHash"]) {
    delete noCorrelation[key];
  }
  assert.throws(
    () => DeploymentFinding.validate(noCorrelation),
    /OBSERVE_INVALID_FINDING:MISSING_CORRELATION/,
  );
});

test("DeploymentFinding.validate rejects malformed required fields deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, code: "" }),
    /OBSERVE_INVALID_FINDING:MALFORMED:code/,
  );
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, message: " " }),
    /OBSERVE_INVALID_FINDING:MALFORMED:message/,
  );
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, releaseHash: "" }),
    /OBSERVE_INVALID_FINDING:MALFORMED:releaseHash/,
  );
});

test("DeploymentFinding.validate rejects a tampered findingId deterministically", () => {
  const finding = DeploymentFinding.create(fields());
  assert.throws(
    () => DeploymentFinding.validate({ ...finding, findingId: "sha256:" + "0".repeat(64) }),
    /OBSERVE_INVALID_FINDING:FINDING_ID/,
  );
});

test("DeploymentFinding.validate rejects a resolved secret value without echoing it", () => {
  const finding = DeploymentFinding.create(fields());
  const secret = "password=hunter2";
  try {
    DeploymentFinding.validate({ ...finding, message: secret });
    assert.fail("expected validation to reject a resolved secret value");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    assert.match(message, /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:message/);
    assert.equal(message.includes(secret), false);
  }
});

test("DeploymentFinding.validate rejects a resolved CA value without echoing it", () => {
  const finding = DeploymentFinding.create(fields());
  const ca = "-----BEGIN CERTIFICATE-----";
  try {
    DeploymentFinding.validate({ ...finding, observationId: ca });
    assert.fail("expected validation to reject a resolved CA value");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    assert.match(message, /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:observationId/);
    assert.equal(message.includes(ca), false);
  }
});

test("DeploymentFinding.validate accepts a create-only finding without optional operation refs", () => {
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
  const validated = DeploymentFinding.validate(finding);

  assert.equal(validated.operationId, undefined);
  assert.equal(validated.runtimeRef, undefined);
  assert.equal(validated.findingId, finding.findingId);
});
