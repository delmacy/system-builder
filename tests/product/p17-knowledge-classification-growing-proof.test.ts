import assert from "node:assert/strict";
import test from "node:test";
import {
  ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
  KNOWLEDGE_CLASSES,
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
  normalizeAssistedClassificationProposal,
  normalizeKnowledgeClassificationBundle,
  normalizeKnowledgeClassificationDecision,
  normalizeKnowledgeClassificationEvidenceProjection,
  normalizeKnowledgeUsePolicyDescriptor,
} from "../../packages/contracts/knowledge-boundary/index.js";

test("P17 classification boundary covers every canonical class through real exported APIs", () => {
  for (const knowledgeClass of KNOWLEDGE_CLASSES) {
    const bundle = normalizeKnowledgeClassificationBundle({
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass,
        ownerRef: `owner:${knowledgeClass}`,
      },
      usePolicy: {
        contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
        purposeIds: ["internal-review"],
        restrictionIds: ["no-external-disclosure"],
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass,
        decisionActorRef: "human:classification-owner",
        decisionRef: `decision:${knowledgeClass}`,
      },
    });

    const projection = normalizeKnowledgeClassificationEvidenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
      knowledgeClass: bundle.classification.knowledgeClass,
      ownerRef: bundle.classification.ownerRef,
      purposeIds: bundle.usePolicy.purposeIds,
      decisionRef: bundle.decision.decisionRef,
      proposalRef: null,
      evidenceRefs: [`evidence:${knowledgeClass}`],
    });

    assert.equal(projection.knowledgeClass, knowledgeClass);
    assert.equal(projection.ownerRef, `owner:${knowledgeClass}`);
    assert.deepEqual(projection.purposeIds, ["internal-review"]);
  }
});

test("assisted proposal remains non-authoritative until an explicit human decision exists", () => {
  const proposal = normalizeAssistedClassificationProposal({
    contractVersion: ASSISTED_CLASSIFICATION_PROPOSAL_VERSION,
    proposalRef: "proposal:classification-001",
    proposedClass: "client-proprietary",
    confidence: 0.82,
    modelRef: "model:classifier-v1",
    contextRef: "context:classification-001",
    evidenceRefs: ["evidence:classification-001"],
  });

  assert.throws(
    () => normalizeKnowledgeClassificationDecision(proposal),
    /unsupported knowledge classification decision mode/,
  );

  const decision = normalizeKnowledgeClassificationDecision({
    contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
    mode: "assisted",
    knowledgeClass: proposal.proposedClass,
    decisionActorRef: "human:reviewer-001",
    decisionRef: "decision:classification-001",
    proposalRef: proposal.proposalRef,
  });

  assert.equal(decision.mode, "assisted");
  assert.equal(decision.proposalRef, proposal.proposalRef);
  assert.equal(decision.decisionActorRef, "human:reviewer-001");
});

test("purpose restrictions fail closed instead of becoming implicit permission", () => {
  assert.throws(
    () => normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      restrictionIds: [],
    }),
    /missing field purposeIds/,
  );

  assert.throws(
    () => normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["internal-review"],
      restrictionIds: ["   "],
    }),
    /restrictionIds\[0\] must be a non-empty string/,
  );

  assert.throws(
    () => normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: [],
      restrictionIds: [],
      reuseAuthorized: true,
    }),
    /unexpected field reuseAuthorized/,
  );
});

test("classification evidence stays payload-minimal and provider-neutral", () => {
  const base = {
    contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
    knowledgeClass: "trade-secret",
    ownerRef: "client:secret-owner",
    purposeIds: ["internal-review"],
    decisionRef: "decision:trade-secret",
    proposalRef: null,
    evidenceRefs: ["evidence:trade-secret"],
  } as const;

  assert.deepEqual(normalizeKnowledgeClassificationEvidenceProjection(base), base);

  for (const [field, value] of [
    ["payload", { secret: "value" }],
    ["secretValue", "plaintext"],
    ["providerId", "vendor-a"],
    ["promotionAuthorized", true],
  ] as const) {
    assert.throws(
      () => normalizeKnowledgeClassificationEvidenceProjection({ ...base, [field]: value }),
      new RegExp(`unexpected field ${field}`),
    );
  }
});
