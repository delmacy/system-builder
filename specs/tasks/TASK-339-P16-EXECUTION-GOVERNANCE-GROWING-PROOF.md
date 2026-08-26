---
id: TASK-339
title: Close Construction A growing execution governance proof
status: ready
priority: 339
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-338
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.report.md
  - specs/tasks/TASK-339-P16-EXECUTION-GOVERNANCE-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction A with an integrated growing proof and Sprint Report covering the materialized WBS 16.2 contract foundation.

# Context
TASK-334..338 establish the execution-governance contract surface; the Sprint must end with integrated evidence and explicit residual-work disposition rather than isolated unit claims.

# Current behavior
No Construction A closing proof/report exists for P16-PACKAGE-02.

# Inputs / contracts
- authoritative outputs from TASK-334..338;
- real predecessor WBS 16.1 contract APIs;
- Sprint manifest and Package Goal.

# Outputs / contracts
- integrated product proof covering routing/budget/quota/fallback contract semantics, structured-output validation, permission-aware metadata and predecessor compatibility;
- Sprint Report with commits, gates, deviations/discoveries and residual evidence for Construction B;
- no promotion/materialization of Construction B.

# Required change
Add the final Construction A proof using real contract APIs and produce the Sprint Report. Record whether any discovered gap is bounded to Construction B forecast or requires escalation; do not execute successor work.

# Acceptance criteria
- positive and fail-closed cases are covered across the composed governance boundary;
- provider identity/secrets/hidden defaults/authority fabrication remain absent;
- predecessor WBS 16.1 compatibility is proven;
- Sprint Report records TASK results and residual integration work;
- declared validations pass.

# Non-goals
No Construction B execution/materialization, live routing/fallback, provider registry, WBS 16.3 work, runtime/compiler changes or technical-debt absorption.

# Evidence expected
Growing product proof plus `P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.report.md`.

# Escalation
Stop if the Package Goal cannot be advanced without architecture change, WBS 16.3 scope or forbidden paths.
