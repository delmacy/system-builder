import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { hostname } from "node:os";
import { dirname, relative, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { z } from "zod";
import { dagGraphSchema, type DagGraph } from "./dag.js";
import { agentFactoryEvidenceEnvelopeSchema } from "./evidence-writer.js";
import { executionRouteSchema, executionStateSchema } from "./execution-contracts.js";
import { OpenCodeExecutor, type ExecutorAdapter } from "./executor.js";
import { git } from "./git.js";
import { ledgerApplicationReceiptSchema } from "./ledger-engine.js";
import { LocalHarnessAdapter } from "./orchestrator-runtime.js";
import { LocalTaskOrchestrator, type AdvanceResult, type OrchestratorState } from "./orchestrator.js";
import {
  AgentFactorySupervisor,
  type SupervisorCallbackTransport,
  type SupervisorIterationAdapter,
  type SupervisorIterationResult,
} from "./pipeline-supervisor.js";
import { readinessRecomputationReceiptSchema } from "./readiness-recompute.js";
import {
  SequentialPipelineCoordinator,
  sequentialObservationSchema,
  sequentialPlanSchema,
  type SequentialObservation,
  type SequentialPipelineAdapter,
  type SequentialReceipt,
} from "./sequential-pipeline.js";
import { DurableSupervisorStore } from "./supervisor-store.js";
import { supervisorCallbackSchema, supervisorConfigSchema, type SupervisorCallback } from "./supervisor-contracts.js";
import { loadTasks, type Task } from "./task.js";
import {
  loadOpenCodeModelCatalogConfig,
  OpenCodeModelResolver,
  openCodeModelSelectorSchema,
  ZenOpenCodeModelCatalogClient,
  type OpenCodeModelCatalogClient,
} from "./opencode-models.js";

const taskIdSchema = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const workPackageIdSchema = z.string().regex(/^WP-[A-Z0-9-]+$/);

export const supervisorRuntimePlanSchema = z.object({
  schema_version: z.literal(1),
  pipeline: sequentialPlanSchema,
  execution: z.record(taskIdSchema, z.object({
    work_package_id: workPackageIdSchema,
    route: executionRouteSchema,
    model_selector: openCodeModelSelectorSchema.optional(),
  }).strict()),
}).strict().superRefine((value, context) => {
  const ordered = new Set(value.pipeline.ordered_task_ids);
  const configured = Object.keys(value.execution);
  for (const id of ordered) if (!configured.includes(id)) context.addIssue({ code: "custom", path: ["execution", id], message: "ordered task requires an execution plan" });
  for (const id of configured) if (!ordered.has(id)) context.addIssue({ code: "custom", path: ["execution", id], message: "execution plan task must belong to the ordered pipeline" });
  for (const [id, execution] of Object.entries(value.execution)) {
    if (execution.route.executor === "opencode" && execution.route.decision === "SELECTED" && !execution.model_selector) {
      context.addIssue({ code: "custom", path: ["execution", id, "model_selector"], message: "selected opencode route requires a model selector" });
    }
    if (execution.route.executor !== "opencode" && execution.model_selector) {
      context.addIssue({ code: "custom", path: ["execution", id, "model_selector"], message: "model selector is only valid for opencode" });
    }
  }
});

export type SupervisorRuntimePlan = z.infer<typeof supervisorRuntimePlanSchema>;
export type ProcessLauncher = (executable: string, args: string[], cwd: string) => boolean;

type AuthorityArtifacts = Pick<SequentialObservation["authorities"][number], "evidence" | "ledger" | "readiness" | "evidence_refs">;
export type AuthorityReader = (taskId: string) => AuthorityArtifacts;

export type SupervisorRuntime = {
  supervisor: AgentFactorySupervisor;
  plan: SupervisorRuntimePlan;
  store: DurableSupervisorStore;
};

export type SupervisorRuntimeOptions = {
  root?: string;
  planPath: string;
  runtimeRoot?: string;
  now?: () => string;
  owner?: string;
  launcher?: ProcessLauncher;
  authorityReader?: AuthorityReader;
  harness?: LocalHarnessAdapter;
  executors?: ExecutorAdapter[];
  cliPath?: string;
  environment?: Readonly<Record<string, string | undefined>>;
  modelCatalogClient?: OpenCodeModelCatalogClient;
  modelCachePath?: string;
};

export function loadSupervisorRuntimePlan(path: string): SupervisorRuntimePlan {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`SUPERVISOR_PLAN_MISSING:${absolute}`);
  return supervisorRuntimePlanSchema.parse(JSON.parse(readFileSync(absolute, "utf8")));
}

export function buildTaskCatalogDag(tasks: Task[], root = process.cwd()): DagGraph {
  const byId = new Map(tasks.map((task) => [task.metadata.id, task]));
  return dagGraphSchema.parse({
    schema_version: 1,
    external_nodes: [],
    nodes: tasks.map((task) => ({
      id: task.metadata.id,
      state: taskExecutionState(task),
      dependency_gates: task.metadata.depends_on.map((predecessor) => {
        if (!byId.has(predecessor)) throw new Error(`SUPERVISOR_DAG_PREDECESSOR_MISSING:${predecessor}>${task.metadata.id}`);
        const evidenceRef = `docs/evidence/tasks/${predecessor}.json`;
        const satisfied = byId.get(predecessor)!.metadata.status === "completed" && existsSync(resolve(root, evidenceRef));
        return {
          schema_version: 1,
          id: `GATE-${predecessor.replace("TASK-", "")}-${task.metadata.id.replace("TASK-", "")}`,
          predecessor_id: predecessor,
          successor_id: task.metadata.id,
          type: "REQUIRES",
          status: satisfied ? "SATISFIED" : "UNSATISFIED",
          evidence_refs: satisfied ? [evidenceRef] : [],
        };
      }),
    })),
  });
}

export class RepositorySequentialAdapter implements SequentialPipelineAdapter {
  constructor(
    private readonly root: string,
    private readonly plan: SupervisorRuntimePlan,
    private readonly tasks: Task[],
    private readonly orchestrator: LocalTaskOrchestrator,
    private readonly now: () => string,
    private readonly readAuthority: AuthorityReader = (taskId) => readRepositoryAuthority(root, taskId),
  ) {}

  observe(): SequentialObservation {
    const ledger = readBootstrapLedger(this.root);
    const tasks = new Map(this.tasks.map((task) => [task.metadata.id, task]));
    const authorities = this.plan.pipeline.ordered_task_ids.map((id) => {
      const task = tasks.get(id);
      if (!task) throw new Error(`PIPELINE_TASK_MISSING:${id}`);
      const observation = this.orchestrator.inspect(id);
      const snapshot = observation.snapshot;
      const artifacts = this.readAuthority(id);
      return {
        task_id: id,
        agent_state: taskExecutionState(task),
        orchestrator_state: observation.state,
        route: selectedRoute(this.plan.execution[id]!.route),
        validation: validationState(observation.state, snapshot.verificationPassed),
        evidence: artifacts.evidence,
        ledger: artifacts.ledger,
        implementation_pr: lifecycle(snapshot.implementationPr),
        state_pr: lifecycle(snapshot.statePr),
        state_closure_integrated: task.metadata.status === "completed"
          && snapshot.closed
          && snapshot.statePr?.state === "MERGED"
          && snapshot.statePr.lifecycle?.decision === "ELIGIBLE",
        readiness: artifacts.readiness,
        evidence_refs: artifacts.evidence_refs,
      };
    });
    return sequentialObservationSchema.parse({
      schema_version: 1,
      observed_at: this.now(),
      bootstrap: { completed: ledger.completed, ready: ledger.ready },
      authorities,
    });
  }

  advanceTask(taskId: string): AdvanceResult {
    const before = this.orchestrator.inspect(taskId);
    if (before.state === "REVIEW_REQUIRED"
      && before.snapshot.implementationPr?.lifecycle?.decision === "ELIGIBLE") {
      mergeExactPullRequest(this.root, before.snapshot.implementationPr.number, before.snapshot.implementationPr.lifecycle.head_commit);
      return { taskId, previousState: before.state, state: "MERGED", action: "merge implementation PR", stop: false, snapshot: before.snapshot };
    }
    if (before.state === "STATE_REVIEW_REQUIRED"
      && before.snapshot.statePr?.lifecycle?.decision === "ELIGIBLE") {
      mergeExactPullRequest(this.root, before.snapshot.statePr.number, before.snapshot.statePr.lifecycle.head_commit);
      return { taskId, previousState: before.state, state: "STATE_MERGED", action: "merge state PR", stop: false, snapshot: before.snapshot };
    }
    return this.orchestrator.advance(taskId);
  }
}

export class SequentialSupervisorIterationAdapter implements SupervisorIterationAdapter {
  constructor(
    private readonly coordinator: SequentialPipelineCoordinator,
    private readonly payloadRoot: string,
  ) {}

  iterate(): SupervisorIterationResult {
    try {
      const receipt = this.coordinator.advance();
      const payloadRef = persistSequentialReceipt(this.payloadRoot, receipt);
      return mapSequentialReceipt(receipt, payloadRef);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/Cannot (?:observe|merge) PR|api\.github\.com|connect|timed?\s*out/i.test(message)) {
        return { eventType: "EXECUTOR_FAILED", state: "RETRY_WAIT", failureClass: "GITHUB_TRANSIENT", provider: "github", payloadRef: message };
      }
      if (/cycle/i.test(message)) return { eventType: "PIPELINE_BLOCKED", state: "BLOCKED", failureClass: "DAG_CYCLE", terminalStatus: "BLOCKED", payloadRef: message };
      return { eventType: "PIPELINE_BLOCKED", state: "BLOCKED", failureClass: "INVALID_TASK_CONTRACT", terminalStatus: "BLOCKED", payloadRef: message };
    }
  }
}

const autoWakeEvents = new Set<SupervisorCallback["reason"]>([
  "TASK_SELECTED", "TASK_DISPATCHED", "EXECUTOR_COMPLETED", "VALIDATION_PASSED", "EVIDENCE_WRITTEN",
  "PR_ELIGIBLE", "PR_MERGED", "APPROVAL_RECEIVED", "STATE_CLOSURE_MERGED", "LEDGER_UPDATED", "SUCCESSOR_READY",
]);

export class LocalProcessCallbackTransport implements SupervisorCallbackTransport {
  constructor(
    private readonly root: string,
    private readonly planPath: string,
    private readonly cliPath: string,
    private readonly launch: ProcessLauncher = launchDetached,
  ) {}

  deliver(input: SupervisorCallback): boolean {
    const callback = supervisorCallbackSchema.parse(input);
    if (!autoWakeEvents.has(callback.reason)) return true;
    const args = [
      ...process.execArgv,
      this.cliPath,
      "callback",
      "--plan", this.planPath,
      "--pipeline", callback.pipeline_id,
      "--event", callback.event_id,
      "--correlation", callback.correlation_id,
      "--reason", callback.reason,
    ];
    return this.launch(process.execPath, args, this.root);
  }
}

export function createSupervisorRuntime(options: SupervisorRuntimeOptions): SupervisorRuntime {
  const root = resolve(options.root ?? process.cwd());
  const planPath = resolve(root, options.planPath);
  const plan = loadSupervisorRuntimePlan(planPath);
  const now = options.now ?? (() => new Date().toISOString());
  const tasks = loadTasks(root);
  const environment = options.environment ?? process.env;
  validateDevelopmentAuthorityBinding(plan, environment);
  const graph = buildTaskCatalogDag(tasks, root);
  const executionPlans = Object.fromEntries(Object.entries(plan.execution).map(([id, value]) => [id, {
    workPackageId: value.work_package_id,
    route: value.route,
  }]));
  const harness = options.harness ?? new LocalHarnessAdapter(root, "gh", executionPlans);
  const modelConfig = loadOpenCodeModelCatalogConfig(root);
  const modelResolver = new OpenCodeModelResolver(
    options.modelCatalogClient ?? new ZenOpenCodeModelCatalogClient(modelConfig),
    {
      cachePath: resolve(options.modelCachePath ?? resolve(root, ".agent/runtime/opencode-models/catalog.json")),
      cacheTtlSeconds: modelConfig.cache_ttl_seconds,
      now,
    },
  );
  const selectors = Object.fromEntries(Object.entries(plan.execution).flatMap(([id, value]) => value.model_selector ? [[id, value.model_selector]] : []));
  const executable = environment.OPENCODE_EXECUTABLE?.trim() || "opencode";
  const overrideModel = environment.OPENCODE_MODEL?.trim();
  const defaultExecutors = [new OpenCodeExecutor(root, executable, undefined, undefined, undefined, {
    resolver: modelResolver,
    selectors,
    ...(overrideModel ? { overrideModel } : {}),
  })];
  const orchestrator = new LocalTaskOrchestrator(harness, options.executors ?? defaultExecutors);
  const sequentialAdapter = new RepositorySequentialAdapter(root, plan, tasks, orchestrator, now, options.authorityReader);
  const coordinator = new SequentialPipelineCoordinator(plan.pipeline, tasks, graph, sequentialAdapter, now);
  const runtimeRoot = resolve(options.runtimeRoot ?? resolve(root, ".agent/runtime/supervisor"));
  const store = new DurableSupervisorStore(runtimeRoot);
  const cliPath = resolve(options.cliPath ?? resolve(root, "tooling/agent-harness/src/supervisor-cli.ts"));
  const callbacks = new LocalProcessCallbackTransport(root, planPath, cliPath, options.launcher);
  const config = supervisorConfigSchema.parse(JSON.parse(readFileSync(resolve(root, "tooling/agent-harness/policies/SUPERVISOR.json"), "utf8")));
  const owner = safeOwner(options.owner ?? `${hostname()}-${process.pid}`);
  return {
    plan,
    store,
    supervisor: new AgentFactorySupervisor(store, config, new SequentialSupervisorIterationAdapter(coordinator, runtimeRoot), callbacks, owner, now),
  };
}

export function mapSequentialReceipt(receipt: SequentialReceipt, payloadRef: string): SupervisorIterationResult {
  const base = { taskId: receipt.selected_task_id, payloadRef };
  if (receipt.stop_reason === "PIPELINE_COMPLETE") return { ...base, eventType: "PIPELINE_COMPLETE", state: "COMPLETE", terminalStatus: "COMPLETE" };
  if (receipt.stop_reason === "DELEGATED" && receipt.delegated) {
    if (receipt.delegated.state === "EXECUTOR_FAILED") {
      const failure = receipt.delegated.failure;
      if (failure?.retryable && failure.code.startsWith("OPENCODE_MODEL_API_")) return {
        ...base,
        eventType: "EXECUTOR_FAILED",
        state: "RETRY_WAIT",
        failureClass: modelFailureClass(failure.code),
        provider: "opencode",
      };
      if (failure && ["MODEL_NOT_AVAILABLE", "MODEL_POLICY_CONFLICT", "INVALID_MODEL_SELECTOR", "INVALID_MODEL_API_RESPONSE"].includes(failure.code)) {
        return { ...base, eventType: "PIPELINE_BLOCKED", state: "BLOCKED", failureClass: "DETERMINISTIC_FAILURE", terminalStatus: "BLOCKED" };
      }
      return { ...base, eventType: "EXECUTOR_FAILED", state: "EXECUTOR_FAILED" };
    }
    if (receipt.delegated.state === "VERIFY_FAILED") return { ...base, eventType: "VALIDATION_FAILED", state: "VERIFY_FAILED" };
    return { ...base, eventType: eventForAction(receipt.delegated.action), state: receipt.delegated.state, currentOperation: null };
  }
  if (receipt.stop_reason === "EXTERNAL_GATE" || receipt.stop_reason === "PR_NOT_ELIGIBLE") {
    if (receipt.implementation_pr?.decision === "PENDING" || receipt.state_pr?.decision === "PENDING") return { ...base, eventType: "PR_CHECKS_CHANGED", state: "EXTERNAL_WAIT" };
    if (receipt.implementation_pr?.decision === "REVIEW_REQUIRED" || receipt.state_pr?.decision === "REVIEW_REQUIRED") return { ...base, eventType: "APPROVAL_REQUIRED", state: "EXTERNAL_WAIT" };
    return { ...base, eventType: "APPROVAL_REQUIRED", state: "EXTERNAL_WAIT" };
  }
  if (receipt.stop_reason === "EXECUTION_FAILED") return { ...base, eventType: "TASK_FAILED", state: "FAILED", failureClass: "DETERMINISTIC_FAILURE", terminalStatus: "FAILED" };
  if (receipt.stop_reason === "VALIDATION_FAILED") return { ...base, eventType: "TASK_FAILED", state: "FAILED", failureClass: "VALIDATION_FAILURE", terminalStatus: "FAILED" };
  const failureClass = receipt.stop_reason === "AUTHORITY_DIVERGENCE" ? "AUTHORITY_DIVERGENCE"
    : receipt.stop_reason === "EVIDENCE_MISSING" || receipt.stop_reason === "EVIDENCE_DIVERGENCE" ? "INVALID_EVIDENCE"
      : receipt.stop_reason === "DOR_NOT_MET" ? "INVALID_TASK_CONTRACT" : "DETERMINISTIC_FAILURE";
  return { ...base, eventType: "PIPELINE_BLOCKED", state: "BLOCKED", failureClass, terminalStatus: "BLOCKED" };
}

function modelFailureClass(code: string): "OPENCODE_TIMEOUT" | "RATE_LIMIT" | "PROVIDER_5XX" | "PROVIDER_UNAVAILABLE" {
  if (code === "OPENCODE_MODEL_API_TIMEOUT") return "OPENCODE_TIMEOUT";
  if (code === "OPENCODE_MODEL_API_RATE_LIMIT") return "RATE_LIMIT";
  if (code === "OPENCODE_MODEL_API_5XX") return "PROVIDER_5XX";
  return "PROVIDER_UNAVAILABLE";
}

function eventForAction(action: string): SupervisorIterationResult["eventType"] {
  if (action === "task:branch") return "TASK_SELECTED";
  if (action === "task:prepare") return "TASK_DISPATCHED";
  if (action === "task:verify") return "VALIDATION_PASSED";
  if (action === "task:commit") return "EVIDENCE_WRITTEN";
  if (action === "task:pr") return "PR_CREATED";
  if (action === "merge implementation PR" || /sync main after implementation merge/.test(action)) return "PR_MERGED";
  if (/create state branch|commit state closure|push state branch|open state PR/.test(action)) return "STATE_CLOSURE_STARTED";
  if (action === "merge state PR" || /sync main after state merge/.test(action)) return "STATE_CLOSURE_MERGED";
  if (action === "task:close") return "LEDGER_UPDATED";
  if (/execution|executor/i.test(action)) return "EXECUTOR_COMPLETED";
  return "TASK_DISPATCHED";
}

function validateDevelopmentAuthorityBinding(plan: SupervisorRuntimePlan, environment: Readonly<Record<string, string | undefined>>): void {
  const selectedScope = environment.SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE?.trim();
  for (const [taskId, execution] of Object.entries(plan.execution)) {
    const authorityRef = execution.route.authority_ref;
    if (!authorityRef) continue;
    if (!selectedScope || authorityRef !== `DEVSCOPE:${selectedScope}`) {
      throw new Error(`SUPERVISOR_DEVELOPMENT_AUTHORITY_MISMATCH:${taskId}`);
    }
  }
}

function mergeExactPullRequest(root: string, prNumber: number, expectedHead: string): void {
  const repository = repositoryIdentity(root);
  const result = spawnSync("gh", [
    "api", "--method", "PUT", `repos/${repository}/pulls/${prNumber}/merge`,
    "-f", `sha=${expectedHead}`, "-f", "merge_method=merge",
  ], { cwd: root, encoding: "utf8", shell: false, windowsHide: true });
  if (result.error || result.status !== 0) {
    throw new Error(`Cannot merge PR #${prNumber} via api.github.com: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
  }
  let response: unknown;
  try { response = JSON.parse(result.stdout); } catch { response = undefined; }
  const parsed = z.object({ merged: z.boolean(), message: z.string().optional() }).passthrough().safeParse(response);
  if (!parsed.success || !parsed.data.merged) {
    throw new Error(`Cannot merge PR #${prNumber} via api.github.com: ${parsed.success ? parsed.data.message ?? "merge rejected" : "invalid response"}`);
  }
}

function repositoryIdentity(root: string): string {
  const remote = git(["config", "--get", "remote.origin.url"], root);
  const match = remote.replace(/\\/g, "/").match(/(?:github\.com[:/])([^/]+\/[^/]+?)(?:\.git)?$/i);
  if (!match?.[1]) throw new Error("SUPERVISOR_REPOSITORY_IDENTITY_INVALID");
  return match[1];
}

function readBootstrapLedger(root: string): { completed: string[]; ready: string[] } {
  const parsed = z.object({ completed: z.array(taskIdSchema), ready: z.array(taskIdSchema) }).passthrough()
    .parse(JSON.parse(readFileSync(resolve(root, "docs/current/TASK_LEDGER.json"), "utf8")));
  return { completed: parsed.completed, ready: parsed.ready };
}

function readRepositoryAuthority(root: string, taskId: string): AuthorityArtifacts {
  const directory = resolve(root, "docs/evidence/agentfactory", taskId);
  const refs: string[] = [];
  let evidence: AuthorityArtifacts["evidence"] = null;
  if (existsSync(directory)) {
    const accepted = readdirSync(directory).filter((item) => /^attempt-.*\.json$/.test(item)).sort().flatMap((name) => {
      const path = resolve(directory, name);
      const parsed = agentFactoryEvidenceEnvelopeSchema.safeParse(readJson(path));
      return parsed.success && parsed.data.result.status === "DONE" ? [{ value: parsed.data, path }] : [];
    }).sort((left, right) => left.value.result.metrics.attempts - right.value.result.metrics.attempts || left.path.localeCompare(right.path));
    const selected = accepted.at(-1);
    if (selected) {
      evidence = { receipt_id: selected.value.receipt_id, task_id: selected.value.result.task_id, head_commit: selected.value.head_commit, status: "DONE" };
      refs.push(repoRef(root, selected.path));
    }
  }
  const ledgerPath = resolve(directory, "ledger.json");
  const ledgerReceipt = existsSync(ledgerPath) ? ledgerApplicationReceiptSchema.safeParse(readJson(ledgerPath)) : undefined;
  const terminalLedger = ledgerReceipt?.success && ["DONE", "FAILED", "BLOCKED", "NEEDS_DECISION"].includes(ledgerReceipt.data.authoritative_task.state);
  const ledger = terminalLedger ? {
    accepted: ledgerReceipt.data.accepted,
    task_id: ledgerReceipt.data.authoritative_task.task_id,
    state: ledgerReceipt.data.authoritative_task.state as "DONE" | "FAILED" | "BLOCKED" | "NEEDS_DECISION",
    evidence_receipt_id: ledgerReceipt.data.attempts.at(-1)?.evidence_receipt_id ?? null,
  } : null;
  if (ledgerReceipt?.success) refs.push(repoRef(root, ledgerPath));
  const readinessPath = resolve(directory, "readiness.json");
  const readinessReceipt = existsSync(readinessPath) ? readinessRecomputationReceiptSchema.safeParse(readJson(readinessPath)) : undefined;
  const readiness = readinessReceipt?.success ? {
    previous_ready: readinessReceipt.data.previous_ready,
    current_ready: readinessReceipt.data.current_ready,
    newly_ready: readinessReceipt.data.newly_ready,
  } : null;
  if (readinessReceipt?.success) refs.push(repoRef(root, readinessPath));
  return { evidence, ledger, readiness, evidence_refs: refs.sort() };
}

function lifecycle(value: ReturnType<LocalTaskOrchestrator["inspect"]>["snapshot"]["implementationPr"]) {
  const receipt = value?.lifecycle;
  return receipt ? { pr_number: receipt.pr_number, branch: receipt.branch, head_commit: receipt.head_commit, decision: receipt.decision, reason_codes: receipt.reason_codes } : null;
}

function validationState(state: OrchestratorState, verified: boolean): "PASS" | "FAIL" | "REVIEW_REQUIRED" | null {
  if (verified) return "PASS";
  if (["VERIFY_FAILED", "CI_FAILED", "EXECUTOR_FAILED"].includes(state)) return "FAIL";
  if (["ARCHITECTURE_REVIEW_REQUIRED", "REVIEW_REQUIRED", "STATE_REVIEW_REQUIRED"].includes(state)) return "REVIEW_REQUIRED";
  return null;
}

function selectedRoute(route: z.infer<typeof executionRouteSchema>) {
  return route.decision === "SELECTED" ? { executor: route.executor, model: route.model } : null;
}

function taskExecutionState(task: Task): z.infer<typeof executionStateSchema> {
  const states: Record<Task["metadata"]["status"], z.infer<typeof executionStateSchema>> = {
    draft: "DRAFT", ready: "READY", running: "RUNNING", verification: "VERIFICATION", completed: "DONE",
    blocked: "BLOCKED", failed: "FAILED", superseded: "SUPERSEDED",
  };
  return states[task.metadata.status];
}

function persistSequentialReceipt(root: string, receipt: SequentialReceipt): string {
  const content = `${JSON.stringify(receipt, null, 2)}\n`;
  const id = createHash("sha256").update(content).digest("hex");
  const path = resolve(root, "payloads", `AFSEQ-${id}.json`);
  mkdirSync(dirname(path), { recursive: true });
  if (existsSync(path) && readFileSync(path, "utf8") !== content) throw new Error(`SUPERVISOR_PAYLOAD_DIVERGENCE:${id}`);
  if (!existsSync(path)) writeFileSync(path, content, { flag: "wx" });
  return repoRef(process.cwd(), path);
}

function launchDetached(executable: string, args: string[], cwd: string): boolean {
  setImmediate(() => {
    const child = spawn(executable, args, { cwd, detached: true, stdio: "ignore", windowsHide: true, shell: false });
    child.unref();
  });
  return true;
}

function safeOwner(value: string): string {
  const normalized = value.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 128);
  if (!/^[A-Za-z0-9]/.test(normalized)) throw new Error("SUPERVISOR_OWNER_INVALID");
  return normalized;
}

function readJson(path: string): unknown { return JSON.parse(readFileSync(path, "utf8")); }
function repoRef(root: string, path: string): string { return relative(root, path).replaceAll("\\", "/"); }
