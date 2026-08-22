import assert from "node:assert/strict";
import test from "node:test";
import { EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function triage(classification: "Support" | "Maintenance" | "Evolution") {
  return SupportTriageDecision.create({
    intakeId: `sha256:${"a".repeat(64)}`,
    classification,
    decidedAt: "2026-08-22T17:30:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
}

const requestFields = {
  requestedAt: "2026-08-22T17:31:00.000Z",
  requestedByRef: "actor:request-owner",
  changeEvidenceRef: "evidence:process-change-001",
  reasonRef: "reason:business-rule-change",
  contextRefs: ["context:business-rule", "context:process-change"],
};

test("EvolutionRequestEvidence is explicit, deterministic and reference-only by lineage", () => {
  const evolution = triage("Evolution");
  const left = EvolutionRequestEvidence.fromTriage(evolution, requestFields);
  const right = EvolutionRequestEvidence.fromTriage(evolution, { ...requestFields, contextRefs: [...requestFields.contextRefs].reverse() });

  assert.equal(left.kind, "EvolutionRequestEvidence");
  assert.equal(left.intakeId, evolution.intakeId);
  assert.equal(left.triageId, evolution.triageId);
  assert.match(left.evolutionRequestId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(left.evolutionRequestId, right.evolutionRequestId);
  assert.equal(Object.isFrozen(left), true);
  assert.deepEqual(left.contextRefs, ["context:business-rule", "context:process-change"]);
  assert.equal("classification" in left, false);
});

test("EvolutionRequestEvidence rejects Support and Maintenance triage", () => {
  assert.throws(() => EvolutionRequestEvidence.fromTriage(triage("Support"), requestFields), /EVOLUTION_REQUEST:CLASSIFICATION:Support/);
  assert.throws(() => EvolutionRequestEvidence.fromTriage(triage("Maintenance"), requestFields), /EVOLUTION_REQUEST:CLASSIFICATION:Maintenance/);
});
