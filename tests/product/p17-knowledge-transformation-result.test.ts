import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveKnowledgeTransformationResult,
  normalizeKnowledgeTransformationResult,
} from "../../packages/contracts/knowledge-boundary/transformation-result.js";
import { KNOWLEDGE_PROMOTION_CANDIDATE_VERSION } from "../../packages/contracts/knowledge-boundary/promotion-candidate.js";

const candidate = {
  contractVersion: KNOWLEDGE_PROMOTION_CANDIDATE_VERSION,
  candidateRef: "candidate:17.3:001",
  classificationDecisionRef: "decision:17.1:001",
  enforcementRef: "enforcement:17.2:001",
  eligibilityRef: "eligibility:17.2:001",
  knowledgeClass: "generic",
} as const;

test("TASK-380 derives payload-minimal transformation evidence from canonical promotion candidate", () => {
  const result = deriveKnowledgeTransformationResult({
    transformationRef: "transformation:001",
    candidate,
    policy: { policyRef: "policy:transform:001", permittedKinds: ["generalization", "anonymization"] },
    kind: "anonymization",
  });

  assert.deepEqual(result, {
    contractVersion: "1.0.0",
    transformationRef: "transformation:001",
    sourceCandidateRef: "candidate:17.3:001",
    classificationDecisionRef: "decision:17.1:001",
    enforcementRef: "enforcement:17.2:001",
    eligibilityRef: "eligibility:17.2:001",
    policyRef: "policy:transform:001",
    kind: "anonymization",
    status: "applied",
  });
  assert.equal("approval" in result, false);
  assert.equal("authority" in result, false);
  assert.equal("payload" in result, false);
  assert.equal("content" in result, false);
});

test("TASK-380 fails closed when transformation kind is not policy-permitted", () => {
  assert.throws(
    () => deriveKnowledgeTransformationResult({
      transformationRef: "transformation:002",
      candidate,
      policy: { policyRef: "policy:transform:002", permittedKinds: ["generalization"] },
      kind: "anonymization",
    }),
    /not permitted by policy/,
  );
});

test("TASK-380 rejects malformed predecessor candidate and duplicate policy state", () => {
  assert.throws(
    () => deriveKnowledgeTransformationResult({
      transformationRef: "transformation:003",
      candidate: { ...candidate, eligibilityRef: "" },
      policy: { policyRef: "policy:transform:003", permittedKinds: ["anonymization"] },
      kind: "anonymization",
    }),
    /eligibilityRef must be a non-empty string/,
  );

  assert.throws(
    () => deriveKnowledgeTransformationResult({
      transformationRef: "transformation:004",
      candidate,
      policy: { policyRef: "policy:transform:004", permittedKinds: ["anonymization", "anonymization"] },
      kind: "anonymization",
    }),
    /duplicate transformation kind/,
  );
});

test("TASK-380 result normalizer rejects raw payload, content and unknown fields", () => {
  const base = {
    contractVersion: "1.0.0",
    transformationRef: "transformation:005",
    sourceCandidateRef: "candidate:17.3:001",
    classificationDecisionRef: "decision:17.1:001",
    enforcementRef: "enforcement:17.2:001",
    eligibilityRef: "eligibility:17.2:001",
    policyRef: "policy:transform:005",
    kind: "generalization",
    status: "applied",
  } as const;

  assert.throws(() => normalizeKnowledgeTransformationResult({ ...base, payload: "secret" }), /unexpected field payload/);
  assert.throws(() => normalizeKnowledgeTransformationResult({ ...base, content: "raw" }), /unexpected field content/);
  assert.throws(() => normalizeKnowledgeTransformationResult({ ...base, approved: true }), /unexpected field approved/);
});
