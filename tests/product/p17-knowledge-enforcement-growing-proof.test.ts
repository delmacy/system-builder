import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
  normalizeKnowledgeEnforcementDisposition,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { evaluateKnowledgeEnforcement } from "../../packages/contracts/knowledge-boundary/enforcement-composition.js";
import {
  normalizeKnowledgeEnforcementReferenceEnvelope,
  projectKnowledgeEnforcementReference,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category: "human-decision" },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

function bundle(knowledgeClass: "generic" | "client-proprietary" | "personal" | "trade-secret") {
  return {
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass,
      ownerRef: "owner:001",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["catalog-candidate"],
      restrictionIds: ["explicit-enforcement-required"],
    },
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode: "manual",
      knowledgeClass,
      decisionActorRef: "human:owner-01",
      decisionRef: `decision:${knowledgeClass}`,
      humanAuthority: humanAuthority("human:owner-01", `boundary:${knowledgeClass}`),
    },
  } as const;
}

function disposition(
  knowledgeClass: "generic" | "client-proprietary" | "personal" | "trade-secret",
  outcome: "allow" | "deny" | "isolate",
) {
  return normalizeKnowledgeEnforcementDisposition({
    contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
    enforcementRef: `enforcement:${knowledgeClass}`,
    classificationDecisionRef: `decision:${knowledgeClass}`,
    usePolicyRef: "policy:001",
    purposeId: "catalog-candidate",
    outcome,
    reasonIds: [`class:${knowledgeClass}`, `outcome:${outcome}`],
  });
}

test("Construction A growing proof preserves human authority for an explicitly allowed proprietary path", () => {
  const enforcement = disposition("client-proprietary", "allow");
  const evaluated = evaluateKnowledgeEnforcement({
    bundle: bundle("client-proprietary"),
    usePolicyRef: "policy:001",
    enforcement,
    eligibilityRef: "eligibility:client-proprietary",
    permissionRef: "permission:owner-001",
  });
  const projected = projectKnowledgeEnforcementReference(enforcement, ["evidence:classification", "evidence:policy"]);

  assert.equal(evaluated.authorityRef, "human:owner-01");
  assert.equal(evaluated.eligibilityStatus, "eligible");
  assert.deepEqual(projected.evidenceRefs, ["evidence:classification", "evidence:policy"]);
  assert.equal("payload" in projected, false);
  assert.equal("content" in projected, false);
  assert.equal("promotionApproved" in evaluated, false);
});

for (const scenario of [
  { knowledgeClass: "client-proprietary", outcome: "allow", permissionRef: null },
  { knowledgeClass: "personal", outcome: "deny", permissionRef: null },
  { knowledgeClass: "trade-secret", outcome: "isolate", permissionRef: null },
] as const) {
  test(`Construction A fails closed for unauthorized ${scenario.knowledgeClass}/${scenario.outcome} enforcement`, () => {
    const evaluated = evaluateKnowledgeEnforcement({
      bundle: bundle(scenario.knowledgeClass),
      usePolicyRef: "policy:001",
      enforcement: disposition(scenario.knowledgeClass, scenario.outcome),
      eligibilityRef: `eligibility:${scenario.knowledgeClass}`,
      permissionRef: scenario.permissionRef,
    });

    assert.equal(evaluated.eligibilityStatus, "ineligible");
    assert.equal(evaluated.authorityRef, "human:owner-01");
    assert.equal("promotionApproved" in evaluated, false);
  });
}

test("Construction A payload-minimal enforcement envelope rejects sensitive payload injection", () => {
  const projected = projectKnowledgeEnforcementReference(
    disposition("personal", "isolate"),
    ["evidence:personal-001"],
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementReferenceEnvelope({ ...projected, payload: { personal: "secret" } }),
    /unexpected field payload/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementReferenceEnvelope({ ...projected, content: "sensitive" }),
    /unexpected field content/,
  );
});
