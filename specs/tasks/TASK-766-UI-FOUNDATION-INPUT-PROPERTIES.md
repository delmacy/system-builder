---
{
  "id": "TASK-766",
  "title": "Typed component properties and portable Input payload6",
  "status": "verification",
  "priority": 766,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "high",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-765"
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
    "apps/station/web/app/station-editor-catalog.ts"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-766-UI-FOUNDATION-INPUT-PROPERTIES.md",
    "packages/station-composition/graph.ts",
    "packages/station-composition/graph-validation.ts",
    "packages/station-composition/draft-transaction.ts",
    "packages/station-composition/responsive-projection.ts",
    "packages/station-editor/structure.ts",
    "packages/station-editor/artifact-codec.ts",
    "packages/station-editor/layers.ts",
    "packages/station-editor/preview.ts",
    "packages/station-editor/inspector.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-catalog.ts",
    "tests/product/station-editor-input-properties.test.ts",
    "tests/product/station-editor-structure.test.ts",
    "tests/product/station-editor-button-text.test.ts",
    "tests/product/station-editor-button-properties.test.ts",
    "tests/product/station-editor-artifact-codec.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/core/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 19,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-input-properties.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Admit source-owned Input presentation using exact typed properties in existing editor/codec, preserving Button formats.
## Context
Fresh main94da5ae2, sole draft1144 head3843d80b qualified seven gates/129 browser. Add021 owns forms/general properties. Shared schema ownership resolved TASK763;6 reserved for this Input admission,5 icon contract unchanged.
## Current behavior
Properties support only Button, Input source-only.
## Required change
ComponentProperties union preserves legacy Button shape; Input exact kind/inputType/placeholder/disabled/readOnly. Plain label uses existing text. No value/business data. Validators pair shape with componentRef; immutable snapshots/semantic no-op/history. Payload6 explicitly admits Input nodes even without properties;1–5 never accept Input, existing source Button docs select minimal1–5 unchanged. Unknown-version negatives advance6→7 preserving assertions. Workbench/catalog changes limited to typed property narrowing/copying; UI promotion successor.
## Inputs / contracts
Existing graph/registry/editor session and shared Input source; no new engine/store.
## Outputs / contracts
Typed inert InputProperties, component-aware validators and payload6.
## Acceptance criteria
Positive default/properties/text/history/roundtrip/freeze; invalid/cross-component/getter/value/HTML/accessor reject atomically. Old1–5 preserved; downgrade6 rejects Input; no-op/reset unchanged semantics.
## Non-goals
Registry/UI admission until successor, business values, icons migration, F closure.
## Evidence expected
Focused plus predecessor tests, docs/types/lint/architecture and combined exact-head CI with eligible UI successor.
## Escalation
Stop for shared-path concurrency or L4 change.
