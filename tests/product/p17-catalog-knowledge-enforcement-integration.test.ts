import assert from "node:assert/strict";
import test from "node:test";
import { SoftwareCatalogRegistry } from "../../packages/catalog/index.js";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { evaluateKnowledgeCatalogAdmission } from "../../packages/contracts/knowledge-boundary/catalog-admission.js";

function input(permissionRef: string | null, outcome: "allow" | "deny" | "isolate" = "allow") {
  return {
    bundle: {
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass: "client-proprietary",
        ownerRef: "client:acme",
      },
      usePolicy: {
        contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
        purposeIds: ["catalog-candidate"],
        restrictionIds: ["owner-permission-required"],
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass: "client-proprietary",
        decisionActorRef: "human:owner-01",
        decisionRef: "decision:catalog-001",
        humanAuthority: {
          descriptor: {
            boundaryVersion: DECISION_BOUNDARY_VERSION,
            decisionId: "boundary:catalog-001",
            category: "human-decision",
          },
          metadata: { authorityRef: "human:owner-01" },
          riskCriticality: { risk: "medium", criticality: "standard" },
        },
      },
    },
    usePolicyRef: "policy:catalog-001",
    enforcement: {
      contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
      enforcementRef: "enforcement:catalog-001",
      classificationDecisionRef: "decision:catalog-001",
      usePolicyRef: "policy:catalog-001",
      purposeId: "catalog-candidate",
      outcome,
      reasonIds: [`outcome:${outcome}`],
    },
    eligibilityRef: "eligibility:catalog-001",
    permissionRef,
  } as const;
}

test("representative catalog admission uses canonical P17 enforcement before registration", () => {
  const registry = new SoftwareCatalogRegistry();
  const admission = evaluateKnowledgeCatalogAdmission(input("permission:owner-001"));

  assert.equal(admission.status, "admit");
  assert.equal(admission.authorityRef, "human:owner-01");
  assert.equal("payload" in admission, false);
  assert.equal("content" in admission, false);
  assert.equal("promotionApproved" in admission, false);

  if (admission.status === "admit") {
    registry.register({ capability: "knowledge-reference", provider: admission.enforcementRef, version: "1.0.0" });
  }
  assert.equal(registry.list().length, 1);
});

test("representative catalog admission fails closed when proprietary permission is absent", () => {
  const registry = new SoftwareCatalogRegistry();
  const admission = evaluateKnowledgeCatalogAdmission(input(null));

  assert.equal(admission.status, "reject");
  assert.deepEqual(registry.list(), []);
});

for (const outcome of ["deny", "isolate"] as const) {
  test(`representative catalog admission rejects enforcement outcome ${outcome}`, () => {
    const admission = evaluateKnowledgeCatalogAdmission(input("permission:owner-001", outcome));
    assert.equal(admission.status, "reject");
    assert.equal("authorized" in admission, false);
    assert.equal("promoted" in admission, false);
  });
}
