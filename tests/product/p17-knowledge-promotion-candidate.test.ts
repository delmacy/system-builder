import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
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
