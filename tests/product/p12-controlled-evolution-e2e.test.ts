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
  SupportEvidenceIntake,
  SupportTriageDecision,
} from "../../packages/support-evolution/index.js";

test("P12 controlled Evolution growing proof preserves lineage and production boundaries", () => {
  const intake = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "request",
    evidenceRef: "request:process_change:fulfillment-policy",
    summary: "process_change: update fulfillment approval policy",
    submittedAt: "2026-08-22T19:00:00.000Z",
    actorRef: "actor:process-owner",
    channelRef: "channel:service-desk",
  });
  const triage = SupportTriageDecision.fromIntake(intake, {
    classification: "Evolution",
    decidedAt: "2026-08-22T19:01:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:business-behavior-change",
    impactRef: "impact:fulfillment-policy",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:evolution-explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process_change"],
  });

  assert.throws(
    () => SupportCaseRecord.fromTriage(triage, { openedAt: "2026-08-22T19:01:30.000Z", openedByRef: "actor:support", reasonRef: "reason:not-operational-support" }),
    /SUPPORT_CASE:CLASSIFICATION:Evolution/,
  );
  assert.throws(
    () => ProblemRecord.fromTriage(triage, { openedAt: "2026-08-22T19:01:30.000Z", openedByRef: "actor:maintenance", contextRef: "context:not-maintenance" }),
    /SUPPORT_PROBLEM:CLASSIFICATION:Evolution/,
  );

  const request = EvolutionRequestEvidence.fromTriage(triage, {
    requestedAt: "2026-08-22T19:02:00.000Z",
    requestedByRef: "actor:process-owner",
    changeEvidenceRef: "evidence:fulfillment-policy-change",
    reasonRef: "reason:approved-process-change",
    contextRefs: ["context:fulfillment", "context:process_change"],
  });
  const requestRoundTrip = EvolutionRequestEvidence.fromJson(EvolutionRequestEvidence.toJson(request));
  assert.deepEqual(EvolutionRequestEvidence.validate(requestRoundTrip, triage), request);

  const knowledge = EvolutionKnowledgeLink.fromEvolutionRequest(requestRoundTrip, {
    processMirrorRef: "artifact:process-mirror:fulfillment:v2",
    processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
    processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
    processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
    businessRecipeRef: "artifact:business-recipe:fulfillment:v2",
    businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
    businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
    businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
  });
  assert.deepEqual(EvolutionKnowledgeLink.validate(knowledge, request), knowledge);

  const registry = new ReleaseRegistry();
  const release = registry.publish({
    releaseId: "release:fulfillment",
    version: "2.0.0",
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash: `sha256:${"9".repeat(64)}`,
      validationEvidenceRef: "evidence:fulfillment-v2-validation",
    },
    publishedAt: "2026-08-22T19:03:00.000Z",
  });
  const finalLink = EvolutionReleaseLink.fromPublishedRelease(knowledge, release);
  assert.deepEqual(EvolutionReleaseLink.validate(finalLink, knowledge), finalLink);

  assert.equal(finalLink.intakeId, intake.intakeId);
  assert.equal(finalLink.triageId, triage.triageId);
  assert.equal(finalLink.evolutionRequestId, request.evolutionRequestId);
  assert.equal(finalLink.knowledgeLinkId, knowledge.knowledgeLinkId);
  assert.equal(finalLink.releaseId, release.releaseId);
  assert.equal(finalLink.version, release.version);
  assert.equal(finalLink.artifactRef, release.artifactRef);
  assert.equal(registry.get(release.releaseId, release.version)?.status, "published");

  assert.throws(
    () => EvolutionKnowledgeLink.fromEvolutionRequest(request, {
      processMirrorRef: "token=resolved-secret",
      processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
      processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
      processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
      businessRecipeRef: "artifact:business-recipe:fulfillment:v2",
      businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
      businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
      businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
    }),
    /EVOLUTION_LINK:RESOLVED_VALUE:processMirrorRef/,
  );

  for (const api of [EvolutionRequestEvidence, EvolutionKnowledgeLink, EvolutionReleaseLink]) {
    for (const forbidden of ["execute", "apply", "deploy", "remediate", "mutateProduction", "publish", "transition"]) assert.equal(forbidden in api, false);
  }
});
