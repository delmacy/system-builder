import assert from "node:assert/strict";
import test from "node:test";
import {
  SupportEvidenceIntake,
  type SupportHumanRequestSource,
  type SupportObserveFindingSource,
} from "../../packages/support-evolution/intake.js";

test("Support intake models provider-neutral Observe finding provenance explicitly", () => {
  const source: SupportObserveFindingSource = {
    sourceKind: "observe_finding",
    evidenceRef: `sha256:${"a".repeat(64)}`,
    findingCode: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    observationId: `sha256:${"b".repeat(64)}`,
    deploymentId: "deploy:support-a",
    publishedReleaseRef: "release:support-app@1.0.0",
    environmentRef: "env:prod-a",
    releaseHash: `sha256:${"c".repeat(64)}`,
    runtimeRef: "runtime://managed-a",
  };

  const intake = SupportEvidenceIntake.create({
    ...source,
    summary: "health finding requires support attention",
    submittedAt: "2026-08-22T03:40:00.000Z",
  });

  assert.equal(intake.sourceKind, "observe_finding");
  assert.equal(intake.findingCode, source.findingCode);
  assert.equal(intake.observationId, source.observationId);
  assert.equal(intake.runtimeRef, source.runtimeRef);
});

test("Support intake models human request provenance explicitly", () => {
  const source: SupportHumanRequestSource = {
    sourceKind: "human_request",
    evidenceRef: "request://desk/123",
    requestKind: "incident",
    actorRef: "actor://operator/7",
    channelRef: "channel://service-desk",
  };

  const intake = SupportEvidenceIntake.create({
    ...source,
    summary: "operator reported a service interruption",
    submittedAt: "2026-08-22T03:41:00.000Z",
  });

  assert.equal(intake.sourceKind, "human_request");
  assert.equal(intake.requestKind, "incident");
  assert.equal(intake.actorRef, source.actorRef);
  assert.equal(intake.channelRef, source.channelRef);
  assert.equal(Object.isFrozen(intake), true);
});
