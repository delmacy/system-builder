---
{
  "id": "TASK-747",
  "title": "Materialize UI Foundation native primitive construction",
  "status": "completed",
  "priority": 747,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-746"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLAN.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-INVENTORY.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-A.report.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/PARALLELISM_POLICY.md",
    "packages/ui-core/components.ts",
    "packages/ui-core/tokens.ts",
    "packages/ui-core/foundation.css",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-B.md"
  ],
  "allowed_paths": [
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-B.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-B-PLANNING.report.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLAN.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-INVENTORY.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-A.report.md",
    "specs/tasks/TASK-746-UI-FOUNDATION-TOKENS.md",
    "specs/tasks/TASK-747-UI-FOUNDATION-B-MATERIALIZATION.md",
    "specs/tasks/TASK-748-UI-FOUNDATION-PRIMITIVES.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/catalog/**",
    "packages/design/**",
    "apps/station-gateway/**",
    ".github/**",
    "docs/current/NEXT_WORK.md",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 8,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Fresh-main admission of B only; reconcile qualified A and nonconflicting ICON work, preserve source/catalog distinction.
## Context
Owner authorized eleven-sprint WP under accepted021/ADR0017; A integratedPR1138 b50a550f with seven exact-head workflows/113 Chromium journeys. ICON PR1139 TASK743 only; UI/icon/codec ownership independent.
## Current behavior
Seventeen existing source components, no general primitive palette. C0 scales and reference operational. New primitive families absent.
## Required change
Fresh-main admission of B only; reconcile qualified A and nonconflicting ICON work, preserve source/catalog distinction.
## Inputs / contracts
Native HTML browser behavior and inherited C0/source-owned React APIs. Native Select remains distinct from Combobox.
## Outputs / contracts
SB-owned native control APIs and data-slot/theme/density grammar. Radio group explicitly validates options/selection, native key behavior and independent names. Progress invalid ranges fail closed. No provider runtime imports or canonical state.
## Acceptance criteria
Positive/disabled/invalid/controlled/uncontrolled/keyboard/browser proof, inherited tokens, actual native rendered elements and labeled Lab. Preserve APIs and existing113 journeys. No general registry/catalog/readback claims untilF. Avatar deferred for lack of actual need; field presentations are not a validation/business engine. All own exact-head CI required.
## Non-goals
Overlays, custom combobox, toolbar/icon chooser, schema/codec/registry/owner changes, business validation, second editor or full shadcn parity.
## Evidence expected
Dedicated contract/SSR and actual browser native-state/keyboard/limits/disabled tests and screenshots; repository verify and own applicableCI. Local limitations remain explicit.
## Escalation
Unexpected shared contracts or ICON successor file collision blocks affected work. Preserve forbidden paths. C remains forecast until qualifiedB and fresh provider/license materialization.
