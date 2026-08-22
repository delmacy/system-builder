---
id: TASK-216
title: Expose generated entity APIs from materialized Runtime model
status: completed
priority: 216
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-215
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-216-P13-ENTITY-API.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Expose deterministic HTTP APIs derived from the materialized entity model and backed by TASK-215 persistence.

# Context
WBS 13.1.1 requires autonomous execution of materialized APIs. TASK-215 provides the generated entity persistence layer, while the Runtime already has an HTTP server/health path. This task extends that existing Runtime surface without importing P13-PACKAGE-02 identity/authority concerns.

# Current behavior
The generated Runtime exposes health and the bounded predecessor state.counter route, but no generic entity API derived from generated SystemDefinition/runtime-model data.

# Required change
Derive bounded entity CRUD HTTP routes from the materialized runtime model and delegate persistence to TASK-215. Produce deterministic diagnostics for invalid methods, payloads, unknown entities and missing records while preserving existing health/state routes.

# Inputs / contracts
TASK-215 generated entity persistence API; TASK-214 runtime model semantics; existing Runtime HTTP server conventions and diagnostics; ADR-0002 autonomous operation boundary.

# Outputs / contracts
Runtime-local generated entity HTTP API behavior. No new public API schema or auth/permission contract.

# Acceptance criteria
- routes derive from generated entity identity rather than caller-authored route stand-ins;
- create/read/update/delete positive paths are proven;
- unknown entity/record, invalid method/body and validation failures return explicit deterministic diagnostics;
- health and predecessor state routes remain compatible;
- no auth/permissions/view behavior is introduced.

# Non-goals
Authentication, authorization, roles, policies, UI/views/forms; jobs/events/files/integrations; new shared API contract; Deploy/production topology changes.

# Evidence expected
Runtime product tests exercising generated CRUD routes, invalid methods/bodies, unknown resources, predecessor route compatibility and Builder-independent operation; repository verification green.

# Escalation
Stop if API execution requires P13-PACKAGE-02 identity/authority scope or a new public API contract.
