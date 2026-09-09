---
id: TASK-496
title: Define deterministic authorization decision envelope
status: ready
priority: 496
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-495
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-IDENTITY-AUTHORITY-FOUNDATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-identity-authorization*.test.ts
  - specs/tasks/TASK-496-G2-AUTHORIZATION-DECISION.md
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
Define a deterministic authorization request/decision envelope separate from authentication.

# Context
TASK-495 supplies revision-pinned actor/authentication context but deliberately grants no authority.

# Current behavior
No G2 contract binds actor, action/resource/scope, authority-policy revision, evidence/currentness and locality into a deterministic authorization result.

# Inputs / contracts
TASK-495 actor context; exact authority/policy revision; explicit action/resource/scope and locality-qualified evidence.

# Outputs / contracts
Additive authorization request and decision structures with explicit `ALLOW`, `DENY` and `UNKNOWN` semantics and deterministic normalization.

# Required change
Create the minimum authorization envelope without embedding provider roles or runtime permission engines.

# Acceptance criteria
- authorization consumes but does not infer from authentication;
- decision pins exact authority revision and scope;
- UNKNOWN/stale/insufficient evidence cannot become ALLOW;
- locality/currentness cannot be strengthened;
- result normalization is deterministic.

# Negative/adversarial proof
Reject actor/revision/scope substitution, missing-policy defaults, authenticated=>allowed promotion and locality/currentness strengthening.

# Evidence expected
Focused positive/negative/adversarial Product Proof and declared validations on the exact head.

# Non-goals
Delegation, break-glass, provider mapping, runtime evaluator, persistence, trust/secrets/config/recovery.

# Escalation
Stop if authorization requires implicit grants, latest-wins policy or provider-owned authority.