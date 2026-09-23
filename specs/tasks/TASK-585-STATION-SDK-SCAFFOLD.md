---
id: TASK-585
title: Create reusable Station SDK client boundary
status: blocked
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

## Required change
Add `packages/station-sdk/**` with a transport interface and client methods for handshake, context, query, command and subscription/replay. The SDK must not know domain implementation internals.

## Acceptance criteria
A deterministic in-memory transport can exercise every Construction-A protocol primitive; compatibility and diagnostics are preserved; no canonical state is stored by the SDK.

## Non-goals
No WebSocket/HTTP implementation, retries beyond protocol-defined replay semantics, auth provider or UI state.
