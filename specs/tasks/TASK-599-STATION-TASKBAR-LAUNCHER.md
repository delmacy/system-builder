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
  - packages/station-windowing/**
  - packages/station-app-runtime/**
  - packages/ui-core/**
  - packages/ui-icons/**
  - tests/product/**
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
Finish the M1 Taskbar/Launcher as a projection of AppManifest discovery and window runtime state.

# Current behavior
PR #910 already added launcher buttons, running/minimized window projection and taskbar focus/restore. This task must preserve that work and complete only missing M1 shell/keyboard/settings semantics.

# Required change
Implement only the bounded delta needed to satisfy this task on top of current main. Preserve already integrated behavior rather than replaying it.

# Acceptance criteria
Welcome, Component Lab and Settings launch from manifests; singleton behavior is respected; taskbar reflects open/minimized windows and restores/focuses them; presentation visibility/autohide contract is honored when enabled; no process/runtime lifecycle is inferred.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Evidence expected
Task-local regression proof plus exact-head repository validation appropriate to the changed surface.

# Escalation
Stop if the task requires moving canonical truth/authority/effects into Station or expanding into a deferred subsystem.
