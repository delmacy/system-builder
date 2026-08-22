---
id: TASK-218
title: Execute explicitly declared workflow transitions
status: pending
priority: 218
milestone: M13
model_tier: strong
risk: high
architecture_impact: false
depends_on:
  - TASK-212
  - TASK-217
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/runtime*.test.ts
  - tests/product/compiler*.test.ts
  - specs/tasks/TASK-218-P13-WORKFLOW-EXECUTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Materialize and execute workflow state transitions declared explicitly by TASK-212, backed by generated durable entity/process state.

# Acceptance criteria
- process transition graph is deterministic in generated runtime model;
- valid transition changes durable state;
- invalid source/target/process/transition fails closed without mutation;
- transition execution can invoke only explicitly declared in-scope action effects;
- no orchestration dependence on Builder or Observe;
- no auth/policy behavior is introduced.

# Escalation
Stop if workflow execution requires implicit business semantics, cross-package authoring behavior or another shared-contract change.
