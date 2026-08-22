import assert from "node:assert/strict";
import test from "node:test";
import { SupportTriageDecision } from "../../packages/support-evolution/index.js";

const fields = {
  intakeId: `sha256:${"a".repeat(64)}`, classification: "Support" as const, decidedAt: "2026-08-22T14:00:00.000Z",
  decidedByRef: "actor:triage", reasonRef: "reason:explicit-review", impactRef: "impact:service",
  criticalityRef: "criticality:high", slaRef: "sla:standard", priorityRef: "priority:p1", contextRefs: ["context:production"],
};

test("SupportTriageDecision validates canonical content and identity", () => {
  const decision = SupportTriageDecision.create(fields);
  assert.deepEqual(SupportTriageDecision.validate(decision), decision);
  assert.equal(Object.isFrozen(SupportTriageDecision.validate(decision)), true);
});

test("SupportTriageDecision validation fails closed", () => {
  const decision = SupportTriageDecision.create(fields);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, classification: "Unknown" }), /SUPPORT_TRIAGE:CLASSIFICATION:Unknown/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, priorityRef: "" }), /SUPPORT_TRIAGE:MALFORMED:priorityRef/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, contextRefs: [] }), /SUPPORT_TRIAGE:MALFORMED:contextRefs/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, extra: true }), /SUPPORT_TRIAGE:UNKNOWN_FIELD:extra/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, triageId: `sha256:${"b".repeat(64)}` }), /SUPPORT_TRIAGE:TRIAGE_ID/);
});
