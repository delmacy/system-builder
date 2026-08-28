import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import {
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeRationaleEvidence,
} from "@system-builder/contracts/process-change";

const revision = (revisionRef: string, revisionNumber: number, previousRevisionRef: string | null) => ({
  contractVersion: "1.0.0" as const,
  artifactRef: "process:order",
  revisionRef,
  revisionNumber,
  previousRevisionRef,
});

const semanticDiff = calculateProcessSemanticChangeDiff({
  fromRevision: revision("rev-1", 1, null),
  toRevision: revision("rev-2", 2, "rev-1"),
  fromSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a1" }],
  toSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a2" }],
});

const classifierDecision = verifyDecisionBoundary({
  descriptor: { boundaryVersion: "1.0.0", decisionId: "classification:rationale", category: "deterministic" },
  metadata: { invariantRef: "invariant:semantic-change-classification" },
  riskCriticality: { risk: "medium", criticality: "standard" },
});

const classificationEvidence = {
  diffRef: "diff:rev-1:rev-2",
  semanticDiff,
  classification: "breaking",
  classifierDecision,
  evidenceRefs: ["evidence:classification"],
};

test("semantic change rationale binds exact diff and classification provenance without becoming approval", () => {
  assert.deepEqual(
    normalizeProcessSemanticChangeRationaleEvidence({
      diffRef: "diff:rev-1:rev-2",
      semanticDiff,
      classificationRef: "classification:rev-1:rev-2",
      classificationEvidence,
      reasonRef: "reason:policy-impact",
      evidenceRefs: ["evidence:review", "evidence:policy"],
    }),
    {
      contractVersion: "1.0.0",
      artifactRef: "process:order",
      fromRevisionRef: "rev-1",
      toRevisionRef: "rev-2",
      diffRef: "diff:rev-1:rev-2",
      classificationRef: "classification:rev-1:rev-2",
      reasonRef: "reason:policy-impact",
      evidenceRefs: ["evidence:policy", "evidence:review"],
    },
  );
});

test("semantic change rationale fails closed on mismatch, duplicate, malformed, approval and payload injection", () => {
  const base = {
    diffRef: "diff:rev-1:rev-2",
    semanticDiff,
    classificationRef: "classification:rev-1:rev-2",
    classificationEvidence,
    reasonRef: "reason:policy-impact",
    evidenceRefs: ["evidence:policy"],
  };

  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, diffRef: "diff:forged" }),
    /diffRef must match/,
  );
  assert.throws(
    () =>
      normalizeProcessSemanticChangeRationaleEvidence({
        ...base,
        semanticDiff: { ...semanticDiff, changedSemanticRefs: ["rule:forged"] },
      }),
    /exact semantic diff/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, classificationRef: "" }),
    /classificationRef must be a non-empty token/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, reasonRef: "" }),
    /reasonRef must be a non-empty token/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, evidenceRefs: ["evidence:x", "evidence:x"] }),
    /duplicate reference/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, approved: true }),
    /unexpected field approved/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, decision: "approve" }),
    /unexpected field decision/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({ ...base, payload: { content: "secret" } }),
    /unexpected field payload/,
  );
  assert.throws(
    () =>
      normalizeProcessSemanticChangeRationaleEvidence({
        ...base,
        classificationEvidence: { ...classificationEvidence, payload: true },
      }),
    /unexpected field payload/,
  );
});
