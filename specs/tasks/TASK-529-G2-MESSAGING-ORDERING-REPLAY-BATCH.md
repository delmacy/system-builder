---
id: TASK-529
title: Define ordering epochs, replay DLQ and batch partiality semantics
status: blocked
priority: 529
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-528
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/messaging/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - packages/contracts/messaging/**
  - tests/product/g2-messaging-replay*.test.ts
  - specs/tasks/TASK-529-G2-MESSAGING-ORDERING-REPLAY-BATCH.md
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
Define explicit ordering scope/partition/epoch plus replay, DLQ and batch-partiality semantics integrated with finite-flow constraints.

# Context
TASK-529 consumes TASK-527 canonical occurrence/revision lineage, TASK-528 delivery/effect reconciliation, and the closed WP-07 units/population/time-qualified finite-flow semantics.

# Current behavior
No bounded messaging contract currently composes scoped ordering epochs with replay/DLQ lineage, per-item batch partiality and finite-drainable residual backlog semantics without implying global order or treating missing telemetry as empty backlog.

# Inputs / contracts
- TASK-527 canonical occurrence/message/subscription and producing-revision lineage;
- TASK-528 delivery-attempt, provider-ACK and business-effect reconciliation semantics;
- closed WP-07 finite-flow, residual cohort and telemetry qualification semantics.

# Outputs / contracts
Provider-neutral ordering scope/partition/epoch, replay/DLQ and batch-partiality messaging contracts plus Product Proof, preserving predecessor identity/effect truth and finite-flow qualifications.

# Required change
Define scoped ordering epochs and replay/DLQ/batch semantics that preserve canonical historical lineage and per-item uncertainty while requiring residual backlog and recovery claims to remain units/population/time qualified and finite-drainable.

# Acceptance criteria
- ordering claims name scope/partition/epoch and do not imply global order;
- replay retains producing revision, canonical occurrence lineage and prior delivery evidence;
- DLQ movement is not resolution or business-effect proof;
- batch success cannot hide per-item PARTIAL/UNKNOWN/failure;
- replay/recovery horizons and residual cohorts remain units/population/time qualified and finite-drainable.

# Negative/adversarial proof
Reject partition order=>global order, replay=>new occurrence, DLQ ACK=>resolved, partial batch=>whole success and telemetry gap=>empty backlog.

# Evidence expected
Deterministic Product Proof must exercise scoped ordering and epoch changes, replay preserving historical lineage/evidence, DLQ non-resolution, per-item PARTIAL/UNKNOWN visibility, telemetry gaps that cannot imply zero backlog, and units/population/time mismatches that cannot establish finite drainage.

# Escalation
Stop and return bounded findings to the owning predecessor/package gate if correctness requires concrete broker/DLQ APIs, persistence/runtime realization, reinterpretation of TASK-527/528 semantics, or unmaterialized provider/coexistence/offline/callback Construction B/C work.

# Non-goals
Concrete broker configuration, persistence, provider-specific DLQ APIs, notifications/callback realization, deployment or Production Readiness.