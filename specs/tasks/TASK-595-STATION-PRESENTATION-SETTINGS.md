---
id: TASK-595
title: Implement versioned Station presentation settings and local persistence adapter
status: blocked
priority: 595
milestone: STATION-VISUAL-M1
model_tier: strong
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-594
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
  - packages/station-settings/**
  - tests/product/station-settings.test.ts
  - specs/tasks/TASK-595-STATION-PRESENTATION-SETTINGS.md
max_files: 14
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run verify
---

# Objective
Create safe disposable persistence for shell appearance/preferences before the Settings UI exists.

# Context
M1 must adjust and restore visual state without turning browser storage into canonical system storage.

# Current behavior
No Station presentation settings model exists.

# Required change
Add schemaVersion, defaults, normalization/migration and storage adapter interface plus browser-local implementation for theme, density, motion, accent, navbar/toolbar/taskbar visibility, taskbar auto-hide, snap enabled and reset.

# Inputs / contracts
ADR-0017 and Station frontend state model.

# Outputs / contracts
station-settings public API and local provider.

# Acceptance criteria
Malformed/old state fails safe to normalized defaults; reset is bounded to presentation state; no secrets/business data/authorization fields are accepted; storage provider is replaceable.

# Non-goals
No Core-synced preferences, account settings, business configuration or window layout persistence yet.

# Evidence expected
Normalization/migration/reset/storage tests.

# Escalation
Stop if a requested setting requires canonical Core state or security-sensitive persistence.
