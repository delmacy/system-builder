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

test("DeploymentFinding contract carries severity, confidence, diagnostic code, message and correlation refs", () => {
  const finding = DeploymentFinding.create(fields());

  assert.equal(finding.kind, "DeploymentFinding");
  assert.match(finding.findingId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(finding.severity, "warning");
  assert.equal(finding.confidence, "medium");
  assert.equal(finding.code, "OBSERVE_FINDING:HEALTH_CHECK_FAILED");
  assert.equal(finding.message, "a health check did not pass for this deployment");
  assert.equal(finding.observationId, `sha256:${"a".repeat(64)}`);
  assert.equal(finding.deploymentId, "deploy:observe-a");
  assert.equal(finding.publishedReleaseRef, "release:observe-app@1.0.0");
  assert.equal(finding.environmentRef, "env:observe");
  assert.equal(finding.releaseHash, `sha256:${"b".repeat(64)}`);
  assert.equal(finding.operationId, `sha256:${"c".repeat(64)}`);
  assert.equal(finding.runtimeRef, "runtime://managed-a");
  assert.equal(finding.processRef, "process://a-1");
  assert.equal(finding.sessionRef, "session://s1");
  assert.equal(Object.isFrozen(finding), true);
});

test("DeploymentFinding is deterministic: equal inputs produce equal findingId", () => {
  const left = DeploymentFinding.create(fields());
  const right = DeploymentFinding.create(fields());

  assert.equal(left.findingId, right.findingId);
  assert.deepEqual(left, right);
});

test("DeploymentFinding identity is content-addressed: a changed field changes the findingId", () => {
  const base = DeploymentFinding.create(fields());
  const changedSeverity = DeploymentFinding.create(fields({ severity: "critical" }));
  const changedConfidence = DeploymentFinding.create(fields({ confidence: "high" }));
  const changedCode = DeploymentFinding.create(fields({ code: "OBSERVE_FINDING:DEPLOYMENT_FAILED" }));
  const changedMessage = DeploymentFinding.create(fields({ message: "deployment failed" }));
  const changedObservation = DeploymentFinding.create(fields({ observationId: `sha256:${"d".repeat(64)}` }));
  const changedDeployment = DeploymentFinding.create(fields({ deploymentId: "deploy:observe-b" }));

  assert.notEqual(changedSeverity.findingId, base.findingId);
  assert.notEqual(changedConfidence.findingId, base.findingId);
  assert.notEqual(changedCode.findingId, base.findingId);
  assert.notEqual(changedMessage.findingId, base.findingId);
  assert.notEqual(changedObservation.findingId, base.findingId);
  assert.notEqual(changedDeployment.findingId, base.findingId);
});

test("DeploymentFinding optional correlation refs are preserved when present and omitted when absent", () => {
  const complete = DeploymentFinding.create(fields());
  assert.equal(complete.operationId, `sha256:${"c".repeat(64)}`);
  assert.equal(complete.runtimeRef, "runtime://managed-a");

  const minimal = DeploymentFinding.create({
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
  assert.equal(minimal.operationId, undefined);
  assert.equal(minimal.runtimeRef, undefined);
  assert.equal(minimal.processRef, undefined);
  assert.equal(minimal.sessionRef, undefined);
  assert.match(minimal.findingId, /^sha256:[a-f0-9]{64}$/);
});

test("DeploymentFinding rejects malformed required fields deterministically", () => {
  assert.throws(
    () => DeploymentFinding.create(fields({ observationId: "" })),
    /OBSERVE_INVALID_FINDING:MALFORMED:observationId/,
  );
  assert.throws(
    () => DeploymentFinding.create(fields({ code: " " })),
    /OBSERVE_INVALID_FINDING:MALFORMED:code/,
  );
  assert.throws(
    () => DeploymentFinding.create(fields({ message: "" })),
    /OBSERVE_INVALID_FINDING:MALFORMED:message/,
  );
  assert.throws(
    () => DeploymentFinding.create(fields({ deploymentId: "" })),
    /OBSERVE_INVALID_FINDING:MALFORMED:deploymentId/,
  );
  assert.throws(
    () => DeploymentFinding.create(fields({ publishedReleaseRef: "" })),
    /OBSERVE_INVALID_FINDING:MALFORMED:publishedReleaseRef/,
  );
  assert.throws(
    () => DeploymentFinding.create(fields({ environmentRef: "" })),
    /OBSERVE_INVALID_FINDING:MALFORMED:environmentRef/,
  );
  assert.throws(
    () => DeploymentFinding.create(fields({ releaseHash: "" })),
    /OBSERVE_INVALID_FINDING:MALFORMED:releaseHash/,
  );
});

test("DeploymentFinding rejects unsupported severity and confidence values deterministically", () => {
  assert.throws(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => DeploymentFinding.create(fields({ severity: "fatal" as any })),
    /OBSERVE_INVALID_FINDING:UNSUPPORTED_SEVERITY/,
  );
  assert.throws(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => DeploymentFinding.create(fields({ confidence: "certain" as any })),
    /OBSERVE_INVALID_FINDING:UNSUPPORTED_CONFIDENCE/,
  );
});

test("DeploymentFinding contract carries references and a message only (no resolved value field)", () => {
  const finding = DeploymentFinding.create(fields());
  const keys = Object.keys(finding);
  assert.deepEqual(keys.sort(), [
    "code",
    "confidence",
    "deploymentId",
    "environmentRef",
    "findingId",
    "kind",
    "message",
    "observationId",
    "operationId",
    "processRef",
    "publishedReleaseRef",
    "releaseHash",
    "runtimeRef",
    "sessionRef",
    "severity",
  ]);
  assert.equal(keys.includes("secret"), false);
  assert.equal(keys.includes("credential"), false);
  assert.equal(keys.includes("ca"), false);
  assert.equal(Object.keys(finding).length > 0, true);
});