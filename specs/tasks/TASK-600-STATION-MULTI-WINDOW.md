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
  - packages/station-windowing/**
  - packages/station-interaction/**
  - packages/ui-core/**
  - tests/product/**
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
Main already has multiple utility windows, deterministic z-order/focus, move, full resize, minimize/maximize/restore/close and reducer snap semantics.

# Required change
Implement only the bounded delta needed to satisfy this task on top of current main. Preserve already integrated behavior rather than replaying it.

# Acceptance criteria
Multiple utilities can coexist where allowed; singleton definitions reuse one presentation instance; focus/z-order/minimize/taskbar restore behave deterministically; snap obeys local presentation settings; close never alters module/deployment/runtime state; Focused Window != Selected Semantic Object.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Evidence expected
Task-local regression proof plus exact-head repository validation appropriate to the changed surface.

# Escalation
Stop if the task requires moving canonical truth/authority/effects into Station or expanding into a deferred subsystem.
