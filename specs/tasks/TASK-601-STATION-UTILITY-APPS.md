---
id: TASK-601
title: Implement useful Settings M1 and Component Lab inspection surface
status: ready
priority: 601
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-600
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-CONSTRUCTION-B-01.md
allowed_paths:
  - apps/station/**
  - packages/station-shell/**
  - packages/station-settings/**
  - packages/station-app-runtime/**
  - packages/ui-core/**
  - packages/ui-icons/**
  - tests/product/**
  - specs/tasks/TASK-601-STATION-UTILITY-APPS.md
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
Implement the first useful Settings UI and expand Component Lab into the M1 design-system inspection surface.

# Current behavior
Utility manifests and placeholder bodies exist. Settings currently toggles density only; Component Lab currently lists a few badges.

# Required change
Implement only the bounded delta needed to satisfy this task on top of current main. Preserve already integrated behavior rather than replaying it.

# Acceptance criteria
Settings controls theme system/light/dark, density comfortable/compact, motion full/reduced, navbar/toolbar/taskbar visibility, taskbar auto-hide when supported, and snap enabled. Component Lab exposes ui-core primitives/states, semantic icons/tokens, focus, reduced-motion and density demonstrations.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Evidence expected
Task-local regression proof plus exact-head repository validation appropriate to the changed surface.

# Escalation
Stop if the task requires moving canonical truth/authority/effects into Station or expanding into a deferred subsystem.
