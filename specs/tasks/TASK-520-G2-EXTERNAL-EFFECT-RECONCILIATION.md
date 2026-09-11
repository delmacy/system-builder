---
id: TASK-520
title: Define external-effect identity idempotency and reconcile-before-retry
status: ready
priority: 520
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-519
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/workflow/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/workflow/**
  - tests/product/g2-durable-execution*.test.ts
  - specs/tasks/TASK-520-G2-EXTERNAL-EFFECT-RECONCILIATION.md
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
Define external-effect identity, attempt/delivery separation, idempotency qualification and authoritative reconcile-before-retry semantics on the TASK-519 execution foundation.

# Context
Durable execution cannot treat transport acceptance or a previous attempt as proof of external business effect.

# Current behavior
No integrated G2 contract proves effect identity distinct from attempt/delivery identity or qualifies idempotency by authority/scope/payload/horizon.

# Required change
Represent effect identity, attempts/deliveries, outcome evidence, reconciliation state and idempotency qualification. Unsafe UNKNOWN must block blind retry until authoritative reconciliation.

# Inputs / contracts
Authoritative TASK-519 output plus WP-01 revision/evidence semantics, WP-04 authority/trust and WP-06 provider qualification/currentness where provider evidence participates.

# Outputs / contracts
External-effect/retry contract and Product Proof preserving effect lineage and fail-closed uncertainty.

# Acceptance criteria
- effect identity != attempt/delivery identity;
- provider/API ACK != business effect;
- UNKNOWN effect state requires reconciliation before retry;
- idempotency carries key authority, scope, payload equivalence and retention horizon;
- stale or mismatched revision/currentness evidence cannot authorize retry.

# Negative/adversarial proof
Reject ACK=>effect, attempt-id=>effect-id, UNKNOWN=>retry, expired horizon=>idempotent and payload mismatch=>same effect strengthening.

# Evidence expected
Positive, negative, adversarial and recovery Product Proof plus all declared validations.

# Escalation
Escalate if the contract requires messaging semantics owned by WP-08 or concrete provider/runtime implementation.

# Non-goals
Messaging/DLQ/subscription semantics, concrete provider calls, persistence, compensation engine, deployment or Production Readiness.
