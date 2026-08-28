import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import {
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeClassificationEvidence,
  normalizeProcessSemanticChangeDecision,
  normalizeProcessSemanticChangeRationaleEvidence,
} from "@system-builder/contracts/process-change";

const revision = (
  artifactRef: string,
  revisionRef: string,
  revisionNumber: number,
  previousRevisionRef: string | null,
) => ({
  contractVersion: "1.0.0" as const,
  artifactRef,
  revisionRef,
  revisionNumber,
  previousRevisionRef,
});

const fromRevision = revision("process:order", "rev-1", 1, null);
const toRevision = revision("process:order", "rev-2", 2, "rev-1");
const fromSnapshot = [
  { semanticRef: "rule:approval", evidenceRef: "evidence:approval:v1" },
  { semanticRef: "rule:legacy", evidenceRef: "evidence:legacy" },
];
const toSnapshot = [
  { semanticRef: "rule:approval", evidenceRef: "evidence:approval:v2" },
  { semanticRef: "rule:new", evidenceRef: "evidence:new" },
];

const diff = calculateProcessSemanticChangeDiff({ fromRevision, toRevision, fromSnapshot, toSnapshot });
const diffRef = "diff:rev-1:rev-2";
const classificationRef = "classification:rev-1:rev-2";
const rationaleRef = "rationale:rev-1:rev-2";

const classifierDecision = verifyDecisionBoundary({
  descriptor: {
    boundaryVersion: "1.0.0",
    decisionId: "classification-decision:rev-1:rev-2",
    category: "deterministic",
  },
  metadata: { invariantRef: "invariant:semantic-change-classification" },
  riskCriticality: { risk: "medium", criticality: "standard" },
});

const classificationInput = {
  diffRef,
  semanticDiff: diff,
  classification: "breaking" as const,
  classifierDecision,
  evidenceRefs: ["evidence:classification:breaking"],
};

const rationaleInput = {
  diffRef,
  semanticDiff: diff,
  classificationRef,
  classificationEvidence: classificationInput,
  reasonRef: "reason:approval-rule-changed",
  evidenceRefs: ["evidence:owner-review", "evidence:impact-analysis"],
};

const humanDescriptor = {
  boundaryVersion: "1.0.0" as const,
  decisionId: "process-change-decision:rev-1:rev-2",
  category: "human-decision" as const,
};
const humanMetadata = { authorityRef: "authority:process-owner" };
const decisionInput = {
  rationaleRef,
  rationaleEvidence: rationaleInput,
  outcome: "approved" as const,
  decisionId: "process-change-decision:rev-1:rev-2",
  authorityRef: "authority:process-owner",
  decisionDescriptor: humanDescriptor,
  decisionMetadata: humanMetadata,
};

test("WBS 18.2 growing proof composes diff, classification, rationale and human decision", () => {
  assert.deepEqual(diff, {
    contractVersion: "1.0.0",
    artifactRef: "process:order",
    fromRevisionRef: "rev-1",
    toRevisionRef: "rev-2",
    addedSemanticRefs: ["rule:new"],
    removedSemanticRefs: ["rule:legacy"],
    changedSemanticRefs: ["rule:approval"],
  });

  const classification = normalizeProcessSemanticChangeClassificationEvidence(classificationInput);
  assert.equal(classification.classification, "breaking");
  assert.equal(classification.classifierCategory, "deterministic");

  const rationale = normalizeProcessSemanticChangeRationaleEvidence(rationaleInput);
  assert.equal(rationale.diffRef, diffRef);
  assert.equal(rationale.classificationRef, classificationRef);
  assert.equal(rationale.reasonRef, "reason:approval-rule-changed");

  const approved = normalizeProcessSemanticChangeDecision(decisionInput);
  const rejected = normalizeProcessSemanticChangeDecision({ ...decisionInput, outcome: "rejected" });
  assert.equal(approved.outcome, "approved");
  assert.equal(rejected.outcome, "rejected");
  assert.equal(approved.decisionId, rejected.decisionId);
  assert.equal(approved.authorityRef, "authority:process-owner");
});

test("WBS 18.2 growing proof preserves canonical WBS 18.1 predecessor truth", () => {
  assert.throws(
    () => calculateProcessSemanticChangeDiff({
      fromRevision,
      toRevision: revision("process:other", "rev-2", 2, "rev-1"),
      fromSnapshot,
      toSnapshot,
    }),
    /same artifact/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({
      fromRevision: toRevision,
      toRevision: fromRevision,
      fromSnapshot: toSnapshot,
      toSnapshot: fromSnapshot,
    }),
    /consecutive and ordered|canonical predecessor/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({
      fromRevision,
      toRevision: revision("process:order", "rev-2", 2, "rev-forged"),
      fromSnapshot,
      toSnapshot,
    }),
    /canonical predecessor/,
  );
});

test("WBS 18.2 growing proof fails closed on semantic and classification reference mismatch", () => {
  assert.throws(
    () => calculateProcessSemanticChangeDiff({
      fromRevision,
      toRevision,
      fromSnapshot: [...fromSnapshot, fromSnapshot[0]],
      toSnapshot,
    }),
    /duplicate semanticRef/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({
      ...rationaleInput,
      diffRef: "diff:mismatch",
    }),
    /diffRef must match/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeRationaleEvidence({
      ...rationaleInput,
      classificationEvidence: { ...classificationInput, semanticDiff: { ...diff, toRevisionRef: "rev-forged" } },
    }),
    /exact semantic diff|revision endpoints/,
  );
});

test("WBS 18.2 growing proof keeps classification and machine provenance non-authoritative for approval", () => {
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({
      ...decisionInput,
      decisionDescriptor: { ...humanDescriptor, category: "deterministic" },
      decisionMetadata: { invariantRef: "invariant:classification-is-approval" },
    }),
    /requires compatible human authority/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({
      ...decisionInput,
      decisionDescriptor: { ...humanDescriptor, category: "probabilistic" },
      decisionMetadata: {
        inferenceRef: "inference:model-approval",
        inferenceContext: { confidence: 1, modelRef: "model:strong", contextRef: "context:change" },
      },
    }),
    /requires compatible human authority/,
  );
});

test("WBS 18.2 growing proof rejects authority, PR approval and caller approval substitution", () => {
  const rejected = { ...decisionInput, outcome: "rejected" as const };
  assert.equal(normalizeProcessSemanticChangeDecision(rejected).outcome, "rejected");

  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...rejected, outcome: "approved", authorityRef: "authority:other" }),
    /requires compatible human authority/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...decisionInput, prApproval: { pullRequest: 480, approved: true } }),
    /unexpected field prApproval/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...decisionInput, approved: true }),
    /unexpected field approved/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...decisionInput, git: { sha: "deadbeef", approved: true } }),
    /unexpected field git/,
  );
  assert.throws(
    () => normalizeProcessSemanticChangeDecision({ ...decisionInput, payload: { content: "approve" } }),
    /unexpected field payload/,
  );
});
