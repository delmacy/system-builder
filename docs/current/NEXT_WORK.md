# Next Work — STATION Composition Construction B

Date: 2026-09-25
Execution base: `main@d2226397852f7e362e016975859e69909e11d002`
Status: CONSTRUCTION ACTIVE

## Authority
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-B-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth
`STATION-COMPOSITION-CONSTRUCTION-A-01` / TASK-606..610 was integrated by PR #912. Construction B materialization was integrated by PR #913. TASK-611 generic SelectionModel + collection contracts was implemented and integrated by PR #914 onto fresh main.

## Active chain

```text
TASK-611  Generic SelectionModel + collection contracts — COMPLETED / INTEGRATED
   ↓
TASK-612  Generic Tree/TreeItem navigation — READY
   ↓
TASK-613  Property Inspector primitives
   ↓
TASK-614  Layers Tree + Inspector Component Lab proof
```

TASK-612 is the next eligible task.

## Construction target
Prove the generic navigation/editing surfaces required immediately before the Composition Graph and shared editor engine. This slice deliberately stops before an editor application.

## Constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != view composition grid`;
- Station remains presentation/composition-only;
- canonical theme/typography only;
- no arbitrary pixel geometry or XS/S/M/L sizing contract;
- no Component Editor/Window Editor application yet;
- no File Manager, Workflow Studio, semantic Artifact Repository or Core/business authority.

## Succession after this package
If Construction B closes green, materialize the next dependency-safe slice for Composition Graph + validation + transaction/save/draft/preview semantics. Then proceed to the shared Composition Editor Engine and Component Editor specialization. A visible Launcher entry for the editor becomes eligible only when that application slice is materialized and proven.
