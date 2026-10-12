---
{
  "id": "TASK-743",
  "title": "Build complete pinned icon asset catalog and semantic toolbar vocabulary",
  "status": "completed",
  "priority": 743,
  "milestone": "WP-ICON-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-742"
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
    "packages/ui-icons/index.ts",
    "packages/ui-icons/lucide-adapter.ts",
    "packages/ui-icons/semantic-catalog.ts",
    "packages/ui-icons/catalog-metadata.ts",
    "packages/ui-icons/catalog-runtime.ts",
    "packages/ui-icons/custom-definitions.ts",
    "packages/ui-icons/vendor/lucide-snapshot.json",
    "packages/ui-icons/vendor/source-manifest.json",
    "packages/ui-icons/generated/catalog-0.ts",
    "packages/ui-icons/generated/catalog-1.ts",
    "packages/ui-icons/generated/catalog-2.ts",
    "packages/ui-icons/generated/catalog-3.ts",
    "packages/ui-icons/generated/catalog-4.ts",
    "packages/ui-icons/generated/catalog-5.ts",
    "packages/ui-icons/generated/catalog-6.ts",
    "packages/ui-icons/generated/catalog-7.ts",
    "packages/ui-icons/generated/catalog-8.ts",
    "packages/ui-icons/generated/catalog-9.ts",
    "packages/ui-icons/generated/catalog-a.ts",
    "packages/ui-icons/generated/catalog-b.ts",
    "packages/ui-icons/generated/catalog-c.ts",
    "packages/ui-icons/generated/catalog-d.ts",
    "packages/ui-icons/generated/catalog-e.ts",
    "packages/ui-icons/generated/catalog-f.ts",
    "packages/ui-icons/README.md",
    "packages/ui-icons/THIRD_PARTY.md",
    "scripts/generate-station-icon-library.mjs",
    "tests/product/station-icon-library.test.ts",
    "tests/product/station-icon-registry.test.ts",
    "specs/tasks/TASK-743-WP-ICON-01-LIBRARY-FOUNDATION.md",
    "project_docs/execution_planning/WP-ICON-01-CONSTRUCTION-A-01.report.md",
    "project_docs/execution_planning/WP-ICON-01-PLAN-01.md",
    "project_docs/execution_planning/WP-ICON-01-COVERAGE-01.json",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/WP-ICON-01-CONSTRUCTION-B-01.md",
    "specs/tasks/TASK-744-WP-ICON-01-TOOLBAR-COMPOSITION.md"
  ],
  "forbidden_paths": [
    "apps/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/ui-core/**",
    "packages/catalog/**",
    "packages/design/**",
    "packages/contracts/**",
    ".github/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 37,
  "validation": [
    "npm run verify"
  ]
}
---
## Objective
Deliver complete available icon library foundation from pinnedsource and verified roles.
## Required change
Controlled geometrysnapshot/manifest,strictgeneration into16chunks,lightweightmetadata/search/pagination/versionedload/cache,235role aliases and2custommirroring glyphs. Preserve28definitions/rendersemantics. Theme/currentColor/providerattribution. Fullavailability without runtimeCDN;measurebytes/chunks. Actualallcoverage/render/unsafe/missing/version/legacyproof. NoToolbar/chooser/iconfield implementation inA. MaterializeBonlyafterqualifiedA/freshmain.

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
