---
id: TASK-514
title: Define bounded Physical Peripheral integration governance
status: ready
priority: 514
milestone: G2
model_tier: architecture
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

# Context
TASK-514 consumes provider qualification and locality-aware truth while keeping physical/peripheral integration inside observation, qualification and governance boundaries.

# Current behavior
No G2 contract currently proves that connectivity or provider capability cannot itself grant actuation authority or imply a confirmed physical effect.

# Inputs / contracts
TASK-513 locality/currentness, provider qualification, peripheral capability evidence, observation/control intent, external owning-domain authorization and effect confirmation.

# Outputs / contracts
A bounded physical/peripheral contract separating observation, requested intent, authorization and confirmed effect with conservative unsupported/PARTIAL/UNKNOWN states.

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

# Evidence expected
Product Proof covers bounded observation/authorized intent and adversarial connectivity, accepted-command, missing-telemetry and capability-strengthening cases; exact-head validations pass.

# Escalation
Escalate any requirement for direct device actuation, safety certification, concrete drivers or hardware orchestration; do not infer authority from integration capability.

# Non-goals
PLC/robotics/vehicle control, safety certification, concrete drivers, hardware orchestration or Production Readiness.
