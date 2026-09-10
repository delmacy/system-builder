---
id: TASK-512
title: Protect external identity reuse rebinding and coexistence lineage
status: planned
priority: 512
milestone: G2
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-511
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/data-schema/**
allowed_paths:
  - packages/contracts/brownfield/**
  - packages/contracts/provider/**
  - tests/product/g2-brownfield*.test.ts
  - specs/tasks/TASK-512-G2-EXTERNAL-IDENTITY-COEXISTENCE.md
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
Prevent external identifier reuse/rebinding from silently changing canonical identity or resurrecting stale authority during Brownfield coexistence.

# Required change
Model external identity bindings with provider/scope/revision/epoch lineage, explicit rebinding qualification, coexistence state and source-of-truth references compatible with WP-05 fencing/residual drainage semantics.

# Acceptance criteria
- external IDs are not globally canonical identities;
- reuse/rebinding is explicit and evidence-qualified;
- stale bindings cannot resurrect authority after fencing/cutover;
- coexistence preserves one canonical truth per scope/epoch;
- residual bindings/populations remain visible until drained/reconciled.

# Negative/adversarial proof
Reject ID reuse=>same entity, stale binding=>authority, two canonical truths and hidden residual binding cohorts.

# Non-goals
Concrete data migration, vendor adapter implementation or Production Readiness.