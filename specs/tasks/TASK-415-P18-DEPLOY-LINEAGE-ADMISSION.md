---
id: TASK-415
title: Integrate canonical Release lineage with Deployment consumer
status: ready
priority: 415
milestone: M18
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-414
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/P18-PACKAGE-03.md
  - project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
  - packages/release/**
  - packages/deploy/**
allowed_paths:
  - packages/deploy/**
  - tests/product/**
  - specs/tasks/TASK-415-P18-DEPLOY-LINEAGE-ADMISSION.md
forbidden_paths:
  - packages/contracts/process-versioning/**
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add an additive Deployment-side integration seam that consumes canonical process-versioning lineage and binds the existing deployment identity to the validated Release -> Deployment hop.

# Required change
Use the public canonical lineage plus the existing Release/Deploy module APIs. Preserve deployment execution semantics and existing callers.

# Acceptance criteria
- valid canonical Release -> Deployment lineage is accepted through a real Deploy API;
- release/deployment mismatches, forged hops and missing predecessors fail closed;
- existing Deploy behavior remains backward-compatible;
- no new autonomous deployment or business authority is introduced;
- declared validations pass.

# Non-goals
No process-versioning contract mutation, deployment execution changes, runtime/compiler changes, storage redesign or L4 work.
