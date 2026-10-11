---
{
  "id": "TASK-707",
  "title": "Station S4 WP14 planning",
  "status": "completed",
  "priority": 707,
  "milestone": "STATION-S4-WP14-SHARED-PROJECTIONS",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-706"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/014-station-shared-projections/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/contracts/013-station-process-context/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP13-DOCUMENTATION-CLOSURE-01.report.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "packages/station-process-context/index.ts",
    "packages/station-interaction/selection.ts",
    "packages/station-interaction/types.ts",
    "apps/station/web/app/station-process-context-store.ts",
    "apps/station/web/app/station-process-context-workbench.tsx"
  ],
  "allowed_paths": [
    "docs/contracts/014-station-shared-projections/ADDENDUM.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLANNING-01.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLANNING-01.report.md",
    "project_docs/execution_planning/STATION-S4-WP14-CONSTRUCTION-A-01.md",
    "specs/tasks/TASK-707-STATION-S4-WP14-PLANNING.md",
    "specs/tasks/TASK-708-STATION-S4-WP14-CONSTRUCTION-A.md"
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
Revalidate fresh integrated WP13, admit bounded shared-projection presentation APIs and prepare only A.

## Context
Owner explicitly requests WP13 conclusion and WP14 planning. WP13 #1100 is integrated at 577fd601fdda1f93c2b96577093298d3b0d3d402.
Planning execution is authorized; WP14 product construction is not yet authorized.

## Current behavior
WP13 codec/store/window/route and exact guarded composition handoff exist. No shared projection
registry or context-qualified synchronized Explorer/Inspector is implemented.

## Required change
Nine exact documentation/spec paths. Define goal/ownership/selection/capabilities/compatibility,
DAG, evidence, risks, five-sprint forecast and prepared A; do not write product code.

## Inputs / contracts
Addendum013, ADR0009/0017, existing process context, interaction selection and WP12 resolution.

## Outputs / contracts
Addendum014 and WP14 plan/manifest/report; draft TASK708 and prepared A manifest; sole live pointer.

## Acceptance criteria
WP13 closure traceability correct; at most two projections/17 items and unchanged portable/storage
contracts. Only Planning committed; construction awaits authorization and validated predecessor.
Full connected npm run verify and all triggered exact-head/current-base workflows before merge.

## Non-goals
No product implementation, semantic owner mutation, arbitrary models, Studio/Core/runtime/deploy.

## Evidence expected
One authoritative TASK707 commit, one PR, final independent CI and merge; no unobserved local tests.

## Escalation
Undeclared L3/L4, authority/path conflict, semantic ownership change or unresolved proof failure.
