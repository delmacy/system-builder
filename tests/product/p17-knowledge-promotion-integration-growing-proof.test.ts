import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateCatalogKnowledgePromotionAdmission,
  evaluateCatalogKnowledgePromotionPreAdmission,
} from "../../packages/catalog/index.js";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { projectKnowledgePromotionProvenanceForObservation } from "../../packages/observe/index.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId,
      category: "human-decision",
    },
    metadata: { authorityRef },
    riskCriticality: { risk: "high", criticality: "critical" },
  } as const;
}

function canonicalReview() {
  return {
    candidateRef: "candidate:integration-proof",
    predecessor: {
      bundle: {
        classification: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
          knowledgeClass: "client-proprietary",
          ownerRef: "client:integration-proof",
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
          decisionActorRef: "human:classification-integration",
          decisionRef: "decision:classification:integration",
          humanAuthority: humanAuthority(
            "human:classification-integration",
            "boundary:classification:integration",
          ),
        },
      },
      usePolicyRef: "policy:classification:integration",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef: "enforcement:integration",
        classificationDecisionRef: "decision:classification:integration",
        usePolicyRef: "policy:classification:integration",
        purposeId: "promotion-candidate",
        outcome: "allow",
        reasonIds: ["owner-permission-present"],
      },
      eligibilityRef: "eligibility:integration",
      permissionRef: "permission:integration",
    },
    transformation: {
      transformationRef: "transformation:integration",
      policy: {
        policyRef: "policy:transformation:integration",
        permittedKinds: ["generalization"],
      },
      kind: "generalization",
    },
    genericityEvidence: {
      evidenceRef: "genericity:integration",
      evidenceKind: "human-review",
      result: "supports-genericity",
      sourceRef: "review:integration",
    },
  } as const;
}

function decision(disposition: "promote" | "reject") {
  return {
    decisionRef: `promotion-decision:${disposition}:integration`,
    disposition,
    decisionActorRef: "human:promotion-integration",
    humanAuthority: humanAuthority(
      "human:promotion-integration",
      `boundary:promotion:${disposition}:integration`,
    ),
  } as const;
}

test("TASK-389 proves canonical WBS 17.1 -> 17.2 -> 17.3 truth through catalog and Observe consumers", () => {
  const review = canonicalReview();
  const preAdmission = evaluateCatalogKnowledgePromotionPreAdmission(review);
  assert.equal(preAdmission.status, "review-ready");
  assert.equal(preAdmission.classificationDecisionRef, "decision:classification:integration");
  assert.equal(preAdmission.enforcementRef, "enforcement:integration");
  assert.equal(preAdmission.eligibilityRef, "eligibility:integration");

  const promotionDecision = decision("promote");
  const admission = evaluateCatalogKnowledgePromotionAdmission({ review, promotionDecision });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.promotionDecisionRef, "promotion-decision:promote:integration");
  assert.equal(admission.humanAuthorityRef, "human:promotion-integration");

  const observation = projectKnowledgePromotionProvenanceForObservation({
    candidateRef: review.candidateRef,
    predecessor: review.predecessor,
    transformation: review.transformation,
    genericityEvidence: review.genericityEvidence,
    promotionDecision,
  });
  assert.equal(observation.disposition, "promote");
  assert.equal(observation.promotionDecisionRef, admission.promotionDecisionRef);
  assert.equal(observation.humanAuthorityRef, admission.humanAuthorityRef);
  assert.equal(observation.classificationDecisionRef, admission.classificationDecisionRef);
  assert.equal(observation.enforcementRef, admission.enforcementRef);
  assert.equal(observation.eligibilityRef, admission.eligibilityRef);
  assert.equal("payload" in observation, false);
  assert.equal("content" in observation, false);
});

test("TASK-389 proves canonical rejection remains observable and cannot become catalog admission", () => {
  const review = canonicalReview();
  const rejectionDecision = decision("reject");
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({ review, promotionDecision: rejectionDecision }),
    /requires canonical promote decision/,
  );
  const observation = projectKnowledgePromotionProvenanceForObservation({
    candidateRef: review.candidateRef,
    predecessor: review.predecessor,
    transformation: review.transformation,
    genericityEvidence: review.genericityEvidence,
    promotionDecision: rejectionDecision,
  });
  assert.equal(observation.disposition, "reject");
  assert.equal(observation.humanAuthorityRef, "human:promotion-integration");
  assert.equal("reuseApproved" in observation, false);
});

test("TASK-389 fails closed when canonical predecessor provenance or sensitive boundaries are forged", () => {
  const review = canonicalReview();
  const forged = {
    ...review,
    predecessor: {
      ...review.predecessor,
      enforcement: {
        ...review.predecessor.enforcement,
        classificationDecisionRef: "decision:forged",
      },
    },
  } as const;
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({ review: forged, promotionDecision: decision("promote") }),
    /must match canonical classification decisionRef/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      candidateRef: forged.candidateRef,
      predecessor: forged.predecessor,
      transformation: forged.transformation,
      genericityEvidence: forged.genericityEvidence,
      promotionDecision: decision("promote"),
    }),
    /must match canonical classification decisionRef/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      review,
      promotionDecision: decision("promote"),
      payload: "secret",
    } as never),
    /unexpected field payload/,
  );
});
