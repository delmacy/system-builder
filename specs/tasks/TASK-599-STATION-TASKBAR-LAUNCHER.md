---
id: TASK-599
title: Complete Station Taskbar Launcher and running-window projection
status: ready
priority: 599
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-598
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
  - specs/tasks/TASK-599-STATION-TASKBAR-LAUNCHER.md
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
Finish Taskbar/Launcher as a projection of manifests and window runtime.

# Current behavior
PR #910 already added launcher buttons, running/minimized projection and focus/restore; preserve it.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work.

# Acceptance criteria
Welcome, Component Lab and Settings launch from manifests; singleton behavior is respected; taskbar reflects open/minimized windows and restores/focuses them without inferring process/runtime lifecycle.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.
