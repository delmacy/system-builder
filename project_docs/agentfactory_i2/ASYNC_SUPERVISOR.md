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
status: READY as TASK-034
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

`TASK-028 + TASK-031 -> WP-I2-02/TASK-032 -> WP-I2-03/TASK-033 -> WP-I2-04/TASK-034 -> supervisor readiness reassessment -> TASK-010 candidate`

The earlier supplemental GO is superseded by the owner-directed dynamic-model corrective gate. TASK-010 remains prohibited until TASK-034 is integrated, state-closed and readiness is reassessed.
