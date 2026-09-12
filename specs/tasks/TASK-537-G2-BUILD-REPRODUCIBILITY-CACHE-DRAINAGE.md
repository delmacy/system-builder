---
id: TASK-537
title: Define reproducibility claims, cache lineage and residual runner drainage
status: blocked
priority: 537
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-536
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-09-REPRODUCIBLE-BUILD-ARTIFACT-SUPPLY-AUTONOMOUS-DEPLOYMENT.md
  - packages/contracts/build-reproducibility/**
allowed_paths:
  - packages/contracts/build-reproducibility/**
  - tests/product/g2-build-reproducibility-cache*.test.ts
  - specs/tasks/TASK-537-G2-BUILD-REPRODUCIBILITY-CACHE-DRAINAGE.md
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
Define qualified reproducibility claims, cache lineage and residual runner/cache drainage semantics.

# Context
TASK-537 consumes TASK-535 material lineage and TASK-536 qualified execution context. A successful build or cache hit is insufficient proof of reproducibility and provider/runner substitution must retain residual populations until reconciled.

# Current behavior
No bounded contract represents reproducibility as a revision/environment/population-qualified claim while preserving cache provenance and residual runner/cache cohorts.

# Inputs / contracts
- TASK-535 dependency/material identity;
- TASK-536 runner/toolchain/input-boundary qualification;
- WP-01 evidence/currentness and WP-07 finite-flow/drainage semantics.

# Outputs / contracts
Reproducibility-claim, cache-lineage and residual-cohort contracts with explicit evidence/currentness/population qualification.

# Required change
Separate build success from reproducibility evidence; make cache provenance/currentness explicit; preserve runner/cache substitution epochs and residual populations until finite drainage/reconciliation.

# Acceptance criteria
- build success != reproducibility proof;
- cache hit != provenance/currentness proof;
- reproducibility is revision/environment/population qualified;
- PARTIAL/UNKNOWN/inconclusive evidence cannot become PASS;
- residual runner/cache cohorts require population/currentness evidence and explicit drainage/reconciliation.

# Negative/adversarial proof
Reject two successful builds=>reproducible without qualified comparison, cache hit=>trusted/current material, missing population=>drained and UNKNOWN=>retry/claim strengthening.

# Evidence expected
Deterministic Product Proof exercises positive qualified claims and negative stale-cache, missing-population, PARTIAL/UNKNOWN and residual-cohort cases.

# Escalation
Return to Sprint Review if closure requires concrete CI execution, registry/release adoption, deployment/runtime changes or operational tuning.

# Non-goals
Canonical artifact/release/SBOM lifecycle, deployment/runtime realization, concrete provider adapters or Production Readiness.