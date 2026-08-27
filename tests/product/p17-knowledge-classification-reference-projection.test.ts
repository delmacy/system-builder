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

function manualProjection(overrides: Record<string, unknown> = {}) {
  return {
    contractVersion: KNOWLEDGE_CLASSIFICATION_REFERENCE_PROJECTION_VERSION,
    knowledgeClass: "generic",
    ownerRef: "owner:generic",
    purposeIds: [],
    restrictionIds: [],
    decisionMode: "manual",
    decisionRef: "decision:manual",
    proposalRef: null,
    humanAuthority: humanAuthority("human:reviewer-01", "boundary:projection-manual"),
    evidenceRefs: [],
    ...overrides,
  };
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
    humanAuthority: humanAuthority("human:reviewer-01", "boundary:manual-001"),
    evidenceRefs: ["evidence:001", "evidence:002"],
  });
});

test("reference projection keeps assisted proposal traceability distinct from final human decision", () => {
  const projected = projectKnowledgeClassificationReference(bundle("assisted"), []);
  assert.equal(projected.decisionMode, "assisted");
  assert.equal(projected.decisionRef, "decision:assisted-001");
  assert.equal(projected.proposalRef, "proposal:model-001");
  assert.equal(projected.humanAuthority.descriptor.category, "human-decision");
  assert.equal(projected.humanAuthority.metadata.authorityRef, "human:reviewer-01");
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

  const probabilisticAuthority = {
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
  } as const;

  assert.throws(
    () => projectKnowledgeClassificationReference({
      ...invalid,
      decision: {
        ...invalid.decision,
        humanAuthority: probabilisticAuthority,
      },
    }, []),
    /requires Decision Boundary category human-decision/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection(manualProjection({ humanAuthority: probabilisticAuthority })),
    /requires Decision Boundary category human-decision/,
  );
});

test("standalone projection normalization requires canonical human authority proof", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection({
      ...manualProjection(),
      humanAuthority: undefined,
    }),
    /humanAuthority must be an object/,
  );

  const normalized = normalizeKnowledgeClassificationReferenceProjection(manualProjection());
  assert.equal(normalized.humanAuthority.descriptor.category, "human-decision");
  assert.equal(normalized.humanAuthority.metadata.authorityRef, "human:reviewer-01");
});

test("reference projection fails closed for ambiguous mode/proposal shapes and sensitive channels", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection(manualProjection({ proposalRef: "proposal:unexpected" })),
    /manual classification reference projection cannot carry proposalRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection({
      ...manualProjection(),
      decisionMode: "assisted",
      decisionRef: "decision:assisted",
      proposalRef: null,
    }),
    /assisted classification reference projection requires proposalRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationReferenceProjection(manualProjection({
      knowledgeClass: "trade-secret",
      ownerRef: "owner:secret",
      purposeIds: ["internal-review"],
      restrictionIds: ["no-training"],
      decisionRef: "decision:secret",
      evidenceRefs: ["evidence:secret"],
      payload: { text: "sensitive" },
    })),
    /unexpected field payload/,
  );
});
