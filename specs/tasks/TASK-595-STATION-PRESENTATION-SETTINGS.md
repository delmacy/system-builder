---
id: TASK-595
title: Implement versioned Station presentation settings and local persistence adapter
status: completed
priority: 595
milestone: STATION-VISUAL-M1
model_tier: architecture
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
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
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
Add schemaVersion, frozen defaults, fail-safe normalization/migration, bounded update/reset helpers, a replaceable storage interface and browser-local implementation for theme, density, motion, accent, navbar/toolbar/taskbar visibility, taskbar auto-hide and snap enabled. Unknown/future schema versions and malformed storage degrade to defaults rather than becoming authoritative.

# Inputs / contracts
ADR-0017 and Station frontend state model.

# Outputs / contracts
station-settings public API and local provider.

# Acceptance criteria
Malformed/old state fails safe to normalized defaults; reset is bounded to presentation state; no secrets/business data/authorization fields are accepted; storage provider is replaceable.

# Non-goals
No Core-synced preferences, account settings, business configuration or window layout persistence yet.

# Evidence expected
Normalization/migration/update/reset/storage round-trip tests, corrupt-storage fallback proof and assertions that authorization/secrets/business data are absent from the presentation contract.

# Escalation
Stop if a requested setting requires canonical Core state or security-sensitive persistence.
