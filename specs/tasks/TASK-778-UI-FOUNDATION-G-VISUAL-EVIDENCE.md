---
{
  "id": "TASK-778",
  "title": "Preserve qualified File Manager adoption evidence",
  "status": "verification",
  "priority": 778,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-777"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.report.md"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-778-UI-FOUNDATION-G-VISUAL-EVIDENCE.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.report.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/evidence/ui-foundation-g/file-manager-before.png",
    "project_docs/evidence/ui-foundation-g/file-manager-after.png",
    "project_docs/evidence/ui-foundation-g/file-manager-narrow.png"
  ],
  "forbidden_paths": [
    "apps/**",
    "packages/**",
    "tests/**",
    ".github/**"
  ],
  "max_files": 7,
  "validation": [
    "npm run check:docs",
    "node --import tsx tooling/agent-harness/src/cli.ts validate-tasks"
  ]
}
---
## Objective
Retain actual qualified before/after File Manager PNGs and partial G handoff.
## Context
Independent owner-requested G slice; F remains partial. Execute evidence writes only after TASK777 seven exact-head workflows and actual Chromium pass.
## Current behavior
Source increment is draft; report records browser/visual evidence pending.
## Required change
Preserve unmodified actual screenshots from qualified source artifacts, record hashes/run/artifact/head and visual findings. Baseline Fce3d0e51 File Manager blob ac4b276e192e9d2671b913e37f8acd64083bf274 matches main exactly; same existing icons-demo workspace journey produces comparative screenshot. Random artifact UUID/background editor differences are not pixel-equivalence claims. Compact new journey supplements comparison. Preserve primary ICON/WP02/F states; no closure.
## Inputs / contracts
Qualified source artifacts and public-main source equality; no fabricated screenshot.
## Outputs / contracts
Durable partial visual record and next eligible G consumer/materialization.
## Acceptance criteria
Actual images inspected, bytes/hashes verified, all source checks PASS, current checkpoint requires own checks. Record any clipped labels/overflow as remaining adoption work; whole G/F/WP stay open.
## Non-goals
Product code edits, F integration/closure, universal visual acceptance or business semantics.
## Evidence expected
Seven source workflows, actual Chromium count, before/after/compact images, docs/task validation, own checkpoint gates.
## Escalation
Failed source/checkpoint gates block qualification and integration. Do not advance source on this evidence task.
