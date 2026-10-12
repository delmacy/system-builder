---
{
  "id": "TASK-730",
  "title": "Build shared installed Studio presentation registry and scoped state",
  "status": "ready",
  "priority": 730,
  "milestone": "STATION-STUDIOS-WP01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-729"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/018-station-suite-studios/ADDENDUM.md",
    "docs/contracts/018-station-suite-studios/WP01-EXECUTION.md",
    "docs/adr/ADR-0016-station-core-gateway-boundary.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "docs/architecture/SUITE_MAP.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP01-PLAN-01.md"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-studio-foundation.ts",
    "tests/product/station-studio-foundation.test.ts",
    "project_docs/execution_planning/STATION-STUDIOS-WP01-CONSTRUCTION-A-01.report.md",
    "docs/current/NEXT_WORK.md",
    "specs/tasks/TASK-730-STATION-STUDIOS-WP01-CONSTRUCTION-A.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP01-CONSTRUCTION-B-01.md",
    "specs/tasks/TASK-731-STATION-STUDIOS-WP01-CONSTRUCTION-B.md"
  ],
  "forbidden_paths": [
    ".github/**",
    "packages/design/**",
    "apps/station-gateway/**",
    "runtime/**",
    "deploy/**",
    "docs/adr/**"
  ],
  "max_files": 7,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Build app-local two-area installed registry and pure qualified snapshot controller, no domain authority. project_docs/execution_planning/STATION-STUDIOS-WP01-PLAN-01.md and A manifest govern.
## Required behavior
Immutable source descriptors for process-context and workflow; snapshot identifies area, artifact/revision/source authority, selection/context/dirty status. Reject malformed/unknown/mismatched/overlimit input and decreasing same-artifact draft revision without mutating state; selection scoped to model/artifact/version. Switch retains each area's snapshot and never merges domain identities. Presence of descriptor/owner state is no grant.
## Acceptance and proof
Positive two model registry/switch/update; negative malformed, duplicate/unknown descriptor, wrong area, stale and cross-artifact selection; predecessor type independence no owner private imports. Tests product-runner discovers filename under tests/product. All own gates before integration.
## Non-goals
UI/domain authoring/backend/auth/schema/public contract changes. B remains forecast until A gates and fresh main.

## Context
Owner-authorized WP01; accepted Add018 execution resolution and current package/manifest.
## Current behavior
Existing Process Context and Workflow models operate separately; shared foundation not yet delivered.
## Required change
Implement only the declared Sprint Goal and bounded paths; later work remains forecast.
## Inputs / contracts
Existing Station presentation and public model/SDK contracts, integrated predecessor and installed descriptors.
## Outputs / contracts
Bounded declared deliverable and growing evidence; no new owner/schema/protocol.
## Acceptance criteria
Declared positive/negative/predecessor proof, isolated context/draft, no permission or authority strengthening; all own gates PASS.
## Evidence expected
Focused tests as applicable, full own npm verify and all triggered exact-head/current-base gates, Sprint report.
## Escalation
Undeclared L3/L4/schema/owner ambiguity, forbidden path, security weakening or unresolvable proof gap.
