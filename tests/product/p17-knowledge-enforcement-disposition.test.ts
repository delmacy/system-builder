import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  normalizeKnowledgeEnforcementDisposition,
} from "../../packages/contracts/knowledge-boundary/index.js";

test("knowledge enforcement disposition normalizes explicit provider-neutral references deterministically", () => {
  const disposition = normalizeKnowledgeEnforcementDisposition({
    contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
    enforcementRef: "  enforcement:001  ",
    classificationDecisionRef: " decision:001 ",
    usePolicyRef: " policy:001 ",
    purposeId: " support-analysis ",
    outcome: "isolate",
    reasonIds: ["restriction:client-only", "class:client-proprietary"],
  });

  assert.deepEqual(disposition, {
    contractVersion: "1.0.0",
    enforcementRef: "enforcement:001",
    classificationDecisionRef: "decision:001",
    usePolicyRef: "policy:001",
    purposeId: "support-analysis",
    outcome: "isolate",
    reasonIds: ["class:client-proprietary", "restriction:client-only"],
  });
  assert.equal("payload" in disposition, false);
  assert.equal("providerId" in disposition, false);
  assert.equal("credential" in disposition, false);
  assert.equal("authorized" in disposition, false);
  assert.equal("promotionApproved" in disposition, false);
});

test("knowledge enforcement disposition fails closed for invalid, ambiguous or content-bearing state", () => {
  const valid = {
    contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
    enforcementRef: "enforcement:001",
    classificationDecisionRef: "decision:001",
    usePolicyRef: "policy:001",
    purposeId: "support-analysis",
    outcome: "deny",
    reasonIds: ["restriction:denied"],
  } as const;

  assert.throws(
    () => normalizeKnowledgeEnforcementDisposition({ ...valid, outcome: "unknown" }),
    /unsupported knowledge enforcement outcome/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementDisposition({ ...valid, reasonIds: [] }),
    /at least one explicit reason/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementDisposition({ ...valid, reasonIds: ["same", "same"] }),
    /duplicate value same/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementDisposition({ ...valid, classificationDecisionRef: " " }),
    /classificationDecisionRef must be a non-empty string/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementDisposition({ ...valid, payload: { secret: true } }),
    /unexpected field payload/,
  );
  assert.throws(
    () => normalizeKnowledgeEnforcementDisposition({ ...valid, providerId: "vendor-a" }),
    /unexpected field providerId/,
  );
});
