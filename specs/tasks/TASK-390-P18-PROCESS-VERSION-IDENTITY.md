---
id: TASK-390
title: Define stable process artifact identity and revision descriptor
status: ready
priority: 390
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - project_docs/18-process-versioning/scope/README.md
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-390-P18-PROCESS-VERSION-IDENTITY.md
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
Define WBS 18.1.1 stable business artifact identity separately from immutable revision identity.

# Context
P18 Package 01 begins the process-versioning foundation by separating stable business artifact identity from the identity of each immutable revision, while preserving the Package boundary that Git metadata is not canonical business-version authority.

# Current behavior
The Package and Construction A are materialized, but the process-versioning contract required by WBS 18.1.1 is not yet implemented; TASK-391..394 depend on this identity foundation.

# Inputs / contracts
- `project_docs/execution_planning/P18-PACKAGE-01.md` Package scope and boundaries;
- `project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md` Construction A contract;
- WBS 18.1.1 and the M18 process-versioning scope authority.

# Outputs / contracts
A deterministic provider-neutral process-versioning contract and product evidence that keep stable artifact identity distinct from immutable revision identity and carry only revision ordering/reference metadata required by this bounded task.

# Required change
Create a deterministic provider-neutral contract that normalizes stable artifact identity, revision identity and revision ordering/reference metadata without carrying process payload and without deriving business version authority from Git commits.

# Acceptance criteria
- stable artifact identity and revision identity are distinct and explicit;
- normalization is deterministic and unknown/extra state fails closed;
- revision descriptor is payload-minimal;
- Git SHA may not be the sole/canonical business identity;
- declared validations pass.

# Non-goals
No publication mutation guard, lifecycle semantics, semantic diff or process→system lineage.

# Evidence expected
Positive and negative product tests for identity/revision normalization.

# Escalation
Stop for storage/topology redesign, cross-milestone semantic change or undeclared L4.