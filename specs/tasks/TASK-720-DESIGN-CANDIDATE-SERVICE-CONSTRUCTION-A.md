---
{
  "id": "TASK-720",
  "title": "Design candidate contract and owner command foundation",
  "status": "draft",
  "priority": 720,
  "milestone": "DESIGN-CANDIDATE-SERVICE-WP1",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": true,
  "executor_preference": "any",
  "depends_on": [
    "TASK-719"
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
    "packages/contracts/design-candidate/index.ts",
    "packages/design/index.ts",
    "packages/station-workflow-authoring/index.ts",
    "tests/product/design-candidate-owner.test.ts",
    "tests/product/station-workflow-authoring.test.ts",
    "tsconfig.json",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/DESIGN-CANDIDATE-SERVICE-WP1-CONSTRUCTION-A-01.report.md",
    "specs/tasks/TASK-720-DESIGN-CANDIDATE-SERVICE-CONSTRUCTION-A.md"
  ],
  "forbidden_paths": [
    ".github/**",
    "packages/runtime-core/**",
    "packages/compiler/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 11,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Implement accepted provider-neutral candidate contract/validation and SB04 owner command ports.

## Context
PREPARED ONLY. Explicit owner acceptance of proposed ADR0018/Addendum017 and execution authorization required, followed by fresh-main exact path/contract review.

## Current behavior
No owner candidate service; local Station codec exists but cannot become canonical owner validation by private import.

## Required change
Candidate11 exact paths; public contract admission/validation, immutable submit/exact-query/head/result APIs, verified actor eligibility and repository ports. Shared codec extraction only via accepted public boundary.

## Inputs / contracts
ADR0018/Addendum017 after acceptance, existing schema/envelope, actual WP15 predecessor and existing public authority interfaces revalidated before code.

## Outputs / contracts
Owner receipt retained/rejected/unknown, distinct owner revision/immutable artifact tuple and deterministic conflict/idempotency contract.

## Acceptance criteria
Actual WP15 input, full unrelated metadata preservation, malformed/denied/stale/duplicate-command conflict/immutability proofs; all existing Station regressions/full verification pass.

## Non-goals
PostgreSQL/network implementation in A, publication, upstream approval, Runtime/deploy, production identity certification.

## Evidence expected
Accepted authority first; focused actual predecessor tests, report/one task commit/independent CI. Durable service O1–O4 not claimed from memory tests.

## Escalation
Absent acceptance, undeclared scope/owner/L4/forbidden paths or unresolved tests; no direct canonical effect from Station.
