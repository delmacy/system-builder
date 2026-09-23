---
id: TASK-600
title: Complete M1 multi-window journey and bounded snap
status: ready
priority: 600
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-599
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-CONSTRUCTION-B-01.md
allowed_paths:
  - apps/station/**
  - packages/station-shell/**
  - packages/station-app-runtime/**
  - packages/station-windowing/**
  - packages/station-interaction/**
  - packages/station-settings/**
  - packages/ui-icons/**
  - packages/ui-core/**
  - tests/product/**
  - tests/e2e/**
  - specs/tasks/TASK-600-STATION-MULTI-WINDOW.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 24
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# Objective
Close remaining M1 multi-window interaction gaps without changing runtime/domain authority.

# Current behavior
Main already has multiple utility windows, z-order/focus, move, full resize, minimize/maximize/restore/close and reducer snap semantics.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work.

# Acceptance criteria
Multiple utilities coexist where allowed; singleton windows reuse one presentation instance; snap obeys local presentation settings; close never alters module/deployment/runtime state; Focused Window != Selected Semantic Object.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Context
This task is part of STATION-VISUAL-CONSTRUCTION-B-01 on the fresh-main baseline after PR #910. Existing integrated shell behavior is authoritative current behavior and is not to be replayed.

# Inputs / contracts
ADR-0017, STATION_FRONTEND_FOUNDATION, the Construction B manifest, source-owned ui-core/ui-icons, Station interaction/window/app/settings contracts, and the immediately preceding TASK output.

# Outputs / contracts
Only the bounded Station presentation/interaction delta described by this task, exposed through the existing package layering and composition root.

# Evidence expected
Task-local regression coverage, repository verification, architecture checks and exact-head CI evidence appropriate to the changed surface.

# Escalation
Stop if completion requires canonical truth, authorization decisions, provider/domain effects, deploy/storage/workflow/agent implementation, or bypassing the declared package layering.
