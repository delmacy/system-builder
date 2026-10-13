---
{
  "id": "TASK-775",
  "title": "Qualified Checkbox evidence and partial F handoff",
  "status": "verification",
  "priority": 775,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-769"
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
    "packages/ui-core/README.md",
    "packages/station-editor/artifact-codec.ts",
    "packages/station-composition/graph.ts",
    "apps/station/web/app/station-editor-workbench.tsx",
    "apps/station/web/app/station-editor-button-preview.ts",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md",
    "packages/ui-core/README.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-775-UI-FOUNDATION-CHECKBOX-EVIDENCE.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/evidence/ui-foundation-f/checkbox-fresh-v7-reopen.png",
    "packages/ui-core/README.md"
  ],
  "forbidden_paths": [
    "apps/**",
    "tests/**",
    "packages/**/*.ts",
    "packages/**/*.tsx",
    "packages/**/*.css",
    ".github/**"
  ],
  "max_files": 6,
  "validation": [
    "npm run check:docs",
    "node --import tsx tooling/agent-harness/src/cli.ts validate-tasks"
  ]
}
---
## Objective
Preserve qualified actual Checkbox fresh-reopen screenshot and reconcile F/module handoff.
## Context
TASK769 Checkbox initial presentation/payload7/source GUI. Execute evidence writes after source exact-head gates PASS and screenshot inspection. IDs770–774 are historical Construction E commit labels;775 avoids reusing them.
## Current behavior
Report/pointer still list Checkbox source-only.
## Required change
Unmodified CI PNG with source/run/artifact/hash, factual defaultChecked/disabled/label/no-current-state boundaries and1–6 compatibility. Reconcile Checkbox INSERTABLE in draft, three source-only candidates. Preserve primary ICON/WP02 prefix byte-for-byte; update module source-vs-runtime ownership.
## Inputs / contracts
Qualified source CI artifact and accepted Add021.
## Outputs / contracts
Durable partial checkpoint; no main/sprint/WP/G closure.
## Acceptance criteria
Screenshot bytes match qualified source artifact; honestly record local/browser/gates; next eligible overlay/compound admission. Final checkpoint own gates required.
## Non-goals
Source edits, business checked state/authorization, main integration or F closure.
## Evidence expected
Seven source gates,133 browser if observed, image hash, docs/task and checkpoint gates.
## Escalation
Stop for failed source gate or competing pointer owner.
