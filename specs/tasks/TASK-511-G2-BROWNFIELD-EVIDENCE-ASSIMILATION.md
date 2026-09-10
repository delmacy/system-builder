---
id: TASK-511
title: Define evidence-first Brownfield inventory and assimilation
status: blocked
priority: 511
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-510
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/brownfield/**
  - tests/product/g2-brownfield*.test.ts
  - specs/tasks/TASK-511-G2-BROWNFIELD-EVIDENCE-ASSIMILATION.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define Brownfield inventory/assimilation as evidence-first discovery with provenance, owner, revision, currentness and explicit uncertainty.

# Required change
Model discovered assets/bindings/configuration as evidence that can be reconciled into authoritative state only through explicit authority rules. Preserve PARTIAL/UNKNOWN and distinguish observed, inferred and authoritative facts.

# Acceptance criteria
- discovery/inference never becomes authority implicitly;
- evidence records provenance, owner/revision/currentness and locality where applicable;
- conflicting/stale/UNKNOWN observations remain visible;
- reconcile-before-retry applies when UNKNOWN could change an authority-sensitive decision;
- assimilation does not silently replace existing canonical truth.

# Negative/adversarial proof
Reject scan=>authority, AI inference=>fact, stale observation=>current state and missing evidence=>absence.

# Non-goals
Concrete scanners/importers, vendor APIs, migration execution or Production Readiness.