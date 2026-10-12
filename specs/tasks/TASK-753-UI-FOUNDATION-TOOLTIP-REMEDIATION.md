---
{
  "id": "TASK-753",
  "title": "Materialize observed tooltip semantic defect",
  "status": "completed",
  "priority": 753,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-752"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLAN.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-INVENTORY.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-A.report.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/PARALLELISM_POLICY.md",
    "packages/ui-core/components.ts",
    "packages/ui-core/tokens.ts",
    "packages/ui-core/foundation.css",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-B.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-C.md",
    "packages/ui-core/README.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-753-UI-FOUNDATION-TOOLTIP-REMEDIATION.md",
    "specs/tasks/TASK-754-UI-FOUNDATION-TOOLTIP-SEMANTICS.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-C.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/catalog/**",
    "packages/design/**",
    "apps/station-gateway/**",
    ".github/**",
    "docs/current/NEXT_WORK.md",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 3,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Fix the observed shared tooltip accessibility defect; preserve existing keyboard, pointer and Escape behaviors.
## Context
PR1141 head9fb778b7: six workflows PASS, browser119pass/1fail. Downloaded browser error-context explicitly contains visible Reference keyboard help as plain text. Installed Base UI1.9.0 Tooltip root/popup lacks role and description association; wrappers must supply these semantics.
## Current behavior
Tooltip opens on actual keyboard focus but popup lacks role=tooltip and trigger lacks the associated aria-describedby, so accessible role test correctly fails.
## Required change
SB AccessibleTooltip root allocates stable useId context shared by trigger/content. Content enforces role=tooltip/id; trigger merges generated description reference with caller descriptions. Preserve provider dismissal/focus/state, exact prop contracts and existing legacy Tooltip API. Add SSR description preservation and browser identity/description assertions without removing role/Escape tests.
## Inputs / contracts
Existing React/useId, typed Base UI props, C0 tokens, provider-local presentation state.
## Outputs / contracts
Operational tooltip accessibility semantics isolated in ui-core; no canonical state, registry/codec or business contract changes.
## Acceptance criteria
Actual keyboard focus shows role tooltip, ID is referenced by trigger, escaped caller descriptions retained, Escape closes. All120 journeys and all exact-head workflows pass before integration.
## Non-goals
Command/combobox/editor/toolbar/owner/schema changes or broad accessibility certification.
## Evidence expected
Observed artifact evidence, SSR positive/negative contracts, full verify and own browser CI.
## Escalation
Stop for conflicting scope or failure of provider dismissal; never suppress the failing role assertion.
