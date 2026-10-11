---
{
  "id": "TASK-708",
  "title": "Station S4 WP14 shared projection model",
  "status": "completed",
  "priority": 708,
  "milestone": "STATION-S4-WP14-SHARED-PROJECTIONS",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-707"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/014-station-shared-projections/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP14-PLAN-01.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "docs/adr/ADR-0009-public-artifact-envelope.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "docs/architecture/STATION_FRONTEND_FOUNDATION.md",
    "docs/contracts/013-station-process-context/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP13-DOCUMENTATION-CLOSURE-01.report.md",
    "project_docs/21-canvas-visual-builder/WBS.md",
    "packages/station-process-context/index.ts",
    "packages/station-interaction/selection.ts",
    "packages/station-interaction/types.ts",
    "apps/station/web/app/station-process-context-store.ts",
    "apps/station/web/app/station-process-context-workbench.tsx"
  ],
  "allowed_paths": [
    "packages/station-model-projections/index.ts",
    "tests/product/station-model-projections.test.ts",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-S4-WP14-CONSTRUCTION-A-01.md",
    "project_docs/execution_planning/STATION-S4-WP14-CONSTRUCTION-A-01.report.md",
    "specs/tasks/TASK-708-STATION-S4-WP14-CONSTRUCTION-A.md",
    "tsconfig.json"
  ],
  "forbidden_paths": [
    "docs/adr/**",
    "packages/contracts/**",
    ".github/**",
    "provider/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 8,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Implement Addendum014 pure bounded model/registry and context-qualified shared selection.

## Context
COMMITTED from 5fe1ba77dd06624d366a0612ba3ce3ee921a32dd; TASK707/#1101 integrated. Owner authorizes whole WP14 implementation,
including Review/Closure after independent validated gates. A manifest governs seven exact paths.

## Current behavior
WP13 exposes decoded context and exact reference adapters. station-interaction owns collection/selection.
Two shared installed projection descriptors and Inspector projection are absent.

## Required change
Only seven exact allowed paths. Add packages/station-model-projections public additive presentation API;
reuse actual context codec and interaction primitives. Host supplies real resolution, no direct storage
or business mutation. Derived Inspector/capabilities follow validated known selection and status.

## Inputs / contracts
Addendum014/013; existing ProcessContextDocument, process identity, station-interaction selection;
actual predecessor editor/codec/WP12 workspace for integration proof.

## Outputs / contracts
Two source-owned descriptors, <=17 items, unambiguous qualified identity/selection, immutable read-only
Inspector and presentation capability results. No envelope/schema/key/migration or owner API change.

## Acceptance criteria
Every Addendum014 selection/projection/capability invariant; 0/16 views accepted, 17 rejected by actual
codec; duplicate labels/tuples with distinct refs; unknown/cross-context refs preserve selection;
context replacement resets; refresh unresolved keeps selected identity but blocks open affordance;
unknown/duplicate descriptors reject; source context canonical bytes and storage remain unchanged.
Growing proof invokes real predecessor modules; pure model does not claim a completed UI/handoff.
Full npm run verify, station:build and all triggered independent CI before merge.

## Non-goals
No UI construction, persistent selection, imported renderers, new selection owner, semantic editing,
Core/server/host, C10/Studio, live owner transport, runtime/deploy or whole WBS/H3/S4 completion.

## Evidence expected
Positive/negative/predecessor tests, observed validation, TASK708 commit, report and independently
validated A integration; next B remains forecast until fresh-main/authorization.

## Escalation
Authority/path/L3 outside Addendum014/L4/semantic ownership or unresolved proof failures.
Do not modify existing interaction, owner contract, workspace/context codec or workflow paths.

## Bounded operational correction admitted before edit
The architecture gate requires package-name imports even for public sibling indexes. Existing context
package has no root TypeScript alias. Add tsconfig.json as eighth exact path (max_files8) solely for
@system-builder/station-process-context -> existing public index; no new dependency/contract/owner,
workflow or architecture exemption. Reuse existing station-interaction alias. This is necessary to
prove the already admitted A goal and stays L1 resolution plumbing under whole-WP14 authorization.
