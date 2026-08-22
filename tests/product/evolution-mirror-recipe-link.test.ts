import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_MIRROR_ARTIFACT_TYPE,
  PROCESS_MIRROR_SCHEMA_ID,
  PROCESS_MIRROR_SCHEMA_VERSION,
} from "../../packages/contracts/process-mirror/index.js";
import {
  BUSINESS_RECIPE_ARTIFACT_TYPE,
  BUSINESS_RECIPE_SCHEMA_ID,
  BUSINESS_RECIPE_SCHEMA_VERSION,
} from "../../packages/contracts/business-recipe/index.js";
import { EvolutionKnowledgeLink, EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function request() {
  const triage = SupportTriageDecision.create({
    intakeId: `sha256:${"1".repeat(64)}`,
    classification: "Evolution",
    decidedAt: "2026-08-22T18:10:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
  return EvolutionRequestEvidence.fromTriage(triage, {
    requestedAt: "2026-08-22T18:11:00.000Z",
    requestedByRef: "actor:request-owner",
    changeEvidenceRef: "evidence:process-change-005",
    reasonRef: "reason:business-rule-change",
    contextRefs: ["context:process-change"],
  });
}

const linkFields = {
  processMirrorRef: "artifact:process-mirror:customer-onboarding:v2",
  processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
  processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
  processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
  businessRecipeRef: "artifact:business-recipe:customer-onboarding:v2",
  businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
  businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
  businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
};

test("EvolutionKnowledgeLink deterministically links Evolution evidence to canonical Mirror and Recipe identities", () => {
  const evolution = request();
  const left = EvolutionKnowledgeLink.fromEvolutionRequest(evolution, linkFields);
  const right = EvolutionKnowledgeLink.fromEvolutionRequest(evolution, { ...linkFields });

  assert.equal(left.kind, "EvolutionKnowledgeLink");
  assert.equal(left.evolutionRequestId, evolution.evolutionRequestId);
  assert.equal(left.intakeId, evolution.intakeId);
  assert.equal(left.triageId, evolution.triageId);
  assert.equal(left.processMirrorArtifactType, PROCESS_MIRROR_ARTIFACT_TYPE);
  assert.equal(left.processMirrorSchemaId, PROCESS_MIRROR_SCHEMA_ID);
  assert.equal(left.businessRecipeArtifactType, BUSINESS_RECIPE_ARTIFACT_TYPE);
  assert.equal(left.businessRecipeSchemaId, BUSINESS_RECIPE_SCHEMA_ID);
  assert.equal(left.knowledgeLinkId, right.knowledgeLinkId);
  assert.match(left.knowledgeLinkId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(Object.isFrozen(left), true);
  assert.equal("execute" in left, false);
  assert.equal("apply" in left, false);
});
