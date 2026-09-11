---
id: TASK-522
title: Prove integrated durable execution external-effect and finite-flow semantics
status: verification
priority: 522
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-521
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/workflow/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - tests/product/g2-durable-flow-integrated-proof.test.ts
  - specs/tasks/TASK-522-G2-DURABLE-FLOW-INTEGRATED-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with integrated Product Proof across TASK-519..521 without introducing new semantic ownership.

# Context
Construction A must prove predecessor-to-successor behavior across revision-pinned durable execution, external-effect reconciliation/idempotency and finite-flow constraints.

# Current behavior
The individual contracts are not sufficient until one integrated adversarial/recovery proof demonstrates their composition.

# Required change
Add only integrated Product Proof exercising the authoritative outputs of TASK-519..521 across positive, negative, adversarial and recovery scenarios.

# Inputs / contracts
Exact authoritative outputs of TASK-519, TASK-520 and TASK-521 under the pinned WP-07 planning authority.

# Outputs / contracts
Integrated Product Proof only; no new contract or semantic owner.

# Acceptance criteria
- producing revision survives in-flight execution and recovery;
- accepted/processed/converged remain distinct through external effects;
- UNKNOWN/stale effect evidence forces reconcile-before-retry;
- idempotency horizon/scope prevents duplicate strengthening;
- finite-flow evidence bounds replay/recovery and preserves residual backlog visibility;
- PARTIAL/UNKNOWN never strengthens success, capacity or drainage.

# Negative/adversarial proof
Cover revision drift, ACK without effect, stale/UNKNOWN retry, expired idempotency horizon, unit/population mismatch, telemetry gap and residual backlog not drained.

# Evidence expected
One integrated Product Proof file plus all declared validations on the exact TASK head.

# Escalation
Escalate if integrated proof reveals a missing semantic capability necessary to Construction A; do not hide that gap in proof code.

# Non-goals
New contracts, storage/document semantics reserved for Construction B, messaging, runtime/persistence, deployment or Production Readiness.