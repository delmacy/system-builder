---
id: TASK-586
title: Create thin Station application scaffold
status: blocked
priority: 586
milestone: STATION-WP-01
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-585
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-CONSTRUCTION-A-01.md
  - packages/station-sdk/**
allowed_paths:
  - apps/station/**
  - tests/product/station-app-boundary.test.ts
  - tsconfig.json
  - tsconfig.build.json
  - specs/tasks/TASK-586-STATION-APP-SCAFFOLD.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/catalog/**
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
Create a thin Station application entry boundary before selecting the final desktop shell technology.

## Required change
Add `apps/station/**` with bootstrap/session/context orchestration over `station-sdk` only. It may keep disposable presentation/session state but must not implement domain authority or canonical persistence.

## Acceptance criteria
Station bootstrap can connect through an injected SDK transport, expose connection/context state and issue protocol operations without importing Core/domain internals.

## Non-goals
No daedalOS fork, Tauri/Electron choice, window manager, final installer, rich UI or filesystem bridge.
