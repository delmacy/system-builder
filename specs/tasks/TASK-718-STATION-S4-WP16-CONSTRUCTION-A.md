---
{
  "id": "TASK-718",
  "title": "Station S4 WP16 actual workflow owner connection",
  "status": "blocked",
  "priority": 718,
  "milestone": "STATION-S4-WP16-OWNER-SERVICE-JOURNEY",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-717"
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
    "packages/station-sdk/http-transport.ts",
    "packages/station-sdk/index.ts",
    "packages/station-workflow-connection/index.ts",
    "tests/product/station-workflow-connection.test.ts",
    "tsconfig.json",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-A-01.report.md",
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
    "npm run verify",
    "npm run station:build"
  ]
}
---

## Objective
Bind ready actual owner service to existing SDK/Gateway over qualified network transport.

## Context
PREPARED/BLOCKED. O1–O4 actual owner API/durable provider/ingress/accepted contracts and construction authorization required before fresh-main promotion. Missing owner not implementable here.

## Current behavior
StationCorePort implementations discovered only in tests; no actual SystemDefinition owner network contract.

## Required change
Candidate ten exact paths; revalidate/revise against ready actual owner contracts before commitment. Typed transport/binding, correlation, rejection/stale/unknown and owner-qualified reconciliation.

## Inputs / contracts
Addendum016/ADR0016 and unchanged protocol. Actual accepted owner contract must be added to context before promotion; no guessed routes/actions/authority.

## Outputs / contracts
Public client transport/binding only, actual owner HTTP/data/receipt/query proof; Station owns no canonical retention or server validation.

## Acceptance criteria
Real WP15-generated candidate retained/queryable by actual owner with restart/denial/stale/two-writer/lost-receipt/idempotency proof. No mocked success substitute. Full npm verify/build/independent CI.

## Non-goals
Create owner API/backend/database/semantic authority, UI construction, publication/runtime/deploy, generic federation or collaboration.

## Evidence expected
Owner readiness evidence first; then actual API-heavy tests, report/one commit/validated A integration. No fake ready status.

## Escalation
Unmet readiness/new owner/public schema/L4/forbidden paths or unresolved proof failure.
