---
id: TASK-021
title: Implement the AgentFactory ledger state transition engine
status: completed
priority: 45
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-012
  - TASK-019
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - project_docs/execution_governance/CONFIGURATION_MANAGEMENT.md
  - specs/tasks/TASK-021-AGENTFACTORY-LEDGER-STATE-TRANSITION-ENGINE.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/harness.ts
allowed_paths:
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-021-AGENTFACTORY-LEDGER-STATE-TRANSITION-ENGINE.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 7
validation:
  - npm run verify
---

# Objective

Apply legal AgentFactory task-state transitions from verified, identity-bound evidence without corrupting the prior authoritative ledger state.

# Context

WP-I1-10 depends on the TASK-012 task/transition contracts and the actual TASK-019 append-only evidence envelope. TASK-019 produces a schema-validated envelope containing task/WP/source/head identity, independent validation, a content hash and an `ExecutionResult`; it does not mutate task state. This task adds the deterministic internal engine between that accepted evidence and later readiness recomputation.

# Current behavior

The repository validates individual `TaskRecord`, `StateTransition` and evidence objects, but it has no component that checks a requested transition against a legal transition table, verifies the TASK-019 envelope identity/integrity and returns an atomic authoritative-state update. Existing closure tooling is the bootstrap delivery workflow, not the AgentFactory v1 ledger engine.

# Required change

Implement a pure, runtime-validated ledger transition engine. It must consume the current TASK-012 `TaskRecord`, a requested target state/reason, the real TASK-019 evidence envelope and prior append-only attempt records. It must deterministically return either an accepted updated task plus TASK-012 `StateTransition`, or a rejected attempt that preserves the exact prior task state. Define legal state/reason combinations explicitly. Recompute and verify the TASK-019 semantic content hash and bind task ID, WP ID and evidence status before accepting `DONE`.

# Inputs / contracts

TASK-012 `TaskRecord`, `ExecutionState` and `StateTransition`; TASK-019 `AgentFactoryEvidenceEnvelope`; requested target/reason/occurrence time/evidence reference; prior engine attempt records.

# Outputs / contracts

A schema-validated deterministic ledger application receipt containing acceptance/rejection, unchanged or updated authoritative `TaskRecord`, optional accepted `StateTransition`, stable reason codes and append-only transition-attempt evidence.

# Acceptance criteria

- Legal state/reason combinations are explicit and deterministic; unknown or illegal transitions fail closed.
- An accepted transition binds the current task ID/WP ID and produces a valid TASK-012 `StateTransition` with evidence references.
- `DONE` is accepted only from the legal predecessor state when the TASK-019 envelope has valid semantic hash/receipt identity, `PASS` independent validation and `DONE` result for the same task/WP.
- Failed, blocked or review-required evidence cannot claim `DONE`.
- Rejection preserves the prior authoritative `TaskRecord` byte-for-byte in semantic content and appends a stable failed-attempt record explaining the refusal.
- Equivalent inputs produce equivalent receipts apart from the explicitly supplied occurrence time; no filesystem, GitHub or network mutation occurs in the pure engine.
- Tests cover a legal transition, illegal transition, identity/hash mismatch, invalid DONE evidence and prior-state preservation on failure.
- `npm run verify` passes.

# Non-goals

Writing `docs/current/TASK_LEDGER.json`, recomputing successor readiness, orchestrator wiring, PR lifecycle, changing TASK-012/TASK-019 public contracts, migrations, product code or I2 scheduling.

# Evidence expected

Ledger receipt schema/types, explicit transition table, table-driven unit tests with TASK-019-compatible fixtures, stable rejection assertions, changed-file list and passing `npm run verify`.

# Escalation

Stop if implementation requires changing the accepted TASK-012 or TASK-019 contracts, inventing a new architecture boundary, weakening evidence integrity/DoD, or directly mutating the bootstrap ledger.
