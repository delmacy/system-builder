---
id: TASK-545
title: Define runtime convergence autonomy coexistence and residual cohort drainage
status: blocked
priority: 545
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-544
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-543-G2-DEPLOYMENT-GENERATION-SEMANTICS.md
  - specs/tasks/TASK-544-G2-DEPLOYMENT-ACTUATION-RECONCILIATION.md
  - packages/contracts/deployment-runtime/**
allowed_paths:
  - packages/contracts/deployment-runtime/**
  - tests/product/g2-runtime-convergence-proof.test.ts
  - specs/tasks/TASK-545-G2-RUNTIME-CONVERGENCE-AUTONOMY-DRAINAGE.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define provider-neutral effective runtime convergence, retained autonomy/coexistence and residual runtime cohort drainage semantics after deployment actuation.

# Acceptance criteria
- effective runtime is based on qualified observation/currentness rather than desired state or provider ACK;
- runtime autonomy is represented as retained closure after successful realization, not permanent System Builder dependence;
- coexistence preserves source-of-truth and prior/current generation identity explicitly;
- residual replica/route/session/cache/worker cohorts remain visible until population/currentness-qualified drainage or disposition;
- PARTIAL/UNKNOWN/INCONCLUSIVE never strengthen convergence or drainage;
- rollback/roll-forward coexistence keeps actuation, eligibility and state/data recovery qualifications distinct;
- deterministic proof covers residual cohorts, stale observation, control-plane loss after convergence and mixed-generation coexistence.

# Non-goals
Concrete distributed topology, autoscaling, traffic router implementation, providers, persistence, apps/UI, runtime-core rewrite or Production Readiness.
