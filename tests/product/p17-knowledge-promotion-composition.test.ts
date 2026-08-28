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

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category: "human-decision" },
    metadata: { authorityRef },
    riskCriticality: { risk: "high", criticality: "critical" },
  } as const;
}

function predecessor(options?: { permissionRef?: string | null; outcome?: "allow" | "deny" | "isolate" }) {
  const permissionRef = options && "permissionRef" in options ? options.permissionRef ?? null : "permission:owner-001";
  const outcome = options?.outcome ?? "allow";
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
      outcome,
      reasonIds: [outcome === "allow" ? "restriction:owner-permission-present" : "restriction:blocked"],
    },
    eligibilityRef: "eligibility:001",
    permissionRef,
  } as const;
}

function compositionInput() {
  return {
    candidateRef: "candidate:001",
    predecessor: predecessor(),
    transformation: {
      transformationRef: "transformation:001",
      policy: { policyRef: "policy:transform:001", permittedKinds: ["generalization"] },
      kind: "generalization",
    },
    genericityEvidence: {
      evidenceRef: "genericity:001",
      evidenceKind: "deterministic-test",
      result: "supports-genericity",
      sourceRef: "test-suite:genericity:001",
    },
    promotionDecision: {
      decisionRef: "promotion-decision:001",
      disposition: "promote",
      decisionActorRef: "human:promotion-reviewer-01",
      humanAuthority: humanAuthority("human:promotion-reviewer-01", "boundary:promotion-001"),
    },
  } as const;
}

test("TASK-383 composes canonical WBS 17.1 -> 17.2 -> 17.3 promotion truth", () => {
  const result = composeKnowledgePromotionControl(compositionInput());

  assert.equal(result.contractVersion, "1.0.0");
  assert.equal(result.candidate.classificationDecisionRef, "decision:classification-001");
  assert.equal(result.candidate.enforcementRef, "enforcement:001");
  assert.equal(result.candidate.eligibilityRef, "eligibility:001");
  assert.equal(result.transformation.sourceCandidateRef, result.candidate.candidateRef);
  assert.equal(result.genericityEvidence.transformationRef, result.transformation.transformationRef);
  assert.equal(result.decision.genericityEvidenceRef, result.genericityEvidence.evidenceRef);
  assert.equal(result.decision.humanAuthorityRef, "human:promotion-reviewer-01");
  assert.equal(result.decision.disposition, "promote");
  assert.equal("payload" in result, false);
  assert.equal("content" in result, false);
});

test("TASK-383 fails closed for denied or ineligible canonical predecessor truth", () => {
  assert.throws(
    () => composeKnowledgePromotionControl({ ...compositionInput(), predecessor: predecessor({ outcome: "deny" }) }),
    /requires canonical eligible predecessor state/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({ ...compositionInput(), predecessor: predecessor({ permissionRef: null }) }),
    /requires canonical eligible predecessor state/,
  );
});

test("TASK-383 rejects deterministic/probabilistic authority substitution and actor mismatch", () => {
  const base = compositionInput();
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      promotionDecision: {
        ...base.promotionDecision,
        humanAuthority: {
          descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId: "det:001", category: "deterministic" },
          metadata: { invariantRef: "invariant:001" },
          riskCriticality: { risk: "high", criticality: "critical" },
        },
      },
    }),
    /requires verified human-decision authority/,
  );

  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      promotionDecision: {
        ...base.promotionDecision,
        humanAuthority: {
          descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId: "prob:001", category: "probabilistic" },
          metadata: {
            inferenceRef: "inference:001",
            inferenceContext: { confidence: 1, modelRef: "model:001", contextRef: "context:001" },
          },
          riskCriticality: { risk: "high", criticality: "critical" },
        },
      },
    }),
    /requires verified human-decision authority/,
  );

  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      promotionDecision: { ...base.promotionDecision, decisionActorRef: "human:other" },
    }),
    /actor must match verified human authorityRef/,
  );
});

test("TASK-383 rejects caller-injected refs and sensitive payload/content state", () => {
  const base = compositionInput();
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

  assert.throws(
    () => composeKnowledgePromotionControl({ ...base, payload: "secret" } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      transformation: { ...base.transformation, policy: { ...base.transformation.policy, content: "raw" } },
    } as never),
    /transformation policy has unexpected field content/,
  );
  assert.throws(
    () => composeKnowledgePromotionControl({
      ...base,
      predecessor: {
        ...base.predecessor,
        bundle: {
          ...base.predecessor.bundle,
          classification: { ...base.predecessor.bundle.classification, payload: "secret" },
        },
      },
    } as never),
    /unexpected field payload/,
  );
});
