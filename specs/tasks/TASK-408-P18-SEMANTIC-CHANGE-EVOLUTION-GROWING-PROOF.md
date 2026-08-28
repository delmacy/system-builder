---
id: TASK-408
title: Close semantic change integration with growing proof
status: materialized
priority: 408
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-407
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/support-evolution/**
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/**
  - tests/product/**
allowed_paths:
  - packages/support-evolution/**
  - tests/product/**
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01.report.md
  - specs/tasks/TASK-408-P18-SEMANTIC-CHANGE-EVOLUTION-GROWING-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction B with an integrated product proof that composes WBS 18.2 canonical semantic-change truth through the representative Support/Evolution consumer seam.

# Required change
Add a focused growing proof that exercises the public process-versioning/process-change contracts through the real Support/Evolution integration seam. Cover valid approved/rejected same-artifact changes and negative forged/reversed predecessor, cross-artifact, duplicate/mismatched semantic refs, classification/rationale mismatch, authorityRef mismatch, deterministic/probabilistic/model/PR/Git/caller authority substitution and payload injection. Produce the Construction B Sprint Report.

# Acceptance criteria
- real consumer seam is exercised rather than hand-authoring downstream truth;
- WBS 18.1 predecessor and WBS 18.2 semantic-change truth remain canonical contract-owned;
- only validated human-decision backs approved/rejected business outcome;
- existing evolution evidence remains backward-compatible;
- no WBS 18.3 semantics or Decision Boundary changes;
- Sprint Report records validations, commits, boundaries and residuals;
- declared validations pass.

# Non-goals
No Package Integration & Review, Documentation & Closure, WBS 18.3 lineage/migration, findings/TD absorption or inferred L4.

# Escalation
Stop if proving the Package Goal requires architecture changes, Decision Boundary modifications or future WBS scope.
