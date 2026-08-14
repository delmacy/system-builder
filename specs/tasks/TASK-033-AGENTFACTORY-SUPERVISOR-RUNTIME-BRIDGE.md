---
id: TASK-033
title: Bind the supervisor to the local sequential runtime
status: ready
priority: 56
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-032
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0008-local-task-orchestrator.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/adr/ADR-0011-event-driven-local-pipeline-supervisor.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md
  - project_docs/execution_governance/**
  - specs/tasks/TASK-033-AGENTFACTORY-SUPERVISOR-RUNTIME-BRIDGE.md
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/src/supervisor-contracts.ts
  - tooling/agent-harness/src/supervisor-store.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/task.ts
  - tooling/agent-harness/src/dag.ts
allowed_paths:
  - tooling/agent-harness/src/supervisor-runtime.ts
  - tooling/agent-harness/src/supervisor-cli.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/supervisor-runtime.test.ts
  - package.json
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/SUPERVISOR_OPERATIONS_WINDOWS.md
  - specs/tasks/TASK-033-AGENTFACTORY-SUPERVISOR-RUNTIME-BRIDGE.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - docs/evidence/**
  - package-lock.json
  - tooling/agent-harness/policies/**
  - tooling/agent-harness/src/cli.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/src/supervisor-contracts.ts
  - tooling/agent-harness/src/supervisor-store.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
max_files: 8
validation:
  - npm run verify
---

# Objective

Implement WP-I2-03 by binding the integrated supervisor kernel to the real repository task catalog, dependency graph, `SequentialPipelineCoordinator`, `LocalTaskOrchestrator` and `LocalHarnessAdapter`, then expose finite Windows-compatible start, status, callback, heartbeat and resume commands.

# Rationale

TASK-032 deliberately stopped at injected boundaries. The accepted kernel cannot operate the real local pipeline until a production adapter reobserves repository/GitHub facts, delegates one coordinator/orchestrator transition, maps the receipt into a supervisor event and delivers local wakeups without retaining a process or treating a callback as authority.

# Context

TASK-032 is integrated and state-closed. Its actual interface consists of `AgentFactorySupervisor`, `DurableSupervisorStore`, `SupervisorIterationAdapter` and `SupervisorCallbackTransport`; each public method is finite and lease-protected. The I2 candidate remains prohibited and TASK-010 has no branch, context pack, evidence or PR.

# Current behavior

The repository has a pure sequential coordinator and a real single-task orchestrator, but no production `SequentialPipelineAdapter`, supervisor iteration mapping, callback launcher, command entry point or Windows operating procedure. The existing global task CLI must not be overloaded with pipeline policy.

# Required change

Add a runtime composition module that accepts a strict explicit plan, derives a DAG from the real task catalog and completed-state evidence, creates one `LocalHarnessAdapter`/`LocalTaskOrchestrator`, and exposes a `SequentialPipelineAdapter` whose observation is built only from durable repository, local harness and GitHub facts. Missing AFEV/ledger/readiness authority must remain null and fail closed; the bridge must never synthesize a successful authority from task status alone. Map exactly one coordinator receipt to one supervisor iteration result with stable event/state/failure classification and payload reference. Add a replaceable local callback transport that launches one finite callback invocation only after durable event publication; injected process launching must make command tests deterministic. Add a dedicated CLI that validates arguments and an explicit JSON plan path, uses `.agent/runtime` plus the accepted supervisor policy, emits one JSON result, and terminates after `start`, `status`, `callback`, `heartbeat` or `resume`. Add matching `pipeline:*` package scripts and a Windows guide including PowerShell commands and a Task Scheduler heartbeat invocation. Tests must use temporary repositories/adapters and a non-product plan; no command or test may select or advance TASK-010.

# Inputs / contracts

Integrated TASK-032 supervisor APIs; TASK-028 sequential plan/observation/receipt schemas; `LocalTaskOrchestrator.inspect/advance`; `LocalHarnessAdapter`; task catalog and dependency metadata; bootstrap ledger/evidence and exact GitHub lifecycle observations; `SUPERVISOR.json`; injected clock/process launcher/runtime root.

# Outputs / contracts

Concrete local sequential observation/delegation adapter, supervisor receipt-to-event mapper, local callback transport, finite supervisor runtime factory and CLI; `pipeline:start`, `pipeline:status`, `pipeline:callback`, `pipeline:heartbeat`, `pipeline:resume`; reproducible Windows operations guide.

# Acceptance criteria

- The production bridge loads an explicit focus/milestone/order plan, the real task catalog and a derived dependency graph; unrelated globally READY tasks are not selectable.
- Every invocation reobserves durable repository/local/GitHub state and delegates at most one coordinator/orchestrator transition.
- Repository status alone never fabricates AFEV, accepted ledger, readiness or eligible PR authority; missing/divergent facts stop with a stable blocked/decision result.
- Coordinator stop reasons map deterministically to supervisor progress, external-wait, failure, attention or completion events without weakening approval, CI, validation or state-closure gates.
- Local callback delivery occurs after the kernel's durable append, starts only one finite child invocation and is injectable in tests; callback payload is only a wake hint.
- `start`, `status`, `callback`, `heartbeat` and `resume` validate identities/paths, print structured JSON and exit; no polling loop, daemon or long-lived lock is introduced.
- Heartbeat performs one recovery scan, is a healthy NO-OP, and has an exact Windows Task Scheduler command documented.
- Runtime restart/replay and duplicate callback behavior remain those proven by TASK-032.
- Integration and command smoke tests use temporary/non-product fixtures and prove TASK-010 has no branch, prepared context, evidence or PR side effect.
- `npm run verify` passes.

# Non-goals

Executing TASK-010/004/005/006, public webhook/listener, background service framework, new executor, approval-policy changes, changes to accepted supervisor/coordinator/orchestrator contracts, I3, parallel execution, database, UI or dashboard.

# Evidence expected

Runtime bridge integration tests, CLI/process-launch smoke tests, exact Windows commands, explicit proof of one-action/finite exit and no TASK-010 artifacts, exact changed-file list and full `npm run verify` output.

# Escalation

Stop if the bridge would need to invent completion authority, modify an accepted I1/I2 contract, bypass signed approval or required checks, run a persistent scheduler, execute product work or touch a path outside this contract. Record any missing durable authority as a readiness finding for a separately governed corrective task.
