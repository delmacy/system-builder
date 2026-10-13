---
{
  "id": "TASK-764",
  "title": "Actual editor icon chooser preview and v5 fresh reopen",
  "status": "verification",
  "priority": 764,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "high",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-763"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "packages/station-editor/structure.ts",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-ui-foundation-candidates.ts",
    "docs/contracts/020-station-icon-toolbar-library/ADDENDUM.md",
    "project_docs/execution_planning/WP-ICON-01-PLAN-01.md",
    "packages/ui-core/README.md",
    "packages/station-editor/artifact-codec.ts",
    "packages/station-composition/graph.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-button-preview.ts"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-764-UI-FOUNDATION-EDITOR-ICON-JOURNEY.md",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-button-preview.ts",
    "apps/station/web/app/station-editor-icon-fields.tsx",
    "tests/product/station-editor-button-preview.test.ts",
    "tests/browser/station-editor-icons.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "tests/browser/station-editor.playwright.config.ts",
    "tests/browser/station-editor-workbench.spec.ts"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/core/**",
    ".github/**",
    "docs/current/NEXT_WORK.md",
    "packages/station-composition/**",
    "packages/station-editor/**"
  ],
  "max_files": 9,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-button-preview.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Make existing registered Button icon presentation configurable and durable through the real editor.
## Context
TASK763 kernel131 editor tests PASS; fresh main94da5ae2, sole draft1144. Add020/021 coordinated bridge.
## Current behavior
Only variant/disabled exposed; source icon modes not persisted by UI.
## Required change
Bounded public ICON search chooser, mode and placement Inspector, same reducer dirty/history guards; existing Button preview consumes checksummed owner loader/StationGlyph. Async reference-key/cancellation prevents stale glyph. Missing/unsupported keeps label visibly and reference unchanged. Existing codec5 export/local save/fresh reopen.
## Inputs / contracts
ButtonProperties.presentation and getIconLibrary/StationGlyph public API; label remains existing text.
## Outputs / contracts
Actual UI configuration, inert source-owned preview, portable state.
## Acceptance criteria
Choose icon, hide/show label, position, undo/redo/reset; pending fields block save/switch; save/export/fresh empty-browser import preserves v5 reference/label/mode/placement/disabled. Invalid import atomic; unsupported/missing fallback honest.
## Non-goals
Runtime business commands, full ICON WP closure, expandable authored schema, new registry/storage or F closure.
## Evidence expected
Inherited local regressions, actual browser positive/negative/fresh-reopen/keyboard screenshot, exact-head CI.
## Escalation
Stop for shared path conflicts or contract edits outside task.
