import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import * as approvalModule from "../src/human-approval.js";
import { evaluateHumanApproval, evaluateStoredHumanApproval, humanApprovalId, humanApprovalSigningPayload } from "../src/human-approval.js";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
const observedAt = "2026-08-13T12:00:00.000Z";
const semantic = {
  schema_version: 1 as const, authority_type: "HUMAN_OWNER" as const, approver_identity: "owner@example.test", key_id: "owner-2026-01",
  repository: "delmacy/system-builder", task_id: "TASK-029", risk: "high" as const, architecture_impact: true,
  pr_number: 75, base_ref: "main", head_ref: "task/029", head_sha: "a".repeat(40), decision: "APPROVED" as const,
  rationale: "Reviewed exact diff and accept the recorded architecture risk.", approved_at: "2026-08-13T11:00:00.000Z",
  governance_policy_version: "1.0.0",
};
const policy = { schema_version: 1 as const, policy_version: "1.0.0", mode: "SOLO_DURABLE" as const,
  repository: "delmacy/system-builder", max_age_seconds: 7200, receipt_directory_env: "SYSTEM_BUILDER_HUMAN_APPROVAL_DIR",
  authorized_approvers: [{ approver_identity: semantic.approver_identity, key_id: semantic.key_id, public_key_pem: publicKeyPem }] };
const expected = { repository: semantic.repository, taskId: semantic.task_id, risk: semantic.risk, architectureImpact: true,
  prNumber: semantic.pr_number, baseRef: semantic.base_ref, headRef: semantic.head_ref, headSha: semantic.head_sha, observedAt };

function receipt(changes: Record<string, unknown> = {}) {
  const value = { ...semantic, ...changes };
  return { ...value, approval_id: humanApprovalId(value), signature: sign(null, Buffer.from(humanApprovalSigningPayload(value)), privateKey).toString("base64") };
}

describe("durable human approval", () => {
  it("accepts an authorized signed solo approval", () => assert.equal(evaluateHumanApproval(policy, receipt(), expected).decision, "VALID"));
  it("blocks a wrong head SHA", () => assert.ok(evaluateHumanApproval(policy, receipt(), { ...expected, headSha: "b".repeat(40) }).reason_codes.includes("IDENTITY_MISMATCH")));
  it("blocks a wrong PR", () => assert.ok(evaluateHumanApproval(policy, receipt(), { ...expected, prNumber: 76 }).reason_codes.includes("IDENTITY_MISMATCH")));
  it("blocks a wrong task", () => assert.ok(evaluateHumanApproval(policy, receipt(), { ...expected, taskId: "TASK-028" }).reason_codes.includes("IDENTITY_MISMATCH")));
  it("blocks an unauthorized approver", () => assert.ok(evaluateHumanApproval({ ...policy, authorized_approvers: [] }, receipt(), expected).reason_codes.includes("APPROVER_UNAUTHORIZED")));
  it("blocks a rejected decision", () => assert.ok(evaluateHumanApproval(policy, receipt({ decision: "REJECTED" }), expected).reason_codes.includes("DECISION_REJECTED")));
  it("blocks a stale approval", () => assert.ok(evaluateHumanApproval({ ...policy, max_age_seconds: 60 }, receipt(), expected).reason_codes.includes("APPROVAL_STALE")));
  it("blocks a future approval", () => assert.ok(evaluateHumanApproval(policy, receipt({ approved_at: "2026-08-14T11:00:00.000Z" }), expected).reason_codes.includes("APPROVAL_FUTURE")));
  it("blocks an invalid signature", () => assert.ok(evaluateHumanApproval(policy, { ...receipt(), signature: Buffer.from("invalid").toString("base64") }, expected).reason_codes.includes("SIGNATURE_INVALID")));
  it("keeps team mode independent", () => assert.deepEqual(evaluateHumanApproval({ ...policy, mode: "TEAM_INDEPENDENT" }, receipt(), expected).reason_codes, ["POLICY_DISALLOWS_DURABLE"]));
  it("treats an unused team-mode alternate channel as neutral", () => assert.deepEqual(evaluateHumanApproval({ ...policy, mode: "TEAM_INDEPENDENT" }, undefined, expected), { decision: "MISSING", approval_id: null, reason_codes: ["APPROVAL_MISSING"] }));
  it("fails closed on an unknown policy", () => assert.deepEqual(evaluateHumanApproval({ ...policy, mode: "UNKNOWN" }, receipt(), expected).reason_codes, ["POLICY_INVALID"]));
  it("is deterministic for equivalent evaluations", () => assert.deepEqual(evaluateHumanApproval(policy, receipt(), expected), evaluateHumanApproval(policy, receipt(), expected)));
  it("exposes no production signing capability", () => assert.equal("signHumanApproval" in approvalModule, false));
  it("fails closed for a missing or relative external store", () => {
    const previous = process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR;
    try {
      delete process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR;
      assert.equal(evaluateStoredHumanApproval(process.cwd(), expected).decision, "MISSING");
      process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = "relative";
      assert.equal(evaluateStoredHumanApproval(process.cwd(), expected).decision, "MISSING");
    } finally { if (previous === undefined) delete process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR; else process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = previous; }
  });
  it("reads the exact signed receipt from an absolute external store", () => {
    const root = mkdtempSync(join(tmpdir(), "approval-root-")); const store = mkdtempSync(join(tmpdir(), "approval-store-"));
    const policyDirectory = join(root, "tooling/agent-harness/policies"); mkdirSync(policyDirectory, { recursive: true });
    writeFileSync(join(policyDirectory, "HUMAN_APPROVAL.json"), JSON.stringify(policy));
    writeFileSync(join(store, `${expected.taskId}-PR-${expected.prNumber}-${expected.headSha}.json`), JSON.stringify(receipt()));
    const previous = process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR;
    try { process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = store; assert.equal(evaluateStoredHumanApproval(root, expected).decision, "VALID"); }
    finally { if (previous === undefined) delete process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR; else process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = previous; }
  });
});
