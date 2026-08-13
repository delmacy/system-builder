import { createHash, verify } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const taskId = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const sha = z.string().regex(/^[0-9a-f]{40}$/);
const timestamp = z.iso.datetime({ offset: true });

export const humanApprovalPolicySchema = z.object({
  schema_version: z.literal(1),
  policy_version: z.string().min(1),
  mode: z.enum(["TEAM_INDEPENDENT", "SOLO_DURABLE"]),
  repository: z.string().min(1),
  max_age_seconds: z.number().int().positive(),
  authorized_approvers: z.array(z.object({
    approver_identity: z.string().min(1),
    key_id: z.string().min(1),
    public_key_pem: z.string().startsWith("-----BEGIN PUBLIC KEY-----"),
  }).strict()),
}).strict();

const approvalSemanticSchema = z.object({
  schema_version: z.literal(1), authority_type: z.literal("HUMAN_OWNER"),
  approver_identity: z.string().min(1), key_id: z.string().min(1), repository: z.string().min(1),
  task_id: taskId, risk: z.enum(["low", "medium", "high"]), architecture_impact: z.boolean(),
  pr_number: z.number().int().positive(), base_ref: z.string().min(1), head_ref: z.string().min(1), head_sha: sha,
  decision: z.enum(["APPROVED", "REJECTED"]), rationale: z.string().min(1), approved_at: timestamp,
  governance_policy_version: z.string().min(1),
}).strict();

export const humanApprovalReceiptSchema = approvalSemanticSchema.extend({
  approval_id: z.string().regex(/^HAPR-[0-9a-f]{64}$/),
  signature: z.string().min(1),
}).strict();

export const humanApprovalEvaluationSchema = z.object({
  decision: z.enum(["VALID", "INVALID", "MISSING"]),
  approval_id: z.string().nullable(),
  reason_codes: z.array(z.enum([
    "POLICY_INVALID", "POLICY_DISALLOWS_DURABLE", "APPROVAL_MISSING", "APPROVAL_INVALID",
    "IDENTITY_MISMATCH", "APPROVER_UNAUTHORIZED", "DECISION_REJECTED", "APPROVAL_FUTURE",
    "APPROVAL_STALE", "SIGNATURE_INVALID",
  ])),
}).strict();

export type HumanApprovalPolicy = z.infer<typeof humanApprovalPolicySchema>;
export type HumanApprovalReceipt = z.infer<typeof humanApprovalReceiptSchema>;
export type HumanApprovalEvaluation = z.infer<typeof humanApprovalEvaluationSchema>;
export type HumanApprovalExpected = {
  repository: string; taskId: string; risk: "low" | "medium" | "high"; architectureImpact: boolean;
  prNumber: number; baseRef: string; headRef: string; headSha: string; observedAt: string;
};

export function humanApprovalSigningPayload(receipt: Omit<HumanApprovalReceipt, "approval_id" | "signature">): string {
  return canonicalJson(approvalSemanticSchema.parse(receipt));
}

export function humanApprovalId(receipt: Omit<HumanApprovalReceipt, "approval_id" | "signature">): string {
  return `HAPR-${createHash("sha256").update(humanApprovalSigningPayload(receipt)).digest("hex")}`;
}

export function evaluateHumanApproval(policyInput: unknown, receiptInput: unknown, expected: HumanApprovalExpected): HumanApprovalEvaluation {
  const policy = humanApprovalPolicySchema.safeParse(policyInput);
  if (!policy.success) return evaluation("INVALID", null, ["POLICY_INVALID"]);
  if (policy.data.mode !== "SOLO_DURABLE") return evaluation("INVALID", null, ["POLICY_DISALLOWS_DURABLE"]);
  if (receiptInput === undefined || receiptInput === null) return evaluation("MISSING", null, ["APPROVAL_MISSING"]);
  const receipt = humanApprovalReceiptSchema.safeParse(receiptInput);
  if (!receipt.success) return evaluation("INVALID", null, ["APPROVAL_INVALID"]);
  const value = receipt.data;
  const { approval_id: recordedApprovalId, signature, ...semantic } = value;
  const reasons: HumanApprovalEvaluation["reason_codes"] = [];
  const identityMatches = policy.data.repository === expected.repository && value.repository === expected.repository && value.task_id === expected.taskId
    && value.risk === expected.risk && value.architecture_impact === expected.architectureImpact
    && value.pr_number === expected.prNumber && value.base_ref === expected.baseRef
    && value.head_ref === expected.headRef && value.head_sha === expected.headSha
    && value.governance_policy_version === policy.data.policy_version
    && recordedApprovalId === humanApprovalId(semantic);
  if (!identityMatches) reasons.push("IDENTITY_MISMATCH");
  const authority = policy.data.authorized_approvers.find((item) => item.approver_identity === value.approver_identity && item.key_id === value.key_id);
  if (!authority) reasons.push("APPROVER_UNAUTHORIZED");
  if (value.decision !== "APPROVED") reasons.push("DECISION_REJECTED");
  const approved = Date.parse(value.approved_at); const observed = Date.parse(timestamp.parse(expected.observedAt));
  if (approved > observed) reasons.push("APPROVAL_FUTURE");
  if (observed - approved > policy.data.max_age_seconds * 1000) reasons.push("APPROVAL_STALE");
  if (authority) {
    try {
      if (!verify(null, Buffer.from(humanApprovalSigningPayload(semantic)), authority.public_key_pem, Buffer.from(signature, "base64"))) reasons.push("SIGNATURE_INVALID");
    } catch { reasons.push("SIGNATURE_INVALID"); }
  }
  return evaluation(reasons.length ? "INVALID" : "VALID", value.approval_id, [...new Set(reasons)]);
}

export function evaluateStoredHumanApproval(root: string, expected: HumanApprovalExpected): HumanApprovalEvaluation {
  const policyPath = resolve(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json");
  const receiptPath = resolve(root, "docs/evidence/approvals", `${expected.taskId}-PR-${expected.prNumber}-${expected.headSha}.json`);
  const policy = existsSync(policyPath) ? JSON.parse(readFileSync(policyPath, "utf8")) : undefined;
  const receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, "utf8")) : undefined;
  return evaluateHumanApproval(policy, receipt, expected);
}

function evaluation(decision: HumanApprovalEvaluation["decision"], approvalId: string | null, reasonCodes: HumanApprovalEvaluation["reason_codes"]): HumanApprovalEvaluation {
  return humanApprovalEvaluationSchema.parse({ decision, approval_id: approvalId, reason_codes: reasonCodes });
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
