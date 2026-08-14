---
id: TASK-036
title: Accept the real-run AgentFactory authority integration design
status: ready
priority: 1
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-010
  - TASK-035
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/adr/ADR-0008-local-task-orchestrator.md
  - docs/adr/ADR-0011-event-driven-local-pipeline-supervisor.md
  - docs/engineering/LOCAL_TASK_ORCHESTRATOR.md
  - docs/engineering/GIT_WORKFLOW.md
  - project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/I2_EXIT_GATE.md
  - tooling/agent-harness/src/supervisor-runtime.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
allowed_paths:
  - docs/adr/ADR-0012-agentfactory-real-run-authority-integration.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/I2_EXIT_GATE.md
  - specs/tasks/TASK-036-AGENTFACTORY-REAL-RUN-AUTHORITY-INTEGRATION-ADR.md
forbidden_paths:
  - tooling/agent-harness/src/**
  - tooling/agent-harness/tests/**
  - specs/contracts/**
  - packages/**
  - apps/**
max_files: 4
validation:
  - npm run verify
---

# TASK-036 — AgentFactory Real-Run Authority Integration ADR

## Objective

Accept the missing architecture decision for materializing and integrating real
AFEV/AFATT, causal ledger and successor-readiness authority during the existing
implementation/state-closure lifecycle, without fabricating evidence or
weakening the accepted sequential coordinator.

## Context

The TASK-010 candidate executed, validated and integrated through implementation
PR #99 and state PR #100. The bootstrap orchestrator reconciles it as `DONE`,
but the Supervisor pipeline terminated `BLOCKED` with `EVIDENCE_MISSING` after
`task:close`. No `docs/evidence/agentfactory/TASK-010` authority exists, so the
I2 coordinator correctly refused to infer AFEV, ledger or readiness from the
bootstrap receipt.

The accepted design defines the deterministic loop but does not decide where
the real AgentFactory authority artifacts enter Git delivery, how their writes
remain append-only/idempotent, or how a restart advances state closure while a
task is bootstrap-completed but not yet dual-authority-reconciled. That is an
architecture boundary and cannot be invented inside a corrective code task.

## Current behavior

`RepositorySequentialAdapter` reads final AgentFactory authority only from
`docs/evidence/agentfactory/<TASK-ID>`, while the real local orchestrator writes
only bootstrap closure evidence. After `task:close` changes the task to
`completed`, the coordinator enters reconciliation, finds no AFEV and stops
before the remaining state-branch actions can be delegated. The Supervisor
persists that deterministic stop as terminal `BLOCKED`.

## Required change

- Add ADR-0012 deciding the exact lifecycle and versioned delivery boundary for
  real AFEV/AFATT, causal ledger and readiness artifacts.
- Define which existing persisted observations are sufficient authority and
  which missing facts must stop fail-closed.
- Preserve the accepted `SequentialPipelineCoordinator`, evidence, ledger,
  readiness, GitHub lifecycle, approval and Supervisor kernel contracts.
- Decide how post-`task:close` state delivery continues without interpreting a
  missing final authority as permission to bypass reconciliation.
- Decide the governed disposition of the terminal TASK-010 pipeline. Terminal
  history must remain immutable; recovery must not rewrite events or claim a
  successful I2 proof retroactively.
- Refine WP-I2-06 and identify the smallest downstream implementation task that
  can be materialized only after this ADR is accepted.

## Inputs / contracts

TASK-010 runtime events and exact PR identities, TASK-035, ADR-0008, ADR-0011,
the I2 sequential definition and the integrated evidence/ledger/readiness
contracts.

## Outputs / contracts

ADR-0012 plus a frozen WP-I2-06 implementation boundary suitable for
rolling-wave materialization of the next task.

## Acceptance criteria

- The decision names one deterministic Git integration point for all required
  real-run AgentFactory authorities.
- The design proves append-only/idempotent writes and exact task, source, head,
  PR and evidence identity binding.
- Bootstrap completion cannot be mistaken for AgentFactory reconciliation.
- State-closure recovery performs at most one safe action per invocation and
  never bypasses coordinator, CI, approval or state-identity gates.
- The terminal TASK-010 pipeline remains preserved as failed proof evidence.
- A new proof may reuse accepted TASK-010 facts only when their exact durable
  identities validate; it may not manufacture missing historical authority.
- I3, TASK-004 execution and parallel scheduling remain prohibited.
- `npm run verify` passes.

## Non-goals

Implement the bridge, change accepted runtime contracts, backfill fabricated
TASK-010 AFEV, execute TASK-004, start I3, add a database/UI/webhook, or weaken
human approval and required CI.

## Evidence expected

ADR diff, explicit alternatives/trade-offs, mapping from the observed
`EVIDENCE_MISSING` stop to the selected lifecycle, and passing repository
validation.

## Escalation

Stop if the selected design requires changing an accepted public contract,
rewriting terminal Supervisor history, treating bootstrap evidence as AFEV, or
executing product work before a new I2 proof is authorized.
