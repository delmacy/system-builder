---
id: TASK-214
title: Materialize deterministic runtime model and entity migrations
status: ready
priority: 214
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-213
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/compiler/index.ts
  - packages/compiler/runtime-capabilities.ts
  - packages/runtime-core/state-migrations.ts
allowed_paths:
  - packages/compiler/**
  - packages/runtime-core/state-migrations.ts
  - tests/product/compiler*.test.ts
  - tests/product/runtime-compiler.test.ts
  - specs/tasks/TASK-214-P13-RUNTIME-MODEL-MATERIALIZATION.md
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
Generate a deterministic runtime model and PostgreSQL migration assets from the validated SystemDefinition entity/action/process projection.

# Context
TASK-213 makes validated runtime semantics available to Compiler without changing AssemblyPlan. Construction A now needs deterministic immutable materialization that the autonomous Runtime can consume, while preserving the existing migration/artifact integrity model established by P4-P10.

# Current behavior
Compiler produces assembly/environment/runtime manifests, a persistent runtime entrypoint and state.counter migration assets. It does not materialize general entity schemas, explicit action effects or workflow transition metadata into a runtime model.

# Required change
Materialize a canonical runtime model from the TASK-213 projection and derive bounded PostgreSQL entity migration assets using existing deterministic file and migration conventions. Keep generated content reference/value safe and compatible with existing state.counter assets.

# Inputs / contracts
TASK-213 validated runtime projection; current Compiler generated-file conventions; runtime state migration abstractions; deterministic canonical JSON/text hashing; existing PostgreSQL state precedent.

# Outputs / contracts
Generated canonical runtime-model artifact plus deterministic entity migration files/manifests included in existing ReleaseArtifact file integrity. No new shared contract family.

# Acceptance criteria
- generated model is canonical/order-independent and contains only executable metadata;
- entity fields map deterministically to bounded PostgreSQL persistence assets;
- duplicate/invalid entity/action/process identities fail closed;
- migrations are included in existing artifact integrity/file hashing;
- no resolved environment/config/secret value is emitted;
- existing state.counter migrations remain compatible.

# Non-goals
Executing entities/actions/workflows; changing Deploy or production topology; introducing auth/permissions/views; jobs/events/files/integrations; new database ownership boundaries; shared-contract changes beyond TASK-212.

# Evidence expected
Compiler/runtime-compiler tests proving deterministic model/migration output, invalid identity rejection, artifact hashing inclusion, no-value leakage and state.counter compatibility; repository verification green.

# Escalation
Stop if entity persistence requires a new database ownership boundary or a shared contract change beyond TASK-212.
