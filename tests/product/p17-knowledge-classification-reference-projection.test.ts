import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import {
  KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
  normalizeKnowledgeClassificationReferenceProjection,
  projectKnowledgeClassificationReference,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";

function humanAuthority(authorityRef: string, decisionId: string) {
  return {
    descriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId,
      category: "human-decision",
    },
    metadata: { authorityRef },
    riskCriticality: { risk: "medium", criticality: "standard" },
  } as const;
}

function bundle(mode: "manual" | "assisted") {
  const decisionActorRef = "human:reviewer-01";
  return {
    classification: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "client-proprietary",
      ownerRef: " client:acme ",
    },
    usePolicy: {
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: [" support-analysis ", "catalog-review"],
      restrictionIds: [" no-training ", "internal-only"],
    },
    decision: {
      contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
      mode,
      knowledgeClass: "client-proprietary",
      decisionActorRef,
      decisionRef: mode === "manual" ? "decision:manual-001" : "decision:assisted-001",
      ...(mode === "assisted" ? { proposalRef: "proposal:model-001" } : {}),
      humanAuthority: humanAuthority(decisionActorRef, `boundary:${mode}-001`),
    },
  } as const;
}

test("reference projection derives a deterministic payload-minimal manual view from verified classification state", () => {
  const projected = projectKnowledgeClassificationReference(bundle("manual"), [" evidence:002 ", "evidence:001"]);
  assert.deepEqual(projected, {
    contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    purposeIds: ["catalog-review", "support-analysis"],
    restrictionIds: ["internal-only", "no-training"],
    decisionMode: "manual",
    decisionRef: "decision:manual-001",
    proposalRef: null,
    evidenceRefs: ["evidence:001", "evidence:002"],
  });
});

test("reference projection keeps assisted proposal traceability distinct from final human decision", () => {
  const projected = projectKnowledgeClassificationReference(bundle("assisted"), []);
  assert.equal(projected.decisionMode, "assisted");
  assert.equal(projected.decisionRef, "decision:assisted-001");
  assert.equal(projected.proposalRef, "proposal:model-001");
});

test("reference projection cannot bypass canonical human authority verification", () => {
  const invalid = bundle("assisted");
  assert.throws(
    () => projectKnowledgeClassificationReference({
      ...invalid,
      decision: {
        ...invalid.decision,
        decisionActorRef: "model:classifier",
      },
    }, []),
    /decisionActorRef must match verified human authorityRef/,
  );

  assert.throws(
    () => projectKnowledgeClassificationReference({
      ...invalid,
      decision: {
        ...invalid.decision,
        humanAuthority: {
          descriptor: {
            boundaryVersion: DECISION_BOUNDARY_VERSION,
            decisionId: "boundary:probabilistic",
            category: "probabilistic",
          },
          metadata: {
            inferenceRef: "inference:classification",
            inferenceContext: { confidence: 0.9, modelRef: "model:classifier", contextRef: "context:classification" },
          },
          riskCriticality: { risk: "medium", criticality: "standard" },
        },
      },
    }, []),
    /requires Decision Boundary category human-decision/,
  );
});

test("reference projection fails closed for ambiguous mode/proposal shapes and sensitive channels", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
      knowledgeClass: "generic",
      ownerRef: "owner:generic",
      purposeIds: [],
      restrictionIds: [],
      decisionMode: "manual",
      decisionRef: "decision:manual",
      proposalRef: "proposal:unexpected",
      evidenceRefs: [],
    }),
    /manual classification reference projection cannot carry proposalRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
      knowledgeClass: "generic",
      ownerRef: "owner:generic",
      purposeIds: [],
      restrictionIds: [],
      decisionMode: "assisted",
      decisionRef: "decision:assisted",
      proposalRef: null,
      evidenceRefs: [],
    }),
    /assisted classification reference projection requires proposalRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
      knowledgeClass: "trade-secret",
      ownerRef: "owner:secret",
      purposeIds: ["internal-review"],
      restrictionIds: ["no-training"],
      decisionMode: "manual",
      decisionRef: "decision:secret",
      proposalRef: null,
      evidenceRefs: ["evidence:secret"],
      payload: { text: "sensitive" },
    }),
    /unexpected field payload/,
  );
});
