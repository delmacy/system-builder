import assert from "node:assert/strict";
import test from "node:test";

import {
  DECISION_BOUNDARY_VERSION,
  verifyDecisionBoundary,
} from "../../packages/contracts/decision-boundary/index.js";
import {
  PROCESS_CHANGE_CONTRACT_VERSION,
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeClassificationEvidence,
  normalizeProcessSemanticChangeDecision,
  normalizeProcessSemanticChangeRationaleEvidence,
} from "../../packages/contracts/process-change/index.js";
import {
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessRevisionIdentity,
} from "../../packages/contracts/process-versioning/index.js";

const PROCESS = Object.freeze({
  artifactRef: "process:reference-orders",
  predecessorRevisionRef: "process-revision:reference-orders:v1",
  successorRevisionRef: "process-revision:reference-orders:v2",
  authorityRef: "authority:reference-process-owner",
});

function predecessorRevision() {
  return normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: PROCESS.artifactRef,
    revisionRef: PROCESS.predecessorRevisionRef,
    revisionNumber: 1,
    previousRevisionRef: null,
  });
}

function successorRevision(previousRevisionRef: string = PROCESS.predecessorRevisionRef) {
  return normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: PROCESS.artifactRef,
    revisionRef: PROCESS.successorRevisionRef,
    revisionNumber: 2,
    previousRevisionRef,
  });
}

function successorApproval(options: Readonly<{
  previousRevisionRef?: string;
  outcome?: "approved" | "rejected";
  authorityCategory?: "human-decision" | "deterministic";
}> = {}) {
  const fromRevision = predecessorRevision();
  const toRevision = successorRevision(options.previousRevisionRef);
  const semanticDiff = calculateProcessSemanticChangeDiff({
    fromRevision,
    toRevision,
    fromSnapshot: [
      { semanticRef: "orders:receive", evidenceRef: "evidence:orders-receive:v1" },
    ],
    toSnapshot: [
      { semanticRef: "orders:receive", evidenceRef: "evidence:orders-receive:v1" },
      { semanticRef: "orders:validate", evidenceRef: "evidence:orders-validate:v2" },
    ],
  });

  const classifierDecision = verifyDecisionBoundary({
    descriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:classify-reference-orders-v2",
      category: "deterministic",
    },
    metadata: { invariantRef: "invariant:process-change-classification" },
    riskCriticality: { risk: "medium", criticality: "standard" },
    expectedCategory: "deterministic",
  });

  const classificationInput = {
    diffRef: "diff:reference-orders:v1-v2",
    semanticDiff,
    classification: "non-breaking" as const,
    classifierDecision,
    evidenceRefs: ["evidence:reference-orders:v1-v2"],
  };
  const classification = normalizeProcessSemanticChangeClassificationEvidence(classificationInput);

  const rationaleInput = {
    diffRef: classification.diffRef,
    semanticDiff,
    classificationRef: "classification:reference-orders:v1-v2",
    classificationEvidence: classificationInput,
    reasonRef: "reason:approved-successor-process-revision",
    evidenceRefs: ["evidence:reference-orders:v1-v2"],
  };
  const rationale = normalizeProcessSemanticChangeRationaleEvidence(rationaleInput);

  const authorityCategory = options.authorityCategory ?? "human-decision";
  const decision = normalizeProcessSemanticChangeDecision({
    rationaleRef: "rationale:reference-orders:v1-v2",
    rationaleEvidence: rationaleInput,
    outcome: options.outcome ?? "approved",
    decisionId: "decision:approve-reference-orders-v2",
    authorityRef: PROCESS.authorityRef,
    decisionDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:approve-reference-orders-v2",
      category: authorityCategory,
    },
    decisionMetadata: authorityCategory === "human-decision"
      ? { authorityRef: PROCESS.authorityRef }
      : { invariantRef: "invariant:not-business-approval" },
  });

  return Object.freeze({ fromRevision, toRevision, semanticDiff, classification, rationale, decision });
}

function requireApprovedSuccessor(input = successorApproval()) {
  if (input.decision.outcome !== "approved") {
    throw new Error("successor process revision requires authoritative approval");
  }
  if (input.decision.fromRevisionRef !== input.fromRevision.revisionRef) {
    throw new Error("approval predecessor does not match canonical predecessor revision");
  }
  if (input.decision.toRevisionRef !== input.toRevision.revisionRef) {
    throw new Error("approval successor does not match canonical successor revision");
  }
  return input;
}

test("TASK-457 freezes deterministic predecessor A and authoritative approved successor B", () => {
  const first = requireApprovedSuccessor();
  const repeated = requireApprovedSuccessor();

  assert.deepEqual(first, repeated);
  assert.equal(first.fromRevision.revisionRef, PROCESS.predecessorRevisionRef);
  assert.equal(first.toRevision.revisionRef, PROCESS.successorRevisionRef);
  assert.equal(first.toRevision.previousRevisionRef, first.fromRevision.revisionRef);
  assert.equal(first.toRevision.revisionNumber, first.fromRevision.revisionNumber + 1);
  assert.equal(first.decision.outcome, "approved");
  assert.equal(first.decision.authorityRef, PROCESS.authorityRef);
  assert.equal(first.decision.fromRevisionRef, first.fromRevision.revisionRef);
  assert.equal(first.decision.toRevisionRef, first.toRevision.revisionRef);
  assert.equal(first.classification.contractVersion, PROCESS_CHANGE_CONTRACT_VERSION);

  const evidence = JSON.stringify(first);
  assert.equal(evidence.includes("EnvironmentProfile"), false);
  assert.equal(evidence.includes("secret://"), false);
});

test("TASK-457 fails closed for rejected, substituted, lineage-broken or non-human successor approval", () => {
  assert.throws(
    () => requireApprovedSuccessor(successorApproval({ outcome: "rejected" })),
    /requires authoritative approval/,
  );

  assert.throws(
    () => successorApproval({ previousRevisionRef: "process-revision:reference-orders:substituted" }),
    /canonical predecessor/,
  );

  assert.throws(
    () => normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: PROCESS.artifactRef,
      revisionRef: PROCESS.successorRevisionRef,
      revisionNumber: 2,
      previousRevisionRef: null,
    }),
    /successor revision must declare previousRevisionRef/,
  );

  assert.throws(
    () => successorApproval({ authorityCategory: "deterministic" }),
    /requires compatible human authority/,
  );
});
