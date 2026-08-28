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
  contextRefs: ["context:billing", "context:finance"],
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

test("approved and rejected evolution outcomes are deterministic, frozen and reference-only", () => {
  const approvedA = authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision });
  const approvedB = authorizeEvolutionSemanticChange({
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

  assert.deepEqual(approvedA, approvedB);
  assert.equal(approvedA.outcome, "approved");
  assert.equal(rejected.outcome, "rejected");
  assert.equal(Object.isFrozen(approvedA), true);
  assert.deepEqual(Object.keys(approvedA).sort(), [
    "artifactRef", "authorityRef", "changeRef", "classificationRef", "decisionId", "diffRef",
    "evidenceRefs", "evolutionRequestId", "fromRevisionRef", "outcome", "reasonRef", "toRevisionRef",
  ].sort());
  assert.equal("payload" in approvedA, false);
  assert.equal("modelRef" in approvedA, false);
  assert.equal("gitIdentity" in approvedA, false);
});

test("existing EvolutionRequest create/validate/serialization remains compatible beside semantic-change outcome", () => {
  const before = evolutionRequest;
  const serialized = EvolutionRequestEvidence.toJson(before);
  const replayed = EvolutionRequestEvidence.fromJson(serialized);
  const validated = EvolutionRequestEvidence.validate(replayed);

  assert.deepEqual(replayed, before);
  assert.deepEqual(validated, before);
  assert.equal(EvolutionRequestEvidence.toJson(replayed), serialized);

  const outcome = authorizeEvolutionSemanticChange({ bindingInput: { ...bindingInput, evolutionRequest: replayed }, processChangeDecision });
  assert.equal(outcome.evolutionRequestId, before.evolutionRequestId);
  assert.equal(outcome.changeRef, before.changeEvidenceRef);
  assert.equal(outcome.reasonRef, before.reasonRef);
});

test("caller-supplied outcome and authority injection fail closed", () => {
  assert.throws(
    () => authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision, outcome: "approved" }),
    /UNEXPECTED_FIELD:outcome/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({ bindingInput, processChangeDecision, authorityRef: "authority:caller" }),
    /UNEXPECTED_FIELD:authorityRef/,
  );
  assert.throws(
    () => authorizeEvolutionSemanticChange({
      bindingInput,
      processChangeDecision: { ...processChangeDecision, authorityRef: "authority:caller" },
    }),
    /requires compatible human authority/,
  );
});
