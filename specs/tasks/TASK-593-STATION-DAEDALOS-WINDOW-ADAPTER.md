---
id: TASK-593
title: Adapt bounded daedalOS window interaction patterns into SB window surface
status: completed
priority: 593
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-592
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - docs/third-party/**
allowed_paths:
  - tsconfig.json
  - packages/station-windowing/**
  - packages/ui-core/**
  - docs/third-party/**
  - tests/product/station-window-surface.test.ts
  - specs/tasks/TASK-593-STATION-DAEDALOS-WINDOW-ADAPTER.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 18
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run verify
---

# Objective
Render the SB Window model with bounded desktop interaction mechanics informed by daedalOS without importing its authority/filesystem/process model.

# Context
daedalOS provides mature MIT-licensed window interaction patterns and uses react-rnd. ADR-0017 requires a source-owned SB boundary.

# Current behavior
Windowing is state-only after TASK-592.

# Required change
Implement a source-owned WindowFrame and native Pointer Events interaction adapter supporting focus and geometry updates through WindowAction only. Use the daedalOS controlled drag/resize/focus pattern as reference, but do not import its process/session/filesystem contexts or source code. Reconcile the TASK-588 adoption matrix and record the exact upstream files inspected. Add the public @system-builder/ui-core alias required by repository architecture checks.

# Inputs / contracts
station-windowing model, ui-core, daedalOS adoption record.

# Outputs / contracts
A reusable React WindowFrame controlled by SB WindowInstance state.

# Acceptance criteria
Renderer cannot mutate canonical system state; drag/resize emits presentation intents; provider implementation is replaceable; no daedalOS process/session/filesystem imports exist.

# Non-goals
No taskbar, launcher, final shell styling or domain window content.

# Evidence expected
Window surface render tests, pointer geometry projection tests, emitted presentation-intent tests, dependency/architecture scan, and updated daedalOS adoption record.

# Escalation
Stop if bounded adaptation would require carrying daedalOS process/filesystem/session contexts.
