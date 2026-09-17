---
id: TASK-559
title: Separate operator acknowledgement from converged effect
status: ready
priority: 559
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-18
sprint: G2-WP11-CONSTRUCTION-B-01
depends_on:
  - TASK-558
context_paths:
  - AGENTS.md
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-559-G2-OPERATIONS-ACK-EFFECT-SEMANTICS.md
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
Materialize the first G2-WBS-18 operator-control contract so acknowledgement of an operator request can never be strengthened into evidence that the requested effect converged.

## Context
Construction A established observability and reconciliation evidence semantics. Construction B now introduces bounded operator-control semantics while preserving the existing authority, lineage, currentness, PARTIAL/UNKNOWN and non-strengthening invariants.

## Current behavior
The repository has observability and reconciliation evidence contracts, but no bounded operator-control contract that explicitly separates request acknowledgement, observed effect and converged effect.

## Required change
Define bounded authority/evidence semantics for request acknowledgement, accepted/observed effect, and converged effect. Preserve owner, revision and currentness; stale, PARTIAL or UNKNOWN evidence must not prove convergence. AI inference != authority.

## Inputs / contracts
Use the existing observability contracts under `packages/contracts/observability/**`, the integrated Construction A semantics, and the G2-WBS-18 materialized authority. TASK-558 is the required completed predecessor.

## Outputs / contracts
Produce only the bounded observability contract additions needed to represent acknowledgement, effect observation and convergence evidence, plus Product Proof coverage at `tests/product/g2-observability-operations-proof.test.ts`. Do not create provider, persistence, UI or workflow authority.

## Acceptance criteria
Product Proof demonstrates ACK != effect and ACK != convergence, including negative stale/partial/unknown cases and reconcile-before-retry when outcome cannot be established.

## Non-goals
No UI, persistence, provider SDK, workflow changes, WP-12/13 or Production Readiness claim.

## Evidence expected
Deterministic Product Proof must exercise the happy acknowledgement-to-converged-effect path while proving acknowledgement alone cannot establish effect or convergence. Negative/adversarial evidence must cover stale, PARTIAL and UNKNOWN observations and preserve reconcile-before-retry when the effect cannot be established. Repository verification, task checks, architecture checks and typecheck must remain green.

## Escalation
Stop and fail closed if the implementation would require authority outside G2-WBS-18, strengthen PARTIAL/UNKNOWN or stale evidence into convergence, treat AI inference as authority, or require changes to forbidden paths. Such findings remain outside this task unless separately materialized.
