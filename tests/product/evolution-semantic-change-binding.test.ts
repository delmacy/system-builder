import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import {
  calculateProcessSemanticChangeDiff,
} from "@system-builder/contracts/process-change";
import {
  bindEvolutionSemanticChangeToRequest,
  EvolutionRequestEvidence,
} from "../../packages/support-evolution/index.js";

const fromRevision = {
  contractVersion: "1.0.0" as const,
  artifactRef: "process:billing",
  revisionRef: "process:billing:r1",
  revisionNumber: 1,
  previousRevisionRef: null,
};

const toRevision = {
  contractVersion: "1.0.0" as const,
  artifactRef: "process:billing",
  revisionRef: "process:billing:r2",
  revisionNumber: 2,
  previousRevisionRef: "process:billing:r1",
};

const fromSnapshot = [
  { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:rule:v1" },
];

const toSnapshot = [
  { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:rule:v2" },
  { semanticRef: "rule:late-fee", evidenceRef: "evidence:late-fee:v1" },
];

const semanticDiff = calculateProcessSemanticChangeDiff({ fromRevision, toRevision, fromSnapshot, toSnapshot });
const classifierDecision = verifyDecisionBoundary({
  descriptor: {
    boundaryVersion: "1.0.0",
    decisionId: "classification-decision:billing:r1-r2",
    category: "deterministic",
  },
  metadata: { invariantRef: "invariant:semantic-change-classification" },
  riskCriticality: { risk: "medium", criticality: "standard" },
});

const classificationEvidence = {
  diffRef: "diff:billing:r1-r2",
  semanticDiff,
  classification: "breaking" as const,
  classifierDecision,
  evidenceRefs: ["evidence:classification:billing"],
};

const rationaleEvidence = {
  diffRef: "diff:billing:r1-r2",
  semanticDiff,
  classificationRef: "classification:billing:r1-r2",
  classificationEvidence,
  reasonRef: "reason:billing-policy-change",
  evidenceRefs: ["evidence:impact-analysis", "evidence:process-owner-review"],
};

const evolutionRequest = EvolutionRequestEvidence.create({
  intakeId: "intake:billing-change",
  triageId: "triage:billing-change",
  requestedAt: "2026-08-28T20:00:00Z",
  requestedByRef: "actor:process-owner",
  changeEvidenceRef: "change:billing:r1-r2",
  reasonRef: "reason:billing-policy-change",
  contextRefs: ["context:billing"],
});

const validBindingInput = {
  evolutionRequest,
  changeRef: "change:billing:r1-r2",
  fromRevision,
  toRevision,
  fromSnapshot,
  toSnapshot,
  rationaleEvidence,
};

test("evolution semantic-change binding ties request, predecessor, diff, classification and rationale to one change", () => {
  const bound = bindEvolutionSemanticChangeToRequest(validBindingInput);

  assert.deepEqual(bound, {
    evolutionRequestId: evolutionRequest.evolutionRequestId,
    changeRef: "change:billing:r1-r2",
    artifactRef: "process:billing",
    fromRevisionRef: "process:billing:r1",
    toRevisionRef: "process:billing:r2",
    diffRef: "diff:billing:r1-r2",
    classificationRef: "classification:billing:r1-r2",
    reasonRef: "reason:billing-policy-change",
    evidenceRefs: ["evidence:impact-analysis", "evidence:process-owner-review"],
  });
  assert.equal(Object.isFrozen(bound), true);
  assert.equal("classification" in bound, false);
  assert.equal("outcome" in bound, false);
});

test("evolution semantic-change binding rejects cross-artifact and reversed or forged predecessor truth", () => {
  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      toRevision: { ...toRevision, artifactRef: "process:other" },
    }),
    /same artifact/,
  );

  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      fromRevision: toRevision,
      toRevision: fromRevision,
      fromSnapshot: toSnapshot,
      toSnapshot: fromSnapshot,
    }),
    /consecutive and ordered|canonical predecessor/,
  );

  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      toRevision: { ...toRevision, previousRevisionRef: "process:billing:forged" },
    }),
    /canonical predecessor/,
  );
});

test("evolution semantic-change binding rejects duplicate semantic refs and classification mismatch", () => {
  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      fromSnapshot: [...fromSnapshot, fromSnapshot[0]],
    }),
    /duplicate semanticRef/,
  );

  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      rationaleEvidence: {
        ...rationaleEvidence,
        classificationEvidence: {
          ...classificationEvidence,
          semanticDiff: { ...semanticDiff, toRevisionRef: "process:billing:forged" },
        },
      },
    }),
    /exact semantic diff|revision endpoints/,
  );
});

test("evolution semantic-change binding rejects request reason/change mismatch and malformed evidence refs", () => {
  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      evolutionRequest: EvolutionRequestEvidence.create({
        ...evolutionRequest,
        changeEvidenceRef: "change:other",
      }),
    }),
    /CHANGE_REFERENCE_MISMATCH/,
  );

  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      evolutionRequest: EvolutionRequestEvidence.create({
        ...evolutionRequest,
        reasonRef: "reason:other",
      }),
    }),
    /REASON_REFERENCE_MISMATCH/,
  );

  assert.throws(
    () => bindEvolutionSemanticChangeToRequest({
      ...validBindingInput,
      rationaleEvidence: {
        ...rationaleEvidence,
        evidenceRefs: ["evidence:duplicate", "evidence:duplicate"],
      },
    }),
    /duplicate reference/,
  );
});
