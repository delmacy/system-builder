import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import {
  projectKnowledgeClassificationReference,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";
import {
  ASSISTED_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION,
  consumeAssistedKnowledgeClassificationEvidence,
} from "../../packages/contracts/knowledge-boundary/assisted-evidence-integration.js";
import { consumeManualKnowledgeClassificationEvidence } from "../../packages/contracts/knowledge-boundary/manual-evidence-integration.js";

function humanAuthority(category: "human-decision" | "probabilistic" = "human-decision") {
  return category === "human-decision"
    ? {
        descriptor: {
          boundaryVersion: DECISION_BOUNDARY_VERSION,
          decisionId: "boundary:assisted-evidence",
          category,
        },
        metadata: { authorityRef: "human:reviewer-02" },
        riskCriticality: { risk: "medium", criticality: "standard" },
      } as const
    : {
        descriptor: {
          boundaryVersion: DECISION_BOUNDARY_VERSION,
          decisionId: "boundary:probabilistic-substitution",
          category,
        },
        metadata: {
          inferenceRef: "inference:classification",
          inferenceContext: { confidence: 0.98, modelRef: "model:classifier", contextRef: "context:classification" },
        },
        riskCriticality: { risk: "medium", criticality: "standard" },
      } as const;
}

function assistedBundle() {
  return {
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "client-proprietary",
      ownerRef: "client:acme",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["support-analysis"],
      restrictionIds: ["no-training"],
    },
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-02",
      decisionRef: "decision:assisted-001",
      proposalRef: "proposal:classifier-001",
      humanAuthority: humanAuthority(),
    },
  } as const;
}

function proposal() {
  return {
    contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
    proposalRef: "proposal:classifier-001",
    proposedClass: "personal",
    confidence: 0.98,
    modelRef: "model:classifier",
    contextRef: "context:classification",
    evidenceRefs: ["evidence:model-input-001"],
  } as const;
}

function expectation(overrides: Record<string, unknown> = {}) {
  return {
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    decisionRef: "decision:assisted-001",
    proposalRef: "proposal:classifier-001",
    evidenceRef: "evidence:classification-002",
    ...overrides,
  };
}

test("assisted evidence path keeps proposal traceability separate from final verified human authority", () => {
  const projection = projectKnowledgeClassificationReference(assistedBundle(), ["evidence:classification-002"]);
  const consumed = consumeAssistedKnowledgeClassificationEvidence(projection, proposal(), expectation());

  assert.deepEqual(consumed, {
    contractVersion: ASSISTED_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION,
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    purposeIds: ["support-analysis"],
    restrictionIds: ["no-training"],
    decisionRef: "decision:assisted-001",
    proposalRef: "proposal:classifier-001",
    humanAuthority: humanAuthority(),
    evidenceRefs: ["evidence:classification-002"],
  });
  assert.equal(proposal().proposedClass, "personal");
  assert.equal(consumed.knowledgeClass, "client-proprietary");
  assert.equal(consumed.humanAuthority.metadata.authorityRef, "human:reviewer-02");
  assert.equal("confidence" in consumed, false);
  assert.equal("modelRef" in consumed, false);
  assert.equal("contextRef" in consumed, false);
});

test("assisted evidence path rejects proposal-only and probabilistic authority substitution", () => {
  const projection = projectKnowledgeClassificationReference(assistedBundle(), ["evidence:classification-002"]);

  assert.throws(
    () => consumeAssistedKnowledgeClassificationEvidence(
      { ...projection, humanAuthority: undefined },
      proposal(),
      expectation(),
    ),
    /humanAuthority must be an object/,
  );
  assert.throws(
    () => consumeAssistedKnowledgeClassificationEvidence(
      { ...projection, humanAuthority: humanAuthority("probabilistic") },
      proposal(),
      expectation(),
    ),
    /requires Decision Boundary category human-decision/,
  );
});

test("assisted evidence path fails closed for mismatched proposal and stable evidence references", () => {
  const projection = projectKnowledgeClassificationReference(assistedBundle(), ["evidence:classification-002"]);

  assert.throws(
    () => consumeAssistedKnowledgeClassificationEvidence(
      projection,
      { ...proposal(), proposalRef: "proposal:other" },
      expectation(),
    ),
    /proposalRef mismatch/,
  );
  assert.throws(
    () => consumeAssistedKnowledgeClassificationEvidence(
      projection,
      proposal(),
      expectation({ evidenceRef: "evidence:missing" }),
    ),
    /not linked to classification evidence/,
  );
});

test("manual evidence path remains compatible after assisted integration", () => {
  const manual = {
    ...assistedBundle(),
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-02",
      decisionRef: "decision:manual-compatible",
      humanAuthority: humanAuthority(),
    },
  } as const;
  const projection = projectKnowledgeClassificationReference(manual, ["evidence:manual-compatible"]);
  const consumed = consumeManualKnowledgeClassificationEvidence(projection, {
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    decisionRef: "decision:manual-compatible",
    evidenceRef: "evidence:manual-compatible",
  });
  assert.equal(consumed.decisionRef, "decision:manual-compatible");
  assert.equal(consumed.humanAuthority.metadata.authorityRef, "human:reviewer-02");
});
