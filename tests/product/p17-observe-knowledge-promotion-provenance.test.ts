import assert from "node:assert/strict";
import test from "node:test";

import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { projectKnowledgePromotionProvenanceForObservation } from "../../packages/observe/index.js";

function authority(authorityRef: string, decisionId: string, category: "human-decision" | "deterministic" | "probabilistic" = "human-decision") {
  if (category === "deterministic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: { invariantRef: "invariant:observe-promotion" },
      riskCriticality: { risk: "high", criticality: "critical" },
    } as const;
  }
  if (category === "probabilistic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: {
        inferenceRef: "inference:observe-promotion",
        inferenceContext: { confidence: 1, modelRef: "model:observe-promotion", contextRef: "context:observe-promotion" },
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

function canonicalInput(disposition: "promote" | "reject" = "promote") {
  return {
    candidateRef: "candidate:observe:001",
    predecessor: {
      bundle: {
        classification: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
          knowledgeClass: "client-proprietary",
          ownerRef: "client:observe",
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
          decisionActorRef: "human:classification-observe",
          decisionRef: "decision:classification:observe",
          humanAuthority: authority("human:classification-observe", "boundary:classification:observe"),
        },
      },
      usePolicyRef: "policy:classification:observe",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef: "enforcement:observe",
        classificationDecisionRef: "decision:classification:observe",
        usePolicyRef: "policy:classification:observe",
        purposeId: "promotion-candidate",
        outcome: "allow",
        reasonIds: ["owner-permission-present"],
      },
      eligibilityRef: "eligibility:observe",
      permissionRef: "permission:observe",
    },
    transformation: {
      transformationRef: "transformation:observe",
      policy: { policyRef: "policy:transform:observe", permittedKinds: ["generalization"] },
      kind: "generalization",
    },
    genericityEvidence: {
      evidenceRef: "genericity:observe",
      evidenceKind: "human-review",
      result: "supports-genericity",
      sourceRef: "review:observe",
    },
    promotionDecision: {
      decisionRef: `promotion-decision:${disposition}:observe`,
      disposition,
      decisionActorRef: "human:promotion-observe",
      humanAuthority: authority("human:promotion-observe", `boundary:promotion:${disposition}:observe`),
    },
  } as const;
}

test("TASK-387 projects canonical promotion and rejection provenance without payload/content", () => {
  for (const disposition of ["promote", "reject"] as const) {
    const projection = projectKnowledgePromotionProvenanceForObservation(canonicalInput(disposition));
    assert.equal(projection.disposition, disposition);
    assert.equal(projection.classificationDecisionRef, "decision:classification:observe");
    assert.equal(projection.enforcementRef, "enforcement:observe");
    assert.equal(projection.eligibilityRef, "eligibility:observe");
    assert.equal(projection.humanAuthorityRef, "human:promotion-observe");
    assert.equal("payload" in projection, false);
    assert.equal("content" in projection, false);
  }
});

test("TASK-387 owns canonical validation and fails closed for caller injection and malformed provenance", () => {
  const base = canonicalInput("promote");
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({ ...base, validator: () => base } as never),
    /unexpected field validator/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({ ...base, payload: "secret" } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      ...base,
      predecessor: { ...base.predecessor, enforcement: { ...base.predecessor.enforcement, classificationDecisionRef: "decision:forged" } },
    }),
    /must match canonical classification decisionRef/,
  );
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({ ...base, transformation: { ...base.transformation, transformationRef: base.candidateRef } }),
    /must not contain duplicate references/,
  );
});

test("TASK-387 never accepts deterministic/probabilistic substitution or actor/ref mismatch as promotion authority", () => {
  const base = canonicalInput("promote");
  for (const category of ["deterministic", "probabilistic"] as const) {
    assert.throws(
      () => projectKnowledgePromotionProvenanceForObservation({
        ...base,
        promotionDecision: { ...base.promotionDecision, humanAuthority: authority("human:promotion-observe", `boundary:${category}`, category) },
      } as never),
      /requires verified human-decision authority/,
    );
  }
  assert.throws(
    () => projectKnowledgePromotionProvenanceForObservation({
      ...base,
      promotionDecision: { ...base.promotionDecision, decisionActorRef: "human:attacker" },
    }),
    /actor must match verified human authorityRef/,
  );
});
