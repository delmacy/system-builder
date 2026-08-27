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
  KNOWLEDGE_ENFORCEMENT_EVALUATION_VERSION,
  evaluateKnowledgeEnforcement,
} from "../../packages/contracts/knowledge-boundary/enforcement-composition.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category: "human-decision" },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

function bundle() {
  return {
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "client-proprietary",
      ownerRef: " client:acme ",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["support-analysis", " catalog-candidate "],
      restrictionIds: ["owner-permission-required", "no-external-disclosure"],
    },
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass: "client-proprietary",
      decisionActorRef: " human:owner-01 ",
      decisionRef: " decision:classification-001 ",
      humanAuthority: humanAuthority("human:owner-01", "boundary:classification-001"),
    },
  } as const;
}

function enforcement() {
  return {
    contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
    enforcementRef: " enforcement:001 ",
    classificationDecisionRef: "decision:classification-001",
    usePolicyRef: "policy:classification-001",
    purposeId: "catalog-candidate",
    outcome: "allow",
    reasonIds: ["restriction:owner-permission-present"],
  } as const;
}

test("knowledge enforcement composes canonical classification, use policy and bounded eligibility deterministically", () => {
  const evaluated = evaluateKnowledgeEnforcement({
    bundle: bundle(),
    usePolicyRef: " policy:classification-001 ",
    enforcement: enforcement(),
    eligibilityRef: " eligibility:001 ",
    permissionRef: " permission:owner-001 ",
  });

  assert.deepEqual(evaluated, {
    contractVersion: KNOWLEDGE_ENFORCEMENT_EVALUATION_VERSION,
    enforcementRef: "enforcement:001",
    eligibilityRef: "eligibility:001",
    classificationDecisionRef: "decision:classification-001",
    usePolicyRef: "policy:classification-001",
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    purposeId: "catalog-candidate",
    restrictionIds: ["no-external-disclosure", "owner-permission-required"],
    authorityRef: "human:owner-01",
    enforcementOutcome: "allow",
    eligibilityStatus: "eligible",
    permissionRef: "permission:owner-001",
    reasonIds: ["eligibility:explicit-compatible-state"],
  });
  assert.equal("payload" in evaluated, false);
  assert.equal("content" in evaluated, false);
  assert.equal("promotionApproved" in evaluated, false);
});

test("knowledge enforcement fails closed for incompatible decision, policy and purpose references", () => {
  assert.throws(
    () => evaluateKnowledgeEnforcement({
      bundle: bundle(),
      usePolicyRef: "policy:classification-001",
      enforcement: { ...enforcement(), classificationDecisionRef: "decision:other" },
      eligibilityRef: "eligibility:001",
      permissionRef: "permission:owner-001",
    }),
    /classificationDecisionRef must match canonical classification decisionRef/,
  );

  assert.throws(
    () => evaluateKnowledgeEnforcement({
      bundle: bundle(),
      usePolicyRef: "policy:other",
      enforcement: enforcement(),
      eligibilityRef: "eligibility:001",
      permissionRef: "permission:owner-001",
    }),
    /usePolicyRef must match canonical use policy reference/,
  );

  assert.throws(
    () => evaluateKnowledgeEnforcement({
      bundle: bundle(),
      usePolicyRef: "policy:classification-001",
      enforcement: { ...enforcement(), purposeId: "undeclared-purpose" },
      eligibilityRef: "eligibility:001",
      permissionRef: "permission:owner-001",
    }),
    /purposeId must be explicitly allowed by canonical use policy/,
  );
});

test("knowledge enforcement requires explicit restriction state and preserves human classification authority", () => {
  const withoutRestrictions = {
    ...bundle(),
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["catalog-candidate"],
    },
  };
  assert.throws(
    () => evaluateKnowledgeEnforcement({
      bundle: withoutRestrictions,
      usePolicyRef: "policy:classification-001",
      enforcement: enforcement(),
      eligibilityRef: "eligibility:001",
      permissionRef: "permission:owner-001",
    }),
    /missing field restrictionIds/,
  );

  const deterministicAuthority = {
    ...bundle(),
    decision: {
      ...bundle().decision,
      humanAuthority: {
        ...humanAuthority("human:owner-01", "boundary:classification-001"),
        descriptor: {
          boundaryVersion: DECISION_BOUNDARY_VERSION,
          decisionId: "boundary:classification-001",
          category: "deterministic-rule",
        },
      },
    },
  };
  assert.throws(
    () => evaluateKnowledgeEnforcement({
      bundle: deterministicAuthority,
      usePolicyRef: "policy:classification-001",
      enforcement: enforcement(),
      eligibilityRef: "eligibility:001",
      permissionRef: "permission:owner-001",
    }),
    /Invalid decision boundary at \$decisionBoundary\.category: unsupported category/,
  );
});
