---
{
  "id": "TASK-763",
  "title": "Portable button icon presentation and explicit payload v5",
  "status": "verification",
  "priority": 763,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "high",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-762"
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
    "packages/station-composition/graph.ts"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-763-UI-FOUNDATION-PORTABLE-ICON-PROPERTIES.md",
    "packages/station-composition/graph.ts",
    "packages/station-composition/draft-transaction.ts",
    "packages/station-editor/structure.ts",
    "packages/station-editor/artifact-codec.ts",
    "packages/station-editor/layers.ts",
    "packages/station-editor/preview.ts",
    "packages/station-editor/inspector.ts",
    "tests/product/station-editor-icon-properties.test.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "project_docs/execution_planning/WP-ICON-01-PLAN-01.md",
    "packages/station-composition/responsive-projection.ts",
    "tests/product/station-editor-button-properties.test.ts",
    "tests/product/station-editor-structure.test.ts",
    "tests/product/station-editor-button-text.test.ts",
    "tests/product/station-editor-artifact-codec.test.ts"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/core/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 16,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-icon-properties.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Admit inert portable icon presentation using existing ICON asset reference, explicit payload5 and legacy1–4 compatibility.
## Context
Fresh main94da5ae2, sole open F1144 qualified8e2012e1. Add020/021 admit versioned L3 presentation. Shared paths reconciled below; no competing owner.
## Current behavior
Button properties exactly variant/disabled; icons cannot roundtrip.
## Required change
Optional presentation object: mode text/icon-text/icon, placement start/end, icon exact catalogVersion/assetRef. Preserve reference when asset missing or version unsupported; UI successor displays honest fallback using ICON loader. Strict inert shape, deep immutable snapshots, semantic no-op comparison. Payload5 only for new field;1–4 never admit hidden presentation.
## Inputs / contracts
Existing ICON reference shape, no geometry; caller-owned label remains node.text/source label.
## Outputs / contracts
Typed ButtonProperties and existing codec/history/Inspector projections. Foundation owns adapter/codec admission; ICON owns library/ref resolution.
## Acceptance criteria
Positive5 roundtrip/history/undo/redo/freeze; legacy4 readable, downgraded5 rejected; invalid/ref/getter/symbol/extra keys reject atomically; missing/version refs preserved.
## Non-goals
No assets, commands, Core effects, new registry/store, or editor-ready claim before UI successor.
## Evidence expected
Focused positive/negative/predecessor contracts and exact-head CI.
## Escalation
Stop for concurrent shared-path owner or L4 change.
