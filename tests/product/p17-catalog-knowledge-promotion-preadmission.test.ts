import assert from "node:assert/strict";
import test from "node:test";
import {
  CATALOG_KNOWLEDGE_PROMOTION_PREADMISSION_VERSION,
  evaluateCatalogKnowledgePromotionPreAdmission,
} from "../../packages/catalog/index.js";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";

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

function input(result: "supports-genericity" | "rejects-genericity" = "supports-genericity") {
  return {
    candidateRef: "candidate:001",
    predecessor: predecessor(),
    transformation: {
      transformationRef: "transformation:001",
      policy: {
        policyRef: "policy:transformation-001",
        permittedKinds: ["anonymization"],
      },
      kind: "anonymization",
    },
    genericityEvidence: {
      evidenceRef: "evidence:genericity-001",
      evidenceKind: "deterministic-test",
      result,
      sourceRef: "test:genericity-suite-001",
    },
  } as const;
}

test("catalog promotion pre-admission derives review readiness from canonical WBS 17 truth", () => {
  const result = evaluateCatalogKnowledgePromotionPreAdmission(input());
  assert.deepEqual(result, {
    contractVersion: CATALOG_KNOWLEDGE_PROMOTION_PREADMISSION_VERSION,
    status: "review-ready",
    candidateRef: "candidate:001",
    classificationDecisionRef: "decision:classification-001",
    enforcementRef: "enforcement:001",
    eligibilityRef: "eligibility:001",
    transformationRef: "transformation:001",
    genericityEvidenceRef: "evidence:genericity-001",
  });
  assert.equal("promotionApproved" in result, false);
  assert.equal("reuseApproved" in result, false);
  assert.equal("authorityRef" in result, false);
  assert.equal("payload" in result, false);
  assert.equal("content" in result, false);
});

test("catalog promotion pre-admission fails closed for denied eligibility", () => {
  const denied = { ...input(), predecessor: predecessor(null) };
  assert.throws(
    () => evaluateCatalogKnowledgePromotionPreAdmission(denied),
    /requires canonical eligible predecessor state/,
  );
});

test("catalog promotion pre-admission fails closed for transformation or genericity failure", () => {
  const transformationDenied = {
    ...input(),
    transformation: {
      transformationRef: "transformation:001",
      policy: { policyRef: "policy:transformation-001", permittedKinds: ["generalization"] },
      kind: "anonymization",
    },
  } as const;
  assert.throws(
    () => evaluateCatalogKnowledgePromotionPreAdmission(transformationDenied),
    /is not permitted by policy/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionPreAdmission(input("rejects-genericity")),
    /requires genericity-supporting evidence/,
  );
});

test("catalog promotion pre-admission rejects payload/content injection", () => {
  assert.throws(
    () => evaluateCatalogKnowledgePromotionPreAdmission({ ...input(), payload: "sensitive" } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => evaluateCatalogKnowledgePromotionPreAdmission({
      ...input(),
      genericityEvidence: { ...input().genericityEvidence, content: "sensitive" },
    } as never),
    /unexpected field content/,
  );
});
