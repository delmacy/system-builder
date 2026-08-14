# I2 Supplemental Operational Slice — Event-Driven Supervisor

## Change record

```yaml
change:
  id: CHG-AF-2026-08-13-01
  class: SCOPE_CHANGE
  discovered_by: owner
  affected_requirements:
    - I2 local sequential operation
  affected_wps:
    - WP-AF-16
    - WP-I2-02
    - WP-I2-03
  affected_contracts:
    - AgentFactoryEvent
    - SupervisorPipelineProjection
    - SupervisorCallback
    - SupervisorConfig
  dag_impact:
    - TASK-028 and TASK-031 precede WP-I2-02
    - WP-I2-02 precedes WP-I2-03
    - WP-I2-03 integration and closure precede the real I2 candidate run
  risk_impact: high; local execution control, concurrency and retry boundary
  decision: APPROVED
  approval_evidence: owner instruction plus ADR-0011; implementation still requires normal signed PR/SHA governance
```

## WP-I2-04 — Dynamic OpenCode model discovery and selection

```yaml
work_package: WP-I2-04
parent_wbs: 16.2
name: Dynamic OpenCode model discovery and selection
status: COMPLETED as TASK-034
objective: Replace the manual exact OPENCODE_MODEL prerequisite with validated, deterministic free-model discovery from the OpenCode Zen catalog.
in_scope:
  - normalized catalog, selector and resolution contracts
  - injectable Zen catalog client
  - deterministic free-only selector and validated explicit override
  - atomic runtime TTL cache
  - existing Supervisor retry classification bridge
  - hermetic executor/runtime tests and Windows plan update
out_of_scope:
  - paid-model price inference or fallback
  - router/executor rewrite
  - secrets, database, dashboard, I3 or task parallelism
inputs:
  - integrated WP-I2-03 runtime bridge
  - OpenCode executor and execution attempt receipt
  - existing Supervisor retry policy
outputs:
  - OpenCodeModelResolver and catalog client
  - selector-capable strict runtime plan
  - recorded concrete model resolution
predecessors:
  - WP-I2-03
downstream_consumers:
  - supplemental Supervisor readiness reassessment
  - TASK-010 candidate plan
acceptance_criteria:
  - no normal OPENCODE_MODEL prerequisite remains
  - free-only policy never selects paid/unknown models
  - selection and tests are deterministic and environment-hermetic
  - transient catalog failures use the existing retry engine
  - TASK-010 remains unstarted
required_evidence:
  - twenty focused hermetic tests
  - npm run verify with OPENCODE_MODEL absent and present
  - post-integration readiness reassessment
notes:
  - The final selector is stored beside the stable ExecutionRoute in each Supervisor execution entry.
  - Free detection prefers an official boolean when present and otherwise uses only the tested -free suffix heuristic.
  - The runtime uses the existing Supervisor retry engine and persists the selected concrete ID in the execution attempt journal.
```

## WP-I2-05 — OpenCode provider-qualified CLI model identity

```yaml
work_package: WP-I2-05
parent_wbs: 16.2
name: OpenCode provider-qualified CLI model identity
status: READY as TASK-035
objective: Translate a validated raw Zen catalog ID to the provider-qualified model identity required by the OpenCode CLI, only at the invocation boundary.
in_scope:
  - provider qualification at the OpenCode CLI argument boundary
  - regression proof for CLI arguments and unchanged resolution receipt
  - preservation of legacy explicit non-resolver behavior
out_of_scope:
  - catalog, selector, cache, retry, routing or Supervisor contract changes
  - TASK-010 product implementation
inputs:
  - integrated TASK-034 model resolution
  - first real TASK-010 executor failure receipt
outputs:
  - exact `opencode/<catalog-id>` dynamic CLI argument
  - unchanged raw catalog ID in model-resolution evidence
predecessors:
  - WP-I2-04
downstream_consumers:
  - preserved TASK-010 candidate pipeline
acceptance_criteria:
  - OpenCode CLI accepts the provider-qualified selected model
  - qualification occurs once at the CLI boundary
  - TASK-010 is not executed during the correction
required_evidence:
  - focused regression tests
  - npm run verify
  - real candidate retry after integration
```

## WP-I2-06 — Real-run AgentFactory authority integration

```yaml
work_package: WP-I2-06
parent_wbs: 16.2
name: Real-run AgentFactory authority integration
status: READY as TASK-036 architecture decision
objective: Integrate real AFEV/AFATT, causal ledger and readiness authority into the existing governed Git lifecycle so the sequential coordinator can reconcile actual repository tasks.
in_scope:
  - architecture decision for the versioned authority integration point
  - exact binding to persisted execution, validation, Git and PR facts
  - append-only and restart-safe authority materialization
  - bounded continuation through bootstrap state closure
  - fresh post-correction proof and terminal-run disposition
out_of_scope:
  - fabricated TASK-010 authority or rewritten terminal events
  - weakened coordinator/evidence/ledger/readiness/approval contracts
  - TASK-004 execution before a fresh proof authorization
  - I3, parallelism, database, UI or public webhook
inputs:
  - integrated TASK-035 CLI-boundary correction
  - accepted TASK-010 implementation and bootstrap state closure
  - preserved TASK-010 Supervisor EVIDENCE_MISSING terminal run
  - integrated I1 evidence, causal ledger and readiness interfaces
outputs:
  - ADR-0012 authority integration decision
  - bounded downstream implementation task contract
predecessors:
  - WP-I2-05
  - WP-FH-01/TASK-010 accepted bootstrap lifecycle
downstream_consumers:
  - fresh I2 authority reconciliation proof
  - authorization decision for TASK-004 -> TASK-005
acceptance_criteria:
  - one deterministic versioned integration point is accepted
  - no bootstrap receipt is treated as AgentFactory evidence
  - one-action restart/resume semantics are preserved
  - terminal history remains immutable
required_evidence:
  - accepted ADR and alternatives
  - focused implementation proof after ADR integration
  - npm run verify
  - fresh I2 gate reassessment
```

## WP-I2-02 — Durable supervisor kernel

```yaml
work_package: WP-I2-02
parent_wbs: 16.3
name: Durable event-driven supervisor kernel
status: NOW
objective: Persist replayable pipeline events/outbox state and execute one lease-protected, retry-aware supervisor iteration without duplicating existing I1/I2 decisions.
in_scope:
  - versioned event, callback, pipeline projection and configuration contracts
  - atomic per-event durable store under ignored runtime state
  - pending callback/outbox observation
  - expiring Windows-compatible filesystem lease
  - retry/backoff classification and small circuit breaker
  - callback/heartbeat/restart/idempotency behavior through an injected iteration adapter
out_of_scope:
  - real product pipeline execution
  - CLI/package scripts and Windows scheduler instructions
  - public webhook infrastructure
  - database, UI, I3 or task parallelism
inputs:
  - ADR-0008
  - ADR-0010
  - ADR-0011
  - TASK-028 SequentialPipelineCoordinator
outputs:
  - AgentFactoryEvent and operational projection contracts
  - durable local event/outbox store
  - lease/retry/circuit primitives
  - AgentFactorySupervisor kernel
predecessors:
  - TASK-028
  - TASK-031
interfaces:
  - SequentialPipelineAdapter
  - SupervisorCallbackTransport
  - SupervisorIterationAdapter
downstream_consumers:
  - WP-I2-03 local runtime bridge
acceptance_criteria:
  - all twenty mandatory recovery/idempotency cases pass deterministically
  - no callback precedes durable event persistence
  - no continuous polling or long-lived lock exists
  - runtime state is ignored by Git and replayable after process restart
required_evidence:
  - focused contract/store/supervisor tests
  - npm run verify
risks:
  - partial filesystem writes
  - callback/heartbeat race
  - unsafe retry classification
  - stale lease takeover
notes:
  - This is a bounded prerequisite slice, not completion of all WP-AF-16 operations.
```

## WP-I2-03 — Local runtime bridge and Windows operation

```yaml
work_package: WP-I2-03
parent_wbs: 16.2
name: Local supervisor runtime bridge and commands
status: COMPLETED as TASK-033
objective: Bind the accepted supervisor kernel to the real sequential coordinator/orchestrator and expose finite start, callback, heartbeat, resume and status commands on Windows.
in_scope:
  - concrete repository/GitHub observation bridge
  - local callback transport
  - finite CLI commands and package scripts
  - safe configured heartbeat invocation
  - Windows operating instructions
  - integration proof without executing TASK-010
out_of_scope:
  - public webhook listener
  - background service framework
  - new executor or changed approval policy
  - I3, parallel task execution, database or dashboard
inputs:
  - integrated WP-I2-02 outputs
  - SequentialPipelineCoordinator
  - LocalTaskOrchestrator and LocalHarnessAdapter
outputs:
  - pipeline:start/status/callback/heartbeat/resume commands
  - local callback bridge
  - Windows startup/heartbeat procedure
predecessors:
  - WP-I2-02
interfaces:
  - AgentFactorySupervisor
  - SequentialPipelineAdapter
  - LocalTaskOrchestrator
downstream_consumers:
  - I2 candidate execution authorization
acceptance_criteria:
  - commands reobserve durable state and execute at most one safe iteration
  - external waits terminate the process
  - heartbeat is recovery-only and healthy state is NO-OP
  - clean-checkout Windows procedure is reproducible
  - TASK-010 remains unstarted during proof
required_evidence:
  - runtime bridge integration tests
  - command smoke tests
  - npm run verify
  - post-integration readiness reassessment
risks:
  - stale repository observations
  - accidental product dispatch during proof
  - Windows process/path incompatibility
notes:
  - Materialize its task only from the actual integrated WP-I2-02 interface.
  - Materialized as TASK-033 after TASK-032 implementation and state closure integrated on main.
  - TASK-033 binds the kernel through a strict external runtime plan, task-spec-derived DAG, repository/GitHub observation adapter and finite local callback process.
  - Windows commands and the recovery-only Task Scheduler heartbeat are defined in `SUPERVISOR_OPERATIONS_WINDOWS.md`.
  - TASK-033 implementation/state closure and the supplemental Supervisor readiness GO are integrated prerequisites for the TASK-010 candidate.
```

## Supplemental DAG

`TASK-028 + TASK-031 -> WP-I2-02/TASK-032 -> WP-I2-03/TASK-033 -> WP-I2-04/TASK-034 -> TASK-010 CLI finding -> WP-I2-05/TASK-035 -> TASK-010 real candidate -> WP-I2-06/TASK-036 ADR -> bounded authority integration implementation -> fresh I2 proof`

TASK-034 and TASK-035 are integrated and state-closed. TASK-010 subsequently completed its bootstrap implementation and state lifecycle, but the preserved Supervisor run stopped `EVIDENCE_MISSING` because the real AFEV/ledger/readiness integration point is not defined. The I2 Exit Gate is NO-GO pending WP-I2-06; TASK-004 and I3 remain prohibited.
