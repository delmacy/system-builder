---
id: TASK-514
title: Define bounded Physical Peripheral integration governance
status: planned
priority: 514
milestone: G2
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-513
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/physical/**
  - packages/contracts/provider/**
  - tests/product/g2-physical-peripheral*.test.ts
  - specs/tasks/TASK-514-G2-BOUNDED-PHYSICAL-PERIPHERAL.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define bounded Physical/Peripheral integration and governance contracts without creating generic physical actuation authority.

# Required change
Represent peripheral capability/qualification, observation/control intent boundaries, locality, authority requirements, safety/governance evidence and explicit unsupported/unknown states. Any actuation-capable intent must remain externally authorized by an owning domain rather than granted by this contract.

# Acceptance criteria
- integration capability does not imply actuation authority;
- qualification remains provider/revision/currentness/locality aware;
- unsupported/PARTIAL/UNKNOWN physical capability cannot strengthen;
- observation, requested intent, authorization and confirmed effect remain distinct;
- missing confirmation does not imply successful physical effect.

# Negative/adversarial proof
Reject connected=>authorized, command accepted=>effect, telemetry missing=>safe/absent and provider capability=>generic actuation authority.

# Non-goals
PLC/robotics/vehicle control, safety certification, concrete drivers, hardware orchestration or Production Readiness.