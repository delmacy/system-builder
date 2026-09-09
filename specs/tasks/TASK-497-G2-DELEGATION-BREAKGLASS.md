---
id: TASK-497
title: Constrain delegation and break-glass authority without amplification
status: ready
priority: 497
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-496
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-IDENTITY-AUTHORITY-FOUNDATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-identity-authorization*.test.ts
  - specs/tasks/TASK-497-G2-DELEGATION-BREAKGLASS.md
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
Define bounded delegation and break-glass structural semantics that cannot amplify authority beyond the explicit source grant.

# Context
TASK-496 provides revision-pinned authorization decisions. Delegation and emergency access must remain explicit derived authority, not new canonical authority.

# Current behavior
No G2 public contract expresses delegation/break-glass provenance, scope/time bounds and source-authority ceilings.

# Inputs / contracts
TASK-496 authorization context, source authority revision, delegator/delegate identities, explicit scope/locality/time/evidence.

# Outputs / contracts
Additive bounded delegation and break-glass descriptors with source lineage, expiry, reason/evidence and non-amplification validation.

# Required change
Add deterministic structures proving delegated/emergency authority is a subset of explicit source authority and remains independently auditable.

# Acceptance criteria
- delegation pins source authority and identities;
- effective scope cannot exceed source scope/locality/time bounds;
- break-glass requires explicit reason/evidence/expiry and does not bypass owner semantics;
- UNKNOWN source authority cannot become effective grant;
- deterministic normalization preserves lineage.

# Negative/adversarial proof
Reject scope expansion, locality strengthening, expiry removal, source-revision substitution and emergency-access authority promotion.

# Evidence expected
Focused positive/adversarial Product Proof plus declared validations on the exact head.

# Non-goals
Runtime enforcement, provider role mapping, credential issuance, trust-store/secrets/config/recovery implementation.

# Escalation
Stop if emergency/delegated access requires authority not explicitly derived from a bounded source.