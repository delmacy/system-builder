---
id: TASK-546
title: Prove integrated G2-WBS-14 Construction C deployment runtime semantics
status: blocked
priority: 546
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-545
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-543-G2-DEPLOYMENT-GENERATION-SEMANTICS.md
  - specs/tasks/TASK-544-G2-DEPLOYMENT-ACTUATION-RECONCILIATION.md
  - specs/tasks/TASK-545-G2-RUNTIME-CONVERGENCE-AUTONOMY-DRAINAGE.md
  - packages/contracts/deployment-runtime/**
allowed_paths:
  - tests/product/g2-deployment-construction-c-proof.test.ts
  - specs/tasks/TASK-546-G2-DEPLOYMENT-CONSTRUCTION-C-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close the first G2-WBS-14 Construction C Sprint with integrated Product Proof across TASK-543..545 without creating new semantic ownership.

# Acceptance criteria
- compose desired/observed/effective generation semantics, ambiguous actuation reconciliation and runtime convergence/drainage in one deterministic proof;
- prove release != deployment != observed runtime != effective runtime;
- prove provider ACK cannot manufacture convergence/currentness;
- prove PARTIAL/UNKNOWN/INCONCLUSIVE remain non-strengthening;
- prove reconcile-before-retry for ambiguous unsafe mutation;
- prove control-plane-independent retained runtime closure after qualified convergence;
- prove residual runtime cohorts remain visible until qualified drainage/disposition;
- do not claim concrete provider realization or Production Readiness.

# Non-goals
New contracts, providers, persistence, DB/runtime realization, apps/UI, Production Readiness or WP-10+ scope.
