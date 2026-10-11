---
{
  "id": "TASK-693",
  "title": "Station S4 WP11 WORKSPACE",
  "status": "ready",
  "priority": 693,
  "milestone": "STATION-S4-WP11-ARTIFACT-WORKSPACE",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-692"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/011-station-artifact-workspace/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP11-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "project_docs/30-files-object-storage/WBS.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/current/RISKS.md",
    "docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-02.md"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-artifact-workspace.ts",
    "tests/product/station-artifact-workspace.test.ts",
    "project_docs/execution_planning/STATION-S4-WP11-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/STATION-S4-WP11-CONSTRUCTION-A-01.report.md",
    "specs/tasks/TASK-693-STATION-S4-WP11-WORKSPACE.md",
    "docs/current/NEXT_WORK.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 6,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Implement strict bounded local workspace retention APIs and real codec integration proof.

## Context
Owner authorizes WP11 through eligible construction/review/closure; fresh-main predecessor proof required.

## Current behavior
WP10 movement, strict portable payload1/2/3/4 and existing per-composition local slots integrated. No File Manager yet.

## Required change
Implement strict bounded local workspace retention APIs and real codec integration proof.

## Inputs / contracts
Accepted Addendum011; ADR0009; existing real codec/source registry, editor replacement/history protection and normalized shell windows.

## Outputs / contracts
Bounded origin-local workspace with separate location metadata, portable exact compositions and guarded editor handoff.

## Acceptance criteria
Positive, negative and real predecessor proof, all triggered exact-head/current-base/heavy/handoff/browser gates PASS before merge.

## Non-goals
Server/Core/host filesystem, .process, Git-like revision history, deletion/move/rename/overwrite, sync/multi-tab CAS, arbitrary files or remote catalog.

## Evidence expected
Observed validation, exact CI identities, browser journeys and residual limits; local socket/tsx IPC limitations distinguished.

## Escalation
Authority/path/L3/L4 conflict or unresolved proof failure. Bounded fixes inside goal authorized.
