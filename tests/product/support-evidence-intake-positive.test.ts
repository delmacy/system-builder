import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

const submittedAt = "2026-08-22T04:00:00.000Z";

test("SupportEvidenceIntake positive public API covers finding and human origins", () => {
  const finding = Object.freeze({
    kind: "DeploymentFinding" as const,
    findingId: `sha256:${"a".repeat(64)}`,
    code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    message: "health check did not pass",
    observationId: `sha256:${"b".repeat(64)}`,
    deploymentId: "deploy:support-positive",
    publishedReleaseRef: "release:support-app@1.0.0",
    environmentRef: "env:production",
    releaseHash: `sha256:${"c".repeat(64)}`,
    operationId: `sha256:${"d".repeat(64)}`,
    runtimeRef: "runtime://managed-a",
    processRef: "process://support-a",
    sessionRef: "session://support-a",
  });

  const fromFinding = SupportEvidenceIntake.fromDeploymentFinding(finding, submittedAt);
  const sameFinding = SupportEvidenceIntake.fromDeploymentFinding(finding, submittedAt);

  assert.equal(fromFinding.sourceKind, "observe_finding");
  assert.equal(fromFinding.evidenceRef, finding.findingId);
  assert.equal(fromFinding.findingCode, finding.code);
  assert.equal(fromFinding.observationId, finding.observationId);
  assert.equal(fromFinding.deploymentId, finding.deploymentId);
  assert.equal(fromFinding.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(fromFinding.environmentRef, finding.environmentRef);
  assert.equal(fromFinding.releaseHash, finding.releaseHash);
  assert.equal(fromFinding.operationId, finding.operationId);
  assert.equal(fromFinding.runtimeRef, finding.runtimeRef);
  assert.equal(fromFinding.processRef, finding.processRef);
  assert.equal(fromFinding.sessionRef, finding.sessionRef);
  assert.equal(fromFinding.intakeId, sameFinding.intakeId);
  assert.equal(Object.isFrozen(fromFinding), true);
  assert.deepEqual(SupportEvidenceIntake.validate(fromFinding), fromFinding);
  assert.deepEqual(SupportEvidenceIntake.fromJson(SupportEvidenceIntake.toJson(fromFinding)), fromFinding);

  const human = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "incident",
    evidenceRef: "human-request:positive-001",
    summary: "operator reports degraded response time",
    submittedAt,
    actorRef: "user:operator-001",
    channelRef: "channel:service-desk",
    deploymentId: "deploy:support-positive",
    environmentRef: "env:production",
    runtimeRef: "runtime://managed-a",
  });

  assert.equal(human.sourceKind, "human_request");
  assert.equal(human.requestKind, "incident");
  assert.equal(human.actorRef, "user:operator-001");
  assert.equal(human.channelRef, "channel:service-desk");
  assert.equal(human.deploymentId, "deploy:support-positive");
  assert.equal(human.environmentRef, "env:production");
  assert.equal(human.runtimeRef, "runtime://managed-a");
  assert.equal(Object.isFrozen(human), true);
  assert.deepEqual(SupportEvidenceIntake.validate(human), human);
  assert.deepEqual(SupportEvidenceIntake.fromJson(SupportEvidenceIntake.toJson(human)), human);
});
