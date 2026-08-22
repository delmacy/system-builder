import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

const finding = Object.freeze({
  kind: "DeploymentFinding" as const,
  findingId: `sha256:${"a".repeat(64)}`,
  severity: "warning",
  confidence: "medium",
  code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
  message: "health check did not pass",
  observationId: `sha256:${"b".repeat(64)}`,
  deploymentId: "deploy:support-a",
  publishedReleaseRef: "release:support-app@1.0.0",
  environmentRef: "env:prod-a",
  releaseHash: `sha256:${"c".repeat(64)}`,
  operationId: `sha256:${"d".repeat(64)}`,
  runtimeRef: "runtime://managed-a",
  processRef: "process://managed-a/11",
  sessionRef: "session://managed-a/11",
});

test("deployment finding maps structurally into deterministic Support intake", () => {
  const left = SupportEvidenceIntake.fromDeploymentFinding(finding, "2026-08-22T04:00:00.000Z");
  const right = SupportEvidenceIntake.fromDeploymentFinding(finding, "2026-08-22T04:00:00.000Z");

  assert.equal(left.intakeId, right.intakeId);
  assert.equal(left.sourceKind, "observe_finding");
  assert.equal(left.evidenceRef, finding.findingId);
  assert.equal(left.findingCode, finding.code);
  assert.equal(left.observationId, finding.observationId);
  assert.equal(left.deploymentId, finding.deploymentId);
  assert.equal(left.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(left.environmentRef, finding.environmentRef);
  assert.equal(left.releaseHash, finding.releaseHash);
  assert.equal(left.runtimeRef, finding.runtimeRef);
  assert.equal(left.processRef, finding.processRef);
  assert.equal(left.sessionRef, finding.sessionRef);
});

test("deployment finding mapping fails closed for malformed structural input", () => {
  assert.throws(
    () => SupportEvidenceIntake.fromDeploymentFinding({ ...finding, kind: "OtherFinding" }, "2026-08-22T04:00:00.000Z"),
    /SUPPORT_INTAKE:FINDING:KIND/,
  );
  const malformed = { ...finding } as Record<string, unknown>;
  delete malformed["deploymentId"];
  assert.throws(
    () => SupportEvidenceIntake.fromDeploymentFinding(malformed, "2026-08-22T04:00:00.000Z"),
    /SUPPORT_INTAKE:MALFORMED:deploymentId/,
  );
});
