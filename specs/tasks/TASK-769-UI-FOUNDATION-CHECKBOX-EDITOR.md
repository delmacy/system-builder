---
{
  "id": "TASK-769",
  "title": "Checkbox composition, initial presentation and payload7",
  "status": "verification",
  "priority": 769,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "high",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-768"
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
    "packages/ui-core/primitives.tsx",
    "docs/current/NEXT_WORK.md",
    "packages/station-composition/graph.ts",
    "packages/station-editor/artifact-codec.ts"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-769-UI-FOUNDATION-CHECKBOX-EDITOR.md",
    "packages/station-composition/graph.ts",
    "packages/station-editor/artifact-codec.ts",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-checkbox-fields.tsx",
    "apps/station/web/app/station-editor-checkbox-preview.ts",
    "apps/station/web/app/station-ui-foundation-candidates.ts",
    "tests/product/station-editor-checkbox.test.ts",
    "tests/product/station-editor-palette.test.ts",
    "tests/product/station-ui-foundation-candidates.test.ts",
    "tests/product/station-editor-structure.test.ts",
    "tests/product/station-editor-button-text.test.ts",
    "tests/product/station-editor-button-properties.test.ts",
    "tests/product/station-editor-artifact-codec.test.ts",
    "tests/browser/station-editor-checkbox.spec.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "tests/browser/station-editor-input.spec.ts"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/core/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 20,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-checkbox.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Make shared Checkbox actually insertable/editable/durable using existing registry/editor and strict presentation properties.
## Context
Fresh main94da5ae2 / only draft1144 de0667ab, Input checkpoint seven gates PASS. Add021 admits forms; schema7 reserved for Checkbox, preserve1–6 and existing ICON5.
## Current behavior
Checkbox source-only; graph supports Button/Input.
## Required change
Exact CheckboxProperties kind=checkbox/defaultChecked/disabled (booleans), plain label via existing text, no business checked/value state. Component-aware validation, immutable/no-op/history inherited. Register Checkbox in existing example/action-panel/Forms; ButtonGroup unchanged. Actual shared Checkbox/Label preview, Inspector shared Checkbox controls and pending/undo/save guards. Payload7 required even for default Checkbox nodes;1–6 reject them. Unknown-version negatives advance7→8 preserving assertions.
## Inputs / contracts
Existing ui-core Checkbox/Label, ComponentProperties, source codec/state engine.
## Outputs / contracts
Typed initial presentation config and real composition UI/persistence.
## Acceptance criteria
Insert→label/span/default checked/disabled→keyboard pending guard/history/reset→local save/export7/fresh empty-browser reopen, mixed Input and icon compatibility. Negative coercion/getters/current checked/value/wrong shape/downgrade/stale ref atomic. Source screenshot, all exact-head gates.
## Non-goals
Business truth, check-based authorization, new store/registry/engine, icons assets, F/G closure.
## Evidence expected
Positive/negative/predecessor contracts, actual keyboard/fresh-reopen screenshot and exact-head CI.
## Escalation
Stop for shared-path owner or L4 change.
