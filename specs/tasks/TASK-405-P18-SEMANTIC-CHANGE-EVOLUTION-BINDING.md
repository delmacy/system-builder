---
id: TASK-405
title: Bind canonical semantic change evidence to evolution requests
status: ready
priority: 405
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-404
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/support-evolution/**
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
allowed_paths:
  - packages/support-evolution/**
  - tests/product/**
  - specs/tasks/TASK-405-P18-SEMANTIC-CHANGE-EVOLUTION-BINDING.md
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
Bind canonical revision predecessor, semantic diff, classification and rationale/evidence references to the representative Support/Evolution consumer seam.

# Required change
Extend the TASK-404 seam so its accepted consumer evidence can only be produced when canonical process-change validators prove that the exact revision endpoints, semantic diff, classification and rationale/evidence belong together. Reject cross-artifact, reversed/forged predecessor, duplicate semantic refs, classification mismatch and reason/evidence mismatch.

# Acceptance criteria
- WBS 18.1 predecessor truth is consumed canonically;
- diff/classification/rationale are validated by public process-change contracts;
- mismatched or caller-forged references fail closed;
- existing EvolutionRequest evidence remains backward-compatible;
- no approval authority is inferred from classification;
- declared validations pass.

# Non-goals
No human approval implementation beyond consuming existing contracts in later TASK, no WBS 18.3 lineage, no Decision Boundary modification.

# Escalation
Stop if canonical contracts cannot express the required binding without L3/L4 changes not already materialized.
