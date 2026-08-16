---
id: TASK-049
title: Implement traceability ValidationEvidence engine
status: completed
priority: 240
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-048
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/07-validation/WBS.md
  - project_docs/execution_planning/P1-VERTICAL-02.md
  - packages/contracts/business-recipe/**
  - packages/contracts/system-analysis/**
  - packages/contracts/system-definition/**
  - packages/contracts/factory-boundary/**
  - specs/tasks/TASK-049-VALIDATION-TRACEABILITY-ENGINE.md
allowed_paths:
  - packages/validation/**
  - tests/product/validation.test.ts
  - specs/tasks/TASK-049-VALIDATION-TRACEABILITY-ENGINE.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 7
validation:
  - npm run verify
---

# Objective

Emit deterministic ValidationEvidence for the first vertical chain by checking declared traceability and test outcomes.

# Context

WBS 7.1-7.3 requires contract/version checks, requirement-to-assembly traceability, reproducible quality results and an explicit gate decision.

# Current behavior

The ValidationEvidence contract exists but no product validation engine emits it.

# Required change

Implement a bounded validation engine that verifies requirement references across Recipe/Analysis/Definition/Assembly inputs, records declared check results and emits PASS or FAIL ValidationEvidence with stable ordering.

# Inputs / contracts

BusinessRecipe, SystemAnalysis, SystemDefinition, AssemblyPlan and ValidationEvidence contracts.

# Outputs / contracts

ValidationEvidence object with deterministic gate decision and traceability rows.

# Acceptance criteria

- a complete synthetic chain emits PASS.
- broken requirement traceability emits FAIL with explicit findings.
- failed declared test/check emits FAIL.
- repeated equivalent inputs yield equivalent ordered evidence.
- validation does not mutate upstream artifacts.

# Non-goals

Security scanner integration, supply-chain attestation, external test runners or compiler execution.

# Evidence expected

Positive/negative product tests and repository-wide verification.

# Escalation

Stop if the existing ValidationEvidence contract cannot express the required bounded evidence without a public-contract change.
