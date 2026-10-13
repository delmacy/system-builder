---
{
  "id": "TASK-784",
  "title": "Make Dialog insertable editable interactive and portable",
  "status": "verification",
  "priority": 784,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-783"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "packages/ui-core/README.md",
    "packages/ui-core/overlays.tsx",
    "packages/station-composition/graph.ts",
    "packages/station-editor/artifact-codec.ts",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "docs/contracts/020-station-icon-toolbar-library/ADDENDUM.md",
    "project_docs/execution_planning/WP-ICON-01-PLAN-01.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-784-UI-FOUNDATION-DIALOG-COMPOSITION.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md",
    "packages/station-composition/graph.ts",
    "packages/station-editor/artifact-codec.ts",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-ui-foundation-candidates.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-dialog-preview.tsx",
    "apps/station/web/app/station-editor-dialog-fields.tsx",
    "tests/product/station-editor-dialog.test.ts",
    "tests/browser/station-editor-dialog.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "tests/product/station-ui-foundation-candidates.test.ts",
    "tests/product/station-editor-palette.test.ts",
    "tests/product/station-editor-artifact-codec.test.ts",
    "tests/product/station-editor-structure.test.ts",
    "tests/product/station-editor-button-properties.test.ts",
    "tests/product/station-editor-button-text.test.ts",
    "tests/browser/station-editor-workbench.spec.ts"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/ui-core/**",
    "apps/core/**",
    "apps/station-gateway/**",
    ".github/**"
  ],
  "max_files": 20,
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
Fresh main94da5ae2; F1144 ce3d0e51 qualified seven workflows/133 Chromium, G1145 independent consumer changes do not own editor/schema paths. Owner asks conclusion of constructions after local PC update. Dialog source provider anatomy exists; compose it in the existing registry/editor.
## Current behavior
Dialog is SOURCE_ONLY. Existing payload7 belongs Checkbox;1–7 remain supported.
## Inputs / contracts
Add021 L3 component/property/codec admission, existing grammar semantic-composite/layout ownership/slot families, source Dialog/OverlayPortalProvider API. ICON assets/bridge ownership retained.
## Outputs / contracts
Plain trigger label in node.text; exact DialogProperties(kind/dialog title/description/disabled), explicit schema8 for any Dialog node. Current open state is disposable preview state, never business state or an authored field. Source graphs/revision7/legacy1–7 unchanged.
## Non-goals
New editor/registry/provider, business confirmation/commands/authorization, current open/defaultOpen/value fields, Core/ICON/owner effects, full F/G closure.
## Escalation
Failed gates, overlapping worker changes or unexpected L4 stop integration. Do not weaken tests or legacy rejection.
## Objective
Expose real accessible source Dialog through the existing Component Editor.
## Required change
Pair exact typed properties to Dialog identity and freeze immutable snapshots. Codec8 even without explicit props; preserve1–7 profiles/downgrade rejection. Existing compatible palette registration/category, authored spans/content child insertion and shared labelled Inspector over same reducer/history/pending/save guards. Preview trigger opens provider modal with title/description/content, focus trap/Escape/return/close in scoped portal; no duplicated outside body. Disabled trigger cannot open. Ephemeral open does not mark graph dirty or serialize. Plain text rendering never executes HTML.
## Acceptance criteria
Actual palette insertion/text/props/slots/span/history/default/reset, keyboard focus/modal interaction, local save/export/fresh-empty-browser reopen and malformed/wrong-kind/current-open/downgrade atomic rejection. Nested Dialog in Card and child controls persist. Legacy tests retained; existing atomic slot cannot admit semantic-composite Dialog. Full approved inventory remains separate residual.
## Evidence expected
Focused positive/negative/history/mixed predecessor properties/Unicode boundaries tests, all existing editor contracts, actual browser journeys/screenshots and own seven exact-head workflows. No INSERTABLE/main operational claim before qualified UI proof.
