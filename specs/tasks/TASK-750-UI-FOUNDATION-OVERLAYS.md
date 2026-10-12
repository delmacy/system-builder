---
{
  "id": "TASK-750",
  "title": "Implement provider-backed overlay and navigation foundation",
  "status": "verification",
  "priority": 750,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-749"
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
    "package.json",
    "package-lock.json",
    "packages/ui-core/overlays.tsx",
    "packages/ui-core/index.ts",
    "packages/ui-core/README.md",
    "apps/station/web/app/station-overlay-foundation-lab.tsx",
    "apps/station/web/app/station-foundation-client.tsx",
    "tests/product/station-ui-overlays.test.ts",
    "tests/browser/station-ui-overlays.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "specs/tasks/TASK-750-UI-FOUNDATION-OVERLAYS.md",
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
  "max_files": 12,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Provide source-owned overlay/navigation APIs in the existing Component Lab; preserve C0/B and all existing journeys.
## Context
PR1140 exact head5d8c95e qualified with seven applicable successful workflows and integrated17a9a4da. No open PR/exclusive path lock observed. Addendum021 expressly authorizes rolling-wave eleven-sprint execution. ICON corpus APIs are integrated; no toolbar/chooser/schema work here.
## Current behavior
C0/B are implemented source/Lab controls; overlay/navigation surfaces lack operational provider focus behavior.
## Required change
Pin @base-ui/react1.9.0 (MIT) behind SB-owned Dialog/AlertDialog, Popover, accessible tooltip, DropdownMenu/ContextMenu/Menubar, Tabs, Accordion/Collapsible and Breadcrumb exports. Use provider focus/dismiss/roving behavior rather than bespoke interaction engines. Existing Tooltip/MenuSurface remain compatible legacy surfaces. Exercise controlled/uncontrolled state, nested overlays, Escape/outside dismissal, disabled items, focus return and keyboard navigation. Command/combobox candidates remain explicitly forecast for separate bounded materialization; no fake ready controls.
## Inputs / contracts
React19, existing C0 tokens and provider headless primitives. Local presentation state only. Caller owns commands and labels; no business effects or imported executable composition content.
## Outputs / contracts
Typed SB names/anatomy/data-slot and real existing Lab. Upstream license/provenance in ui-core README; package lock pins dependency integrity. Registry and codec untouched; editor exposure remains F.
## Acceptance criteria
Positive/negative SSR tests and real browser pointer/keyboard/focus/nested/modal/menu/navigation tests. Inherit B state and existing116 journeys. Full verify and exact-head applicable CI before qualified integration. Do not claim full screen-reader certification or editor readiness.
## Non-goals
Toolbar/icon chooser, arbitrary command engine, custom combobox, canonical/domain owners, schema/registry/codec mutations, second editor.
## Evidence expected
Observed commands/results, dedicated tests, screenshots; unresolved failures explicit. D remains forecast until qualifiedC and fresh ICON path reconciliation.
## Escalation
Stop affected writes for conflicting ownership, undeclared L3/L4 changes, unavailable/unlicensed provider, or failed qualification. Preserve independent NEXT_WORK pointer.
