---
{
  "id": "TASK-746",
  "title": "Complete source-owned semantic scales, theme parity and density/state recipes with actual Component Lab proof; no registry/codec claims.",
  "status": "completed",
  "priority": 746,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-745"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "project_docs/schedule/PARALLELISM_POLICY.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLAN.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-INVENTORY.md",
    "packages/ui-core/tokens.ts",
    "packages/ui-core/components.ts",
    "apps/station/web/app/globals.css"
  ],
  "allowed_paths": [
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-INVENTORY.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLANNING.report.md",
    "packages/ui-core/tokens.ts",
    "packages/ui-core/foundation.css",
    "packages/ui-core/components.ts",
    "apps/station/web/app/globals.css",
    "apps/station/web/app/station-visual-foundation-lab.tsx",
    "apps/station/web/app/station-foundation-client.tsx",
    "tests/product/station-ui-foundation.test.ts",
    "tests/browser/station-ui-foundation.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "specs/tasks/TASK-746-UI-FOUNDATION-TOKENS.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-A.report.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/catalog/**",
    "packages/design/**",
    "apps/station-gateway/**",
    ".github/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 13,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Complete source-owned semantic scales, theme parity and density/state recipes with actual Component Lab proof; no registry/codec claims.
## Context
Explicit owner integral execution; Addendum021 and existing ADR0017. Preserve ICON/WP02 authority.
## Current behavior
Inventory records partial colors, no semantic density scales, missing explicit dark Station colors.
## Required change
Complete source-owned semantic scales, theme parity and density/state recipes with actual Component Lab proof; no registry/codec claims.
## Inputs / contracts
Existing semantic tokens, data-slot anatomy, Station theme/density settings, shared editor.
## Outputs / contracts
Additive source-owned presentation only; no business authority, icon vocabulary or codec change.
## Acceptance criteria
Only allowed paths; positive/negative/predecessor proof; all own exact-head CI pass before merge. A controls keep API/defaults; both explicit and system dark map identical surfaces; compact/comfortable affect controls in Lab. No Editor-ready claim.
## Non-goals
New primitives, overlays, catalog/schema changes, toolbar/icon ownership, Core/owners, arbitrary styling.
## Evidence expected
Repository verify; A dedicated product/browser tests and screenshots; observed outputs only.
## Escalation
Unexpected contracts, conflicting path ownership or required forbidden paths block affected work; routine bounded fixes autonomous.

## Bounded audit correction
Source recount excludes cn/class helpers and type exports: components.ts has12 components, plus5 from other ui-core sources =17. Correct factual counts in inventory/planning report within same TASK, not new scope. Max13 exact paths.
