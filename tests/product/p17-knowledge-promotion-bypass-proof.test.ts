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

function authority(
  authorityRef: string,
  decisionId: string,
  category: "human-decision" | "deterministic" | "probabilistic" = "human-decision",
) {
  if (category === "deterministic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: { invariantRef: "invariant:promotion-bypass-proof" },
      riskCriticality: { risk: "high", criticality: "critical" },
    } as const;
  }
  if (category === "probabilistic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: {
        inferenceRef: "inference:promotion-bypass-proof",
        inferenceContext: {
          confidence: 1,
          modelRef: "model:promotion-bypass-proof",
          contextRef: "context:promotion-bypass-proof",
        },
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

function review(permissionRef: string | null = "permission:bypass-proof") {
  return {
    candidateRef: "candidate:bypass-proof",
    predecessor: {
      bundle: {
        classification: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
          knowledgeClass: "client-proprietary",
          ownerRef: "client:bypass-proof",
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
          decisionActorRef: "human:classification-bypass-proof",
          decisionRef: "decision:classification:bypass-proof",
          humanAuthority: authority(
            "human:classification-bypass-proof",
            "boundary:classification:bypass-proof",
          ),
        },
      },
      usePolicyRef: "policy:classification:bypass-proof",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef: "enforcement:bypass-proof",
        classificationDecisionRef: "decision:classification:bypass-proof",
        usePolicyRef: "policy:classification:bypass-proof",
        purposeId: "promotion-candidate",
        outcome: "allow",
        reasonIds: ["owner-permission-present"],
      },
      eligibilityRef: "eligibility:bypass-proof",
      permissionRef,
    },
    transformation: {
      transformationRef: "transformation:bypass-proof",
      policy: {
        policyRef: "policy:transformation:bypass-proof",
        permittedKinds: ["generalization"],
      },
      kind: "generalization",
    },
    genericityEvidence: {
      evidenceRef: "genericity:bypass-proof",
      evidenceKind: "human-review",
      result: "supports-genericity",
      sourceRef: "review:bypass-proof",
    },
  } as const;
}

function promotionDecision(
  disposition: "promote" | "reject" = "promote",
  category: "human-decision" | "deterministic" | "probabilistic" = "human-decision",
  decisionActorRef = "human:promotion-bypass-proof",
) {
  return {
    decisionRef: `promotion-decision:${disposition}:bypass-proof`,
    disposition,
    decisionActorRef,
    humanAuthority: authority(
      "human:promotion-bypass-proof",
      `boundary:promotion:${disposition}:bypass-proof`,
      category,
    ),
  } as const;
}

function observeInput(disposition: "promote" | "reject" = "promote") {
  const canonicalReview = review();
  return {
    candidateRef: canonicalReview.candidateRef,
    predecessor: canonicalReview.predecessor,
    transformation: canonicalReview.transformation,
    genericityEvidence: canonicalReview.genericityEvidence,
    promotionDecision: promotionDecision(disposition),
  } as const;
}

test("TASK-388 proves review-ready state cannot be laundered into promotion or reuse authority", () => {
  const canonicalReview = review();
  const preAdmission = evaluateCatalogKnowledgePromotionPreAdmission(canonicalReview);
  assert.equal(preAdmission.status, "review-ready");
  assert.equal("promotionApproved" in preAdmission, false);
  assert.equal("reuseApproved" in preAdmission, false);
  assert.equal("authorityRef" in preAdmission, false);

  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      review: canonicalReview,
      promotionDecision: promotionDecision("reject"),
    }),
    /requires canonical promote decision/,
  );

  const rejection = projectKnowledgePromotionProvenanceForObservation(observeInput("reject"));
  assert.equal(rejection.disposition, "reject");
  assert.equal(rejection.humanAuthorityRef, "human:promotion-bypass-proof");
  assert.equal("reuseApproved" in rejection, false);
  assert.equal("payload" in rejection, false);
  assert.equal("content" in rejection, false);
});

test("TASK-388 proves denied predecessor truth cannot reach review-ready, admitted, or observed promotion state", () => {
  const deniedReview = review(null);
  assert.throws(
    () => evaluateCatalogKnowledgePromotionPreAdmission(deniedReview),
    /requires canonical eligible predecessor state/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      review: deniedReview,
      promotionDecision: promotionDecision(),
    }),
    /requires canonical eligible predecessor state/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      candidateRef: deniedReview.candidateRef,
      predecessor: deniedReview.predecessor,
      transformation: deniedReview.transformation,
      genericityEvidence: deniedReview.genericityEvidence,
      promotionDecision: promotionDecision(),
    }),
    /requires canonical eligible predecessor state/,
  );
});

test("TASK-388 proves deterministic/probabilistic evidence cannot substitute for human promotion authority", () => {
  const canonicalReview = review();
  for (const category of ["deterministic", "probabilistic"] as const) {
    const decision = promotionDecision("promote", category);
    assert.throws(
      () => evaluateCatalogKnowledgePromotionAdmission({
        review: canonicalReview,
        promotionDecision: decision,
      } as never),
      /requires verified human-decision authority/,
    );
    assert.throws(
      () => projectKnowledgePromotionProvenanceForObservation({
        ...observeInput(),
        promotionDecision: decision,
      } as never),
      /requires verified human-decision authority/,
    );
  }
});

test("TASK-388 proves actor/ref mismatch and forged predecessor provenance fail closed across consumers", () => {
  const canonicalReview = review();
  const mismatchedDecision = promotionDecision("promote", "human-decision", "human:attacker");
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      review: canonicalReview,
      promotionDecision: mismatchedDecision,
    }),
    /actor must match verified human authorityRef/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      ...observeInput(),
      promotionDecision: mismatchedDecision,
    }),
    /actor must match verified human authorityRef/,
  );

  const forged = {
    ...canonicalReview,
    predecessor: {
      ...canonicalReview.predecessor,
      enforcement: {
        ...canonicalReview.predecessor.enforcement,
        classificationDecisionRef: "decision:forged",
      },
    },
  } as const;
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      review: forged,
      promotionDecision: promotionDecision(),
    }),
    /must match canonical classification decisionRef/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      candidateRef: forged.candidateRef,
      predecessor: forged.predecessor,
      transformation: forged.transformation,
      genericityEvidence: forged.genericityEvidence,
      promotionDecision: promotionDecision(),
    }),
    /must match canonical classification decisionRef/,
  );
});

test("TASK-388 proves duplicate provenance, validator injection and sensitive payload/content injection fail closed", () => {
  const canonical = observeInput();
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      ...canonical,
      transformation: {
        ...canonical.transformation,
        transformationRef: canonical.candidateRef,
      },
    }),
    /must not contain duplicate references/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      ...canonical,
      validator: () => canonical,
    } as never),
    /unexpected field validator/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionAdmission({
      review: review(),
      promotionDecision: promotionDecision(),
      payload: "secret",
    } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      ...canonical,
      promotionDecision: { ...canonical.promotionDecision, content: "secret" },
    } as never),
    /unexpected field content/,
  );
});
