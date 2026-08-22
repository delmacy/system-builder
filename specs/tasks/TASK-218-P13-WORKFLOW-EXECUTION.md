---
id: TASK-218
title: Execute explicitly declared workflow transitions
status: completed
priority: 218
milestone: M13
model_tier: architecture
risk: high
architecture_impact: true
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
  - packages/contracts/system-definition/**
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/system-definition*.test.ts
  - tests/product/runtime*.test.ts
  - tests/product/compiler*.test.ts
  - specs/tasks/TASK-218-P13-WORKFLOW-EXECUTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/environment-profile/**
  - packages/contracts/factory-boundary/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Materialize and execute workflow state transitions declared explicitly by TASK-212, backed by generated durable entity/process state, with an explicit initial state rather than inferred workflow semantics.

# Context
TASK-212 introduced the minimal explicit workflow-transition semantics required by WBS 13.1.1, and TASK-217 proves bounded explicit action execution. During TASK-218 execution, repository evidence showed that durable workflow initialization is ambiguous because the process shape has `states` and `transitions` but no explicit initial state. Choosing the first state, sorting states or inferring from the first transition would invent business semantics. The Sprint manifest therefore grants one bounded additive L3 correction in the same SystemDefinition family: optional `process.initialState`, required for executable transition graphs. No L4 boundary was identified.

# Current behavior
SystemDefinition processes expose state lists and explicit transition declarations, but do not declare which state initializes a durable process instance. The generated Runtime has no general workflow transition executor or durable process-state path derived from that model.

# Required change
Add only optional `initialState` to the existing SystemDefinition process shape, with compatibility rules that keep historical processes without executable transitions valid while requiring explicit `initialState` whenever transitions are declared. Validate that `initialState`, transition sources and transition targets reference declared states. Materialize the explicit process transition graph and initial state into generated runtime metadata and execute transitions against durable Runtime state. Validate process identity, source state, target state and optional declared action linkage before mutation; invalid transitions must fail closed without changing state.

# Inputs / contracts
TASK-212 workflow-transition semantics; bounded Sprint authority correction for `process.initialState`; TASK-214 runtime model; TASK-215 durable persistence; TASK-217 explicit action executor; ADR-0002 autonomous operation boundary.

# Outputs / contracts
Backward-compatible additive `process.initialState` semantics in the existing SystemDefinition family plus deterministic Runtime workflow-transition execution using generated metadata and durable state. No new shared-contract family or Builder orchestration dependency.

# Acceptance criteria
- historical processes with states but no executable transitions remain valid without `initialState`;
- any process declaring executable transitions must declare an explicit `initialState` that is one of its declared states;
- transition `from`/`to` states must be declared by the process and actionRef, when present, must resolve to a declared action;
- process transition graph and initial state are deterministic in generated runtime model;
- first durable process use initializes only from declared `initialState`, never list/order inference;
- valid transition changes durable state;
- invalid source/target/process/transition fails closed without mutation;
- transition execution can invoke only explicitly declared in-scope action effects;
- no orchestration dependence on Builder or Observe;
- no auth/policy behavior is introduced;
- no contract outside SystemDefinition is changed.

# Non-goals
Implicit workflow/business semantics; timers/jobs/events; auth/permissions/policies; UI/views/forms; integration orchestration; another shared-contract family; production deployment topology; any L4 architecture change.

# Evidence expected
SystemDefinition compatibility/negative tests plus Compiler/Runtime product tests for explicit initial state, deterministic transition materialization, valid durable transitions, invalid/no-mutation paths, bounded declared action invocation and Builder/Observe independence; task catalog and repository verification green.

# Escalation
Stop if workflow execution requires any shared-contract change beyond optional `process.initialState`, implicit business semantics, cross-package authoring behavior or a new L4 boundary.
