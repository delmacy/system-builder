---
id: TASK-605
title: Close Construction B with cumulative M1 shell proof
status: completed
priority: 605
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-604
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
  - project_docs/execution_planning/**
  - docs/current/NEXT_WORK.md
  - specs/tasks/TASK-605-STATION-M1-CUMULATIVE-PROOF.md
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
Close Construction B only after the complete M1 shell and architecture boundary are demonstrated.

# Closure
Construction B is cumulatively proven through TASK-604 exact-head evidence. The M1 shell boots explicitly disconnected; Navbar, Toolbar/Command Surface, Desktop Sphere and Taskbar/Launcher compose; Welcome, Component Lab and Settings are usable as presentation applications; multi-window focus/minimize/restore/snap behavior is bounded to interaction state; presentation preferences/layout persist locally and reset without mutating Core truth; primary shell journeys have keyboard/browser proof; semantic icons and ui-core remain source-owned.

# Architecture boundary proof
`Station presentation state != Core truth`, `Window lifecycle != runtime lifecycle`, and `Focused Window != Selected Semantic Object` remain preserved. No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy/storage/workflow runtime, Host Agent execution, schedulers, agents, Canvas/3D or invented domain state were absorbed.

# Acceptance criteria
Satisfied by the cumulative TASK-597..604 implementation plus exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Next.js CI Windows/Ubuntu and browser M1 journey evidence on predecessor head `5cd2c9600a4e2784ebe26984771f5fb559123da2`.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state.

# Context
This task closes `STATION-VISUAL-CONSTRUCTION-B-01` on the fresh-main baseline after PR #910. Existing integrated shell behavior is authoritative current behavior and was not replayed.

# Inputs / contracts
ADR-0017, STATION_FRONTEND_FOUNDATION, the Construction B manifest, source-owned ui-core/ui-icons, Station interaction/window/app/settings contracts, and TASK-604 exact-head browser/cross-platform proof.

# Outputs / contracts
A bounded cumulative closure record only; no new product authority or deferred subsystem implementation.

# Evidence expected
Task-local closure record plus exact-head CI evidence for this documentation-only closure commit before integration.

# Escalation
Stop if integration requires canonical truth, authorization decisions, provider/domain effects, deploy/storage/workflow/agent implementation, or bypassing the declared package layering.
