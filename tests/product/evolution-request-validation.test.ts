import assert from "node:assert/strict";
import test from "node:test";
import { EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function triage(classification: "Support" | "Maintenance" | "Evolution", intakeId = `sha256:${"a".repeat(64)}`) {
  return SupportTriageDecision.create({
    intakeId,
    classification,
    decidedAt: "2026-08-22T17:40:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
}

function validEvidence() {
  const source = triage("Evolution");
  return {
    source,
    evidence: EvolutionRequestEvidence.fromTriage(source, {
      requestedAt: "2026-08-22T17:41:00.000Z",
      requestedByRef: "actor:request-owner",
      changeEvidenceRef: "evidence:process-change-002",
      reasonRef: "reason:business-rule-change",
      contextRefs: ["context:process-change"],
    }),
  };
}

test("EvolutionRequestEvidence validates canonically and rejects malformed or substituted identity", () => {
  const { source, evidence } = validEvidence();
  assert.deepEqual(EvolutionRequestEvidence.validate(evidence, source), evidence);
  assert.throws(() => EvolutionRequestEvidence.validate({ ...evidence, unexpected: true }), /EVOLUTION_REQUEST:UNKNOWN_FIELD:unexpected/);
  assert.throws(() => EvolutionRequestEvidence.validate({ ...evidence, changeEvidenceRef: "" }), /EVOLUTION_REQUEST:MALFORMED:changeEvidenceRef/);
  assert.throws(() => EvolutionRequestEvidence.validate({ ...evidence, evolutionRequestId: `sha256:${"f".repeat(64)}` }), /EVOLUTION_REQUEST:EVOLUTION_REQUEST_ID/);
});

test("EvolutionRequestEvidence validation rejects substituted or non-Evolution lineage", () => {
  const { source, evidence } = validEvidence();
  const substituted = triage("Evolution", `sha256:${"b".repeat(64)}`);
  assert.throws(() => EvolutionRequestEvidence.validate(evidence, substituted), /EVOLUTION_REQUEST:TRIAGE_LINKAGE/);
  assert.throws(() => EvolutionRequestEvidence.validate(evidence, triage("Support", source.intakeId)), /EVOLUTION_REQUEST:CLASSIFICATION:Support/);
  assert.throws(() => EvolutionRequestEvidence.validate(evidence, triage("Maintenance", source.intakeId)), /EVOLUTION_REQUEST:CLASSIFICATION:Maintenance/);
});
