---
id: TASK-301
title: Guard deterministic invariants from ungated probabilistic control
status: ready
priority: 301
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-300
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - packages/contracts/decision-boundary/**
  - project_docs/15-deterministic-human-probabilistic-boundary/WBS.md
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - specs/tasks/TASK-301-P15-DETERMINISTIC-INVARIANT-GUARD.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide a deterministic fail-closed guard that prevents probabilistic output from directly satisfying a deterministic invariant unless an explicit compatible gate is represented.
# Context
WBS 15.2.1 requires an enforceable boundary, not taxonomy alone.
# Current behavior
Deterministic modules enforce their own invariants, but no reusable decision-boundary evaluator distinguishes an ungated probabilistic candidate from a deterministic result.
# Required change
Add a pure deterministic guard/evaluation function over explicit decision descriptors and gate metadata. It must reject silent category coercion and return explicit diagnostics.
# Inputs / contracts
TASK-298..300 decision-boundary contract.
# Outputs / contracts
A deterministic evaluation result for invariant-control compatibility.
# Acceptance criteria
Deterministic input may satisfy a deterministic invariant when otherwise valid; probabilistic input without an explicit allowed gate fails closed; unknown/invalid descriptors fail; the guard does not execute inference or create authorization.
# Non-goals
No provider invocation, no policy engine replacement, no runtime orchestration, no automatic approval.
# Evidence expected
Positive/negative focused product tests and repository verification.
# Escalation
Stop only if satisfying the task requires changing a pre-existing architecture boundary rather than adding the bounded guard.
