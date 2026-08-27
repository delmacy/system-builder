import assert from "node:assert/strict";
import test from "node:test";
import { AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION } from "../../packages/contracts/ai-gateway/data-knowledge-boundary.js";
import { evaluatePreSendBoundary } from "../../packages/contracts/ai-gateway/pre-send-boundary-evaluation.js";

const boundary = {
  contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
  boundaryId: "boundary:assistant",
  allowedDataClasses: ["internal-approved", "public"],
  allowedKnowledgeRefs: ["knowledge:handbook", "knowledge:public-faq"],
} as const;

test("pre-send boundary evaluator deterministically allows declared evidence", () => {
  assert.deepEqual(evaluatePreSendBoundary({
    boundary,
    evidence: {
      boundaryId: "boundary:assistant",
      dataClasses: ["public", "internal-approved"],
      knowledgeRefs: ["knowledge:public-faq"],
    },
  }), {
    status: "allowed",
    boundaryId: "boundary:assistant",
    reasons: [],
  });
});

test("pre-send boundary evaluator rejects mismatched or undeclared evidence fail closed", () => {
  assert.deepEqual(evaluatePreSendBoundary({
    boundary,
    evidence: {
      boundaryId: "boundary:other",
      dataClasses: ["restricted", "public"],
      knowledgeRefs: ["knowledge:unknown"],
    },
  }), {
    status: "rejected",
    boundaryId: "boundary:assistant",
    reasons: [
      { code: "boundary-mismatch", subject: "boundary:other" },
      { code: "data-class-not-allowed", subject: "restricted" },
      { code: "knowledge-ref-not-allowed", subject: "knowledge:unknown" },
    ],
  });
});

test("pre-send boundary evaluator returns invalid for malformed descriptor or evidence", () => {
  const malformedBoundary = evaluatePreSendBoundary({
    boundary: { ...boundary, providerId: "provider:hidden" },
    evidence: { boundaryId: "boundary:assistant", dataClasses: [], knowledgeRefs: [] },
  });
  assert.equal(malformedBoundary.status, "invalid");
  assert.equal(malformedBoundary.reasons[0]?.code, "malformed-boundary");

  const malformedEvidence = evaluatePreSendBoundary({
    boundary,
    evidence: {
      boundaryId: "boundary:assistant",
      dataClasses: ["public", "public"],
      knowledgeRefs: [],
      approved: true,
    },
  });
  assert.equal(malformedEvidence.status, "invalid");
  assert.equal(malformedEvidence.reasons[0]?.code, "malformed-evidence");
});

test("pre-send evaluation result fabricates no approval, authorization, provider or secret semantics", () => {
  const result = evaluatePreSendBoundary({
    boundary,
    evidence: { boundaryId: "boundary:assistant", dataClasses: [], knowledgeRefs: [] },
  });
  assert.equal(result.status, "allowed");
  assert.equal("approved" in result, false);
  assert.equal("authorized" in result, false);
  assert.equal("providerId" in result, false);
  assert.equal("credential" in result, false);
});
