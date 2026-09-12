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

# Acceptance criteria
- ordering claims name scope/partition/epoch and do not imply global order;
- replay retains producing revision, canonical occurrence lineage and prior delivery evidence;
- DLQ movement is not resolution or business-effect proof;
- batch success cannot hide per-item PARTIAL/UNKNOWN/failure;
- replay/recovery horizons and residual cohorts remain units/population/time qualified and finite-drainable.

# Negative/adversarial proof
Reject partition order=>global order, replay=>new occurrence, DLQ ACK=>resolved, partial batch=>whole success and telemetry gap=>empty backlog.

# Non-goals
Concrete broker configuration, persistence, provider-specific DLQ APIs, notifications/callback realization, deployment or Production Readiness.