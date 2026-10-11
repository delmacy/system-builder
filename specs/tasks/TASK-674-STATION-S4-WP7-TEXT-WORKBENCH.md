---
id: TASK-674
title: Station S4 WP7 TEXT WORKBENCH
status: completed
priority: 674
milestone: STATION-S4-WP7-BUTTON-TEXT
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-673
context_paths:
- AGENTS.md
- docs/DOCUMENT_AUTHORITY.md
- docs/contracts/CONTRACT_INDEX.md
- docs/current/NEXT_WORK.md
- docs/contracts/007-station-button-text/ADDENDUM.md
- project_docs/execution_planning/STATION-S4-WP7-PLAN-01.md
- project_docs/schedule/SPRINT_MODE.md
- project_docs/schedule/SPRINT_GENERATION_POLICY.md
- project_docs/21-canvas-visual-builder/WBS.md
- docs/adr/ADR-0009-public-artifact-envelope.md
- docs/architecture/STATION_FRONTEND_FOUNDATION.md
- docs/current/RISKS.md
allowed_paths:
- packages/station-editor/artifact-codec.ts
- tests/product/station-editor-artifact-codec.test.ts
- tests/product/station-editor-structure.test.ts
- tests/product/station-editor-button-text.test.ts
- apps/station/web/app/station-editor-workbench.tsx
- apps/station/web/app/station-editor-files.ts
- tests/product/station-editor-artifact-files.test.ts
- tests/browser/station-editor-workbench.spec.ts
- project_docs/execution_planning/STATION-S4-WP7-PLAN-01.md
- project_docs/execution_planning/STATION-S4-WP7-CONSTRUCTION-B-01.md
- specs/tasks/TASK-674-STATION-S4-WP7-TEXT-WORKBENCH.md
- docs/current/NEXT_WORK.md
- project_docs/execution_planning/STATION-S4-WP7-CONSTRUCTION-B-01.report.md
forbidden_paths:
- docs/adr/**
- packages/contracts/**
- .github/**
- provider/**
- runtime/**
- deploy/**
max_files: 13
validation:
- npm run verify
---

## Objective
Implement Apply text/Reset text Inspector workflow, synchronized display, safe pending fields, file equality/version integration and actual expanded browser/API predecessor proof.
## Context
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Current behavior
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Required change
Implement Apply text/Reset text Inspector workflow, synchronized display, safe pending fields, file equality/version integration and actual expanded browser/API predecessor proof.
## Inputs / contracts
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Outputs / contracts
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Acceptance criteria
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Non-goals
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Evidence expected
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.
## Escalation
Addendum007 and WP7 plan govern; strict declared paths, unchanged boundaries, predecessor regression, full declared verification and exact-head CI. Record unobserved local checks honestly; stop on conflicting authority or missing proof.


## Bounded compatibility correction
Optional text in payloadv3 does not require an override to exist. Producers still choose legacy versions when possible, but readers accept valid empty-override v3 too. Extend codec and three tests under the same accepted Addendum007 compatibility goal before edits;13 exact paths, no forbidden path/new capability. Legacy unknown-version tests must now use v4.
