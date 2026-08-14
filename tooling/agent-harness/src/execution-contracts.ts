import { z } from "zod";
import { openCodeModelResolutionSchema } from "./opencode-models.js";

export const executionContractVersion = 1 as const;

const schemaVersionSchema = z.literal(executionContractVersion);
const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringList = z.array(nonEmptyString).min(1);
const taskIdSchema = z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/);
const workPackageIdSchema = z.string().regex(/^WP-[A-Z0-9-]+$/);
const commitSchema = z.string().regex(/^[0-9a-f]{40}$/);
const evidenceRefSchema = nonEmptyString;
const gateIdSchema = z.string().regex(/^GATE-[A-Z0-9-]+$/);
const acceptanceIdSchema = z.string().regex(/^AC-[A-Z0-9-]+$/);
const relativePathSchema = nonEmptyString.refine(
  (path) => !path.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(path) && !path.split(/[\\/]/).includes(".."),
  "path must be repository-relative and cannot contain '..'",
);

export const executionStateSchema = z.enum([
  "DRAFT",
  "READY",
  "RUNNING",
  "VERIFICATION",
  "EVIDENCED",
  "INTEGRATING",
  "DONE",
  "FAILED",
  "BLOCKED",
  "NEEDS_DECISION",
  "SUPERSEDED",
]);

export const dependencyGateTypeSchema = z.enum([
  "REQUIRES",
  "TOOL_REQUIRES",
  "VALIDATION_REQUIRES",
  "CONTRACT_REQUIRES",
  "INFORMS",
]);

export const dependencyGateStatusSchema = z.enum(["UNSATISFIED", "SATISFIED", "WAIVED"]);

const gateWaiverSchema = z.object({
  authority: nonEmptyString,
  rationale: nonEmptyString,
  risk_acceptance: nonEmptyString,
  evidence_ref: evidenceRefSchema,
}).strict();

export const dependencyGateSchema = z.object({
  schema_version: schemaVersionSchema,
  id: gateIdSchema,
  predecessor_id: z.union([taskIdSchema, workPackageIdSchema]),
  successor_id: z.union([taskIdSchema, workPackageIdSchema]),
  type: dependencyGateTypeSchema,
  status: dependencyGateStatusSchema,
  evidence_refs: z.array(evidenceRefSchema),
  waiver: gateWaiverSchema.optional(),
}).strict().superRefine((gate, context) => {
  if (gate.predecessor_id === gate.successor_id) {
    context.addIssue({ code: "custom", path: ["successor_id"], message: "a gate cannot depend on itself" });
  }
  if (gate.status === "SATISFIED" && gate.evidence_refs.length === 0) {
    context.addIssue({ code: "custom", path: ["evidence_refs"], message: "SATISFIED requires evidence" });
  }
  if (gate.status === "WAIVED" && !gate.waiver) {
    context.addIssue({ code: "custom", path: ["waiver"], message: "WAIVED requires explicit waiver evidence" });
  }
  if (gate.status !== "WAIVED" && gate.waiver) {
    context.addIssue({ code: "custom", path: ["waiver"], message: "waiver is valid only for WAIVED gates" });
  }
});

export const riskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const modelTierSchema = z.enum(["T0", "T1", "T2", "T3", "HUMAN_GATE"]);
export const executorAdapterSchema = z.enum(["deterministic", "opencode", "codex", "human"]);

export const executionRouteSchema = z.object({
  risk: riskLevelSchema,
  model_tier: modelTierSchema,
  executor: executorAdapterSchema,
  model: nonEmptyString.nullable(),
  architecture_impact: z.boolean(),
  decision: z.enum(["SELECTED", "ESCALATION_REQUIRED", "BLOCKED"]),
  rationale_code: z.enum([
    "DETERMINISTIC_OPERATION",
    "BOUNDED_LOW_RISK",
    "BOUNDED_MODERATE_RISK",
    "ARCHITECTURE_REVIEW",
    "HIGH_RISK_REVIEW",
    "UNSUPPORTED_ROUTE",
  ]),
}).strict().superRefine((route, context) => {
  const requiresGate = route.risk === "CRITICAL" || route.architecture_impact;
  if (requiresGate && route.model_tier !== "HUMAN_GATE" && route.decision === "SELECTED") {
    context.addIssue({
      code: "custom",
      path: ["decision"],
      message: "critical risk or architecture impact cannot select an ungated route",
    });
  }
  if (route.model_tier === "HUMAN_GATE" && route.executor !== "human") {
    context.addIssue({ code: "custom", path: ["executor"], message: "HUMAN_GATE requires the human executor" });
  }
  if (route.model_tier === "T0" && route.executor !== "deterministic") {
    context.addIssue({ code: "custom", path: ["executor"], message: "T0 requires deterministic execution" });
  }
});

export const taskRecordSchema = z.object({
  schema_version: schemaVersionSchema,
  task_id: taskIdSchema,
  work_package_id: workPackageIdSchema,
  milestone: nonEmptyString,
  title: nonEmptyString,
  state: executionStateSchema,
  route: executionRouteSchema,
  dependency_gates: z.array(dependencyGateSchema),
  context_paths: nonEmptyStringList.pipe(z.array(relativePathSchema)),
  allowed_paths: nonEmptyStringList.pipe(z.array(relativePathSchema)),
  forbidden_paths: z.array(relativePathSchema),
  max_files: z.number().int().positive().max(50),
  validation_commands: nonEmptyStringList,
  acceptance_ids: z.array(acceptanceIdSchema).min(1),
}).strict().superRefine((task, context) => {
  for (const [index, gate] of task.dependency_gates.entries()) {
    if (gate.successor_id !== task.task_id && gate.successor_id !== task.work_package_id) {
      context.addIssue({
        code: "custom",
        path: ["dependency_gates", index, "successor_id"],
        message: "dependency gate successor must identify this task or work package",
      });
    }
  }
});

export const executorRequestSchema = z.object({
  schema_version: schemaVersionSchema,
  task_id: taskIdSchema,
  work_package_id: workPackageIdSchema,
  source_commit: commitSchema,
  attempt: z.number().int().positive(),
  task_pack_path: relativePathSchema,
  route: executionRouteSchema,
  scope: z.object({
    allowed_paths: nonEmptyStringList.pipe(z.array(relativePathSchema)),
    forbidden_paths: z.array(relativePathSchema),
    max_files: z.number().int().positive().max(50),
  }).strict(),
  validation_commands: nonEmptyStringList,
}).strict();

export const executorAdapterResultSchema = z.object({
  schema_version: schemaVersionSchema,
  task_id: taskIdSchema,
  attempt: z.number().int().positive(),
  adapter: executorAdapterSchema,
  status: z.enum(["SUCCEEDED", "FAILED", "TIMED_OUT", "BLOCKED"]),
  exit_code: z.number().int().nullable(),
  stdout: z.string(),
  stderr: z.string(),
  model_resolution: openCodeModelResolutionSchema.nullable().optional(),
  failure: z.object({
    code: nonEmptyString,
    message: nonEmptyString,
    retryable: z.boolean(),
  }).strict().nullable(),
}).strict().superRefine((result, context) => {
  if (result.status === "SUCCEEDED" && (result.exit_code !== 0 || result.failure !== null)) {
    context.addIssue({ code: "custom", path: ["status"], message: "SUCCEEDED requires exit code 0 and no failure" });
  }
  if (result.status !== "SUCCEEDED" && result.failure === null) {
    context.addIssue({ code: "custom", path: ["failure"], message: "non-success result requires failure metadata" });
  }
});

const validationResultSchema = z.object({
  command: nonEmptyString,
  status: z.enum(["PASS", "FAIL", "NOT_RUN"]),
  evidence: nonEmptyString,
}).strict();

const acceptanceResultSchema = z.object({
  id: acceptanceIdSchema,
  status: z.enum(["PASS", "FAIL"]),
  evidence: nonEmptyString,
}).strict();

export const executionResultSchema = z.object({
  schema_version: schemaVersionSchema,
  task_id: taskIdSchema,
  work_package_id: workPackageIdSchema,
  source_commit: commitSchema,
  executor: z.object({
    adapter: executorAdapterSchema,
    model: nonEmptyString.nullable(),
  }).strict(),
  status: z.enum(["DONE", "FAILED", "BLOCKED", "NEEDS_DECISION"]),
  changed_files: z.array(relativePathSchema),
  tests: z.array(validationResultSchema),
  acceptance: z.array(acceptanceResultSchema),
  contracts_changed: z.array(relativePathSchema),
  migrations_changed: z.array(relativePathSchema),
  risks_discovered: z.array(nonEmptyString),
  issues_discovered: z.array(nonEmptyString),
  change_requests: z.array(nonEmptyString),
  follow_up_candidates: z.array(nonEmptyString),
  dependency_gates_satisfied: z.array(gateIdSchema),
  dependency_gates_blocked: z.array(gateIdSchema),
  dag_effects: z.array(nonEmptyString),
  metrics: z.object({
    attempts: z.number().int().positive(),
    execution_duration_seconds: z.number().nonnegative().nullable(),
    review_duration_seconds: z.number().nonnegative().nullable(),
    token_or_provider_cost: z.number().nonnegative().nullable(),
  }).strict(),
  notes: z.string(),
}).strict().superRefine((result, context) => {
  if (result.status !== "DONE") return;
  if (result.tests.length === 0 || result.tests.some((test) => test.status !== "PASS")) {
    context.addIssue({ code: "custom", path: ["tests"], message: "DONE requires passing validation evidence" });
  }
  if (result.acceptance.length === 0 || result.acceptance.some((item) => item.status !== "PASS")) {
    context.addIssue({ code: "custom", path: ["acceptance"], message: "DONE requires passing acceptance evidence" });
  }
  if (result.dependency_gates_blocked.length > 0) {
    context.addIssue({ code: "custom", path: ["dependency_gates_blocked"], message: "DONE cannot retain blocked gates" });
  }
});

export const stateTransitionSchema = z.object({
  schema_version: schemaVersionSchema,
  task_id: taskIdSchema,
  from: executionStateSchema,
  to: executionStateSchema,
  reason_code: z.enum([
    "TASK_APPROVED",
    "EXECUTION_STARTED",
    "EXECUTOR_COMPLETED",
    "VALIDATION_PASSED",
    "VALIDATION_FAILED",
    "EVIDENCE_ACCEPTED",
    "INTEGRATION_STARTED",
    "INTEGRATION_ACCEPTED",
    "DEPENDENCY_BLOCKED",
    "GOVERNANCE_DECISION_REQUIRED",
    "TASK_SUPERSEDED",
  ]),
  occurred_at: z.iso.datetime({ offset: true }),
  evidence_refs: z.array(evidenceRefSchema).min(1),
}).strict().refine((transition) => transition.from !== transition.to, {
  path: ["to"],
  message: "state transition must change state",
});

export type ExecutionState = z.infer<typeof executionStateSchema>;
export type DependencyGate = z.infer<typeof dependencyGateSchema>;
export type ExecutionRoute = z.infer<typeof executionRouteSchema>;
export type TaskRecord = z.infer<typeof taskRecordSchema>;
export type ExecutorRequest = z.infer<typeof executorRequestSchema>;
export type ExecutorAdapterResult = z.infer<typeof executorAdapterResultSchema>;
export type ExecutionResult = z.infer<typeof executionResultSchema>;
export type StateTransition = z.infer<typeof stateTransitionSchema>;
