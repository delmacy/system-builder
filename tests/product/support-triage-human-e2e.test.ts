import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake, SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("human request intake flows into explicit deterministic triage", () => {
  const intake = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "request", evidenceRef: "request:SR-2026-0088", summary: "user requests supported configuration review",
    submittedAt: "2026-08-22T15:10:00.000Z", actorRef: "actor:requester-88", channelRef: "channel:service-portal",
    deploymentId: "deploy:customer-a", publishedReleaseRef: "release:customer-a@3.1.0", environmentRef: "env:customer-a-prod",
    releaseHash: `sha256:${"3".repeat(64)}`, runtimeRef: "runtime:customer-a",
  });
  const triage = SupportTriageDecision.fromIntake(intake, {
    classification: "Support", decidedAt: "2026-08-22T15:15:00.000Z", decidedByRef: "actor:authorized-triager",
    reasonRef: "reason:configuration-guidance", impactRef: "impact:user-workflow", criticalityRef: "criticality:explicit-normal",
    slaRef: "sla:support-standard", priorityRef: "priority:explicit-p3", contextRefs: ["context:human-origin", "context:customer-a"],
  });
  const restored = SupportTriageDecision.fromJson(SupportTriageDecision.toJson(triage));

  assert.equal(intake.requestKind, "request");
  assert.equal(intake.actorRef, "actor:requester-88");
  assert.equal(intake.channelRef, "channel:service-portal");
  assert.equal(restored.intakeId, intake.intakeId);
  assert.equal(restored.classification, "Support");
  assert.equal(restored.priorityRef, "priority:explicit-p3");
  assert.deepEqual(restored.contextRefs, ["context:customer-a", "context:human-origin"]);
  assert.equal("ownerRef" in restored, false);
  assert.equal("remediation" in restored, false);
});
