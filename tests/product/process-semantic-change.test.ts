import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import {
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeClassificationEvidence,
} from "@system-builder/contracts/process-change";

const revision = (revisionRef: string, revisionNumber: number, previousRevisionRef: string | null, artifactRef = "process:order") => ({
  contractVersion: "1.0.0" as const,
  artifactRef,
  revisionRef,
  revisionNumber,
  previousRevisionRef,
});

const diffInput = {
  fromRevision: revision("rev-1", 1, null),
  toRevision: revision("rev-2", 2, "rev-1"),
  fromSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a1" }],
  toSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a2" }],
};

test("process semantic change diff is deterministic and payload-minimal", () => {
  const input = {
    fromRevision: revision("rev-1", 1, null),
    toRevision: revision("rev-2", 2, "rev-1"),
    fromSnapshot: [
      { semanticRef: "rule:b", evidenceRef: "evidence:b1" },
      { semanticRef: "rule:a", evidenceRef: "evidence:a1" },
      { semanticRef: "rule:c", evidenceRef: "evidence:c1" },
    ],
    toSnapshot: [
      { semanticRef: "rule:d", evidenceRef: "evidence:d1" },
      { semanticRef: "rule:b", evidenceRef: "evidence:b2" },
      { semanticRef: "rule:a", evidenceRef: "evidence:a1" },
    ],
  };

  assert.deepEqual(calculateProcessSemanticChangeDiff(input), {
    contractVersion: "1.0.0",
    artifactRef: "process:order",
    fromRevisionRef: "rev-1",
    toRevisionRef: "rev-2",
    addedSemanticRefs: ["rule:d"],
    removedSemanticRefs: ["rule:c"],
    changedSemanticRefs: ["rule:b"],
  });

  assert.deepEqual(
    calculateProcessSemanticChangeDiff({
      ...input,
      fromSnapshot: [...input.fromSnapshot].reverse(),
      toSnapshot: [...input.toSnapshot].reverse(),
    }),
    calculateProcessSemanticChangeDiff(input),
  );
});

test("process semantic change diff rejects forged, reversed, duplicate and injected inputs", () => {
  const base = diffInput;
  assert.throws(() => calculateProcessSemanticChangeDiff({ ...base, toRevision: revision("rev-2", 2, "rev-1", "process:other") }), /same artifact/);
  assert.throws(() => calculateProcessSemanticChangeDiff({ ...base, fromRevision: revision("rev-2", 2, "rev-1"), toRevision: revision("rev-1", 1, null) }), /consecutive and ordered/);
  assert.throws(() => calculateProcessSemanticChangeDiff({ ...base, toRevision: revision("rev-2", 2, "forged") }), /canonical predecessor/);
  assert.throws(() => calculateProcessSemanticChangeDiff({ ...base, toSnapshot: [base.toSnapshot[0], base.toSnapshot[0]] }), /duplicate semanticRef/);
  assert.throws(() => calculateProcessSemanticChangeDiff({ ...base, toSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a2", payload: { secret: true } }] }), /unexpected field payload/);
  assert.throws(() => calculateProcessSemanticChangeDiff({ ...base, gitSha: "deadbeef" }), /unexpected field gitSha/);
});

test("classification evidence binds exact semantic diff and canonical decision provenance without approval", () => {
  const semanticDiff = calculateProcessSemanticChangeDiff(diffInput);
  const classifierDecision = verifyDecisionBoundary({
    descriptor: { boundaryVersion: "1.0.0", decisionId: "classification:1", category: "probabilistic" },
    metadata: {
      inferenceRef: "inference:1",
      inferenceContext: { confidence: 0.9, modelRef: "model:classifier", contextRef: "context:18.2.2" },
    },
    riskCriticality: { risk: "medium", criticality: "standard" },
  });

  assert.deepEqual(
    normalizeProcessSemanticChangeClassificationEvidence({
      diffRef: "diff:rev-1:rev-2",
      semanticDiff,
      classification: "breaking",
      classifierDecision,
      evidenceRefs: ["evidence:policy", "evidence:review"],
    }),
    {
      contractVersion: "1.0.0",
      diffRef: "diff:rev-1:rev-2",
      artifactRef: "process:order",
      fromRevisionRef: "rev-1",
      toRevisionRef: "rev-2",
      classification: "breaking",
      classifierDecisionId: "classification:1",
      classifierCategory: "probabilistic",
      classifierReference: { kind: "inference", ref: "inference:1" },
      evidenceRefs: ["evidence:policy", "evidence:review"],
    },
  );
});

test("classification evidence fails closed for forged provenance, malformed evidence and approval or payload injection", () => {
  const semanticDiff = calculateProcessSemanticChangeDiff(diffInput);
  const classifierDecision = verifyDecisionBoundary({
    descriptor: { boundaryVersion: "1.0.0", decisionId: "classification:2", category: "deterministic" },
    metadata: { invariantRef: "invariant:classification" },
    riskCriticality: { risk: "low", criticality: "standard" },
  });
  const base = {
    diffRef: "diff:rev-1:rev-2",
    semanticDiff,
    classification: "non-breaking",
    classifierDecision,
    evidenceRefs: ["evidence:classification"],
  };

  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, classifierDecision: { ...classifierDecision } }), /canonical Decision Boundary/);
  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, classification: "approved" }), /classification must be/);
  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, evidenceRefs: [] }), /non-empty array/);
  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, evidenceRefs: ["evidence:x", "evidence:x"] }), /duplicate reference/);
  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, approved: true }), /unexpected field approved/);
  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, payload: { content: "secret" } }), /unexpected field payload/);
  assert.throws(() => normalizeProcessSemanticChangeClassificationEvidence({ ...base, semanticDiff: { ...semanticDiff, payload: true } }), /unexpected field payload/);
});
