import assert from "node:assert/strict";
import test from "node:test";
import { SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("SupportTriageDecision is explicit, deterministic, content-addressed and immutable", () => {
  const base = {
    intakeId: `sha256:${"a".repeat(64)}`,
    decidedAt: "2026-08-22T13:40:00.000Z",
    decidedByRef: "actor:support-triage-operator",
    reasonRef: "reason:validated-operational-evidence",
    impactRef: "impact:service-degraded",
    criticalityRef: "criticality:business-important",
    slaRef: "sla:support-standard",
    priorityRef: "priority:explicit-p2",
    contextRefs: ["context:customer-visible", "context:production"],
  };

  for (const classification of ["Support", "Maintenance", "Evolution"] as const) {
    const left = SupportTriageDecision.create({ ...base, classification });
    const right = SupportTriageDecision.create({ ...base, classification });
    assert.equal(left.kind, "SupportTriageDecision");
    assert.equal(left.classification, classification);
    assert.equal(left.intakeId, base.intakeId);
    assert.match(left.triageId, /^sha256:[a-f0-9]{64}$/);
    assert.equal(left.triageId, right.triageId);
    assert.equal(Object.isFrozen(left), true);
  }

  const support = SupportTriageDecision.create({ ...base, classification: "Support" });
  const maintenance = SupportTriageDecision.create({ ...base, classification: "Maintenance" });
  assert.notEqual(support.triageId, maintenance.triageId);
});
