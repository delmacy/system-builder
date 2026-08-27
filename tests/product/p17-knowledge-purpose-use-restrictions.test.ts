import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_USE_POLICY_VERSION,
  normalizeKnowledgeUsePolicyDescriptor,
} from "../../packages/contracts/knowledge-boundary/index.js";

test("knowledge use policy normalizes explicit purposes and restrictions canonically", () => {
  const first = normalizeKnowledgeUsePolicyDescriptor({
    contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
    purposeIds: [" support-analysis ", "catalog-review"],
    restrictionIds: ["no-external-disclosure", " owner-review-required "],
  });
  const second = normalizeKnowledgeUsePolicyDescriptor({
    contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
    purposeIds: ["catalog-review", "support-analysis"],
    restrictionIds: ["owner-review-required", "no-external-disclosure"],
  });

  assert.deepEqual(first, {
    contractVersion: "1.0.0",
    purposeIds: ["catalog-review", "support-analysis"],
    restrictionIds: ["no-external-disclosure", "owner-review-required"],
  });
  assert.deepEqual(first, second);
});

test("knowledge use policy fails closed for duplicate or invalid identifiers", () => {
  assert.throws(
    () => normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["support-analysis", " support-analysis "],
      restrictionIds: [],
    }),
    /purposeIds contains duplicate value support-analysis/,
  );

  assert.throws(
    () => normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: ["support-analysis"],
      restrictionIds: ["   "],
    }),
    /restrictionIds\[0\] must be a non-empty string/,
  );

  assert.throws(
    () => normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: "support-analysis",
      restrictionIds: [],
    }),
    /purposeIds must be an array/,
  );
});

test("knowledge use policy requires explicit shape and never infers reuse permission", () => {
  assert.deepEqual(
    normalizeKnowledgeUsePolicyDescriptor({
      contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
      purposeIds: [],
      restrictionIds: [],
    }),
    {
      contractVersion: "1.0.0",
      purposeIds: [],
      restrictionIds: [],
    },
  );

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
      purposeIds: [],
      restrictionIds: [],
      reuseAuthorized: true,
    }),
    /unexpected field reuseAuthorized/,
  );
});
