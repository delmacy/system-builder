---
{
  "id": "TASK-712",
  "title": "Station S4 WP15 planning",
  "status": "completed",
  "priority": 712,
  "milestone": "STATION-S4-WP15-WORKFLOW-STUDIO",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-711"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/015-station-workflow-studio/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP15-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "packages/contracts/system-definition/index.ts",
    "packages/contracts/system-definition/system-definition.schema.json",
    "specs/contracts/artifact-envelope/artifact-envelope.schema.json"
  ],
  "allowed_paths": [
    "docs/contracts/015-station-workflow-studio/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP15-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP15-PLANNING-01.md",
    "project_docs/execution_planning/STATION-S4-WP15-PLANNING-01.report.md",
    "project_docs/execution_planning/STATION-S4-WP15-CONSTRUCTION-A-01.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "specs/tasks/TASK-712-STATION-S4-WP15-PLANNING.md",
    "specs/tasks/TASK-713-STATION-S4-WP15-CONSTRUCTION-A.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "packages/compiler/**",
    "packages/runtime-core/**",
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
Prepare bounded technical Workflow Studio; no implementation.

## Context
Owner requests preparation; fresh main d0f777fac47fd46cc70114026b9064a58551cbbc, WP14#1105 integrated.

## Current behavior
Schema/runtime rules exist; full lossless local authoring API and live owner service absent.

## Required change
Nine exact documentation/spec paths: scope/ownership/readiness/proof/risks/cadence and prepared A.

## Inputs / contracts
Existing SystemDefinition schema, ADR0009/0017, WBS21, predecessor closure and Sprint policies.

## Outputs / contracts
Addendum015, plan/manifests/report, draft TASK713, registry and sole live pointer.

## Acceptance criteria
Explicit local candidate versus Core authority; only Planning committed; all triggered exact-head/current-base CI PASS before integration.

## Non-goals
No product code, owner schema/authority changes, BusinessRecipe, Core integration or execution.

## Evidence expected
One authoritative TASK712 commit/PR and observed connected CI; no local test claim.

## Escalation
Undeclared L3/L4, semantic ownership/path conflict or unresolved validation failure.
