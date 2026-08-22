import assert from "node:assert/strict";
import test from "node:test";
import {
  BUSINESS_RECIPE_ARTIFACT_TYPE,
  BUSINESS_RECIPE_SCHEMA_ID,
  BUSINESS_RECIPE_SCHEMA_VERSION,
} from "../../packages/contracts/business-recipe/index.js";
import {
  PROCESS_MIRROR_ARTIFACT_TYPE,
  PROCESS_MIRROR_SCHEMA_ID,
  PROCESS_MIRROR_SCHEMA_VERSION,
} from "../../packages/contracts/process-mirror/index.js";
import { EvolutionKnowledgeLink, EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function request(intake = `sha256:${"2".repeat(64)}`) {
  const triage = SupportTriageDecision.create({
    intakeId: intake,
    classification: "Evolution",
    decidedAt: "2026-08-22T18:20:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
  return EvolutionRequestEvidence.fromTriage(triage, {
    requestedAt: "2026-08-22T18:21:00.000Z",
    requestedByRef: "actor:request-owner",
    changeEvidenceRef: "evidence:process-change-006",
    reasonRef: "reason:business-rule-change",
    contextRefs: ["context:process-change"],
  });
}

const fields = {
  processMirrorRef: "artifact:process-mirror:billing:v2",
  processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
  processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
  processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
  businessRecipeRef: "artifact:business-recipe:billing:v2",
  businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
  businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
  businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
};

test("EvolutionKnowledgeLink rejects incomplete, substituted and injected execution semantics", () => {
  const source = request();
  const link = EvolutionKnowledgeLink.fromEvolutionRequest(source, fields);
  assert.deepEqual(EvolutionKnowledgeLink.validate(link, source), link);

  assert.throws(() => EvolutionKnowledgeLink.create({ ...fields, evolutionRequestId: source.evolutionRequestId, intakeId: source.intakeId, triageId: source.triageId, processMirrorRef: "" }), /EVOLUTION_LINK:MALFORMED:processMirrorRef/);
  assert.throws(() => EvolutionKnowledgeLink.create({ ...fields, evolutionRequestId: source.evolutionRequestId, intakeId: source.intakeId, triageId: source.triageId, businessRecipeRef: "" }), /EVOLUTION_LINK:MALFORMED:businessRecipeRef/);
  assert.throws(() => EvolutionKnowledgeLink.validate({ ...link, execute: true }), /EVOLUTION_LINK:KNOWLEDGE:UNKNOWN_FIELD:execute/);
  assert.throws(() => EvolutionKnowledgeLink.validate(link, request(`sha256:${"3".repeat(64)}`)), /EVOLUTION_LINK:KNOWLEDGE:EVOLUTION_LINKAGE/);
});

test("EvolutionKnowledgeLink public API exposes traceability only", () => {
  for (const forbidden of ["execute", "apply", "deploy", "mutateProduction"] as const) {
    assert.equal(forbidden in EvolutionKnowledgeLink, false);
  }
});
