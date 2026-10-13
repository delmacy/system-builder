---
{
  "id": "TASK-761",
  "title": "Shared text, icon-text and compact icon button presentation",
  "status": "verification",
  "priority": 761,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-760"
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
    "specs/tasks/TASK-761-UI-FOUNDATION-BUTTON-PRESENTATION.md",
    "packages/ui-core/presentation-button.ts",
    "packages/ui-core/index.ts",
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
  "max_files": 8,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-ui-presentation-button.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Owner refinement: compact grids use semantic icons; labels appear on hover/keyboard focus or when a controlled expandable item expands.
## Context
Current main94da5ae2, F draft1144 headfc5d9b13 qualified seven workflows/126 browser tests. Foundation owns shared presentation source; ICON owns assets and portable icon reference migration.
## Current behavior
No shared typed control admits these three modes; editor codec1–4 rejects icon fields.
## Required change
Own typed PresentationButton over existing Button, StationIcon and qualified AccessibleTooltip. Modes text/icon-text/icon; icons required in icon modes, nonblank accessible label always. Optional controlled expanded reveals text and supplies aria-expanded without inventing command authority. Actual Lab keyboard/hover/Escape/expansion proof.
## Inputs / contracts
Shared semantic IconToken and Button API; caller owns expanded/state/onClick.
## Outputs / contracts
Public source-owned reusable control and real reference surface. SOURCE_ONLY for composition until separately admitted registry/Inspector/versioned codec roundtrip.
## Acceptance criteria
Icon-only has accessible name and no visible text; hover/focus shows associated tooltip, Escape closes; expansion reveals label; native disabled preserved; invalid modes/missing icons reject. Text labels escape. No parallel icon implementation or editor/codec mutation.
## Non-goals
Portable icon-reference schema, source-only readiness promotion, registry insertion, command execution or F closure.
## Evidence expected
SSR contracts, actual browser interaction and all exact-head CI.
## Escalation
Stop for shared path conflict or icon/codec migration requirement outside this bounded source task.
