---
id: TASK-393
title: Compose deterministic process revision lineage
status: ready
priority: 393
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-391
  - TASK-392
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-393-P18-REVISION-LINEAGE-COMPOSITION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose WBS 18.1 identity, immutable-publication and lifecycle truth into deterministic revision lineage validation.

# Required change
Provide a payload-minimal composition/validator proving revisions belong to the same stable artifact identity, immutable publication evidence remains consistent and supersession/lifecycle references form a non-contradictory bounded lineage.

# Acceptance criteria
- lineage across multiple revisions preserves one stable artifact identity;
- conflicting immutable evidence, cross-artifact supersession, cycles/self-reference and contradictory lifecycle fail closed;
- composition does not calculate semantic diff or infer breaking changes;
- declared validations pass.

# Non-goals
No WBS 18.2 semantic-change classification, approval/evidence workflow or WBS 18.3 software lineage.

# Evidence expected
Multi-revision positive proof plus forged/cross-artifact/cyclic negative cases.

# Escalation
Stop for semantic-diff policy invention, storage redesign or undeclared L4.