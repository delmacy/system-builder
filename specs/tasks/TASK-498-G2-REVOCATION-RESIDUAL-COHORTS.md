---
id: TASK-498
title: Model revocation deprovision and residual authority cohorts
status: ready
priority: 498
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-497
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-IDENTITY-AUTHORITY-FOUNDATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-identity-authorization*.test.ts
  - specs/tasks/TASK-498-G2-REVOCATION-RESIDUAL-COHORTS.md
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
Define revision-pinned revocation/deprovision state and explicit residual authority cohorts without pretending acknowledgement equals convergence.

# Context
TASK-497 establishes bounded derived authority. WP-04 closure requires revoked/deprovisioned authority to remain visible across sessions, tokens, caches and offline cohorts until drained/reconciled.

# Current behavior
No G2 contract distinguishes revocation intent, observed/effective authority state and residual cohorts.

# Inputs / contracts
Identity/authority revisions from TASK-495..497; explicit revocation/deprovision occurrence, population/locality/currentness and residual cohort evidence.

# Outputs / contracts
Additive revocation state, convergence status and residual-cohort descriptors preserving UNKNOWN/PARTIAL.

# Required change
Represent desired revoked/deprovisioned state separately from observed/effective state and enumerate unresolved session/token/cache/offline cohorts with evidence/currentness/locality.

# Acceptance criteria
- revocation/deprovision pins identity/authority revision;
- acknowledgement is not convergence;
- residual cohorts remain explicit until drained/reconciled;
- UNKNOWN/PARTIAL cannot become fully revoked;
- stale authority cannot be resurrected through revision substitution.

# Negative/adversarial proof
Reject ack=>converged promotion, hidden residual cohorts, zero-default cohort counts, locality strengthening and stale-revision resurrection.

# Evidence expected
Focused positive/adversarial Product Proof plus declared validations on the exact head.

# Non-goals
Token/session termination implementation, cache invalidation engine, offline transport, PKI/secret rotation/recovery implementation, persistence/runtime/provider behavior.

# Escalation
Stop if convergence cannot be represented without hiding unresolved cohorts.