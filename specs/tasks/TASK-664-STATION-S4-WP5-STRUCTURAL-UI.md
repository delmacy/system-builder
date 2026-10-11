---
id: TASK-664
title: Station S4 WP5 STRUCTURAL UI
status: ready
priority: 664
milestone: STATION-S4-WP5-STRUCTURAL-AUTHORING
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-663
context_paths:
- AGENTS.md
- docs/DOCUMENT_AUTHORITY.md
- docs/contracts/CONTRACT_INDEX.md
- docs/current/NEXT_WORK.md
- docs/contracts/006-station-structural-authoring/ADDENDUM.md
- project_docs/execution_planning/STATION-S4-WP5-PLAN-01.md
- project_docs/schedule/SPRINT_MODE.md
- project_docs/schedule/SPRINT_GENERATION_POLICY.md
- project_docs/21-canvas-visual-builder/WBS.md
- docs/adr/ADR-0009-public-artifact-envelope.md
- docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
- apps/station/web/app/station-editor-workbench.tsx
- apps/station/web/app/station-editor-files.ts
- tests/browser/station-editor-workbench.spec.ts
- tests/product/station-editor-artifact-files.test.ts
- project_docs/execution_planning/STATION-S4-WP5-CONSTRUCTION-B-01.report.md
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
max_files: 5
validation:
- npm run verify
---

Integrate installed component/parent/slot palette and add/remove-subtree/reorder controls. Repair deleted selection through structure/history/discard; preserve pending text/cancel/failure/window lifetime. Choose declared payload major when updating retained documents. Five exact allowed paths. Actual UI/download/local-file/keyboard/narrow/Station proof plus all 29 predecessor journeys. Final npm run verify, Station build and all triggered checks required.

## Objective
Deliver the declared bounded WP5 Sprint goal.
## Context
Fresh integrated WP4 and owner WP5 authorization; Addendum 006 governs.
## Current behavior
Installed span editor/history and v1 fixed-topology artifacts.
## Required change
Execute only the allowed paths and manifested Sprint goal above.
## Inputs / contracts
Installed registry/source identities, graph, EditorSession, ADR-0009 and Addendum 006.
## Outputs / contracts
Bounded structural authoring and declared v1/v2 compatibility; Station projection authority only.
## Acceptance criteria
Positive/negative/predecessor proof and declared validations pass before integration.
## Non-goals
External components, reparenting, free drag, Core/server/File Manager/.process/sync/deploy and new dependencies.
## Evidence expected
One authoritative TASK commit, Sprint report, one PR and observed exact-head/current-base checks.
## Escalation
Stop for collision, conflicting authority, forbidden paths, undeclared L3/L4 or security weakening.
