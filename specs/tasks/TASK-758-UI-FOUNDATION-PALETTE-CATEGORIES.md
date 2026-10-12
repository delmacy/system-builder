---
{
  "id": "TASK-758",
  "title": "Search admitted palette by readable name and presentation category",
  "status": "verification",
  "priority": 758,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-757"
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
    "specs/tasks/TASK-758-UI-FOUNDATION-PALETTE-CATEGORIES.md",
    "apps/station/web/app/station-editor-palette.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "tests/product/station-editor-palette.test.ts",
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
    "node --import tsx --test tests/product/station-editor-palette.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Preserve human-name search after admission filtering and connect actual registered entries to presentation taxonomy.
## Context
F2 palette admission is now strict; source census maps Card to Display. Current id-only search loses spaced names and category discoverability.
## Current behavior
Action panel query does not match component:action-panel; Display query does not expose admitted Card.
## Required change
Search actual registry by readable label, ID and category. Reuse read-only candidate mapping for Card and existing supportsButtonDisplayText for Actions; fallback layout-container to Layouts. Do not make source-only controls insertable. Match only structurally admitted entries, show category with each option and search hint.
## Inputs / contracts
Existing ComponentRegistry, read-only candidate census, structural admission and current selection.
## Outputs / contracts
Deterministic presentation category/label and compatible palette results, no new registry or serialized fields.
## Acceptance criteria
Case-insensitive spaced human names and Display/Actions/Layouts category searches work; incompatible Card remains absent from action-row; Forms controls remain unavailable. Browser finds Card by Display and Button by Actions, then existing insertion/save proof remains.
## Non-goals
New control descriptors, generic property schemas, category-based eligibility, sprint closure.
## Evidence expected
Focused positive/negative search/admission contracts, actual browser category lookup, inherited regression and all head gates.
## Escalation
Stop for conflicting candidate/registry ownership or branch lease mismatch.
