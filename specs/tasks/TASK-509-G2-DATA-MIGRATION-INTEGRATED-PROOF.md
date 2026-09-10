---
id: TASK-509
title: Prove integrated canonical data schema and source migration semantics
status: blocked
priority: 509
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-508
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-05-CANONICAL-DATA-SCHEMA-MIGRATION.md
  - packages/contracts/data-schema/**
allowed_paths:
  - tests/product/g2-data-schema-migration*.test.ts
  - specs/tasks/TASK-509-G2-DATA-MIGRATION-INTEGRATED-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 3
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with integrated Product Proof across TASK-505..508 without new semantic ownership.

# Context
The predecessor tasks define schema compatibility, transformation, coexistence/populations and source-of-truth movement as separate but linked proof domains.

# Current behavior
Focused predecessor proofs do not yet demonstrate the complete migration chain adversarially across revision/currentness/population/fencing boundaries.

# Inputs / contracts
Consume only integrated public contracts from TASK-505..508 and existing semantic/evidence/authority primitives.

# Outputs / contracts
Produce an integrated Product Proof test covering positive, negative, adversarial and recovery paths; no product contract changes unless a bounded predecessor defect is discovered and separately attributed.

# Required change
Prove end-to-end non-strengthening across schema revisions, transformations, coexistence, source transfer, backfill/CDC lineage, fencing and residual drainage.

# Acceptance criteria
- `ABSENT != NULL != DEFAULT != DELETE` across the integrated path;
- directional read/write compatibility is preserved;
- historical producing revisions survive migration;
- exactly one canonical truth is authoritative per scope/epoch;
- migration execution/success/ACK do not imply convergence;
- PARTIAL/UNKNOWN and residual cohorts cannot be hidden or promoted;
- stale/fenced sources cannot resurrect canonical authority.

# Negative/adversarial proof
Exercise revision substitution, direction reversal, hidden lossiness/defaults, historical reinterpretation, dual-canonical ownership, fencing reuse, lineage loss, hidden residuals, UNKNOWN=>zero and migration-success=>convergence.

# Evidence expected
Integrated Product Proof plus all exact-head validations.

# Non-goals
Production Readiness, concrete DB/provider/runtime migration or WP-06+ integration.

# Escalation
Stop and attribute any discovered contract defect to its owning predecessor TASK boundary.