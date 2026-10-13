---
{
  "id": "TASK-755",
  "title": "Admit only compatible live-registry palette entries",
  "status": "verification",
  "priority": 755,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [],
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
    "specs/tasks/TASK-755-UI-FOUNDATION-PALETTE-ADMISSION.md",
    "apps/station/web/app/station-editor-palette.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "tests/product/station-editor-palette.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    ".github/**",
    "docs/current/NEXT_WORK.md"
  ],
  "max_files": 6,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "node --import tsx --test tests/product/station-editor-palette.test.ts",
    "npm run check:docs"
  ]
}
---
## Objective
Construction F2 bounded admission correction on PR1144 current head3da9159, main94da5ae2. Preserve its candidate census and ongoing editor integration.
## Required change
Derive eligible descriptors from the actual ComponentRegistry and existing applyEditorStructure admission, including slot cardinality, constraints and codec limits. Search only eligible descriptors. Resolve selection synchronously when search/container/slot changes, including empty results. No new registry, descriptor identity, codec or readiness promotion.
## Acceptance criteria
Tests prove compatible grid insertion, occupied single slot and missing parent/slot rejection, case-insensitive search and unknown selection fallback. Browser journey searches Button then inserts without manually reselecting, and empty results disable insertion.
## Evidence
Local checks are observed independently; actual browser and all PR-head CI remain required before integration. This task does not close F.

## Context
Qualified E is integrated; draft F is materialized and owner authorized continuity.
## Current behavior
Palette search ignores slot compatibility and keeps an unavailable selected ID.
## Inputs / contracts
Existing EditorSession and ComponentRegistry, chosen parent/slot, structural admission and search text.
## Outputs / contracts
Read-only compatible descriptor list and resolved selection. No canonical mutation during projection.
## Non-goals
New source control descriptors, generic properties, codec migration, full F qualification.
## Evidence expected
Positive/negative product tests, browser insertion journey, lint/typecheck/docs and task validation.
## Escalation
Stop for remote branch lease mismatch or shared-file collision; preserve other work.
