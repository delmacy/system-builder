---
id: TASK-224
title: Materialize Construction B descriptors into generated Runtime service model
status: ready
priority: 224
milestone: M13
model_tier: code
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

# Required change
Extend the generated runtime model/artifact support with immutable jobs/events/files/integrations descriptors and the reference-only binding requirements they need. Reuse the existing generated runtime entrypoint/model mechanism introduced by Construction A. No binding value is resolved during compilation/materialization.

# Acceptance criteria
- generated model deterministically includes all B descriptors;
- historical generated models remain compatible;
- descriptors contain binding names/classification only, never values;
- no new worker, broker or sidecar process is introduced;
- Builder/Observe are not runtime dependencies.

# Escalation
Stop if implementation requires a new process topology, bounded context, release-model change or public contract beyond TASK-221/222.
