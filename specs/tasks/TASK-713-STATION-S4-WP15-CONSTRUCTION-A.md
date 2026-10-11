---
{
  "id": "TASK-713",
  "title": "Station S4 WP15 local workflow authoring engine",
  "status": "completed",
  "priority": 713,
  "milestone": "STATION-S4-WP15-WORKFLOW-STUDIO",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-712"
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
    "packages/station-workflow-authoring/index.ts",
    "tests/product/station-workflow-authoring.test.ts",
    "tsconfig.json",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-S4-WP15-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/STATION-S4-WP15-CONSTRUCTION-A-01.report.md",
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
  "max_files": 8,
  "validation": [
    "npm run verify",
    "npm run station:build"
  ]
}
---

## Objective
Implement complete local candidate codec and immutable workflow draft engine under Addendum015.

## Context
COMMITTED from main@ac66474bd10219806c7c1741038820e5444ab088 after Planning#1106 integration. Owner now authorizes whole WP15, including eligible Review/Closure after independent gates.

## Current behavior
No lossless workflow authoring API; compiler projection is execution-only.

## Required change
Eight exact paths; additive public local draft API and package aliases only. Full schema/envelope admission, shared expected-revision commands, bounded undo/redo, candidate materialization/export/import.

## Inputs / contracts
Addendum015, public SystemDefinition schema exports and existing ADR0009 envelope. Read actual predecessor APIs before implementation.

## Outputs / contracts
Typed immutable local candidate/session/results; preservation of full nonedited data and explicit failures. No canonical owner or schema change.

## Acceptance criteria
All Addendum015 operations/limits; real positive/negative/round-trip proof, stale/no-op/rejection atomicity, metadata preservation and unresolved upstream status. Actual generated candidates, not fixture substitutes. Complete npm verification/build and independent CI.

## Non-goals
UI/store implementation, Core transport/publication, compiler/runtime dependencies, BusinessRecipe/action/entity editing, generic models or C10 completion.

## Evidence expected
Focused actual APIs/tests, Sprint report/one task commit/validated integration; B remains forecast.

## Escalation
New owner semantics/L3 outside admission/L4/schema/forbidden path need or unresolved failures. Do not weaken gates.
