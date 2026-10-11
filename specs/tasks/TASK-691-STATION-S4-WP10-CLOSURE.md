---
{
  "id": "TASK-691",
  "title": "Station S4 WP10 CLOSURE",
  "status": "completed",
  "priority": 691,
  "milestone": "STATION-S4-WP10-REPARENTING",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-690"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/010-station-reparenting/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP10-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/current/RISKS.md"
  ],
  "allowed_paths": [
    "docs/contracts/010-station-reparenting/ADDENDUM.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "project_docs/execution_planning/STATION-S4-WP10-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP10-DOCUMENTATION-CLOSURE-01.md",
    "project_docs/execution_planning/STATION-S4-WP10-DOCUMENTATION-CLOSURE-01.report.md",
    "specs/tasks/TASK-691-STATION-S4-WP10-CLOSURE.md",
    "specs/tasks/TASK-687-STATION-S4-WP10-PLANNING.md",
    "specs/tasks/TASK-688-STATION-S4-WP10-REPARENTING.md",
    "specs/tasks/TASK-689-STATION-S4-WP10-WORKBENCH.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 13,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Reconcile integrated compatible reparenting scope, contracts, operations, WBS, risks, traceability and live pointer; close WP10 only on independently validated integration.

## Context
Owner authorizes named WP10 through eligible construction, review and closure. Fresh-main predecessor gates required.

## Current behavior
WP9 installed reusable catalog and typed properties, mixed history, strict payload1/2/3/4 and explicit origin/file retention are integrated.

## Required change
Reconcile integrated compatible reparenting scope, contracts, operations, WBS, risks, traceability and live pointer; close WP10 only on independently validated integration.

## Inputs / contracts
Addendum010, source-owned installed registry and ADR0009.

## Outputs / contracts
Atomic compatible reparent-node intent, workbench and inherited history/codec lifecycle.

## Acceptance criteria
Positive, negative and real predecessor integration proof; all triggered exact-head/current-base/heavy/handoff/browser CI PASS before merge.

## Non-goals
Subgraph template insertion, remote/user catalog, arbitrary properties/CSS/actions, File Manager, Core/process/Studio/server/deploy.

## Evidence expected
Observed commands, test results and exact CI identities; local tsx IPC limitation distinguished from full connected CI.

## Escalation
Conflicting authority, forbidden paths, undeclared L3/L4 or unresolved proof failure. Bounded corrections remain in scope.
