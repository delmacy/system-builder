import assert from "node:assert/strict";
import test from "node:test";
import { EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function source() {
  return SupportTriageDecision.create({
    intakeId: `sha256:${"e".repeat(64)}`,
    classification: "Evolution",
    decidedAt: "2026-08-22T18:00:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
}

const validFields = {
  requestedAt: "2026-08-22T18:01:00.000Z",
  requestedByRef: "actor:request-owner",
  changeEvidenceRef: "evidence:process-change-004",
  reasonRef: "reason:business-rule-change",
  contextRefs: ["context:process-change"],
};

test("Evolution request evidence accepts symbolic references and remains reference-only", () => {
  const evidence = EvolutionRequestEvidence.fromTriage(source(), validFields);
  assert.equal(evidence.requestedByRef, validFields.requestedByRef);
  assert.equal(evidence.changeEvidenceRef, validFields.changeEvidenceRef);
  assert.equal("triage" in evidence, false);
  assert.equal("intake" in evidence, false);
  assert.deepEqual(EvolutionRequestEvidence.fromJson(EvolutionRequestEvidence.toJson(evidence)), evidence);
});

test("Evolution request evidence rejects representative resolved secrets on construction and serialization", () => {
  for (const bad of [
    "password=hunter2",
    "token=abc123",
    "api_key=abc123",
    "Bearer abc.def.ghi",
    "postgres://user:secret@localhost/db",
    "authorization=Basic abc123",
  ]) {
    assert.throws(() => EvolutionRequestEvidence.fromTriage(source(), { ...validFields, changeEvidenceRef: bad }), /EVOLUTION_REQUEST:RESOLVED_VALUE:changeEvidenceRef/);
  }

  const evidence = EvolutionRequestEvidence.fromTriage(source(), validFields);
  assert.throws(
    () => EvolutionRequestEvidence.toJson({ ...evidence, reasonRef: "client_secret=resolved-value" }),
    /EVOLUTION_REQUEST:RESOLVED_VALUE:reasonRef/,
  );
});
