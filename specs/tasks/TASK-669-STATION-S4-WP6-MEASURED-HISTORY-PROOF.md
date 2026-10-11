---
id: TASK-669
title: Station S4 WP6 MEASURED HISTORY PROOF
status: completed
priority: 669
milestone: STATION-S4-WP6-HISTORY-HARDENING
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-668
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
- scripts/benchmark-station-editor-history.ts
- tests/product/station-editor-history-bounds.test.ts
- project_docs/execution_planning/STATION-S4-WP6-CONSTRUCTION-B-01.report.md
- specs/tasks/TASK-669-STATION-S4-WP6-MEASURED-HISTORY-PROOF.md
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
- node --import tsx scripts/benchmark-station-editor-history.ts
---

Construction B proof only: preserve integrated A product code; add reproducible benchmark and max-bound/authority recovery/checkpoint/codec predecessor tests through actual APIs. Use the same runtime/machine for paired baseline and optimized module runs, 30 samples/three batches/5 warmups; report median/p95/cold/failure behavior. Do not add timing assertions to product tests. Four exact paths, no public/schema/dependency changes. npm run verify, benchmark, Station build and all triggered gates/37 actual browser cases before integration.

## Objective
Harden existing admitted history without changing accepted behavior.
## Context
WP5 closed through #1059; continuation authorizes the next planning step. Addendum 006 and measured WP5-D1 govern.
## Current behavior
History validates current session and every retained snapshot before each operation; 50 snapshots and 256 nodes remain bounded.
## Required change
Construction B proof only: preserve integrated A product code; add reproducible benchmark and max-bound/authority recovery/checkpoint/codec predecessor tests through actual APIs. Use the same runtime/machine for paired baseline and optimized module runs, 30 samples/three batches/5 warmups; report median/p95/cold/failure behavior. Do not add timing assertions to product tests. Four exact paths, no public/schema/dependency changes. npm run verify, benchmark, Station build and all triggered gates/37 actual browser cases before integration.
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

Owner explicitly authorizes WP6 through closure; B requires its own observed validation and merge before successors.

Observed paired benchmark matched runtime/protocol/fixture digests and exceeded 2x max-bound warm Undo/Redo target in every batch. 89 editor tests and Station build passed; full local verify remains IPC-blocked. CI and validated merge still required.
