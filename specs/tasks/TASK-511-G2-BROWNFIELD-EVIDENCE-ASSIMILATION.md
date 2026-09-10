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

# Context
TASK-511 follows TASK-510 and applies the package evidence/currentness and authority boundaries to pre-existing systems and assets without treating discovery as canonical truth.

# Current behavior
No G2 Brownfield contract currently distinguishes observed, inferred and authoritative facts while preserving stale/conflicting/UNKNOWN evidence through reconciliation.

# Inputs / contracts
TASK-510 qualification semantics, pinned G2 evidence/currentness and authority contracts, discovered assets/bindings/configuration, provenance, owner, revision and locality evidence.

# Outputs / contracts
A Brownfield evidence/assimilation contract that records observations and inference separately from authoritative state and requires explicit reconciliation for authority-sensitive changes.

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

# Evidence expected
Product Proof covers happy assimilation plus conflicting, stale, UNKNOWN, inferred and missing-evidence cases; exact-head validation commands pass.

# Escalation
Escalate if reconciliation requires a concrete scanner/importer, vendor API, migration execution or authority not already materialized. Preserve uncertainty rather than guessing.

# Non-goals
Concrete scanners/importers, vendor APIs, migration execution or Production Readiness.