---
{
  "id": "TASK-703",
  "title": "Station S4 WP13 CONSTRUCTION-A",
  "status": "completed",
  "priority": 703,
  "milestone": "STATION-S4-WP13-PROCESS-CONTEXT",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-702"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/013-station-process-context/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP13-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "packages/contracts/process-versioning/index.ts",
    "docs/contracts/012-station-workspace-revisions/ADDENDUM.md",
    "project_docs/21-canvas-visual-builder/WBS.md"
  ],
  "allowed_paths": [
    "packages/station-process-context/index.ts",
    "apps/station/web/app/station-process-context-store.ts",
    "tests/product/station-process-context.test.ts",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP13-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/STATION-S4-WP13-CONSTRUCTION-A-01.report.md",
    "specs/tasks/TASK-703-STATION-S4-WP13-CONSTRUCTION-A.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 7,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Implement strict portable context codec, exact predecessor reference resolution and bounded guarded origin retention.

## Acceptance criteria
Addendum013 bounded proofs; real predecessor codec/workspace and canonical process owner identity; malformed/unsafe/unknown/stale/conflicting/corrupt/quota inputs preserve state. No live semantic availability inferred.

## Non-goals
No semantic business editing, new owner or Core authority, workspace schema change, latest-version substitution, generic Studio, deploy or hidden scope.

## Evidence expected
Observed validation commands and CI identities; implementation/proof/integration distinguished.

## Escalation
Undeclared L3/L4, authority/path conflict or unresolved validation failure.

## Context
Owner authorizes named WP13; fresh main and predecessor integration required.

## Current behavior
WP12 immutable composition revisions and canonical process identity exist; no portable context.

## Required change
Execute only bounded objective and allowed paths stated above.

## Inputs / contracts
Addendum013, ADR0009, canonical process-versioning identity and WP12 codec/workspace.

## Outputs / contracts
Bounded reference-context manifest and exact-reference projections; semantic authority unchanged.
