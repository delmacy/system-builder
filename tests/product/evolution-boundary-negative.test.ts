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
import { ReleaseRegistry } from "../../packages/release/index.js";
import {
  EvolutionKnowledgeLink,
  EvolutionReleaseLink,
  EvolutionRequestEvidence,
  ProblemRecord,
  SupportCaseRecord,
  SupportTriageDecision,
} from "../../packages/support-evolution/index.js";

function evolutionTriage() {
  return SupportTriageDecision.create({
    intakeId: `sha256:${"8".repeat(64)}`,
    classification: "Evolution",
    decidedAt: "2026-08-22T18:50:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process_change"],
  });
}

function evolutionRequest() {
  return EvolutionRequestEvidence.fromTriage(evolutionTriage(), {
    requestedAt: "2026-08-22T18:51:00.000Z",
    requestedByRef: "actor:business-owner",
    changeEvidenceRef: "evidence:process-change-boundary",
    reasonRef: "reason:business-rule-change",
    contextRefs: ["context:process_change"],
  });
}

const knowledgeFields = {
  processMirrorRef: "artifact:process-mirror:boundary:v2",
  processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
  processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
  processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
  businessRecipeRef: "artifact:business-recipe:boundary:v2",
  businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
  businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
  businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
};

test("Evolution remains outside Support/Maintenance operational resolution", () => {
  const triage = evolutionTriage();
  assert.throws(
    () => SupportCaseRecord.fromTriage(triage, { openedAt: "2026-08-22T18:52:00.000Z", openedByRef: "actor:support", reasonRef: "reason:case" }),
    /SUPPORT_CASE:CLASSIFICATION:Evolution/,
  );
  assert.throws(
    () => ProblemRecord.fromTriage(triage, { openedAt: "2026-08-22T18:52:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem" }),
    /SUPPORT_PROBLEM:CLASSIFICATION:Evolution/,
  );
});

test("controlled Evolution APIs cannot bypass Mirror/Recipe/release or persist resolved secret values", () => {
  const request = evolutionRequest();
  assert.throws(() => EvolutionKnowledgeLink.fromEvolutionRequest(request, { ...knowledgeFields, processMirrorRef: "" }), /EVOLUTION_LINK:MALFORMED:processMirrorRef/);
  assert.throws(() => EvolutionKnowledgeLink.fromEvolutionRequest(request, { ...knowledgeFields, businessRecipeRef: "" }), /EVOLUTION_LINK:MALFORMED:businessRecipeRef/);
  assert.throws(
    () => EvolutionKnowledgeLink.fromEvolutionRequest(request, { ...knowledgeFields, processMirrorRef: "token=resolved-secret" }),
    /EVOLUTION_LINK:RESOLVED_VALUE:processMirrorRef/,
  );

  const knowledge = EvolutionKnowledgeLink.fromEvolutionRequest(request, knowledgeFields);
  assert.throws(
    () => EvolutionReleaseLink.fromPublishedRelease(knowledge, { kind: "PublishedRelease", releaseId: "release:boundary", artifactRef: "artifact:boundary" }),
    /EVOLUTION_LINK:MALFORMED:version/,
  );
  assert.throws(
    () => EvolutionReleaseLink.fromPublishedRelease(knowledge, { kind: "PublishedRelease", releaseId: "release:boundary", version: "2.0.0", artifactRef: "authorization=Bearer resolved" }),
    /EVOLUTION_LINK:RESOLVED_VALUE:artifactRef/,
  );

  for (const api of [EvolutionRequestEvidence, EvolutionKnowledgeLink, EvolutionReleaseLink]) {
    for (const forbidden of ["execute", "apply", "deploy", "remediate", "mutateProduction", "publish", "transition"]) {
      assert.equal(forbidden in api, false);
    }
  }

  const registry = new ReleaseRegistry();
  assert.equal(typeof registry.publish, "function");
  assert.equal(typeof registry.transition, "function");
});
