---
id: TASK-415
title: Integrate canonical Release lineage with Deployment consumer
status: ready
priority: 415
milestone: M18
model_tier: architecture
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

# Context
TASK-414 introduces the Release-side consumer seam. This successor must carry the same canonical lineage truth into the existing Deploy bounded context without granting new deployment authority or duplicating process-versioning semantics.

# Current behavior
The canonical contract layer can validate Release -> Deployment lineage, but the materialized Construction B has not yet exposed that validation through a representative existing Deploy API.

# Inputs / contracts
- TASK-414 Release-side integration output;
- public `packages/contracts/process-versioning/**` lineage APIs;
- existing `packages/release/**` public surfaces and Release identity;
- existing `packages/deploy/**` public surfaces and Deployment identity;
- P18-PACKAGE-03 and Construction B boundaries.

# Outputs / contracts
An additive Deploy-side seam that binds an existing Deployment identity to validated canonical Release lineage while preserving current deployment execution semantics and callers.

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

# Evidence expected
Focused product evidence covering valid Deployment admission, missing/forged/mismatched predecessors, backward compatibility and preservation of deployment authority boundaries.

# Escalation
Stop and mark blocked if the objective requires changing canonical process-versioning semantics, deployment execution authority, Decision Boundary, Runtime/Compiler, persistence topology or any undeclared L4 surface.
