import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake, SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("triage links to validated intake without embedding or mutating predecessor evidence", () => {
  const intake = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "incident", evidenceRef: "request:INC-42", summary: "operator reports degraded workflow",
    submittedAt: "2026-08-22T14:20:00.000Z", actorRef: "actor:requester-42", channelRef: "channel:service-desk",
    deploymentId: "deploy:prod-42", environmentRef: "env:prod",
  });
  const before = JSON.stringify(intake);
  const decision = SupportTriageDecision.fromIntake(intake, {
    classification: "Support", decidedAt: "2026-08-22T14:25:00.000Z", decidedByRef: "actor:triage-operator",
    reasonRef: "reason:operational-assistance", impactRef: "impact:user-workflow", criticalityRef: "criticality:explicit-high",
    slaRef: "sla:incident-standard", priorityRef: "priority:explicit-p1", contextRefs: ["context:production", "context:human-origin"],
  });
  assert.equal(decision.intakeId, intake.intakeId);
  assert.equal(intake.evidenceRef, "request:INC-42");
  assert.equal(JSON.stringify(intake), before);
  assert.equal(Object.isFrozen(intake), true);
  assert.equal("evidenceRef" in decision, false);
  assert.equal("summary" in decision, false);
});
