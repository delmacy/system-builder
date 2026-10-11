---
{
  "id": "TASK-685",
  "title": "Station S4 WP9 INTEGRATION-REVIEW",
  "status": "completed",
  "priority": 685,
  "milestone": "STATION-S4-WP9-REUSABLE-CATALOG",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-684"
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
    "project_docs/execution_planning/STATION-S4-WP9-INTEGRATION-REVIEW-01.md",
    "project_docs/execution_planning/STATION-S4-WP9-INTEGRATION-REVIEW-01.report.md",
    "specs/tasks/TASK-685-STATION-S4-WP9-INTEGRATION-REVIEW.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP9-PLAN-01.md",
    "docs/current/RISKS.md"
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
Review integrated package regressions, slots/source trust, compatibility, costs, dependencies and classified debt; GO/NO-GO closure. No new feature.

## Context
Owner authorizes named WP9 through eligible construction, review and closure. Fresh-main predecessor gates required.

## Current behavior
WP8 installed typed properties, mixed history, strict payload1/2/3/4 and explicit origin/file retention are integrated.

## Required change
Review integrated package regressions, slots/source trust, compatibility, costs, dependencies and classified debt; GO/NO-GO closure. No new feature.

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
