---
id: TASK-584
title: Create Station Gateway application scaffold and Core port
status: blocked
priority: 584
milestone: STATION-WP-01
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-583
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-CONSTRUCTION-A-01.md
  - packages/contracts/station-core/**
allowed_paths:
  - apps/station-gateway/**
  - tests/product/station-gateway-boundary.test.ts
  - tsconfig.json
  - tsconfig.build.json
  - specs/tasks/TASK-584-STATION-GATEWAY-SCAFFOLD.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 9
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Create the executable Station Gateway boundary without giving it canonical business authority.

## Required change
Add `apps/station-gateway/**` with a public handler/service surface that consumes Station protocol envelopes and delegates all canonical reads/effects to an injected `StationCorePort`. Add application paths to TypeScript build configuration.

## Acceptance criteria
Gateway can negotiate protocol and route query/command/subscription calls through the injected Core port; it stores no canonical domain state; deterministic diagnostics are returned for unsupported/invalid requests; no private domain/Core implementation is imported.

## Non-goals
No real network listener, DB, auth provider, federation, provider-specific logic or business rules.
