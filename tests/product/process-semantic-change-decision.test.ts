import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import {
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeDecision,
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
  descriptor: { boundaryVersion: "1.0.0", decisionId: "classification:rev-1:rev-2", category: "deterministic" },
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

const rationaleEvidence = {
  diffRef: "diff:rev-1:rev-2",
  semanticDiff,
  classificationRef: "classification:rev-1:rev-2",
  classificationEvidence,
  reasonRef: "reason:policy-impact",
  evidenceRefs: ["evidence:review", "evidence:policy"],
};

const humanDescriptor = {
  boundaryVersion: "1.0.0" as const,
  decisionId: "process-change:rev-1:rev-2",
  category: "human-decision" as const,
};
const humanMetadata = { authorityRef: "authority:process-owner" };

const base = {
  rationaleRef: "rationale:rev-1:rev-2",
  rationaleEvidence,
  outcome: "approved" as const,
  decisionId: "process-change:rev-1:rev-2",
  authorityRef: "authority:process-owner",
  decisionDescriptor: humanDescriptor,
  decisionMetadata: humanMetadata,
};

test("process change decision preserves approved and rejected human-authoritative outcomes", () => {
  const approved = normalizeProcessSemanticChangeDecision(base);
  const rejected = normalizeProcessSemanticChangeDecision({ ...base, outcome: "rejected" });

  assert.deepEqual(approved, {
    contractVersion: "1.0.0",
    artifactRef: "process:order",
    fromRevisionRef: "rev-1",
    toRevisionRef: "rev-2",
    diffRef: "diff:rev-1:rev-2",
    classificationRef: "classification:rev-1:rev-2",
    rationaleRef: "rationale:rev-1:rev-2",
    reasonRef: "reason:policy-impact",
    outcome: "approved",
    decisionId: "process-change:rev-1:rev-2",
    authorityRef: "authority:process-owner",
    evidenceRefs: ["evidence:policy", "evidence:review"],
  });
  assert.equal(rejected.outcome, "rejected");
  assert.equal(rejected.decisionId, approved.decisionId);
  assert.equal(rejected.authorityRef, approved.authorityRef);
});

test("process change decision rejects deterministic and probabilistic authority substitution", () => {
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({
      ...base,
      decisionDescriptor: { ...humanDescriptor, category: "deterministic" },
      decisionMetadata: { invariantRef: "invariant:approve" },
    }),
    /requires compatible human authority/,
  );

  assert.throws(
    () => normalizeProcessSemanticChangeDecision({
      ...base,
      decisionDescriptor: { ...humanDescriptor, category: "probabilistic" },
      decisionMetadata: {
        inferenceRef: "inference:approve",
        inferenceContext: { confidence: 0.99, modelRef: "model:x", contextRef: "context:x" },
      },
    }),
    /requires compatible human authority/,
  );
});

test("process change decision fails closed on authority, decision and predecessor mismatch", () => {
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...base, authorityRef: "authority:other" }),
    /requires compatible human authority/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...base, decisionId: "process-change:forged" }),
    /decisionId must match/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({
      ...base,
      rationaleEvidence: { ...rationaleEvidence, diffRef: "diff:forged" },
    }),
    /diffRef must match/,
  );
});

test("process change decision rejects PR-approval substitution and payload/content injection", () => {
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...base, prApproval: { pullRequest: 480, approved: true } }),
    /unexpected field prApproval/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...base, payload: { content: "approve" } }),
    /unexpected field payload/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({
      ...base,
      rationaleEvidence: { ...rationaleEvidence, content: "approve" },
    }),
    /unexpected field content/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...base, approved: true }),
    /unexpected field approved/,
  );
});
