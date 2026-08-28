---
id: TASK-391
title: Define immutable published revision guard
status: ready
priority: 391
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-390
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-391-P18-IMMUTABLE-PUBLISHED-REVISION.md
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
Implement WBS 18.1.2 as a deterministic contract-level guard preventing conflicting overwrite of an already published business revision.

# Context
WBS 18.1 requires immutable revision truth to build on the stable artifact/revision identity established by TASK-390 without selecting persistence topology or using Git as business-version authority.

# Current behavior
TASK-390 provides the predecessor identity contract; a deterministic publication guard for recognizing identical publication versus conflicting replacement is not yet implemented.

# Inputs / contracts
- TASK-390 stable artifact and immutable revision identity contract;
- `P18-PACKAGE-01` and `P18-PROCESS-VERSION-IDENTITY-CONTRACT-01` boundaries;
- WBS 18.1.2 immutable published revision requirement.

# Outputs / contracts
A deterministic contract-level publication identity/content-identity guard and product evidence that distinguish idempotent identical publication from conflicting overwrite without mutating storage.

# Required change
Represent publication identity/content identity evidence sufficient to make identical publication idempotent and conflicting replacement fail closed, without selecting a persistence engine.

# Acceptance criteria
- identical publication may be recognized deterministically as idempotent;
- same published revision identity with conflicting immutable identity/evidence is rejected;
- guard does not mutate storage or imply semantic compatibility;
- no Git-only version authority;
- declared validations pass.

# Non-goals
No repository/storage implementation, semantic diff, migration or release linkage.

# Evidence expected
Positive idempotency and negative conflicting-overwrite product tests.

# Escalation
Stop for persistence/topology redesign or undeclared L4.