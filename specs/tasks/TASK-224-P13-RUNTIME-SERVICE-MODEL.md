---
id: TASK-224
title: Materialize Construction B descriptors into generated Runtime service model
status: ready
priority: 224
milestone: M13
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-223
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/compiler/runtime-projection.ts
  - packages/compiler/runtime-model.ts
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/compiler/runtime-model.ts
  - packages/runtime-core/index.ts
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-224-P13-RUNTIME-SERVICE-MODEL.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Carry the normalized Construction B descriptors into the existing generated Runtime model without introducing a new runtime service topology.

# Context
TASK-223 will extend the deterministic Compiler projection. Construction A already emits the generated Runtime model and entrypoint used by Release/Deploy. This task must reuse that mechanism so Construction B remains inside the existing autonomous Runtime process.

# Current behavior
The generated runtime model contains Construction A entities/actions/processes but no immutable jobs/events/files/integrations descriptor collections or their reference-only binding requirements.

# Required change
Extend the generated runtime model/artifact support with immutable jobs/events/files/integrations descriptors and the reference-only binding requirements they need. Reuse the existing generated runtime entrypoint/model mechanism introduced by Construction A. No binding value is resolved during compilation/materialization.

# Inputs / contracts
Normalized TASK-223 runtime projection; current Compiler runtime-model generator; existing Runtime entrypoint/model interfaces; Construction B manifest.

# Outputs / contracts
Deterministic generated Runtime model carrying B descriptors and reference-only requirement metadata, with regression tests for historical models. No Deploy value resolution.

# Acceptance criteria
- generated model deterministically includes all B descriptors;
- historical generated models remain compatible;
- descriptors contain binding names/classification only, never values;
- no new worker, broker or sidecar process is introduced;
- Builder/Observe are not runtime dependencies.

# Non-goals
Executing jobs/events/files/integrations; modifying public contracts; selecting providers; creating new processes/topology.

# Evidence expected
Compiler/runtime-model product tests proving deterministic inclusion, historical compatibility, reference-only serialization and unchanged Construction A surfaces; declared validations green.

# Escalation
Stop if implementation requires a new process topology, bounded context, release-model change or public contract beyond TASK-221/222.
