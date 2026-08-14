---
id: TASK-032
title: Implement the durable event-driven supervisor kernel
status: completed
priority: 54
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-028
  - TASK-031
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0008-local-task-orchestrator.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/adr/ADR-0011-event-driven-local-pipeline-supervisor.md
  - docs/current/PROJECT_STATE.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md
  - project_docs/execution_governance/**
  - specs/tasks/TASK-032-AGENTFACTORY-EVENT-DRIVEN-SUPERVISOR-KERNEL.md
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/orchestrator.ts
allowed_paths:
  - .gitignore
  - tooling/agent-harness/src/supervisor-contracts.ts
  - tooling/agent-harness/src/supervisor-store.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/tests/pipeline-supervisor.test.ts
  - tooling/agent-harness/policies/SUPERVISOR.json
  - tooling/agent-harness/src/harness.ts
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - specs/tasks/TASK-032-AGENTFACTORY-EVENT-DRIVEN-SUPERVISOR-KERNEL.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - package.json
  - package-lock.json
  - tooling/agent-harness/src/cli.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/human-approval.ts
max_files: 8
validation:
  - npm run verify
---

# Objective

Implement WP-I2-02 as a durable, lease-protected event/outbox and supervisor kernel that performs one restart-safe iteration over an injected existing pipeline decision boundary.

# Rationale

The accepted I2 coordinator is deterministic and resumable but has no durable wakeup/outbox, callback recovery, finite heartbeat, transient retry classification or callback/heartbeat concurrency protection. ADR-0011 defines these as an operational composition rather than a replacement scheduler.

# Context

TASK-028 and TASK-031 are integrated and reconcile as DONE. The real TASK-010 chain is deliberately unstarted. `project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md` refines the approved operations WBS into WP-I2-02 and a later WP-I2-03 runtime bridge.

# Current behavior

Each orchestrator/coordinator invocation exits at external gates and safely resumes from repository evidence, but callers must invoke it manually. No versioned event model, durable local outbox, expiring lease, retry schedule or callback-loss recovery contract exists.

# Required change

Add strict versioned schemas/types for supervisor configuration, events, callback wakeups, leases, retry/circuit state and replayable pipeline projection. Persist each state/event/outbox decision as one atomically published per-event record under an injected runtime root; derive current state by replay and reject divergent duplicate IDs. Add an expiring portable lease with deterministic recovery. Implement classified bounded exponential backoff, max elapsed window and a CLOSED/OPEN/HALF_OPEN provider circuit breaker without magic constants. Implement an `AgentFactorySupervisor` kernel that validates wake identity, acquires one lease, reobserves durable state, delegates at most one iteration to an injected adapter, persists the resulting event before callback delivery, emits attention/terminal events, treats duplicate callbacks/DONE as NO-OP and lets a finite heartbeat recover pending callbacks, stale operations and eligible retries. Keep payloads referential and structured logs deterministic.

# Inputs / contracts

ADR-0011; `SequentialPipelineCoordinator` receipt/stop semantics; existing idempotent orchestrator external-action guards; injected clock/owner/runtime root/callback/iteration adapters; versioned supervisor policy.

# Outputs / contracts

`AgentFactoryEvent`, `SupervisorPipelineProjection`, `SupervisorCallback`, `SupervisorConfig`, durable event/outbox store, expiring lease, retry/circuit evaluation and `AgentFactorySupervisor` one-iteration/start/callback/heartbeat/resume/status kernel APIs.

# Acceptance criteria

- Event identity is deterministic from canonical semantic fields; correlation/causation/attempt/payload reference are explicit.
- State plus outbox intent is durably published before callback invocation; partial temporary files are never replayed.
- Duplicate equivalent events/callbacks are idempotent; divergent reuse of an event ID fails closed.
- Lease acquisition is exclusive, bounded and recoverable after expiry on Windows-compatible filesystem semantics.
- Heartbeat scans only nonterminal local pipelines and produces NO-OP when healthy; it recovers missing callbacks, stale operations and eligible retries without bypassing BLOCKED/NEEDS_DECISION.
- Retryable OpenCode timeout/provider 5xx/transient/callback failures use configured bounded exponential backoff; deterministic validation/scope/architecture/authority/evidence/DAG failures never retry.
- Retry exhaustion emits attention state/event and callback; circuit breaker prevents repeated provider dispatch and recovers through HALF_OPEN.
- Restart reconstructs the same projection exclusively from durable records.
- Callback plus heartbeat race delegates at most one iteration; DONE is never delegated again.
- Tests cover all twenty mandatory mission cases from the approved request, including approval/CI wake events and final pipeline completion, without executing a real product task.
- No polling loop, long-lived process/lock, database, public server, new executor, CLI command or existing I1/I2 contract modification is introduced.
- `npm run verify` passes.

# Non-goals

Concrete repository/GitHub observation bridge, package scripts, Windows scheduler setup, public webhook, background daemon, changing OpenCode/executor contracts, changing governance/approval, executing TASK-010/004/005/006, I3, task parallelism, UI, database or broad metrics platform.

# Evidence expected

Focused schema/store/supervisor tests for the twenty cases, exact runtime ignore behavior, deterministic event/projection fixtures and complete `npm run verify` output.

# Escalation

Stop if the kernel cannot remain an injected composition, if callback would become authority, if durable state cannot precede delivery, if retry classification would weaken a deterministic gate, if existing I1/I2 primitives must change or if files outside scope are required.
