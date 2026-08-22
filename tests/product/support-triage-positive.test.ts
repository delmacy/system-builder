import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake, SupportTriageDecision } from "../../packages/support-evolution/index.js";

const explicit = {
  decidedAt: "2026-08-22T14:40:00.000Z", decidedByRef: "actor:authorized-triager", reasonRef: "reason:explicit-assessment",
  impactRef: "impact:service-boundary", criticalityRef: "criticality:explicit-medium", slaRef: "sla:catalog-standard",
  priorityRef: "priority:explicit-p2", contextRefs: ["context:production", "context:customer-visible"],
};

test("public triage API proves all explicit classifications, deterministic identity and lossless linkage", () => {
  const intake = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "feedback", evidenceRef: "feedback:42", summary: "customer requests lifecycle review",
    submittedAt: "2026-08-22T14:35:00.000Z", actorRef: "actor:customer-42", channelRef: "channel:portal",
  });
  for (const classification of ["Support", "Maintenance", "Evolution"] as const) {
    const left = SupportTriageDecision.fromIntake(intake, { ...explicit, classification });
    const right = SupportTriageDecision.fromIntake(intake, { ...explicit, classification });
    assert.equal(left.triageId, right.triageId);
    assert.equal(left.intakeId, intake.intakeId);
    assert.equal(left.classification, classification);
    assert.deepEqual(SupportTriageDecision.fromJson(SupportTriageDecision.toJson(left)), left);
    assert.equal(Object.isFrozen(left), true);
    assert.equal(Object.isFrozen(left.contextRefs), true);
    assert.equal("score" in left, false);
    assert.equal("remediation" in left, false);
  }
});
