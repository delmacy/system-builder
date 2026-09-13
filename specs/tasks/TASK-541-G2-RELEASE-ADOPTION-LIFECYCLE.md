---
id: TASK-541
title: Define release adoption lifecycle and residual drainage semantics
status: completed
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

# Context
TASK-540 is integrated by PR #745. TASK-541 is integrated by PR #747 on `main@95220c90a33af801ff9f76bbae78f0694084a34a` and owns only release lifecycle semantics inside G2-WBS-13.

# Current behavior
Provider-neutral release adoption/coexistence/residual drainage and deterministic Product Proof are integrated and exact-head validated.

# Required change
Completed by PR #747: provider-neutral release adoption/coexistence/residual-drainage semantics and deterministic adversarial Product Proof after TASK-540 integration.

# Inputs / contracts
- canonical artifact identity/adoption from TASK-539;
- qualified SBOM/provenance evidence from TASK-540;
- closed source-of-truth, coexistence, population/currentness and UNKNOWN semantics.

# Outputs / contracts
A release lifecycle contract that keeps canonical artifact, release and deployed/effective runtime distinct while making coexistence and residual drainage explicit.

# Acceptance criteria
- canonical artifact != release != deployed/effective runtime;
- release identity/revision and adoption decision are explicit and evidence-backed;
- source-of-truth and coexistence states remain visible during migration/adoption;
- residual release cohorts are not declared drained without known population and current evidence;
- provider/registry acknowledgement cannot establish effective adoption;
- PARTIAL/UNKNOWN remain non-strengthening and unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable;
- Product Proof covers rollback/coexistence, stale channels, unknown population and residual cohorts.

# Evidence expected
Satisfied by PR #747 exact-head gates: Deterministic CI #1758, Heavy Product Tests #1348 and Automation Handoff #2449 all succeeded on `8ddbd60f93d2daffc3808b3865b784666633dac1`.

# Escalation
Any need for deployment/runtime realization belongs to G2-WBS-14 and must wait for fresh-main Construction B Sprint Review.

# Non-goals
Deployment execution, runtime convergence, concrete release/registry provider integrations, DB, apps/UI or Production Readiness.
