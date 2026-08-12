# I1 WBS Dictionary

Each Work Package below must be decomposed into implementation tasks only after this planning package is accepted.

## WP-I1-01 Execution data contracts
Objective: create the stable machine boundary for AgentFactory v1.
Inputs: execution-governance schemas/policies; existing task specs/ledger/DAG semantics.
Outputs: TaskRecord, DependencyGate, ExecutionResult and StateTransition schemas/types with validation fixtures.
Acceptance: schemas validate deterministically; unknown/invalid states and missing mandatory traceability fail closed.
Predecessors: governance package merged.

## WP-I1-02 DAG/READY evaluator
Objective: compute readiness without LLM reasoning.
Inputs: task/WP nodes and dependency gates.
Outputs: DAG validator, topological order and READY queue result.
Acceptance: missing node/cycle/unsatisfied mandatory gate blocks; INFORMS does not block; CONTRACT_REQUIRES can use explicit contract gate.
Predecessors: WP-I1-01.

## WP-I1-03 Task Pack builder
Objective: transform one READY task into deterministic executor context.
Inputs: TaskRecord, authoritative context references, policies.
Outputs: generated task pack directory/manifest.
Acceptance: context and path scope are bounded; task pack is reproducible from same inputs.
Predecessors: WP-I1-01, WP-I1-02.

## WP-I1-04 Model Router v1
Objective: select configured model/executor tier from task metadata.
Outputs: routing decision with rationale code and escalation state.
Acceptance: deterministic mapping; critical/unsupported route blocks rather than defaults downward.
Predecessors: WP-I1-01.

## WP-I1-05 OpenCode adapter hardening
Objective: reliably invoke OpenCode noninteractively.
Acceptance: exact argument order/model/task file usage tested; timeout/retry bounded; nonzero exit captured; no hidden fallback.
Predecessors: existing harness and TASK-011 correction integrated/available.

## WP-I1-06 Execution harness enforcement
Objective: protect repository/task boundary during execution.
Acceptance: changes outside allowed paths fail validation; clean start required; branch/workspace identity captured.
Predecessors: WP-I1-03, WP-I1-05.

## WP-I1-07 Independent validation gate
Objective: independently determine whether generated work meets task contract.
Acceptance: required commands run after executor; missing/modified required evaluator detected; acceptance evidence generated.
Predecessors: WP-I1-06.

## WP-I1-08 Evidence writer
Objective: persist machine-readable execution evidence.
Acceptance: receipt conforms to governance protocol and references source/head/task/WP/tests/gates.
Predecessors: WP-I1-01, WP-I1-07.

## WP-I1-09 GitHub lifecycle adapter
Objective: carry accepted branch work through PR/check lifecycle.
Acceptance: branch/PR identity traceable; CI status read; no merge on failed required checks.
Predecessors: WP-I1-06, WP-I1-07.

## WP-I1-10 Ledger/state transition engine
Objective: apply legal task transitions from verified events.
Acceptance: illegal transitions fail; DONE requires validated evidence; failures preserve prior authoritative state plus attempt evidence.
Predecessors: WP-I1-01, WP-I1-08.

## WP-I1-11 Recompute successor readiness
Objective: consume newly satisfied gates and expose next READY set.
Acceptance: only affected paths change; unrelated branches remain available; result deterministic.
Predecessors: WP-I1-02, WP-I1-10.

## WP-I1-12 End-to-end proof
Objective: prove I1 with one representative bounded task.
Acceptance: READY -> execution -> validation -> evidence -> PR/check/accepted integration state -> DONE -> successor readiness recomputed; failure path also tested safely.
Predecessors: WP-I1-03 through WP-I1-11 as applicable.
