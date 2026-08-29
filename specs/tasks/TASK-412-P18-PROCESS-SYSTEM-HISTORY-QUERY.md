---
id: TASK-412
title: Compose deterministic complete process-to-system history query
status: ready
priority: 412
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-411
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-03.md
  - project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-412-P18-PROCESS-SYSTEM-HISTORY-QUERY.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Satisfy WBS 18.3.3 at the public-contract layer by deterministically composing and querying complete lineage for a selected canonical process revision.

# Required change
Provide a payload-minimal deterministic composition/query surface that returns the exact ordered process revision -> analysis -> definition -> release -> deployment lineage and rejects incomplete or ambiguous history.

# Acceptance criteria
- lookup is anchored by canonical process artifact/revision identity;
- returned lineage order is deterministic and complete;
- missing hop, duplicate conflicting hop, cycle/reversal, cross-artifact substitution and ambiguous result fail closed;
- no persistence/topology assumptions leak into the public contract;
- declared validations pass.

# Non-goals
No storage implementation, database migration, release/deploy mutation or UI/API product surface.

# Evidence expected
Positive complete-history proof plus negative incomplete/ambiguous/conflicting-history tests.

# Escalation
Stop for persistence redesign, cross-context ownership change or undeclared L4.