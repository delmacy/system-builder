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

# Required change
Add only integrated positive, negative, adversarial and recovery Product Proof combining identity/lineage, delivery/effect reconciliation, ordering epochs, replay/DLQ and batch partiality.

# Acceptance criteria
The proof demonstrates that transport/provider success cannot strengthen business truth; historical revision/occurrence lineage survives replay; ordering remains qualified; PARTIAL/UNKNOWN remains visible; unsafe ambiguity reconciles before retry; and finite-flow residual populations remain explicit.

# Non-goals
New contracts, concrete providers, persistence, notification/callback implementation, Construction B/C, deployment or Production Readiness.