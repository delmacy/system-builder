import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

test("human request capture preserves explicit provenance deterministically", () => {
  const input = {
    requestKind: "incident" as const,
    evidenceRef: "request://service-desk/42",
    summary: "operator reported service interruption",
    submittedAt: "2026-08-22T04:10:00.000Z",
    actorRef: "actor://operator/42",
    channelRef: "channel://service-desk",
    deploymentId: "deploy:support-a",
    publishedReleaseRef: "release:support-app@1.0.0",
    environmentRef: "env:prod-a",
    releaseHash: `sha256:${"a".repeat(64)}`,
    runtimeRef: "runtime://managed-a",
  };

  const left = SupportEvidenceIntake.fromHumanRequest(input);
  const right = SupportEvidenceIntake.fromHumanRequest(input);

  assert.equal(left.intakeId, right.intakeId);
  assert.equal(left.sourceKind, "human_request");
  assert.equal(left.requestKind, "incident");
  assert.equal(left.evidenceRef, input.evidenceRef);
  assert.equal(left.actorRef, input.actorRef);
  assert.equal(left.channelRef, input.channelRef);
  assert.equal(left.deploymentId, input.deploymentId);
  assert.equal(left.runtimeRef, input.runtimeRef);
  assert.deepEqual(SupportEvidenceIntake.validate(left), left);
});

test("human capture supports request and feedback without implying lifecycle actions", () => {
  for (const requestKind of ["request", "feedback"] as const) {
    const intake = SupportEvidenceIntake.fromHumanRequest({
      requestKind,
      evidenceRef: `request://service-desk/${requestKind}`,
      summary: `human ${requestKind} submitted for later triage`,
      submittedAt: "2026-08-22T04:11:00.000Z",
      actorRef: "actor://operator/7",
      channelRef: "channel://service-desk",
    });
    assert.equal(intake.requestKind, requestKind);
    assert.equal("priority" in intake, false);
    assert.equal("classification" in intake, false);
    assert.equal("remediation" in intake, false);
  }
});
