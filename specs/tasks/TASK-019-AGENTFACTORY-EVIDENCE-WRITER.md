---
id: TASK-019
title: Implement the AgentFactory evidence writer
status: completed
priority: 43
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-012
  - TASK-018
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_ignition/10-evidence-engine/README.md
  - project_docs/agentfactory_ignition/10-evidence-engine/scope/README.md
  - project_docs/agentfactory_ignition/10-evidence-engine/WBS.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - project_docs/execution_governance/CONFIGURATION_MANAGEMENT.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-019-AGENTFACTORY-EVIDENCE-WRITER.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
allowed_paths:
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-019-AGENTFACTORY-EVIDENCE-WRITER.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 9
validation:
  - npm run verify
---

# Objective

Persist an append-only, machine-readable AgentFactory execution receipt from accepted execution and validation evidence.

# Context

TASK-012 defines the execution-result contract, TASK-017 records bounded execution identity/result, and TASK-018 emits an independent validation-gate receipt. WP-I1-08 can now compose those actual outputs into durable evidence without reconstructing chat history or trusting executor prose.

# Current behavior

The harness writes a task-scoped verification JSON during closure, but it is a mutable summary format without a versioned execution-result payload, work-package traceability, validation-gate detail, explicit acceptance/gate inputs, or append-only attempt identity.

# Required change

Add a deterministic evidence writer that accepts TASK-017 completion data, a non-failing TASK-018 receipt, explicit acceptance/gate/risk/change inputs and Git source/head identity. Build and validate a TASK-012 `ExecutionResult`, wrap it with the execution/validation provenance required by governance, derive a stable receipt ID/hash and persist it append-only. Integrate the writer as an available harness/runtime closure path while preserving the current manual fallback until a full AgentFactory execution receipt exists.

# Inputs / contracts

TASK-012 `ExecutionResult`, TASK-017 boundary/completion, TASK-018 validation receipt, explicit acceptance results and dependency-gate effects, source/head commits, changed-file fingerprint and bounded metrics/issues/follow-ups.

# Outputs / contracts

A runtime-validated evidence envelope and deterministic JSON payload stored under a task/attempt-specific version-controlled path, plus a task-summary reference usable by later ledger and GitHub lifecycle work.

# Acceptance criteria

- `DONE` evidence is impossible without an accepted execution boundary, `PASS` or explicitly review-required validation, passing command results and explicit passing acceptance entries.
- Task, WP, source commit, head commit, attempt, changed files and executor/model identities agree across all inputs or writing fails closed.
- The embedded payload validates against TASK-012 `ExecutionResult`; tests, acceptance, satisfied/blocked gates, risks, issues, changes, follow-ups and metrics remain machine-readable.
- Receipt JSON and ID/hash are deterministic for identical semantic inputs; volatile write time is excluded from the content hash.
- Persistence is append-only: an identical receipt is idempotent, while different content cannot overwrite an existing receipt path.
- No secrets, raw chat history or unbounded stdout/stderr are written to durable evidence.
- Existing task closure remains compatible when no complete AgentFactory receipt is available.
- Tests cover deterministic success, missing acceptance/failed validation, identity mismatch, idempotent write and overwrite refusal.
- `npm run verify` passes.

# Non-goals

GitHub PR/check operations, merge authority, ledger mutation, successor readiness, acceptance-criteria generation, product code or UI.

# Evidence expected

Evidence envelope schema/types, deterministic composition and append-only persistence tests, closure integration coverage, changed files and passing `npm run verify`.

# Escalation

Stop if implementation requires weakening TASK-012/TASK-018 semantics, inventing acceptance results, overwriting historical evidence, persisting secrets/chat content or changing product/architecture boundaries.
