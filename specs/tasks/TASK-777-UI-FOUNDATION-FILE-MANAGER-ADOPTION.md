---
{
  "id": "TASK-777",
  "title": "Adopt shared File Manager fields and compact command groups",
  "status": "ready",
  "priority": 777,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-776"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "packages/ui-core/README.md",
    "packages/ui-core/industrial.ts",
    "packages/ui-core/overlays.tsx",
    "apps/station/web/app/station-file-manager-workbench.tsx"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-777-UI-FOUNDATION-FILE-MANAGER-ADOPTION.md",
    "apps/station/web/app/station-file-manager-workbench.tsx",
    "tests/browser/station-file-manager-adoption.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.report.md"
  ],
  "forbidden_paths": [
    "apps/core/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/ui-icons/**",
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
## Objective
Replace inline File Manager fields and view switches with integrated ui-core presentation APIs, preserving existing workspace operations and guards.
## Required change
Use public Input/Select/PaneHeader/ToolbarGroup/ToolbarButton. Icon-only view switches retain accessible names/pressed state and actual AccessibleTooltip hover/keyboard labels with a window-scoped OverlayPortalProvider. No roving-toolbar claim: native Tab/Enter remains. Keep item names visible for actual files/folders. No new shared control implementation. Same callbacks, storage, async cancellation and handoff.
## Acceptance criteria
Browser creates a real folder, changes views through keyboard, preserves pending name and storage, checks tooltip/Escape and compact geometry, proves root-disabled parent navigation, retains all existing workspace regression journeys. Capture before/after wide/narrow screenshots using same seeded local workspace.
## Inputs / contracts
Integrated main ui-core APIs, existing artifact workspace contracts. No F branch dependency.
## Outputs / contracts
Existing File Manager presentation only; no codec/store/owner API change.
## Non-goals
Full G/F/WP closure, complete desktop redesign, Core changes, business authorization, ICON implementation, new component editor.
## Evidence expected
Local lint/types/docs/tasks/architecture/build; exact-head Actions and real Chromium; screenshots. Local full verify limitation must be explicit if present.
## Escalation
Stop integration on failed checks, fresh-base conflicts or changed shared API. Further G consumers require separate materialized TASKs.

## Context
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.

## Current behavior
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.
