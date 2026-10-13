---
{
  "id": "TASK-782",
  "title": "Preserve qualified File Manager and Studio adoption evidence",
  "status": "verification",
  "priority": 782,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-780",
    "TASK-781"
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
    "specs/tasks/TASK-782-UI-FOUNDATION-G-ADOPTION-EVIDENCE.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.report.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/evidence/ui-foundation-g/file-manager-after-labels.png",
    "project_docs/evidence/ui-foundation-g/file-manager-long-labels.png",
    "project_docs/evidence/ui-foundation-g/studio-compact-commands.png"
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
Preserve qualified actual G long-label/Studio evidence and local PC update state.
## Context
Source d35eb41b seven exact-head workflows PASS;126 Chromium journeys PASS. Windows production build and three actual new consumer journeys PASS. Baseline F remains separate; new Dialog implementation has its own gates.
## Current behavior
Source partial report still records GUI evidence pending and long-name overflow as residual.
## Required change
Inspect and preserve unmodified qualified source PNGs with run/artifact/head/hashes; retain old comparisons historically without overwriting them. Update partial state, explicit80/81 boundary correction history and next eligible consumers. Primary ICON/WP02 and F acceptance remain open.
## Inputs / contracts
Qualified source artifact11783231516/run38331510193/job115082059708 and actual observed PC logs.
## Outputs / contracts
Durable partial G evidence, no whole constructions/WP closure.
## Acceptance criteria
Actual image bytes/hash/source match; all source gates PASS; own checkpoint requires all applicable gates. No placeholder UI or scope closure claim from test counts.
## Non-goals
Source/schema/owner edits, F or whole G acceptance, main integration by evidence alone.
## Evidence expected
126 actual Chromium, three Windows new tests,17 local workspace/revision/Studio contracts; fresh screenshots and docs/tasks validation.
## Escalation
Failed source/own checkpoint checks block qualification. Conflicting pointer owner stops write.
