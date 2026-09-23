---
id: TASK-605
title: Close Construction B with cumulative M1 shell proof
status: ready
priority: 605
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-604
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
  - project_docs/execution_planning/**
  - docs/current/NEXT_WORK.md
  - specs/tasks/TASK-605-STATION-M1-CUMULATIVE-PROOF.md
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
Close Construction B only after the complete M1 shell and architecture boundary are demonstrated.

# Current behavior
Construction B is incomplete until all preceding tasks and relevant exact-head/browser/cross-platform evidence are green.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work.

# Acceptance criteria
Station starts explicitly disconnected; Navbar/Toolbar/Desktop/Taskbar compose; utility apps/window/settings/persistence/reset/keyboard pass; semantic icons/ui-core remain source-owned; no Core/Agent/provider/deploy/workflow/storage truth moved into Station.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.
