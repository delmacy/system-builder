---
{
  "id": "TASK-752",
  "title": "Correct provider keyboard proof and narrow navigation layout",
  "status": "verification",
  "priority": 752,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-751"
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
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-B.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-C.md",
    "packages/ui-core/README.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-752-UI-FOUNDATION-C-KEYBOARD-PROOF.md",
    "packages/ui-core/overlays.tsx",
    "packages/ui-core/README.md",
    "tests/browser/station-ui-overlays.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-C.report.md"
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
  "max_files": 5,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Resolve three observed new browser proof failures within admitted C scope; preserve all116 predecessor journeys and validated nested-dialog focus behavior.
## Context
PR1141 initialhead56f6759d passed six workflows; browser observed117pass/3fail. Official installed provider API: Tabs.List.activateOnFocus defaultsfalse; disabled Menu.Item ignores interaction but remains keyboard discoverable; Tooltip uses focus-visible modality.
## Current behavior
Tests incorrectly assumed automatic tab selection, skipped disabled menu focus, and pointer-origin programmatic focus opening tooltip. These assumptions fail actual browser tests; no predecessor regressions observed.
## Required change
Exercise actual keyboard Tab to tooltip; prove disabled menu focus/Enter leaves command unchanged then navigate submenu; prove manual tab activation via Enter and expose documented activateOnFocus option. Wrap tab row for narrow layout. Update API behavior/evidence records. Do not suppress assertions or bypass disabled guards.
## Inputs / contracts
Base UI1.9.0 documented installed API, source-owned SB wrappers, existing C0/B controls.
## Outputs / contracts
Actual keyboard/focus/state/negative assertions and bounded styling correction; no registry/codec/public business authority change.
## Acceptance criteria
All120 browser cases and all own applicable exact-head CI pass; preserve116 inherited journeys and positive/negative keyboard coverage. Report initial failed head and corrected evidence honestly. No merge while any check fails.
## Non-goals
Command/combobox/toolbar/editor insertion or broader construction.
## Evidence expected
Full declared verification (local IPC limitation explicit), own exact-head CI and browser screenshots/traces.
## Escalation
Unexpected provider failure or path collision blocks affected work; never weaken negative assertions to obtain green.
