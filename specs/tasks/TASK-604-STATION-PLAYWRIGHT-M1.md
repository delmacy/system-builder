---
id: TASK-604
title: Prove Station M1 browser and cross-platform shell behavior
status: ready
priority: 604
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-603
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
  - specs/tasks/TASK-604-STATION-PLAYWRIGHT-M1.md
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
Add bounded browser-level M1 journey proof and preserve Windows/Ubuntu Station Next.js builds.

# Current behavior
Repository/product tests cover foundations and dedicated cross-platform Next.js CI exists, but the full shell journey lacks browser-level proof.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work.

# Acceptance criteria
Browser proof covers disconnected mode, shell chrome, utility launch, multi-window focus/minimize/restore, live Settings/persistence/reset and primary keyboard navigation; cross-platform build gates remain green.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.
