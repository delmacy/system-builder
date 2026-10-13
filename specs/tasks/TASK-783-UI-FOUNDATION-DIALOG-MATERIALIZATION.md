---
{
  "id": "TASK-783",
  "title": "Materialize existing Dialog composition admission",
  "status": "ready",
  "priority": 783,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-775"
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
    "specs/tasks/TASK-783-UI-FOUNDATION-DIALOG-MATERIALIZATION.md",
    "specs/tasks/TASK-784-UI-FOUNDATION-DIALOG-COMPOSITION.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md"
  ],
  "forbidden_paths": [
    "packages/ui-icons/**",
    "packages/ui-core/**",
    "apps/core/**",
    "apps/station-gateway/**",
    ".github/**"
  ],
  "max_files": 3,
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
Commit exact bounded Dialog task before product writes.
## Required change
TASK784 twenty exact paths; shared editor/schema ownership verified against independent G. Dialog family semantic-composite/layout column/self, content multi-slot admitted by grid and Card's explicitly expanded semantic-composite slot. Register in example/action-panel, original graphs unchanged; restricted atomic action-row remains rejecting. Title1–256 nonblank plain chars, description0–512 plain chars; no Cc/unpaired surrogate. Button text contract supplies trigger label.
## Acceptance criteria
Props/slots/preview/persistence/state ownership/test/version constraints recorded. Schema8 successor of Checkbox7; unknown-version negative moves9 with all assertions retained.
## Evidence expected
Fresh PR/base/CI, docs/tasks/architecture verification; source implementation only after materialization.
