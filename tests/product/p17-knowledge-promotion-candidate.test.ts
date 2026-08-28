import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import {
  KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
  deriveKnowledgePromotionCandidateDescriptor,
  normalizeKnowledgePromotionCandidateDescriptor,
} from "../../packages/contracts/knowledge-boundary/promotion-candidate.js";

const candidate = {
  contractVersion: KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
  candidateRef: "candidate:001",
  classificationDecisionRef: "decision:001",
  enforcementRef: "enforcement:001",
  eligibilityRef: "eligibility:001",
  knowledgeClass: "generic",
} as const;

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category: "human-decision" },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

function predecessor(permissionRef: string | null = "permission:owner-001") {
  return {
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
        decisionActorRef: "human:owner-01",
        decisionRef: "decision:classification-001",
        humanAuthority: humanAuthority("human:owner-01", "boundary:classification-001"),
      },
    },
    usePolicyRef: "policy:classification-001",
    enforcement: {
      contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
      enforcementRef: "enforcement:001",
      classificationDecisionRef: "decision:classification-001",
      usePolicyRef: "policy:classification-001",
      purposeId: "promotion-candidate",
      outcome: "allow",
      reasonIds: ["restriction:owner-permission-present"],
    },
    eligibilityRef: "eligibility:001",
    permissionRef,
  } as const;
}

test("promotion candidate normalization is deterministic and payload-minimal", () => {
  const normalized = normalizeKnowledgePromotionCandidateDescriptor({
    ...candidate,
    candidateRef: " candidate:001 ",
  });
  assert.deepEqual(normalized, candidate);
  assert.equal("payload" in normalized, false);
  assert.equal("content" in normalized, false);
  assert.equal("promotionApproved" in normalized, false);
  assert.equal("authorityRef" in normalized, false);
});

test("promotion candidate is derived from a canonical eligible WBS 17.1 -> 17.2 predecessor chain", () => {
  const derived = deriveKnowledgePromotionCandidateDescriptor({
    candidateRef: " candidate:001 ",
    predecessor: predecessor(),
  });
  assert.deepEqual(derived, {
    contractVersion: KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
    candidateRef: "candidate:001",
    classificationDecisionRef: "decision:classification-001",
    enforcementRef: "enforcement:001",
    eligibilityRef: "eligibility:001",
    knowledgeClass: "client-proprietary",
  });
  assert.equal("payload" in derived, false);
  assert.equal("content" in derived, false);
  assert.equal("promotionApproved" in derived, false);
});

test("promotion candidate derivation fails closed when canonical predecessor eligibility is denied", () => {
  assert.throws(
    () => deriveKnowledgePromotionCandidateDescriptor({
      candidateRef: "candidate:001",
      predecessor: predecessor(null),
    }),
    /requires canonical eligible predecessor state/,
  );
});

test("promotion candidate fails closed for extra state and malformed predecessor refs", () => {
  assert.throws(
    () => normalizeKnowledgePromotionCandidateDescriptor({ ...candidate, payload: "sensitive" }),
    /unexpected field payload/,
  );
  assert.throws(
    () => normalizeKnowledgePromotionCandidateDescriptor({ ...candidate, eligibilityRef: "   " }),
    /eligibilityRef must be a non-empty string/,
  );
  assert.throws(
    () => normalizeKnowledgePromotionCandidateDescriptor({ ...candidate, contractVersion: "2.0.0" }),
    /unsupported knowledge promotion candidate version/,
  );
});
