import { z } from "zod";
import { humanApprovalEvaluationSchema, type HumanApprovalEvaluation } from "./human-approval.js";
import { packageAuthorizationEvaluationSchema, type PackageAuthorizationEvaluation } from "./package-authorization.js";

const checkStatusSchema = z.enum(["PENDING", "SUCCESS", "FAILURE", "CANCELLED", "TIMED_OUT", "UNKNOWN"]);
const reviewSchema = z.enum(["NONE", "APPROVED", "CHANGES_REQUESTED", "UNKNOWN"]);
const reasonCodeSchema = z.enum([
  "IDENTITY_MISMATCH",
  "PR_CLOSED",
  "PR_UNKNOWN",
  "CHECK_MISSING",
  "CHECK_PENDING",
  "CHECK_FAILED",
  "CHECK_UNKNOWN",
  "VALIDATION_FAILED",
  "VALIDATION_REVIEW_REQUIRED",
  "CHANGES_REQUESTED",
  "REVIEW_MISSING",
  "REVIEW_UNKNOWN",
  "HUMAN_APPROVAL_INVALID",
  "PACKAGE_AUTHORIZATION_INVALID",
  "PACKAGE_EXCEPTION_REQUIRED",
  "APPROVAL_POLICY_INVALID",
]);

export const githubLifecycleCheckSchema = z.object({
  name: z.string().min(1),
  status: checkStatusSchema,
}).strict();

export const githubLifecycleReceiptSchema = z.object({
  schema_version: z.literal(1),
  pr_number: z.number().int().positive(),
  branch: z.string().min(1),
  head_commit: z.string().regex(/^[0-9a-f]{40}$/),
  base_branch: z.string().min(1),
  validation: z.enum(["PASS", "FAIL", "REVIEW_REQUIRED"]),
  required_checks: z.array(z.string().min(1)).min(1),
  checks: z.array(githubLifecycleCheckSchema),
  review: reviewSchema,
  approval_channel: z.enum(["NONE", "GITHUB_REVIEW", "DURABLE_HUMAN_APPROVAL", "PACKAGE_AUTHORIZATION"]),
  human_approval: humanApprovalEvaluationSchema.nullable(),
  package_authorization: packageAuthorizationEvaluationSchema.nullable(),
  decision: z.enum(["PENDING", "BLOCKED", "REVIEW_REQUIRED", "ELIGIBLE"]),
  reason_codes: z.array(reasonCodeSchema),
}).strict();

export type GitHubLifecycleCheck = z.infer<typeof githubLifecycleCheckSchema>;
export type GitHubLifecycleReceipt = z.infer<typeof githubLifecycleReceiptSchema>;

export type GitHubLifecycleInput = {
  prNumber: number;
  state: "OPEN" | "CLOSED" | "MERGED" | "UNKNOWN";
  branch: string;
  baseBranch: string;
  headCommit: string;
  expectedBranch: string;
  expectedBaseBranch: string;
  expectedHeadCommit: string;
  requiredChecks: string[];
  checks: GitHubLifecycleCheck[];
  validation: "PASS" | "FAIL" | "REVIEW_REQUIRED";
  review: "NONE" | "APPROVED" | "CHANGES_REQUESTED" | "UNKNOWN";
  reviewRequired: boolean;
  humanApproval?: HumanApprovalEvaluation;
  packageAuthorization?: PackageAuthorizationEvaluation;
};

export function evaluateGitHubLifecycle(input: GitHubLifecycleInput): GitHubLifecycleReceipt {
  const reasons: GitHubLifecycleReceipt["reason_codes"] = [];
  const requiredChecks = [...new Set(input.requiredChecks)].sort();
  const checks = normalizeChecks(input.checks);

  if (input.branch !== input.expectedBranch
    || input.baseBranch !== input.expectedBaseBranch
    || input.headCommit !== input.expectedHeadCommit) reasons.push("IDENTITY_MISMATCH");
  if (input.state === "CLOSED") reasons.push("PR_CLOSED");
  if (input.state === "UNKNOWN") reasons.push("PR_UNKNOWN");

  for (const name of requiredChecks) {
    const check = checks.find((candidate) => candidate.name === name);
    if (!check) reasons.push("CHECK_MISSING");
    else if (check.status === "PENDING") reasons.push("CHECK_PENDING");
    else if (["FAILURE", "CANCELLED", "TIMED_OUT"].includes(check.status)) reasons.push("CHECK_FAILED");
    else if (check.status === "UNKNOWN") reasons.push("CHECK_UNKNOWN");
  }

  if (input.validation === "FAIL") reasons.push("VALIDATION_FAILED");
  const durableApproved = input.humanApproval?.decision === "VALID";
  const packageApproved = input.packageAuthorization?.decision === "VALID";
  const alternateApproved = durableApproved || packageApproved;
  if (input.validation === "REVIEW_REQUIRED" && input.review !== "APPROVED" && !alternateApproved) reasons.push("VALIDATION_REVIEW_REQUIRED");
  if (input.review === "CHANGES_REQUESTED") reasons.push("CHANGES_REQUESTED");
  if (input.review === "UNKNOWN") reasons.push("REVIEW_UNKNOWN");
  if (input.humanApproval?.decision === "INVALID" && input.humanApproval.reason_codes.includes("POLICY_INVALID") && input.review !== "APPROVED") reasons.push("APPROVAL_POLICY_INVALID");
  else if (input.humanApproval?.decision === "INVALID" && input.review !== "APPROVED" && !packageApproved) reasons.push("HUMAN_APPROVAL_INVALID");
  if (input.packageAuthorization?.decision === "INVALID" && input.review !== "APPROVED" && !durableApproved) reasons.push("PACKAGE_AUTHORIZATION_INVALID");
  if (input.packageAuthorization?.decision === "EXCEPTION_REQUIRED" && input.review !== "APPROVED" && !durableApproved) reasons.push("PACKAGE_EXCEPTION_REQUIRED");
  if (input.reviewRequired && input.review !== "APPROVED" && input.review !== "UNKNOWN" && !alternateApproved) reasons.push("REVIEW_MISSING");

  const pending = reasons.includes("CHECK_PENDING");
  const reviewRequired = reasons.some((reason) => ["VALIDATION_REVIEW_REQUIRED", "REVIEW_MISSING", "PACKAGE_EXCEPTION_REQUIRED"].includes(reason));
  const blocking = reasons.some((reason) => !["CHECK_PENDING", "VALIDATION_REVIEW_REQUIRED", "REVIEW_MISSING", "PACKAGE_EXCEPTION_REQUIRED"].includes(reason));
  const decision = blocking ? "BLOCKED" : pending ? "PENDING" : reviewRequired ? "REVIEW_REQUIRED" : "ELIGIBLE";

  return githubLifecycleReceiptSchema.parse({
    schema_version: 1,
    pr_number: input.prNumber,
    branch: input.branch,
    head_commit: input.headCommit,
    base_branch: input.baseBranch,
    validation: input.validation,
    required_checks: requiredChecks,
    checks,
    review: input.review,
    approval_channel: input.review === "APPROVED" ? "GITHUB_REVIEW" : durableApproved ? "DURABLE_HUMAN_APPROVAL" : packageApproved ? "PACKAGE_AUTHORIZATION" : "NONE",
    human_approval: input.humanApproval ?? null,
    package_authorization: input.packageAuthorization ?? null,
    decision,
    reason_codes: [...new Set(reasons)],
  });
}

function normalizeChecks(checks: GitHubLifecycleCheck[]): GitHubLifecycleCheck[] {
  const severity: Record<GitHubLifecycleCheck["status"], number> = {
    SUCCESS: 0,
    PENDING: 1,
    UNKNOWN: 2,
    FAILURE: 3,
    CANCELLED: 3,
    TIMED_OUT: 3,
  };
  const byName = new Map<string, GitHubLifecycleCheck>();
  for (const check of checks) {
    const parsed = githubLifecycleCheckSchema.parse(check);
    const current = byName.get(parsed.name);
    if (!current || severity[parsed.status] > severity[current.status]) byName.set(parsed.name, parsed);
  }
  return [...byName.values()].sort((left, right) => left.name.localeCompare(right.name));
}
