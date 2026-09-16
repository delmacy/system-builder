---
id: TASK-557
title: Define population-qualified reconciliation evidence semantics
status: completed
priority: 557
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-17
sprint: G2-WP11-CONSTRUCTION-A-01
depends_on:
  - TASK-556
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-555-G2-OBSERVABILITY-SIGNAL-INCIDENT-IDENTITY.md
  - specs/tasks/TASK-556-G2-OBSERVABILITY-SLI-SLO-CURRENTNESS.md
  - packages/contracts/observability/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-557-G2-OBSERVABILITY-RECONCILIATION-EVIDENCE.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Define reconciliation-job and reconciliation-evidence contracts that qualify what population, locality, revision and currentness were actually checked.

## Context
This task follows TASK-556 and preserves G2-WBS-17 non-strengthening semantics across Local/Station/Fleet, partial populations and stale/UNKNOWN observations.

## Implemented change
Reconciliation jobs bind source/effect revisions, locality and intended population. Reconciliation evidence records intended, attempted and observed populations plus currentness, evidence state and disposition. Completeness requires exact job identity, revisions, locality, CURRENT/KNOWN evidence and full intended/attempted/observed population equality. Any mismatch, partial/stale evidence or UNKNOWN disposition yields UNKNOWN and requires reconcile-before-retry.

## Acceptance evidence
Deterministic Product Proof covers complete convergence, partial population, stale evidence, locality mismatch, revision mismatch and explicit UNKNOWN. No partial result implies global convergence and predecessor identity/currentness tests remain in the same proof suite.

## Non-goals
No actuation/remediation authority, persistence, provider-specific jobs, silent canonicalization, WP-12/13 or Production Readiness claim.
