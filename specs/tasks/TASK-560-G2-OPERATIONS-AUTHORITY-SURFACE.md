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

## Context
TASK-559 establishes bounded acknowledgement/effect/convergence semantics. TASK-560 carries those semantics into operator-facing projections without allowing a surface to become a new source of authority.

## Current behavior
The materialized G2-WBS-18 horizon requires authority-preserving operator surfaces, but no bounded contract yet specifies how owner, revision, currentness and evidence disposition survive projection.

## Required change
Carry owner/revision/currentness and evidence disposition through operator-facing projections. Preserve PARTIAL/UNKNOWN and explicit authority boundaries; AI inference remains advisory and non-authoritative.

## Inputs / contracts
Use TASK-559 and existing observability contracts as authoritative inputs. Preserve source identity, owner, revision, currentness, locality/population qualification and evidence disposition without strengthening projection state.

## Outputs / contracts
Produce only bounded observability contract additions and Product Proof needed to represent authority-preserving operator projections. Do not implement concrete UI, persistence, provider SDK or workflow authority.

## Acceptance criteria
Product Proof demonstrates that operator surfaces cannot transform inferred, stale, partial or unknown observations into authoritative state or converged effect.

## Non-goals
No concrete UI implementation, persistence, provider SDK, workflow changes, WP-12/13 or Production Readiness claim.

## Evidence expected
Deterministic Product Proof covers authoritative projection and negative/adversarial stale, PARTIAL, UNKNOWN and inferred cases, proving presentation does not strengthen evidence or action eligibility. Repository verification, task checks, architecture checks and typecheck remain green.

## Escalation
Stop and fail closed if preserving operator-surface semantics requires concrete UI/provider/persistence/workflow authority, strengthens stale/PARTIAL/UNKNOWN/inferred evidence, or crosses G2-WBS-18 boundaries. Such findings require separate materialization.