---
id: TASK-508
title: Define source of truth transfer fencing and lineage preserving migration
status: blocked
priority: 508
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-507
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-05-CANONICAL-DATA-SCHEMA-MIGRATION.md
  - packages/contracts/data-schema/**
allowed_paths:
  - packages/contracts/data-schema/**
  - tests/product/g2-data-schema-migration*.test.ts
  - specs/tasks/TASK-508-G2-SOURCE-OF-TRUTH-CUTOVER.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 7
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define explicit source-of-truth ownership transfer, fencing, coexistence, backfill/CDC/dual-write lineage and residual drainage semantics.

# Context
TASK-507 exposes old/new reader-writer populations. Source-of-truth movement must not infer convergence from migration activity or acknowledgements.

# Current behavior
No WP-05 portable contract currently separates migration intent/execution from canonical source ownership, cutover fencing, observed adoption and residual convergence.

# Inputs / contracts
Consume TASK-505..507 schema revision, transformation, population/currentness/coexistence structures plus existing authority/evidence references.

# Outputs / contracts
Produce deterministic migration/source authority, cutover/fencing, replication/backfill lineage, acknowledgement/adoption/convergence and residual cohort structures.

# Required change
Model exactly one canonical source authority per qualified scope/epoch while allowing bounded coexistence/shadow/dual-write; preserve source+target lineage across backfill/CDC and require reconciliation/drainage before convergence.

# Acceptance criteria
- dual-write never establishes two canonical truths;
- source transfer is authority/scope/epoch explicit;
- backfill/CDC retain source and producing revision lineage;
- ACK/execution/success remain distinct from adoption/convergence;
- residual source/reader/writer/replication cohorts remain visible, including UNKNOWN populations;
- stale fenced writers cannot reacquire authority.

# Negative/adversarial proof
Reject two canonical owners, fencing-epoch reuse, stale-writer resurrection, lineage-free backfill/CDC, ACK=>convergence, hidden residuals and UNKNOWN=>zero.

# Evidence expected
Focused positive/negative/adversarial/recovery Product Proof and declared exact-head validations.

# Non-goals
Concrete CDC engine, SQL migration, provider cutover, persistence mutation or deployment.

# Escalation
Stop if implementation requires concrete source/provider runtime ownership transfer.