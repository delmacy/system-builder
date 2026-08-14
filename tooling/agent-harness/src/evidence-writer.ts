import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { z } from "zod";
import { executionResultSchema, type ExecutionResult } from "./execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "./execution-harness.js";
import { validationGateReceiptSchema, type ValidationGateReceipt } from "./validation-engine.js";
import { githubLifecycleReceiptSchema, type GitHubLifecycleReceipt } from "./github-lifecycle.js";

const acceptanceSchema = z.object({ id: z.string().regex(/^AC-[A-Z0-9-]+$/), status: z.literal("PASS"), evidence: z.string().min(1) }).strict();
const attemptAcceptanceSchema = z.object({
  id: z.string().regex(/^AC-[A-Z0-9-]+$/),
  status: z.enum(["PASS", "FAIL"]),
  evidence: z.string().min(1),
}).strict();
const metricsSchema = z.object({
  attempts: z.number().int().positive(),
  execution_duration_seconds: z.number().nonnegative().nullable(),
  review_duration_seconds: z.number().nonnegative().nullable(),
  token_or_provider_cost: z.number().nonnegative().nullable(),
}).strict();

export const governanceResolutionSchema = z.object({
  schema_version: z.literal(1),
  resolution_id: z.string().regex(/^AFGOV-[0-9a-f]{64}$/),
  validation_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  original_validation: validationGateReceiptSchema,
  change_fingerprint: z.string().regex(/^[0-9a-f]{64}$/),
  implementation_lifecycle: githubLifecycleReceiptSchema,
  decision: z.literal("RESOLVED"),
}).strict();

export type GovernanceResolution = z.infer<typeof governanceResolutionSchema>;

export const agentFactoryEvidenceEnvelopeSchema = z.object({
  schema_version: z.literal(1),
  receipt_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/),
  content_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  head_commit: z.string().regex(/^[0-9a-f]{40}$/),
  change_fingerprint: z.string().regex(/^[0-9a-f]{64}$/),
  validation: validationGateReceiptSchema,
  result: executionResultSchema,
}).strict();

export type AgentFactoryEvidenceEnvelope = z.infer<typeof agentFactoryEvidenceEnvelopeSchema>;
export const agentFactoryAttemptEvidenceEnvelopeSchema = z.object({
  schema_version: z.literal(1),
  receipt_id: z.string().regex(/^AFATT-[0-9a-f]{64}$/),
  content_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  head_commit: z.string().regex(/^[0-9a-f]{40}$/),
  change_fingerprint: z.string().regex(/^[0-9a-f]{64}$/),
  attempt_started_at: z.iso.datetime({ offset: true }),
  attempt_finished_at: z.iso.datetime({ offset: true }),
  duration_seconds: z.number().nonnegative(),
  failure_category: z.string().min(1).nullable(),
  validation: validationGateReceiptSchema,
  result: executionResultSchema,
}).strict().superRefine((receipt, context) => {
  if (Date.parse(receipt.attempt_finished_at) < Date.parse(receipt.attempt_started_at)) {
    context.addIssue({ code: "custom", path: ["attempt_finished_at"], message: "attempt finish must not precede start" });
  }
  if (receipt.result.status === "DONE" && receipt.failure_category !== null) {
    context.addIssue({ code: "custom", path: ["failure_category"], message: "DONE cannot retain a failure category" });
  }
  if (receipt.result.status !== "DONE" && receipt.failure_category === null) {
    context.addIssue({ code: "custom", path: ["failure_category"], message: "non-DONE attempt requires a failure category" });
  }
});

export type AgentFactoryAttemptEvidenceEnvelope = z.infer<typeof agentFactoryAttemptEvidenceEnvelopeSchema>;
export type EvidenceWriterInput = {
  completion: ExecutionBoundaryCompletion;
  validation: ValidationGateReceipt;
  headCommit: string;
  changeFingerprint: string;
  acceptance: Array<z.infer<typeof acceptanceSchema>>;
  satisfiedGates: string[];
  blockedGates: string[];
  contractsChanged?: string[];
  migrationsChanged?: string[];
  risksDiscovered?: string[];
  issuesDiscovered?: string[];
  changeRequests?: string[];
  followUpCandidates?: string[];
  dagEffects?: string[];
  metrics: z.infer<typeof metricsSchema>;
  notes?: string;
  governanceResolution?: GovernanceResolution;
};

export type AttemptEvidenceWriterInput = Omit<EvidenceWriterInput, "acceptance" | "metrics"> & {
  acceptance: Array<z.infer<typeof attemptAcceptanceSchema>>;
  attemptStartedAt: string;
  attemptFinishedAt: string;
  metrics: Omit<z.infer<typeof metricsSchema>, "execution_duration_seconds">;
};

export function buildAgentFactoryEvidence(input: EvidenceWriterInput): AgentFactoryEvidenceEnvelope {
  const validation = validationGateReceiptSchema.parse(input.validation);
  const acceptance = z.array(acceptanceSchema).min(1).parse(input.acceptance);
  const metrics = metricsSchema.parse(input.metrics);
  const { boundary, report, changedFiles, violations } = input.completion;
  const request = report.request ?? input.completion.rawReport.request;
  if (!request || report.status !== "completed" || report.result?.status !== "SUCCEEDED" || violations.length > 0) {
    throw new Error("EVIDENCE_EXECUTION_NOT_ACCEPTED: accepted structured execution is required");
  }
  if (validation.decision === "FAIL" || validation.commands.some((command) => command.status !== "PASS")) {
    throw new Error("EVIDENCE_VALIDATION_NOT_ACCEPTED: independent validation must not fail");
  }
  if (request.task_id !== boundary.taskId || request.work_package_id !== boundary.workPackageId
    || request.source_commit !== boundary.sourceCommit || request.attempt !== boundary.attempt
    || validation.task_id !== boundary.taskId || validation.work_package_id !== boundary.workPackageId
    || validation.source_commit !== boundary.sourceCommit
    || JSON.stringify(validation.changed_files) !== JSON.stringify(changedFiles)) {
    throw new Error("EVIDENCE_IDENTITY_MISMATCH: execution and validation identities diverge");
  }
  if (!/^[0-9a-f]{40}$/.test(input.headCommit) || !/^[0-9a-f]{64}$/.test(input.changeFingerprint)) {
    throw new Error("EVIDENCE_GIT_IDENTITY_INVALID: head commit and fingerprint are required");
  }
  const governanceResolution = input.governanceResolution
    ? validateGovernanceResolution(input.governanceResolution, validation, input.headCommit, input.changeFingerprint)
    : null;
  const effectiveValidation: ValidationGateReceipt = governanceResolution
    ? validationGateReceiptSchema.parse({ ...validation, decision: "PASS", reason_codes: [] })
    : validation;
  const result: ExecutionResult = executionResultSchema.parse({
    schema_version: 1,
    task_id: boundary.taskId,
    work_package_id: boundary.workPackageId,
    source_commit: boundary.sourceCommit,
    executor: { adapter: request.route.executor, model: request.route.model },
    status: validation.decision === "PASS" || governanceResolution ? "DONE" : "NEEDS_DECISION",
    changed_files: changedFiles,
    tests: effectiveValidation.commands.map((command) => ({
      command: command.command,
      status: command.status,
      evidence: evidenceFor(command),
    })),
    acceptance,
    contracts_changed: input.contractsChanged ?? [],
    migrations_changed: input.migrationsChanged ?? [],
    risks_discovered: input.risksDiscovered ?? [],
    issues_discovered: input.issuesDiscovered ?? [],
    change_requests: input.changeRequests ?? [],
    follow_up_candidates: input.followUpCandidates ?? [],
    dependency_gates_satisfied: input.satisfiedGates,
    dependency_gates_blocked: input.blockedGates,
    dag_effects: input.dagEffects ?? [],
    metrics,
    notes: governanceResolution
      ? [input.notes ?? "", `Governance resolution: ${governanceResolution.resolution_id}`].filter(Boolean).join("\n")
      : input.notes ?? "",
  });
  const semantic = {
    schema_version: 1 as const,
    head_commit: input.headCommit,
    change_fingerprint: input.changeFingerprint,
    validation: effectiveValidation,
    result,
  };
  const contentHash = hash(stableJson(semantic));
  return agentFactoryEvidenceEnvelopeSchema.parse({
    ...semantic,
    receipt_id: `AFEV-${contentHash}`,
    content_sha256: contentHash,
  });
}

export function buildGovernanceResolution(input: {
  validation: ValidationGateReceipt;
  changeFingerprint: string;
  implementationLifecycle: GitHubLifecycleReceipt;
}): GovernanceResolution {
  const validation = validationGateReceiptSchema.parse(input.validation);
  const lifecycle = githubLifecycleReceiptSchema.parse(input.implementationLifecycle);
  const semantic = {
    schema_version: 1 as const,
    validation_sha256: hash(stableJson(validation)),
    original_validation: validation,
    change_fingerprint: z.string().regex(/^[0-9a-f]{64}$/).parse(input.changeFingerprint),
    implementation_lifecycle: lifecycle,
    decision: "RESOLVED" as const,
  };
  return governanceResolutionSchema.parse({
    ...semantic,
    resolution_id: `AFGOV-${hash(stableJson(semantic))}`,
  });
}

function validateGovernanceResolution(
  input: GovernanceResolution,
  validation: ValidationGateReceipt,
  headCommit: string,
  changeFingerprint: string,
): GovernanceResolution {
  const resolution = governanceResolutionSchema.parse(input);
  const { resolution_id: recordedId, ...semantic } = resolution;
  if (recordedId !== `AFGOV-${hash(stableJson(semantic))}`
    || validation.decision !== "REVIEW_REQUIRED"
    || validation.commands.some((command) => command.status !== "PASS")
    || validation.missing_evaluators.length > 0
    || !validation.content_stable
    || resolution.validation_sha256 !== hash(stableJson(validation))
    || stableJson(resolution.original_validation) !== stableJson(validation)
    || resolution.change_fingerprint !== changeFingerprint
    || resolution.implementation_lifecycle.validation !== "REVIEW_REQUIRED"
    || resolution.implementation_lifecycle.head_commit !== headCommit
    || resolution.implementation_lifecycle.decision !== "ELIGIBLE"
    || !["GITHUB_REVIEW", "DURABLE_HUMAN_APPROVAL", "PACKAGE_AUTHORIZATION"].includes(resolution.implementation_lifecycle.approval_channel)
    || resolution.implementation_lifecycle.required_checks.some((name) => !resolution.implementation_lifecycle.checks.some((check) => check.name === name && check.status === "SUCCESS"))) {
    throw new Error("EVIDENCE_GOVERNANCE_RESOLUTION_INVALID: immutable validation and eligible lifecycle must match");
  }
  return resolution;
}

export function buildAgentFactoryAttemptEvidence(input: AttemptEvidenceWriterInput): AgentFactoryAttemptEvidenceEnvelope {
  const validation = validationGateReceiptSchema.parse(input.validation);
  const acceptance = z.array(attemptAcceptanceSchema).parse(input.acceptance);
  const startedAt = z.iso.datetime({ offset: true }).parse(input.attemptStartedAt);
  const finishedAt = z.iso.datetime({ offset: true }).parse(input.attemptFinishedAt);
  const startedMs = Date.parse(startedAt);
  const finishedMs = Date.parse(finishedAt);
  if (finishedMs < startedMs) throw new Error("EVIDENCE_TIMING_INVALID: attempt finish must not precede start");
  const { boundary, report, rawReport, changedFiles } = input.completion;
  const request = rawReport.request ?? report.request;
  if (!request) throw new Error("EVIDENCE_REQUEST_MISSING: structured executor request is required");
  if (request.task_id !== boundary.taskId || request.work_package_id !== boundary.workPackageId
    || request.source_commit !== boundary.sourceCommit || request.attempt !== boundary.attempt
    || validation.task_id !== boundary.taskId || validation.work_package_id !== boundary.workPackageId
    || validation.source_commit !== boundary.sourceCommit
    || JSON.stringify(validation.changed_files) !== JSON.stringify(changedFiles)) {
    throw new Error("EVIDENCE_IDENTITY_MISMATCH: execution and validation identities diverge");
  }
  if (!/^[0-9a-f]{40}$/.test(input.headCommit) || !/^[0-9a-f]{64}$/.test(input.changeFingerprint)) {
    throw new Error("EVIDENCE_GIT_IDENTITY_INVALID: head commit and fingerprint are required");
  }
  const status = attemptStatus(input.completion, validation);
  const failureCategory = attemptFailureCategory(input.completion, validation, status);
  const metrics = metricsSchema.parse({
    ...input.metrics,
    execution_duration_seconds: (finishedMs - startedMs) / 1_000,
  });
  const result: ExecutionResult = executionResultSchema.parse({
    schema_version: 1,
    task_id: boundary.taskId,
    work_package_id: boundary.workPackageId,
    source_commit: boundary.sourceCommit,
    executor: { adapter: request.route.executor, model: request.route.model },
    status,
    changed_files: changedFiles,
    tests: validation.commands.map((command) => ({
      command: command.command,
      status: command.status === "TIMED_OUT" ? "FAIL" : command.status,
      evidence: evidenceFor(command),
    })),
    acceptance,
    contracts_changed: input.contractsChanged ?? [],
    migrations_changed: input.migrationsChanged ?? [],
    risks_discovered: input.risksDiscovered ?? [],
    issues_discovered: input.issuesDiscovered ?? [],
    change_requests: input.changeRequests ?? [],
    follow_up_candidates: input.followUpCandidates ?? [],
    dependency_gates_satisfied: status === "DONE" ? input.satisfiedGates : [],
    dependency_gates_blocked: status === "DONE" ? input.blockedGates : [...new Set(input.blockedGates)],
    dag_effects: input.dagEffects ?? [],
    metrics,
    notes: input.notes ?? "",
  });
  const semantic = {
    schema_version: 1 as const,
    head_commit: input.headCommit,
    change_fingerprint: input.changeFingerprint,
    attempt_started_at: startedAt,
    attempt_finished_at: finishedAt,
    duration_seconds: metrics.execution_duration_seconds!,
    failure_category: failureCategory,
    validation,
    result,
  };
  const contentHash = hash(stableJson(semantic));
  return agentFactoryAttemptEvidenceEnvelopeSchema.parse({
    ...semantic,
    receipt_id: `AFATT-${contentHash}`,
    content_sha256: contentHash,
  });
}

export function writeAgentFactoryEvidence(envelope: AgentFactoryEvidenceEnvelope, root = process.cwd()): string {
  const receipt = agentFactoryEvidenceEnvelopeSchema.parse(envelope);
  const path = resolve(root, "docs/evidence/agentfactory", receipt.result.task_id, `attempt-${receipt.result.metrics.attempts}-${receipt.content_sha256}.json`);
  const content = `${stableJson(receipt)}\n`;
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`EVIDENCE_OVERWRITE_REFUSED: ${path}`);
    return path;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, { flag: "wx" });
  return path;
}

export function writeAgentFactoryAttemptEvidence(envelope: AgentFactoryAttemptEvidenceEnvelope, root = process.cwd()): string {
  const receipt = agentFactoryAttemptEvidenceEnvelopeSchema.parse(envelope);
  const path = resolve(root, "docs/evidence/agentfactory", receipt.result.task_id, `attempt-${receipt.result.metrics.attempts}-${receipt.content_sha256}.json`);
  return writeAppendOnly(path, `${stableJson(receipt)}\n`);
}

function attemptStatus(
  completion: ExecutionBoundaryCompletion,
  validation: ValidationGateReceipt,
): ExecutionResult["status"] {
  if (completion.violations.length > 0 || completion.report.result?.status === "BLOCKED") return "BLOCKED";
  if (completion.report.status !== "completed"
    || ["FAILED", "TIMED_OUT"].includes(completion.report.result?.status ?? "")) return "FAILED";
  if (validation.decision === "FAIL" || validation.commands.some((command) => command.status !== "PASS")) return "FAILED";
  if (validation.decision === "REVIEW_REQUIRED") return "NEEDS_DECISION";
  return "DONE";
}

function attemptFailureCategory(
  completion: ExecutionBoundaryCompletion,
  validation: ValidationGateReceipt,
  status: ExecutionResult["status"],
): string | null {
  if (status === "DONE") return null;
  if (completion.violations.length > 0) return "EXECUTION_SCOPE_VIOLATION";
  if (completion.report.result?.failure?.code) return completion.report.result.failure.code;
  if (validation.reason_codes[0]) return validation.reason_codes[0];
  if (status === "NEEDS_DECISION") return "GOVERNANCE_DECISION_REQUIRED";
  return "EXECUTION_FAILED";
}

function writeAppendOnly(path: string, content: string): string {
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`EVIDENCE_OVERWRITE_REFUSED: ${path}`);
    return path;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, { flag: "wx" });
  return path;
}

function evidenceFor(command: ValidationGateReceipt["commands"][number]): string {
  const detail = [command.stdout, command.stderr].filter(Boolean).join("\n").slice(0, 2_000);
  return detail || `exit_code=${command.exit_code}`;
}

function stableJson(value: unknown): string { return JSON.stringify(value, null, 2); }
function hash(value: string): string { return createHash("sha256").update(value).digest("hex"); }
