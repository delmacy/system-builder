import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { z } from "zod";
import { evaluateDagReadiness, type DagGraph } from "./dag.js";
import {
  buildAgentFactoryAttemptEvidence,
  buildAgentFactoryEvidence,
  type AgentFactoryAttemptEvidenceEnvelope,
  type AgentFactoryEvidenceEnvelope,
} from "./evidence-writer.js";
import { beginExecutionBoundary, enforceExecutionDelta } from "./execution-harness.js";
import { OpenCodeExecutor, type CommandResult } from "./executor.js";
import { evaluateGitHubLifecycle } from "./github-lifecycle.js";
import { deriveStateGitHubLifecycleObservation } from "./orchestrator-runtime.js";
import { applyLedgerTransition, buildLedgerTransitionEvent, type LedgerApplicationReceipt } from "./ledger-engine.js";
import { routeTask } from "./model-router.js";
import { recomputeSuccessorReadiness } from "./readiness-recompute.js";
import { buildTaskPack } from "./task-pack.js";
import { taskRecordSchema, type StateTransition, type TaskRecord } from "./execution-contracts.js";
import type { Task } from "./task.js";
import { runIndependentValidation } from "./validation-engine.js";

const proofSemanticSchema = z.object({
  schema_version: z.literal(1),
  task_id: z.literal("TASK-900"),
  work_package_id: z.literal("WP-I1-12"),
  source_commit: z.string().regex(/^[0-9a-f]{40}$/),
  task_pack_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  route: z.literal("SELECTED"),
  opencode: z.object({ noninteractive: z.literal(true), bounded: z.literal(true), argument_order: z.literal("PROMPT_MODEL_FILE") }).strict(),
  execution: z.literal("SUCCEEDED"),
  validation: z.literal("PASS"),
  evidence_receipt_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/),
  github_lifecycle: z.literal("ELIGIBLE"),
  final_state: z.literal("DONE"),
  newly_ready: z.array(z.string()).min(1),
  failure: z.object({
    execution: z.literal("BLOCKED"),
    validation: z.literal("FAIL"),
    evidence_rejected: z.literal(true),
    ledger_rejected: z.literal(true),
    task_preserved: z.literal(true),
    graph_preserved: z.literal(true),
  }).strict(),
}).strict();

export const i1ProofReceiptSchema = proofSemanticSchema.extend({
  proof_id: z.string().regex(/^I1PROOF-[0-9a-f]{64}$/),
  content_sha256: z.string().regex(/^[0-9a-f]{64}$/),
}).strict();

export type I1ProofReceipt = z.infer<typeof i1ProofReceiptSchema>;

const postHardeningProofSemanticSchema = z.object({
  schema_version: z.literal(2),
  predecessor_proof_id: i1ProofReceiptSchema.shape.proof_id,
  happy_path: z.object({ final_state: z.literal("DONE"), newly_ready: z.array(z.string()).min(1), causal_attempt_receipt: z.string().regex(/^AFATT-/) }).strict(),
  failure: z.object({
    status: z.literal("BLOCKED"),
    receipt_id: z.string().regex(/^AFATT-/),
    failure_category: z.literal("EXECUTION_SCOPE_VIOLATION"),
    ledger_transition_accepted: z.literal(true),
    done_rejected: z.literal(true),
    task_preserved: z.literal(true),
    graph_preserved: z.literal(true),
  }).strict(),
  state_lifecycle: z.object({ raw_state: z.literal("MERGED"), decision: z.literal("BLOCKED"), identity_mismatch: z.literal(true) }).strict(),
}).strict();

export const postHardeningI1ProofReceiptSchema = postHardeningProofSemanticSchema.extend({
  proof_id: z.string().regex(/^I1PROOF2-[0-9a-f]{64}$/),
  content_sha256: z.string().regex(/^[0-9a-f]{64}$/),
}).strict();
export type PostHardeningI1ProofReceipt = z.infer<typeof postHardeningI1ProofReceiptSchema>;

export function buildRepresentativeI1Proof(): I1ProofReceipt {
  const task = representativeTask();
  const route = routeTask(task.metadata, "IMPLEMENTATION", {
    deterministic_enabled: true,
    tiers: { T1: { executor: "opencode", model: "proof/model" } },
  });
  const taskRecord = representativeTaskRecord(route);
  const initialGraph = representativeGraph();
  const readiness = evaluateDagReadiness(initialGraph).nodes.find((node) => node.id === taskRecord.task_id)!;
  const pack = buildTaskPack({
    record: taskRecord,
    task,
    taskFile,
    readiness,
    sourceCommit,
    context: [{ path: contextPath, contents: "# Representative bounded context\n" }],
    stopConditions: ["Stop on undeclared scope"],
  });
  const start = beginExecutionBoundary({
    task,
    taskFile,
    recordedTaskId: task.metadata.id,
    manifestTaskId: pack.manifest.task_id,
    plan: { workPackageId: taskRecord.work_package_id, route },
    executor: "opencode",
    attempt: 1,
    repair: false,
    expectedBranch: branch,
    currentBranch: branch,
    baseCommit: sourceCommit,
    headCommit: sourceCommit,
    sourceCommit,
    taskPackPath,
    taskPackHash: pack.manifest.pack_sha256,
    actualTaskPackHash: pack.manifest.pack_sha256,
    changedFiles: [],
  });

  const invocations: string[][] = [];
  const executor = new OpenCodeExecutor(".", "opencode-proof", undefined, (_command, args): CommandResult => {
    invocations.push([...args]);
    return args[0] === "--version"
      ? { status: 0, stdout: "opencode proof", stderr: "" }
      : { status: 0, stdout: "bounded implementation", stderr: "" };
  }, 1_000);
  const rawReport = executor.execute({ task, taskPackPath, attempt: 1, request: start.request });
  const completion = enforceExecutionDelta(start, task, rawReport, [outputPath]);
  const validation = runIndependentValidation(
    task,
    completion,
    snapshot([outputPath], "stable"),
    () => ({ status: 0, stdout: "proof validation passed", stderr: "" }),
    () => snapshot([outputPath], "stable"),
  );
  const evidence = buildAgentFactoryEvidence({
    completion,
    validation,
    headCommit,
    changeFingerprint,
    acceptance: [{ id: acceptanceId, status: "PASS", evidence: "end-to-end assertions" }],
    satisfiedGates: [successorGateId],
    blockedGates: [],
    metrics: { attempts: 1, execution_duration_seconds: 1, review_duration_seconds: 1, token_or_provider_cost: 0 },
  });
  const attemptEvidence = buildAgentFactoryAttemptEvidence({
    completion,
    validation,
    headCommit,
    changeFingerprint,
    acceptance: [{ id: acceptanceId, status: "PASS", evidence: "end-to-end assertions" }],
    satisfiedGates: [successorGateId],
    blockedGates: [],
    attemptStartedAt,
    attemptFinishedAt,
    metrics: { attempts: 1, review_duration_seconds: 1, token_or_provider_cost: 0 },
  });
  const lifecycle = evaluateGitHubLifecycle({
    prNumber: 900,
    state: "OPEN",
    branch,
    baseBranch: "main",
    headCommit,
    expectedBranch: branch,
    expectedBaseBranch: "main",
    expectedHeadCommit: headCommit,
    requiredChecks: ["validate"],
    checks: [{ name: "validate", status: "SUCCESS" }],
    validation: validation.decision,
    review: "APPROVED",
    reviewRequired: true,
  });
  const ledger = advanceToDone(taskRecord, attemptEvidence, evidence);
  const recomputed = recomputeSuccessorReadiness({ graph: initialGraph, ledgerReceipt: ledger, evidence, evidenceRef });
  const failure = controlledFailure(task, taskRecord, start, rawReport, evidence, initialGraph);
  const runArgs = invocations[1] ?? [];
  const modelIndex = runArgs.indexOf("--model");
  const fileIndex = runArgs.indexOf("--file");
  const semantic = proofSemanticSchema.parse({
    schema_version: 1,
    task_id: task.metadata.id,
    work_package_id: taskRecord.work_package_id,
    source_commit: sourceCommit,
    task_pack_sha256: pack.manifest.pack_sha256,
    route: route.decision,
    opencode: {
      noninteractive: runArgs[0] === "run" && runArgs.includes("--pure") && runArgs.includes("--format"),
      bounded: runArgs.includes("--agent") && invocations.length === 2,
      argument_order: modelIndex > 1 && fileIndex > modelIndex ? "PROMPT_MODEL_FILE" : "INVALID",
    },
    execution: completion.report.result?.status,
    validation: validation.decision,
    evidence_receipt_id: evidence.receipt_id,
    github_lifecycle: lifecycle.decision,
    final_state: ledger.authoritative_task.state,
    newly_ready: recomputed.newly_ready,
    failure,
  });
  const contentHash = hash(stableJson(semantic));
  return i1ProofReceiptSchema.parse({
    ...semantic,
    proof_id: `I1PROOF-${contentHash}`,
    content_sha256: contentHash,
  });
}

export function writeI1Proof(receipt: I1ProofReceipt, root = process.cwd()): string {
  const proof = i1ProofReceiptSchema.parse(receipt);
  const path = resolve(root, "docs/evidence/agentfactory/i1", `${proof.proof_id}.json`);
  const content = `${stableJson(proof)}\n`;
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`I1_PROOF_OVERWRITE_REFUSED: ${path}`);
    return path;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, { flag: "wx" });
  return path;
}

export function buildPostHardeningI1Proof(): PostHardeningI1ProofReceipt {
  const predecessor = buildRepresentativeI1Proof();
  const task = representativeTask();
  const route = routeTask(task.metadata, "IMPLEMENTATION", { deterministic_enabled: true, tiers: { T1: { executor: "opencode", model: "proof/model" } } });
  const taskRecord = representativeTaskRecord(route);
  const graph = representativeGraph();
  const graphBefore = stableJson(graph);
  const pack = buildTaskPack({
    record: taskRecord, task, taskFile, readiness: evaluateDagReadiness(graph).nodes.find((node) => node.id === taskRecord.task_id)!,
    sourceCommit, context: [{ path: contextPath, contents: "# Representative bounded context\n" }], stopConditions: ["Stop on undeclared scope"],
  });
  const start = beginExecutionBoundary({
    task, taskFile, recordedTaskId: task.metadata.id, manifestTaskId: pack.manifest.task_id,
    plan: { workPackageId: taskRecord.work_package_id, route }, executor: "opencode", attempt: 1, repair: false,
    expectedBranch: branch, currentBranch: branch, baseCommit: sourceCommit, headCommit: sourceCommit, sourceCommit,
    taskPackPath, taskPackHash: pack.manifest.pack_sha256, actualTaskPackHash: pack.manifest.pack_sha256, changedFiles: [],
  });
  const successfulReport = new OpenCodeExecutor(".", "opencode-proof", undefined, (_command, args) => (
    args[0] === "--version" ? { status: 0, stdout: "opencode proof", stderr: "" } : { status: 0, stdout: "bounded implementation", stderr: "" }
  ), 1_000).execute({ task, taskPackPath, attempt: 1, request: start.request });
  const failedCompletion = enforceExecutionDelta(start, task, successfulReport, ["packages/escape.ts"]);
  const failedValidation = runIndependentValidation(
    task, failedCompletion, snapshot(["packages/escape.ts"], "failed-stable"),
    () => ({ status: 0, stdout: "command ran", stderr: "" }), () => snapshot(["packages/escape.ts"], "failed-stable"),
  );
  const failureEvidence = buildAgentFactoryAttemptEvidence({
    completion: failedCompletion, validation: failedValidation, headCommit, changeFingerprint,
    acceptance: [{ id: acceptanceId, status: "FAIL", evidence: "scope boundary rejected" }],
    satisfiedGates: [], blockedGates: [], attemptStartedAt, attemptFinishedAt,
    metrics: { attempts: 1, review_duration_seconds: null, token_or_provider_cost: 0 },
  });
  const running = applyLedgerTransition({ task: taskRecord, to: "RUNNING", reasonCode: "EXECUTION_STARTED", occurredAt, evidenceRef: "event:execution-started", evidence: transitionEvent("EXECUTION_STARTED", attemptStartedAt) });
  if (!running.accepted) throw new Error(`post-hardening start rejected: ${running.reason_codes.join(", ")}`);
  const blocked = applyLedgerTransition({ task: running.authoritative_task, to: "BLOCKED", reasonCode: "DEPENDENCY_BLOCKED", occurredAt, evidenceRef: `attempt:${failureEvidence.receipt_id}`, evidence: failureEvidence, priorAttempts: running.attempts });
  if (!blocked.accepted) throw new Error(`post-hardening failure transition rejected: ${blocked.reason_codes.join(", ")}`);
  const done = applyLedgerTransition({ task: taskRecord, to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", occurredAt, evidenceRef: `attempt:${failureEvidence.receipt_id}`, evidence: failureEvidence });
  const stateLifecycle = deriveStateGitHubLifecycleObservation({
    number: 901, url: "https://example.invalid/pull/901", state: "MERGED", headRefName: "state/task-999-close",
    baseRefName: "main", headRefOid: headCommit, reviewDecision: "APPROVED", mergeCommit: { oid: sourceCommit },
    statusCheckRollup: [{ name: "validate", status: "COMPLETED", conclusion: "SUCCESS" }],
  }, { branch: "state/task-900-close", headCommit, requiredChecks: ["validate"], reviewRequired: true });
  const semantic = postHardeningProofSemanticSchema.parse({
    schema_version: 2,
    predecessor_proof_id: predecessor.proof_id,
    happy_path: { final_state: predecessor.final_state, newly_ready: predecessor.newly_ready, causal_attempt_receipt: successfulAttemptReceiptId() },
    failure: {
      status: failureEvidence.result.status, receipt_id: failureEvidence.receipt_id, failure_category: failureEvidence.failure_category,
      ledger_transition_accepted: blocked.accepted, done_rejected: !done.accepted,
      task_preserved: stableJson(done.authoritative_task) === stableJson(taskRecord), graph_preserved: stableJson(graph) === graphBefore,
    },
    state_lifecycle: { raw_state: stateLifecycle.state, decision: stateLifecycle.lifecycle?.decision, identity_mismatch: stateLifecycle.lifecycle?.reason_codes.includes("IDENTITY_MISMATCH") },
  });
  const contentHash = hash(stableJson(semantic));
  return postHardeningI1ProofReceiptSchema.parse({ ...semantic, proof_id: `I1PROOF2-${contentHash}`, content_sha256: contentHash });
}

export function writePostHardeningI1Proof(receipt: PostHardeningI1ProofReceipt, root = process.cwd()): string {
  const proof = postHardeningI1ProofReceiptSchema.parse(receipt);
  const path = resolve(root, "docs/evidence/agentfactory/i1", `${proof.proof_id}.json`);
  const content = `${stableJson(proof)}\n`;
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`I1_PROOF_OVERWRITE_REFUSED: ${path}`);
    return path;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, { flag: "wx" });
  return path;
}

function successfulAttemptReceiptId(): string {
  const task = representativeTask();
  const route = routeTask(task.metadata, "IMPLEMENTATION", { deterministic_enabled: true, tiers: { T1: { executor: "opencode", model: "proof/model" } } });
  const record = representativeTaskRecord(route);
  const request = { schema_version: 1 as const, task_id: record.task_id, work_package_id: record.work_package_id, source_commit: sourceCommit, attempt: 1, task_pack_path: taskPackPath, route, scope: { allowed_paths: task.metadata.allowed_paths, forbidden_paths: task.metadata.forbidden_paths, max_files: task.metadata.max_files }, validation_commands: task.metadata.validation };
  const report = new OpenCodeExecutor(".", "opencode-proof", undefined, (_command, args) => args[0] === "--version" ? { status: 0, stdout: "opencode proof", stderr: "" } : { status: 0, stdout: "bounded implementation", stderr: "" }, 1_000).execute({ task, taskPackPath, attempt: 1, request });
  const completion = { boundary: { version: 1 as const, taskId: record.task_id, workPackageId: record.work_package_id, branch, baseCommit: sourceCommit, headCommit: sourceCommit, sourceCommit, taskPackPath, taskPackHash: "d".repeat(64), attempt: 1, repair: false, initialChangedFiles: [] }, changedFiles: [outputPath], violations: [], rawReport: report, report };
  const validation = runIndependentValidation(task, completion, snapshot([outputPath], "stable"), () => ({ status: 0, stdout: "proof validation passed", stderr: "" }), () => snapshot([outputPath], "stable"));
  return buildAgentFactoryAttemptEvidence({ completion, validation, headCommit, changeFingerprint, acceptance: [{ id: acceptanceId, status: "PASS", evidence: "end-to-end assertions" }], satisfiedGates: [successorGateId], blockedGates: [], attemptStartedAt, attemptFinishedAt, metrics: { attempts: 1, review_duration_seconds: 1, token_or_provider_cost: 0 } }).receipt_id;
}

function advanceToDone(
  initial: TaskRecord,
  attemptEvidence: AgentFactoryAttemptEvidenceEnvelope,
  evidence: AgentFactoryEvidenceEnvelope,
): Extract<LedgerApplicationReceipt, { accepted: true }> {
  const steps: Array<[TaskRecord["state"], StateTransition["reason_code"], string, unknown]> = [
    ["RUNNING", "EXECUTION_STARTED", "event:execution-started", transitionEvent("EXECUTION_STARTED", attemptStartedAt)],
    ["VERIFICATION", "EXECUTOR_COMPLETED", "event:executor-completed", transitionEvent("EXECUTOR_COMPLETED", attemptFinishedAt)],
    ["EVIDENCED", "VALIDATION_PASSED", `attempt:${attemptEvidence.receipt_id}`, attemptEvidence],
    ["INTEGRATING", "INTEGRATION_STARTED", "event:integration-started", transitionEvent("INTEGRATION_STARTED", attemptFinishedAt)],
    ["DONE", "INTEGRATION_ACCEPTED", evidenceRef, evidence],
  ];
  let task = initial;
  let attempts: LedgerApplicationReceipt["attempts"] = [];
  let accepted: LedgerApplicationReceipt | undefined;
  for (const [to, reasonCode, stepEvidenceRef, stepEvidence] of steps) {
    accepted = applyLedgerTransition({ task, to, reasonCode, occurredAt, evidenceRef: stepEvidenceRef, evidence: stepEvidence, priorAttempts: attempts });
    if (!accepted.accepted) throw new Error(`I1 proof transition rejected: ${accepted.reason_codes.join(", ")}`);
    task = accepted.authoritative_task;
    attempts = accepted.attempts;
  }
  return accepted as Extract<LedgerApplicationReceipt, { accepted: true }>;
}

function transitionEvent(reasonCode: StateTransition["reason_code"], observedAt: string) {
  return buildLedgerTransitionEvent({
    task_id: "TASK-900",
    work_package_id: "WP-I1-12",
    reason_code: reasonCode,
    observed_at: observedAt,
  });
}

function controlledFailure(
  task: Task,
  taskRecord: TaskRecord,
  start: ReturnType<typeof beginExecutionBoundary>,
  rawReport: ReturnType<OpenCodeExecutor["execute"]>,
  evidence: AgentFactoryEvidenceEnvelope,
  graph: DagGraph,
) {
  const failedCompletion = enforceExecutionDelta(start, task, rawReport, ["packages/escape.ts"]);
  const validation = runIndependentValidation(
    task,
    failedCompletion,
    snapshot(["packages/escape.ts"], "failed-stable"),
    () => ({ status: 0, stdout: "command ran", stderr: "" }),
    () => snapshot(["packages/escape.ts"], "failed-stable"),
  );
  let evidenceRejected = false;
  try {
    buildAgentFactoryEvidence({ completion: failedCompletion, validation, headCommit, changeFingerprint, acceptance: [{ id: acceptanceId, status: "PASS", evidence: "should reject" }], satisfiedGates: [], blockedGates: [], metrics: { attempts: 1, execution_duration_seconds: null, review_duration_seconds: null, token_or_provider_cost: null } });
  } catch { evidenceRejected = true; }
  const rejected = applyLedgerTransition({ task: taskRecord, to: "DONE", reasonCode: "INTEGRATION_ACCEPTED", occurredAt, evidenceRef, evidence });
  return {
    execution: failedCompletion.report.result?.status,
    validation: validation.decision,
    evidence_rejected: evidenceRejected,
    ledger_rejected: !rejected.accepted,
    task_preserved: JSON.stringify(rejected.authoritative_task) === JSON.stringify(taskRecord),
    graph_preserved: JSON.stringify(graph) === JSON.stringify(JSON.parse(JSON.stringify(graph))) && JSON.stringify(graph) === JSON.stringify(representativeGraph()),
  };
}

function representativeTask(): Task {
  const metadata = {
    id: "TASK-900", title: "Representative bounded I1 proof task", status: "ready" as const, priority: 1,
    milestone: "I1", model_tier: "free" as const, risk: "low" as const, architecture_impact: false,
    executor_preference: "opencode" as const, depends_on: [], context_paths: [contextPath], allowed_paths: ["docs/proof/**"],
    forbidden_paths: ["packages/**"], max_files: 1, validation: ["proof:validate"],
  };
  return { file: taskFile, metadata, source: "---\nid: TASK-900\n---\n# Representative proof\n", body: "# Representative proof\n" };
}

function representativeTaskRecord(route: ReturnType<typeof routeTask>): TaskRecord {
  return taskRecordSchema.parse({
    schema_version: 1, task_id: "TASK-900", work_package_id: "WP-I1-12", milestone: "I1",
    title: "Representative bounded I1 proof task", state: "READY", route, dependency_gates: [],
    context_paths: [contextPath], allowed_paths: ["docs/proof/**"], forbidden_paths: ["packages/**"], max_files: 1,
    validation_commands: ["proof:validate"], acceptance_ids: [acceptanceId],
  });
}

function representativeGraph(): DagGraph {
  return { schema_version: 1, external_nodes: [], nodes: [
    { id: "TASK-900", state: "READY", dependency_gates: [] },
    { id: "TASK-901", state: "BLOCKED", dependency_gates: [{ schema_version: 1, id: successorGateId, predecessor_id: "TASK-900", successor_id: "TASK-901", type: "REQUIRES", status: "UNSATISFIED", evidence_refs: [] }] },
  ] };
}

function snapshot(changedFiles: string[], fingerprint: string) {
  return { changedFiles, fingerprint, evaluatorChanges: [], missingEvaluators: [] };
}

function stableJson(value: unknown): string { return JSON.stringify(value, null, 2); }
function hash(value: string): string { return createHash("sha256").update(value).digest("hex"); }

const sourceCommit = "a".repeat(40);
const headCommit = "b".repeat(40);
const changeFingerprint = "c".repeat(64);
const branch = "task/900-representative-proof";
const taskFile = "specs/tasks/TASK-900.md";
const contextPath = "docs/proof/context.md";
const outputPath = "docs/proof/output.md";
const taskPackPath = ".agent/context/TASK-900/TASK_PACK.md";
const acceptanceId = "AC-I1-PROOF";
const successorGateId = "GATE-I1-PROOF-SUCCESSOR";
const evidenceRef = "docs/evidence/agentfactory/TASK-900/attempt.json";
const occurredAt = "2026-08-13T01:00:00.000Z";
const attemptStartedAt = "2026-08-13T00:59:58.000Z";
const attemptFinishedAt = "2026-08-13T00:59:59.000Z";
