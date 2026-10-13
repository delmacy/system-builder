---
{
  "id": "TASK-756",
  "title": "Render shared Button in the existing composition preview",
  "status": "verification",
  "priority": 756,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-755"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "packages/station-editor/structure.ts",
    "apps/station/web/app/station-editor-catalog.ts"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-756-UI-FOUNDATION-BUTTON-PREVIEW.md",
    "apps/station/web/app/station-editor-button-preview.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "tests/product/station-editor-button-preview.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 6,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-button-preview.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Render the source-owned ui-core Button for both admitted button descriptor IDs in the single existing preview.
## Context
F owner-authorized scope, current draft1144 after TASK755. Existing button text/variant/disabled payloadv4 supports round-trip; preview currently paints an approximate div.
## Current behavior
Preview uses decorative styled boxes instead of shared component recipes.
## Required change
Reuse actual Button source with the current typed ButtonProperties, escape text, preserve node placement/selection/accessibility preview labels and visual representation. Presentation-only preview controls are aria-hidden, untabbable and pointer-inert within the existing named image; no command binding or business execution. Add SSR contract and real file export/fresh-session import native Button assertions.
## Inputs / contracts
Existing ButtonProperties, layer labels and canonical preview snapshot; shared Button API.
## Outputs / contracts
Actual source-controlled Button render for existing supported IDs, no new serialized fields or registry.
## Acceptance criteria
Native button with shared data-slot, current variant recipe and actual disabled attribute, escaped display text and no command effects. Existing preview selectors retained; browser fresh reopen matches properties and native rendered element.
## Non-goals
New descriptors, generic property migration, interactive runtime commands, other component readiness, F closure.
## Evidence expected
SSR positive/default/negative contract evidence, inherited editor regression, browser export/reopen screenshot and exact-head CI.
## Escalation
Stop for remote lease conflicts or changed public artifact contract.
