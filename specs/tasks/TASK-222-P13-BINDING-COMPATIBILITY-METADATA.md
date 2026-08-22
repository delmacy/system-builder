---
id: TASK-222
title: Add reference-only EnvironmentProfile binding compatibility metadata
status: ready
priority: 222
milestone: M13
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-221
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-PACKAGE-01.construction-b-l3-change-control.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/contracts/system-definition/system-definition.schema.json
allowed_paths:
  - packages/contracts/environment-profile/**
  - tests/product/environment-profile*.test.ts
  - specs/tasks/TASK-222-P13-BINDING-COMPATIBILITY-METADATA.md
forbidden_paths:
  - .github/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Add the minimum backward-compatible reference-only metadata needed to deterministically distinguish compatible external bindings for Construction B.

# Required change
Add optional `requirementKind` to EnvironmentProfile bindings, using the existing SystemDefinition environment-requirement classifications (`config`, `secret-reference`, `external-service`, `storage`, `database`). Keep `kind` restricted to `config|secret-reference` and keep `reference` as the durable reference. Historical bindings without `requirementKind` remain valid.

# Acceptance criteria
- old EnvironmentProfile fixtures remain valid;
- new fixtures prove classified storage and external-service references;
- inline resolved `value`, endpoint value, token or credential remains structurally forbidden;
- no provider/vendor field is introduced;
- no unrelated contract family changes.

# Escalation
Stop if compatibility requires provider-specific metadata, resolved values, a new shared contract family or L4 topology/boundary semantics.
