---
id: TASK-499
title: Prove integrated identity authorization and revocation semantics
status: ready
priority: 499
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-498
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-IDENTITY-AUTHORITY-FOUNDATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - tests/product/g2-identity-authorization*.test.ts
  - specs/tasks/TASK-499-G2-IDENTITY-AUTHORITY-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/db/**
max_files: 4
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with integrated positive, negative and adversarial Product Proof across TASK-495..498.

# Context
The predecessor chain establishes identity/authentication separation, explicit authorization, bounded delegation/break-glass and revocation residual cohorts.

# Current behavior
No integrated G2 proof demonstrates those invariants together on exact revisions/localities/currentness.

# Inputs / contracts
Canonical Construction A contracts from TASK-495..498 and predecessor WP-01/WP-02 identity/evidence primitives.

# Outputs / contracts
Focused Product Proof only; no new semantic ownership.

# Required change
Exercise the real contract chain and prove deterministic preservation plus adversarial rejection of authority amplification and false convergence.

# Acceptance criteria
- `authentication != authorization` across the integrated chain;
- exact identity/authority/source revisions and locality survive normalization;
- delegation/break-glass never exceed source authority;
- revocation acknowledgement never implies convergence;
- residual session/token/cache/offline cohorts stay visible;
- UNKNOWN/PARTIAL/stale evidence never strengthens to ALLOW or fully converged.

# Negative/adversarial proof
Cover identity/policy revision substitution, authenticated=>allowed promotion, delegation scope expansion, break-glass expiry/evidence removal, hidden residual cohorts, ack=>converged promotion and stale-authority resurrection.

# Evidence expected
Integrated focused Product Proof and all declared validations on the exact authoritative TASK head.

# Non-goals
Construction B trust/PKI/secrets/config/recovery, runtime/provider/persistence/UI/workflow/deployment, Production Readiness.

# Escalation
Stop if proof reveals a contract gap requiring predecessor mutation or unmaterialized scope.