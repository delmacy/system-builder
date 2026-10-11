---
{
  "id": "TASK-677",
  "title": "Station S4 WP8 PLANNING",
  "status": "completed",
  "priority": 677,
  "milestone": "STATION-S4-WP8-BUTTON-PROPERTIES",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-676"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/008-station-button-properties/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP8-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/current/RISKS.md"
  ],
  "allowed_paths": [
    "docs/contracts/008-station-button-properties/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP8-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP8-CONSTRUCTION-A-01.md",
    "specs/tasks/TASK-678-STATION-S4-WP8-BUTTON-PROPERTIES.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "specs/tasks/TASK-677-STATION-S4-WP8-PLANNING.md",
    "project_docs/execution_planning/STATION-S4-WP8-PLANNING-01.report.md"
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
Admit Addendum008 L3 presentation/payload increment and materialize only Construction A.

## Context
Owner authorized WP8 through eligible construction, review and closure. Addendum008 governs; predecessor must be integrated.

## Current behavior
WP7 text/span/structure history and strict payload1/2/3 are integrated.

## Required change
Admit Addendum008 L3 presentation/payload increment and materialize only Construction A.

## Inputs / contracts
Addendum008, ADR0009; source-owned catalog and one Station-owned graph.

## Outputs / contracts
Bounded variant/disabled properties; no Core authority or actions.

## Acceptance criteria
Declared positive/negative/predecessor proof passes; exact-head CI before merge. No forbidden path or extra feature.

## Non-goals
New catalog, reparenting, actions, arbitrary CSS, server persistence, Studio or runtime.

## Evidence expected
Actual commands, tests and CI IDs; distinguish local IPC limitation from complete connected CI.

## Escalation
Stop for conflicting authority, forbidden paths, undeclared L3/L4 or failing proof; repair bounded defects inside scope.
