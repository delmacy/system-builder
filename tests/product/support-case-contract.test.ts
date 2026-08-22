import assert from "node:assert/strict";
import test from "node:test";
import { SupportCaseRecord, SupportTriageDecision } from "../../packages/support-evolution/index.js";

const triageFields = {
  intakeId: `sha256:${"a".repeat(64)}`,
  decidedAt: "2026-08-22T14:30:00.000Z",
  decidedByRef: "actor:triage-operator",
  reasonRef: "reason:explicit-triage",
  impactRef: "impact:service-degraded",
  criticalityRef: "criticality:business-important",
  slaRef: "sla:standard",
  priorityRef: "priority:explicit-p2",
  contextRefs: ["context:production"],
};

const caseFields = {
  openedAt: "2026-08-22T14:31:00.000Z",
  openedByRef: "actor:support-operator",
  reasonRef: "reason:support-case-opened",
};

test("SupportCaseRecord is deterministic and only accepts explicit Support triage", () => {
  const support = SupportTriageDecision.create({ ...triageFields, classification: "Support" });
  const left = SupportCaseRecord.fromTriage(support, caseFields);
  const right = SupportCaseRecord.fromTriage(support, caseFields);
  assert.equal(left.kind, "SupportCaseRecord");
  assert.equal(left.triageId, support.triageId);
  assert.equal(left.caseId, right.caseId);
  assert.match(left.caseId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(Object.isFrozen(left), true);

  for (const classification of ["Maintenance", "Evolution"] as const) {
    const decision = SupportTriageDecision.create({ ...triageFields, classification });
    assert.throws(() => SupportCaseRecord.fromTriage(decision, caseFields), new RegExp(`SUPPORT_CASE:CLASSIFICATION:${classification}`));
  }
});
