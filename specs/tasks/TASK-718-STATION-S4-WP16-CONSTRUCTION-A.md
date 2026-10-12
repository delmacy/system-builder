---
{
  "id": "TASK-718",
  "title": "Station S4 WP16 actual workflow owner connection",
  "status": "completed",
  "priority": 718,
  "milestone": "STATION-S4-WP16-OWNER-SERVICE-JOURNEY",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-717",
    "TASK-723"
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
    "tests/product/station-core-e2e.test.ts",
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "docs/contracts/017-design-candidate-owner-service/ADDENDUM.md",
    "docs/operations/DESIGN_CANDIDATE_SERVICE.md",
    "packages/contracts/design-candidate/index.ts",
    "packages/design/index.ts",
    "packages/design/postgres.ts",
    "packages/design/local-authorization.ts",
    "apps/station-gateway/http.ts",
    "apps/station-gateway/design-owner.ts",
    "tests/product/design-owner-http-postgres.test.ts",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-DOCUMENTATION-CLOSURE-01.report.md"
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
    "specs/tasks/TASK-718-STATION-S4-WP16-CONSTRUCTION-A.md",
    "scripts/run-product-tests.mjs",
    "docs/contracts/016-station-owner-service-journey/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md"
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
  "max_files": 13,
  "validation": [
    "npm run verify",
    "npm run station:build"
  ]
}
---

## Objective
Bind actual independently closed Design owner through SDK HTTP transport and verified workflow connection.

## Context
DesignWP1 #1113–#1116 independently integrated; freshmain eb0ebc87406280fed98600e2951879d6131cb02c. O1–O4 READY_LOCAL, explicit full user execution authorization.13 exact allowed paths/max_files13 and forbidden paths confirmed before edits; actual owner public routes/actions/records/auth/query proof read. No owner implementation inside Station.

## Current behavior
Generic SDK/client and actual Design Gateway service exist; Studio not connected before this A.

## Required change
Bounded trusted-config HTTP transport and portable workflow connection: handshake, correlation, exact owner readback/hash/full metadata, distinct owner revision and stable unknown-command result recovery. Guard stale/reordered/disconnected/partial/mismatched replies.

## Inputs / contracts
AcceptedAdd016/ADR0016 and unchanged station-core1.0.0; acceptedDesignADR0018/Add017 public candidate contract and actual local owner operations.

## Outputs / contracts
Public SDK transport/WorkflowOwnerConnection only; no backend/schema/business authority. Actual immutable candidate owner result remains authoritative.

## Acceptance criteria
Actual WP15 -> SDK/client -> GatewayHTTP -> Design/PostgreSQL -> exact readback; concurrent stale, denied/forged/unknown/late/malformed/partial/tampered/hash/source failures and committed response loss recovered with same command. All inherited browser/build/full verification preserved.

## Non-goals
Owner/backend/database creation, server validation/auth changes, UI construction, publication/runtime/deploy, generic federation/collaboration.

## Evidence expected
Actual heavy client/provider tests, report/one TASK commit/independent full npmverify+stationbuild and every triggered exact-head/current-base/heavy/handoff/browser/WindowsUbuntu/frontend CI before merge. No local full verify claim.

## Escalation
Unmet readiness, undeclared owner/public schema/L4/forbidden paths or unresolved proof failure. No fake ready/success.
