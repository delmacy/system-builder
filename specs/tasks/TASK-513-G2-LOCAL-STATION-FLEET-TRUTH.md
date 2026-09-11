---
id: TASK-513
title: Define local Station Fleet truth and reconciliation boundaries
status: verification
priority: 513
milestone: G2
model_tier: architecture
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

# Context
TASK-513 follows external identity/coexistence lineage and constrains truth to explicit locality/currentness while preserving canonical source ownership.

# Current behavior
No G2 contract currently proves reconciliation among local, Station and Fleet observations without silently promoting partitioned or stale state to global truth.

# Inputs / contracts
TASK-512 lineage, locality scope, observation/currentness horizon, local authority, canonical source ownership, reconciliation state and conflict/partition evidence.

# Outputs / contracts
A locality-aware truth/reconciliation contract with explicit local/Station/Fleet scope, currentness, authority distinction, conflict state and residual lineage.

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

# Evidence expected
Product Proof covers current reconciled observations and adversarial stale, partitioned, disconnected and UNKNOWN-conflict cases; exact-head validations pass.

# Escalation
Escalate if resolution requires networking topology, scheduling or deployment behavior outside the contract; preserve locality-qualified UNKNOWN instead of manufacturing global truth.

# Non-goals
Networking topology, fleet scheduler, deployment, device driver or Production Readiness.
