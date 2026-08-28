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
const fromSnapshot = [{ semanticRef: "rule:invoice", evidenceRef: "evidence:invoice:v1" }];
const toSnapshot = [{ semanticRef: "rule:invoice", evidenceRef: "evidence:invoice:v2" }];
const semanticDiff = calculateProcessSemanticChangeDiff({ fromRevision, toRevision, fromSnapshot, toSnapshot });
const classifierDecision = verifyDecisionBoundary({
  descriptor: { boundaryVersion: "1.0.0", decisionId: "classification:billing", category: "deterministic" },
  metadata: { invariantRef: "invariant:semantic-change-classification" },
  riskCriticality: { risk: "medium", criticality: "standard" },
});
const classificationEvidence = {
  diffRef: "diff:billing:r1-r2",
  semanticDiff,
  classification: "breaking" as const,
  classifierDecision,
  evidenceRefs: ["evidence:classification"],
};
const rationaleEvidence = {
  diffRef: "diff:billing:r1-r2",
  semanticDiff,
  classificationRef: "classification:billing:r1-r2",
  classificationEvidence,
  reasonRef: "reason:billing-policy-change",
  evidenceRefs: ["evidence:process-owner-review"],
};
const evolutionRequest = EvolutionRequestEvidence.create({
  intakeId: "intake:billing-change",
  triageId: "triage:billing-change",
  requestedAt: "2026-08-28T20:00:00Z",
  requestedByRef: "actor:requester",
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

test("evolution semantic-change authority derives approved and rejected outcome from canonical human decision", () => {
  const approved = authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision });
  const rejected = authorizeEvolutionSemanticChange({
    bindingInput,
    processChangeDecision: { ...processChangeDecision, outcome: "rejected" },
  });

  assert.equal(approved.outcome, "approved");
  assert.equal(rejected.outcome, "rejected");
  assert.equal(approved.decisionId, "process-change:billing:r1-r2");
  assert.equal(approved.authorityRef, "authority:process-owner");
  assert.equal(approved.changeRef, "change:billing:r1-r2");
  assert.equal(Object.isFrozen(approved), true);
});

test("evolution semantic-change authority fails closed on authorityRef and decision mismatch", () => {
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
      processChangeDecision: { ...processChangeDecision, decisionId: "process-change:forged" },
    }),
    /decisionId must match/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: {
        ...processChangeDecision,
        rationaleEvidence: { ...rationaleEvidence, reasonRef: "reason:other" },
      },
    }),
    /REASON_REFERENCE_MISMATCH/,
  );
});

test("evolution semantic-change authority rejects deterministic, probabilistic and model substitution", () => {
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
});

test("evolution semantic-change authority rejects caller, PR/ADR and Git approval substitution", () => {
  assert.throws(
    () => authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision, approved: true }),
    /UNEXPECTED_FIELD:approved/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: { ...processChangeDecision, approved: true },
    }),
    /unexpected field approved/,
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
      processChangeDecision: { ...processChangeDecision, adrApproval: "ADR-approval" },
    }),
    /unexpected field adrApproval/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: { ...processChangeDecision, gitIdentity: "commit:approved" },
    }),
    /unexpected field gitIdentity/,
  );
});
