import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { projectKnowledgeClassificationReference } from "../../packages/contracts/knowledge-boundary/reference-projection.js";
import { consumeManualKnowledgeClassificationEvidence } from "../../packages/contracts/knowledge-boundary/manual-evidence-integration.js";
import { consumeAssistedKnowledgeClassificationEvidence } from "../../packages/contracts/knowledge-boundary/assisted-evidence-integration.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId,
      category: "human-decision",
    },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

function baseClassification() {
  return {
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "client-proprietary",
      ownerRef: "client:acme",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["catalog-review", "support-analysis"],
      restrictionIds: ["internal-only", "no-training"],
    },
  } as const;
}

test("manual and assisted representative consumers preserve WBS 17.1 references and verified human authority", () => {
  const base = baseClassification();
  const manualBundle = {
    ...base,
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-manual",
      decisionRef: "decision:manual-integrated",
      humanAuthority: humanAuthority("human:reviewer-manual", "boundary:manual-integrated"),
    },
  } as const;
  const manualProjection = projectKnowledgeClassificationReference(manualBundle, ["evidence:manual", "evidence:source"]);
  const manual = consumeManualKnowledgeClassificationEvidence(manualProjection, {
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    decisionRef: "decision:manual-integrated",
    evidenceRef: "evidence:manual",
  });

  assert.equal(manual.humanAuthority.descriptor.category, "human-decision");
  assert.equal(manual.humanAuthority.metadata.authorityRef, "human:reviewer-manual");
  assert.deepEqual(manual.purposeIds, ["catalog-review", "support-analysis"]);
  assert.deepEqual(manual.restrictionIds, ["internal-only", "no-training"]);
  assert.deepEqual(manual.evidenceRefs, ["evidence:manual", "evidence:source"]);

  const assistedBundle = {
    ...base,
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-assisted",
      decisionRef: "decision:assisted-integrated",
      proposalRef: "proposal:integrated",
      humanAuthority: humanAuthority("human:reviewer-assisted", "boundary:assisted-integrated"),
    },
  } as const;
  const assistedProjection = projectKnowledgeClassificationReference(assistedBundle, ["evidence:assisted"]);
  const assisted = consumeAssistedKnowledgeClassificationEvidence(
    assistedProjection,
    {
      contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
      proposalRef: "proposal:integrated",
      proposedClass: "personal",
      confidence: 0.91,
      modelRef: "model:classifier",
      contextRef: "context:classification",
      evidenceRefs: ["evidence:model-input"],
    },
    {
      knowledgeClass: "client-proprietary",
      ownerRef: "client:acme",
      decisionRef: "decision:assisted-integrated",
      proposalRef: "proposal:integrated",
      evidenceRef: "evidence:assisted",
    },
  );

  assert.equal(assisted.humanAuthority.descriptor.category, "human-decision");
  assert.equal(assisted.humanAuthority.metadata.authorityRef, "human:reviewer-assisted");
  assert.equal(assisted.proposalRef, "proposal:integrated");
  assert.equal(assisted.knowledgeClass, "client-proprietary");
  assert.equal("confidence" in assisted, false);
  assert.equal("modelRef" in assisted, false);
});

test("integrated assisted path cannot elevate proposal-only state into final authority", () => {
  const base = baseClassification();
  const assistedBundle = {
    ...base,
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-assisted",
      decisionRef: "decision:assisted-negative",
      proposalRef: "proposal:negative",
      humanAuthority: humanAuthority("human:reviewer-assisted", "boundary:assisted-negative"),
    },
  } as const;
  const projection = projectKnowledgeClassificationReference(assistedBundle, ["evidence:assisted-negative"]);

  assert.throws(
    () => consumeAssistedKnowledgeClassificationEvidence(
      { ...projection, humanAuthority: undefined },
      {
        contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
        proposalRef: "proposal:negative",
        proposedClass: "client-proprietary",
        confidence: 1,
        modelRef: "model:classifier",
        contextRef: "context:classification",
        evidenceRefs: [],
      },
      {
        knowledgeClass: "client-proprietary",
        ownerRef: "client:acme",
        decisionRef: "decision:assisted-negative",
        proposalRef: "proposal:negative",
        evidenceRef: "evidence:assisted-negative",
      },
    ),
    /humanAuthority must be an object/,
  );
});

test("restrictions remain restrictions and cannot become implicit reuse, promotion or enforcement permission", () => {
  const base = baseClassification();
  const manualBundle = {
    ...base,
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-restriction",
      decisionRef: "decision:restriction",
      humanAuthority: humanAuthority("human:reviewer-restriction", "boundary:restriction"),
    },
  } as const;
  const projection = projectKnowledgeClassificationReference(manualBundle, ["evidence:restriction"]);
  const consumed = consumeManualKnowledgeClassificationEvidence(projection, {
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    decisionRef: "decision:restriction",
    evidenceRef: "evidence:restriction",
  });

  assert.deepEqual(consumed.restrictionIds, ["internal-only", "no-training"]);
  assert.equal("reuseAllowed" in consumed, false);
  assert.equal("promotionAllowed" in consumed, false);
  assert.equal("enforcementDecision" in consumed, false);
  assert.equal("payload" in consumed, false);
  assert.equal("providerId" in consumed, false);
  assert.equal("secret" in consumed, false);
});
