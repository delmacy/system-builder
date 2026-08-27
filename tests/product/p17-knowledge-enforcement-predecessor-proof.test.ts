import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import { evaluateKnowledgeEnforcement } from "../../packages/contracts/knowledge-boundary/enforcement-composition.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: { boundaryVersion: DECISION_BOUNDARY_VERSION, decisionId, category: "human-decision" },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

function bundle(mode: "manual" | "assisted") {
  const common = {
    contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
    mode,
    knowledgeClass: "client-proprietary",
    decisionActorRef: "human:owner-01",
    decisionRef: `decision:${mode}`,
    humanAuthority: humanAuthority("human:owner-01", `boundary:${mode}`),
  } as const;
  return {
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
    decision: mode === "manual" ? common : { ...common, proposalRef: "proposal:001" },
  } as const;
}

function enforcement(classificationDecisionRef: string) {
  return {
    contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
    enforcementRef: "enforcement:001",
    classificationDecisionRef,
    usePolicyRef: "policy:001",
    purposeId: "catalog-candidate",
    outcome: "allow",
    reasonIds: ["restriction:owner-permission-present"],
  } as const;
}

for (const mode of ["manual", "assisted"] as const) {
  test(`knowledge enforcement preserves canonical human-decision authority for ${mode} classification`, () => {
    const evaluated = evaluateKnowledgeEnforcement({
      bundle: bundle(mode),
      usePolicyRef: "policy:001",
      enforcement: enforcement(`decision:${mode}`),
      eligibilityRef: `eligibility:${mode}`,
      permissionRef: "permission:owner-001",
    });

    assert.equal(evaluated.authorityRef, "human:owner-01");
    assert.equal(evaluated.classificationDecisionRef, `decision:${mode}`);
    assert.equal(evaluated.eligibilityStatus, "eligible");
    assert.equal("proposalRef" in evaluated, false);
    assert.equal("authorized" in evaluated, false);
    assert.equal("promotionApproved" in evaluated, false);
  });
}

test("assisted proposal remains traceability-only and cannot replace human authority", () => {
  const assisted = bundle("assisted");
  assert.equal("proposalRef" in assisted.decision, true);
  if (!("proposalRef" in assisted.decision)) throw new Error("assisted fixture must carry proposalRef");
  assert.equal(assisted.decision.proposalRef, "proposal:001");
  assert.notEqual(assisted.decision.proposalRef, assisted.decision.humanAuthority.metadata.authorityRef);

  const evaluated = evaluateKnowledgeEnforcement({
    bundle: assisted,
    usePolicyRef: "policy:001",
    enforcement: enforcement("decision:assisted"),
    eligibilityRef: "eligibility:assisted",
    permissionRef: "permission:owner-001",
  });
  assert.equal(evaluated.authorityRef, "human:owner-01");
});

for (const category of ["deterministic", "probabilistic"] as const) {
  test(`knowledge enforcement rejects ${category} substitution for human classification authority`, () => {
    const manual = bundle("manual");
    const substituted = {
      ...manual,
      decision: {
        ...manual.decision,
        humanAuthority: {
          ...manual.decision.humanAuthority,
          descriptor: {
            boundaryVersion: DECISION_BOUNDARY_VERSION,
            decisionId: `boundary:${category}`,
            category,
          },
        },
      },
    };

    assert.throws(
      () => evaluateKnowledgeEnforcement({
        bundle: substituted,
        usePolicyRef: "policy:001",
        enforcement: enforcement("decision:manual"),
        eligibilityRef: `eligibility:${category}`,
        permissionRef: "permission:owner-001",
      }),
      /classification decision requires Decision Boundary category human-decision/,
    );
  });
}
