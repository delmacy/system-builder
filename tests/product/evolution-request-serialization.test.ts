import assert from "node:assert/strict";
import test from "node:test";
import { EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function evidence() {
  const triage = SupportTriageDecision.create({
    intakeId: `sha256:${"c".repeat(64)}`,
    classification: "Evolution",
    decidedAt: "2026-08-22T17:50:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
  return EvolutionRequestEvidence.fromTriage(triage, {
    requestedAt: "2026-08-22T17:51:00.000Z",
    requestedByRef: "actor:request-owner",
    changeEvidenceRef: "evidence:process-change-003",
    reasonRef: "reason:business-rule-change",
    contextRefs: ["context:process-change", "context:business-rule"],
  });
}

test("EvolutionRequestEvidence JSON round-trip is lossless and deterministic", () => {
  const original = evidence();
  const serialized = EvolutionRequestEvidence.toJson(original);
  const restored = EvolutionRequestEvidence.fromJson(serialized);
  assert.deepEqual(restored, original);
  assert.equal(restored.evolutionRequestId, original.evolutionRequestId);
  assert.equal(EvolutionRequestEvidence.toJson(restored), serialized);
});

test("EvolutionRequestEvidence serialization validates before use", () => {
  const original = evidence();
  assert.throws(() => EvolutionRequestEvidence.toJson({ ...original, evolutionRequestId: `sha256:${"d".repeat(64)}` }), /EVOLUTION_REQUEST:EVOLUTION_REQUEST_ID/);
  assert.throws(() => EvolutionRequestEvidence.fromJson("{"), /EVOLUTION_REQUEST:JSON/);
  assert.throws(() => EvolutionRequestEvidence.fromJson(JSON.stringify({ ...original, reasonRef: "" })), /EVOLUTION_REQUEST:MALFORMED:reasonRef/);
});
