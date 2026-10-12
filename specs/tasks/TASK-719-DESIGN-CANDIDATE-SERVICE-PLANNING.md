---
{
  "id": "TASK-719",
  "title": "Design candidate owner-service prerequisite proposal",
  "status": "completed",
  "priority": 719,
  "milestone": "DESIGN-CANDIDATE-SERVICE-WP1",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": true,
  "executor_preference": "any",
  "depends_on": [
    "TASK-717"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "docs/contracts/017-design-candidate-owner-service/ADDENDUM.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-PLAN-01.md",
    "docs/adr/ADR-0016-station-core-gateway-boundary.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "docs/architecture/SUITE_MAP.md",
    "project_docs/04-system-design/WBS.md",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "packages/postgres/index.ts"
  ],
  "allowed_paths": [
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "docs/contracts/017-design-candidate-owner-service/ADDENDUM.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-PLAN-01.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-PLANNING-01.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-PLANNING-01.report.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-CONSTRUCTION-A-01.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "specs/tasks/TASK-719-DESIGN-CANDIDATE-SERVICE-PLANNING.md",
    "specs/tasks/TASK-720-DESIGN-CANDIDATE-SERVICE-CONSTRUCTION-A.md"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/**",
    ".github/**",
    "package.json",
    "package-lock.json",
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
Make missing WP16 owner-service architectural prerequisite concrete and reviewable before code.

## Context
Owner requests WP16; integration contract excludes hidden backend. Proposal respects readiness gate and prepares separate owner package.

## Current behavior
No production Design candidate service; SDK/Gateway only delegate to test Core ports.

## Required change
Ten exact docs/spec paths, proposed ADR0018/Addendum017, upstream cadence, first draft A and sole pointer.

## Inputs / contracts
Existing Blueprint/SuiteMap SB04, ADR0016/0017/0015, WBS04 and actual PostgreSQL adapter.

## Outputs / contracts
Reviewable architecture/scope proposal; no acceptance or implementation inferred.

## Acceptance criteria
No product/DB/identity changes. Every triggered exact-head/current-base check PASS; proposal remains PROPOSED until explicit owner acceptance.

## Non-goals
Execute blocked TASK718, create server/schema/database, production auth rollout or Runtime changes.

## Evidence expected
One TASK719 authoritative commit/PR and observed CI; concrete owner decision required before construction.

## Escalation
Undeclared L3/L4/semantic ownership/path conflict or unresolved validation failure.
