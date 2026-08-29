---
id: TASK-417
title: Prove Release and Deploy lineage integration is backward-compatible and fail-closed
status: ready
priority: 417
milestone: M18
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-416
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-03.md
  - project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
  - packages/release/**
  - packages/deploy/**
allowed_paths:
  - packages/release/**
  - packages/deploy/**
  - tests/product/**
  - specs/tasks/TASK-417-P18-LINEAGE-CONSUMER-BYPASS-RESISTANCE.md
forbidden_paths:
  - packages/contracts/process-versioning/**
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the real Release/Deploy consumer integration preserves compatibility while rejecting attempts to bypass canonical process-to-system lineage truth.

# Required change
Add focused product evidence around TASK-414..416. Prefer tests over new implementation unless a bounded defect in the materialized consumer seam must be corrected.

# Acceptance criteria
- existing release/deploy behavior remains valid when the new lineage seam is not invoked;
- forged, missing, reversed, cross-artifact and duplicate/conflicting lineage inputs fail closed when invoked;
- Git commit, PR, model/classifier output and ADR evidence cannot substitute canonical process/release/deployment identifiers;
- no caller-supplied downstream truth bypasses canonical validation/query composition;
- declared validations pass.

# Non-goals
No new product capability beyond proving the already-materialized integration goal; no contract redesign, persistence redesign, deployment execution changes or L4 work.
