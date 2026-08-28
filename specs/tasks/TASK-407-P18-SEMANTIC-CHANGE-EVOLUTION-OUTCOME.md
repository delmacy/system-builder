---
id: TASK-407
title: Prove deterministic evolution consumer outcomes
status: ready
priority: 407
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-406
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01.md
  - packages/support-evolution/**
  - packages/contracts/process-change/**
  - tests/product/**
allowed_paths:
  - packages/support-evolution/**
  - tests/product/**
  - specs/tasks/TASK-407-P18-SEMANTIC-CHANGE-EVOLUTION-OUTCOME.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove deterministic approved/rejected consumer outcomes while preserving backward-compatible Support/Evolution behavior.

# Required change
Add focused product tests around the TASK-404..406 seam showing stable deterministic output for valid approved and rejected same-artifact changes, exact replay where applicable, and coexistence with existing EvolutionRequest creation/validation/serialization and P12 linkage behavior.

# Acceptance criteria
- approved and rejected outcomes are deterministic and reference-only;
- existing EvolutionRequest behavior remains compatible;
- repeated equivalent input yields equivalent canonical consumer evidence;
- caller-supplied outcome/authority injection fails closed;
- no WBS 18.3 behavior is introduced;
- declared validations pass.

# Non-goals
No new release/deploy behavior, no migration execution, no package-level closure.

# Escalation
Stop if compatibility requires changing existing EvolutionRequest public semantics rather than adding a bounded seam.
