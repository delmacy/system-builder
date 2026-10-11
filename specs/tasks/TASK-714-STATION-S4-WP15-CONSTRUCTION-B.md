---
{
  "id": "TASK-714",
  "title": "Station S4 WP15 Workflow Studio workbench",
  "status": "completed",
  "priority": 714,
  "milestone": "STATION-S4-WP15-WORKFLOW-STUDIO",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-713"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/015-station-workflow-studio/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP15-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "packages/contracts/system-definition/index.ts",
    "packages/contracts/system-definition/system-definition.schema.json",
    "specs/contracts/artifact-envelope/artifact-envelope.schema.json",
    "packages/station-workflow-authoring/index.ts",
    "apps/station/web/app/station-foundation-client.tsx",
    "apps/station/web/app/station-process-context-app.ts",
    "packages/station-interaction/selection.ts",
    "packages/ui-core/index.ts",
    "tests/browser/station-editor.playwright.config.ts"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-workflow-workbench.tsx",
    "apps/station/web/app/station-workflow-projections.tsx",
    "apps/station/web/app/station-workflow-store.ts",
    "apps/station/web/app/station-workflow-app.ts",
    "apps/station/web/app/workflow-studio/page.tsx",
    "apps/station/web/app/station-foundation-client.tsx",
    "tests/product/station-workflow-store.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-S4-WP15-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/STATION-S4-WP15-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-714-STATION-S4-WP15-CONSTRUCTION-B.md",
    "packages/station-workflow-authoring/index.ts"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "packages/compiler/**",
    "packages/runtime-core/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 14,
  "validation": [
    "npm run verify",
    "npm run station:build"
  ]
}
---

## Objective
Complete Addendum015 bounded local workflow Studio journey over actual integrated A APIs.
## Context
COMMITTED from 06accc2a55ba73dbabff2fe83c31953985d87aa8; A#1107 seven workflows PASS,88 Chromium journeys.
Owner authorizes whole WP15 including eligible Review/Closure; no Core ownership/service promotion.
## Current behavior
Actual full codec/immutable draft commands/history/candidate APIs exist; workflow UI/store/launcher absent.
## Required change
Thirteen exact paths; shared qualified Explorer/diagram-table/Inspector, semantic command path,
starter/add-process/state/transition forms, separate bounded local revision store and portable file lifecycle.
Launcher/window/standalone route; dirty/form Cancel/Discard; import sequencing and explicit storage recovery.
Store max16 immutable revisions/4MiB, expected raw snapshot best-effort detection, duplicate tuple conflict.
## Inputs / contracts
Addendum015; actual A API, shell/window/interaction/ui-core, public SystemDefinition/envelope.
## Outputs / contracts
One draft drives coordinated Tools; separate station:workflow-candidates:v1 storage, .workflow.json files.
Complete locally validated candidate journey; no canonical Core availability or execution inferred.
## Acceptance criteria
Actual UI-generated candidate -> store/export/import/fresh-session reopen/compare; all88 prior browser
journeys plus focused workflow cases. Negative semantic edits/imports/storage/stale/dirty lifecycle,
keyboard/narrow and shell minimize/close proof. Pure store tests invoke real engine.
Full npm run verify, station:build and all triggered exact-head/current-base/Windows/Ubuntu/frontend gates.
## Non-goals
Core transport/publication/runtime simulation/BusinessRecipe/action/entity editing, generic editor or CAS.
## Evidence expected
TASK714 one authoritative commit/report/PR and independent CI. C promoted only if actual gap remains.
## Escalation
Undeclared L3/L4/owner/schema/forbidden-path change or unresolved proof failures; preserve all gates.

## Bounded correction admitted before edit
Add packages/station-workflow-authoring/index.ts as14th exact path/max_files14. Existing A codec applied
selected-process edit caps to every process, blocking preservation of unrelated larger valid processes.
Correct caps at command/selection admission, preserve full schema-valid documents. No owner schema/L4
change. Existing B store test supplies actual metadata-preservation regression; no gate weakening.
