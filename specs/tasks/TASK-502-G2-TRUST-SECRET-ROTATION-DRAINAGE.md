---
id: TASK-502
title: Model trust and secret rotation adoption and residual drainage
status: verification
priority: 502
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-501
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-trust-secrets-recovery*.test.ts
  - specs/tasks/TASK-502-G2-TRUST-SECRET-ROTATION-DRAINAGE.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/db/**
max_files: 6
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Model rotation/revocation as population-qualified convergence with explicit old-generation residual cohorts across trust and secret/config semantics.

# Context
TASK-500 and TASK-501 establish qualified trust and secret/config effective-state lineage. Rotation must preserve those revisions/generations rather than collapse provider acknowledgement into system convergence.

# Current behavior
No Construction B contract yet models coexistence of old/new generations, verifier/consumer adoption, residual cohorts and drainage as distinct evidence-bearing states.

# Inputs / contracts
Consume TASK-500 trust generations/status and TASK-501 secret/config desired/materialized/effective lineage together with explicit population, locality and currentness evidence.

# Outputs / contracts
Produce deterministic rotation/revocation intent, adoption, residual-cohort and drainage/convergence structures without performing provider/runtime rotation.

# Required change
Add deterministic intent/adoption/drainage structures that separate new-generation creation/distribution acknowledgement from verifier/consumer adoption, old-generation fencing/revocation and residual drainage.

# Acceptance criteria
- rotation/revocation request != provider ACK != consumer/verifier adoption != convergence;
- old and new generations may coexist explicitly during overlap;
- residual verifier/consumer/cache/offline/recovery populations carry identity, generation, population/currentness/locality and disposition;
- zero or omitted population cannot manufacture complete drainage when population is UNKNOWN;
- CONVERGED requires eligible population evidence at the intended revisions/generations and no unresolved authoritative residual cohort;
- stale/UNKNOWN evidence cannot be promoted to complete/current.

# Negative/adversarial proof
Reject acknowledgement=>convergence, hidden residual generation, unknown population=>zero, wrong-generation adoption, Station=>Fleet strengthening, provider-version substitution and stale-generation resurrection.

# Evidence expected
Focused Product Proof and all declared exact-head validations.

# Non-goals
Actual provider rotation/revocation, key generation, secret generation/storage, cache invalidation, offline transport, runtime reloads, provider cutover or Production Readiness.

# Escalation
Stop if convergence proof requires concrete runtime/provider mutation rather than portable structural semantics.
