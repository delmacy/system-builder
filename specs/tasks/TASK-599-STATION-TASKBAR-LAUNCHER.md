---
id: TASK-599
title: Complete Station Taskbar Launcher and running-window projection
status: running
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
Implement only the bounded delta on current main; do not replay already integrated work. As part of the running-window projection, make the focused window visually distinct from unfocused windows using the existing `WindowInstance.focused` truth. The treatment must be restrained and desktop-familiar: stronger active border/ring/shadow and active titlebar emphasis, with inactive chrome visually receding without dimming window content.

# Acceptance criteria
Welcome, Component Lab and Settings launch from manifests; singleton behavior is respected; taskbar reflects open/minimized windows and restores/focuses them without inferring process/runtime lifecycle. The active/focused window is immediately distinguishable from inactive windows, and the distinction is derived only from `WindowInstance.focused` rather than semantic selection or invented shell state.

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
