---
id: TASK-659
title: Station S4 WP4 HISTORY-WORKBENCH
status: completed
priority: 659
milestone: STATION-S4-WP4-EDIT-HISTORY
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-658
context_paths:
- AGENTS.md
- docs/DOCUMENT_AUTHORITY.md
- docs/contracts/CONTRACT_INDEX.md
- docs/current/NEXT_WORK.md
- docs/contracts/005-station-edit-history/ADDENDUM.md
- project_docs/execution_planning/STATION-S4-WP4-PLAN-01.md
- project_docs/execution_planning/STATION-S4-WP4-CONSTRUCTION-B-01.md
- packages/station-editor/history.ts
- packages/station-editor/draft-boundary.ts
- apps/station/web/app/station-editor-workbench.tsx
- apps/station/web/app/station-editor-files.ts
- apps/station/web/app/station-editor-catalog.ts
- packages/station-editor/artifact-store.ts
- tests/browser/station-editor-workbench.spec.ts
- tests/browser/station-editor.playwright.config.ts
- docs/architecture/STATION_FRONTEND_FOUNDATION.md
- project_docs/21-canvas-visual-builder/WBS.md
allowed_paths:
- apps/station/web/app/station-editor-workbench.tsx
- tests/browser/station-editor-workbench.spec.ts
- specs/tasks/TASK-659-STATION-S4-WP4-HISTORY-WORKBENCH.md
- project_docs/execution_planning/STATION-S4-WP4-CONSTRUCTION-B-01.report.md
- docs/architecture/STATION_FRONTEND_FOUNDATION.md
- docs/current/NEXT_WORK.md
forbidden_paths:
- docs/adr/**
- specs/contracts/**
- packages/contracts/**
- packages/station-settings/**
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

# TASK-659 — HISTORY-WORKBENCH

## Objective
Deliver bounded undo/redo in the actual editor route and Station window.

## Context
WP3 is integrated through #1049. Owner requested continuation and conclusion on 2026-10-10. Addendum 005 governs the bounded WP4; forecasts do not authorize construction.

## Current behavior
Installed source-owned compositions support span edits and explicit session/local/file checkpoints; no edit history is present at the planning baseline.

## Required change
Use one history wrapper as the current-session owner in the reducer; use proven A API, explicit checkpoint/open/cancel/failure lifecycle, availability and polite feedback. Scoped keyboard shortcuts exclude native text/IME/repeat/Alt; unapplied fields/pending replacement block without data loss. Add eight integrated browser journeys; document operations incrementally.

## Inputs / contracts
Use unchanged EditorSession, structural edit, draft acceptance, installed registry, graph and artifact contracts. History is ephemeral presentation state, separate from artifacts and window preferences.

## Outputs / contracts
Bounded reversible span edits; no source topology, public envelope, persistence or Core authority change.

## Acceptance criteria
- All 21 predecessor journeys plus eight growing history cases pass.
- Both compositions converge through undo/redo, retain selection, dirty and monotonic revision.
- Native input undo/unapplied fields; reset on successful save/discard/open/switch/reload/close; preserve on failed/cancel/export/minimize.
- Real UI 51 edits retains 50; artifacts and preferences contain no history.
- Actual Chromium/download evidence plus Windows/Ubuntu and exact-head/current-base Actions; no local pass inferred.

## Non-goals
Structural authoring, component installation, File Manager, .process, Core/server/sync/deploy, arbitrary HTML/CSS, dependencies or shared schema/ADR changes.

## Evidence expected
One authoritative TASK commit, Sprint report, one PR; observed declared local validations and exact-head/current-base Actions, heavy/handoff/browser proof before merge. Never infer a pass.

## Escalation
Stop for conflicting authority, worker collision, forbidden path, undeclared L3/L4/dependency change or proof requiring scope relaxation. Preserve unrelated PRs and legacy ledger.

## Implementation checkpoint
History controls, scoped shortcuts and checkpoint lifecycle implemented on this branch. All 29 real Chromium journeys and exact-head CI required before integration.
