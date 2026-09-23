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

# Context
The Station is perception and interaction only. It may manage local connection/context/presentation state but must send all system work through the SDK/Gateway/Core path.

# Current behavior
No `apps/station/**` boundary exists and the repository has no installable operator client scaffold.

# Required change
Add `apps/station/**` with bootstrap/session/context orchestration over `station-sdk` only and include the application source in TypeScript build configuration.

# Inputs / contracts
ADR-0016 and TASK-585 Station SDK.

# Outputs / contracts
A compileable thin Station application boundary with injectable SDK/client dependency and deterministic boundary tests.

# Acceptance criteria
Station bootstrap connects through an injected SDK transport, exposes connection/context state and issues protocol operations without importing Core/domain internals. Closing/discarding Station state does not mutate the injected Core-side state.

# Non-goals
No daedalOS fork, Tauri/Electron choice, window manager, final installer, rich UI, filesystem bridge or embedded business engine.

# Evidence expected
Tests prove dependency direction, disposable local state, context switching through protocol calls and absence of direct Core/domain imports.

# Escalation
Stop if a UI/framework decision becomes necessary to prove the boundary, or if Station must execute canonical business rules or provider effects locally.
