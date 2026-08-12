---
id: TASK-012
title: Implement AgentFactory execution contracts
status: ready
priority: 36
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-009
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/README.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - specs/tasks/TASK-012-AGENTFACTORY-EXECUTION-CONTRACTS.md
  - tooling/agent-harness/src/task.ts
allowed_paths:
  - tooling/agent-harness/**
  - specs/tasks/TASK-012-AGENTFACTORY-EXECUTION-CONTRACTS.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
max_files: 12
validation:
  - npm run verify
---

# Objective

Implement the first machine-readable execution contracts required by AgentFactory I1 — Single Task Autonomous.

# Context

I1 must move a bounded task from READY through execution, validation and evidence without free-form state interpretation. The governance and WBS baselines are already in `main`.

# Current behavior

The harness has task metadata and orchestration state, but no explicit I1 contract layer covering dependency gates, executor request/result metadata, risk/model routing metadata and evidence-oriented transitions.

# Required change

Add narrow TypeScript/runtime-safe structures and deterministic validation for the I1 execution vocabulary. Keep the work inside the harness and expose only what downstream AgentFactory components need.

# Inputs / contracts

AgentFactory I1 WBS/Dictionary, execution governance DoR/DoD and Evidence Protocol, and the existing harness task/orchestrator conventions.

# Outputs / contracts

Versioned/bounded execution-state, dependency-gate, executor request/result, risk/model-tier and evidence metadata structures with tests/fixtures and deterministic exports.

# Acceptance criteria

- Contracts express all I1 states/gates/results without free-form reinterpretation.
- Invalid shapes are rejected deterministically where applicable.
- AgentFactory execution contracts remain separate from System Builder product-domain contracts.
- Downstream DAG/READY evaluation can consume the outputs without inventing new execution-state semantics.
- `npm run verify` passes.

# Non-goals

DAG traversal, OpenCode process execution, GitHub PR lifecycle, sprint generation, database persistence, product code or UI.

# Evidence expected

Changed files, tests/fixtures, public harness exports created, downstream imports enabled and passing `npm run verify`.

# Escalation

Stop if implementation requires a new System Builder public/product contract, a repository/module boundary change, weakening existing CI/tests or work outside the declared paths.
