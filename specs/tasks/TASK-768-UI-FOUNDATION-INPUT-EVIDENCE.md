---
{
  "id": "TASK-768",
  "title": "Qualified Input visual evidence and shared composition handoff",
  "status": "verification",
  "priority": 768,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-767"
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
    "specs/tasks/TASK-768-UI-FOUNDATION-INPUT-EVIDENCE.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/evidence/ui-foundation-f/input-fresh-v6-reopen.png",
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
Preserve actual qualified Input fresh-reopen screenshot and reconcile F/module handoff.
## Context
TASK766/767 typed Input/codec6/source UI. Execute evidence updates only after exact source gates PASS and screenshot inspection.
## Current behavior
Pointer/report still list Input source-only; ui-core README predates qualified icon bridge.
## Required change
Unmodified CI PNG with source/run/artifact/hash, factual Input API/readOnly/placeholder/no-value boundaries and old1–5 compatibility. Reconcile Input INSERTABLE in draft, remaining four source-only candidates. Preserve primary ICON/WP02 pointer prefix byte-for-byte; correct module presentation-control vs registered Button distinction.
## Inputs / contracts
Qualified source CI artifact and accepted Add021.
## Outputs / contracts
Durable partial checkpoint; no readiness/main/sprint closure claim.
## Acceptance criteria
Screenshot bytes match qualified source artifact; local/browser/gates honestly recorded; next eligible Checkbox scope. Final checkpoint own gates required.
## Non-goals
Source edits, business data, F/main integration, ICON/G closure.
## Evidence expected
Seven source gates,131 browser if observed, image hash, docs/task and checkpoint gates.
## Escalation
Stop if source fails or another operational-pointer owner appears.
