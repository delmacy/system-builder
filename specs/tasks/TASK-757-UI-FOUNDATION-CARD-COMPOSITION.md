---
{
  "id": "TASK-757",
  "title": "Admit shared Card container into existing action panel composition",
  "status": "verification",
  "priority": 757,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-756"
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
    "specs/tasks/TASK-757-UI-FOUNDATION-CARD-COMPOSITION.md",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-ui-foundation-candidates.ts",
    "apps/station/web/app/station-editor-card-preview.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "tests/product/station-editor-card-composition.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "tests/product/station-ui-foundation-candidates.test.ts"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 9,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-card-composition.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Promote one additional source-owned Card container into actual existing ComponentRegistry composition without changing serialized format.
## Context
Existing action-panel grid accepts layout containers. Existing codec2 supports authored nodes and slots; Card requires no new custom property fields. Owner authorizes functional F registration.
## Current behavior
Card is a ui-core export/Lab-only control, unavailable to the visual editor.
## Required change
Register component:card only in existing action-panel registry, C2 source Card with column layout, admitted content slot and existing span Inspector. Render actual Card/Header/Title/Content from shared source. Add read-only census entry without claiming Editor-ready before browser qualification. Real UI search→insert→span edit→nested Button→export→fresh import verifies slots and actual component render. Preserve old composition definitions, IDs, revision and codec1–4 readback.
## Inputs / contracts
Card exports; existing registry/placement/slot schemas; current structural editor and artifact codec2+, semantic tokens.
## Outputs / contracts
One descriptor under current registry, no second editor or new property/schema authority. Card presentation variants remain default only; title derived from existing node label; columns/rows and content slot are editable.
## Acceptance criteria
Root insertion works, incompatible row placement rejects, unknown slot and arbitrary ButtonProperties on Card reject atomically. Nested content, span edit and export/fresh reopen preserve graph and source render. Old graphs retain round-trip behavior.
## Non-goals
Arbitrary Card title/style editing, variant/schema expansion, overlays/forms/collections promotion, full F or WP closure.
## Evidence expected
Positive/negative/inherited contracts, native Card SSR, actual browser fresh reopen screenshot, all exact-head CI.
## Escalation
Stop for remote lease conflict or codec/public-boundary incompatibility requiring unmaterialized migration.
