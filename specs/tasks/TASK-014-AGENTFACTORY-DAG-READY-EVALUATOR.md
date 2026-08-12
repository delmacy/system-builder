---
id: TASK-014
title: Implement the AgentFactory DAG READY evaluator
status: completed
priority: 38
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-012
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/README.md
  - project_docs/agentfactory_i1/TASK_DAG.yaml
  - project_docs/schedule/DAG_MACHINE_SCHEMA.md
  - project_docs/schedule/DAG_VALIDATION_RULES.md
  - specs/tasks/TASK-014-AGENTFACTORY-DAG-READY-EVALUATOR.md
  - tooling/agent-harness/src/task.ts
allowed_paths:
  - tooling/agent-harness/**
  - specs/tasks/TASK-014-AGENTFACTORY-DAG-READY-EVALUATOR.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
max_files: 12
validation:
  - npm run verify
---

# Objective

Implement deterministic evaluation of the near-horizon AgentFactory task DAG and compute which nodes are READY without using an LLM.

# Context

TASK-012 provides the execution/gate vocabulary. I1 needs a deterministic scheduler foundation that can reject malformed/cyclic graphs and explain why work is READY or BLOCKED.

# Current behavior

The repository can validate the existing task catalog and basic completed dependencies, but it does not implement the richer I1 dependency-gate evaluator specified by the machine DAG planning model.

# Required change

Implement deterministic graph validation, missing-reference detection, cycle detection, topological ordering and typed blocking-gate evaluation with machine-readable readiness reasons.

# Inputs / contracts

TASK-012 execution contracts, the AgentFactory I1 task DAG, machine DAG schema/validation policies and existing task catalog conventions.

# Outputs / contracts

A deterministic DAG/READY evaluator and representative fixtures/tests for chains, independent branches, missing predecessors, cycles and supported gate states.

# Acceptance criteria

- Same input graph always yields the same readiness result.
- Missing predecessor references and cycles fail closed with explicit diagnostics.
- A blocked mandatory predecessor/gate never produces a READY successor.
- Independent nodes remain READY when unrelated paths are blocked.
- Results identify the exact unsatisfied predecessor/gate.
- No LLM is called by readiness logic.
- `npm run verify` passes.

# Non-goals

Sprint loading, AI task decomposition, critical-path duration calculation, database persistence, parallel execution or product-domain behavior.

# Evidence expected

Representative graph fixtures, deterministic readiness outputs, cycle/missing-reference proof and passing `npm run verify`.

# Escalation

Stop if implementation requires changing approved dependency semantics, introducing product-domain coupling or weakening deterministic validation.
