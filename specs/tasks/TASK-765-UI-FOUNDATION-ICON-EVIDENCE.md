---
{
  "id": "TASK-765",
  "title": "Qualified icon editor evidence and coordinated live handoff",
  "status": "verification",
  "priority": 765,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-764"
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
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-765-UI-FOUNDATION-ICON-EVIDENCE.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/evidence/ui-foundation-f/icon-only-fresh-reopen.png",
    "project_docs/evidence/ui-foundation-f/icon-text-fresh-reopen.png"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/**",
    "tests/**",
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
Preserve qualified actual icon-only/icon-text fresh-reopen screenshots and reconcile independent F handoff.
## Context
TASK763/764 coordinated ICON bridge; main94da5ae2 and only draft1144. Execute only after exact source head gates PASS and actual screenshots reviewed.
## Current behavior
Live F pointer/report predates icon authoring and wrongly leaves resolved migration coordination as next prerequisite.
## Required change
Unmodified CI PNGs with hashes/source/run/artifact provenance, factual report including failed heads, qualified source evidence, and next bounded form-control admission. Preserve primary ICON/WP02 pointer byte-for-byte.
## Inputs / contracts
Actual source CI artifact, accepted Add020/021, existing live pointer.
## Outputs / contracts
Durable factual checkpoint; no new scheduler or readiness promotion.
## Acceptance criteria
Screenshots byte-identical to qualified artifact; historical failures retained; state partial/open. Final checkpoint own CI required.
## Non-goals
Source changes, F/main integration, ICON closure, G execution.
## Evidence expected
Seven source gates,129 browser journeys if observed, PNG hashes, docs/task checks and checkpoint gates.
## Escalation
Stop if any source gate fails or another pointer owner appears.
