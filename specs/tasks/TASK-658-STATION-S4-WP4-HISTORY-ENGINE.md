---
id: TASK-658
title: Station S4 WP4 HISTORY-ENGINE
status: completed
priority: 658
milestone: STATION-S4-WP4-EDIT-HISTORY
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-657
context_paths:
- AGENTS.md
- docs/DOCUMENT_AUTHORITY.md
- docs/contracts/CONTRACT_INDEX.md
- docs/current/NEXT_WORK.md
- docs/contracts/005-station-edit-history/ADDENDUM.md
- project_docs/execution_planning/STATION-S4-WP4-PLAN-01.md
- project_docs/execution_planning/STATION-S4-WP4-CONSTRUCTION-A-01.md
- packages/station-editor/session.ts
- packages/station-editor/edit.ts
- packages/station-editor/draft-boundary.ts
- packages/station-composition/draft-transaction.ts
- apps/station/web/app/station-editor-catalog.ts
- packages/station-editor/artifact-codec.ts
- project_docs/21-canvas-visual-builder/WBS.md
- docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
- packages/station-editor/history.ts
- packages/station-editor/index.ts
- tests/product/station-editor-history.test.ts
- specs/tasks/TASK-658-STATION-S4-WP4-HISTORY-ENGINE.md
- project_docs/execution_planning/STATION-S4-WP4-CONSTRUCTION-A-01.report.md
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

# TASK-658 — HISTORY-ENGINE

## Objective
Implement safe bounded ephemeral span-edit history.

## Context
WP3 is integrated through #1049. Owner requested continuation and conclusion on 2026-10-10. Addendum 005 governs the bounded WP4; forecasts do not authorize construction.

## Current behavior
Installed source-owned compositions support span edits and explicit session/local/file checkpoints; no edit history is present at the planning baseline.

## Required change
Add a pure wrapper containing current EditorSession and immutable past/future graph snapshots; reuse existing intent/edit/validation APIs. Initialize, apply, undo and redo typed results; no field on EditorSession and no persistence. Exact rules are in Addendum 005.

## Inputs / contracts
Use unchanged EditorSession, structural edit, draft acceptance, installed registry, graph and artifact contracts. History is ephemeral presentation state, separate from artifacts and window preferences.

## Outputs / contracts
Bounded reversible span edits; no source topology, public envelope, persistence or Core authority change.

## Acceptance criteria
- Real catalog/projection convergence for both installed entries.
- Limit 49/50/51, redo branch, no-op/rejection preservation, empty history.
- Stale/overflow/invalid/malformed or foreign topology rejection with unchanged input.
- Dirty baseline and monotonic revision proof; immutable snapshots and codec isolation.

## Non-goals
Structural authoring, component installation, File Manager, .process, Core/server/sync/deploy, arbitrary HTML/CSS, dependencies or shared schema/ADR changes.

## Evidence expected
One authoritative TASK commit, Sprint report, one PR; observed declared local validations and exact-head/current-base Actions, heavy/handoff/browser proof before merge. Never infer a pass.

## Escalation
Stop for conflicting authority, worker collision, forbidden path, undeclared L3/L4/dependency change or proof requiring scope relaxation. Preserve unrelated PRs and legacy ledger.

## Implementation checkpoint
Pure history and eight real-catalog tests implemented on this Sprint branch. Exact-head Actions and validated integration remain required; B is not yet committed.
