---
{
  "id": "TASK-684",
  "title": "Station S4 WP9 WORKBENCH",
  "status": "completed",
  "priority": 684,
  "milestone": "STATION-S4-WP9-REUSABLE-CATALOG",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-683"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/009-station-reusable-catalog/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP9-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/current/RISKS.md"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "tests/product/station-editor-reusable-catalog.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "project_docs/execution_planning/STATION-S4-WP9-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/STATION-S4-WP9-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-684-STATION-S4-WP9-WORKBENCH.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP9-PLAN-01.md"
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
Add searchable installed catalog and explicit guarded source-session installation, with actual nested edit/history/local/file/negative/keyboard/narrow/shell journeys.

## Context
Owner authorizes named WP9 through eligible construction, review and closure. Fresh-main predecessor gates required.

## Current behavior
WP8 installed typed properties, mixed history, strict payload1/2/3/4 and explicit origin/file retention are integrated.

## Required change
Add searchable installed catalog and explicit guarded source-session installation, with actual nested edit/history/local/file/negative/keyboard/narrow/shell journeys.

## Inputs / contracts
Addendum009, source-owned installed registry and ADR0009.

## Outputs / contracts
Two installed layout descriptors and one reusable Action panel composition; existing graph/codec and session installation.

## Acceptance criteria
Positive, negative and real predecessor integration proof; all triggered exact-head/current-base/heavy/handoff/browser CI PASS before merge.

## Non-goals
Subgraph template insertion, reparenting, remote/user catalog, arbitrary properties/CSS/actions, File Manager, Core/process/Studio/server/deploy.

## Evidence expected
Observed commands, test results and exact CI identities; local tsx IPC limitation distinguished from full connected CI.

## Escalation
Conflicting authority, forbidden paths, undeclared L3/L4 or unresolved proof failure. Bounded corrections remain in scope.
