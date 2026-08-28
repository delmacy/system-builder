---
id: TASK-394
title: Prove integrated WBS 18.1 process version identity behavior
status: ready
priority: 394
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-393
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - project_docs/18-process-versioning/scope/README.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.report.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md
  - specs/tasks/TASK-394-P18-PROCESS-VERSION-IDENTITY-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide the integrated growing proof and Sprint Report for Construction A / WBS 18.1.

# Context
Construction A closes only after the materialized WBS 18.1.1–18.1.3 contracts are exercised together under the Package boundaries, without entering forecast WBS 18.2/18.3 scope.

# Current behavior
TASK-390..393 provide the planned identity, immutable-publication, lifecycle and lineage composition contracts; the integrated growing proof and Sprint Report are not yet produced.

# Inputs / contracts
- TASK-390 stable artifact and immutable revision identity;
- TASK-391 immutable publication guard;
- TASK-392 lifecycle and supersession semantics;
- TASK-393 deterministic revision-lineage composition;
- `P18-PACKAGE-01`, Construction A and WBS 18.1 boundaries.

# Outputs / contracts
An integrated product-level positive/negative proof for WBS 18.1.1–18.1.3 plus `P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.report.md` recording evidence, validations and preserved scope boundaries.

# Required change
Exercise the complete bounded path: stable artifact identity → multiple immutable revisions → idempotent publication/conflicting overwrite rejection → explicit supersession/deprecated/archive lineage validation.

# Acceptance criteria
- integrated proof covers WBS 18.1.1–18.1.3;
- same artifact can have multiple distinct immutable revisions;
- conflicting overwrite and malformed/cross-artifact/cyclic lineage fail closed;
- proof does not enter WBS 18.2 or 18.3;
- Sprint Report records validations and preserved boundaries;
- declared validations pass.

# Non-goals
No representative runtime/consumer wiring, semantic diff, migration or release lineage.

# Evidence expected
Product-level integrated positive/negative proof plus Sprint Report.

# Escalation
Stop for scope beyond WBS 18.1, storage/topology redesign or undeclared L4.