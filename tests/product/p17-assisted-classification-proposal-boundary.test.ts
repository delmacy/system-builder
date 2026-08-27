import assert from "node:assert/strict";
import test from "node:test";
import {
  ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  normalizeAssistedClassificationProposal,
  normalizeKnowledgeClassificationDecision,
} from "../../packages/contracts/knowledge-boundary/index.js";

test("assisted classification proposal is provider-neutral and bounded", () => {
  assert.deepEqual(
    normalizeAssistedClassificationProposal({
      contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
      proposalRef: " proposal:model-001 ",
      proposedClass: "client-proprietary",
      confidence: 0.87,
      modelRef: " model:classifier-v1 ",
      contextRef: " context:classification-001 ",
      evidenceRefs: [" evidence:002 ", "evidence:001"],
    }),
    {
      contractVersion: "1.0.0",
      proposalRef: "proposal:model-001",
      proposedClass: "client-proprietary",
      confidence: 0.87,
      modelRef: "model:classifier-v1",
      contextRef: "context:classification-001",
      evidenceRefs: ["evidence:001", "evidence:002"],
    },
  );
});

test("proposal validation fails closed for invalid confidence or provider authority fields", () => {
  assert.throws(
    () => normalizeAssistedClassificationProposal({
      contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
      proposalRef: "proposal:model-002",
      proposedClass: "personal",
      confidence: 1.1,
      modelRef: "model:classifier-v1",
      contextRef: "context:classification-002",
      evidenceRefs: [],
    }),
    /confidence must be a finite number between 0 and 1/,
  );

  assert.throws(
    () => normalizeAssistedClassificationProposal({
      contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
      proposalRef: "proposal:model-003",
      proposedClass: "trade-secret",
      confidence: 0.6,
      modelRef: "model:classifier-v1",
      contextRef: "context:classification-003",
      evidenceRefs: [],
      providerId: "vendor-a",
    }),
    /unexpected field providerId/,
  );

  assert.throws(
    () => normalizeAssistedClassificationProposal({
      contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
      proposalRef: "proposal:model-004",
      proposedClass: "generic",
      confidence: 0.5,
      modelRef: "model:classifier-v1",
      contextRef: "context:classification-004",
      evidenceRefs: [],
      approved: true,
    }),
    /unexpected field approved/,
  );
});

test("proposal evidence is explicit, canonical and duplicate-free", () => {
  assert.throws(
    () => normalizeAssistedClassificationProposal({
      contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
      proposalRef: "proposal:model-005",
      proposedClass: "generic",
      confidence: 0.5,
      modelRef: "model:classifier-v1",
      contextRef: "context:classification-005",
      evidenceRefs: ["evidence:001", " evidence:001 "],
    }),
    /evidenceRefs contains duplicate value evidence:001/,
  );
});

test("proposal alone cannot satisfy the final classification decision record", () => {
  const proposal = normalizeAssistedClassificationProposal({
    contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
    proposalRef: "proposal:model-006",
    proposedClass: "personal",
    confidence: 0.91,
    modelRef: "model:classifier-v1",
    contextRef: "context:classification-006",
    evidenceRefs: ["evidence:006"],
  });

  assert.throws(
    () => normalizeKnowledgeClassificationDecision(proposal),
    /unsupported knowledge classification decision mode/,
  );

  assert.deepEqual(
    normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: proposal.proposedClass,
      decisionActorRef: "human:reviewer-006",
      decisionRef: "decision:classification-006",
      proposalRef: proposal.proposalRef,
    }),
    {
      contractVersion: "1.0.0",
      mode: "assisted",
      knowledgeClass: "personal",
      decisionActorRef: "human:reviewer-006",
      decisionRef: "decision:classification-006",
      proposalRef: "proposal:model-006",
    },
  );
});
