---
id: TASK-597
title: Compose Station Navbar and truthful shell context
status: ready
priority: 597
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-596
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-CONSTRUCTION-B-01.md
allowed_paths:
  - apps/station/**
  - packages/station-shell/**
  - packages/station-interaction/**
  - packages/ui-core/**
  - packages/ui-icons/**
  - tests/product/**
  - specs/tasks/TASK-597-STATION-NAVBAR.md
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
Compose the global Navbar across the shell. It must expose System Builder/Home, current shell context, Search/Command/Settings access and only indicators derived from actually known Station state.

# Current behavior
The current top strip only identifies Station and explicit Core: Disconnected. It is not yet the committed Navbar surface.

# Required change
Implement only the bounded delta needed to satisfy this task on top of current main. Preserve already integrated behavior rather than replaying it.

# Acceptance criteria
Navbar spans the shell width, uses semantic ui-core/ui-icons, keeps Core disconnected truth explicit, provides accessible Home/Search/Command/Settings affordances, and does not invent Core/client/domain status.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Evidence expected
Task-local regression proof plus exact-head repository validation appropriate to the changed surface.

# Escalation
Stop if the task requires moving canonical truth/authority/effects into Station or expanding into a deferred subsystem.
