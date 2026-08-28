---
id: TASK-404
title: Add support-evolution semantic change admission seam
status: ready
priority: 404
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
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
  - specs/tasks/TASK-404-P18-SEMANTIC-CHANGE-EVOLUTION-ADMISSION.md
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
Add an additive representative consumer seam in Support/Evolution that admits canonical WBS 18.1/18.2 semantic-change evidence without changing existing `EvolutionRequestEvidence` behavior.

# Required change
Introduce a focused helper/API under `packages/support-evolution/**` that consumes public process-versioning/process-change contracts, validates the canonical revision/change inputs, and returns deterministic reference-only consumer evidence. Existing EvolutionRequest creation/validation/serialization must remain backward-compatible.

# Acceptance criteria
- consumes public canonical contracts rather than reimplementing semantic truth;
- existing evolution-request tests remain valid unchanged unless additive assertions are required;
- malformed/unknown/injected caller fields fail closed in the new seam;
- no Decision Boundary or WBS 18.3 change;
- declared validations pass.

# Non-goals
No release/deploy/compiler/runtime integration, no process→system lineage, no migration semantics, no replacement of existing EvolutionRequest evidence.

# Escalation
Stop if implementation requires modifying canonical process-change/process-versioning contracts or Decision Boundary semantics.
