---
id: TASK-576
title: Qualify Product Proof evidence by revision population currentness and locality
status: completed
priority: 576
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-575
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP13-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/product-proof/**
allowed_paths:
  - packages/contracts/product-proof/**
  - tests/product/g2-product-proof-architecture-proof.test.ts
  - specs/tasks/TASK-576-G2-PRODUCT-PROOF-QUALIFICATION.md
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
Add evidence qualification semantics required by G2-WBS-24 without strengthening producer truth.

## Context
TASK-576 follows the producer-owned obligation/evidence-route registry and qualifies routed evidence without taking semantic ownership from its producer.

## Current behavior
TASK-575 establishes the registry boundary; TASK-576 adds explicit revision, population, currentness, locality and provenance qualification before evidence can support stronger claims.

## Required change
Qualify proof evidence by revision, population, currentness, locality and provenance; preserve PASS/PARTIAL/INCONCLUSIVE/BLOCKED/FAIL/NA/DEFERRED explicitly and reject stale, mismatched or underqualified evidence for stronger claims.

## Inputs / contracts
TASK-575 obligation/evidence-route contracts and producer-owned evidence carrying its original identity, revision, provenance and authority status.

## Outputs / contracts
Deterministic evidence-qualification contracts expose compatibility/currentness/locality outcomes without strengthening producer truth or fabricating missing evidence.

## Acceptance criteria
Evidence from one revision/population/locality cannot prove another by implication. PARTIAL/UNKNOWN/INCONCLUSIVE remain non-strengthening. Stale evidence is visible. Owner authority and provenance survive routing. Unresolved critical proof obligations block acceptance.

## Non-goals
No readiness score, architecture remediation, deployment or canonicalization of inferred evidence.

## Evidence expected
Positive and adversarial Product Proof covers stale, mismatched, partial, inconclusive and unknown evidence qualification.

## Escalation
Any qualification need requiring a readiness score, inferred-evidence canonicalization, deployment, architecture remediation or scope outside G2-WBS-24 remains a finding for explicit materialization.
