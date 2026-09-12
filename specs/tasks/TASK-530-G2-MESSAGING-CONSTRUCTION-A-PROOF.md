---
id: TASK-530
title: Prove integrated messaging semantic core
status: blocked
priority: 530
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-529
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/messaging/**
allowed_paths:
  - tests/product/g2-messaging-integrated*.test.ts
  - specs/tasks/TASK-530-G2-MESSAGING-CONSTRUCTION-A-PROOF.md
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
Close Construction A with integrated Product Proof across TASK-527..529 without introducing new semantic ownership.

# Context
TASK-530 is the Construction A proof-only closure after TASK-527 identity/lineage, TASK-528 delivery/effect reconciliation, and TASK-529 ordering/replay/DLQ/batch semantics are integrated.

# Current behavior
The predecessor contracts establish the bounded semantic pieces independently, but Construction A is not complete until one integrated Product Proof demonstrates their composition without transport/provider evidence strengthening business truth or historical lineage.

# Inputs / contracts
- integrated outputs of TASK-527, TASK-528 and TASK-529;
- closed WP-06 provider qualification/currentness semantics;
- closed WP-07 reconcile-before-retry and finite-flow/residual-cohort semantics.

# Outputs / contracts
Only integrated Product Proof evidence across the predecessor contracts. TASK-530 must not introduce or modify semantic contracts.

# Required change
Add only integrated positive, negative, adversarial and recovery Product Proof combining identity/lineage, delivery/effect reconciliation, ordering epochs, replay/DLQ and batch partiality.

# Acceptance criteria
The proof demonstrates that transport/provider success cannot strengthen business truth; historical revision/occurrence lineage survives replay; ordering remains qualified; PARTIAL/UNKNOWN remains visible; unsafe ambiguity reconciles before retry; and finite-flow residual populations remain explicit.

# Evidence expected
Integrated deterministic Product Proof must cover positive composition and adversarial/recovery cases for provider ACK versus business effect, historical revision/occurrence replay, ordering scope/epoch, per-item PARTIAL/UNKNOWN, unsafe ambiguous retry, telemetry gaps and units/population/time-qualified residual drainage, with exact-head repository validation green.

# Escalation
If integrated proof exposes a semantic gap, stop and route bounded retrabalho to the owning predecessor TASK rather than changing contracts from TASK-530. Do not absorb concrete providers, persistence/runtime, Construction B/C or Production Readiness.

# Non-goals
New contracts, concrete providers, persistence, notification/callback implementation, Construction B/C, deployment or Production Readiness.