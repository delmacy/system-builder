---
id: TASK-555
title: Define observability signal condition alert and incident identity semantics
status: READY
work_package: G2-WP-11
wbs: G2-WBS-17
sprint: G2-WP11-CONSTRUCTION-A-01
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - packages/contracts/**
  - tests/product/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-555-G2-OBSERVABILITY-SIGNAL-INCIDENT-IDENTITY.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
  - project_docs/generation-2/**
max_files: 8
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Establish provider-neutral G2-WBS-17 contracts for telemetry signal, evaluated condition, alert and incident identities without collapsing one state into another or converting observed evidence into canonical conflict/authority.

# Required behavior
Represent source/producer identity, producing revision, observed/effective time, locality/population and currentness where applicable. Preserve `Signal != ConfirmedConflict` and `signal != condition != alert != incident`. Missing/stale/UNKNOWN evidence must remain explicit and non-strengthening.

# Proof
Add deterministic positive and negative Product Proof showing distinct identities/transitions and rejection/non-strengthening of stale or insufficient evidence. Consume predecessor authority/evidence contracts by reference; do not duplicate their semantic ownership.

# Boundary
No persistence, UI, concrete telemetry provider/SDK, autonomous remediation, generic side-effect authority, WP-12/13 or Production Readiness claim.
