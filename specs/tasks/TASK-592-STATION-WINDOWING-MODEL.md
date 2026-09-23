---
id: TASK-592
title: Implement Station window model lifecycle and deterministic reducer
status: blocked
priority: 592
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-591
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
  - packages/station-windowing/**
  - tests/product/station-windowing.test.ts
  - specs/tasks/TASK-592-STATION-WINDOWING-MODEL.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 16
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# Objective
Create a provider-neutral window runtime before rendering daedalOS-derived window mechanics.

# Context
Window state is disposable Station presentation state and must not imply app/module/deployment lifecycle.

# Current behavior
No WindowDefinition/WindowInstance manager exists.

# Required change
Implement window definition/instance schemas, deterministic reducer/manager, geometry bounds, focus/z-order, open/close/minimize/maximize/restore and optional snap metadata. Expose commands through station-interaction.

# Inputs / contracts
ADR-0017 and station-interaction.

# Outputs / contracts
Pure windowing state APIs with no React/provider requirement.

# Acceptance criteria
Close Window != disable/uninstall/undeploy; focus/z-order is deterministic; multi-instance policy enforced; invalid geometry normalizes safely; reopening follows manifest policy.

# Non-goals
No drag/resize React surface yet, no persistence provider and no business resource state.

# Evidence expected
Lifecycle/state-transition tests including multi-window focus and invalid geometry.

# Escalation
Stop if window lifecycle becomes app/business/runtime lifecycle or requires canonical Core persistence.
