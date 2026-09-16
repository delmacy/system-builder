---
id: TASK-557
title: Define population-qualified reconciliation evidence semantics
status: BLOCKED
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
  - npm run verify
---

# Objective
Define reconciliation-job and reconciliation-evidence contracts that qualify what population/locality/revision/currentness was actually checked.

# Required behavior
A reconciliation result must not imply global convergence from partial coverage. Preserve Local/Station/Fleet distinctions, source/effect revisions, attempted/observed populations, gaps and UNKNOWN outcomes. Where ambiguity prevents safe retry or disposition, preserve `UNKNOWN -> reconcile-before-retry` semantics.

# Proof
Add deterministic positive/negative predecessor-integration tests for partial populations, stale evidence, locality mismatch and explicit unknown reconciliation outcomes.

# Boundary
No actuation/remediation authority, persistence, provider-specific jobs or silent canonicalization.
