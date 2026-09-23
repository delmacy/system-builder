---
id: TASK-583
title: Establish transport-agnostic Station/Core protocol contract
status: ready
priority: 583
milestone: STATION-WP-01
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-WP-01-FOUNDATION.md
  - packages/contracts/identity-authorization/**
  - packages/contracts/generated-experience/**
  - packages/contracts/semantic-substrate/**
allowed_paths:
  - packages/contracts/station-core/**
  - tests/product/station-core-protocol.test.ts
  - tsconfig.json
  - specs/tasks/TASK-583-STATION-CORE-PROTOCOL-CONTRACT.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - apps/**
  - .github/workflows/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Define the stable Station/Core semantic protocol without selecting HTTP, WebSocket, SSE or IPC.

## Required change
Add a versioned `station-core` contract family covering handshake/compatibility, Station session/context references, query/projection envelopes, command/receipt envelopes, event/subscription/replay envelopes and deterministic diagnostics.

## Acceptance criteria
Contracts are immutable/provider-neutral; unsupported protocol versions fail deterministically; projection identity/revision/currentness can be preserved without becoming canonical truth; commands carry actor/context/target/expected-revision information by reference; events have monotonic replay position within a subscription stream.

## Non-goals
No network server/client, no authentication provider, no domain command implementation, no persistence and no UI.
