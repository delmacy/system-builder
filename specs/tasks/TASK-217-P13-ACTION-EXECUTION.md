---
id: TASK-217
title: Execute explicitly declared generated actions
status: pending
priority: 217
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-212
  - TASK-216
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
  - specs/tasks/TASK-217-P13-ACTION-EXECUTION.md
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
Execute only the action effects explicitly declared under TASK-212 and materialized by Compiler; never infer semantics from action name.

# Context
TASK-212 provides the minimal explicit action-effect declaration and TASK-216 exposes generated entity APIs backed by persistence. Construction A requires action execution to be derived from those explicit declarations while preserving autonomous Runtime ownership and fail-closed behavior.

# Current behavior
SystemDefinition action identities exist, but prior Runtime behavior has no general generated action executor. The only executable reference capability is state.counter and cannot be generalized by guessing action names or business meaning.

# Required change
Materialize supported TASK-212 action effects into the generated runtime model where necessary and execute only those supported explicit effects against TASK-215 entity persistence. Validate action identity, target and input, and reject unsupported or ambiguous effects.

# Inputs / contracts
TASK-212 action semantics; TASK-213/214 Compiler runtime projection/model; TASK-215 persistence and TASK-216 Runtime API surface; ADR-0002 autonomy boundary.

# Outputs / contracts
Deterministic Runtime action execution for the bounded declared effect set, with explicit failure diagnostics and no Builder dependency. No additional shared-contract change.

# Acceptance criteria
- declared action identity/effect is present in generated runtime model;
- supported declared effects execute against generated entity persistence;
- unknown action, unsupported effect, invalid target and invalid input fail closed;
- ordering and generated output remain deterministic;
- no Builder call or authoring behavior is introduced.

# Non-goals
Inventing implicit action semantics; adding another SystemDefinition/shared-contract extension; auth/permissions/views; jobs/events/files/integrations; production topology or Release/Deploy authority changes.

# Evidence expected
Compiler/Runtime product tests proving materialization and execution of supported explicit effects, unknown/unsupported/invalid negative paths, deterministic generated output and autonomy/no-value regressions.

# Escalation
Stop if additional action semantics require another shared-contract change or a new runtime ownership boundary.
