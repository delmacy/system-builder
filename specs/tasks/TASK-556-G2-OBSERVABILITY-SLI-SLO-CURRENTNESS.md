---
id: TASK-556
title: Define revisioned SLI SLO and telemetry currentness semantics
status: blocked
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

# Required behavior
Keep SLI definition/revision, SLO target/revision and observed evidence distinct. Telemetry loss, backpressure, stale windows, missing populations and UNKNOWN cohorts remain explicit. Aggregates must not manufacture completeness or hide stale/unknown cohorts.

# Proof
Add deterministic positive/negative predecessor-integration tests covering revision changes, stale evidence and partial population coverage.

# Boundary
No alerting vendor, dashboards, persistence, production threshold tuning or Production Readiness claim.
