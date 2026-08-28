import assert from "node:assert/strict";
import test from "node:test";

import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { composeKnowledgePromotionControl } from "../../packages/contracts/knowledge-boundary/promotion-composition.js";

function authority(authorityRef: string, decisionId: string, category: "human-decision" | "deterministic" | "probabilistic" = "human-decision") {
  if (category === "deterministic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: { invariantRef: "invariant:promotion" },
      riskCriticality: { risk: "high", criticality: "critical" },
    } as const;
  }
  if (category === "probabilistic") {
    return {
      descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category },
      metadata: {
        inferenceRef: "inference:promotion",
        inferenceContext: { confidence: 1, modelRef: "model:promotion", contextRef: "context:promotion" },
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
    candidateRef: "candidate:growing-proof:001",
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
          decisionRef: "decision:classification:growing-proof",
          humanAuthority: authority("human:classification-owner", "boundary:classification:growing-proof"),
        },
      },
      usePolicyRef: "policy:classification:growing-proof",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef: "enforcement:growing-proof",
        classificationDecisionRef: "decision:classification:growing-proof",
        usePolicyRef: "policy:classification:growing-proof",
        purposeId: "promotion-candidate",
        outcome: "allow",
        reasonIds: ["owner-permission-present"],
      },
      eligibilityRef: "eligibility:growing-proof",
      permissionRef: "permission:growing-proof",
    },
    transformation: {
      transformationRef: "transformation:growing-proof",
      policy: { policyRef: "policy:transform:growing-proof", permittedKinds: ["generalization", "anonymization"] },
      kind: "generalization",
    },
    genericityEvidence: {
      evidenceRef: "genericity:growing-proof",
      evidenceKind: "human-review",
      result: "supports-genericity",
      sourceRef: "review:growing-proof",
    },
    promotionDecision: {
      decisionRef: `promotion-decision:${disposition}:growing-proof`,
      disposition,
      decisionActorRef: "human:promotion-owner",
      humanAuthority: authority("human:promotion-owner", `boundary:promotion:${disposition}:growing-proof`),
    },
  } as const;
}

test("TASK-384 growing proof records promotion and rejection through canonical predecessor + M15 human authority", () => {
  const promote = composeKnowledgePromotionControl(canonicalInput("promote"));
  const reject = composeKnowledgePromotionControl(canonicalInput("reject"));

  assert.equal(promote.candidate.classificationDecisionRef, "decision:classification:growing-proof");
  assert.equal(promote.candidate.enforcementRef, "enforcement:growing-proof");
  assert.equal(promote.candidate.eligibilityRef, "eligibility:growing-proof");
  assert.equal(promote.decision.disposition, "promote");
  assert.equal(promote.decision.humanAuthorityRef, "human:promotion-owner");
  assert.equal(reject.decision.disposition, "reject");
  assert.equal(reject.decision.humanAuthorityRef, "human:promotion-owner");
});

test("TASK-384 proves eligibility, transformation and genericity evidence cannot independently authorize promotion", () => {
  const base = canonicalInput("promote");
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      predecessor: { ...base.predecessor, permissionRef: null },
    }),
    /requires canonical eligible predecessor state/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      transformation: { ...base.transformation, kind: "anonymization", policy: { ...base.transformation.policy, permittedKinds: ["generalization"] } },
    }),
    /not permitted by policy/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      genericityEvidence: { ...base.genericityEvidence, result: "rejects-genericity" },
    }),
    /cannot promote when genericity evidence rejects genericity/,
  );
});

test("TASK-384 proves non-human substitution, actor/ref mismatch and forged predecessor state fail closed", () => {
  const base = canonicalInput("promote");
  for (const category of ["deterministic", "probabilistic"] as const) {
    assert.throws(
      () => composeKnowledgePromotionControl({
        ...base,
        promotionDecision: {
          ...base.promotionDecision,
          humanAuthority: authority("human:promotion-owner", `boundary:${category}`, category),
        },
      } as never),
      /requires verified human-decision authority/,
    );
  }
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      promotionDecision: { ...base.promotionDecision, decisionActorRef: "human:attacker" },
    }),
    /actor must match verified human authorityRef/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      predecessor: {
        ...base.predecessor,
        enforcement: { ...base.predecessor.enforcement, classificationDecisionRef: "decision:forged" },
      },
    }),
    /must match canonical classification decisionRef/,
  );
});

test("TASK-384 proves unknown and sensitive payload/content state cannot enter the aggregate", () => {
  const base = canonicalInput("promote");
  assert.throws(() => composeKnowledgePromotionControl({ ...base, payload: "secret" } as never), /unexpected field payload/);
  assert.throws(
    () => composeKnowledgePromotionControl({ ...base, genericityEvidence: { ...base.genericityEvidence, content: "raw" } } as never),
    /genericity request has unexpected field content/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({ ...base, promotionDecision: { ...base.promotionDecision, disposition: "approved" } } as never),
    /unsupported knowledge promotion disposition/,
  );
});
