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
This task follows TASK-556 and must preserve G2-WBS-17 non-strengthening semantics across Local/Station/Fleet, partial populations and stale/UNKNOWN observations.

## Current behavior
The preceding observability tasks establish identity and currentness semantics, but no G2-WBS-17 reconciliation evidence contract yet proves the exact population/locality/revision/currentness actually observed.

## Required change
A reconciliation result must not imply global convergence from partial coverage. Preserve Local/Station/Fleet distinctions, source/effect revisions, attempted/observed populations, gaps and UNKNOWN outcomes. Where ambiguity prevents safe retry or disposition, preserve `UNKNOWN -> reconcile-before-retry` semantics.

## Inputs / contracts
Consume TASK-555 identity and TASK-556 SLI/SLO/currentness contracts plus predecessor authority/evidence/locality contracts by reference.

## Outputs / contracts
Extend `packages/contracts/observability/**` with population/currentness/locality-qualified reconciliation-job and reconciliation-evidence contracts and extend deterministic Product Proof.

## Acceptance criteria
Partial populations, stale evidence, locality mismatch and UNKNOWN reconciliation outcomes remain explicit; no partial result implies global convergence; source/effect revisions remain attributable; predecessor-integration tests pass.

## Non-goals
No actuation/remediation authority, persistence, provider-specific jobs, silent canonicalization, WP-12/13 or Production Readiness claim.

## Evidence expected
Deterministic positive and negative tests for partial populations, stale evidence, locality mismatch and explicit unknown reconciliation outcomes plus all frontmatter validation commands.

## Escalation
When population, locality, revision or currentness is insufficient to support a safe disposition, return UNKNOWN and require reconciliation before retry; never infer convergence or authority.
