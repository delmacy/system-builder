---
id: TASK-545
title: Define runtime convergence autonomy coexistence and residual cohort drainage
status: completed
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

# Context
TASK-543 establishes deployment generation/currentness and TASK-544 establishes actuation/reconciliation outcomes and is integrated by PR #758. TASK-545 is integrated by PR #761 after bounded semantic hardening of explicit prior-generation and directionally valid roll-forward/rollback coexistence. This TASK owns only the semantic closure from qualified runtime observation to convergence, autonomy/coexistence and residual-cohort drainage.

# Current behavior
The repository now provides the provider-neutral G2-WBS-14 contract for effective convergence and for visibility/drainage of mixed-generation residual runtime cohorts while preserving autonomous local runtime behavior.

# Required change
Completed by PR #761: provider-neutral runtime-convergence semantics based on qualified observation/currentness, retained runtime autonomy after convergence, explicit coexistence, and residual runtime cohorts visible until population/currentness-qualified drainage or disposition.

# Inputs / contracts
- canonical deployment intent and desired/observed/effective generation from TASK-543;
- actuation outcome and reconcile-before-retry semantics from TASK-544;
- existing autonomous single-host runtime behavior as KEEP baseline.

# Outputs / contracts
A revisioned runtime-convergence contract that distinguishes observed from effective state, represents retained autonomy/coexistence, and records residual cohort visibility/drainage without introducing concrete topology or traffic implementation.

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

# Evidence expected
Satisfied by PR #761 exact-head Deterministic CI + Heavy Product Tests and current Merge Candidate CI, with deterministic Product Proof covering convergence/currentness, mixed-generation coexistence, residual drainage and retained runtime autonomy.

# Escalation
Return to Sprint Review rather than adding concrete topology, scaling, routing, provider, persistence, runtime-core or Production Readiness ownership.
