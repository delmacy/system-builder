import assert from "node:assert/strict";
import test from "node:test";
import { SupportTriageDecision } from "../../packages/support-evolution/index.js";

const base = {
  intakeId: `sha256:${"a".repeat(64)}`, classification: "Support" as const, decidedAt: "2026-08-22T14:30:00.000Z",
  decidedByRef: "actor:triage", reasonRef: "reason:explicit-review", impactRef: "impact:service",
  criticalityRef: "criticality:high", slaRef: "sla:standard", priorityRef: "priority:p1", contextRefs: ["context:production"],
};

test("triage durable references reject resolved values and preserve stable references", () => {
  const valid = SupportTriageDecision.create(base);
  assert.equal(valid.priorityRef, "priority:p1");
  assert.throws(() => SupportTriageDecision.create({ ...base, decidedByRef: "password=hunter2" }), /SUPPORT_TRIAGE:RESOLVED_VALUE:decidedByRef/);
  assert.throws(() => SupportTriageDecision.create({ ...base, reasonRef: "Authorization: Bearer abc.def" }), /SUPPORT_TRIAGE:RESOLVED_VALUE:reasonRef/);
  assert.throws(() => SupportTriageDecision.create({ ...base, impactRef: "secret=resolved-value" }), /SUPPORT_TRIAGE:RESOLVED_VALUE:impactRef/);
  assert.throws(() => SupportTriageDecision.create({ ...base, criticalityRef: "token=resolved-value" }), /SUPPORT_TRIAGE:RESOLVED_VALUE:criticalityRef/);
  assert.throws(() => SupportTriageDecision.create({ ...base, slaRef: "client_secret=resolved-value" }), /SUPPORT_TRIAGE:RESOLVED_VALUE:slaRef/);
  assert.throws(() => SupportTriageDecision.create({ ...base, priorityRef: "api_key=resolved-value" }), /SUPPORT_TRIAGE:RESOLVED_VALUE:priorityRef/);
  assert.throws(() => SupportTriageDecision.create({ ...base, contextRefs: ["postgres://user:pass@db/prod"] }), /SUPPORT_TRIAGE:RESOLVED_VALUE:contextRefs/);
});
