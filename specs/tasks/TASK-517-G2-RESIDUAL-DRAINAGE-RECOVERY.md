---
id: TASK-517
title: Preserve residual drainage and stale-authority fencing through rebinding recovery
status: verification
priority: 517
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-516
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/provider/**
  - packages/contracts/brownfield/**
  - packages/contracts/locality/**
allowed_paths:
  - packages/contracts/provider/**
  - packages/contracts/brownfield/**
  - packages/contracts/locality/**
  - tests/product/g2-brownfield-recovery*.test.ts
  - tests/product/g2-locality-recovery*.test.ts
  - specs/tasks/TASK-517-G2-RESIDUAL-DRAINAGE-RECOVERY.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Harden coexistence/rebinding recovery so stale authority stays fenced and residual cohorts remain visible until explicitly drained or reconciled.

# Context
TASK-512 established provider/scope/revision/epoch-qualified external identity and residual visibility; TASK-513 established locality-qualified reconciliation. This task proves those boundaries survive recovery and rebinding rather than collapsing after transient conflict or reconnection.

# Current behavior
Construction A establishes canonical-truth uniqueness, stale-binding fencing, explicit rebinding lineage and visible residual cohorts, but Construction B must prove those invariants remain conservative across recovery and reconnection transitions.

# Inputs / contracts
The integrated external identity/coexistence and locality reconciliation contracts from TASK-512..513, plus TASK-516 recovery semantics once integrated and the pinned G2-WP-06 authority.

# Outputs / contracts
Bounded recovery semantics and Product Proof for rebinding, reconnection, stale-authority fencing, canonical-source uniqueness and residual drainage visibility; no persistence, adapter or runtime ownership.

# Required change
Define bounded recovery semantics for rebinding/coexistence transitions, preserving one canonical source-of-truth per scope/epoch, visible residual lineage, fencing of stale bindings, and locality/currentness-qualified reconciliation.

# Acceptance criteria
- rebinding never resurrects fenced stale authority;
- provider/external IDs never become canonical identity by reuse;
- residual cohorts remain visible until explicit drainage/reconciliation evidence exists;
- recovery cannot create dual canonical truth for one scope/epoch;
- local/Station/Fleet reconnection cannot silently strengthen local state to global truth;
- UNKNOWN/conflict requires reconcile-before-retry;
- no runtime/device/deployment/Production Readiness scope is added.

# Negative/adversarial proof
Exercise ID reuse after fencing, rebound-to-old epoch, residual hiding, dual-source recovery, Station/Fleet reconnect with stale state, and UNKNOWN treated as drained.

# Evidence expected
Product Proof plus declared exact-head gates demonstrate fencing, residual visibility and deterministic recovery.

# Escalation
Escalate any requirement for concrete migration execution, persistence, provider/device adapters, physical actuation, deployment or Production Readiness instead of expanding this recovery boundary.

# Non-goals
Concrete migration execution, persistence, adapters, physical actuation, deployment or Production Readiness.
