---
id: TASK-588
title: Bootstrap Station frontend host and qualify daedalOS extraction boundary
status: completed
priority: 588
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-WP-01.md
allowed_paths:
  - apps/station/**
  - package.json
  - package-lock.json
  - tsconfig.json
  - tsconfig.build.json
  - eslint.config.*
  - docs/third-party/**
  - specs/tasks/TASK-588-STATION-FRONTEND-HOST-DAEDALOS-EXTRACTION.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 18
validation:
  - npm run lint
  - npm run typecheck
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---

# Objective
Create the executable frontend host for Station and record the bounded daedalOS adoption map before any shell code is imported.

# Context
The Station application boundary exists but is non-visual. ADR-0017 selects React/Next and a source-owned SB shell while treating daedalOS as MIT-licensed donor/reference rather than runtime authority.

# Current behavior
The repository has no React/Next frontend dependencies or Station page/app host. daedalOS code is not vendored.

# Required change
Add the minimum React/Next/Tailwind/Playwright-capable Station host/build wiring needed by this Work Package, preserve the existing StationApplication boundary, and create a third-party adoption record classifying exact daedalOS files/patterns as REUSE/ADAPT/REIMPLEMENT/DISCARD. Pin compatible dependency versions rather than following floating latest.

# Inputs / contracts
ADR-0016, ADR-0017, current StationApplication and public daedalOS MIT source evidence.

# Outputs / contracts
A Station frontend host that can render a trivial page, repository scripts for Station dev/build/test preparation, and a durable daedalOS adoption/attribution record.

# Acceptance criteria
Station host compiles without Core; existing Station protocol tests remain green; daedalOS filesystem/session/process/app semantics are explicitly excluded; any copied code is attributable; dependency versions are pinned/locked.

# Non-goals
No real shell chrome, windows, Settings UI, File Manager, Core transport or wholesale daedalOS fork.

# Evidence expected
Build/typecheck proof, one trivial render smoke proof, lockfile diff and adoption matrix.

# Escalation
Stop if repository build tooling cannot support the frontend without changing unrelated package architecture, or if reuse requires adopting daedalOS authority/filesystem/process semantics.
