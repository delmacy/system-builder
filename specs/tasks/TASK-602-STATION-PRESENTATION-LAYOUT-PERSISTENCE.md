---
id: TASK-602
title: Persist and reset only Station presentation state and layout
status: ready
priority: 602
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-601
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-CONSTRUCTION-B-01.md
allowed_paths:
  - apps/station/**
  - packages/station-settings/**
  - packages/station-windowing/**
  - packages/station-shell/**
  - tests/product/**
  - specs/tasks/TASK-602-STATION-PRESENTATION-LAYOUT-PERSISTENCE.md
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
Complete live presentation preference application plus bounded local layout persistence/reset.

# Current behavior
station-settings already persists normalized presentation preferences locally; window layout is runtime-only and reset currently targets settings only.

# Required change
Implement only the bounded delta needed to satisfy this task on top of current main. Preserve already integrated behavior rather than replaying it.

# Acceptance criteria
Presentation settings apply live and survive reload; the M1-approved window layout survives reload locally; malformed/future data fails safe; reset clears/restores only presentation/layout state; no canonical/domain/authorization data is accepted.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Evidence expected
Task-local regression proof plus exact-head repository validation appropriate to the changed surface.

# Escalation
Stop if the task requires moving canonical truth/authority/effects into Station or expanding into a deferred subsystem.
