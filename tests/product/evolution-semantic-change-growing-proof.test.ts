import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import { calculateProcessSemanticChangeDiff } from "@system-builder/contracts/process-change";
import {
  authorizeEvolutionSemanticChange,
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
  { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:invoice:v1" },
];
const toSnapshot = [
  { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:invoice:v2" },
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
const bindingInput = {
  evolutionRequest,
  changeRef: "change:billing:r1-r2",
  fromRevision,
  toRevision,
  fromSnapshot,
  toSnapshot,
  rationaleEvidence,
};
const humanDescriptor = {
  boundaryVersion: "1.0.0" as const,
  decisionId: "process-change:billing:r1-r2",
  category: "human-decision" as const,
};
const processChangeDecision = {
  rationaleRef: "rationale:billing:r1-r2",
  rationaleEvidence,
  outcome: "approved" as const,
  decisionId: "process-change:billing:r1-r2",
  authorityRef: "authority:process-owner",
  decisionDescriptor: humanDescriptor,
  decisionMetadata: { authorityRef: "authority:process-owner" },
};

function authorize(overrides: Record<string, unknown> = {}) {
  return authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision, ...overrides });
}

test("P18 Construction B growing proof composes canonical semantic-change truth through Support/Evolution", () => {
  const approved = authorize();
  const replay = authorizeEvolutionSemanticChange({
    bindingInput: {
      ...bindingInput,
      fromSnapshot: [...fromSnapshot].reverse(),
      toSnapshot: [...toSnapshot].reverse(),
    },
    processChangeDecision,
  });
  const rejected = authorizeEvolutionSemanticChange({
    bindingInput,
    processChangeDecision: { ...processChangeDecision, outcome: "rejected" },
  });

  assert.deepEqual(approved, replay);
  assert.equal(approved.outcome, "approved");
  assert.equal(rejected.outcome, "rejected");
  assert.equal(approved.artifactRef, "process:billing");
  assert.equal(approved.fromRevisionRef, "process:billing:r1");
  assert.equal(approved.toRevisionRef, "process:billing:r2");
  assert.equal(approved.diffRef, "diff:billing:r1-r2");
  assert.equal(approved.classificationRef, "classification:billing:r1-r2");
  assert.equal(approved.reasonRef, "reason:billing-policy-change");
  assert.equal(approved.authorityRef, "authority:process-owner");
  assert.equal(approved.changeRef, evolutionRequest.changeEvidenceRef);
  assert.equal(approved.evolutionRequestId, evolutionRequest.evolutionRequestId);
  assert.equal(Object.isFrozen(approved), true);

  const serialized = EvolutionRequestEvidence.toJson(evolutionRequest);
  assert.deepEqual(EvolutionRequestEvidence.fromJson(serialized), evolutionRequest);
});

test("P18 Construction B growing proof rejects forged revision and semantic-change truth", () => {
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput: { ...bindingInput, toRevision: { ...toRevision, artifactRef: "process:other" } },
      processChangeDecision,
    }),
    /same artifact/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput: {
        ...bindingInput,
        fromRevision: toRevision,
        toRevision: fromRevision,
        fromSnapshot: toSnapshot,
        toSnapshot: fromSnapshot,
      },
      processChangeDecision,
    }),
    /consecutive and ordered|canonical predecessor/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput: { ...bindingInput, toRevision: { ...toRevision, previousRevisionRef: "process:billing:forged" } },
      processChangeDecision,
    }),
    /canonical predecessor/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput: { ...bindingInput, fromSnapshot: [...fromSnapshot, fromSnapshot[0]] },
      processChangeDecision,
    }),
    /duplicate semanticRef/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput: {
        ...bindingInput,
        rationaleEvidence: {
          ...rationaleEvidence,
          classificationEvidence: {
            ...classificationEvidence,
            semanticDiff: { ...semanticDiff, toRevisionRef: "process:billing:forged" },
          },
        },
      },
      processChangeDecision,
    }),
    /exact semantic diff|revision endpoints/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: {
        ...processChangeDecision,
        rationaleEvidence: { ...rationaleEvidence, reasonRef: "reason:forged" },
      },
    }),
    /REASON_REFERENCE_MISMATCH/,
  );
});

test("P18 Construction B growing proof rejects non-human and mismatched approval authority", () => {
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: { ...processChangeDecision, authorityRef: "authority:other" },
    }),
    /requires compatible human authority/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: {
        ...processChangeDecision,
        decisionDescriptor: { ...humanDescriptor, category: "deterministic" },
        decisionMetadata: { invariantRef: "invariant:approve" },
      },
    }),
    /requires compatible human authority/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: {
        ...processChangeDecision,
        decisionDescriptor: { ...humanDescriptor, category: "probabilistic" },
        decisionMetadata: {
          inferenceRef: "inference:approve",
          inferenceContext: { confidence: 0.99, modelRef: "model:approval", contextRef: "context:billing" },
        },
      },
    }),
    /requires compatible human authority/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision, approved: true }),
    /UNEXPECTED_FIELD:approved/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: { ...processChangeDecision, prApproval: { pullRequest: 484, approved: true } },
    }),
    /unexpected field prApproval/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: { ...processChangeDecision, gitIdentity: "commit:approved" },
    }),
    /unexpected field gitIdentity/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision, payload: { approved: true } }),
    /UNEXPECTED_FIELD:payload/,
  );
});
