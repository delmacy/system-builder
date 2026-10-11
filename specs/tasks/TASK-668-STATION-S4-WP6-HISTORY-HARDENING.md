---
id: TASK-668
title: Station S4 WP6 HISTORY HARDENING
status: ready
priority: 668
milestone: STATION-S4-WP6-HISTORY-HARDENING
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-667
context_paths:
- AGENTS.md
- docs/DOCUMENT_AUTHORITY.md
- docs/contracts/CONTRACT_INDEX.md
- docs/current/NEXT_WORK.md
- docs/contracts/006-station-structural-authoring/ADDENDUM.md
- project_docs/execution_planning/STATION-S4-WP6-PLAN-01.md
- project_docs/schedule/SPRINT_MODE.md
- project_docs/schedule/SPRINT_GENERATION_POLICY.md
- project_docs/21-canvas-visual-builder/WBS.md
- docs/adr/ADR-0009-public-artifact-envelope.md
- docs/architecture/STATION_FRONTEND_FOUNDATION.md
- docs/current/RISKS.md
allowed_paths:
- packages/station-editor/history.ts
- tests/product/station-editor-history-trust.test.ts
- project_docs/execution_planning/STATION-S4-WP6-CONSTRUCTION-A-01.report.md
- specs/tasks/TASK-668-STATION-S4-WP6-HISTORY-HARDENING.md
forbidden_paths:
- docs/adr/**
- docs/contracts/**
- specs/contracts/**
- packages/contracts/**
- packages/station-composition/**
- packages/station-settings/**
- .github/**
- provider/**
- runtime/**
- deploy/**
max_files: 4
validation:
- npm run verify
---

Implement only internal history validation-work reduction under WP6 Plan safe ownership/context requirements. Confirm four paths, dependencies and npm run verify. Caller-constructed/mutable/tampered snapshots and changed registry/source/baseline must receive full fail-closed validation. Preserve public shapes, all 50/256/budget/checkpoint/version semantics and 37 predecessor browser journeys. Add meaningful negative/predecessor trust tests; no weakened assertions or public cache authority. Execution requires validated Planning integration and explicit Sprint execution.

## Objective
Harden existing admitted history without changing accepted behavior.
## Context
WP5 closed through #1059; continuation authorizes the next planning step. Addendum 006 and measured WP5-D1 govern.
## Current behavior
History validates current session and every retained snapshot before each operation; 50 snapshots and 256 nodes remain bounded.
## Required change
Implement only internal history validation-work reduction under WP6 Plan safe ownership/context requirements. Confirm four paths, dependencies and npm run verify. Caller-constructed/mutable/tampered snapshots and changed registry/source/baseline must receive full fail-closed validation. Preserve public shapes, all 50/256/budget/checkpoint/version semantics and 37 predecessor browser journeys. Add meaningful negative/predecessor trust tests; no weakened assertions or public cache authority. Execution requires validated Planning integration and explicit Sprint execution.
## Inputs / contracts
Existing catalog, registry, source/root, session, strict graph/codec and Addendum 006; preserve all rejection and version semantics.
## Outputs / contracts
Evidence-backed internal improvement and identical public behavior; no new capability or payload schema.
## Acceptance criteria
Declared validations and all triggered exact-head/current-base/heavy/handoff/browser gates pass. Predecessor 37 browser journeys remain.
## Non-goals
New catalog/components/properties, reparenting, arbitrary code, persistent history, File Manager/.process/Core/server/sync/deploy, dependencies or new contracts.
## Evidence expected
Separate materialization, one authoritative TASK commit, Sprint report and one PR; never claim unobserved execution.
## Escalation
Stop for unsafe validation reuse, undeclared L3/L4, forbidden paths, conflicting authority, dependency collision or missing proof. Record findings rather than weaken checks.
