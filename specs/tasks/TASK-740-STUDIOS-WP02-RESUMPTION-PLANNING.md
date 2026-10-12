---
{
  "id": "TASK-740",
  "title": "Resume WP02 readiness and commit shared icon construction",
  "status": "completed",
  "priority": 740,
  "milestone": "STATION-STUDIOS-WP02",
  "model_tier": "execution",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-739"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/018-station-suite-studios/ADDENDUM.md",
    "docs/contracts/018-station-suite-studios/WP02-EXECUTION.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "packages/ui-icons/index.ts",
    "packages/ui-icons/lucide-adapter.ts",
    "packages/ui-icons/THIRD_PARTY.md"
  ],
  "allowed_paths": [
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLAN-01.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-READINESS-01.md",
    "docs/contracts/018-station-suite-studios/WP02-EXECUTION.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-RESUMPTION-PLANNING-01.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-RESUMPTION-PLANNING-01.report.md",
    "specs/tasks/TASK-740-STUDIOS-WP02-RESUMPTION-PLANNING.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-CONSTRUCTION-A-01.md",
    "specs/tasks/TASK-741-STUDIOS-WP02-SHARED-ICONS.md",
    "docs/current/NEXT_WORK.md"
  ],
  "forbidden_paths": [
    "packages/catalog/**",
    "packages/design/**",
    "packages/contracts/**",
    "apps/station-gateway/**",
    ".github/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 9,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Reconcile fresh owner readiness and explicitly admit user-requested shared icons before WP02 closure.
## Required change
Planning only; materialize first shared-icon construction. Product code is excluded from this Planning sprint.

## Context
Owner authorizes WP02 and shared icons before package closure; accepted Addendum018/ADR0019. Catalog owner independently closed #1133.
## Current behavior
Bounded Lucide subset has ten shell tokens; File Manager and Studio controls have limited shared icon coverage. Catalog Studio client/UI remains forecast.
## Inputs / contracts
Existing StationIcon/IconToken/provider adapter, AppManifest icon field, theme currentColor, installed workbenches and public Catalog owner readiness.
## Outputs / contracts
Reusable semantic icon vocabulary and existing consumers. No domain, owner, artifact schema or runtime contract changes.
## Acceptance criteria
Existing ten tokens stable; complete bounded provider mappings and twelve Suite area identifiers; folder/file/actions/view icons reuse current theme; existing names/keyboard/disabled controls and draft guards preserved. Actual browser predecessor regressions and new icon/navigation journeys pass. Catalog client/UI and final Review/Closure required before WP02 closure.
## Non-goals
Raster icon generation, installing all future Studios, Catalog backend changes, new source approval, themes, destructive workspace mutations, new file types or operating-system filesystem access.
## Evidence expected
Semantic registry/accessibility tests, actual Chromium File Manager/Studios journeys with screenshot, all exact-head CI including repository verify/heavy/platform/browser as triggered. Never claim local execution unless observed.
## Escalation
Unexpected domain/contract change or unresolved predecessor invalidates construction; preserve owner boundaries. User icon request is explicitly authorized; no repeat approval required for this L1 extension.
