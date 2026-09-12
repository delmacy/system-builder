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

# Context
TASK-524 consumes the canonical object/provider-copy separation established by TASK-523 and the finite-flow boundary from Construction A. It adds transfer and availability lifecycle semantics without selecting or implementing a storage vendor.

# Current behavior
Before this TASK, canonical and provider-copy identity can be represented, but transfer attempts, resumability, integrity-qualified availability, provider qualification and offline reconciliation do not yet have one authoritative storage lifecycle contract.

# Required change
Extend storage contracts and Product Proof for transfer identity/state, provider qualification, integrity evidence, resume/replay and offline reconciliation.

# Inputs / contracts
Integrated TASK-523 canonical storage identity contract, WP-06 provider qualification semantics, and Construction A finite-flow/currentness/reconciliation semantics.

# Outputs / contracts
Provider-neutral transfer/availability lifecycle contracts under `packages/contracts/storage/**` plus Product Proof under the declared path. No provider SDK, persistence, network transport or runtime adapter is produced.

# Acceptance criteria
- transfer/attempt identity remains distinct from canonical object and provider-copy identity;
- provider ACK does not imply integrity-qualified or durable availability;
- resumed/replayed transfer preserves lineage and cannot manufacture duplicate canonical objects;
- provider qualification/currentness is explicit;
- PARTIAL/UNKNOWN transfer evidence remains non-strengthening and reconciles before unsafe retry.

# Negative/adversarial proof
Cover ACK without integrity/durability evidence, stale provider qualification/currentness, resume or replay with mismatched lineage, duplicate-attempt collapse into canonical identity, and PARTIAL/UNKNOWN transfer evidence used to claim availability or authorize unsafe retry.

# Evidence expected
Product Proof across complete, multipart, resumed/replayed and offline-reconciliation cases plus every validation declared in this TASK on the exact implementation head.

# Escalation
If transfer safety requires semantics absent from TASK-523, WP-06 or Construction A, stop and surface that bounded predecessor gap; do not introduce concrete provider behavior or absorb TASK-525 disposition semantics.

# Non-goals
Concrete provider SDKs/adapters, DB persistence, network implementation, deployment or Production Readiness.
