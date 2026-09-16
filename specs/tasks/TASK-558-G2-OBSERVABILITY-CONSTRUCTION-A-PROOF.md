---
id: TASK-558
title: Close G2-WBS-17 Construction A integrated Product Proof
status: ready
priority: 558
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-17
sprint: G2-WP11-CONSTRUCTION-A-01
depends_on:
  - TASK-557
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-555-G2-OBSERVABILITY-SIGNAL-INCIDENT-IDENTITY.md
  - specs/tasks/TASK-556-G2-OBSERVABILITY-SLI-SLO-CURRENTNESS.md
  - specs/tasks/TASK-557-G2-OBSERVABILITY-RECONCILIATION-EVIDENCE.md
  - packages/contracts/observability/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-558-G2-OBSERVABILITY-CONSTRUCTION-A-PROOF.md
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
Close the first G2-WP-11 Construction Sprint with deterministic integrated Product Proof across TASK-555..557 without introducing new semantic ownership.

## Context
This proof task follows completed and integrated TASK-557 and integrates only already materialized G2-WBS-17 behavior. Product Proof remains distinct from Production Readiness.

## Current behavior
TASK-555..557 establish observability identity, revision/currentness and reconciliation evidence semantics, but Construction A is not complete until their obligations are proven together without semantic strengthening.

## Required change
Integrate proof that `Signal != ConfirmedConflict`; signal/condition/alert/incident remain distinct; SLI/SLO history is revision-qualified; telemetry gaps/loss/backpressure/currentness and stale/UNKNOWN cohorts remain visible; aggregates cannot strengthen partial evidence; reconciliation evidence is population/currentness/locality qualified; AI inference != authority.

## Inputs / contracts
Consume the completed outputs of TASK-555, TASK-556 and TASK-557 exactly as materialized, plus predecessor authority/evidence contracts by reference.

## Outputs / contracts
Provide integrated deterministic Product Proof in `tests/product/g2-observability-operations-proof.test.ts` and only bounded contract adjustments required to make the already-owned G2-WBS-17 semantics coherent.

## Acceptance criteria
All Construction A obligations are jointly proven; negative cases prevent stale, partial or inferred evidence from strengthening into authority, confirmed conflict or global convergence; all validation commands pass.

## Non-goals
No G2-WBS-18 materialization, WP-12/13, operator actuation, provider SDKs, persistence, new semantic ownership or Production Readiness claim.

## Evidence expected
Deterministic integrated positive/negative Product Proof across TASK-555..557 plus all frontmatter validation commands, with exact-head CI required before integration.

## Escalation
Any contradiction between predecessor semantics must remain explicit and bounded to G2-WBS-17 reconciliation; do not resolve ambiguity by inventing authority, suppressing UNKNOWN or absorbing forecast/deferred scope.
