---
{
  "id": "TASK-699",
  "title": "Station S4 WP12 CONSTRUCTION-B",
  "status": "completed",
  "priority": 699,
  "milestone": "STATION-S4-WP12-REVISIONS",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-698"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/012-station-workspace-revisions/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP12-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/contracts/011-station-artifact-workspace/ADDENDUM.md",
    "docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-02.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "project_docs/30-files-object-storage/WBS.md",
    "apps/station/web/app/station-workspace-revisions.ts",
    "apps/station/web/app/station-artifact-workspace.ts",
    "apps/station/web/app/station-editor-files.ts",
    "tests/product/station-workspace-revisions.test.ts"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-revision-diff.tsx",
    "apps/station/web/app/station-workspace-revision-save.tsx",
    "apps/station/web/app/station-file-manager-workbench.tsx",
    "apps/station/web/app/station-editor-workbench.tsx",
    "tests/browser/station-editor-workbench.spec.ts",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP12-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/STATION-S4-WP12-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-699-STATION-S4-WP12-CONSTRUCTION-B.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 9,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Deliver explicit revision save/conflict choices and File Manager history/comparison with actual browser proof.

## Context
Owner explicitly authorizes whole WP12; fresh predecessor integration and current gates required.

## Current behavior
WP11 origin-local append-only composition workspace, real codec and guarded ordinary editor opening integrated.

## Required change
Deliver explicit revision save/conflict choices and File Manager history/comparison with actual browser proof.

## Inputs / contracts
Accepted Addendum012 after Planning integration, ADR0009, Addendum011 and real installed composition codec.

## Outputs / contracts
Append-only immutable revisions, bounded deterministic comparison, expected-snapshot/head protection and explicit conflict recovery.

## Acceptance criteria
Real editor -> revision retention -> diff -> guarded re-open; negative/stale/corrupt/quota cases; predecessor regressions; all triggered exact-head and current-base gates PASS.

## Non-goals
No automatic merge, synchronization/CAS, server/Core/host, .process, rename/delete/overwrite, generic provider or global WBS completion.

## Evidence expected
Observed commands/CI SHAs, logs and counts; no unobserved local validation claims; separate implemented/proven/integrated.

## Escalation
Undeclared L3/L4, authority/path conflict or unresolved validation failure. Routine bounded corrections authorized.
