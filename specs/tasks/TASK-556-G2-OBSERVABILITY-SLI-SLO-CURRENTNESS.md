---
id: TASK-556
title: Define revisioned SLI SLO and telemetry currentness semantics
status: ready
priority: 556
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-17
sprint: G2-WP11-CONSTRUCTION-A-01
depends_on:
  - TASK-555
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-555-G2-OBSERVABILITY-SIGNAL-INCIDENT-IDENTITY.md
  - packages/contracts/observability/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-556-G2-OBSERVABILITY-SLI-SLO-CURRENTNESS.md
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
Extend TASK-555 with revision-qualified SLI/SLO and telemetry currentness/gap semantics.

## Context
This task follows completed TASK-555. G2-WBS-17 requires revision-qualified observability without hiding stale, missing, partial or UNKNOWN evidence.

## Current behavior
Signal/condition/alert/incident identities exist from TASK-555, but there is no G2-WBS-17 contract proving SLI/SLO revision history and telemetry currentness/gap semantics across populations.

## Required change
Keep SLI definition/revision, SLO target/revision and observed evidence distinct. Telemetry loss, backpressure, stale windows, missing populations and UNKNOWN cohorts remain explicit. Aggregates must not manufacture completeness or hide stale/unknown cohorts.

## Inputs / contracts
Consume TASK-555 observability identities and predecessor evidence/currentness contracts by reference; do not redefine their ownership.

## Outputs / contracts
Extend `packages/contracts/observability/**` with revision-qualified SLI/SLO and currentness/gap contracts and extend deterministic Product Proof in `tests/product/g2-observability-operations-proof.test.ts`.

## Acceptance criteria
Revision changes remain attributable; stale evidence and telemetry gaps remain visible; partial population coverage cannot be strengthened by aggregates; positive and negative predecessor-integration tests pass.

## Non-goals
No alerting vendor, dashboards, persistence, production threshold tuning, autonomous remediation or Production Readiness claim.

## Evidence expected
Deterministic tests covering revision changes, stale evidence, loss/backpressure and partial population coverage plus all frontmatter validation commands.

## Escalation
If currentness, revision or population cannot be established, retain PARTIAL/UNKNOWN explicitly and reconcile before retry rather than manufacturing complete evidence.
