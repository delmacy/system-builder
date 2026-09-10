---
id: TASK-505
title: Define canonical schema identity revision and directional compatibility
status: ready
priority: 505
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-504
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-05-CANONICAL-DATA-SCHEMA-MIGRATION.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/data-schema/**
  - tests/product/g2-data-schema-migration*.test.ts
  - specs/tasks/TASK-505-G2-SCHEMA-IDENTITY-COMPATIBILITY.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define portable canonical schema identity/revision references and explicit directional reader/writer compatibility without executing migrations.

# Context
WP-01 supplies identity/revision/currentness; WP-03 supplies analytical semantics; WP-04 supplies authority/trust qualification where sensitive mutation applies.

# Current behavior
The repository lacks a G2-WP-05 portable contract that prevents schema identity, revision and bidirectional compatibility from being collapsed.

# Inputs / contracts
Consume existing semantic identity/revision/evidence/currentness/locality contracts only; provider/database-native schema IDs are realization evidence, not canonical identity.

# Outputs / contracts
Add deterministic additive contracts for canonical schema definitions/revisions and direction-qualified reader/writer compatibility under `packages/contracts/data-schema/**` with focused Product Proof.

# Required change
Model immutable/historically addressable schema revisions and compatibility claims qualified by source revision, target revision, operation direction, evidence/currentness and declared population.

# Acceptance criteria
- schema identity is stable across revision/provider churn;
- compatibility is directional and cannot infer reverse compatibility;
- read and write compatibility remain distinct;
- historical producing revision remains addressable;
- UNKNOWN/PARTIAL/INCONCLUSIVE evidence is not promoted to compatible.

# Negative/adversarial proof
Reject revision substitution, provider-id canonicalization, direction reversal, read-to-write strengthening and stale/UNKNOWN compatibility promotion.

# Evidence expected
Focused Product Proof and all declared validations on the exact authoritative TASK head.

# Non-goals
Database/ORM migrations, provider adapters, persistence, deployment, runtime cutover or Production Readiness.

# Escalation
Stop if the contract requires concrete DB/provider realization or transfers ownership outside G2-WBS-05.