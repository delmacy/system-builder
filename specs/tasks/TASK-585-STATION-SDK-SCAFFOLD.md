---
id: TASK-585
title: Create reusable Station SDK client boundary
status: completed
priority: 585
milestone: STATION-WP-01
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-583
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - packages/contracts/station-core/**
allowed_paths:
  - packages/station-sdk/**
  - tests/product/station-sdk.test.ts
  - tsconfig.json
  - specs/tasks/TASK-585-STATION-SDK-SCAFFOLD.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - apps/station-gateway/**
  - .github/workflows/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run typecheck
  - npm run verify
---

# Objective
Give Station code one reusable client abstraction over the Station protocol.

# Context
Station must remain independent of Core/domain implementation details and should speak only the versioned Station protocol through an injectable transport.

# Current behavior
No Station client package or transport abstraction exists.

# Required change
Add `packages/station-sdk/**` with a transport interface and client methods for handshake, context, query, command and subscription/replay.

# Inputs / contracts
TASK-583 `station-core` public contract.

# Outputs / contracts
A reusable Station SDK package and deterministic tests using an in-memory transport.

# Acceptance criteria
An in-memory transport exercises every Construction-A protocol primitive; compatibility and diagnostics are preserved end to end; no canonical state is stored by the SDK; the SDK imports no domain implementation package.

# Non-goals
No WebSocket/HTTP implementation, auth provider, domain rule, persistence or desktop/UI state.

# Evidence expected
Tests prove request/response typing, event subscription/replay forwarding, incompatible handshake propagation and transport substitution.

# Escalation
Stop if the SDK needs knowledge of domain internals, canonical persistence, authority decisions or a specific physical transport.
