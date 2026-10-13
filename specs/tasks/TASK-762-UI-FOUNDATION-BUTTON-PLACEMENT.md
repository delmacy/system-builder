---
{
  "id": "TASK-762",
  "title": "Shared button icon placement and validated presentation combinations",
  "status": "verification",
  "priority": 762,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-761"
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
    "packages/ui-core/README.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-762-UI-FOUNDATION-BUTTON-PLACEMENT.md",
    "packages/ui-core/presentation-button.ts",
    "packages/ui-core/README.md",
    "apps/station/web/app/station-industrial-foundation-lab.tsx",
    "tests/product/station-ui-presentation-button.test.ts",
    "tests/browser/station-ui-industrial.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 7,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-ui-presentation-button.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Complete shared source presentation with explicit start/end semantic icon placement, preserving compact hover/focus and controlled expansion.
## Context
Fresh main94da5ae2 / F1144 head15eacac5, no other open PR. Add021 owns shared source; Add020 owns future portable schema. TASK761 qualified seven workflows /127 browser journeys.
## Required change
Typed iconPlacement start/end default start; reject invalid placement. End placement follows visible label, including controlled expanded icon mode. Compact remains icon-only. Demonstrate end placement in real Lab and assert actual DOM order.
## Acceptance criteria
Default API compatible; both placements preserve accessible label, native disabled, tooltip association and focus across expansion. Invalid contracts reject; no registry/codec/icon asset mutations.
## Non-goals
Portable migration, Editor-ready claim, sprint closure.
## Evidence expected
SSR contract combinations, inherited browser keyboard/tooltip journey with new order assertions, exact-head CI.

## Current behavior
Icon always precedes label; no placement contract.
## Inputs / contracts
Existing ButtonProps, semantic IconToken, accessible label and controlled expansion.
## Outputs / contracts
Typed source iconPlacement; no artifact schema change.
## Escalation
Stop for icon/schema ownership conflict or changes outside exact allowed paths.
