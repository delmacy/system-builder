import assert from "node:assert/strict";
import test from "node:test";
import { SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("SupportTriageDecision JSON round-trip is lossless and validation-backed", () => {
  const decision = SupportTriageDecision.create({
    intakeId: `sha256:${"a".repeat(64)}`, classification: "Evolution", decidedAt: "2026-08-22T14:10:00.000Z",
    decidedByRef: "actor:change-reviewer", reasonRef: "reason:process-change-request", impactRef: "impact:workflow",
    criticalityRef: "criticality:explicit-medium", slaRef: "sla:evolution-review", priorityRef: "priority:backlog-e1",
    contextRefs: ["context:business-process", "context:customer-request"],
  });
  const serialized = SupportTriageDecision.toJson(decision);
  const restored = SupportTriageDecision.fromJson(serialized);
  assert.deepEqual(restored, decision);
  assert.equal(restored.triageId, decision.triageId);
  assert.equal(restored.classification, "Evolution");
  assert.deepEqual(restored.contextRefs, decision.contextRefs);
  assert.throws(() => SupportTriageDecision.fromJson("{"), /SUPPORT_TRIAGE:JSON/);
  assert.throws(() => SupportTriageDecision.fromJson(JSON.stringify({ ...decision, triageId: "wrong" })), /SUPPORT_TRIAGE:TRIAGE_ID/);
});
