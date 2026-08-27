import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  normalizeKnowledgeClassificationDecision,
} from "../../packages/contracts/knowledge-boundary/index.js";

function humanAuthority(authorityRef: string, decisionId = "decision-boundary:classification") {
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

test("manual knowledge classification decision requires canonical human authority", () => {
  assert.deepEqual(
    normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: " human:owner-01 ",
      decisionRef: " decision:manual-001 ",
      humanAuthority: humanAuthority("human:owner-01", "boundary:manual-001"),
    }),
    {
      contractVersion: "1.0.0",
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:owner-01",
      decisionRef: "decision:manual-001",
      humanAuthority: humanAuthority("human:owner-01", "boundary:manual-001"),
    },
  );
});

test("assisted classification keeps proposal separate from verified human decision", () => {
  const result = normalizeKnowledgeClassificationDecision({
    contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
    mode: "assisted",
    knowledgeClass: "personal",
    decisionActorRef: "human:reviewer-02",
    decisionRef: "decision:assisted-002",
    proposalRef: "proposal:model-077",
    humanAuthority: humanAuthority("human:reviewer-02", "boundary:assisted-002"),
  });
  assert.equal(result.mode, "assisted");
  assert.equal(result.decisionActorRef, "human:reviewer-02");
  assert.equal(result.proposalRef, "proposal:model-077");
  assert.equal(result.humanAuthority.descriptor.category, "human-decision");
});

test("arbitrary actor reference alone cannot satisfy a final classification decision", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "trade-secret",
      decisionActorRef: "model:classifier",
      decisionRef: "decision:assisted-003",
      proposalRef: "proposal:model-078",
    }),
    /missing field humanAuthority/,
  );
});

test("deterministic or probabilistic Decision Boundary categories cannot substitute for human authority", () => {
  for (const category of ["deterministic", "probabilistic"] as const) {
    const metadata = category === "deterministic"
      ? { invariantRef: "invariant:classification" }
      : {
          inferenceRef: "inference:classification",
          inferenceContext: { confidence: 0.9, modelRef: "model:classifier", contextRef: "context:classification" },
        };
    assert.throws(
      () => normalizeKnowledgeClassificationDecision({
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "assisted",
        knowledgeClass: "generic",
        decisionActorRef: "model:classifier",
        decisionRef: "decision:invalid-authority",
        proposalRef: "proposal:model-079",
        humanAuthority: {
          descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId: "boundary:invalid", category },
          metadata,
          riskCriticality: { risk: "medium", criticality: "standard" },
        },
      }),
      /requires Decision Boundary category human-decision/,
    );
  }
});

test("verified human authority reference must match decisionActorRef", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationDecision({
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "generic",
      decisionActorRef: "actor:other",
      decisionRef: "decision:mismatch",
      humanAuthority: humanAuthority("authority:human-reviewer", "boundary:mismatch"),
    }),
    /decisionActorRef must match verified human authorityRef/,
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
      humanAuthority: humanAuthority("human:owner-04", "boundary:manual-004"),
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
      humanAuthority: humanAuthority("human:owner-04", "boundary:assisted-004"),
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
