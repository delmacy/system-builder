import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentFinding } from "../../packages/observe/index.js";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

test("actual P11 DeploymentFinding becomes deterministic P12 SupportEvidenceIntake evidence", () => {
  const finding = DeploymentFinding.create({
    severity: "critical",
    confidence: "high",
    code: "OBSERVE_FINDING:DEPLOYMENT_FAILED",
    message: "deployment did not complete successfully",
    observationId: `sha256:${"1".repeat(64)}`,
    deploymentId: "deploy:p12-e2e",
    publishedReleaseRef: "release:p12-e2e@1.0.0",
    environmentRef: "env:production",
    releaseHash: `sha256:${"2".repeat(64)}`,
    operationId: `sha256:${"3".repeat(64)}`,
    runtimeRef: "runtime://managed-p12",
    processRef: "process://p12-e2e",
    sessionRef: "session://p12-e2e",
  });

  const intake = SupportEvidenceIntake.fromDeploymentFinding(finding, "2026-08-22T04:10:00.000Z");
  const validated = SupportEvidenceIntake.validate(intake);
  const restored = SupportEvidenceIntake.fromJson(SupportEvidenceIntake.toJson(validated));

  assert.equal(intake.sourceKind, "observe_finding");
  assert.equal(intake.evidenceRef, finding.findingId);
  assert.equal(intake.findingCode, finding.code);
  assert.equal(intake.summary, finding.message);
  assert.equal(intake.observationId, finding.observationId);
  assert.equal(intake.deploymentId, finding.deploymentId);
  assert.equal(intake.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(intake.environmentRef, finding.environmentRef);
  assert.equal(intake.releaseHash, finding.releaseHash);
  assert.equal(intake.operationId, finding.operationId);
  assert.equal(intake.runtimeRef, finding.runtimeRef);
  assert.equal(intake.processRef, finding.processRef);
  assert.equal(intake.sessionRef, finding.sessionRef);
  assert.match(intake.intakeId, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(validated, intake);
  assert.deepEqual(restored, intake);
  assert.equal(Object.isFrozen(intake), true);

  const repeat = SupportEvidenceIntake.fromDeploymentFinding(finding, "2026-08-22T04:10:00.000Z");
  assert.equal(repeat.intakeId, intake.intakeId);

  const capabilities = Object.keys(SupportEvidenceIntake);
  assert.equal(capabilities.includes("remediate"), false);
  assert.equal(capabilities.includes("deploy"), false);
  assert.equal(capabilities.includes("mutateProduction"), false);
});
