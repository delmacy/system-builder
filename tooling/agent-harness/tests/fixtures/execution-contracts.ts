import type {
  DependencyGate,
  ExecutionResult,
  ExecutorAdapterResult,
  ExecutorRequest,
  StateTransition,
  TaskRecord,
} from "../../src/execution-contracts.js";

export const satisfiedDependencyGate: DependencyGate = {
  schema_version: 1,
  id: "GATE-TASK-009-COMPLETED",
  predecessor_id: "TASK-009",
  successor_id: "TASK-012",
  type: "REQUIRES",
  status: "SATISFIED",
  evidence_refs: ["EVIDENCE-TASK-009"],
};

export const selectedRoute = {
  risk: "MEDIUM",
  model_tier: "T2",
  executor: "codex",
  model: "gpt-5",
  architecture_impact: false,
  decision: "SELECTED",
  rationale_code: "BOUNDED_MODERATE_RISK",
} as const;

export const validTaskRecord: TaskRecord = {
  schema_version: 1,
  task_id: "TASK-012",
  work_package_id: "WP-I1-01",
  milestone: "I1",
  title: "Implement AgentFactory execution contracts",
  state: "READY",
  route: selectedRoute,
  dependency_gates: [satisfiedDependencyGate],
  context_paths: ["specs/tasks/TASK-012-AGENTFACTORY-EXECUTION-CONTRACTS.md"],
  allowed_paths: ["tooling/agent-harness/**"],
  forbidden_paths: ["packages/**"],
  max_files: 12,
  validation_commands: ["npm run verify"],
  acceptance_ids: ["AC-I1-CONTRACTS"],
};

export const validExecutorRequest: ExecutorRequest = {
  schema_version: 1,
  task_id: "TASK-012",
  work_package_id: "WP-I1-01",
  source_commit: "9e031d4920b977a739d33cb863458328734f18fe",
  attempt: 1,
  task_pack_path: ".agent/context/TASK-012/TASK_PACK.md",
  route: selectedRoute,
  scope: {
    allowed_paths: ["tooling/agent-harness/**"],
    forbidden_paths: ["packages/**"],
    max_files: 12,
  },
  validation_commands: ["npm run verify"],
};

export const validAdapterResult: ExecutorAdapterResult = {
  schema_version: 1,
  task_id: "TASK-012",
  attempt: 1,
  adapter: "codex",
  status: "SUCCEEDED",
  exit_code: 0,
  stdout: "implementation complete",
  stderr: "",
  failure: null,
};

export const validExecutionResult: ExecutionResult = {
  schema_version: 1,
  task_id: "TASK-012",
  work_package_id: "WP-I1-01",
  source_commit: "9e031d4920b977a739d33cb863458328734f18fe",
  executor: { adapter: "codex", model: "gpt-5" },
  status: "DONE",
  changed_files: ["tooling/agent-harness/src/execution-contracts.ts"],
  tests: [{ command: "npm run verify", status: "PASS", evidence: "receipt:task-012" }],
  acceptance: [{ id: "AC-I1-CONTRACTS", status: "PASS", evidence: "unit tests" }],
  contracts_changed: ["tooling/agent-harness/src/execution-contracts.ts"],
  migrations_changed: [],
  risks_discovered: [],
  issues_discovered: [],
  change_requests: [],
  follow_up_candidates: [],
  dependency_gates_satisfied: ["GATE-TASK-009-COMPLETED"],
  dependency_gates_blocked: [],
  dag_effects: ["TASK-013 and TASK-014 may be reevaluated after integration"],
  metrics: {
    attempts: 1,
    execution_duration_seconds: 60,
    review_duration_seconds: null,
    token_or_provider_cost: null,
  },
  notes: "Deterministic fixture",
};

export const validStateTransition: StateTransition = {
  schema_version: 1,
  task_id: "TASK-012",
  from: "VERIFICATION",
  to: "EVIDENCED",
  reason_code: "VALIDATION_PASSED",
  occurred_at: "2026-08-12T23:30:00.000Z",
  evidence_refs: ["EVIDENCE-TASK-012"],
};
