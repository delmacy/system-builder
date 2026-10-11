---
id: TASK-670
title: Station S4 WP6 PACKAGE REVIEW
status: ready
priority: 670
milestone: STATION-S4-WP6-HISTORY-HARDENING
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
- TASK-669
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
- project_docs/execution_planning/STATION-S4-WP6-INTEGRATION-REVIEW-01.report.md
- docs/current/RISKS.md
- project_docs/execution_planning/STATION-S4-WP6-PLAN-01.md
- specs/tasks/TASK-670-STATION-S4-WP6-PACKAGE-REVIEW.md
forbidden_paths:
- docs/adr/**
- specs/contracts/**
- packages/**
- apps/**
- scripts/**
- tests/**
- .github/**
- provider/**
- runtime/**
- deploy/**
max_files: 4
validation:
- npm run verify
---

Review integrated WP6 ownership/context trust, full regressions, paired performance evidence, dependencies/contracts/memory limits and actual-versus-forecast delivery. Classify residuals and closure GO/NO-GO in four exact documentation paths. No product overflow or new feature scope.

## Objective
Review integrated WP6 ownership/context trust, full regressions, paired performance evidence, dependencies/contracts/memory limits and actual-versus-forecast delivery. Classify residuals and closure GO/NO-GO in four exact documentation paths. No product overflow or new feature scope.
## Context
Owner explicitly authorizes complete WP6 through closure. Revalidate fresh main and integrated predecessor gates; existing Addendum 006 governs maintenance.
## Current behavior
Integrated safe internal snapshot reuse; caller data and changed contexts retain full validation. Existing 50/256/codec/lifecycle limits and 37 browser journeys remain.
## Required change
Only the exact declared documentation paths; no product behavior or scope expansion.
## Inputs / contracts
Integrated Sprint reports, paired benchmark evidence, actual CI/browser proof, accepted contracts and live repository authority.
## Outputs / contracts
Evidence-backed documentation matching integrated truth; no schema/envelope/API/dependency changes.
## Acceptance criteria
Declared verification and all triggered exact-head/current-base/heavy/handoff/browser gates pass before merge; conditional branch-only states must be explicit.
## Non-goals
New features, broad catalog, persistent history, File Manager/.process/Studio/Core/server/sync/deploy, product corrections concealed in documentation, latency/memory/accessibility certification.
## Evidence expected
Separate materialization, one authoritative TASK commit, Sprint report and one PR. Record observed execution and limitations; CI supplies full evidence when local tsx IPC prevents execution.
## Escalation
Stop for unproven trust/performance goal, forbidden paths, conflicting authority, undeclared L3/L4 or weakened validation; record residuals rather than mask blockers.
