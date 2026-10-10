---
id: TASK-649
title: Station S4 WP2 Window Editor Journey
status: verification
priority: 649
milestone: STATION-S4-WP2-EDITOR-OPERATIONAL
model_tier: architecture
executor_preference: any
risk: medium
architecture_impact: false
depends_on:
  - TASK-648
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-B-01.md
  - packages/station-app-runtime/**
  - packages/station-windowing/**
  - apps/station/web/app/station-editor-workbench.tsx
allowed_paths:
  - apps/station/web/app/station-foundation-client.tsx
  - packages/station-windowing/window-frame.tsx
  - tests/browser/station-editor-workbench.spec.ts
  - tests/product/station-visual-foundation.test.ts
  - specs/tasks/TASK-649-STATION-S4-WP2-WINDOW-EDITOR.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-B-01.report.md
forbidden_paths:
  - packages/station-editor/**
  - packages/station-composition/**
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 6
validation:
  - npm run verify
  - npm run station:build
  - npx playwright test --config tests/browser/station-editor.playwright.config.ts
---

# TASK-649 — Station Window Editor Journey

Wire TASK-648 app into the ordinary Station launcher and WindowFrame on the desktop. Ensure minimize keeps one mounted workbench draft, selection and fields, restore returns it, and close unmounts it; reopening starts fresh. The hidden minimized window must not be visible or keyboard reachable. Preserve independent non-editor windows and existing /component-editor route. Existing Station layout storage must serialize only presentation fields, not editor graphs or drafts. Actual browser tests start at /, use launcher/taskbar, prove positive edit/save/discard, minimize/restore, close/reopen, negative bounds/switch and layout payload boundary; retain all ten WP1/A regressions. WindowFrame lifecycle adjustment remains internal L2 with no public schema change. Run full validation and report exact-head/browser evidence.

## Objective

Launch and retain the editor through the ordinary Station window lifecycle.

## Context

Construction A PR #1036 integrated at main@399db219 with exact-head verify/build/browser. This TASK executes under Addendum 003 and the committed Construction B manifest.

## Current behavior

The desktop maps only OPEN windows; minimizing unmounts the workbench, and no editor manifest is registered in the desktop.

## Required change

Wire TASK-648 through the launcher and WindowFrame; preserve mounted state while hidden on minimize, unmount on close, and prove actual route/browser lifecycle and layout-storage boundary.

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

## Implementation checkpoint — 2026-10-10
Desktop launcher/window lifecycle and actual browser journeys committed; exact-head proof pending.

## Bounded change control — 2026-10-10
The existing product source-assertion test assumes only OPEN windows are rendered and must be updated to assert the admitted minimized-mounted lifecycle. Its path is added to allowed_paths and max_files before mutation; no new behavior or package scope is introduced.
