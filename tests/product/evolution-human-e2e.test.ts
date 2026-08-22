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
  SupportEvidenceIntake,
  SupportTriageDecision,
} from "../../packages/support-evolution/index.js";

test("human process-change request remains traceable through controlled Evolution release linkage", () => {
  const intake = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "request",
    evidenceRef: "request:process_change:customer-credit-rule",
    summary: "process_change: revise customer credit approval rule",
    submittedAt: "2026-08-22T18:40:00.000Z",
    actorRef: "actor:business-owner",
    channelRef: "channel:service-desk",
  });
  const triage = SupportTriageDecision.fromIntake(intake, {
    classification: "Evolution",
    decidedAt: "2026-08-22T18:41:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:business-behavior-change",
    impactRef: "impact:credit-approval-process",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:evolution-explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process_change"],
  });
  const evolution = EvolutionRequestEvidence.fromTriage(triage, {
    requestedAt: "2026-08-22T18:42:00.000Z",
    requestedByRef: "actor:business-owner",
    changeEvidenceRef: "evidence:credit-rule-change",
    reasonRef: "reason:credit-policy-updated",
    contextRefs: ["context:credit-approval", "context:process_change"],
  });
  const roundTrip = EvolutionRequestEvidence.fromJson(EvolutionRequestEvidence.toJson(evolution));
  assert.deepEqual(roundTrip, evolution);

  const knowledge = EvolutionKnowledgeLink.fromEvolutionRequest(roundTrip, {
    processMirrorRef: "artifact:process-mirror:credit-approval:v2",
    processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
    processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
    processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
    businessRecipeRef: "artifact:business-recipe:credit-approval:v2",
    businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
    businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
    businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
  });

  const registry = new ReleaseRegistry();
  const release = registry.publish({
    releaseId: "release:credit-approval",
    version: "2.0.0",
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash: `sha256:${"7".repeat(64)}`,
      validationEvidenceRef: "evidence:credit-approval-v2-validation",
    },
    publishedAt: "2026-08-22T18:43:00.000Z",
  });
  const finalLink = EvolutionReleaseLink.fromPublishedRelease(knowledge, release);

  assert.equal(finalLink.intakeId, intake.intakeId);
  assert.equal(finalLink.triageId, triage.triageId);
  assert.equal(finalLink.evolutionRequestId, evolution.evolutionRequestId);
  assert.equal(finalLink.knowledgeLinkId, knowledge.knowledgeLinkId);
  assert.equal(finalLink.processMirrorRef, "artifact:process-mirror:credit-approval:v2");
  assert.equal(finalLink.businessRecipeRef, "artifact:business-recipe:credit-approval:v2");
  assert.equal(finalLink.releaseId, release.releaseId);
  assert.equal(finalLink.version, release.version);
  assert.equal(finalLink.artifactRef, release.artifactRef);
  assert.deepEqual(EvolutionReleaseLink.validate(finalLink, knowledge), finalLink);
  assert.equal(registry.get(release.releaseId, release.version)?.status, "published");
});
