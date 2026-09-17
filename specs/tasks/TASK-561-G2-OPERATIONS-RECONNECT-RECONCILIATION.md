---
id: TASK-561
title: Reconcile operator effects after reconnect
status: blocked
priority: 561
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-18
sprint: G2-WP11-CONSTRUCTION-B-01
depends_on:
  - TASK-560
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-559-G2-OPERATIONS-ACK-EFFECT-SEMANTICS.md
  - specs/tasks/TASK-560-G2-OPERATIONS-AUTHORITY-SURFACE.md
  - packages/contracts/observability/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-561-G2-OPERATIONS-RECONNECT-RECONCILIATION.md
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
Define reconnect reconciliation for operator requests whose acknowledged outcome is not yet authoritatively known.

## Required change
Require reconciliation against qualified source/effect revision, currentness, locality and population evidence before retry or convergence claims. Preserve UNKNOWN -> reconcile-before-retry and prevent duplicate strengthening after disconnect/reconnect.

## Acceptance criteria
Product Proof covers reconnect with known convergence, stale evidence, partial population and unknown outcome; retries occur only after reconciliation establishes the authoritative disposition.

## Non-goals
No transport/provider implementation, persistence, workflow changes, WP-12/13 or Production Readiness claim.
