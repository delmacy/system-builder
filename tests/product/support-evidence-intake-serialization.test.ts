import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

test("SupportEvidenceIntake JSON round-trip is lossless", () => {
  const intake = SupportEvidenceIntake.create({
    sourceKind: "observe_finding",
    evidenceRef: `sha256:${"a".repeat(64)}`,
    summary: "finding requires support intake",
    submittedAt: "2026-08-22T03:50:00.000Z",
    findingCode: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    observationId: `sha256:${"b".repeat(64)}`,
    deploymentId: "deploy:support-a",
    publishedReleaseRef: "release:support-app@1.0.0",
    environmentRef: "env:prod-a",
    releaseHash: `sha256:${"c".repeat(64)}`,
    operationId: `sha256:${"d".repeat(64)}`,
    runtimeRef: "runtime://managed-a",
  });

  const serialized = SupportEvidenceIntake.toJson(intake);
  const restored = SupportEvidenceIntake.fromJson(serialized);

  assert.deepEqual(restored, intake);
  assert.equal(restored.intakeId, intake.intakeId);
  assert.equal(restored.operationId, intake.operationId);
  assert.equal(restored.runtimeRef, intake.runtimeRef);
});

test("SupportEvidenceIntake JSON parsing fails closed", () => {
  assert.throws(() => SupportEvidenceIntake.fromJson("{"), /SUPPORT_INTAKE:JSON/);

  const intake = SupportEvidenceIntake.create({
    sourceKind: "human_request",
    evidenceRef: "request://desk/9",
    summary: "operator submitted feedback",
    submittedAt: "2026-08-22T03:51:00.000Z",
    requestKind: "feedback",
    actorRef: "actor://operator/9",
    channelRef: "channel://service-desk",
  });
  const parsed = JSON.parse(SupportEvidenceIntake.toJson(intake)) as Record<string, unknown>;
  parsed["intakeId"] = `sha256:${"f".repeat(64)}`;
  assert.throws(() => SupportEvidenceIntake.fromJson(JSON.stringify(parsed)), /SUPPORT_INTAKE:INTAKE_ID/);
});
