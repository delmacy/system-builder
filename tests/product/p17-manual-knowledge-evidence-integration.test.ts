import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import {
  projectKnowledgeClassificationReference,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";
import {
  MANUAL_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION,
  consumeManualKnowledgeClassificationEvidence,
} from "../../packages/contracts/knowledge-boundary/manual-evidence-integration.js";

function humanAuthority(category: "human-decision" | "deterministic" = "human-decision") {
  return category === "human-decision"
    ? {
        descriptor: {
          boundaryVersion: DECISION_BOUNDARY_VERSION,
          decisionId: "boundary:manual-evidence",
          category,
        },
        metadata: { authorityRef: "human:reviewer-01" },
        riskCriticality: { risk: "medium", criticality: "standard" },
      } as const
    : {
        descriptor: {
          boundaryVersion: DECISION_BOUNDARY_VERSION,
          decisionId: "boundary:deterministic-substitution",
          category,
        },
        metadata: { invariantRef: "invariant:knowledge-classification" },
        riskCriticality: { risk: "medium", criticality: "standard" },
      } as const;
}

function manualBundle() {
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
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: "human:reviewer-01",
      decisionRef: "decision:manual-001",
      humanAuthority: humanAuthority(),
    },
  } as const;
}

function expectation(overrides: Record<string, unknown> = {}) {
  return {
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    decisionRef: "decision:manual-001",
    evidenceRef: "evidence:classification-001",
    ...overrides,
  };
}

test("manual classification reference is consumed through an evidence-facing path with verified human authority", () => {
  const projection = projectKnowledgeClassificationReference(manualBundle(), [
    "evidence:source-001",
    "evidence:classification-001",
  ]);
  const consumed = consumeManualKnowledgeClassificationEvidence(projection, expectation());

  assert.deepEqual(consumed, {
    contractVersion: MANUAL_KNOWLEDGE_CLASSIFICATION_EVIDENCE_VERSION,
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    purposeIds: ["support-analysis"],
    restrictionIds: ["no-training"],
    decisionRef: "decision:manual-001",
    humanAuthority: humanAuthority(),
    evidenceRefs: ["evidence:classification-001", "evidence:source-001"],
  });
  assert.equal(consumed.humanAuthority.descriptor.category, "human-decision");
  assert.equal(consumed.humanAuthority.metadata.authorityRef, "human:reviewer-01");
});

test("manual evidence consumption fails closed for mismatched class, owner, decision and evidence references", () => {
  const projection = projectKnowledgeClassificationReference(manualBundle(), ["evidence:classification-001"]);

  assert.throws(
    () => consumeManualKnowledgeClassificationEvidence(projection, expectation({ knowledgeClass: "personal" })),
    /knowledgeClass mismatch/,
  );
  assert.throws(
    () => consumeManualKnowledgeClassificationEvidence(projection, expectation({ ownerRef: "client:other" })),
    /ownerRef mismatch/,
  );
  assert.throws(
    () => consumeManualKnowledgeClassificationEvidence(projection, expectation({ decisionRef: "decision:other" })),
    /decisionRef mismatch/,
  );
  assert.throws(
    () => consumeManualKnowledgeClassificationEvidence(projection, expectation({ evidenceRef: "evidence:missing" })),
    /not linked to classification evidence/,
  );
});

test("manual evidence consumption re-verifies projection authority and rejects deterministic substitution", () => {
  const projection = projectKnowledgeClassificationReference(manualBundle(), ["evidence:classification-001"]);
  assert.throws(
    () => consumeManualKnowledgeClassificationEvidence(
      { ...projection, humanAuthority: humanAuthority("deterministic") },
      expectation(),
    ),
    /requires Decision Boundary category human-decision/,
  );
});

test("manual evidence consumption does not infer reuse, promotion or sensitive payload channels", () => {
  const projection = projectKnowledgeClassificationReference(manualBundle(), ["evidence:classification-001"]);
  const consumed = consumeManualKnowledgeClassificationEvidence(projection, expectation());

  assert.equal("payload" in consumed, false);
  assert.equal("providerId" in consumed, false);
  assert.equal("secret" in consumed, false);
  assert.equal("reuseAllowed" in consumed, false);
  assert.equal("promotionAllowed" in consumed, false);
  assert.equal("approved" in consumed, false);
  assert.equal("authorized" in consumed, false);
});
