---
{
  "id": "TASK-722",
  "title": "Design candidate service independent integration review",
  "status": "completed",
  "priority": 722,
  "milestone": "DESIGN-CANDIDATE-SERVICE-WP1",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": true,
  "executor_preference": "any",
  "depends_on": [
    "TASK-721"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "docs/contracts/017-design-candidate-owner-service/ADDENDUM.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-PLAN-01.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "project_docs/04-system-design/WBS.md",
    "packages/contracts/design-candidate/index.ts",
    "packages/design/index.ts",
    "packages/design/postgres.ts",
    "packages/design/local-authorization.ts",
    "apps/station-gateway/index.ts",
    "apps/station-gateway/design-owner.ts",
    "apps/station-gateway/http.ts",
    "apps/station-gateway/local-server.ts",
    "tests/product/design-candidate-owner.test.ts",
    "tests/product/design-owner-http-postgres.test.ts",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md"
  ],
  "allowed_paths": [
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "docs/operations/DESIGN_CANDIDATE_SERVICE.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-INTEGRATION-REVIEW-01.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-INTEGRATION-REVIEW-01.report.md",
    "specs/tasks/TASK-722-DESIGN-CANDIDATE-SERVICE-REVIEW.md"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/**",
    "tests/**",
    ".github/**",
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
Independently review actual Design owner chain and classify readiness/debt; no delayed features.

## Context
Accepted ADR0018/Addendum017 and full user authorization. A#1113 and B#1114 independently integrated with all seven workflows PASS. Fresh base ab41f634292b6349b13234f0cd5337f97500e483. Eight exact docs paths/max_files8 and forbidden product paths confirmed before edit.

## Current behavior
Actual local authenticated Gateway/Design/PostgreSQL service and predecessor/process restart proofs exist.

## Required change
Audit authority/portability/auth/transaction/recovery/compatibility, classify debt and GOClosure; revalidate O1–O4 with bounded qualification.

## Inputs / contracts
Accepted owner contracts, actual implemented code/tests and exact-head CI evidence.

## Outputs / contracts
Independent Review report and conditional readiness disposition; no new public contract/product.

## Acceptance criteria
No unresolved construction blocker; full own verify and all triggered independent gates PASS before integration. Required gaps return to Construction C.

## Non-goals
New service/UI/features/production identity/remote deployment, hidden implementation in Review.

## Evidence expected
Traceable A/B head/merge proof, tests including actual PostgreSQL/HTTP/process restart, debt/limits, independent Review CI.

## Escalation
Undeclared scope/owner/L3/L4/product paths or actual unresolved blockers; never claim production certification.
