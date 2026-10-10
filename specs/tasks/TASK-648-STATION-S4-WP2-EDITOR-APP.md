---
id: TASK-648
title: Station S4 WP2 Editor App Manifest
status: verification
priority: 648
milestone: STATION-S4-WP2-EDITOR-OPERATIONAL
model_tier: architecture
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

## Objective

Register the Composition Editor as an ordinary source-owned Station app.

## Context

Construction A PR #1036 integrated at main@399db219 with exact-head verify/build/browser. This TASK executes under Addendum 003 and the committed Construction B manifest.

## Current behavior

The reusable editor exists at /component-editor but the launcher has no app definition for it.

## Required change

Define and test a normalized app-local manifest with a singleton editor window, known identity and unknown-app rejection. Do not wire desktop yet.

## Inputs / contracts

Existing public StationAppRegistry, WindowDefinition, WindowFrame and Station editor/workbench APIs. No schema change.

## Outputs / contracts

A bounded Station-local app/window editing journey with one session per mounted window; no Core or durable composition authority.

## Acceptance criteria

- The declared positive, negative and predecessor integration behaviors pass real tests.
- All declared validation commands pass before successor work and final exact-head checks pass before merge.
- All changes stay inside allowed_paths and max_files.

## Non-goals

No external files/JSON, provider, durable editor persistence, Core/business, deploy, C10, public API/schema or workflow change.

## Evidence expected

TASK commit, actual verify/build/browser run IDs, retained report/screenshots, Sprint report and separate IMPLEMENTED/PROVEN/INTEGRATED claims.

## Escalation

Stop for forbidden path, unavailable public capability, L3/L4 contract/architecture drift, conflicting writer or failing proof; do not silently expand this TASK.
