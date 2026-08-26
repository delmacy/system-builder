---
id: TASK-310
title: Add decision-boundary architecture and contract checks
status: ready
priority: 310
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-309
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-VERIFICATION-01.md
  - packages/contracts/decision-boundary/index.ts
  - docs/architecture/QUALITY_GATES.md
allowed_paths:
  - tooling/agent-harness/tests/**
  - tests/product/**
  - specs/tasks/TASK-310-P15-DECISION-BOUNDARY-ARCHITECTURE-CHECKS.md
forbidden_paths:
  - docs/adr/**
  - tooling/agent-harness/policies/**
max_files: 6
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:architecture
  - npm run check:tasks
  - npm run verify
---
# Objective
Create deterministic architecture/contract checks that certify the P15 decision boundary remains provider-neutral and authority-safe.

# Context
WBS 15.3.1 requires applicable architecture/contract checks after the boundary contract and real governance enforcement paths were integrated in P15-PACKAGE-01.

# Current behavior
General architecture gates and product tests exist, but no focused check suite certifies decision-boundary invariants against provider coupling or authority-confusing outputs.

# Required change
Add focused tests/checks over the real exported decision-boundary API and dependency rules, without changing production architecture.

# Inputs / contracts
Canonical decision-boundary exports, repository architecture gates, ADR-0010.

# Outputs / contracts
Deterministic verification evidence that prohibited coupling/authority substitutions are rejected.

# Acceptance criteria
- real exported boundary API is exercised;
- probabilistic data cannot satisfy human-reserved authority;
- ungated probabilistic data cannot satisfy deterministic invariants;
- provider/network/secret coupling is not introduced into the contract boundary;
- declared validations pass.

# Non-goals
No new runtime provider abstraction, no authorization replacement, no L4 topology change.

# Evidence expected
Unit/product architecture checks and repository-wide verification.

# Escalation
Stop if certification requires modifying constitutional architecture boundaries rather than testing existing ones.