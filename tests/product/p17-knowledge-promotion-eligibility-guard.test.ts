import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  evaluateKnowledgePromotionEligibility,
} from "../../packages/contracts/knowledge-boundary/index.js";

const allowedEnforcement = {
  contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  enforcementRef: "enforcement:allow:001",
  classificationDecisionRef: "decision:001",
  usePolicyRef: "policy:001",
  purposeId: "catalog-candidate",
  outcome: "allow",
  reasonIds: ["policy:explicit-use"],
} as const;

test("promotion eligibility is only a bounded pre-promotion result and requires explicit compatible state", () => {
  const generic = evaluateKnowledgePromotionEligibility({
    eligibilityRef: "eligibility:generic:001",
    knowledgeClass: "generic",
    enforcement: allowedEnforcement,
    policyCompatible: true,
    permissionRef: null,
  });
  assert.equal(generic.status, "eligible");
  assert.deepEqual(generic.reasonIds, ["eligibility:explicit-compatible-state"]);
  assert.equal("promotionApproved" in generic, false);
  assert.equal("anonymizedArtifact" in generic, false);
  assert.equal("publishedArtifact" in generic, false);

  const proprietaryWithPermission = evaluateKnowledgePromotionEligibility({
    eligibilityRef: "eligibility:client:001",
    knowledgeClass: "client-proprietary",
    enforcement: allowedEnforcement,
    policyCompatible: true,
    permissionRef: "permission:client:reuse:001",
  });
  assert.equal(proprietaryWithPermission.status, "eligible");
  assert.equal(proprietaryWithPermission.permissionRef, "permission:client:reuse:001");
});

test("proprietary, personal and trade-secret knowledge fail closed without explicit compatible permission", () => {
  for (const knowledgeClass of ["client-proprietary", "personal", "trade-secret"] as const) {
    const result = evaluateKnowledgePromotionEligibility({
      eligibilityRef: `eligibility:${knowledgeClass}`,
      knowledgeClass,
      enforcement: allowedEnforcement,
      policyCompatible: true,
      permissionRef: null,
    });
    assert.equal(result.status, "ineligible");
    assert.deepEqual(result.reasonIds, ["permission:required"]);
  }
});

test("promotion eligibility fails closed for deny/isolate or incompatible policy state", () => {
  const denied = evaluateKnowledgePromotionEligibility({
    eligibilityRef: "eligibility:denied",
    knowledgeClass: "generic",
    enforcement: { ...allowedEnforcement, outcome: "deny", reasonIds: ["restriction:denied"] },
    policyCompatible: true,
    permissionRef: null,
  });
  assert.equal(denied.status, "ineligible");
  assert.deepEqual(denied.reasonIds, ["enforcement:deny"]);

  const incompatible = evaluateKnowledgePromotionEligibility({
    eligibilityRef: "eligibility:incompatible",
    knowledgeClass: "client-proprietary",
    enforcement: allowedEnforcement,
    policyCompatible: false,
    permissionRef: "permission:client:reuse:001",
  });
  assert.equal(incompatible.status, "ineligible");
  assert.deepEqual(incompatible.reasonIds, ["policy:incompatible"]);

  assert.throws(
    () => evaluateKnowledgePromotionEligibility({
      eligibilityRef: "eligibility:invalid",
      knowledgeClass: "generic",
      enforcement: allowedEnforcement,
      policyCompatible: undefined as unknown as boolean,
      permissionRef: null,
    }),
    /policyCompatible must be a boolean/,
  );
});
