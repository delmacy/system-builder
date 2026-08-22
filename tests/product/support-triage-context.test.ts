import assert from "node:assert/strict";
import test from "node:test";
import { SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("triage context is explicit, reference-oriented and canonically ordered", () => {
  const decision = SupportTriageDecision.create({
    intakeId: `sha256:${"a".repeat(64)}`,
    classification: "Maintenance",
    decidedAt: "2026-08-22T13:45:00.000Z",
    decidedByRef: "actor:maintenance-reviewer",
    reasonRef: "reason:verified-defect",
    impactRef: "impact:customer-workflow",
    criticalityRef: "criticality:explicit-high",
    slaRef: "sla:contract-2026-a",
    priorityRef: "priority:board-p1",
    contextRefs: ["context:production", "context:customer-visible", "context:production"],
  });

  assert.equal(decision.impactRef, "impact:customer-workflow");
  assert.equal(decision.criticalityRef, "criticality:explicit-high");
  assert.equal(decision.slaRef, "sla:contract-2026-a");
  assert.equal(decision.priorityRef, "priority:board-p1");
  assert.deepEqual(decision.contextRefs, ["context:customer-visible", "context:production"]);
  assert.equal(Object.isFrozen(decision.contextRefs), true);
  assert.equal("score" in decision, false);
  assert.equal("slaDeadline" in decision, false);
});
