---
id: TASK-663
title: Station S4 WP5 STRUCTURAL ENGINE
status: ready
priority: 663
milestone: STATION-S4-WP5-STRUCTURAL-AUTHORING
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-662
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
- packages/station-editor/structure.ts
- packages/station-editor/history.ts
- packages/station-editor/layers.ts
- packages/station-editor/artifact-codec.ts
- packages/station-editor/index.ts
- tests/product/station-editor-structure.test.ts
- tests/product/station-editor-artifact-codec.test.ts
- tests/product/station-editor-layers-selection.test.ts
- tests/product/station-editor-preview-convergence.test.ts
- project_docs/execution_planning/STATION-S4-WP5-CONSTRUCTION-A-01.report.md
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
max_files: 10
validation:
- npm run verify
---

Implement only Addendum 006 pure bounded operations, history, ordering and codec compatibility. Confirm ten allowed paths, forbidden paths, predecessor and validation. Tests invoke actual catalog/editor/projections/codec; include immutable failures, stale/root/foreign refs/cardinality/bounds/no-op/revision overflow and v1/v2. No UI change. Final Station build and all 29 predecessor browser journeys required.

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

## Bounded operational change control
Real regression exposed three assertions for the superseded alphabetical/array-order-independent projection behavior. Addendum 006 explicitly makes node array order meaningful. Permit only the two affected predecessor test files to assert authored sibling order while preserving identity/selection/ancestry/immutability proof. No new capability or architecture change.
