---
id: TASK-560
title: Preserve authority on operator surfaces
status: blocked
priority: 560
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-18
sprint: G2-WP11-CONSTRUCTION-B-01
depends_on:
  - TASK-559
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-559-G2-OPERATIONS-ACK-EFFECT-SEMANTICS.md
  - packages/contracts/observability/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-560-G2-OPERATIONS-AUTHORITY-SURFACE.md
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
Define operator-surface contracts that preserve source authority and evidence qualification without allowing presentation or interaction layers to invent stronger state.

## Required change
Carry owner/revision/currentness and evidence disposition through operator-facing projections. Preserve PARTIAL/UNKNOWN and explicit authority boundaries; AI inference remains advisory and non-authoritative.

## Acceptance criteria
Product Proof demonstrates that operator surfaces cannot transform inferred, stale, partial or unknown observations into authoritative state or converged effect.

## Non-goals
No concrete UI implementation, persistence, provider SDK, workflow changes, WP-12/13 or Production Readiness claim.
