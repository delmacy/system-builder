---
id: TASK-568
title: Define subscription and commercial entitlement semantics
status: ready
priority: 568
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-567
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-567-G2-COMMERCIAL-CATALOG-PRICING-CONTRACT.md
  - packages/contracts/commercial/**
  - packages/contracts/governance/**
allowed_paths:
  - packages/contracts/commercial/**
  - tests/product/g2-commercial-entitlement-proof.test.ts
  - specs/tasks/TASK-568-G2-SUBSCRIPTION-ENTITLEMENT-SEMANTICS.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
  - project_docs/generation-2/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Extend G2-WBS-20 with revision/scope/currentness-qualified subscription and commercial entitlement contracts without acquiring operational authorization ownership.

## Context
TASK-568 follows the qualified catalog/pricing/contract boundary from TASK-567 and must preserve the pre-existing governance/currentness separation between evidence and authority.

## Current behavior
Before this task, G2-WBS-20 has no materialized subscription/entitlement contract proving that a commercial grant remains distinct from runtime operational authorization.

## Required change
Define subscription state and entitlement grant/restriction semantics tied to qualified customer contract facts. Preserve effective time, revision, scope and provenance; expired, revoked, stale, conflicting, PARTIAL or UNKNOWN entitlement evidence must not strengthen access.

## Inputs / contracts
Consume qualified customer-contract facts from TASK-567 plus governance/currentness facts. Expiry, revocation, scope, revision, provenance and effective-time qualification are mandatory inputs where applicable.

## Outputs / contracts
Produce deterministic subscription and commercial-entitlement contracts/evaluations that expose conservative status without issuing or replacing operational authorization decisions.

## Acceptance criteria
Contract != subscription != entitlement and commercial entitlement != operational authorization. Entitlement evaluation is deterministic, revision/scope/currentness qualified and conservative for PARTIAL/UNKNOWN. Provider or billing evidence cannot silently become authorization authority.

## Non-goals
No runtime authorization/enforcement engine, identity/RBAC replacement, usage rating, invoice/payment integration, persistence/UI, FinOps, WP-13 or Production Readiness claim.

## Evidence expected
Positive, negative and adversarial Product Proof including expiry/revocation, stale/conflicting revisions and explicit proof that commercial entitlement cannot directly authorize an operation.

## Escalation
Escalate rather than infer if the work would require operational authorization/enforcement ownership, identity replacement, provider SDKs, persistence/UI, FinOps/G2-WBS-21, WP-13 or other unmaterialized scope.
