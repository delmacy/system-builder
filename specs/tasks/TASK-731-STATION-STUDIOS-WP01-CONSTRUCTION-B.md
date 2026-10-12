---
{
  "id": "TASK-731",
  "title": "Integrate shared Studio workbench with actual model and owner journeys",
  "status": "ready",
  "priority": 731,
  "milestone": "STATION-STUDIOS-WP01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-730"
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
    "apps/station/web/app/station-studio-workbench.tsx",
    "apps/station/web/app/station-studios-app.ts",
    "apps/station/web/app/studios/page.tsx",
    "apps/station/web/app/station-workflow-workbench.tsx",
    "apps/station/web/app/station-process-context-workbench.tsx",
    "apps/station/web/app/station-foundation-client.tsx",
    "tests/browser/station-editor-workbench.spec.ts",
    "project_docs/execution_planning/STATION-STUDIOS-WP01-CONSTRUCTION-B-01.report.md",
    "docs/current/NEXT_WORK.md",
    "specs/tasks/TASK-731-STATION-STUDIOS-WP01-CONSTRUCTION-B.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP01-INTEGRATION-REVIEW-01.md",
    "specs/tasks/TASK-732-STATION-STUDIOS-WP01-INTEGRATION-REVIEW.md"
  ],
  "forbidden_paths": [
    ".github/**",
    "packages/design/**",
    "apps/station-gateway/**",
    "runtime/**",
    "deploy/**",
    "docs/adr/**"
  ],
  "max_files": 12,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Deliver shared Studio shell with two existing areas and common readonly Inspector while keeping each area mounted/isolated.
## Context
Accepted Add018 WP01 execution; A registry/controller integrated after own gates. Read actual component/model/owner interfaces and browser harness. No domain duplication.
## Current behavior
Existing separate workbenches; A scoped summaries and registry delivered.
## Required change
Optional summary callbacks in Process Context/Workflow, installed singleton app and /studios route, two accessible navigation buttons and persistent hidden inactive area, existing guarded composition handoff. Summary callback contains only bounded qualified identity/selection/context/draft/pending; no document/token/actor/auth fields.
## Inputs / contracts
Existing actual ProcessContext projection and Workflow authoring/storage/connection; ui-core Inspector/app/window registry and A reducer.
## Outputs / contracts
Operational shared workbench consuming existing contracts with no new domain/source owner. Exact public Design actions still independently verify server authorization/context.
## Acceptance criteria
Real creator/retained/import workflow and context binding, two-area selection/form/draft retention, no hidden crossmodel overwrite; unknown/denied/disconnect preserve draft, exact owner readback remains possible. Narrow/keyboard and singleton minimize/restore; close/reload explicit retained reopen. Unsupported summary input gives visible unavailable Inspector, never false stale currentness.
## Non-goals
New semantic schemas/actions, other Studio deliveries, production auth, auto mapping, new storage/public APIs.
## Evidence expected
Growing browser tests including actual loopback Design/Postgres harness, predecessor103 full regression; own npm verify and all triggered current-base/exact-head/heavy/browser/frontend/platform gates, report. React effects/cleanup/accessibility review.
## Escalation
New owner/architecture/schema, forbidden CI changes, ambiguous identity/source or required domain invention.
