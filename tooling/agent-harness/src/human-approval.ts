import { createHash, verify } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { z } from "zod";
import {
  DECISION_BOUNDARY_VERSION,
  evaluateHumanAuthorityReservation,
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  type DecisionBoundaryDescriptor,
  type HumanAuthorityReservationEvaluation,
} from "../../../packages/contracts/decision-boundary/index.js";
import type { Task } from "./task.js";

const taskId = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const sha = z.string().regex(/^[0-9a-f]{40}$/);
const timestamp = z.iso.datetime({ offset: true });
const risk = z.enum(["low", "medium", "high"]);
const developmentScopeId = z.string().regex(/^[A-Z0-9][A-Z0-9._-]{2,127}$/i);
const executor = z.enum(["opencode", "codex", "any"]);
const modelTier = z.enum(["free", "cheap", "architecture"]);
const decisionBoundaryToken = z.string().min(1).regex(/^\S+$/);

export const developmentAuthorityScopeSchema = z.object({
  scope_type: z.enum(["SPRINT", "WORK_PACKAGE"]),
  scope_id: developmentScopeId,
  task_ids: z.array(taskId).min(1),
  risk_ceiling: risk,
  allow_architecture: z.boolean(),
  base_ref: z.string().min(1),
  valid_from: timestamp,
  expires_at: timestamp,
  allowed_executors: z.array(executor).min(1),
  allowed_model_tiers: z.array(modelTier).min(1),
  allow_executor_override: z.boolean(),
}).strict().superRefine((value, context) => {
  if (new Set(value.task_ids).size !== value.task_ids.length) {
    context.addIssue({ code: "custom", path: ["task_ids"], message: "task ids must be unique" });
  }
  if (Date.parse(value.valid_from) >= Date.parse(value.expires_at)) {
    context.addIssue({ code: "custom", path: ["expires_at"], message: "expires_at must be after valid_from" });
  }
});

export const humanApprovalPolicySchema = z.object({
  schema_version: z.literal(1),
  policy_version: z.string().min(1),
  mode: z.enum(["TEAM_INDEPENDENT", "SOLO_DURABLE", "DEVELOPMENT_TRUSTED"]),
  repository: z.string().min(1),
  max_age_seconds: z.number().int().positive(),
  receipt_directory_env: z.string().regex(/^[A-Z][A-Z0-9_]+$/),
  authorized_approvers: z.array(z.object({
    approver_identity: z.string().min(1),
    key_id: z.string().min(1),
    public_key_pem: z.string().startsWith("-----BEGIN PUBLIC KEY-----"),
  }).strict()),
  development_authority_scopes: z.array(developmentAuthorityScopeSchema).default([]),
}).strict();

const approvalSemanticSchema = z.object({
  schema_version: z.literal(1), authority_type: z.literal("HUMAN_OWNER"),
  approver_identity: z.string().min(1), key_id: z.string().min(1), repository: z.string().min(1),
  task_id: taskId, risk, architecture_impact: z.boolean(),
  pr_number: z.number().int().positive(), base_ref: z.string().min(1), head_ref: z.string().min(1), head_sha: sha,
  decision: z.enum(["APPROVED", "REJECTED"]), rationale: z.string().min(1), approved_at: timestamp,
  governance_policy_version: z.string().min(1),
}).strict();

export const humanApprovalReceiptSchema = approvalSemanticSchema.extend({
  approval_id: z.string().regex(/^HAPR-[0-9a-f]{64}$/),
  signature: z.string().min(1),
}).strict();

export const humanApprovalEvaluationSchema = z.object({
  decision: z.enum(["VALID", "INVALID", "MISSING", "DEVELOPMENT_TRUSTED"]),
  approval_id: z.string().nullable(),
  reason_codes: z.array(z.enum([
    "POLICY_INVALID", "POLICY_DISALLOWS_DURABLE", "APPROVAL_MISSING", "APPROVAL_INVALID",
    "IDENTITY_MISMATCH", "APPROVER_UNAUTHORIZED", "DECISION_REJECTED", "APPROVAL_FUTURE",
    "APPROVAL_STALE", "SIGNATURE_INVALID", "DEVELOPMENT_SCOPE_MISSING", "DEVELOPMENT_SCOPE_INVALID",
    "DEVELOPMENT_SCOPE_TASK_MISMATCH", "DEVELOPMENT_SCOPE_RISK_EXCEEDED", "DEVELOPMENT_SCOPE_ARCHITECTURE_DISALLOWED",
    "DEVELOPMENT_SCOPE_BASE_MISMATCH", "DEVELOPMENT_SCOPE_NOT_YET_VALID", "DEVELOPMENT_SCOPE_EXPIRED",
  ])),
}).strict();

const humanApprovalDecisionBoundaryProjectionInputSchema = z.object({
  decisionId: decisionBoundaryToken,
  authorityRef: decisionBoundaryToken,
  evaluation: humanApprovalEvaluationSchema,
}).strict();

export type HumanApprovalPolicy = z.infer<typeof humanApprovalPolicySchema>;
export type DevelopmentAuthorityScope = z.infer<typeof developmentAuthorityScopeSchema>;
export type HumanApprovalReceipt = z.infer<typeof humanApprovalReceiptSchema>;
export type HumanApprovalEvaluation = z.infer<typeof humanApprovalEvaluationSchema>;
export type HumanApprovalExpected = {
  repository: string; taskId: string; risk: "low" | "medium" | "high"; architectureImpact: boolean;
  prNumber: number; baseRef: string; headRef: string; headSha: string; observedAt: string;
};
export type HumanApprovalDecisionBoundaryProjection = Readonly<{
  descriptor: DecisionBoundaryDescriptor;
  metadata: Readonly<{ authorityRef: string }>;
  reservation: HumanAuthorityReservationEvaluation;
  evaluation: HumanApprovalEvaluation;
}>;

export function humanApprovalSigningPayload(receipt: Omit<HumanApprovalReceipt, "approval_id" | "signature">): string {
  return canonicalJson(approvalSemanticSchema.parse(receipt));
}

export function humanApprovalId(receipt: Omit<HumanApprovalReceipt, "approval_id" | "signature">): string {
  return `HAPR-${createHash("sha256").update(humanApprovalSigningPayload(receipt)).digest("hex")}`;
}

export function evaluateHumanApproval(policyInput: unknown, receiptInput: unknown, expected: HumanApprovalExpected): HumanApprovalEvaluation {
  const policy = humanApprovalPolicySchema.safeParse(policyInput);
  if (!policy.success) return evaluation("INVALID", null, ["POLICY_INVALID"]);
  if (receiptInput === undefined || receiptInput === null) return evaluation("MISSING", null, ["APPROVAL_MISSING"]);
  if (policy.data.mode !== "SOLO_DURABLE") return evaluation("INVALID", null, ["POLICY_DISALLOWS_DURABLE"]);
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

export function projectHumanApprovalDecisionBoundary(input: unknown): HumanApprovalDecisionBoundaryProjection {
  const parsed = humanApprovalDecisionBoundaryProjectionInputSchema.parse(input);
  const descriptor = normalizeDecisionBoundaryDescriptor({
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: parsed.decisionId,
    category: "human-decision",
  });
  const metadata: Readonly<{ authorityRef: string }> = { authorityRef: parsed.authorityRef };
  normalizeDecisionCategoryMetadata("human-decision", metadata);
  const reservation = evaluateHumanAuthorityReservation({ descriptor, metadata, authorityRef: parsed.authorityRef });
  if (reservation.status !== "compatible") {
    throw new TypeError(`Human approval decision-boundary projection failed: ${reservation.diagnostic}`);
  }
  return { descriptor, metadata, reservation, evaluation: parsed.evaluation };
}

export function evaluateStoredHumanApproval(root: string, expected: HumanApprovalExpected): HumanApprovalEvaluation {
  const policyPath = resolve(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json");
  const policy = existsSync(policyPath) ? JSON.parse(readFileSync(policyPath, "utf8")) : undefined;
  const parsedPolicy = humanApprovalPolicySchema.safeParse(policy);
  if (!parsedPolicy.success) return evaluation("INVALID", null, ["POLICY_INVALID"]);
  if (parsedPolicy.data.mode === "DEVELOPMENT_TRUSTED") {
    if (expected.risk !== "high" && !expected.architectureImpact) return evaluation("DEVELOPMENT_TRUSTED", null, []);
    return evaluateDevelopmentScope(parsedPolicy.data, expected, process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE);
  }
  const directory = process.env[parsedPolicy.data.receipt_directory_env];
  if (!directory || !isAbsolute(directory)) return evaluation("MISSING", null, ["APPROVAL_MISSING"]);
  const receiptPath = resolve(directory, `${expected.taskId}-PR-${expected.prNumber}-${expected.headSha}.json`);
  const receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, "utf8")) : undefined;
  return evaluateHumanApproval(parsedPolicy.data, receipt, expected);
}

export function developmentScopeAllowsTask(root: string, task: Task, requestedExecutor: "opencode" | "codex" | "any"): boolean {
  const policyPath = resolve(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json");
  if (!existsSync(policyPath)) return false;
  const parsedPolicy = humanApprovalPolicySchema.safeParse(JSON.parse(readFileSync(policyPath, "utf8")));
  if (!parsedPolicy.success || parsedPolicy.data.mode !== "DEVELOPMENT_TRUSTED") return false;
  const scopeId = process.env.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE?.trim();
  if (!scopeId) return false;
  const scope = parsedPolicy.data.development_authority_scopes.find((item) => item.scope_id === scopeId);
  if (!scope || !scope.task_ids.includes(task.metadata.id) || task.metadata.risk === "high") return false;
  const now = Date.now();
  if (now < Date.parse(scope.valid_from) || now > Date.parse(scope.expires_at)) return false;
  if (riskRank(task.metadata.risk) > riskRank(scope.risk_ceiling)) return false;
  if ((task.metadata.architecture_impact || task.metadata.model_tier === "architecture") && !scope.allow_architecture) return false;
  if (!scope.allowed_model_tiers.includes(task.metadata.model_tier)) return false;
  if (!scope.allowed_executors.includes(requestedExecutor) && !scope.allowed_executors.includes("any")) return false;
  if (!scope.allow_executor_override && task.metadata.executor_preference !== "any" && task.metadata.executor_preference !== requestedExecutor) return false;
  return true;
}

function evaluateDevelopmentScope(policy: HumanApprovalPolicy, expected: HumanApprovalExpected, selectedScopeInput: string | undefined): HumanApprovalEvaluation {
  const selectedScope = selectedScopeInput?.trim();
  if (!selectedScope) return evaluation("MISSING", null, ["DEVELOPMENT_SCOPE_MISSING"]);
  const scope = policy.development_authority_scopes.find((item) => item.scope_id === selectedScope);
  if (!scope) return evaluation("MISSING", null, ["DEVELOPMENT_SCOPE_MISSING"]);
  const approvalId = `DEVSCOPE:${scope.scope_id}`;
  const reasons: HumanApprovalEvaluation["reason_codes"] = [];
  if (!scope.task_ids.includes(expected.taskId)) reasons.push("DEVELOPMENT_SCOPE_TASK_MISMATCH");
  if (riskRank(expected.risk) > riskRank(scope.risk_ceiling) || expected.risk === "high") reasons.push("DEVELOPMENT_SCOPE_RISK_EXCEEDED");
  if (expected.architectureImpact && !scope.allow_architecture) reasons.push("DEVELOPMENT_SCOPE_ARCHITECTURE_DISALLOWED");
  if (expected.baseRef !== scope.base_ref) reasons.push("DEVELOPMENT_SCOPE_BASE_MISMATCH");
  const observed = Date.parse(timestamp.parse(expected.observedAt));
  if (observed < Date.parse(scope.valid_from)) reasons.push("DEVELOPMENT_SCOPE_NOT_YET_VALID");
  if (observed > Date.parse(scope.expires_at)) reasons.push("DEVELOPMENT_SCOPE_EXPIRED");
  return reasons.length > 0
    ? evaluation("MISSING", approvalId, [...new Set(reasons)])
    : evaluation("DEVELOPMENT_TRUSTED", approvalId, []);
}

function evaluation(decision: HumanApprovalEvaluation["decision"], approvalId: string | null, reasonCodes: HumanApprovalEvaluation["reason_codes"]): HumanApprovalEvaluation {
  return humanApprovalEvaluationSchema.parse({ decision, approval_id: approvalId, reason_codes: reasonCodes });
}

function riskRank(value: "low" | "medium" | "high"): number { return { low: 0, medium: 1, high: 2 }[value]; }

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
}