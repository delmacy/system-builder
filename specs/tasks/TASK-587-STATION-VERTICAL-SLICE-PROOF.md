---
id: TASK-587
title: Prove Station to Gateway to Core-port vertical slice
status: blocked
priority: 587
milestone: STATION-WP-01
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-584
  - TASK-585
  - TASK-586
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-CONSTRUCTION-A-01.md
  - packages/contracts/station-core/**
  - packages/station-sdk/**
  - apps/station-gateway/**
  - apps/station/**
allowed_paths:
  - packages/contracts/station-core/**
  - packages/station-sdk/**
  - apps/station-gateway/**
  - apps/station/**
  - tests/product/station-core-e2e.test.ts
  - specs/tasks/TASK-587-STATION-VERTICAL-SLICE-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Close Construction A with one deterministic end-to-end Station protocol proof.

## Required change
Compose Station -> Station SDK -> Station Gateway -> injected in-memory Core port and prove handshake, context, query/projection, command/receipt, event delivery, replay after reconnect and version/diagnostic failure paths.

## Acceptance criteria
The in-memory Core port remains the only canonical-test-state owner; Station/Gateway/SDK do not manufacture authority; an unsupported protocol version fails closed; replay resumes from an explicit sequence without duplicate strengthening; Station disconnect has no effect on Core-port state.

## Non-goals
No real Core adapter, no network transport, no provider effects, no production auth/session store, no desktop shell.
