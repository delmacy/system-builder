---
{
  "id": "TASK-741",
  "title": "Build shared Station icons and apply reusable File Manager/Studio navigation",
  "status": "ready",
  "priority": 741,
  "milestone": "STATION-STUDIOS-WP02",
  "model_tier": "execution",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-740"
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
    "packages/ui-icons/index.ts",
    "packages/ui-icons/lucide-adapter.ts",
    "packages/ui-icons/THIRD_PARTY.md",
    "packages/ui-icons/README.md",
    "apps/station/web/app/station-file-manager-workbench.tsx",
    "apps/station/web/app/station-studio-workbench.tsx",
    "apps/station/web/app/station-workflow-projections.tsx",
    "apps/station/web/app/station-file-manager-app.ts",
    "apps/station/web/app/station-studios-app.ts",
    "apps/station/web/app/station-workflow-app.ts",
    "apps/station/web/app/station-process-context-app.ts",
    "tests/product/station-icon-registry.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "specs/tasks/TASK-741-STUDIOS-WP02-SHARED-ICONS.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-CONSTRUCTION-A-01.report.md",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLAN-01.md"
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
  "max_files": 18,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Deliver reusable theme-aware icons before Catalog Studio package closure.
## Required change
Extend existing bounded Lucide registry, document reuse/provider attribution, apply folder/file/action/grid/list/Studio/workflow icons and app manifest identities. Add presentation-only File Manager grid/list toggle preserving navigation/selection/forms and existing storage/editor guards. Test registry plus real browser journeys; record React review and growing proof.

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
