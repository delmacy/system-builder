---
{
  "id": "TASK-742",
  "title": "Plan complete icon and professional toolbar library",
  "status": "completed",
  "priority": 742,
  "milestone": "WP-ICON-01",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-741"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/020-station-icon-toolbar-library/ADDENDUM.md",
    "project_docs/execution_planning/WP-ICON-01-PLAN-01.md",
    "project_docs/execution_planning/WP-ICON-01-WBS-01.md",
    "project_docs/execution_planning/WP-ICON-01-COVERAGE-01.md",
    "project_docs/execution_planning/WP-ICON-01-COVERAGE-01.json",
    "project_docs/execution_planning/WP-ICON-01-SOURCE-MANIFEST-01.json",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "packages/ui-icons/index.ts",
    "packages/ui-icons/README.md",
    "packages/ui-icons/THIRD_PARTY.md",
    "packages/ui-core/components.ts",
    "packages/station-composition/graph.ts",
    "packages/station-editor/artifact-codec.ts"
  ],
  "allowed_paths": [
    "docs/contracts/020-station-icon-toolbar-library/ADDENDUM.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "project_docs/execution_planning/WP-ICON-01-PLAN-01.md",
    "project_docs/execution_planning/WP-ICON-01-WBS-01.md",
    "project_docs/execution_planning/WP-ICON-01-COVERAGE-01.md",
    "project_docs/execution_planning/WP-ICON-01-COVERAGE-01.json",
    "project_docs/execution_planning/WP-ICON-01-SOURCE-MANIFEST-01.json",
    "project_docs/execution_planning/WP-ICON-01-PLANNING-01.md",
    "project_docs/execution_planning/WP-ICON-01-PLANNING-01.report.md",
    "specs/tasks/TASK-742-WP-ICON-01-PLANNING.md",
    "project_docs/execution_planning/WP-ICON-01-CONSTRUCTION-A-01.md",
    "specs/tasks/TASK-743-WP-ICON-01-LIBRARY-FOUNDATION.md",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLAN-01.md",
    "docs/contracts/018-station-suite-studios/WP02-EXECUTION.md",
    "project_docs/execution_planning/STATION-SUITE-STUDIOS-WBS-01.md"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/**",
    "tests/**",
    "scripts/**",
    ".github/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 17,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Create WP-ICON-01 scope/WBS/source/coverage/readiness and first eligible construction.
## Required change
Planning only; no product behavior. Reconcile WP02 dependency and single pointer.

## Context
Owner requests dedicated complete WP-ICON-01 after rejecting28 navigation icons as insufficient. Explicit examples: text/object alignment, font increase, layer order, save and page; professional toolbar patterns/current theme. Prior #1135 integrated with7 PASS workflows/110 Chromium.
## Current behavior
Existing28 semantic icons/12 Suite identifiers/basic rendering. No complete asset catalog, extensive toolbar roles, shared roving toolbar, chooser or portable icon field. ButtonProperties admits variant/disabled only; payload1–4 reject icon fields.
## Inputs / contracts
Accepted Addendum020; pinned Lucide manifest1877 assets; coverage235 roles/19 categories; current UI/composition/editor/codecs/source-owned catalog and inherited limits.
## Outputs / contracts
Shared visual library, stable old tokens and controlled identity/version/geometry. Icon presentation remains distinct from command implementation and permission.
## Acceptance criteria
All1877 source assets accounted for;235 roles resolved including2 custom mirroring glyphs. Preserve text/object/font/zoom/layer distinctions,28 existing tokens, currentColor/theme/names and offline bundle. Final package requires toolbar/chooser/actual composition save/export/reopen and two actual consumers; foundation alone cannot close it.
## Non-goals
Implement all office/drawing algorithms, fake command readiness, new Core/service/domain authority, unsafe arbitrary SVG uploads or destructive workspace changes. No runtimeCDN or automaticlatest source.
## Evidence expected
Source/digest/geometry/role completeness and negative/missing/version/legacy proof; actual successor toolbar/keyboard/theme/selection/portable reopen/browser proof; all own triggered exact-head CI. No unobserved local execution claims.
## Escalation
Missing required geometry blocks completion. A forbids UI/editor/schema work; B needs exact explicit visualL3 schema/compatibility task authority. Unexpected L4 boundary changes require ADR before affected construction. Icon never grants permission.
