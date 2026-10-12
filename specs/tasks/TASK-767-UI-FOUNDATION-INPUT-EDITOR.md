---
{
  "id": "TASK-767",
  "title": "Input real catalog Inspector preview and fresh reopen",
  "status": "verification",
  "priority": 767,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "high",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-766"
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
    "packages/station-composition/graph-validation.ts",
    "packages/station-editor/structure.ts",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-editor-palette.ts",
    "packages/ui-core/components.ts",
    "packages/ui-core/primitives.tsx"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-767-UI-FOUNDATION-INPUT-EDITOR.md",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-input-fields.tsx",
    "apps/station/web/app/station-editor-input-preview.ts",
    "apps/station/web/app/station-ui-foundation-candidates.ts",
    "tests/product/station-editor-input-preview.test.ts",
    "tests/product/station-ui-foundation-candidates.test.ts",
    "tests/product/station-editor-palette.test.ts",
    "tests/browser/station-editor-input.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md"
  ],
  "forbidden_paths": [
    "packages/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 12,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-input-preview.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Make shared Input actually insertable, editable and durable in the existing Component Editor.
## Context
TASK766 local135 editor contracts PASS; fresh main94da5ae2, sole1144 qualified3843d80b. Add021 admits current forms scope.
## Current behavior
Input source-only, no descriptor or GUI editing.
## Required change
Register Input in example/action-panel sources with Forms mapping; preserve source graph/revision and ButtonGroup slots. Existing atomic action-row contract admits all registered atomic controls (not a new button-only restriction); update exact palette expectation accordingly. Inspector label plus type/placeholder/disabled/readOnly over same reducer/guards/history. Preview uses actual Input/Label, inert snapshot, no value authority. Actual insert/nest/size/text/props/save/reopen/keyboard/malformed evidence; stage INSERTABLE only, no main-ready claim.
## Inputs / contracts
ComponentProperties/InputProperties and explicit codec6; shared ui-core controls.
## Outputs / contracts
Existing registry/UI composition, typed fields and preview/source candidate mapping.
## Acceptance criteria
Find Forms; add compatible Input; edit label/property/span; undo/redo/reset/pending guards; save locally/export6/fresh empty-browser import preserving exact admitted fields; negative downgrade/cross-type/extra value atomic. No fake value persistence.
## Non-goals
Business data values, file upload/password types, second registry/engine, ICON edits or F closure.
## Evidence expected
Positive/negative predecessor contracts and actual browser screenshot; all exact-head gates.
## Escalation
Stop for concurrent owner or scope outside exact paths.
