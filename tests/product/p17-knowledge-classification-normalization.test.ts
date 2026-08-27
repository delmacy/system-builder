import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
  normalizeKnowledgeClassificationBundle,
} from "../../packages/contracts/knowledge-boundary/index.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category: "human-decision" },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

test("classification bundle normalizes canonical-equivalent inputs deterministically", () => {
  const first = normalizeKnowledgeClassificationBundle({
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "client-proprietary",
      ownerRef: " client:acme ",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: [" support-analysis ", "catalog-review"],
      restrictionIds: [" owner-review-required ", "no-external-disclosure"],
    },
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "client-proprietary",
      decisionActorRef: " human:reviewer-01 ",
      decisionRef: " decision:classification-001 ",
      proposalRef: " proposal:model-001 ",
      humanAuthority: humanAuthority("human:reviewer-01", "boundary:classification-001"),
    },
  });

  const second = normalizeKnowledgeClassificationBundle({
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "client-proprietary",
      ownerRef: "client:acme",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["catalog-review", "support-analysis"],
      restrictionIds: ["no-external-disclosure", "owner-review-required"],
    },
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "assisted",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-01",
      decisionRef: "decision:classification-001",
      proposalRef: "proposal:model-001",
      humanAuthority: humanAuthority("human:reviewer-01", "boundary:classification-001"),
    },
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first.usePolicy.purposeIds, ["catalog-review", "support-analysis"]);
  assert.deepEqual(first.usePolicy.restrictionIds, ["no-external-disclosure", "owner-review-required"]);
  assert.equal(first.decision.humanAuthority.descriptor.category, "human-decision");
});

test("classification bundle fails closed when descriptor and decision disagree", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationBundle({
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass: "personal",
        ownerRef: "person:001",
      },
      usePolicy: {
        contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
        purposeIds: ["support-analysis"],
        restrictionIds: [],
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass: "generic",
        decisionActorRef: "human:reviewer-02",
        decisionRef: "decision:classification-002",
        humanAuthority: humanAuthority("human:reviewer-02", "boundary:classification-002"),
      },
    }),
    /knowledgeClass must match classification descriptor/,
  );
});

test("classification bundle requires explicit owner, use policy and decision without defaults", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationBundle({
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass: "generic",
      },
      usePolicy: {
        contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
        purposeIds: [],
        restrictionIds: [],
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass: "generic",
        decisionActorRef: "human:reviewer-03",
        decisionRef: "decision:classification-003",
        humanAuthority: humanAuthority("human:reviewer-03", "boundary:classification-003"),
      },
    }),
    /missing field ownerRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationBundle({
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass: "generic",
        ownerRef: "owner:generic",
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass: "generic",
        decisionActorRef: "human:reviewer-03",
        decisionRef: "decision:classification-003",
        humanAuthority: humanAuthority("human:reviewer-03", "boundary:classification-003"),
      },
    }),
    /missing field usePolicy/,
  );
});

test("classification bundle rejects unknown aggregate state instead of inferring authority", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationBundle({
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass: "trade-secret",
        ownerRef: "client:secret-owner",
      },
      usePolicy: {
        contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
        purposeIds: ["internal-review"],
        restrictionIds: ["no-external-disclosure"],
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass: "trade-secret",
        decisionActorRef: "human:security-owner",
        decisionRef: "decision:classification-004",
        humanAuthority: humanAuthority("human:security-owner", "boundary:classification-004"),
      },
      reuseAuthorized: true,
    }),
    /unexpected field reuseAuthorized/,
  );
});
