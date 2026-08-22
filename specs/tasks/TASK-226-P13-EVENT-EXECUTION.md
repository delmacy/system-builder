---
id: TASK-226
title: Execute declared runtime-http event dispatch in the generated Runtime
status: ready
priority: 226
milestone: M13
model_tier: code
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-225
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/runtime-core/action-execution.ts
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/event-execution.ts
  - packages/runtime-core/index.ts
  - packages/compiler/runtime-model.ts
  - tests/product/p13-runtime-services*.test.ts
  - specs/tasks/TASK-226-P13-EVENT-EXECUTION.md
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
Execute explicit generated `runtime-http` event descriptors without introducing a broker or external event topology.

# Required change
Expose deterministic generated event dispatch for declared events only. `POST /events/:eventId` accepts an explicit body carrying `recordId` and optional payload, then invokes only the event's declared `actionRef`. Unknown event, invalid body or unsupported action fails closed.

# Acceptance criteria
- representative event dispatch reaches its declared action target;
- recordId/payload are explicit request inputs, not inferred;
- unknown/invalid events fail deterministically without mutation;
- no broker/provider/Builder dependency is introduced;
- prior Runtime behavior remains green.

# Escalation
Stop if faithful event execution requires broker topology, distributed delivery guarantees, provider-specific semantics or L4 changes.
