---
{
  "id": "TASK-698",
  "title": "Station S4 WP12 CONSTRUCTION-A",
  "status": "ready",
  "priority": 698,
  "milestone": "STATION-S4-WP12-REVISIONS",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-697"
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
    "project_docs/30-files-object-storage/WBS.md"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-workspace-revisions.ts",
    "tests/product/station-workspace-revisions.test.ts",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP12-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/STATION-S4-WP12-CONSTRUCTION-A-01.report.md",
    "specs/tasks/TASK-698-STATION-S4-WP12-CONSTRUCTION-A.md"
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
Implement strict immutable revision retention and bounded deterministic envelope comparison using real predecessors.

## Context
Owner explicitly authorizes whole WP12; fresh predecessor integration and current gates required.

## Current behavior
WP11 origin-local append-only composition workspace, real codec and guarded ordinary editor opening integrated.

## Required change
Implement strict immutable revision retention and bounded deterministic envelope comparison using real predecessors.

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
