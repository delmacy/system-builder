---
id: TASK-591
title: Establish Station command shortcut focus and selection runtime
status: completed
priority: 591
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-590
context_paths:
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
  - packages/station-interaction/**
  - tests/product/station-interaction.test.ts
  - specs/tasks/TASK-591-STATION-INTERACTION-COMMAND-RUNTIME.md
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
  - npm run check:architecture
  - npm run verify
---

# Objective
Create presentation-safe semantic commands before toolbar/menu/shortcut controls are built.

# Context
All shell controls should invoke commands; visibility does not grant Core authority.

# Current behavior
Station has protocol operations but no UI command registry or shortcut/focus model.

# Required change
Add a PresentationCommandDefinition/Registry, execution context, fail-closed availability predicate, deterministic keyboard shortcut mapping, focus identity and minimal selection context for presentation commands. Define CoreCommandIntent only as a non-executable future routing descriptor so presentation controls cannot bypass Station SDK/Core authority.

# Inputs / contracts
ADR-0017; existing StationApplication remains separate for Core work.

# Outputs / contracts
`station-interaction` APIs used later by windows/shell.

# Acceptance criteria
Multiple controls can invoke the same command; unavailable command cannot be strengthened by a visible button; shortcut conflicts are deterministic; local commands are clearly typed apart from future Core commands.

# Non-goals
No business authorization engine, Undo/Redo semantics, command palette UI or AI invocation.

# Evidence expected
Registry invocation/availability tests, shortcut normalization/conflict tests, focus/selection normalization tests, and explicit rejection of Core intents by the presentation registry.

# Escalation
Stop if the UI command layer begins deciding business authorization or bypassing Station SDK.
