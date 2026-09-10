---
id: TASK-506
title: Qualify presence units precision defaults and lossy transformations
status: blocked
priority: 506
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-505
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-05-CANONICAL-DATA-SCHEMA-MIGRATION.md
  - packages/contracts/data-schema/**
allowed_paths:
  - packages/contracts/data-schema/**
  - tests/product/g2-data-schema-migration*.test.ts
  - specs/tasks/TASK-506-G2-DATA-TRANSFORMATION-SEMANTICS.md
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
Define qualified field transformation semantics preserving presence, units, precision, rounding and lossiness.

# Context
TASK-505 establishes canonical schema revisions and direction-qualified compatibility; transformations must not manufacture semantic equivalence.

# Current behavior
No WP-05 contract yet distinguishes all required presence intents or qualifies unit/precision/default/lossy transformations against schema revisions.

# Inputs / contracts
Consume TASK-505 schema revision/compatibility references and WP-03 units/precision semantics.

# Outputs / contracts
Produce deterministic transformation descriptors/evidence under `packages/contracts/data-schema/**` with explicit presence and lossiness qualification.

# Required change
Represent `ABSENT`, `NULL`, `DEFAULT`, `DELETE` distinctly and qualify unit conversion, precision/rounding, default injection and lossy mapping by revisions/evidence.

# Acceptance criteria
- presence intents remain non-interchangeable;
- default application is explicit, revision-qualified behavior;
- unit conversion cannot drop dimension/basis;
- precision/rounding is explicit;
- lossy transformation cannot be reported as lossless/fully compatible.

# Negative/adversarial proof
Reject ABSENT->NULL, NULL->DEFAULT, DELETE->ABSENT strengthening, undeclared unit/precision coercion, hidden default injection and lossiness promotion.

# Evidence expected
Focused Product Proof and declared exact-head validations.

# Non-goals
Data migration execution, SQL/ORM schemas, ETL engines or provider mechanics.

# Escalation
Stop on required concrete persistence/runtime work.