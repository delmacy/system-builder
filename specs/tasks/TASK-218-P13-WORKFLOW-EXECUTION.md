---
id: TASK-218
title: Execute explicitly declared workflow transitions
status: ready
priority: 218
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
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

# Context
TASK-212 introduces the minimal explicit workflow-transition semantics required by WBS 13.1.1, and TASK-217 proves bounded explicit action execution. Runtime workflows must use only those declared transitions and may invoke only explicitly declared in-scope action effects.

# Current behavior
SystemDefinition processes currently provide state lists and, after TASK-212, will expose explicit transition declarations. The generated Runtime has no general workflow transition executor or durable process-state path derived from that model.

# Required change
Materialize the explicit process transition graph into generated runtime metadata and execute transitions against durable Runtime state. Validate process identity, source state, target state and optional declared action linkage before mutation; invalid transitions must fail closed without changing state.

# Inputs / contracts
TASK-212 workflow-transition semantics; TASK-214 runtime model; TASK-215 durable persistence; TASK-217 explicit action executor; ADR-0002 autonomous operation boundary.

# Outputs / contracts
Deterministic Runtime workflow-transition execution using generated metadata and durable state, with no new shared-contract family or Builder orchestration dependency.

# Acceptance criteria
- process transition graph is deterministic in generated runtime model;
- valid transition changes durable state;
- invalid source/target/process/transition fails closed without mutation;
- transition execution can invoke only explicitly declared in-scope action effects;
- no orchestration dependence on Builder or Observe;
- no auth/policy behavior is introduced.

# Non-goals
Implicit workflow/business semantics; timers/jobs/events; auth/permissions/policies; UI/views/forms; integration orchestration; another shared-contract change; production deployment topology.

# Evidence expected
Compiler/Runtime product tests for deterministic transition materialization, valid durable transitions, invalid/no-mutation paths, bounded declared action invocation and Builder/Observe independence; repository verification green.

# Escalation
Stop if workflow execution requires implicit business semantics, cross-package authoring behavior or another shared-contract change.
