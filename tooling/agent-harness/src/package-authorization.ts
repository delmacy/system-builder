import { createHash, verify } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
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
import { matchesAny } from "./glob.js";
import { humanApprovalPolicySchema } from "./human-approval.js";
import type { TaskMetadata } from "./task.js";
import type { ValidationGateReceipt } from "./validation-engine.js";

const sha = z.string().regex(/^[0-9a-f]{40}$/);
const hash = z.string().regex(/^[0-9a-f]{64}$/);
const timestamp = z.iso.datetime({ offset: true });
const semver = z.string().regex(/^\d+\.\d+\.\d+$/);
const packageId = z.string().regex(/^PKG-[A-Z0-9-]+$/);
const descriptorId = z.string().regex(/^PWD-[A-Z0-9-]+$/);
const taskId = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const workPackageId = z.string().regex(/^WP-[A-Z0-9-]+$/);
const nonEmptyStrings = z.array(z.string().min(1)).min(1);
const risk = z.enum(["low", "medium", "high"]);
const governanceClass = z.enum(["ROUTINE", "ARCHITECTURE", "CONTRACT", "SECURITY", "EVALUATOR", "DATA", "RELEASE", "WAIVER"]);
const action = z.enum(["IMPLEMENTATION_PR", "STATE_PR"]);
const check = z.object({ name: z.string().min(1), status: z.enum(["PENDING", "SUCCESS", "FAILURE", "CANCELLED", "TIMED_OUT", "UNKNOWN"]) }).strict();
const decisionBoundaryToken = z.string().min(1).regex(/^\S+$/);
const relativePattern = z.string().min(1).refine((value) => (
  !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value) && !value.split(/[\\/]/).includes("..")
), "path pattern must be repository-relative and cannot contain '..'");

export const packageTaskDescriptorSchema = z.object({
  descriptor_id: descriptorId,
  work_package_id: workPackageId,
  milestone: z.string().min(1),
  objective_id: z.string().min(1),
  output_ids: nonEmptyStrings,
  predecessor_ids: z.array(z.union([taskId, descriptorId])),
  governance_classes: z.array(governanceClass).min(1),
  allowed_paths: z.array(relativePattern).min(1),
  forbidden_paths: z.array(relativePattern),
  max_risk: risk,
  max_files: z.number().int().positive().max(50),
  max_attempts: z.number().int().positive(),
  executor_preferences: z.array(z.enum(["opencode", "codex", "any"])).min(1),
  model_tiers: z.array(z.enum(["free", "cheap", "architecture"])).min(1),
  validation_commands: nonEmptyStrings,
  required_checks: nonEmptyStrings,
  dor_ids: nonEmptyStrings,
  dod_ids: nonEmptyStrings,
}).strict();

export const packageAuthorizationPlanSchema = z.object({
  schema_version: z.literal(1),
  package_id: packageId,
  package_version: semver,
  repository: z.string().min(1),
  approver_identity: z.string().min(1),
  key_id: z.string().min(1),
  baseline_commit: sha,
  base_ref: z.string().min(1),
  valid_from: timestamp,
  expires_at: timestamp,
  execution_focus: nonEmptyStrings,
  risk_ceiling: risk,
  protected_paths: z.array(relativePattern),
  forbidden_paths: z.array(relativePattern),
  allowed_executors: z.array(z.enum(["opencode", "codex", "any"])).min(1),
  allowed_model_tiers: z.array(z.enum(["free", "cheap", "architecture"])).min(1),
  total_action_budget: z.number().int().positive(),
  total_attempt_budget: z.number().int().positive(),
  total_task_budget: z.number().int().positive().max(50),
  max_consecutive_failures: z.number().int().positive(),
  required_validation_commands: nonEmptyStrings,
  required_checks: nonEmptyStrings,
  closure_policy_id: z.string().min(1),
  evidence_policy_id: z.string().min(1),
  revocation_policy_id: z.string().min(1),
  exception_classes: z.array(governanceClass.exclude(["ROUTINE"])).min(1),
  descriptors: z.array(packageTaskDescriptorSchema).min(20).max(50),
  governance_policy_version: z.string().min(1),
}).strict().superRefine((value, context) => {
  if (Date.parse(value.valid_from) >= Date.parse(value.expires_at)) {
    context.addIssue({ code: "custom", path: ["expires_at"], message: "expires_at must be after valid_from" });
  }
  if (value.total_task_budget > value.descriptors.length
    || value.total_action_budget > value.total_task_budget * 2
    || value.total_attempt_budget > value.descriptors.reduce((total, item) => total + item.max_attempts, 0)) {
    context.addIssue({ code: "custom", path: ["total_task_budget"], message: "package budgets exceed descriptor authority" });
  }
  for (const [field, values] of [
    ["descriptor_id", value.descriptors.map((item) => item.descriptor_id)],
    ["output_ids", value.descriptors.flatMap((item) => item.output_ids.map((id) => `${item.descriptor_id}:${id}`))],
  ] as const) {
    if (new Set(values).size !== values.length) context.addIssue({ code: "custom", path: ["descriptors"], message: `duplicate ${field}` });
  }
  const seen = new Set<string>();
  for (const [index, descriptor] of value.descriptors.entries()) {
    for (const predecessor of descriptor.predecessor_ids.filter((id) => id.startsWith("PWD-"))) {
      if (!seen.has(predecessor)) context.addIssue({ code: "custom", path: ["descriptors", index, "predecessor_ids"], message: "descriptor predecessor must appear earlier in the package" });
    }
    if (riskRank(descriptor.max_risk) > riskRank(value.risk_ceiling)) context.addIssue({ code: "custom", path: ["descriptors", index, "max_risk"], message: "descriptor risk exceeds package ceiling" });
    if (!descriptor.executor_preferences.every((item) => value.allowed_executors.includes(item))) context.addIssue({ code: "custom", path: ["descriptors", index, "executor_preferences"], message: "descriptor executor exceeds package allowance" });
    if (!descriptor.model_tiers.every((item) => value.allowed_model_tiers.includes(item))) context.addIssue({ code: "custom", path: ["descriptors", index, "model_tiers"], message: "descriptor model tier exceeds package allowance" });
    if (!value.required_checks.every((item) => descriptor.required_checks.includes(item))) context.addIssue({ code: "custom", path: ["descriptors", index, "required_checks"], message: "descriptor omits a package required check" });
    if (descriptor.allowed_paths.some((path) => matchesAny(path, value.forbidden_paths))) context.addIssue({ code: "custom", path: ["descriptors", index, "allowed_paths"], message: "descriptor path intersects package forbidden paths" });
    seen.add(descriptor.descriptor_id);
  }
});

const packageApprovalSemanticSchema = z.object({
  schema_version: z.literal(1),
  authority_type: z.literal("PACKAGE_OWNER"),
  approver_identity: z.string().min(1),
  key_id: z.string().min(1),
  repository: z.string().min(1),
  package_id: packageId,
  package_version: semver,
  plan_hash: hash,
  decision: z.enum(["APPROVED", "REJECTED"]),
  rationale: z.string().min(1),
  approved_at: timestamp,
  governance_policy_version: z.string().min(1),
}).strict();

export const packageAuthorizationReceiptSchema = packageApprovalSemanticSchema.extend({
  approval_id: z.string().regex(/^PAPR-[0-9a-f]{64}$/),
  signature: z.string().min(1),
}).strict();

const revocationSemanticSchema = z.object({
  schema_version: z.literal(1),
  authority_type: z.literal("PACKAGE_REVOCATION"),
  approver_identity: z.string().min(1),
  key_id: z.string().min(1),
  repository: z.string().min(1),
  package_id: packageId,
  package_version: semver,
  plan_hash: hash,
  reason: z.string().min(1),
  revoked_at: timestamp,
  governance_policy_version: z.string().min(1),
}).strict();

export const packageRevocationReceiptSchema = revocationSemanticSchema.extend({
  revocation_id: z.string().regex(/^PREV-[0-9a-f]{64}$/),
  signature: z.string().min(1),
}).strict();

const packageUseReceiptV1Schema = z.object({
  schema_version: z.literal(1),
  use_id: z.string().regex(/^PUSE-[0-9a-f]{64}$/),
  package_id: packageId,
  package_version: semver,
  plan_hash: hash,
  descriptor_id: descriptorId,
  task_id: taskId,
  action,
  source_commit: sha,
  pr_number: z.number().int().positive(),
  base_ref: z.string().min(1),
  head_ref: z.string().min(1),
  head_sha: sha,
  validation: z.literal("PASS"),
  checks: z.array(check).min(1),
  previous_use_id: z.string().regex(/^PUSE-[0-9a-f]{64}$/).nullable(),
  evaluated_at: timestamp,
  decision: z.literal("VALID"),
}).strict();

export const packageAdditiveTestEvidenceSchema = z.object({
  path: relativePattern,
  mode: z.enum(["NEW_FILE", "PREFIX_APPEND"]),
  baseline_blob_oid: sha.nullable(),
  baseline_sha256: hash.nullable(),
  head_blob_oid: sha,
  head_sha256: hash,
}).strict();

export const packageAdditiveTestAuthorizationSchema = z.object({
  schema_version: z.literal(1),
  classification: z.literal("ADDITIVE_TEST"),
  baseline_commit: sha,
  head_commit: sha,
  evaluator_paths: z.array(packageAdditiveTestEvidenceSchema).min(1),
}).strict();

const packageUseReceiptV2Schema = z.object({
  schema_version: z.literal(2),
  use_id: z.string().regex(/^PUSE-[0-9a-f]{64}$/),
  package_id: packageId,
  package_version: semver,
  plan_hash: hash,
  descriptor_id: descriptorId,
  task_id: taskId,
  action: z.literal("IMPLEMENTATION_PR"),
  source_commit: sha,
  pr_number: z.number().int().positive(),
  base_ref: z.string().min(1),
  head_ref: z.string().min(1),
  head_sha: sha,
  validation: z.literal("REVIEW_REQUIRED"),
  validation_reason_codes: z.tuple([z.literal("EVALUATOR_CHANGED")]),
  additive_test_authorization: packageAdditiveTestAuthorizationSchema,
  checks: z.array(check).min(1),
  previous_use_id: z.string().regex(/^PUSE-[0-9a-f]{64}$/).nullable(),
  evaluated_at: timestamp,
  decision: z.literal("VALID"),
}).strict();

export const packageUseReceiptSchema = z.discriminatedUnion("schema_version", [packageUseReceiptV1Schema, packageUseReceiptV2Schema]);

const reasonCode = z.enum([
  "POLICY_INVALID", "PACKAGE_BINDING_MISSING", "PACKAGE_STORE_MISSING", "PLAN_INVALID", "APPROVAL_MISSING",
  "APPROVAL_INVALID", "IDENTITY_MISMATCH", "APPROVER_UNAUTHORIZED", "DECISION_REJECTED", "APPROVAL_FUTURE",
  "SIGNATURE_INVALID", "PACKAGE_NOT_YET_VALID", "PACKAGE_EXPIRED", "REVOCATION_INVALID", "PACKAGE_REVOKED",
  "DESCRIPTOR_MISSING", "EXCEPTION_REQUIRED", "OBJECTIVE_MISMATCH", "OUTPUT_MISMATCH", "MILESTONE_MISMATCH",
  "DEPENDENCY_DRIFT", "PATH_SCOPE_DRIFT", "RISK_EXCEEDED", "FILE_LIMIT_EXCEEDED", "EXECUTOR_MISMATCH",
  "MODEL_TIER_MISMATCH", "VALIDATION_DRIFT", "GOVERNANCE_DRIFT", "BASELINE_DIVERGED", "PROTECTED_BASELINE_CHANGED",
  "USE_CHAIN_INVALID", "DESCRIPTOR_ALREADY_USED", "STATE_WITHOUT_IMPLEMENTATION", "ACTION_BUDGET_EXHAUSTED",
  "ATTEMPT_BUDGET_EXHAUSTED", "PACKAGE_SUSPENDED", "VALIDATION_FAILED", "CHECK_MISSING", "CHECK_FAILED",
  "ADDITIVE_TEST_INVALID",
]);

export const packageTaskConformanceSchema = z.object({
  schema_version: z.literal(1),
  conformance_id: z.string().regex(/^PCONF-[0-9a-f]{64}$/),
  package_id: packageId,
  package_version: semver,
  plan_hash: hash,
  descriptor_id: descriptorId,
  task_id: taskId,
  task_hash: hash,
  source_commit: sha,
  evaluated_at: timestamp,
  decision: z.enum(["CONFORMING", "NON_CONFORMING", "EXCEPTION_REQUIRED"]),
  reason_codes: z.array(reasonCode),
}).strict();

export const packageAuthorizationEvaluationSchema = z.object({
  decision: z.enum(["VALID", "INVALID", "MISSING", "EXCEPTION_REQUIRED"]),
  approval_id: z.string().nullable(),
  package_id: z.string().nullable(),
  plan_hash: z.string().nullable(),
  descriptor_id: z.string().nullable(),
  reason_codes: z.array(reasonCode),
  use_receipt: packageUseReceiptSchema.nullable(),
}).strict();

const packageAuthorizationDecisionBoundaryProjectionInputSchema = z.object({
  decisionId: decisionBoundaryToken,
  authorityRef: decisionBoundaryToken,
  evaluation: packageAuthorizationEvaluationSchema,
}).strict();

export const packageTaskSpecAuthorizationSchema = z.object({
  schema_version: z.literal(1),
  authorization_id: z.string().regex(/^PSPEC-[0-9a-f]{64}$/),
  package_id: packageId,
  package_version: semver,
  plan_hash: hash,
  descriptor_id: descriptorId,
  task_id: taskId,
  candidate_sha256: hash,
  source_commit: sha,
  phase: z.enum(["PREPARE", "PR"]),
  pr_number: z.number().int().positive().nullable(),
  base_ref: z.string().min(1),
  head_ref: z.string().min(1).nullable(),
  head_sha: sha.nullable(),
  approval_id: z.string().regex(/^PAPR-[0-9a-f]{64}$/),
  conformance_id: z.string().regex(/^PCONF-[0-9a-f]{64}$/),
  checks: z.array(check),
  observed_at: timestamp,
  decision: z.literal("VALID"),
}).strict();

export type PackageAuthorizationPlan = z.infer<typeof packageAuthorizationPlanSchema>;
export type PackageAuthorizationReceipt = z.infer<typeof packageAuthorizationReceiptSchema>;
export type PackageRevocationReceipt = z.infer<typeof packageRevocationReceiptSchema>;
export type PackageUseReceipt = z.infer<typeof packageUseReceiptSchema>;
export type PackageAdditiveTestAuthorization = z.infer<typeof packageAdditiveTestAuthorizationSchema>;
export type PackageTaskConformance = z.infer<typeof packageTaskConformanceSchema>;
export type PackageAuthorizationEvaluation = z.infer<typeof packageAuthorizationEvaluationSchema>;
export type PackageTaskSpecAuthorization = z.infer<typeof packageTaskSpecAuthorizationSchema>;
export type PackageAction = z.infer<typeof action>;
export type PackageAuthorizationDecisionBoundaryProjection = Readonly<{
  descriptor: DecisionBoundaryDescriptor;
  metadata: Readonly<{ authorityRef: string }>;
  reservation: HumanAuthorityReservationEvaluation;
  evaluation: PackageAuthorizationEvaluation;
}>;

export type PackageTaskSpecExpected = {
  repository: string;
  taskId: string;
  taskMetadata: TaskMetadata;
  candidateSource: string;
  sourceCommit: string;
  observedAt: string;
  phase: "PREPARE" | "PR";
  prNumber?: number;
  baseRef?: string;
  headRef?: string;
  headSha?: string;
  validation?: "PASS" | "FAIL" | "REVIEW_REQUIRED";
  checks?: Array<z.infer<typeof check>>;
};

export type PackageAuthorizationExpected = {
  repository: string;
  taskId: string;
  taskMetadata: TaskMetadata;
  action: PackageAction;
  sourceCommit: string;
  prNumber: number;
  baseRef: string;
  headRef: string;
  headSha: string;
  observedAt: string;
  validation: "PASS" | "FAIL" | "REVIEW_REQUIRED";
  validationReceipt?: ValidationGateReceipt;
  additiveTestAuthorization?: PackageAdditiveTestAuthorization;
  checks: Array<z.infer<typeof check>>;
  changedProtectedPaths?: string[];
  baselineIsAncestor?: boolean;
  totalAttempts?: number;
  consecutiveFailures?: number;
};

export function packagePlanHash(plan: PackageAuthorizationPlan): string {
  return createHash("sha256").update(canonicalJson(packageAuthorizationPlanSchema.parse(plan))).digest("hex");
}

export function packageAuthorizationSigningPayload(receipt: Omit<PackageAuthorizationReceipt, "approval_id" | "signature">): string {
  return canonicalJson(packageApprovalSemanticSchema.parse(receipt));
}

export function packageApprovalId(receipt: Omit<PackageAuthorizationReceipt, "approval_id" | "signature">): string {
  return `PAPR-${createHash("sha256").update(packageAuthorizationSigningPayload(receipt)).digest("hex")}`;
}

export function projectPackageAuthorizationDecisionBoundary(input: unknown): PackageAuthorizationDecisionBoundaryProjection {
  const parsed = packageAuthorizationDecisionBoundaryProjectionInputSchema.parse(input);
  const descriptor = normalizeDecisionBoundaryDescriptor({
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: parsed.decisionId,
    category: "human-decision",
  });
  const metadata: Readonly<{ authorityRef: string }> = { authorityRef: parsed.authorityRef };
  normalizeDecisionCategoryMetadata("human-decision", metadata);
  const reservation = evaluateHumanAuthorityReservation({ descriptor, metadata, authorityRef: parsed.authorityRef });
  if (reservation.status !== "compatible") {
    throw new TypeError(`Package authorization decision-boundary projection failed: ${reservation.diagnostic}`);
  }
  return { descriptor, metadata, reservation, evaluation: parsed.evaluation };
}

export function packageRevocationSigningPayload(receipt: Omit<PackageRevocationReceipt, "revocation_id" | "signature">): string {
  return canonicalJson(revocationSemanticSchema.parse(receipt));
}

export function packageRevocationId(receipt: Omit<PackageRevocationReceipt, "revocation_id" | "signature">): string {
  return `PREV-${createHash("sha256").update(packageRevocationSigningPayload(receipt)).digest("hex")}`;
}

export function evaluatePackageAuthorization(
  policyInput: unknown,
  planInput: unknown,
  receiptInput: unknown,
  revocationsInput: unknown[],
  usesInput: unknown[],
  expected: PackageAuthorizationExpected,
): PackageAuthorizationEvaluation {
  const policy = humanApprovalPolicySchema.safeParse(policyInput);
  const binding = expected.taskMetadata.package_authorization;
  if (!policy.success) return result("INVALID", null, binding, ["POLICY_INVALID"]);
  if (!binding) return result("MISSING", null, undefined, ["PACKAGE_BINDING_MISSING"]);
  const plan = packageAuthorizationPlanSchema.safeParse(planInput);
  if (!plan.success) return result("INVALID", null, binding, ["PLAN_INVALID"]);
  if (receiptInput === undefined || receiptInput === null) return result("MISSING", null, binding, ["APPROVAL_MISSING"]);
  const approval = packageAuthorizationReceiptSchema.safeParse(receiptInput);
  if (!approval.success) return result("INVALID", null, binding, ["APPROVAL_INVALID"]);

  const reasons: Array<z.infer<typeof reasonCode>> = [];
  const planHash = packagePlanHash(plan.data);
  const value = approval.data;
  const { approval_id: recordedApprovalId, signature, ...semantic } = value;
  if (plan.data.repository !== expected.repository || policy.data.repository !== expected.repository
    || plan.data.package_id !== binding.package_id || plan.data.package_version !== binding.package_version
    || planHash !== binding.plan_hash || value.repository !== expected.repository
    || value.package_id !== binding.package_id || value.package_version !== binding.package_version
    || value.plan_hash !== planHash || value.governance_policy_version !== policy.data.policy_version
    || value.approver_identity !== plan.data.approver_identity || value.key_id !== plan.data.key_id
    || plan.data.governance_policy_version !== policy.data.policy_version || expected.baseRef !== plan.data.base_ref
    || recordedApprovalId !== packageApprovalId(semantic)) reasons.push("IDENTITY_MISMATCH");
  const authority = policy.data.authorized_approvers.find((item) => item.approver_identity === value.approver_identity && item.key_id === value.key_id);
  if (!authority) reasons.push("APPROVER_UNAUTHORIZED");
  if (value.decision !== "APPROVED") reasons.push("DECISION_REJECTED");
  const observed = Date.parse(timestamp.parse(expected.observedAt));
  if (Date.parse(value.approved_at) > observed) reasons.push("APPROVAL_FUTURE");
  if (observed < Date.parse(plan.data.valid_from)) reasons.push("PACKAGE_NOT_YET_VALID");
  if (observed > Date.parse(plan.data.expires_at)) reasons.push("PACKAGE_EXPIRED");
  if (authority && !validSignature(packageAuthorizationSigningPayload(semantic), signature, authority.public_key_pem)) reasons.push("SIGNATURE_INVALID");

  for (const input of revocationsInput) {
    const parsed = packageRevocationReceiptSchema.safeParse(input);
    if (!parsed.success) { reasons.push("REVOCATION_INVALID"); continue; }
    const { revocation_id: recordedRevocationId, signature: revocationSignature, ...revocationSemantic } = parsed.data;
    const revocationAuthority = policy.data.authorized_approvers.find((item) => item.approver_identity === parsed.data.approver_identity && item.key_id === parsed.data.key_id);
    const identityMatches = parsed.data.repository === expected.repository && parsed.data.package_id === binding.package_id
      && parsed.data.package_version === binding.package_version && parsed.data.plan_hash === planHash
      && parsed.data.governance_policy_version === policy.data.policy_version
      && recordedRevocationId === packageRevocationId(revocationSemantic);
    if (!identityMatches || !revocationAuthority || !validSignature(packageRevocationSigningPayload(revocationSemantic), revocationSignature, revocationAuthority.public_key_pem)) {
      reasons.push("REVOCATION_INVALID");
    } else if (Date.parse(parsed.data.revoked_at) <= observed) reasons.push("PACKAGE_REVOKED");
  }

  const descriptor = plan.data.descriptors.find((item) => item.descriptor_id === binding.descriptor_id);
  if (!descriptor) reasons.push("DESCRIPTOR_MISSING");

  const uses = parseUseChain(usesInput, binding.package_id, planHash);
  if (!uses.valid) reasons.push("USE_CHAIN_INVALID");
  if (descriptor) reasons.push(...evaluatePackageTaskConformance(plan.data, descriptor, expected, uses.valid ? uses.values : []).reason_codes);
  let exactExistingUse: PackageUseReceipt | undefined;
  if (uses.valid && descriptor) {
    const implementation = uses.values.find((item) => item.descriptor_id === descriptor.descriptor_id && item.action === "IMPLEMENTATION_PR");
    const actionUses = uses.values.filter((item) => item.descriptor_id === descriptor.descriptor_id && item.action === expected.action);
    exactExistingUse = actionUses.find((item) => item.task_id === expected.taskId && item.pr_number === expected.prNumber
      && item.base_ref === expected.baseRef && item.head_ref === expected.headRef && item.head_sha === expected.headSha);
    if (actionUses.length > 0 && !exactExistingUse) reasons.push("DESCRIPTOR_ALREADY_USED");
    if (implementation && implementation.task_id !== expected.taskId) reasons.push("DESCRIPTOR_ALREADY_USED");
    if (expected.action === "STATE_PR" && (!implementation || implementation.task_id !== expected.taskId)) reasons.push("STATE_WITHOUT_IMPLEMENTATION");
    if (!exactExistingUse && uses.values.length >= plan.data.total_action_budget) reasons.push("ACTION_BUDGET_EXHAUSTED");
    const consumedTasks = new Set(uses.values.filter((item) => item.action === "IMPLEMENTATION_PR").map((item) => item.descriptor_id)).size;
    if (expected.action === "IMPLEMENTATION_PR" && !implementation && consumedTasks >= plan.data.total_task_budget) reasons.push("ACTION_BUDGET_EXHAUSTED");
  }
  if ((expected.totalAttempts ?? 0) >= plan.data.total_attempt_budget || (descriptor && (expected.totalAttempts ?? 0) >= descriptor.max_attempts)) reasons.push("ATTEMPT_BUDGET_EXHAUSTED");
  if ((expected.consecutiveFailures ?? 0) >= plan.data.max_consecutive_failures) reasons.push("PACKAGE_SUSPENDED");
  const additiveTestAuthorized = descriptor ? validatesAdditiveTestAuthorization(plan.data, descriptor, expected) : false;
  if (expected.validation !== "PASS" && !additiveTestAuthorized) {
    reasons.push(expected.validation === "REVIEW_REQUIRED" ? "ADDITIVE_TEST_INVALID" : "VALIDATION_FAILED");
  }
  for (const required of [...new Set([...plan.data.required_checks, ...(descriptor?.required_checks ?? [])])]) {
    const observedCheck = expected.checks.find((item) => item.name === required);
    if (!observedCheck) reasons.push("CHECK_MISSING");
    else if (observedCheck.status !== "SUCCESS") reasons.push("CHECK_FAILED");
  }

  const exception = reasons.includes("EXCEPTION_REQUIRED");
  const unique = [...new Set(reasons)];
  if (unique.length > 0) return result(exception && unique.every((item) => item === "EXCEPTION_REQUIRED") ? "EXCEPTION_REQUIRED" : "INVALID", recordedApprovalId, binding, unique);
  const useReceipt = exactExistingUse ?? buildPackageUseReceipt({ plan: plan.data, expected, previousUseId: uses.values.at(-1)?.use_id ?? null });
  return packageAuthorizationEvaluationSchema.parse({
    decision: "VALID", approval_id: recordedApprovalId, package_id: binding.package_id,
    plan_hash: binding.plan_hash, descriptor_id: binding.descriptor_id, reason_codes: [], use_receipt: useReceipt,
  });
}

export function evaluateStoredPackageAuthorization(root: string, expected: PackageAuthorizationExpected): PackageAuthorizationEvaluation {
  const binding = expected.taskMetadata.package_authorization;
  if (!binding) return result("MISSING", null, undefined, ["PACKAGE_BINDING_MISSING"]);
  const policyPath = resolve(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json");
  const policy = readJson(policyPath);
  const parsedPolicy = humanApprovalPolicySchema.safeParse(policy);
  if (!parsedPolicy.success) return result("INVALID", null, binding, ["POLICY_INVALID"]);
  const directory = process.env[parsedPolicy.data.receipt_directory_env];
  if (!directory || !isAbsolute(directory)) return result("MISSING", null, binding, ["PACKAGE_STORE_MISSING"]);
  const packageDirectory = resolve(directory, "packages", binding.package_id, binding.plan_hash);
  const plan = readJson(resolve(packageDirectory, "plan.json"));
  const approval = readJson(resolve(packageDirectory, "approval.json"));
  const revocations = readJsonFiles(resolve(packageDirectory, "revocations"));
  const uses = readJsonFiles(resolve(root, ".agent/package-uses", binding.package_id));
  const parsedPlan = packageAuthorizationPlanSchema.safeParse(plan);
  let baselineIsAncestor = false;
  let changedProtectedPaths: string[] = [];
  if (parsedPlan.success) {
    try {
      execFileSync("git", ["merge-base", "--is-ancestor", parsedPlan.data.baseline_commit, expected.sourceCommit], { cwd: root, stdio: "ignore" });
      baselineIsAncestor = true;
      const changed = execFileSync("git", ["diff", "--name-only", `${parsedPlan.data.baseline_commit}..${expected.sourceCommit}`], { cwd: root, encoding: "utf8" });
      changedProtectedPaths = changed.split(/\r?\n/).filter(Boolean).filter((path) => matchesAny(path, parsedPlan.data.protected_paths));
    } catch { baselineIsAncestor = false; }
  }
  const additiveTestAuthorization = parsedPlan.success
    ? buildStoredAdditiveTestAuthorization(root, parsedPlan.data, expected)
    : undefined;
  return evaluatePackageAuthorization(policy, plan, approval, revocations, uses, {
    ...expected,
    baselineIsAncestor: expected.baselineIsAncestor ?? baselineIsAncestor,
    changedProtectedPaths: expected.changedProtectedPaths ?? changedProtectedPaths,
    ...(additiveTestAuthorization ? { additiveTestAuthorization } : {}),
  });
}

export function buildStoredAdditiveTestAuthorization(
  root: string,
  plan: PackageAuthorizationPlan,
  expected: PackageAuthorizationExpected,
): PackageAdditiveTestAuthorization | undefined {
  const validation = expected.validationReceipt;
  const binding = expected.taskMetadata.package_authorization;
  const descriptor = binding ? plan.descriptors.find((item) => item.descriptor_id === binding.descriptor_id) : undefined;
  if (!validation || !descriptor || expected.action !== "IMPLEMENTATION_PR" || expected.validation !== "REVIEW_REQUIRED") return undefined;
  try {
    const actualChanged = gitText(root, ["diff", "--name-only", `${expected.sourceCommit}..${expected.headSha}`]).split(/\r?\n/).filter(Boolean).sort();
    if (JSON.stringify(actualChanged) !== JSON.stringify([...new Set(validation.changed_files)].sort())) return undefined;
    const headPaths = gitText(root, ["ls-tree", "-r", "--name-only", expected.headSha]).split(/\r?\n/).filter(Boolean);
    const folded = new Map<string, string[]>();
    for (const path of headPaths) folded.set(path.toLowerCase(), [...(folded.get(path.toLowerCase()) ?? []), path]);
    const status = gitText(root, ["diff", "--name-status", "-M", "-C", `${plan.baseline_commit}..${expected.headSha}`]);
    const evaluatorPaths = [...new Set(validation.evaluator_changes)].sort().map((path) => {
      if (!isLiteralPath(path) || !descriptor.allowed_paths.includes(path) || !expected.taskMetadata.allowed_paths.includes(path)
        || !isTestEvaluatorPath(path) || matchesAny(path, plan.protected_paths)
        || (folded.get(path.toLowerCase()) ?? []).length !== 1 || folded.get(path.toLowerCase())?.[0] !== path
        || status.split(/\r?\n/).some((line) => /^[RC]\d*\t/.test(line) && line.split("\t").slice(1).includes(path))) throw new Error("unsafe evaluator path");
      if (gitText(root, ["cat-file", "-t", `${expected.headSha}:${path}`]).trim() !== "blob") throw new Error("head is not a blob");
      const head = gitBytes(root, ["show", `${expected.headSha}:${path}`]);
      const headOid = gitText(root, ["rev-parse", `${expected.headSha}:${path}`]).trim();
      let baselineBytes: Buffer | undefined;
      let baselineOid: string | null = null;
      if (gitObjectExists(root, `${plan.baseline_commit}:${path}`)) {
        if (gitText(root, ["cat-file", "-t", `${plan.baseline_commit}:${path}`]).trim() !== "blob") throw new Error("baseline is not a blob");
        baselineBytes = gitBytes(root, ["show", `${plan.baseline_commit}:${path}`]);
        baselineOid = gitText(root, ["rev-parse", `${plan.baseline_commit}:${path}`]).trim();
      }
      if (!baselineBytes) return {
        path, mode: "NEW_FILE" as const, baseline_blob_oid: null, baseline_sha256: null,
        head_blob_oid: sha.parse(headOid), head_sha256: digest(head),
      };
      if (head.length <= baselineBytes.length || !head.subarray(0, baselineBytes.length).equals(baselineBytes)) throw new Error("not prefix append");
      return {
        path, mode: "PREFIX_APPEND" as const, baseline_blob_oid: sha.parse(baselineOid), baseline_sha256: digest(baselineBytes),
        head_blob_oid: sha.parse(headOid), head_sha256: digest(head),
      };
    });
    return packageAdditiveTestAuthorizationSchema.parse({
      schema_version: 1, classification: "ADDITIVE_TEST", baseline_commit: plan.baseline_commit,
      head_commit: expected.headSha, evaluator_paths: evaluatorPaths,
    });
  } catch {
    return undefined;
  }
}

export function evaluateStoredPackageTaskSpecAuthorization(
  root: string,
  expected: PackageTaskSpecExpected,
): PackageTaskSpecAuthorization {
  const binding = expected.taskMetadata.package_authorization;
  if (!binding) throw new Error("PACKAGE_BINDING_MISSING");
  const policyPath = resolve(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json");
  const policy = humanApprovalPolicySchema.parse(readJson(policyPath));
  const directory = process.env[policy.receipt_directory_env];
  if (!directory || !isAbsolute(directory)) throw new Error("PACKAGE_STORE_MISSING");
  const packageDirectory = resolve(directory, "packages", binding.package_id, binding.plan_hash);
  const plan = packageAuthorizationPlanSchema.parse(readJson(resolve(packageDirectory, "plan.json")));
  const descriptor = plan.descriptors.find((item) => item.descriptor_id === binding.descriptor_id);
  if (!descriptor) throw new Error("DESCRIPTOR_MISSING");
  const phase = expected.phase;
  if (phase === "PR" && (!expected.prNumber || !expected.headRef || !expected.headSha)) {
    throw new Error("TASK_SPEC_PR_IDENTITY_MISSING");
  }
  const checks = phase === "PR"
    ? (expected.checks ?? [])
    : [...new Set([...plan.required_checks, ...descriptor.required_checks])].map((name) => ({ name, status: "SUCCESS" as const }));
  const evaluation = evaluateStoredPackageAuthorization(root, {
    repository: expected.repository,
    taskId: expected.taskId,
    taskMetadata: expected.taskMetadata,
    action: "IMPLEMENTATION_PR",
    sourceCommit: expected.sourceCommit,
    prNumber: expected.prNumber ?? 1,
    baseRef: expected.baseRef ?? plan.base_ref,
    headRef: expected.headRef ?? `task-spec/${expected.taskId.toLowerCase()}`,
    headSha: expected.headSha ?? expected.sourceCommit,
    observedAt: expected.observedAt,
    validation: phase === "PR" ? (expected.validation ?? "FAIL") : "PASS",
    checks,
  });
  if (evaluation.decision !== "VALID" || !evaluation.approval_id) {
    throw new Error(`PACKAGE_TASK_SPEC_NOT_AUTHORIZED:${evaluation.reason_codes.join(",")}`);
  }
  const conformance = evaluatePackageTaskConformance(plan, descriptor, {
    repository: expected.repository,
    taskId: expected.taskId,
    taskMetadata: expected.taskMetadata,
    action: "IMPLEMENTATION_PR",
    sourceCommit: expected.sourceCommit,
    prNumber: expected.prNumber ?? 1,
    baseRef: expected.baseRef ?? plan.base_ref,
    headRef: expected.headRef ?? `task-spec/${expected.taskId.toLowerCase()}`,
    headSha: expected.headSha ?? expected.sourceCommit,
    observedAt: expected.observedAt,
    validation: phase === "PR" ? (expected.validation ?? "FAIL") : "PASS",
    checks,
    baselineIsAncestor: true,
    changedProtectedPaths: [],
  }, readJsonFiles(resolve(root, ".agent/package-uses", binding.package_id))
    .flatMap((value) => packageUseReceiptSchema.safeParse(value).success ? [packageUseReceiptSchema.parse(value)] : []));
  if (conformance.decision !== "CONFORMING") throw new Error(`PACKAGE_TASK_SPEC_NOT_CONFORMING:${conformance.reason_codes.join(",")}`);
  const semantic = {
    schema_version: 1 as const,
    package_id: binding.package_id,
    package_version: binding.package_version,
    plan_hash: binding.plan_hash,
    descriptor_id: binding.descriptor_id,
    task_id: expected.taskId,
    candidate_sha256: createHash("sha256").update(expected.candidateSource).digest("hex"),
    source_commit: sha.parse(expected.sourceCommit),
    phase,
    pr_number: expected.prNumber ?? null,
    base_ref: expected.baseRef ?? plan.base_ref,
    head_ref: expected.headRef ?? null,
    head_sha: expected.headSha ? sha.parse(expected.headSha) : null,
    approval_id: evaluation.approval_id,
    conformance_id: conformance.conformance_id,
    checks: normalizeChecks(checks),
    observed_at: timestamp.parse(expected.observedAt),
    decision: "VALID" as const,
  };
  return packageTaskSpecAuthorizationSchema.parse({
    ...semantic,
    authorization_id: `PSPEC-${createHash("sha256").update(canonicalJson(semantic)).digest("hex")}`,
  });
}

export function writePackageUseReceipt(root: string, receiptInput: PackageUseReceipt): string {
  const receipt = packageUseReceiptSchema.parse(receiptInput);
  if (receipt.use_id !== packageUseId(receipt)) throw new Error("PACKAGE_USE_ID_MISMATCH");
  const directory = resolve(root, ".agent/package-uses", receipt.package_id);
  mkdirSync(directory, { recursive: true });
  const path = resolve(directory, `${receipt.use_id}.json`);
  const content = canonicalJson(receipt);
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error("PACKAGE_USE_DIVERGENCE");
    return path;
  }
  writeFileSync(path, content, { encoding: "utf8", flag: "wx" });
  return path;
}

export function evaluatePackageTaskConformance(
  plan: PackageAuthorizationPlan,
  descriptor: z.infer<typeof packageTaskDescriptorSchema>,
  expected: PackageAuthorizationExpected,
  uses: PackageUseReceipt[],
): PackageTaskConformance {
  const reasons = [...new Set(conformanceReasons(plan, descriptor, expected, uses))];
  const decision = reasons.includes("EXCEPTION_REQUIRED") ? "EXCEPTION_REQUIRED" : reasons.length > 0 ? "NON_CONFORMING" : "CONFORMING";
  const semantic = {
    schema_version: 1 as const, package_id: plan.package_id, package_version: plan.package_version,
    plan_hash: packagePlanHash(plan), descriptor_id: descriptor.descriptor_id, task_id: expected.taskId,
    task_hash: createHash("sha256").update(canonicalJson(expected.taskMetadata)).digest("hex"),
    source_commit: sha.parse(expected.sourceCommit), evaluated_at: timestamp.parse(expected.observedAt), decision, reason_codes: reasons,
  };
  return packageTaskConformanceSchema.parse({
    ...semantic,
    conformance_id: `PCONF-${createHash("sha256").update(canonicalJson(semantic)).digest("hex")}`,
  });
}

function conformanceReasons(
  plan: PackageAuthorizationPlan,
  descriptor: z.infer<typeof packageTaskDescriptorSchema>,
  expected: PackageAuthorizationExpected,
  uses: PackageUseReceipt[],
): Array<z.infer<typeof reasonCode>> {
  const metadata = expected.taskMetadata;
  const binding = metadata.package_authorization!;
  const reasons: Array<z.infer<typeof reasonCode>> = [];
  if (binding.objective_id !== descriptor.objective_id) reasons.push("OBJECTIVE_MISMATCH");
  if (!sameSet(binding.output_ids, descriptor.output_ids)) reasons.push("OUTPUT_MISMATCH");
  if (metadata.milestone !== descriptor.milestone || !plan.execution_focus.includes(metadata.milestone)) reasons.push("MILESTONE_MISMATCH");
  if (!descriptor.predecessor_ids.filter((id) => id.startsWith("TASK-")).every((id) => metadata.depends_on.includes(id))) reasons.push("DEPENDENCY_DRIFT");
  for (const predecessor of descriptor.predecessor_ids.filter((id) => id.startsWith("PWD-"))) {
    const implementation = uses.find((item) => item.descriptor_id === predecessor && item.action === "IMPLEMENTATION_PR");
    const state = uses.find((item) => item.descriptor_id === predecessor && item.action === "STATE_PR" && item.task_id === implementation?.task_id);
    if (!implementation || !state || !metadata.depends_on.includes(implementation.task_id)) reasons.push("DEPENDENCY_DRIFT");
  }
  if (!metadata.allowed_paths.every((path) => descriptor.allowed_paths.includes(path))
    || !descriptor.forbidden_paths.every((path) => metadata.forbidden_paths.includes(path))
    || metadata.allowed_paths.some((path) => matchesAny(path, plan.forbidden_paths))) reasons.push("PATH_SCOPE_DRIFT");
  if (riskRank(metadata.risk) > riskRank(descriptor.max_risk) || riskRank(metadata.risk) > riskRank(plan.risk_ceiling)) reasons.push("RISK_EXCEEDED");
  if (metadata.max_files > descriptor.max_files) reasons.push("FILE_LIMIT_EXCEEDED");
  if (!descriptor.executor_preferences.includes(metadata.executor_preference) || !plan.allowed_executors.includes(metadata.executor_preference)) reasons.push("EXECUTOR_MISMATCH");
  if (!descriptor.model_tiers.includes(metadata.model_tier) || !plan.allowed_model_tiers.includes(metadata.model_tier)) reasons.push("MODEL_TIER_MISMATCH");
  if (![...plan.required_validation_commands, ...descriptor.validation_commands].every((command) => metadata.validation.includes(command))) reasons.push("VALIDATION_DRIFT");
  if (!sameSet(binding.governance_classes, descriptor.governance_classes)) reasons.push("GOVERNANCE_DRIFT");
  if (!sameSet(binding.dor_ids, descriptor.dor_ids) || !sameSet(binding.dod_ids, descriptor.dod_ids)) reasons.push("GOVERNANCE_DRIFT");
  if (descriptor.governance_classes.some((item) => item !== "ROUTINE")) reasons.push("EXCEPTION_REQUIRED");
  if (expected.baselineIsAncestor === false) reasons.push("BASELINE_DIVERGED");
  if ((expected.changedProtectedPaths ?? []).some((path) => matchesAny(path, plan.protected_paths))) reasons.push("PROTECTED_BASELINE_CHANGED");
  return reasons;
}

function buildPackageUseReceipt(input: { plan: PackageAuthorizationPlan; expected: PackageAuthorizationExpected; previousUseId: string | null }): PackageUseReceipt {
  const binding = input.expected.taskMetadata.package_authorization!;
  if (input.expected.validation === "REVIEW_REQUIRED") {
    const semantic = {
      schema_version: 2 as const, package_id: binding.package_id, package_version: binding.package_version,
      plan_hash: binding.plan_hash, descriptor_id: binding.descriptor_id, task_id: input.expected.taskId,
      action: "IMPLEMENTATION_PR" as const, source_commit: sha.parse(input.expected.sourceCommit), pr_number: input.expected.prNumber,
      base_ref: input.expected.baseRef, head_ref: input.expected.headRef, head_sha: sha.parse(input.expected.headSha),
      validation: "REVIEW_REQUIRED" as const, validation_reason_codes: ["EVALUATOR_CHANGED"] as ["EVALUATOR_CHANGED"],
      additive_test_authorization: packageAdditiveTestAuthorizationSchema.parse(input.expected.additiveTestAuthorization),
      checks: normalizeChecks(input.expected.checks), previous_use_id: input.previousUseId,
      evaluated_at: timestamp.parse(input.expected.observedAt), decision: "VALID" as const,
    };
    return packageUseReceiptSchema.parse({ ...semantic, use_id: `PUSE-${createHash("sha256").update(canonicalJson(semantic)).digest("hex")}` });
  }
  const semantic = {
    schema_version: 1 as const, package_id: binding.package_id, package_version: binding.package_version,
    plan_hash: binding.plan_hash, descriptor_id: binding.descriptor_id, task_id: input.expected.taskId,
    action: input.expected.action, source_commit: sha.parse(input.expected.sourceCommit), pr_number: input.expected.prNumber,
    base_ref: input.expected.baseRef, head_ref: input.expected.headRef, head_sha: sha.parse(input.expected.headSha),
    validation: "PASS" as const, checks: normalizeChecks(input.expected.checks), previous_use_id: input.previousUseId,
    evaluated_at: timestamp.parse(input.expected.observedAt), decision: "VALID" as const,
  };
  return packageUseReceiptSchema.parse({ ...semantic, use_id: `PUSE-${createHash("sha256").update(canonicalJson(semantic)).digest("hex")}` });
}

function validatesAdditiveTestAuthorization(
  plan: PackageAuthorizationPlan,
  descriptor: PackageAuthorizationPlan["descriptors"][number],
  expected: PackageAuthorizationExpected,
): boolean {
  if (expected.action !== "IMPLEMENTATION_PR" || expected.validation !== "REVIEW_REQUIRED") return false;
  const validation = expected.validationReceipt;
  const authorization = packageAdditiveTestAuthorizationSchema.safeParse(expected.additiveTestAuthorization);
  if (!validation || !authorization.success || validation.decision !== "REVIEW_REQUIRED"
    || validation.reason_codes.length !== 1 || validation.reason_codes[0] !== "EVALUATOR_CHANGED"
    || validation.missing_evaluators.length > 0 || !validation.content_stable
    || validation.commands.some((command) => command.status !== "PASS" || command.exit_code !== 0)
    || validation.task_id !== expected.taskId || validation.source_commit !== expected.sourceCommit
    || authorization.data.baseline_commit !== plan.baseline_commit || authorization.data.head_commit !== expected.headSha) return false;
  const paths = [...new Set(validation.evaluator_changes)].sort();
  const evidencePaths = authorization.data.evaluator_paths.map((item) => item.path).sort();
  if (paths.length === 0 || JSON.stringify(paths) !== JSON.stringify(evidencePaths)) return false;
  return authorization.data.evaluator_paths.every((item) => isLiteralPath(item.path)
    && descriptor.allowed_paths.includes(item.path) && expected.taskMetadata.allowed_paths.includes(item.path)
    && isTestEvaluatorPath(item.path) && !matchesAny(item.path, plan.protected_paths)
    && (item.mode === "NEW_FILE"
      ? item.baseline_blob_oid === null && item.baseline_sha256 === null
      : item.baseline_blob_oid !== null && item.baseline_sha256 !== null));
}

function packageUseId(receipt: PackageUseReceipt): string {
  const semantic = Object.fromEntries(Object.entries(receipt).filter(([key]) => key !== "use_id"));
  return `PUSE-${createHash("sha256").update(canonicalJson(semantic)).digest("hex")}`;
}

function parseUseChain(inputs: unknown[], expectedPackageId: string, expectedPlanHash: string): { valid: boolean; values: PackageUseReceipt[] } {
  const parsed = inputs.map((item) => packageUseReceiptSchema.safeParse(item));
  if (parsed.some((item) => !item.success)) return { valid: false, values: [] };
  const unordered = parsed.flatMap((item) => item.success ? [item.data] : []);
  if (unordered.some((value) => value.package_id !== expectedPackageId || value.plan_hash !== expectedPlanHash || value.use_id !== packageUseId(value))) return { valid: false, values: unordered };
  if (unordered.length === 0) return { valid: true, values: [] };
  const values: PackageUseReceipt[] = [];
  let previous: string | null = null;
  while (values.length < unordered.length) {
    const next = unordered.filter((value) => value.previous_use_id === previous && !values.some((item) => item.use_id === value.use_id));
    if (next.length !== 1) return { valid: false, values: unordered };
    values.push(next[0]!);
    previous = next[0]!.use_id;
  }
  return { valid: true, values };
}

function result(
  decision: PackageAuthorizationEvaluation["decision"],
  approvalId: string | null,
  binding: TaskMetadata["package_authorization"] | undefined,
  reasons: Array<z.infer<typeof reasonCode>>,
): PackageAuthorizationEvaluation {
  return packageAuthorizationEvaluationSchema.parse({ decision, approval_id: approvalId, package_id: binding?.package_id ?? null,
    plan_hash: binding?.plan_hash ?? null, descriptor_id: binding?.descriptor_id ?? null, reason_codes: [...new Set(reasons)], use_receipt: null });
}

function validSignature(payload: string, signature: string, publicKey: string): boolean {
  try { return verify(null, Buffer.from(payload), publicKey, Buffer.from(signature, "base64")); } catch { return false; }
}

function normalizeChecks(checks: Array<z.infer<typeof check>>): Array<z.infer<typeof check>> {
  return [...checks].sort((left, right) => left.name.localeCompare(right.name) || left.status.localeCompare(right.status));
}

function riskRank(value: z.infer<typeof risk>): number { return { low: 0, medium: 1, high: 2 }[value]; }
function sameSet(left: string[], right: string[]): boolean { return JSON.stringify([...new Set(left)].sort()) === JSON.stringify([...new Set(right)].sort()); }
function isLiteralPath(path: string): boolean { return !/[?*[\]{}]/.test(path); }
function isTestEvaluatorPath(path: string): boolean {
  return matchesAny(path, ["**/tests/**", "**/*.test.*", "**/*.spec.*"])
    && !matchesAny(path, [
      ".github/**", "project_docs/execution_governance/**", "package.json", "package-lock.json",
      "tsconfig*.json", "eslint.config.*", "tooling/agent-harness/src/**", "tooling/agent-harness/policies/**",
    ]);
}
function gitText(root: string, args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
}
function gitBytes(root: string, args: string[]): Buffer {
  return execFileSync("git", args, { cwd: root, encoding: null, maxBuffer: 10 * 1024 * 1024 });
}
function gitObjectExists(root: string, object: string): boolean {
  try { execFileSync("git", ["cat-file", "-e", object], { cwd: root, stdio: "ignore" }); return true; } catch { return false; }
}
function digest(value: Buffer): string { return createHash("sha256").update(value).digest("hex"); }
function readJson(path: string): unknown { try { return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined; } catch { return undefined; } }
function readJsonFiles(directory: string): unknown[] {
  if (!existsSync(directory)) return [];
  try { return readdirSync(directory).filter((name) => name.endsWith(".json")).sort().map((name) => readJson(resolve(directory, name))); } catch { return [undefined]; }
}
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
}