import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_CLASSES,
  normalizeKnowledgeClassificationDescriptor,
} from "../../packages/contracts/knowledge-boundary/index.js";

for (const knowledgeClass of KNOWLEDGE_CLASSES) {
  test(`knowledge classification accepts canonical class ${knowledgeClass}`, () => {
    const descriptor = normalizeKnowledgeClassificationDescriptor({
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass,
      ownerRef: " owner:client-001 ",
    });

    assert.deepEqual(descriptor, {
      contractVersion: "1.0.0",
      knowledgeClass,
      ownerRef: "owner:client-001",
    });
  });
}

test("knowledge classification fails closed for unsupported or ambiguous ownership state", () => {
  assert.throws(
    () => normalizeKnowledgeClassificationDescriptor({
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "internal",
      ownerRef: "owner:client-001",
    }),
    /unsupported knowledge class/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationDescriptor({
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "generic",
      ownerRef: "   ",
    }),
    /ownerRef must be a non-empty string/,
  );

  assert.throws(
    () => normalizeKnowledgeClassificationDescriptor({
      contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
      knowledgeClass: "generic",
    }),
    /missing field ownerRef/,
  );
});

test("knowledge classification rejects payload and authority-bearing extensions", () => {
  for (const unexpected of ["payload", "providerId", "approved", "promotionAuthorized"]) {
    assert.throws(
      () => normalizeKnowledgeClassificationDescriptor({
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass: "client-proprietary",
        ownerRef: "owner:client-001",
        [unexpected]: true,
      }),
      new RegExp(`unexpected field ${unexpected}`),
    );
  }
});
