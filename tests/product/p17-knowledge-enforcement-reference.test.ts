import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import {
  KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
  normalizeKnowledgeEnforcementReferenceEnvelope,
  projectKnowledgeEnforcementReference,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";

const disposition = {
  contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  enforcementRef: "enforcement:001",
  classificationDecisionRef: "decision:001",
  usePolicyRef: "policy:001",
  purposeId: "catalog-candidate",
  outcome: "isolate",
  reasonIds: ["restriction:client-only", "class:client-proprietary"],
} as const;

test("enforcement reference projection carries only canonical references and metadata", () => {
  const projected = projectKnowledgeEnforcementReference(disposition, ["evidence:z", "evidence:a"]);
  assert.deepEqual(projected, {
    contractVersion: KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
    enforcementRef: "enforcement:001",
    classificationDecisionRef: "decision:001",
    usePolicyRef: "policy:001",
    purposeId: "catalog-candidate",
    outcome: "isolate",
    reasonIds: ["class:client-proprietary", "restriction:client-only"],
    evidenceRefs: ["evidence:a", "evidence:z"],
  });
  assert.equal("payload" in projected, false);
  assert.equal("content" in projected, false);
  assert.equal("providerId" in projected, false);
  assert.equal("credential" in projected, false);
});

test("enforcement reference envelope rejects content-bearing and ambiguous fields fail closed", () => {
  const valid = projectKnowledgeEnforcementReference(disposition, []);
  assert.throws(
    () => normalizeKnowledgeEnforcementReferenceEnvelope({ ...valid, payload: { secret: true } }),
    /unexpected field payload/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementReferenceEnvelope({ ...valid, content: "sensitive" }),
    /unexpected field content/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementReferenceEnvelope({ ...valid, evidenceRefs: ["same", "same"] }),
    /duplicate value same/,
  );
});
