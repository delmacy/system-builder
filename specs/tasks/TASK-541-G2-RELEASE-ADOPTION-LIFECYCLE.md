---
id: TASK-541
title: Define release adoption lifecycle and residual drainage semantics
status: blocked
priority: 541
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-540
context_paths:
  - AGENTS.md
  - packages/contracts/artifact-supply/**
allowed_paths:
  - packages/contracts/artifact-supply/**
  - tests/product/g2-release-adoption-proof.test.ts
  - specs/tasks/TASK-541-G2-RELEASE-ADOPTION-LIFECYCLE.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define provider-neutral release adoption, coexistence and residual-release drainage without equating release publication with deployed/effective runtime.

# Acceptance criteria
- canonical artifact != release != deployed/effective runtime;
- release identity/revision and adoption decision are explicit and evidence-backed;
- source-of-truth and coexistence states remain visible during migration/adoption;
- residual release cohorts are not declared drained without known population and current evidence;
- provider/registry acknowledgement cannot establish effective adoption;
- PARTIAL/UNKNOWN remain non-strengthening and unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable;
- Product Proof covers rollback/coexistence, stale channels, unknown population and residual cohorts.

# Escalation
Any need for deployment/runtime realization belongs to G2-WBS-14 and must wait for fresh-main Construction B Sprint Review.

# Non-goals
Deployment execution, runtime convergence, concrete release/registry provider integrations, DB, apps/UI or Production Readiness.
