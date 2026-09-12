---
id: TASK-523
title: Define canonical document media identity and provider-copy separation
status: ready
priority: 523
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-522
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/finite-flow/**
allowed_paths:
  - packages/contracts/storage/**
  - tests/product/g2-storage-identity*.test.ts
  - specs/tasks/TASK-523-G2-CANONICAL-STORAGE-IDENTITY.md
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
Define canonical document/media/object identity independently from provider key, hash, copy identity or transport attempt.

# Required change
Add a storage identity contract plus Product Proof establishing canonical identity, typed provider-copy references, revision/currentness and coexistence semantics.

# Acceptance criteria
- canonical identity never derives authority from provider key/hash/copy;
- multiple provider copies may coexist for one canonical object without collapsing lifecycle;
- hash equality may support integrity/dedup evidence but cannot merge authority or identity;
- stale/PARTIAL/UNKNOWN provider-copy evidence cannot strengthen canonical availability;
- source-of-truth and residual-copy state remain explicit.

# Non-goals
Concrete vendor adapters, persistence/DB, upload execution, messaging, deployment or Production Readiness.