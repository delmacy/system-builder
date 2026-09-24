---
id: TASK-604
title: Prove Station M1 browser and cross-platform shell behavior
status: ready
priority: 604
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-603
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
  - package.json
  - package-lock.json
  - playwright.config.ts
  - .github/workflows/station-next-ci.yml
  - specs/tasks/TASK-604-STATION-PLAYWRIGHT-M1.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 24
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# Objective
Add bounded browser-level M1 journey proof and preserve Windows/Ubuntu Station Next.js builds.

# Current behavior
Repository/product tests cover foundations and dedicated cross-platform Next.js CI exists, but the full shell journey lacks browser-level proof. The original TASK-604 path contract allowed browser test files while forbidding every path capable of declaring/running Playwright, so the required browser proof could not become executable exact-head evidence.

# Required change
Implement only the bounded delta on current main; do not replay already integrated work. Playwright dependency/configuration and the existing Station-specific CI workflow may be changed only as required to make the M1 browser proof executable on the existing Windows/Ubuntu Station gate.

# Acceptance criteria
Browser proof covers disconnected mode, shell chrome, utility launch, multi-window focus/minimize/restore, live Settings/persistence/reset and primary keyboard navigation; cross-platform build gates remain green. The Playwright journey is executed by the dedicated Station CI rather than merely committed as dormant test source.

# Non-goals
No canonical Station DB/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent execution, schedulers, agents or invented domain state. No changes to non-Station workflows.

# Context
This task is part of STATION-VISUAL-CONSTRUCTION-B-01 on the fresh-main baseline after PR #910. Existing integrated shell behavior is authoritative current behavior and is not to be replayed.

# Inputs / contracts
ADR-0017, STATION_FRONTEND_FOUNDATION, the Construction B manifest, source-owned ui-core/ui-icons, Station interaction/window/app/settings contracts, and the immediately preceding TASK output.

# Outputs / contracts
Only the bounded Station presentation/interaction proof delta described by this task, exposed through the existing package layering and composition root plus the minimum Station-specific browser-test harness needed to execute that proof.

# Evidence expected
Task-local browser regression coverage, repository verification, architecture checks and exact-head Windows/Ubuntu Station CI evidence appropriate to the changed surface.

# Escalation
Stop if completion requires canonical truth, authorization decisions, provider/domain effects, deploy/storage/workflow/agent implementation, or bypassing the declared package layering.
