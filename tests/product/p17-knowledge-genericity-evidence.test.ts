import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveKnowledgeGenericityEvidence,
  normalizeKnowledgeGenericityEvidence,
} from "../../packages/contracts/knowledge-boundary/genericity-evidence.js";
import { KNOWLEDGE_PROMOTION_CANDIDATE_VERSION } from "../../packages/contracts/knowledge-boundary/promotion-candidate.js";
import { KNOWLEDGE_TRANSFORMATION_RESULT_VERSION } from "../../packages/contracts/knowledge-boundary/transformation-result.js";

const candidate = {
  contractVersion: KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
  candidateRef: "candidate:17.3:001",
  classificationDecisionRef: "decision:17.1:001",
  enforcementRef: "enforcement:17.2:001",
  eligibilityRef: "eligibility:17.2:001",
  knowledgeClass: "generic",
} as const;

const transformation = {
  contractVersion: KNOWLEDGE_TRANSFORMATION_RESULT_VERSION,
  transformationRef: "transformation:001",
  sourceCandidateRef: candidate.candidateRef,
  classificationDecisionRef: candidate.classificationDecisionRef,
  enforcementRef: candidate.enforcementRef,
  eligibilityRef: candidate.eligibilityRef,
  policyRef: "policy:transform:001",
  kind: "generalization",
  status: "applied",
} as const;

test("TASK-381 derives deterministic payload-minimal genericity evidence", () => {
  const evidence = deriveKnowledgeGenericityEvidence({
    evidenceRef: "genericity:001",
    candidate,
    transformation,
    evidenceKind: "deterministic-test",
    result: "supports-genericity",
    sourceRef: "test-suite:genericity:001",
  });

  assert.deepEqual(evidence, {
    contractVersion: "1.0.0",
    evidenceRef: "genericity:001",
    candidateRef: "candidate:17.3:001",
    transformationRef: "transformation:001",
    evidenceKind: "deterministic-test",
    result: "supports-genericity",
    sourceRef: "test-suite:genericity:001",
  });
  assert.equal("approval" in evidence, false);
  assert.equal("authority" in evidence, false);
  assert.equal("payload" in evidence, false);
  assert.equal("content" in evidence, false);
});

test("TASK-381 keeps probabilistic evidence non-authoritative", () => {
  const evidence = deriveKnowledgeGenericityEvidence({
    evidenceRef: "genericity:002",
    candidate,
    transformation,
    evidenceKind: "probabilistic-assessment",
    result: "supports-genericity",
    sourceRef: "assessment:model:001",
  });

  assert.equal(evidence.result, "supports-genericity");
  assert.equal(evidence.evidenceKind, "probabilistic-assessment");
  assert.equal("approved" in evidence, false);
  assert.equal("promotionStatus" in evidence, false);
});

test("TASK-381 fails closed on candidate/transformation predecessor mismatch", () => {
  assert.throws(
    () => deriveKnowledgeGenericityEvidence({
      evidenceRef: "genericity:003",
      candidate,
      transformation: { ...transformation, sourceCandidateRef: "candidate:other" },
      evidenceKind: "human-review",
      result: "rejects-genericity",
      sourceRef: "review:001",
    }),
    /candidateRef must match transformation sourceCandidateRef/,
  );

  assert.throws(
    () => deriveKnowledgeGenericityEvidence({
      evidenceRef: "genericity:004",
      candidate,
      transformation: { ...transformation, enforcementRef: "enforcement:other" },
      evidenceKind: "deterministic-test",
      result: "supports-genericity",
      sourceRef: "test-suite:genericity:004",
    }),
    /enforcementRef predecessor mismatch/,
  );
});

test("TASK-381 rejects unknown, conflicting and sensitive evidence state", () => {
  const base = {
    contractVersion: "1.0.0",
    evidenceRef: "genericity:005",
    candidateRef: "candidate:17.3:001",
    transformationRef: "transformation:001",
    evidenceKind: "human-review",
    result: "supports-genericity",
    sourceRef: "review:005",
  } as const;

  assert.throws(() => normalizeKnowledgeGenericityEvidence({ ...base, result: "approved" }), /unsupported genericity evidence result/);
  assert.throws(() => normalizeKnowledgeGenericityEvidence({ ...base, approval: true }), /unexpected field approval/);
  assert.throws(() => normalizeKnowledgeGenericityEvidence({ ...base, payload: "secret" }), /unexpected field payload/);
  assert.throws(() => normalizeKnowledgeGenericityEvidence({ ...base, sourceRef: "" }), /sourceRef must be a non-empty string/);
});
