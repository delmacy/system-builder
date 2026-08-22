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
import { EvolutionKnowledgeLink, EvolutionReleaseLink, EvolutionRequestEvidence, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function knowledgeLink() {
  const triage = SupportTriageDecision.create({
    intakeId: `sha256:${"4".repeat(64)}`,
    classification: "Evolution",
    decidedAt: "2026-08-22T18:30:00.000Z",
    decidedByRef: "actor:triage-operator",
    reasonRef: "reason:process-change-reviewed",
    impactRef: "impact:business-behavior",
    criticalityRef: "criticality:explicit",
    slaRef: "sla:explicit",
    priorityRef: "priority:explicit",
    contextRefs: ["context:process-change"],
  });
  const request = EvolutionRequestEvidence.fromTriage(triage, {
    requestedAt: "2026-08-22T18:31:00.000Z",
    requestedByRef: "actor:request-owner",
    changeEvidenceRef: "evidence:process-change-007",
    reasonRef: "reason:business-rule-change",
    contextRefs: ["context:process-change"],
  });
  return EvolutionKnowledgeLink.fromEvolutionRequest(request, {
    processMirrorRef: "artifact:process-mirror:orders:v2",
    processMirrorArtifactType: PROCESS_MIRROR_ARTIFACT_TYPE,
    processMirrorSchemaId: PROCESS_MIRROR_SCHEMA_ID,
    processMirrorSchemaVersion: PROCESS_MIRROR_SCHEMA_VERSION,
    businessRecipeRef: "artifact:business-recipe:orders:v2",
    businessRecipeArtifactType: BUSINESS_RECIPE_ARTIFACT_TYPE,
    businessRecipeSchemaId: BUSINESS_RECIPE_SCHEMA_ID,
    businessRecipeSchemaVersion: BUSINESS_RECIPE_SCHEMA_VERSION,
  });
}

test("EvolutionReleaseLink deterministically traces a PublishedRelease back to Evolution lineage", () => {
  const knowledge = knowledgeLink();
  const registry = new ReleaseRegistry();
  const release = registry.publish({
    releaseId: "release:orders",
    version: "2.0.0",
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash: `sha256:${"5".repeat(64)}`,
      validationEvidenceRef: "evidence:validation:orders-v2",
    },
    publishedAt: "2026-08-22T18:32:00.000Z",
  });

  const left = EvolutionReleaseLink.fromPublishedRelease(knowledge, release);
  const right = EvolutionReleaseLink.fromPublishedRelease(knowledge, release);
  assert.equal(left.releaseLinkId, right.releaseLinkId);
  assert.equal(left.knowledgeLinkId, knowledge.knowledgeLinkId);
  assert.equal(left.evolutionRequestId, knowledge.evolutionRequestId);
  assert.equal(left.intakeId, knowledge.intakeId);
  assert.equal(left.triageId, knowledge.triageId);
  assert.equal(left.releaseId, release.releaseId);
  assert.equal(left.version, release.version);
  assert.equal(left.artifactRef, release.artifactRef);
  assert.deepEqual(EvolutionReleaseLink.validate(left, knowledge), left);
  assert.equal(registry.get(release.releaseId, release.version)?.status, "published");
});

test("EvolutionReleaseLink rejects incomplete release evidence and substituted knowledge lineage", () => {
  const knowledge = knowledgeLink();
  assert.throws(
    () => EvolutionReleaseLink.fromPublishedRelease(knowledge, { kind: "PublishedRelease", releaseId: "release:orders", artifactRef: `sha256:${"5".repeat(64)}` }),
    /EVOLUTION_LINK:MALFORMED:version/,
  );
  assert.throws(() => EvolutionReleaseLink.fromPublishedRelease(knowledge, { kind: "OtherRelease", releaseId: "release:orders", version: "2.0.0", artifactRef: "artifact:orders" }), /EVOLUTION_LINK:RELEASE:EVIDENCE_KIND/);

  const valid = EvolutionReleaseLink.fromPublishedRelease(knowledge, {
    kind: "PublishedRelease",
    releaseId: "release:orders",
    version: "2.0.0",
    artifactRef: `sha256:${"5".repeat(64)}`,
  });
  assert.throws(() => EvolutionReleaseLink.validate({ ...valid, knowledgeLinkId: `sha256:${"6".repeat(64)}` }, knowledge), /EVOLUTION_LINK:RELEASE:ID|EVOLUTION_LINK:RELEASE:KNOWLEDGE_LINKAGE/);
  for (const forbidden of ["publish", "transition", "deploy"] as const) assert.equal(forbidden in EvolutionReleaseLink, false);
});
