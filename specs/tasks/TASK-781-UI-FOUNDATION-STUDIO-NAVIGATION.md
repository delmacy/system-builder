---
{
  "id": "TASK-781",
  "title": "Adopt shared compact Studio area navigation",
  "status": "ready",
  "priority": 781,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-779"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "packages/ui-core/README.md",
    "packages/ui-core/industrial.ts",
    "packages/ui-core/overlays.tsx"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-781-UI-FOUNDATION-STUDIO-NAVIGATION.md",
    "apps/station/web/app/station-studio-workbench.tsx",
    "tests/browser/station-studio-adoption.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.report.md"
  ],
  "forbidden_paths": [
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/ui-icons/**",
    "apps/core/**",
    ".github/**"
  ],
  "max_files": 5,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "npm run check:docs",
    "node --import tsx tooling/agent-harness/src/cli.ts validate-tasks",
    "node --import tsx tooling/agent-harness/src/cli.ts architecture"
  ]
}
---
## Context
Add021 independent G lane; main94da5ae2 fresh, F1144 partial/draft ce3d0e51, G1145 checkpoint2d31a147 qualified seven workflows/124 actual Chromium. Owner asks PC update then implementation to conclude constructions. PC main updated non-destructively; old Next declarations retained in named stash, F/G previews isolated. Full G/F/WP acceptance remains open.
## Current behavior
File Manager long filenames exceed grid tiles; Studio area navigation uses inline Button presentation. Models retain separate mounted drafts and owning services.
## Inputs / contracts
Stable main public ui-core/semantic icons; existing workspace and Studio commands. No F-only API dependency.
## Outputs / contracts
Bounded existing consumer presentation; storage, guards, drafts and owner semantics retained.
## Non-goals
F closure, schema/registry/Core changes, new icon pack/editor, whole Studio or visual certification.
## Escalation
Failed tests, altered owner semantics or fresh conflicting paths block integration.
## Objective
Use shared compact semantic-icon command navigation in installed Studio areas.
## Required change
Public ToolbarGroup/ToolbarButton/PaneHeader and AccessibleTooltip with scoped OverlayPortalProvider. Native named buttons/aria-controls/pressed use existing switchStudioArea, preserving mounted workbenches, draft/context/selection and owning service callbacks. No invented runtime commands or roving-toolbar claim. Actual keyboard/hover/Escape switch/pending draft/shared Inspector and390px bounds test; retain existing Studio service/browser regression.
## Acceptance criteria
Labels through tooltip/focus and full accessible names, visually compact commands, original pending workflow field survives area round-trip; representative screenshot. No domain/owner API changes.
## Evidence expected
Local checks plus exact-head actual browser and all seven workflows. Whole G/F remains partial until other consumers and acceptance qualify.
