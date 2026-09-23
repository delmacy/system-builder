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
  - packages/station-app-runtime/**
  - packages/station-windowing/**
  - packages/station-interaction/**
  - packages/station-settings/**
  - packages/ui-icons/**
  - packages/ui-core/**
  - tests/product/**
  - tests/e2e/**
  - specs/tasks/TASK-598-STATION-COMMAND-BAR.md
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
Project commands contextually from Selection + Context + Authority -> Available Commands.

# Current behavior
PresentationCommandRegistry exists, but no shell command surface distinguishes local Presentation Commands from Core Command Intents.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work.

# Acceptance criteria
Presentation Commands and Core Command Intents are visibly distinct; availability is context-derived; visible controls never imply authorization; focused window and selected semantic object remain distinct.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Context
This task is part of STATION-VISUAL-CONSTRUCTION-B-01 on the fresh-main baseline after PR #910. Existing integrated shell behavior is authoritative current behavior and is not to be replayed.

# Inputs / contracts
ADR-0017, STATION_FRONTEND_FOUNDATION, the Construction B manifest, source-owned ui-core/ui-icons, Station interaction/window/app/settings contracts, and the immediately preceding TASK output.

# Outputs / contracts
Only the bounded Station presentation/interaction delta described by this task, exposed through the existing package layering and composition root.

# Evidence expected
Task-local regression coverage, repository verification, architecture checks and exact-head CI evidence appropriate to the changed surface.

# Escalation
Stop if completion requires canonical truth, authorization decisions, provider/domain effects, deploy/storage/workflow/agent implementation, or bypassing the declared package layering.
