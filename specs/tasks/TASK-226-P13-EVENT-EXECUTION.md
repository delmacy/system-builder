---
id: TASK-226
title: Execute declared runtime-http event dispatch in the generated Runtime
status: ready
priority: 226
milestone: M13
model_tier: cheap
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

# Context
TASK-224 will materialize explicit event descriptors into the generated Runtime model. Construction A already provides action execution and generated HTTP routing, so this task remains inside the same autonomous Runtime process.

# Current behavior
The Runtime has no generated event dispatch surface and cannot execute event-to-action routing without inventing semantics.

# Required change
Expose deterministic generated event dispatch for declared events only. `POST /events/:eventId` accepts an explicit body carrying `recordId` and optional payload, then invokes only the event's declared `actionRef`. Unknown event, invalid body or unsupported action fails closed.

# Inputs / contracts
TASK-221 event descriptors; TASK-224 generated Runtime model; Construction A action executor and Runtime HTTP entrypoint.

# Outputs / contracts
Generated runtime-http event dispatch plus focused positive/negative product tests. No broker, provider or public-contract changes.

# Acceptance criteria
- representative event dispatch reaches its declared action target;
- recordId/payload are explicit request inputs, not inferred;
- unknown/invalid events fail deterministically without mutation;
- no broker/provider/Builder dependency is introduced;
- prior Runtime behavior remains green.

# Non-goals
Broker-backed events; external delivery guarantees; distributed consumers; provider selection or topology changes.

# Evidence expected
Product tests covering declared dispatch, explicit body inputs, unknown/invalid failure without mutation and Construction A regressions; declared validations green.

# Escalation
Stop if faithful event execution requires broker topology, distributed delivery guarantees, provider-specific semantics or L4 changes.
