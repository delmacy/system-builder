---
id: TASK-648
title: Station S4 WP2 Editor App Manifest
status: verification
priority: 648
milestone: STATION-S4-WP2-EDITOR-OPERATIONAL
model_tier: architecture
executor_preference: any
risk: medium
architecture_impact: false
depends_on:
  - TASK-647
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-B-01.md
  - packages/station-app-runtime/**
  - packages/station-windowing/**
allowed_paths:
  - apps/station/web/app/station-editor-app.ts
  - tests/product/station-editor-app.test.ts
  - specs/tasks/TASK-648-STATION-S4-WP2-EDITOR-APP.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-B-01.report.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/**
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 5
validation:
  - npm run verify
  - npm run station:build
---

# TASK-648 — Station Editor App Manifest

Register an app-local normalized AppManifest with window definition for ordinary StationAppRegistry launch. Use source-owned identity and existing WindowDefinition, no new shared contract. Positive and negative product tests prove valid launch, singleton/known identity and rejection of unknown application without modifying the existing M1 inventory. Do not wire desktop in this TASK. Run declared validations before TASK-649.

## Implementation checkpoint — 2026-10-10
App-local normalized manifest and product tests committed; exact-head verify/build pending.
