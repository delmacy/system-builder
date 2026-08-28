import assert from "node:assert/strict";
import test from "node:test";

import { KNOWLEDGE_GENERICITY_EVIDENCE_VERSION } from "../../packages/contracts/knowledge-boundary/genericity-evidence.js";
import {
  deriveKnowledgePromotionDecision,
  normalizeKnowledgePromotionDecision,
} from "../../packages/contracts/knowledge-boundary/promotion-decision.js";
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

const genericityEvidence = {
  contractVersion: KNOWLEDGE_GENERICITY_EVIDENCE_VERSION,
  evidenceRef: "genericity:001",
  candidateRef: candidate.candidateRef,
  transformationRef: transformation.transformationRef,
  evidenceKind: "deterministic-test",
  result: "supports-genericity",
  sourceRef: "test-suite:genericity:001",
} as const;

const humanAuthority = {
  descriptor: { boundaryVersion: "1.0.0", decisionId: "promotion-human-decision:001", category: "human-decision" },
  metadata: { authorityRef: "human:reviewer:001" },
  riskCriticality: { risk: "high", criticality: "critical" },
} as const;

test("TASK-382 records promotion provenance only through canonical human-decision authority", () => {
  const decision = deriveKnowledgePromotionDecision({
    decisionRef: "promotion-decision:001",
    disposition: "promote",
    decisionActorRef: "human:reviewer:001",
    candidate,
    transformation,
    genericityEvidence,
    humanAuthority,
  });

  assert.deepEqual(decision, {
    contractVersion: "1.0.0",
    decisionRef: "promotion-decision:001",
    disposition: "promote",
    decisionActorRef: "human:reviewer:001",
    humanDecisionId: "promotion-human-decision:001",
    humanAuthorityRef: "human:reviewer:001",
    candidateRef: "candidate:17.3:001",
    transformationRef: "transformation:001",
    genericityEvidenceRef: "genericity:001",
  });
  assert.equal("payload" in decision, false);
  assert.equal("content" in decision, false);
  assert.equal("modelRef" in decision, false);
});

test("TASK-382 rejects deterministic and probabilistic substitution for human authority", () => {
  assert.throws(
    () => deriveKnowledgePromotionDecision({
      decisionRef: "promotion-decision:002",
      disposition: "promote",
      decisionActorRef: "human:reviewer:001",
      candidate,
      transformation,
      genericityEvidence,
      humanAuthority: {
        descriptor: { boundaryVersion: "1.0.0", decisionId: "det:001", category: "deterministic" },
        metadata: { invariantRef: "invariant:001" },
        riskCriticality: { risk: "high", criticality: "critical" },
      },
    }),
    /requires verified human-decision authority/,
  );

  assert.throws(
    () => deriveKnowledgePromotionDecision({
      decisionRef: "promotion-decision:003",
      disposition: "promote",
      decisionActorRef: "human:reviewer:001",
      candidate,
      transformation,
      genericityEvidence,
      humanAuthority: {
        descriptor: { boundaryVersion: "1.0.0", decisionId: "prob:001", category: "probabilistic" },
        metadata: {
          inferenceRef: "inference:001",
          inferenceContext: { confidence: 0.99, modelRef: "model:001", contextRef: "context:001" },
        },
        riskCriticality: { risk: "high", criticality: "critical" },
      },
    }),
    /requires verified human-decision authority/,
  );
});

test("TASK-382 rejects actor and evidence mismatch and conflicting promotion evidence", () => {
  assert.throws(
    () => deriveKnowledgePromotionDecision({
      decisionRef: "promotion-decision:004",
      disposition: "promote",
      decisionActorRef: "human:other",
      candidate,
      transformation,
      genericityEvidence,
      humanAuthority,
    }),
    /actor must match verified human authorityRef/,
  );

  assert.throws(
    () => deriveKnowledgePromotionDecision({
      decisionRef: "promotion-decision:005",
      disposition: "promote",
      decisionActorRef: "human:reviewer:001",
      candidate,
      transformation,
      genericityEvidence: { ...genericityEvidence, transformationRef: "transformation:other" },
      humanAuthority,
    }),
    /genericity evidence transformation mismatch/,
  );

  assert.throws(
    () => deriveKnowledgePromotionDecision({
      decisionRef: "promotion-decision:006",
      disposition: "promote",
      decisionActorRef: "human:reviewer:001",
      candidate,
      transformation,
      genericityEvidence: { ...genericityEvidence, result: "rejects-genericity" },
      humanAuthority,
    }),
    /cannot promote when genericity evidence rejects genericity/,
  );
});

test("TASK-382 normalization is payload-minimal and fails closed on authority-like additions", () => {
  const record = {
    contractVersion: "1.0.0",
    decisionRef: "promotion-decision:007",
    disposition: "reject",
    decisionActorRef: "human:reviewer:001",
    humanDecisionId: "promotion-human-decision:001",
    humanAuthorityRef: "human:reviewer:001",
    candidateRef: "candidate:17.3:001",
    transformationRef: "transformation:001",
    genericityEvidenceRef: "genericity:001",
  } as const;

  assert.throws(() => normalizeKnowledgePromotionDecision({ ...record, approval: true }), /unexpected field approval/);
  assert.throws(() => normalizeKnowledgePromotionDecision({ ...record, payload: "secret" }), /unexpected field payload/);
  assert.throws(() => normalizeKnowledgePromotionDecision({ ...record, disposition: "approved" }), /unsupported knowledge promotion disposition/);
});
