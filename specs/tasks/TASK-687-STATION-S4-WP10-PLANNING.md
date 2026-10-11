---
{
  "id": "TASK-687",
  "title": "Station S4 WP10 PLANNING",
  "status": "completed",
  "priority": 687,
  "milestone": "STATION-S4-WP10-REUSABLE-CATALOG",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-686"
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
    "project_docs/execution_planning/STATION-S4-WP10-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP10-CONSTRUCTION-A-01.md",
    "specs/tasks/TASK-688-STATION-S4-WP10-REPARENTING.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "specs/tasks/TASK-687-STATION-S4-WP10-PLANNING.md",
    "project_docs/execution_planning/STATION-S4-WP10-PLANNING-01.report.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 8,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Admit Addendum010 L3 reparenting intent and materialize only Construction A; no product code.

## Context
Owner authorizes named WP10 through eligible construction, review and closure. Fresh-main predecessor gates required.

## Current behavior
WP9 installed reusable catalog and typed properties, mixed history, strict payload1/2/3/4 and explicit origin/file retention are integrated.

## Required change
Admit Addendum010 L3 reparenting intent and materialize only Construction A; no product code.

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
