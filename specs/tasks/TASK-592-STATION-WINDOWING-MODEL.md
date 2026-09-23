---
id: TASK-592
title: Implement Station window model lifecycle and deterministic reducer
status: completed
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
Implement provider-neutral WindowDefinition/WindowInstance schemas, deterministic reducer runtime, normalized desktop geometry bounds, focus/z-order, singleton vs multi-instance open policy, close/minimize/maximize/restore, LEFT/RIGHT snap metadata and geometry, plus presentation command definitions consumed by station-interaction. Window close/minimize state remains presentation-only and cannot imply module, deployment or runtime lifecycle.

# Inputs / contracts
ADR-0017 and station-interaction.

# Outputs / contracts
Pure windowing state APIs with no React/provider requirement.

# Acceptance criteria
Close Window != disable/uninstall/undeploy; focus/z-order is deterministic; multi-instance policy enforced; invalid geometry normalizes safely; reopening follows manifest policy.

# Non-goals
No drag/resize React surface yet, no persistence provider and no business resource state.

# Evidence expected
Lifecycle/state-transition tests including singleton reopen, multi-instance identity, deterministic focus/z-order, invalid geometry normalization, maximize/snap/restore, non-resizable movement, presentation-only close semantics and command-registry integration.

# Escalation
Stop if window lifecycle becomes app/business/runtime lifecycle or requires canonical Core persistence.
