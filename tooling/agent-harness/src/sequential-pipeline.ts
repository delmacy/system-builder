import { z } from "zod";
import { evaluateDagReadiness, type DagGraph } from "./dag.js";
import type { AdvanceResult, OrchestratorState } from "./orchestrator.js";
import { validateTaskCatalog, type Task } from "./task.js";

const taskId = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const sha = z.string().regex(/^[0-9a-f]{40}$/);
const receiptId = z.string().regex(/^(?:AFEV|AFATT|AFEVT)-[0-9a-f]{64}$/);

export const sequentialPlanSchema = z.object({
  schema_version: z.literal(1),
  focus: z.string().min(1),
  milestones: z.array(z.string().min(1)).min(1),
  ordered_task_ids: z.array(taskId).min(1),
}).strict().superRefine((plan, context) => {
  if (new Set(plan.ordered_task_ids).size !== plan.ordered_task_ids.length) {
    context.addIssue({ code: "custom", path: ["ordered_task_ids"], message: "ordered task ids must be unique" });
  }
});

const lifecycleSchema = z.object({
  pr_number: z.number().int().positive(),
  branch: z.string().min(1),
  head_commit: sha,
  decision: z.enum(["PENDING", "BLOCKED", "REVIEW_REQUIRED", "ELIGIBLE"]),
  reason_codes: z.array(z.string()),
}).strict();

const authoritySchema = z.object({
  task_id: taskId,
  agent_state: z.enum(["DRAFT", "READY", "RUNNING", "VERIFICATION", "EVIDENCED", "INTEGRATING", "DONE", "FAILED", "BLOCKED", "NEEDS_DECISION", "SUPERSEDED"]),
  orchestrator_state: z.string().min(1),
  route: z.object({ executor: z.string().min(1), model: z.string().nullable() }).strict().nullable(),
  validation: z.enum(["PASS", "FAIL", "REVIEW_REQUIRED"]).nullable(),
  evidence: z.object({ receipt_id: receiptId, task_id: taskId, head_commit: sha, status: z.enum(["DONE", "FAILED", "BLOCKED", "NEEDS_DECISION"]) }).strict().nullable(),
  ledger: z.object({ accepted: z.boolean(), task_id: taskId, state: z.enum(["DONE", "FAILED", "BLOCKED", "NEEDS_DECISION"]), evidence_receipt_id: receiptId.nullable() }).strict().nullable(),
  implementation_pr: lifecycleSchema.nullable(),
  state_pr: lifecycleSchema.nullable(),
  state_closure_integrated: z.boolean(),
  readiness: z.object({ previous_ready: z.array(taskId), current_ready: z.array(taskId), newly_ready: z.array(taskId) }).strict().nullable(),
  evidence_refs: z.array(z.string().min(1)),
}).strict();

export const sequentialObservationSchema = z.object({
  schema_version: z.literal(1),
  observed_at: z.iso.datetime({ offset: true }),
  bootstrap: z.object({ completed: z.array(taskId), ready: z.array(taskId) }).strict(),
  authorities: z.array(authoritySchema),
}).strict();

const stopReasonSchema = z.enum([
  "PIPELINE_COMPLETE", "DELEGATED", "EXTERNAL_GATE", "DEPENDENCY_BLOCKED", "DOR_NOT_MET",
  "EXECUTION_FAILED", "VALIDATION_FAILED", "EVIDENCE_MISSING", "EVIDENCE_DIVERGENCE",
  "PR_NOT_ELIGIBLE", "STATE_CLOSURE_MISSING", "READINESS_MISSING", "AUTHORITY_DIVERGENCE",
]);

export const sequentialReceiptSchema = z.object({
  schema_version: z.literal(1),
  focus: z.string().min(1),
  selected_task_id: taskId.nullable(),
  selection_reason: z.string().min(1),
  predecessor_gates: z.array(z.object({ task_id: taskId, reconciled: z.boolean() }).strict()),
  delegated: z.object({
    previous_state: z.string(),
    state: z.string(),
    action: z.string(),
    failure: z.object({ code: z.string().min(1), retryable: z.boolean() }).strict().nullable().optional(),
  }).strict().nullable(),
  route: authoritySchema.shape.route,
  validation: authoritySchema.shape.validation,
  evidence_refs: z.array(z.string()),
  implementation_pr: lifecycleSchema.nullable(),
  state_pr: lifecycleSchema.nullable(),
  state_closure_integrated: z.boolean(),
  reconciled: z.boolean(),
  readiness_before: z.array(taskId),
  readiness_after: z.array(taskId),
  stop_reason: stopReasonSchema,
  observed_started_at: z.iso.datetime({ offset: true }),
  observed_finished_at: z.iso.datetime({ offset: true }),
  duration_seconds: z.number().nonnegative(),
}).strict();

export type SequentialPlan = z.infer<typeof sequentialPlanSchema>;
export type SequentialObservation = z.infer<typeof sequentialObservationSchema>;
export type SequentialReceipt = z.infer<typeof sequentialReceiptSchema>;

export interface SequentialPipelineAdapter {
  observe(): unknown;
  advanceTask(taskId: string): AdvanceResult;
}

const externalStops = new Set<OrchestratorState>([
  "PR_OPEN", "CI_PENDING", "REVIEW_REQUIRED", "STATE_CI_PENDING", "STATE_REVIEW_REQUIRED",
  "EXECUTOR_REQUIRED", "ARCHITECTURE_REVIEW_REQUIRED", "BLOCKED", "CI_FAILED", "REVIEW_CHANGES_REQUIRED",
]);

export class SequentialPipelineCoordinator {
  private readonly plan: SequentialPlan;

  constructor(
    plan: unknown,
    private readonly tasks: Task[],
    private readonly graph: DagGraph,
    private readonly adapter: SequentialPipelineAdapter,
    private readonly now: () => string,
  ) {
    this.plan = sequentialPlanSchema.parse(plan);
  }

  advance(): SequentialReceipt {
    const started = this.now();
    validateTaskCatalog(this.tasks);
    const evaluation = evaluateDagReadiness(this.graph);
    const observation = sequentialObservationSchema.parse(this.adapter.observe());
    this.validatePlan();
    const authorities = new Map(observation.authorities.map((item) => [item.task_id, item]));
    const gates: Array<{ task_id: string; reconciled: boolean }> = [];

    for (const [index, id] of this.plan.ordered_task_ids.entries()) {
      const task = this.tasks.find((candidate) => candidate.metadata.id === id)!;
      const authority = authorities.get(id);
      if (observation.bootstrap.completed.includes(id) && this.closurePending(authority)) {
        gates.push({ task_id: id, reconciled: false });
        if (!authority?.implementation_pr || authority.implementation_pr.decision !== "ELIGIBLE") {
          return this.receipt(started, observation, id, gates, authority, null, "PR_NOT_ELIGIBLE", false);
        }
        if (externalStops.has(authority.orchestrator_state as OrchestratorState) && !this.eligibleMergeGate(authority)) {
          return this.receipt(started, observation, id, gates, authority, null, "EXTERNAL_GATE", false);
        }
        const delegated = this.adapter.advanceTask(id);
        return this.receipt(started, observation, id, gates, authority, delegated, "DELEGATED", false);
      }
      const reconciliation = this.reconcile(id, index, observation, authority);
      gates.push({ task_id: id, reconciled: reconciliation.ok });
      if (reconciliation.ok) continue;

      if (reconciliation.reason) {
        return this.receipt(started, observation, id, gates, authority, null, reconciliation.reason, false);
      }
      if (task.metadata.status !== "ready" && task.metadata.status !== "running" && task.metadata.status !== "verification") {
        return this.receipt(started, observation, id, gates, authority, null, "DOR_NOT_MET", false);
      }
      if (index > 0 && !gates[index - 1]?.reconciled) {
        return this.receipt(started, observation, id, gates, authority, null, "DEPENDENCY_BLOCKED", false);
      }
      if (authority && externalStops.has(authority.orchestrator_state as OrchestratorState) && !this.eligibleMergeGate(authority)) {
        return this.receipt(started, observation, id, gates, authority, null, "EXTERNAL_GATE", false);
      }
      if (authority?.orchestrator_state === "VERIFY_FAILED" || authority?.validation === "FAIL") {
        return this.receipt(started, observation, id, gates, authority, null, "VALIDATION_FAILED", false);
      }
      const starting = !authority || authority.orchestrator_state === "READY";
      if (starting && (!observation.bootstrap.ready.includes(id) || !evaluation.ready.includes(id))) {
        return this.receipt(started, observation, id, gates, authority, null, "DEPENDENCY_BLOCKED", false);
      }
      const delegated = this.adapter.advanceTask(id);
      return this.receipt(started, observation, id, gates, authority, delegated, "DELEGATED", false);
    }
    return this.receipt(started, observation, null, gates, undefined, null, "PIPELINE_COMPLETE", true);
  }

  private closurePending(authority: SequentialObservation["authorities"][number] | undefined): boolean {
    return Boolean(authority && ["CLOSED", "STATE_PR_PENDING", "STATE_CI_PENDING", "STATE_REVIEW_REQUIRED", "STATE_MERGED"]
      .includes(authority.orchestrator_state));
  }

  private eligibleMergeGate(authority: SequentialObservation["authorities"][number] | undefined): boolean {
    if (!authority) return false;
    if (authority.orchestrator_state === "REVIEW_REQUIRED") return authority.implementation_pr?.decision === "ELIGIBLE";
    if (authority.orchestrator_state === "STATE_REVIEW_REQUIRED") return authority.state_pr?.decision === "ELIGIBLE";
    return false;
  }

  private validatePlan(): void {
    const byId = new Map(this.tasks.map((task) => [task.metadata.id, task]));
    for (const [index, id] of this.plan.ordered_task_ids.entries()) {
      const task = byId.get(id);
      if (!task) throw new Error(`PIPELINE_TASK_MISSING:${id}`);
      if (!this.plan.milestones.includes(task.metadata.milestone)) throw new Error(`PIPELINE_FOCUS_MISMATCH:${id}`);
      const predecessor = this.plan.ordered_task_ids[index - 1];
      if (predecessor && !task.metadata.depends_on.includes(predecessor)) throw new Error(`PIPELINE_ORDER_NOT_IN_DAG:${predecessor}>${id}`);
    }
  }

  private reconcile(id: string, index: number, observation: SequentialObservation, authority: SequentialObservation["authorities"][number] | undefined): { ok: boolean; reason?: z.infer<typeof stopReasonSchema> } {
    const bootstrapDone = observation.bootstrap.completed.includes(id);
    const agentDone = authority?.agent_state === "DONE";
    if (!bootstrapDone && !agentDone) return { ok: false };
    if (bootstrapDone !== agentDone) return { ok: false, reason: "AUTHORITY_DIVERGENCE" };
    if (!authority?.evidence) return { ok: false, reason: "EVIDENCE_MISSING" };
    if (authority.evidence.task_id !== id || authority.evidence.status !== "DONE") return { ok: false, reason: "EVIDENCE_DIVERGENCE" };
    if (!authority.ledger?.accepted || authority.ledger.task_id !== id || authority.ledger.state !== "DONE" || authority.ledger.evidence_receipt_id !== authority.evidence.receipt_id) {
      return { ok: false, reason: "AUTHORITY_DIVERGENCE" };
    }
    if (!authority.implementation_pr || authority.implementation_pr.decision !== "ELIGIBLE" || authority.implementation_pr.head_commit !== authority.evidence.head_commit) {
      return { ok: false, reason: "PR_NOT_ELIGIBLE" };
    }
    if (!authority.state_pr || authority.state_pr.decision !== "ELIGIBLE") return { ok: false, reason: "PR_NOT_ELIGIBLE" };
    if (!authority.state_closure_integrated || observation.bootstrap.ready.includes(id)) return { ok: false, reason: "STATE_CLOSURE_MISSING" };
    const successor = this.plan.ordered_task_ids[index + 1];
    if (successor && (!authority.readiness || !authority.readiness.current_ready.includes(successor))) return { ok: false, reason: "READINESS_MISSING" };
    return { ok: true };
  }

  private receipt(started: string, observation: SequentialObservation, id: string | null, gates: Array<{ task_id: string; reconciled: boolean }>, authority: SequentialObservation["authorities"][number] | undefined, delegated: AdvanceResult | null, reason: z.infer<typeof stopReasonSchema>, reconciled: boolean): SequentialReceipt {
    const finished = this.now();
    return sequentialReceiptSchema.parse({
      schema_version: 1, focus: this.plan.focus, selected_task_id: id,
      selection_reason: id ? `first unreconciled task in authorized order: ${id}` : "all authorized tasks reconciled",
      predecessor_gates: gates, delegated: delegated ? {
        previous_state: delegated.previousState,
        state: delegated.state,
        action: delegated.action,
        failure: delegated.snapshot?.execution?.lastExecutorResult?.failure
          ? { code: delegated.snapshot.execution.lastExecutorResult.failure.code, retryable: delegated.snapshot.execution.lastExecutorResult.failure.retryable }
          : null,
      } : null,
      route: authority?.route ?? null, validation: authority?.validation ?? null, evidence_refs: authority?.evidence_refs ?? [],
      implementation_pr: authority?.implementation_pr ?? null, state_pr: authority?.state_pr ?? null,
      state_closure_integrated: authority?.state_closure_integrated ?? false, reconciled,
      readiness_before: authority?.readiness?.previous_ready ?? observation.bootstrap.ready,
      readiness_after: authority?.readiness?.current_ready ?? observation.bootstrap.ready,
      stop_reason: reason, observed_started_at: started, observed_finished_at: finished,
      duration_seconds: Math.max(0, (Date.parse(finished) - Date.parse(started)) / 1000),
    });
  }
}
