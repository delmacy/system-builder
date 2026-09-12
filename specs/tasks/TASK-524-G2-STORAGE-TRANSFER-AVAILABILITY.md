---
id: TASK-524
title: Define qualified provider-copy transfer and availability lifecycle
status: blocked
priority: 524
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-523
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/storage/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - packages/contracts/storage/**
  - tests/product/g2-storage-transfer*.test.ts
  - specs/tasks/TASK-524-G2-STORAGE-TRANSFER-AVAILABILITY.md
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
Define multipart/resumable/offline provider-copy transfer and availability semantics without treating provider ACK as durable/integrity-qualified availability.

# Required change
Extend storage contracts and Product Proof for transfer identity/state, provider qualification, integrity evidence, resume/replay and offline reconciliation.

# Acceptance criteria
- transfer/attempt identity remains distinct from canonical object and provider-copy identity;
- provider ACK does not imply integrity-qualified or durable availability;
- resumed/replayed transfer preserves lineage and cannot manufacture duplicate canonical objects;
- provider qualification/currentness is explicit;
- PARTIAL/UNKNOWN transfer evidence remains non-strengthening and reconciles before unsafe retry.

# Non-goals
Concrete provider SDKs/adapters, DB persistence, network implementation, deployment or Production Readiness.