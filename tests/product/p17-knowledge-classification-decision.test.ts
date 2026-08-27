import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  normalizeKnowledgeClassificationDecision,
} from "../../packages/contracts/knowledge-boundary/index.js";

test("manual knowledge classification decision requires explicit human actor and decision reference", () => {
  assert.deepEqual(
    normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: " human:owner-01 ",
      decisionRef: " decision:manual-001 ",
    }),
    {
      contractVersion: "1.0.0",
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:owner-01",
      decisionRef: "decision:manual-001",
    },
  );
});

test("assisted classification keeps proposal separate from the explicit human decision", () => {
  assert.deepEqual(
    normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "personal",
      decisionActorRef: "human:reviewer-02",
      decisionRef: "decision:assisted-002",
      proposalRef: "proposal:model-077",
    }),
    {
      contractVersion: "1.0.0",
      mode: "assisted",
      knowledgeClass: "personal",
      decisionActorRef: "human:reviewer-02",
      decisionRef: "decision:assisted-002",
      proposalRef: "proposal:model-077",
    },
  );
});

test("assisted proposal cannot become authoritative without an explicit human decision", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "trade-secret",
      proposalRef: "proposal:model-078",
      decisionRef: "decision:assisted-003",
    }),
    /missing field decisionActorRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "trade-secret",
      decisionActorRef: "human:reviewer-03",
      proposalRef: "proposal:model-078",
    }),
    /missing field decisionRef/,
  );
});

test("classification decision fails closed for proposal authority or mode-shape ambiguity", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "generic",
      decisionActorRef: "human:owner-04",
      decisionRef: "decision:manual-004",
      proposalRef: "proposal:model-079",
    }),
    /unexpected field proposalRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "generic",
      decisionActorRef: "human:owner-04",
      decisionRef: "decision:assisted-004",
      proposalRef: "proposal:model-079",
      approved: true,
    }),
    /unexpected field approved/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "automatic",
      knowledgeClass: "generic",
      decisionActorRef: "model:classifier",
      decisionRef: "decision:auto-001",
    }),
    /unsupported knowledge classification decision mode/,
  );
});
