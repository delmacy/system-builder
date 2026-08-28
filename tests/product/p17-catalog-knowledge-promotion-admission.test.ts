import assert from "node:assert/strict";
import test from "node:test";

import {
  CATALOG_KNOWLEDGE_PROMOTION_ADMISSION_VERSION,
  evaluateCatalogKnowledgePromotionAdmission,
} from "../../packages/catalog/index.js";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";

function authority(
  authorityRef: string,
  decisionId: string,
  category: "human-decision" | "deterministic" | "probabilistic" = "human-decision",
) {
  if (category === "deterministic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: { invariantRef: "invariant:catalog-promotion" },
      riskCriticality: { risk: "high", criticality: "critical" },
    } as const;
  }
  if (category === "probabilistic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: {
        inferenceRef: "inference:catalog-promotion",
        inferenceContext: { confidence: 1, modelRef: "model:catalog-promotion", contextRef: "context:catalog-promotion" },
      },
      riskCriticality: { risk: "high", criticality: "critical" },
    } as const;
  }
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
    metadata: { authorityRef },
    riskCriticality: { risk: "high", criticality: "critical" },
  } as const;
}

function review() {
  return {
    candidateRef: "candidate:catalog-admission:001",
    predecessor: {
      bundle: {
        classification: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
          knowledgeClass: "client-proprietary",
          ownerRef: "client:acme",
        },
        usePolicy: {
          contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
          purposeIds: ["promotion-candidate"],
          restrictionIds: ["owner-permission-required"],
        },
        decision: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
          mode: "manual",
          knowledgeClass: "client-proprietary",
          decisionActorRef: "human:classification-owner",
          decisionRef: "decision:classification:catalog-admission",
          humanAuthority: authority("human:classification-owner", "boundary:classification:catalog-admission"),
        },
      },
      usePolicyRef: "policy:classification:catalog-admission",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef: "enforcement:catalog-admission",
        classificationDecisionRef: "decision:classification:catalog-admission",
        usePolicyRef: "policy:classification:catalog-admission",
        purposeId: "promotion-candidate",
        outcome: "allow",
        reasonIds: ["owner-permission-present"],
      },
      eligibilityRef: "eligibility:catalog-admission",
      permissionRef: "permission:catalog-admission",
    },
    transformation: {
      transformationRef: "transformation:catalog-admission",
      policy: { policyRef: "policy:transform:catalog-admission", permittedKinds: ["generalization"] },
      kind: "generalization",
    },
    genericityEvidence: {
      evidenceRef: "genericity:catalog-admission",
      evidenceKind: "human-review",
      result: "supports-genericity",
      sourceRef: "review:catalog-admission",
    },
  } as const;
}

function input(disposition: "promote" | "reject" = "promote") {
  return {
    review: review(),
    promotionDecision: {
      decisionRef: `promotion-decision:${disposition}:catalog-admission`,
      disposition,
      decisionActorRef: "human:promotion-owner",
      humanAuthority: authority("human:promotion-owner", `boundary:promotion:${disposition}:catalog-admission`),
    },
  } as const;
}

test("TASK-386 admits only canonical human-authoritative promotion truth", () => {
  assert.deepEqual(evaluateCatalogKnowledgePromotionAdmission(input()), {
    contractVersion: CATALOG_KNOWLEDGE_PROMOTION_ADMISSION_VERSION,
    status: "admitted",
    candidateRef: "candidate:catalog-admission:001",
    classificationDecisionRef: "decision:classification:catalog-admission",
    enforcementRef: "enforcement:catalog-admission",
    eligibilityRef: "eligibility:catalog-admission",
    transformationRef: "transformation:catalog-admission",
    genericityEvidenceRef: "genericity:catalog-admission",
    promotionDecisionRef: "promotion-decision:promote:catalog-admission",
    humanDecisionId: "boundary:promotion:promote:catalog-admission",
    humanAuthorityRef: "human:promotion-owner",
  });
});

test("TASK-386 rejects rejection truth, non-human substitution and actor/ref mismatch", () => {
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission(input("reject")),
    /requires canonical promote decision/,
  );
  for (const category of ["deterministic", "probabilistic"] as const) {
    const base = input();
    assert.throws(
      () => evaluateCatalogKnowledgePromotionAdmission({
        ...base,
        promotionDecision: {
          ...base.promotionDecision,
          humanAuthority: authority("human:promotion-owner", `boundary:${category}:catalog-admission`, category),
        },
      } as never),
      /requires verified human-decision authority/,
    );
  }
  const base = input();
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      ...base,
      promotionDecision: { ...base.promotionDecision, decisionActorRef: "human:attacker" },
    }),
    /actor must match verified human authorityRef/,
  );
});

test("TASK-386 rejects forged predecessor and sensitive field injection", () => {
  const base = input();
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      ...base,
      review: {
        ...base.review,
        predecessor: {
          ...base.review.predecessor,
          enforcement: {
            ...base.review.predecessor.enforcement,
            classificationDecisionRef: "decision:forged",
          },
        },
      },
    }),
    /must match canonical classification decisionRef/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({ ...base, payload: "secret" } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      ...base,
      promotionDecision: { ...base.promotionDecision, content: "secret" },
    } as never),
    /unexpected field content/,
  );
});
