---
{
  "id": "TASK-704",
  "title": "Station S4 WP13 CONSTRUCTION-B",
  "status": "completed",
  "priority": 704,
  "milestone": "STATION-S4-WP13-PROCESS-CONTEXT",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-703"
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
    "apps/station/web/app/station-process-context-app.ts",
    "apps/station/web/app/station-process-context-workbench.tsx",
    "apps/station/web/app/process-context/page.tsx",
    "apps/station/web/app/station-foundation-client.tsx",
    "tests/browser/station-editor-workbench.spec.ts",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP13-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/STATION-S4-WP13-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-704-STATION-S4-WP13-CONSTRUCTION-B.md",
    "apps/station/web/app/station-process-context-store.ts",
    "tests/product/station-process-context.test.ts"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 11,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Implement ordinary Process Context app and route, explicit manifest creation/file/local workflow and exact-reference guarded editor opening.

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

## Bounded operational correction
Pre-integration review identified same type/id/version retention overwrite with changed bytes.
Correct the existing retained-tuple guard and prove failure preserves bytes; no goal/scope expansion.
Two additional exact paths admitted before mutation, max_files11.
