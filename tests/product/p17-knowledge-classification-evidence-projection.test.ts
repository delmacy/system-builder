import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
  normalizeKnowledgeClassificationEvidenceProjection,
} from "../../packages/contracts/knowledge-boundary/index.js";

test("classification evidence projection is deterministic and payload-minimal", () => {
  const first = normalizeKnowledgeClassificationEvidenceProjection({
    contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
    knowledgeClass: "client-proprietary",
    ownerRef: " client:acme ",
    purposeIds: [" support-analysis ", "catalog-review"],
    decisionRef: " decision:classification-001 ",
    proposalRef: " proposal:model-001 ",
    evidenceRefs: [" evidence:002 ", "evidence:001"],
  });
  const second = normalizeKnowledgeClassificationEvidenceProjection({
    contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    purposeIds: ["catalog-review", "support-analysis"],
    decisionRef: "decision:classification-001",
    proposalRef: "proposal:model-001",
    evidenceRefs: ["evidence:001", "evidence:002"],
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first, {
    contractVersion: "1.0.0",
    knowledgeClass: "client-proprietary",
    ownerRef: "client:acme",
    purposeIds: ["catalog-review", "support-analysis"],
    decisionRef: "decision:classification-001",
    proposalRef: "proposal:model-001",
    evidenceRefs: ["evidence:001", "evidence:002"],
  });
});

test("manual classification traceability represents missing proposal explicitly without fabricating evidence", () => {
  assert.deepEqual(
    normalizeKnowledgeClassificationEvidenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
      knowledgeClass: "generic",
      ownerRef: "owner:generic",
      purposeIds: [],
      decisionRef: "decision:manual-002",
      proposalRef: null,
      evidenceRefs: [],
    }),
    {
      contractVersion: "1.0.0",
      knowledgeClass: "generic",
      ownerRef: "owner:generic",
      purposeIds: [],
      decisionRef: "decision:manual-002",
      proposalRef: null,
      evidenceRefs: [],
    },
  );
});

test("classification evidence projection rejects sensitive inline payload channels", () => {
  for (const [field, value] of [
    ["payload", { text: "sensitive" }],
    ["secretValue", "plaintext-secret"],
    ["providerId", "vendor-a"],
    ["authorized", true],
  ] as const) {
    assert.throws(
      () => normalizeKnowledgeClassificationEvidenceProjection({
        contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
        knowledgeClass: "trade-secret",
        ownerRef: "client:secret-owner",
        purposeIds: ["internal-review"],
        decisionRef: "decision:classification-003",
        proposalRef: null,
        evidenceRefs: ["evidence:003"],
        [field]: value,
      }),
      new RegExp(`unexpected field ${field}`),
    );
  }
});

test("classification evidence projection requires explicit reference fields and rejects duplicate evidence", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationEvidenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
      knowledgeClass: "personal",
      ownerRef: "person:004",
      purposeIds: ["support-analysis"],
      proposalRef: null,
      evidenceRefs: [],
    }),
    /missing field decisionRef/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationEvidenceProjection({
      contractVersion: KNOWLEDGE_CLASSIFICATION_EVIDENCE_PROJECTION_VERSION,
      knowledgeClass: "personal",
      ownerRef: "person:004",
      purposeIds: ["support-analysis"],
      decisionRef: "decision:classification-004",
      proposalRef: null,
      evidenceRefs: ["evidence:004", " evidence:004 "],
    }),
    /evidenceRefs contains duplicate value evidence:004/,
  );
});
