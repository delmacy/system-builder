import assert from "node:assert/strict";
import test from "node:test";
import { ProblemRecord, SupportTriageDecision } from "../../packages/support-evolution/index.js";

const triageFields = {
  intakeId: `sha256:${"e".repeat(64)}`, decidedAt: "2026-08-22T14:50:00.000Z", decidedByRef: "actor:triage",
  reasonRef: "reason:maintenance", impactRef: "impact:degraded", criticalityRef: "criticality:important",
  slaRef: "sla:standard", priorityRef: "priority:explicit-p2", contextRefs: ["context:production"],
};
const problemFields = { openedAt: "2026-08-22T14:51:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem-investigation" };

test("ProblemRecord is deterministic and requires explicit Maintenance triage", () => {
  const maintenance = SupportTriageDecision.create({ ...triageFields, classification: "Maintenance" });
  const left = ProblemRecord.fromTriage(maintenance, problemFields);
  const right = ProblemRecord.fromTriage(maintenance, problemFields);
  assert.equal(left.problemId, right.problemId);
  assert.match(left.problemId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(Object.isFrozen(left), true);
  for (const classification of ["Support", "Evolution"] as const) {
    const decision = SupportTriageDecision.create({ ...triageFields, classification });
    assert.throws(() => ProblemRecord.fromTriage(decision, problemFields), new RegExp(`SUPPORT_PROBLEM:CLASSIFICATION:${classification}`));
  }
});
