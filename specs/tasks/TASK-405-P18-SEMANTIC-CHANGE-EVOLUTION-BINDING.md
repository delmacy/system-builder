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

# Context
TASK-404 establishes the additive Support/Evolution admission seam. This TASK tightens that seam by composing only canonical WBS 18.1 predecessor truth and WBS 18.2 semantic-change validators.

# Current behavior
The new seam can admit canonical evidence, but the materialized Construction B chain still requires explicit proof that revision endpoints, semantic diff, classification and rationale/evidence all belong to the same change.

# Required change
Extend the TASK-404 seam so its accepted consumer evidence can only be produced when canonical process-change validators prove that the exact revision endpoints, semantic diff, classification and rationale/evidence belong together. Reject cross-artifact, reversed/forged predecessor, duplicate semantic refs, classification mismatch and reason/evidence mismatch.

# Inputs / contracts
TASK-404 consumer seam, public process-versioning predecessor validators, and public process-change semantic diff/classification/reason-evidence validators.

# Outputs / contracts
A bound Support/Evolution consumer evidence result that is reference-only and can exist only when the canonical validators agree on one exact semantic change.

# Acceptance criteria
- WBS 18.1 predecessor truth is consumed canonically;
- diff/classification/rationale are validated by public process-change contracts;
- mismatched or caller-forged references fail closed;
- existing EvolutionRequest evidence remains backward-compatible;
- no approval authority is inferred from classification;
- declared validations pass.

# Non-goals
No human approval implementation beyond consuming existing contracts in later TASK, no WBS 18.3 lineage, no Decision Boundary modification.

# Evidence expected
Product tests covering valid binding plus cross-artifact, reversed/forged predecessor, duplicate semantic refs, classification mismatch and reason/evidence mismatch negatives.

# Escalation
Stop if canonical contracts cannot express the required binding without L3/L4 changes not already materialized.
