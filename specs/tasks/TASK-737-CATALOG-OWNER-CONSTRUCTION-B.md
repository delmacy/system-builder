---
{
  "id": "TASK-737",
  "title": "Qualify actual Catalog authenticated Gateway and trusted source profile",
  "status": "completed",
  "priority": 737,
  "milestone": "CATALOG-OWNER-WP1",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": true,
  "executor_preference": "any",
  "depends_on": [
    "TASK-736"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/adr/ADR-0019-catalog-owner-service.md",
    "docs/contracts/019-catalog-owner-service/ADDENDUM.md",
    "project_docs/execution_planning/CATALOG-OWNER-WP1-PLAN-01.md",
    "project_docs/05-catalog/scope/README.md",
    "project_docs/05-catalog/WBS.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "packages/catalog/index.ts",
    "packages/catalog/process-revision-admission.ts",
    "packages/catalog/knowledge-promotion-admission.ts",
    "packages/catalog/postgres.ts",
    "packages/contracts/identity-authorization/index.ts",
    "packages/design/index.ts",
    "packages/design/postgres.ts",
    "packages/design/local-authorization.ts",
    "apps/station-gateway/http.ts"
  ],
  "allowed_paths": [
    "packages/catalog/local-authorization.ts",
    "packages/catalog/trusted-source.ts",
    "apps/station-gateway/catalog-owner.ts",
    "apps/station-gateway/catalog-http.ts",
    "apps/station-gateway/catalog-local-server.ts",
    "tests/product/catalog-owner-http-postgres.test.ts",
    "scripts/run-product-tests.mjs",
    "package.json",
    "project_docs/execution_planning/CATALOG-OWNER-WP1-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-737-CATALOG-OWNER-CONSTRUCTION-B.md",
    "project_docs/execution_planning/CATALOG-OWNER-WP1-INTEGRATION-REVIEW-01.md",
    "specs/tasks/TASK-738-CATALOG-OWNER-INTEGRATION-REVIEW.md",
    "docs/current/NEXT_WORK.md"
  ],
  "forbidden_paths": [
    ".github/**",
    "packages/design/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 13,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
ImplementCataloglocalauth/sourcefile/Gateway/loopbackHTTP/startCLIandrealproof.
## Required change
Explicitserverprincipalgrant actions/family/resource, currenttoken/actor/revision/scope/session/context/expires/revoked. Readonlyserverabsolute sourcefile scope/authority/records canonicalP18admission andlocaltrustqualified; no clientprovisioning. NativeboundedStationHTTP withexactcaps/results/readbacks; configfailsclosedwithoutprofile/PG/source. ActualtestsfixturelocalfileandPG request/root/sourceexpiry/changedsource/duplicate/concurrency/restart; classifyHTTPtestsheavy.
## Context
Accepted ADR0019 and explicit owner approval after TASK734/PR1128. Separate Catalog-owned prerequisite; existing public software/Business admission and Station protocol reused.
## Current behavior
Legacy software registry/provider and process admission exist; owner operations not qualified yet.
## Inputs / contracts
Catalog public registry/resolve/process admission, canonical identity-authorization, current Station protocol/Gateway and scoped trusted-source port.
## Outputs / contracts
Declared bounded Catalog owner deliverable and growing proof; no new Business approval authority or private Station backend.
## Acceptance criteria
Two types separated, server auth/current actor/scope/action/resource, strict inert complete DTOs, immutable duplicate/CAS/idempotency/results atomic, denied/unknown never success; actual PG proof/restart/predecessors; all own checks PASS.
## Non-goals
New business approval/lifecycle, production IAM/TLS/multitenancy, all Business fragments/templates, destructive migration, unrelated Studio/runtime/CI changes.
## Evidence expected
Positive/negative/predecessor pure and actualPG/HTTP cases, exacthead/currentbase all triggered verify/heavy/browser/platform gates and own report.
## Escalation
Missing trusted input must failclosed; unaccepted new owner/architecture/scope or forbidden paths block successor. No mock-success/readiness certificate.

