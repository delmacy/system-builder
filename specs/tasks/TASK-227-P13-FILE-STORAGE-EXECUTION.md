---
id: TASK-227
title: Execute declared file storage operations through external storage binding
status: ready
priority: 227
milestone: M13
model_tier: code
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-226
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/deploy/local-process.ts
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/file-execution.ts
  - packages/runtime-core/index.ts
  - packages/compiler/runtime-model.ts
  - packages/deploy/local-process.ts
  - tests/product/p13-runtime-services*.test.ts
  - specs/tasks/TASK-227-P13-FILE-STORAGE-EXECUTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Execute generated file put/get/delete only through an explicit classified storage binding while keeping the resolved storage root activation-time only.

# Required change
Use the descriptor `bindingRef` to require a matching EnvironmentProfile binding classified `storage`. Resolve the reference only at activation through the existing external configuration path and expose generated file routes under `/files/:fileId/:key` for only the descriptor's allowed operations. Keep access beneath the resolved storage root and reject traversal, unknown file descriptors, disallowed operations and missing/incompatible bindings.

# Acceptance criteria
- put/get/delete round-trip works for a representative declared file descriptor;
- traversal outside the supplied root is rejected;
- missing/incompatible storage binding fails closed;
- resolved root never appears in immutable/durable artifacts or asserted diagnostics;
- no object-store vendor or new topology is introduced.

# Escalation
Stop if execution requires provider-specific storage semantics, durable value embedding, new topology or L4 change.
