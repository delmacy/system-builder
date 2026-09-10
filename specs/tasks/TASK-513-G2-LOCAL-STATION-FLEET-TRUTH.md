---
id: TASK-513
title: Define local Station Fleet truth and reconciliation boundaries
status: planned
priority: 513
milestone: G2
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-512
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/locality/**
  - packages/contracts/provider/**
  - tests/product/g2-locality*.test.ts
  - specs/tasks/TASK-513-G2-LOCAL-STATION-FLEET-TRUTH.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define locality-qualified truth and reconciliation boundaries for local, Station and Fleet integration contexts.

# Required change
Represent locality scope, observation/currentness horizon, local authority, upstream/downstream reconciliation state and conflict/partition uncertainty without assuming globally current truth.

# Acceptance criteria
- local/Station/Fleet observations carry explicit locality and currentness;
- partitioned or stale local truth is not silently promoted to global/current truth;
- UNKNOWN conflicts require reconciliation before authority-sensitive retry;
- local authority and canonical source-of-truth ownership remain distinguishable;
- reconciliation preserves lineage and residual visibility.

# Negative/adversarial proof
Reject local=>global, stale=>current, disconnected=>absent and UNKNOWN conflict=>resolved.

# Non-goals
Networking topology, fleet scheduler, deployment, device driver or Production Readiness.