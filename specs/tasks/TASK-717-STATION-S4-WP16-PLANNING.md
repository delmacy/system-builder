---
{
  "id": "TASK-717",
  "title": "Station S4 WP16 planning and owner readiness",
  "status": "completed",
  "priority": 717,
  "milestone": "STATION-S4-WP16-OWNER-SERVICE-JOURNEY",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-716"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/016-station-owner-service-journey/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0016-station-core-gateway-boundary.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "project_docs/execution_planning/STATION-REMAINING-SCOPE-WBS-01.md",
    "apps/station-gateway/index.ts",
    "packages/station-sdk/index.ts",
    "packages/contracts/station-core/index.ts",
    "tests/product/station-core-e2e.test.ts"
  ],
  "allowed_paths": [
    "docs/contracts/016-station-owner-service-journey/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLANNING-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLANNING-01.report.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-A-01.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "specs/tasks/TASK-717-STATION-S4-WP16-PLANNING.md",
    "specs/tasks/TASK-718-STATION-S4-WP16-CONSTRUCTION-A.md"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    "apps/station-gateway/**",
    ".github/**",
    "packages/compiler/**",
    "packages/runtime-core/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 10,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Prepare bounded real service integration, reconstruct owner readiness, no product implementation.

## Context
Owner requests sample video then WP16 Planning; WP15#1110 integrated at 92a3006735cf051d74ceddd8ed2d73f980f6c29f.

## Current behavior
Local Studio and SDK/Gateway protocol exist; production authoring owner service/network ingress absent in census.

## Required change
Ten exact docs/spec paths: Addendum016/index/live pointer, plan/readiness/manifest/report, blocked prepared A and task records.

## Inputs / contracts
ADR0016/0017/0009, existing public protocol/Gateway/SDK, SystemDefinition and remaining-scope owner prerequisite rule.

## Outputs / contracts
Explicit readiness O1–O4/DAG/growing proof/risk; first A BLOCKED, only Planning committed.

## Acceptance criteria
No owner fixture promoted or new Core authority. All triggered exact-head/current-base checks PASS before integration; owner missing API routed upstream.

## Non-goals
No product, new owner/service/database/schema/ADR/runtime/deploy or WP16 construction.

## Evidence expected
One authoritative TASK717 commit/PR, independent connected CI and merge. Video separately delivered.

## Escalation
Authority/path/new owner/L3 outside admission/L4 conflict or unresolved verification failure.
