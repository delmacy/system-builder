---
id: TASK-227
title: Execute declared file storage operations through external storage binding
status: completed
priority: 227
milestone: M13
model_tier: cheap
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

# Context
TASK-221/222 define explicit file descriptors and reference-only binding classification. Deploy already owns activation-time environment/secret resolution; Runtime autonomy and no-value-leak must remain unchanged.

# Current behavior
The generated Runtime has no file/storage operation surface and Deploy has no Construction B storage binding handoff. Any storage root or operation inference would violate the accepted change control.

# Required change
Use the descriptor `bindingRef` to require a matching EnvironmentProfile binding classified `storage`. Resolve the reference only at activation through the existing external configuration path and expose generated file routes under `/files/:fileId/:key` for only the descriptor's allowed operations. Keep access beneath the resolved storage root and reject traversal, unknown file descriptors, disallowed operations and missing/incompatible bindings.

# Inputs / contracts
TASK-221 file descriptors; TASK-222 binding classification metadata; TASK-224 Runtime model; existing Deploy activation path and EnvironmentProfile handling.

# Outputs / contracts
Bounded Runtime file operation executor plus activation-time storage binding handoff and product tests. No provider-specific storage contract or durable resolved value.

# Acceptance criteria
- put/get/delete round-trip works for a representative declared file descriptor;
- traversal outside the supplied root is rejected;
- missing/incompatible storage binding fails closed;
- resolved root never appears in immutable/durable artifacts or asserted diagnostics;
- no object-store vendor or new topology is introduced.

# Non-goals
Object-store providers; multipart/versioned storage; new storage topology; contract changes beyond TASK-221/222.

# Evidence expected
Product tests covering declared round-trip operations, traversal rejection, missing/incompatible binding failure and no-value-leak assertions; declared validations green.

# Escalation
Stop if execution requires provider-specific storage semantics, durable value embedding, new topology or L4 change.
