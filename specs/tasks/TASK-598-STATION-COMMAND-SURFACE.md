---
id: TASK-598
title: Compose contextual Station Toolbar and Command Surface
status: ready
priority: 598
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-597
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-CONSTRUCTION-B-01.md
allowed_paths:
  - apps/station/**
  - packages/station-shell/**
  - packages/station-interaction/**
  - packages/station-windowing/**
  - packages/ui-core/**
  - packages/ui-icons/**
  - tests/product/**
  - specs/tasks/TASK-598-STATION-COMMAND-SURFACE.md
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
Project Station commands through a contextual Toolbar/Command Surface based on Selection + Context + Authority -> Available Commands.

# Current behavior
PresentationCommandRegistry exists, but there is no composed shell command surface and no visible distinction between presentation-local commands and intents that would require Core authorization.

# Required change
Implement only the bounded delta needed to satisfy this task on top of current main. Preserve already integrated behavior rather than replaying it.

# Acceptance criteria
Presentation Commands are clearly distinguished from Core Command Intents; command availability is projected from the interaction context/registry; visible controls never claim authorization; focused window and selected semantic object remain separate concepts.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Evidence expected
Task-local regression proof plus exact-head repository validation appropriate to the changed surface.

# Escalation
Stop if the task requires moving canonical truth/authority/effects into Station or expanding into a deferred subsystem.
