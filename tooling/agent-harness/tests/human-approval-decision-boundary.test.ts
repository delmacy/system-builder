import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { describe, it } from "node:test";
import { evaluateHumanAuthorityReservation } from "../../../packages/contracts/decision-boundary/index.js";
import {
  evaluateHumanApproval,
  humanApprovalId,
  humanApprovalSigningPayload,
  projectHumanApprovalDecisionBoundary,
} from "../src/human-approval.js";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
const semantic = {
  schema_version: 1 as const,
  authority_type: "HUMAN_OWNER" as const,
  approver_identity: "owner@example.test",
  key_id: "owner-p15",
  repository: "delmacy/system-builder",
  task_id: "TASK-305",
  risk: "high" as const,
  architecture_impact: false,
  pr_number: 360,
  base_ref: "main",
  head_ref: "sprint/P15-DECISION-BOUNDARY-ENFORCEMENT-01",
  head_sha: "a".repeat(40),
  decision: "APPROVED" as const,
  rationale: "Human owner reviewed the exact immutable decision.",
  approved_at: "2026-08-25T21:00:00.000Z",
  governance_policy_version: "1.0.0",
};
const policy = {
  schema_version: 1 as const,
  policy_version: "1.0.0",
  mode: "SOLO_DURABLE" as const,
  repository: semantic.repository,
  max_age_seconds: 7200,
  receipt_directory_env: "SYSTEM_BUILDER_HUMAN_APPROVAL_DIR",
  authorized_approvers: [{ approver_identity: semantic.approver_identity, key_id: semantic.key_id, public_key_pem: publicKeyPem }],
};
const expected = {
  repository: semantic.repository,
  taskId: semantic.task_id,
  risk: semantic.risk,
  architectureImpact: semantic.architecture_impact,
  prNumber: semantic.pr_number,
  baseRef: semantic.base_ref,
  headRef: semantic.head_ref,
  headSha: semantic.head_sha,
  observedAt: "2026-08-25T21:30:00.000Z",
};

function receipt() {
  return {
    ...semantic,
    approval_id: humanApprovalId(semantic),
    signature: sign(null, Buffer.from(humanApprovalSigningPayload(semantic)), privateKey).toString("base64"),
  };
}

describe("TASK-305 durable human approval decision boundary", () => {
  it("projects the real evaluation as human-reserved without changing approval semantics", () => {
    const evaluation = evaluateHumanApproval(policy, receipt(), expected);
    const projection = projectHumanApprovalDecisionBoundary({
      decisionId: "human-approval:TASK-305:PR-360",
      authorityRef: "ADR-0010:HUMAN_OWNER",
      evaluation,
    });

    assert.deepEqual(projection.evaluation, evaluation);
    assert.equal(projection.evaluation.decision, "VALID");
    assert.equal(projection.descriptor.category, "human-decision");
    assert.equal(projection.metadata.authorityRef, "ADR-0010:HUMAN_OWNER");
    assert.equal(projection.reservation.status, "compatible");
  });

  it("preserves missing approval as missing while still classifying the reserved authority", () => {
    const evaluation = evaluateHumanApproval(policy, undefined, expected);
    const projection = projectHumanApprovalDecisionBoundary({
      decisionId: "human-approval:TASK-305:missing",
      authorityRef: "ADR-0010:HUMAN_OWNER",
      evaluation,
    });

    assert.deepEqual(projection.evaluation, evaluation);
    assert.equal(projection.evaluation.decision, "MISSING");
    assert.equal(projection.reservation.status, "compatible");
  });

  it("rejects deterministic and probabilistic substitution for projected human authority", () => {
    const authorityRef = "ADR-0010:HUMAN_OWNER";
    const deterministic = evaluateHumanAuthorityReservation({
      descriptor: { boundaryVersion: "1.0.0", decisionId: "det-substitute", category: "deterministic" },
      metadata: { invariantRef: "approval-present" },
      authorityRef,
    });
    const probabilistic = evaluateHumanAuthorityReservation({
      descriptor: { boundaryVersion: "1.0.0", decisionId: "prob-substitute", category: "probabilistic" },
      metadata: {
        inferenceRef: "approval-guess",
        inferenceContext: { confidence: 1, modelRef: "model:test", contextRef: "context:test" },
      },
      authorityRef,
    });

    assert.equal(deterministic.status, "rejected");
    assert.equal(probabilistic.status, "rejected");
  });

  it("fails explicitly for malformed projection inputs", () => {
    const evaluation = evaluateHumanApproval(policy, receipt(), expected);
    assert.throws(() => projectHumanApprovalDecisionBoundary({ decisionId: "bad id", authorityRef: "ADR-0010:HUMAN_OWNER", evaluation }));
    assert.throws(() => projectHumanApprovalDecisionBoundary({ decisionId: "human-approval:TASK-305", evaluation }));
    assert.throws(() => projectHumanApprovalDecisionBoundary({ decisionId: "human-approval:TASK-305", authorityRef: "ADR-0010:HUMAN_OWNER", evaluation: { ...evaluation, decision: "APPROVED" } }));
  });
});
