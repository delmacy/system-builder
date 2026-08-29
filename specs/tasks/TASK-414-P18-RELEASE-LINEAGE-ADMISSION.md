---
id: TASK-414
title: Integrate canonical SystemDefinition lineage with Release consumer
status: ready
priority: 414
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/P18-PACKAGE-03.md
  - project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
  - packages/contracts/system-definition/**
  - packages/release/**
allowed_paths:
  - packages/release/**
  - tests/product/**
  - specs/tasks/TASK-414-P18-RELEASE-LINEAGE-ADMISSION.md
forbidden_paths:
  - packages/contracts/process-versioning/**
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add an additive Release-side integration seam that consumes the canonical process-versioning lineage and binds an existing Release identity to the validated SystemDefinition -> Release hop.

# Required change
Use public process-versioning exports from the existing Release bounded context. Do not reproduce lineage validation locally. Preserve all existing Release APIs and evidence behavior.

# Acceptance criteria
- a valid canonical SystemDefinition -> Release lineage is accepted through a real Release API;
- mismatched or forged definition/release identifiers fail closed;
- existing Release callers remain backward-compatible;
- Git/PR/model/ADR metadata cannot substitute canonical identifiers;
- declared validations pass.

# Non-goals
No process-versioning contract mutation, deployment integration, release execution redesign, persistence redesign or L4 change.
