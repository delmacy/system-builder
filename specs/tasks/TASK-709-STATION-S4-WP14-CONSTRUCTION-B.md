---
{
  "id": "TASK-709",
  "title": "Station S4 WP14 shared projection workbench",
  "status": "completed",
  "priority": 709,
  "milestone": "STATION-S4-WP14-SHARED-PROJECTIONS",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-708"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/014-station-shared-projections/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/contracts/013-station-process-context/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP13-DOCUMENTATION-CLOSURE-01.report.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "packages/station-process-context/index.ts",
    "packages/station-interaction/selection.ts",
    "packages/station-interaction/types.ts",
    "apps/station/web/app/station-process-context-store.ts",
    "apps/station/web/app/station-process-context-workbench.tsx",
    "packages/station-model-projections/index.ts",
    "tests/product/station-model-projections.test.ts",
    "project_docs/execution_planning/STATION-S4-WP14-CONSTRUCTION-B-01.md"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-context-projections.tsx",
    "apps/station/web/app/station-process-context-workbench.tsx",
    "tests/browser/station-editor-workbench.spec.ts",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/contracts/014-station-shared-projections/ADDENDUM.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP14-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/STATION-S4-WP14-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-709-STATION-S4-WP14-CONSTRUCTION-B.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 12,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Integrate bounded shared Explorer/Inspector and two installed projections into existing Process Context.

## Context
Fresh A#1102/b0efe2f06a219006469a75dc152cb9f4af6b9c70; all seven independent construction workflows PASS.
Whole WP14 implementation and Review/Closure authorized. Only TASK709 COMMITTED in this sprint.

## Current behavior
A pure codec-admitted qualified model exists; WP13 host uses separate list-only reference presentation.

## Required change
Twelve exact allowed paths. Host derives document/status/selection from one validated projection model.
Reusable UI renders Explorer, outline/table and read-only Inspector. Keep all WP13 controls/guards/routes,
82 predecessor browser cases, storage/codec semantics and existing source-owned UI grammar.

## Inputs / contracts
Addendum014, actual A API, WP13 codec/store/workbench and ordinary guarded composition editor.

## Outputs / contracts
Two complementary source-owned projections sharing selection and exact guarded handoff; no new schema.

## Acceptance criteria
Actual editor -> two retained revisions -> context/file/local reopen -> select -> projection switch/
Inspector coherence -> exact historical editor open. Cached available reference removed before click
must fail after fresh resolution. Missing/stale/corrupt/denied statuses remain explicit. Cancellation,
replacement/obsolete async reads, empty/max context, narrow keyboard and mounted lifecycle proved.
All82 inherited browser journeys remain. Final npm run verify, station:build and all triggered independent
construction/platform/frontend/browser gates before merge. No scripts/remote registry/business mutation.

## Non-goals
No generic arbitrary models, C10/Studio, live semantic service, Core/server/host/storage migrations/
collaboration/CAS/runtime/deploy or whole WBS/H3/S4 certification.

## Evidence expected
One authoritative TASK709 commit/report/PR, actual Chromium extended proof and independent gates.
No local validation claim while maintainer device offline.

## Escalation
Authority/path/undeclared L3/L4, missing bounded capability or unresolved validation failure.
