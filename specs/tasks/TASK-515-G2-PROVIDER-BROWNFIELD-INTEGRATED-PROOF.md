---
id: TASK-515
title: Prove integrated provider Brownfield locality and bounded peripheral semantics
status: planned
priority: 515
milestone: G2
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-514
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - tests/product/g2-provider*.test.ts
  - tests/product/g2-brownfield*.test.ts
  - tests/product/g2-locality*.test.ts
  - tests/product/g2-physical-peripheral*.test.ts
  - specs/tasks/TASK-515-G2-PROVIDER-BROWNFIELD-INTEGRATED-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 5
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with integrated Product Proof across TASK-510..514 without new semantic ownership.

# Required change
Prove positive, negative, adversarial and recovery paths across provider qualification, Brownfield evidence, external identity reuse/rebinding, coexistence/source-of-truth, locality/currentness, local/Station/Fleet reconciliation and bounded Physical/Peripheral governance.

# Acceptance criteria
- feature/API parity never proves provider support;
- AI/discovery evidence never becomes authority implicitly;
- PARTIAL/UNKNOWN/currentness/locality remain conservative;
- external ID reuse cannot silently change canonical identity or resurrect fenced authority;
- coexistence preserves single canonical truth and residual visibility;
- local/Station/Fleet truth cannot silently become global truth;
- physical integration cannot imply generic actuation authority or confirmed effect;
- Product Proof is not labeled Production Readiness.

# Negative/adversarial proof
Exercise parity=>support, inference=>authority, stale=>current, ID reuse=>same entity, dual truth, hidden residuals, local=>global, connected=>authorized and accepted-command=>effect.

# Non-goals
Production Readiness, concrete vendor/device adapters, deployment or WP-07+ work.