---
id: TASK-507
title: Model historical current reader writer coexistence and populations
status: blocked
priority: 507
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-506
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-05-CANONICAL-DATA-SCHEMA-MIGRATION.md
  - packages/contracts/data-schema/**
allowed_paths:
  - packages/contracts/data-schema/**
  - tests/product/g2-data-schema-migration*.test.ts
  - specs/tasks/TASK-507-G2-READER-WRITER-COEXISTENCE.md
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
Model coexistence of old/new readers and writers over historical/current populations without reinterpreting stored history through latest schema semantics.

# Context
TASK-505/506 establish revision compatibility and qualified transformations; migration safety additionally requires explicit consumer/producer populations and currentness.

# Current behavior
No WP-05 contract currently represents reader/writer cohorts, producing revisions and compatibility currentness as separate facts.

# Inputs / contracts
Consume TASK-505 schema/compatibility claims and TASK-506 transformation descriptors.

# Outputs / contracts
Add deterministic coexistence/population/currentness structures and residual reader/writer cohort evidence.

# Required change
Represent producer and consumer revision cohorts, historical producing revision, currentness horizon/locality and compatibility state independently.

# Acceptance criteria
- historical records retain producing schema/source revision;
- reader and writer cohorts are population-qualified;
- currentness is not globalized across locality/population;
- UNKNOWN/PARTIAL cohort size remains explicit;
- latest revision never silently reinterprets in-flight/historical data.

# Negative/adversarial proof
Reject latest-revision substitution, hidden residual readers/writers, UNKNOWN population as zero, locality strengthening and compatibility evidence reuse outside its currentness horizon.

# Evidence expected
Focused Product Proof and declared exact-head validations.

# Non-goals
Runtime routing, DB rollout, application deployment or queue mechanics.

# Escalation
Stop if safe modeling requires concrete rollout/runtime implementation.