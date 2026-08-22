import assert from "node:assert/strict";
import test from "node:test";
import { SupportTriageDecision } from "../../packages/support-evolution/index.js";

const decision = SupportTriageDecision.create({
  intakeId: `sha256:${"a".repeat(64)}`, classification: "Support", decidedAt: "2026-08-22T14:50:00.000Z",
  decidedByRef: "actor:triager", reasonRef: "reason:explicit", impactRef: "impact:service",
  criticalityRef: "criticality:medium", slaRef: "sla:standard", priorityRef: "priority:p2", contextRefs: ["context:production"],
});

test("public triage boundary fails closed for malformed or non-explicit evidence", () => {
  assert.throws(() => SupportTriageDecision.validate({ ...decision, classification: "Urgent" }), /SUPPORT_TRIAGE:CLASSIFICATION:Urgent/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, decidedByRef: "" }), /SUPPORT_TRIAGE:MALFORMED:decidedByRef/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, impactRef: undefined }), /SUPPORT_TRIAGE:MALFORMED:impactRef/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, contextRefs: [] }), /SUPPORT_TRIAGE:MALFORMED:contextRefs/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, inventedScore: 99 }), /SUPPORT_TRIAGE:UNKNOWN_FIELD:inventedScore/);
  assert.throws(() => SupportTriageDecision.validate({ ...decision, triageId: `sha256:${"b".repeat(64)}` }), /SUPPORT_TRIAGE:TRIAGE_ID/);
  assert.throws(() => SupportTriageDecision.fromJson("not-json"), /SUPPORT_TRIAGE:JSON/);
  assert.throws(() => SupportTriageDecision.create({ ...decision, triageId: undefined, reasonRef: "password=resolved" } as never), /SUPPORT_TRIAGE:RESOLVED_VALUE:reasonRef/);
});
