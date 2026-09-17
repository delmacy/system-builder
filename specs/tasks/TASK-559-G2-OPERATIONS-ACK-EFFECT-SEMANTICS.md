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

## Required change
Define bounded authority/evidence semantics for request acknowledgement, accepted/observed effect, and converged effect. Preserve owner, revision and currentness; stale, PARTIAL or UNKNOWN evidence must not prove convergence. AI inference != authority.

## Acceptance criteria
Product Proof demonstrates ACK != effect and ACK != convergence, including negative stale/partial/unknown cases and reconcile-before-retry when outcome cannot be established.

## Non-goals
No UI, persistence, provider SDK, workflow changes, WP-12/13 or Production Readiness claim.
