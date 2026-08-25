import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { z } from "zod";
import {
  DECISION_BOUNDARY_VERSION,
  evaluateDeterministicInvariantControl,
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  type DecisionBoundaryDescriptor,
  type DeterministicInvariantEvaluation,
} from "../../../packages/contracts/decision-boundary/index.js";
import type { DagGraph } from "./dag.js";
import {
  buildAgentFactoryAttemptEvidence,
  buildAgentFactoryEvidence,
  agentFactoryAttemptEvidenceEnvelopeSchema,
  agentFactoryEvidenceEnvelopeSchema,
  type EvidenceWriterInput,
  type GovernanceResolution,
  governanceResolutionSchema,
} from "./evidence-writer.js";
import type { ExecutionBoundaryCompletion } from "./execution-harness.js";
import { taskRecordSchema, type TaskRecord } from "./execution-contracts.js";
import { githubLifecycleReceiptSchema, type GitHubLifecycleReceipt } from "./github-lifecycle.js";
import { applyLedgerTransition, buildLedgerTransitionEvent, ledgerApplicationReceiptSchema, type LedgerApplicationReceipt } from "./ledger-engine.js";
import { readinessRecomputationReceiptSchema, recomputeSuccessorReadiness } from "./readiness-recompute.js";
import type { Task } from "./task.js";
import { validationGateReceiptSchema, type ValidationGateReceipt } from "./validation-engine.js";

const taskId = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const hash = z.string().regex(/^[0-9a-f]{64}$/);
const decisionBoundaryToken = z.string().min(1).regex(/^\S+$/);

export const authorityClosureManifestSchema = z.object({
  schema_version: z.literal(1),
  bundle_id: z.string().regex(/^AFCLOSE-[0-9a-f]{64}$/),
  task_id: taskId,
  work_package_id: z.string().regex(/^WP-[A-Z0-9-]+$/),
  source_commit: z.string().regex(/^[0-9a-f]{40}$/),
  implementation_head: z.string().regex(/^[0-9a-f]{40}$/),
  implementation_pr: githubLifecycleReceiptSchema,
  state_branch: z.string().min(1),
  final_evidence_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/),
  files: z.array(z.object({ path: z.string().min(1), sha256: hash }).strict()).min(4),
}).strict();

const authorityClosureDecisionBoundaryProjectionInputSchema = z.object({
  decisionId: decisionBoundaryToken,
  implementationInvariantRef: decisionBoundaryToken,
  validationInvariantRef: decisionBoundaryToken,
  implementationLifecycle: githubLifecycleReceiptSchema,
  validation: validationGateReceiptSchema,
}).strict();

export type AuthorityClosureManifest = z.infer<typeof authorityClosureManifestSchema>;
export type AuthorityClosureBundle = {
  attempt: z.infer<typeof agentFactoryAttemptEvidenceEnvelopeSchema>;
  evidence: z.infer<typeof agentFactoryEvidenceEnvelopeSchema>;
  ledger: z.infer<typeof ledgerApplicationReceiptSchema>;
  readiness: z.infer<typeof readinessRecomputationReceiptSchema>;
  governanceResolution: GovernanceResolution | null;
  manifest: AuthorityClosureManifest;
};

export type AuthorityClosureInput = {
  task: Task;
  completion: ExecutionBoundaryCompletion;
  validation: ValidationGateReceipt;
  changeFingerprint: string;
  implementationLifecycle: GitHubLifecycleReceipt;
  governanceResolution?: GovernanceResolution;
  graph: DagGraph;
  acceptanceIds: string[];
  satisfiedGates: string[];
  blockedGates?: string[];
  attemptStartedAt: string;
  attemptFinishedAt: string;
  integratedAt: string;
  stateBranch: string;
};

export type AuthorityClosureDeterministicDecisionProjection = Readonly<{
  descriptor: DecisionBoundaryDescriptor;
  metadata: Readonly<{ invariantRef: string }>;
  control: DeterministicInvariantEvaluation;
}>;

export type AuthorityClosureDecisionBoundaryProjection = Readonly<{
  implementationEligibility: AuthorityClosureDeterministicDecisionProjection;
  validation: AuthorityClosureDeterministicDecisionProjection;
  implementationLifecycle: GitHubLifecycleReceipt;
  validationReceipt: ValidationGateReceipt;
}>;

export function projectAuthorityClosureDecisionBoundary(input: unknown): AuthorityClosureDecisionBoundaryProjection {
  const parsed = authorityClosureDecisionBoundaryProjectionInputSchema.parse(input);
  assertClosurePreconditions(parsed.implementationLifecycle, parsed.validation);
  return {
    implementationEligibility: deterministicProjection(
      `${parsed.decisionId}:implementation-eligibility`,
      parsed.implementationInvariantRef,
    ),
    validation: deterministicProjection(
      `${parsed.decisionId}:validation`,
      parsed.validationInvariantRef,
    ),
    implementationLifecycle: parsed.implementationLifecycle,
    validationReceipt: parsed.validation,
  };
}

export function buildAuthorityClosureBundle(input: AuthorityClosureInput): AuthorityClosureBundle {
  const lifecycle = githubLifecycleReceiptSchema.parse(input.implementationLifecycle);
  assertClosurePreconditions(lifecycle, input.validation);
  const headCommit = lifecycle.head_commit;
  const changeFingerprint = hash.parse(input.changeFingerprint);
  const common: Omit<EvidenceWriterInput, "acceptance" | "metrics"> = {
    completion: input.completion,
    validation: input.validation,
    headCommit,
    changeFingerprint,
    satisfiedGates: [...new Set(input.satisfiedGates)].sort(),
    blockedGates: [...new Set(input.blockedGates ?? [])].sort(),
    ...(input.governanceResolution ? { governanceResolution: input.governanceResolution } : {}),
  };
  const acceptance = [...new Set(input.acceptanceIds)].sort().map((id) => ({ id, status: "PASS" as const, evidence: "independent validation and eligible implementation lifecycle" }));
  const attempt = buildAgentFactoryAttemptEvidence({
    ...common,
    acceptance,
    attemptStartedAt: input.attemptStartedAt,
    attemptFinishedAt: input.attemptFinishedAt,
    metrics: { attempts: input.completion.boundary.attempt, review_duration_seconds: null, token_or_provider_cost: null },
  });
  const evidence = buildAgentFactoryEvidence({
    ...common,
    acceptance,
    metrics: { attempts: input.completion.boundary.attempt, execution_duration_seconds: attempt.duration_seconds, review_duration_seconds: null, token_or_provider_cost: null },
  });
  const taskRecord = buildTaskRecord(input, "READY");
  const ledger = input.validation.decision === "PASS"
    ? advanceCausalLedger(taskRecord, input, attempt, evidence)
    : applyDoneTransition({ ...taskRecord, state: "INTEGRATING" }, input.integratedAt, evidence);
  if (!ledger.accepted) throw new Error(`AUTHORITY_CLOSURE_LEDGER_REJECTED:${ledger.reason_codes.join(",")}`);
  const evidenceRef = `docs/evidence/agentfactory/${input.task.metadata.id}/attempt-${evidence.result.metrics.attempts}-${evidence.content_sha256}.json`;
  const readiness = recomputeSuccessorReadiness({ graph: input.graph, ledgerReceipt: ledger, evidence, evidenceRef });
  const directory = `docs/evidence/agentfactory/${input.task.metadata.id}`;
  const files = [
    { path: `${directory}/attempt-${attempt.result.metrics.attempts}-${attempt.content_sha256}.json`, value: attempt },
    { path: evidenceRef, value: evidence },
    { path: `${directory}/ledger.json`, value: ledger },
    { path: `${directory}/readiness.json`, value: readiness },
    ...(input.governanceResolution ? [{ path: `${directory}/governance-resolution.json`, value: input.governanceResolution }] : []),
  ].map(({ path, value }) => ({ path, sha256: digest(serialized(value)) })).sort((left, right) => left.path.localeCompare(right.path));
  const semantic = {
    schema_version: 1 as const,
    task_id: input.task.metadata.id,
    work_package_id: input.completion.boundary.workPackageId,
    source_commit: input.completion.boundary.sourceCommit,
    implementation_head: headCommit,
    implementation_pr: lifecycle,
    state_branch: input.stateBranch,
    final_evidence_id: evidence.receipt_id,
    files,
  };
  const manifest = authorityClosureManifestSchema.parse({ ...semantic, bundle_id: `AFCLOSE-${digest(stableJson(semantic))}` });
  return { attempt, evidence, ledger, readiness, governanceResolution: input.governanceResolution ?? null, manifest };
}

export function writeAuthorityClosureBundle(bundleInput: AuthorityClosureBundle, root = process.cwd()): string[] {
  const bundle = {
    attempt: agentFactoryAttemptEvidenceEnvelopeSchema.parse(bundleInput.attempt),
    evidence: agentFactoryEvidenceEnvelopeSchema.parse(bundleInput.evidence),
    ledger: ledgerApplicationReceiptSchema.parse(bundleInput.ledger),
    readiness: readinessRecomputationReceiptSchema.parse(bundleInput.readiness),
    governanceResolution: bundleInput.governanceResolution ? governanceResolutionSchema.parse(bundleInput.governanceResolution) : null,
    manifest: authorityClosureManifestSchema.parse(bundleInput.manifest),
  };
  const directory = `docs/evidence/agentfactory/${bundle.manifest.task_id}`;
  const values = new Map<string, unknown>([
    [`${directory}/attempt-${bundle.attempt.result.metrics.attempts}-${bundle.attempt.content_sha256}.json`, bundle.attempt],
    [`${directory}/attempt-${bundle.evidence.result.metrics.attempts}-${bundle.evidence.content_sha256}.json`, bundle.evidence],
    [`${directory}/ledger.json`, bundle.ledger],
    [`${directory}/readiness.json`, bundle.readiness],
    ...bundle.governanceResolution ? [[`${directory}/governance-resolution.json`, bundle.governanceResolution] as [string, unknown]] : [],
  ]);
  for (const file of bundle.manifest.files) {
    const value = values.get(file.path);
    if (!value || digest(serialized(value)) !== file.sha256) throw new Error(`AUTHORITY_CLOSURE_MANIFEST_DIVERGENCE:${file.path}`);
    writeAppendOnly(resolve(root, file.path), serialized(value));
  }
  const manifestPath = `${directory}/manifest.json`;
  writeAppendOnly(resolve(root, manifestPath), serialized(bundle.manifest));
  return [...bundle.manifest.files.map((file) => file.path), manifestPath].sort();
}

export function authorityClosureFiles(task: string, root = process.cwd()): string[] {
  const manifestPath = resolve(root, "docs/evidence/agentfactory", task, "manifest.json");
  if (!existsSync(manifestPath)) return [];
  const manifest = authorityClosureManifestSchema.parse(JSON.parse(readFileSync(manifestPath, "utf8")));
  if (manifest.task_id !== task) throw new Error("AUTHORITY_CLOSURE_TASK_DIVERGENCE");
  const { bundle_id: recordedId, ...semantic } = manifest;
  if (recordedId !== `AFCLOSE-${digest(stableJson(semantic))}`) throw new Error("AUTHORITY_CLOSURE_ID_DIVERGENCE");
  for (const file of manifest.files) {
    const path = resolve(root, file.path);
    if (!existsSync(path) || digest(readFileSync(path)) !== file.sha256) throw new Error(`AUTHORITY_CLOSURE_FILE_DIVERGENCE:${file.path}`);
  }
  return [...manifest.files.map((file) => file.path), relative(root, manifestPath).replaceAll("\\", "/")].sort();
}

function advanceCausalLedger(
  initial: TaskRecord,
  input: AuthorityClosureInput,
  attempt: AuthorityClosureBundle["attempt"],
  evidence: AuthorityClosureBundle["evidence"],
): LedgerApplicationReceipt {
  const steps: Array<[TaskRecord["state"], Parameters<typeof applyLedgerTransition>[0]["reasonCode"], string, unknown, string]> = [
    ["RUNNING", "EXECUTION_STARTED", "event:execution-started", event(input, "EXECUTION_STARTED", input.attemptStartedAt), input.attemptStartedAt],
    ["VERIFICATION", "EXECUTOR_COMPLETED", "event:executor-completed", event(input, "EXECUTOR_COMPLETED", input.attemptFinishedAt), input.attemptFinishedAt],
    ["EVIDENCED", "VALIDATION_PASSED", `attempt:${attempt.receipt_id}`, attempt, input.attemptFinishedAt],
    ["INTEGRATING", "INTEGRATION_STARTED", "event:integration-started", event(input, "INTEGRATION_STARTED", input.integratedAt), input.integratedAt],
    ["DONE", "INTEGRATION_ACCEPTED", `docs/evidence/agentfactory/${input.task.metadata.id}/attempt-${evidence.result.metrics.attempts}-${evidence.content_sha256}.json`, evidence, input.integratedAt],
  ];
  let task = initial;
  let attempts: LedgerApplicationReceipt["attempts"] = [];
  let receipt: LedgerApplicationReceipt | undefined;
  for (const [to, reasonCode, evidenceRef, observed, occurredAt] of steps) {
    receipt = applyLedgerTransition({ task, to, reasonCode, occurredAt, evidenceRef, evidence: observed, priorAttempts: attempts });
    if (!receipt.accepted) return receipt;
    task = receipt.authoritative_task;
    attempts = receipt.attempts;
  }
  return receipt!;
}

function applyDoneTransition(task: TaskRecord, occurredAt: string, evidence: AuthorityClosureBundle["evidence"]): LedgerApplicationReceipt {
  const evidenceRef = `docs/evidence/agentfactory/${task.task_id}/attempt-${evidence.result.metrics.attempts}-${evidence.content_sha256}.json`;
  return applyLedgerTransition({ task, to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", occurredAt, evidenceRef, evidence });
}

function event(input: AuthorityClosureInput, reason_code: Parameters<typeof buildLedgerTransitionEvent>[0]["reason_code"], observed_at: string) {
  return buildLedgerTransitionEvent({ task_id: input.task.metadata.id, work_package_id: input.completion.boundary.workPackageId, reason_code, observed_at });
}

function buildTaskRecord(input: AuthorityClosureInput, state: TaskRecord["state"]): TaskRecord {
  const request = input.completion.report.request ?? input.completion.rawReport.request;
  if (!request) throw new Error("AUTHORITY_CLOSURE_REQUEST_MISSING");
  const node = input.graph.nodes.find((candidate) => candidate.id === input.task.metadata.id);
  if (!node) throw new Error("AUTHORITY_CLOSURE_DAG_NODE_MISSING");
  return taskRecordSchema.parse({
    schema_version: 1, task_id: input.task.metadata.id, work_package_id: input.completion.boundary.workPackageId,
    milestone: input.task.metadata.milestone, title: input.task.metadata.title, state, route: request.route,
    dependency_gates: node.dependency_gates, context_paths: input.task.metadata.context_paths,
    allowed_paths: input.task.metadata.allowed_paths, forbidden_paths: input.task.metadata.forbidden_paths,
    max_files: input.task.metadata.max_files, validation_commands: input.task.metadata.validation,
    acceptance_ids: [...new Set(input.acceptanceIds)].sort(),
  });
}

function assertClosurePreconditions(lifecycleInput: GitHubLifecycleReceipt, validationInput: ValidationGateReceipt): void {
  const lifecycle = githubLifecycleReceiptSchema.parse(lifecycleInput);
  const validation = validationGateReceiptSchema.parse(validationInput);
  if (lifecycle.decision !== "ELIGIBLE") {
    throw new Error("AUTHORITY_CLOSURE_IMPLEMENTATION_NOT_ELIGIBLE");
  }
  if (validation.decision === "FAIL" || validation.commands.some((command) => command.status !== "PASS")) {
    throw new Error("AUTHORITY_CLOSURE_VALIDATION_FAILED");
  }
}

function deterministicProjection(decisionId: string, invariantRef: string): AuthorityClosureDeterministicDecisionProjection {
  const descriptor = normalizeDecisionBoundaryDescriptor({
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId,
    category: "deterministic",
  });
  const metadata: Readonly<{ invariantRef: string }> = { invariantRef };
  normalizeDecisionCategoryMetadata("deterministic", metadata);
  const control = evaluateDeterministicInvariantControl({ descriptor, metadata, invariantRef });
  if (control.status !== "compatible") {
    const diagnostic = control.status === "invalid" ? control.diagnostic : control.diagnostic;
    throw new TypeError(`Authority closure decision-boundary projection failed: ${diagnostic}`);
  }
  return { descriptor, metadata, control };
}

function stableJson(value: unknown): string { return JSON.stringify(value, null, 2); }
function serialized(value: unknown): string { return `${stableJson(value)}\n`; }
function digest(value: string | Buffer): string { return createHash("sha256").update(value).digest("hex"); }
function writeAppendOnly(path: string, content: string): void {
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`AUTHORITY_CLOSURE_OVERWRITE_REFUSED:${path}`);
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, { flag: "wx" });
}
