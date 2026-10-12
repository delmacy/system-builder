---
{
  "id": "TASK-721",
  "title": "Design durable candidate service and authenticated Gateway HTTP",
  "status": "completed",
  "priority": 721,
  "milestone": "DESIGN-CANDIDATE-SERVICE-WP1",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": true,
  "executor_preference": "any",
  "depends_on": [
    "TASK-720"
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
    "packages/design/index.ts",
    "packages/contracts/design-candidate/index.ts",
    "packages/contracts/identity-authorization/index.ts",
    "packages/contracts/semantic-substrate/index.ts",
    "packages/postgres/index.ts",
    "apps/station-gateway/index.ts",
    "packages/contracts/station-core/index.ts",
    "tests/product/design-candidate-owner.test.ts",
    "tests/product/artifact-store-postgres.test.ts",
    "scripts/run-product-tests.mjs"
  ],
  "allowed_paths": [
    "packages/design/postgres.ts",
    "packages/design/local-authorization.ts",
    "apps/station-gateway/design-owner.ts",
    "apps/station-gateway/http.ts",
    "apps/station-gateway/local-server.ts",
    "tests/product/design-owner-http-postgres.test.ts",
    "tests/product/fixtures/design-owner-server.ts",
    "scripts/run-product-tests.mjs",
    "package.json",
    "docs/operations/DESIGN_CANDIDATE_SERVICE.md",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-721-DESIGN-CANDIDATE-SERVICE-CONSTRUCTION-B.md"
  ],
  "forbidden_paths": [
    ".github/**",
    "packages/runtime-core/**",
    "packages/compiler/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 15,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Actual PostgreSQL atomic retention/head/ledger and bounded local authenticated Gateway HTTP with real owner restart proof.

## Acceptance
Actual WP15 predecessor; exact readback including metadata; command replay/key conflict/immutable tuple/two-writer/stale/denial/malformed input/HTTP bound/context mismatch; restart and loss after commit result lookup. No memory provider exit proof or production IAM claim.

## Before-edit confirmation
15 exact allowed paths/max_files15, forbidden paths as listed. TASK720/#1113 integrated after all seven workflows PASS at a3a968343660af0b1c6da2a13ed7de0e1f2e9f77. ADR0018/Addendum017 accepted and full service/WP16 authorized. Existing public ports/protocol/identity contracts read. Validation npm run verify, actual heavy PostgreSQL/HTTP/process chain and all triggered exact-head/current-base/browser/build/frontend/handoff gates. Database operator-configured only additive named tables, no reset/provisioning. Successor Review remains forecast.

## Context
Accepted ADR0018/Addendum017, independently integrated A TASK720/#1113. Full owner execution authorized.

## Current behavior
Portable candidate codec/domain/authorization/repository ports exist; no actual durable/network reference provider before B.

## Required change
Implement atomic additive PostgreSQL transaction+head+ledger, server local auth/session/context, bounded delegating Gateway HTTP, configuration/operations and heavy real process proof.

## Inputs / contracts
Public design-candidate and identity-authorization/semantic-substrate, unchanged station-core1.0.0, existing PostgreSQL transport and actual WP15 generated candidate.

## Outputs / contracts
Immutable full candidate tuple/opaque owner revision/retained or rejected durable ledger, exact/head/result queries, explicit local authenticated HTTP; no business approval.

## Acceptance criteria
Actual WP15 -> Gateway HTTP -> Design -> PostgreSQL -> exact readback -> process restart -> identical retained record/result. Idempotency/key conflict/immutable tuple/concurrent stale/auth denied/context/malformed/bounds and committed lost response proofs. All triggered CI PASS.

## Non-goals
Production IAM/multi-tenant/TLS/remote deployment, DB provisioning/reset, event subscriptions, business approval/publication, Station UI, runtime/compiler/deploy changes.

## Evidence expected
Real heavy PostgreSQL/child process/HTTP evidence, full verify, independent exact-head/current-base/browser/build/frontend/handoff CI before merge; report no local full verification claim.

## Escalation
Undeclared owner/L3/L4/forbidden paths, absent actual provider/auth qualification, unresolved proof failures. No missing feature hidden in Review/Closure.
