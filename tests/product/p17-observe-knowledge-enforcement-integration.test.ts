import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
  normalizeKnowledgeEnforcementReferenceEnvelope,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";
import { projectKnowledgeEnforcementForObservation } from "../../packages/observe/knowledge-enforcement.js";

function envelope(outcome: "allow" | "deny" | "isolate") {
  return {
    contractVersion: KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
    enforcementRef: "enforcement:observe-001",
    classificationDecisionRef: "decision:observe-001",
    usePolicyRef: "policy:observe-001",
    purposeId: "telemetry-observation",
    outcome,
    reasonIds: [`outcome:${outcome}`],
    evidenceRefs: ["evidence:z", "evidence:a"],
  } as const;
}

for (const outcome of ["allow", "deny", "isolate"] as const) {
  test(`observe projection preserves bounded enforcement outcome ${outcome}`, () => {
    const projection = projectKnowledgeEnforcementForObservation(
      envelope(outcome),
      normalizeKnowledgeEnforcementReferenceEnvelope,
    );
    assert.equal(projection.outcome, outcome);
    assert.equal(projection.enforcementRef, "enforcement:observe-001");
    assert.equal(projection.classificationDecisionRef, "decision:observe-001");
    assert.deepEqual(projection.evidenceRefs, ["evidence:a", "evidence:z"]);
    assert.equal("payload" in projection, false);
    assert.equal("content" in projection, false);
    assert.equal("providerId" in projection, false);
    assert.equal("credential" in projection, false);
    assert.equal("promotionApproved" in projection, false);
  });
}

test("observe projection rejects payload/content injection fail closed", () => {
  assert.throws(
    () =>
      projectKnowledgeEnforcementForObservation(
        { ...envelope("deny"), payload: { secret: true } },
        normalizeKnowledgeEnforcementReferenceEnvelope,
      ),
    /unexpected field payload/,
  );
  assert.throws(
    () =>
      projectKnowledgeEnforcementForObservation(
        { ...envelope("isolate"), content: "sensitive" },
        normalizeKnowledgeEnforcementReferenceEnvelope,
      ),
    /unexpected field content/,
  );
});
