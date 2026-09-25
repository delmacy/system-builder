# Next Work — STATION Component Composition/Editor M2

Date: 2026-09-25
Execution base: `main@6c3e13f868854f041a25da9185a479c540cb003c`
Status: NEXT SLICE MATERIALIZED

## Authority
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-GRAPH-PLAN-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth
Construction A / TASK-606..610 was integrated by PR #912. Construction B materialization and TASK-611..614 were integrated through PRs #913..#917. PR #917 merged at `main@6c3e13f868854f041a25da9185a479c540cb003c`; its exact head `8b8e64118f23e201677bbd94b92bd2eac9492fde` passed Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Next.js CI and Automation Handoff.

## Active M2 chain

```text
TASK-615  Composition Graph contracts + canonical normalization — READY
   ↓
TASK-616  Deterministic graph validator
   ↓
TASK-617  Working transaction/history + dirty/undo/redo
   ↓
TASK-618  Save-to-draft + isolated preview semantics/proof
   ↓
Shared Composition Editor Engine — materialize only after this slice closes green
   ↓
Component Editor specialization / visible Launcher entry when dependency-safe
```

TASK-615 is the next eligible task.

## Constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station presentation/composition-only, no Core/business authority;
- canonical theme/typography only;
- grid/span/named-slot composition only; no arbitrary canonical pixel geometry or XS/S/M/L sizing contract;
- no Component Editor application until the shared engine dependency is satisfied;
- no Window/View Editor, File Manager, Workflow Studio, Canvas/3D, semantic Artifact Repository or deploy/provider runtime in this slice.

## Visual proof currently available
Component Lab includes the cumulative LEGO proof plus Layers Tree + Property Inspector sharing stable semantic selection. The next graph slice is contract/state foundation; visual editor application wiring remains deferred until dependency-safe.
