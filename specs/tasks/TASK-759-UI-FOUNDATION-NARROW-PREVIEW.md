---
{
  "id": "TASK-759",
  "title": "Harden narrow composition preview after screenshot review",
  "status": "verification",
  "priority": 759,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-758"
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
    "specs/tasks/TASK-759-UI-FOUNDATION-NARROW-PREVIEW.md",
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
    "node --import tsx --test tests/product/station-editor-palette.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Correct observed unreadable nested preview controls on a narrow screen without changing persisted composition geometry.
## Context
Reviewed actual Chromium Card fresh-reopen screenshot from run38290668638; grid remains12 columns and nested row previews compress labels to fragments. Desktop preview uses real Button but inline-flex anonymous text lacks robust ellipsis.
## Current behavior
No horizontal overflow test failure, yet nested control labels are visually clipped and unusable at390px.
## Required change
Narrow preview grid presentation stacks containers and row nodes; saved spans/data attributes remain unchanged. Shared Button visual snapshot wraps label in a min-width-zero truncating span, preserving full title on span and button. Explain narrow projection to the editor user. Add explicit browser mobile width/readable-label checks and screenshot, retaining desktop span/resize tests.
## Inputs / contracts
Existing preview snapshot, shared Button source, semantic CSS and current Card browser journey.
## Outputs / contracts
Responsive presentation only, no canonical graph/WindowGeometry/codec changes.
## Acceptance criteria
At390px nested Primary action button has room for its label; Card remains authored8columns/4rows in attributes/Inspector after re-open; no page overflow and existing desktop projection remains. Long-label title assertion remains.
## Non-goals
New components, freeform geometry, runtime business commands, general Studio redesign or F closure.
## Evidence expected
Escaped SSR label/title contract, inherited editor regressions, observed new actual browser screenshot and all head gates.
## Escalation
Stop for canonical geometry mutation or regression in existing desktop span behavior.
