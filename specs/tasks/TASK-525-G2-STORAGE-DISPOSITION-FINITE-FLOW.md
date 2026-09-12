---
id: TASK-525
title: Integrate storage disposition residual-copy drainage and finite-flow constraints
status: blocked
priority: 525
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-524
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/storage/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - packages/contracts/storage/**
  - packages/contracts/finite-flow/**
  - tests/product/g2-storage-disposition*.test.ts
  - specs/tasks/TASK-525-G2-STORAGE-DISPOSITION-FINITE-FLOW.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Compose deletion/disposition, residual provider-copy visibility and storage transfer/replay with units/population/time-qualified finite-flow semantics.

# Required change
Add bounded disposition/drainage contracts or extensions and Product Proof showing qualified populations, residual copies and finite completion assumptions.

# Acceptance criteria
- disposition applies to an explicitly qualified population and authority scope;
- deletion ACK does not prove all residual copies drained;
- residual copies/cohorts remain visible until reconciled;
- transfer/replay capacity uses explicit units, population and time assumptions;
- UNKNOWN/PARTIAL telemetry cannot prove drainage or zero residual population;
- dedup or disposal cannot erase lifecycle/source-of-truth evidence.

# Non-goals
Vendor deletion APIs, persistence, messaging, deployment or Production Readiness.