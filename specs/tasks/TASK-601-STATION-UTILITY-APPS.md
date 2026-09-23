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
  - packages/station-app-runtime/**
  - packages/station-windowing/**
  - packages/station-interaction/**
  - packages/station-settings/**
  - packages/ui-icons/**
  - packages/ui-core/**
  - tests/product/**
  - tests/e2e/**
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
Utility manifests and placeholder bodies exist; Settings toggles density only and Component Lab is only a small badge inventory.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work.

# Acceptance criteria
Settings controls theme, density, motion, navbar/toolbar/taskbar visibility, taskbar auto-hide when contracted, and snap. Component Lab exposes ui-core primitives/states, semantic icons/tokens, focus, reduced-motion and density.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.
