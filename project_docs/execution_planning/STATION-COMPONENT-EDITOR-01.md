# STATION Component Editor 01 — Construction E

Date: 2026-09-26
Execution base: `main@8fb4907e24bf3e3d92d2930d01fc04df36a359e2`
Status: MATERIALIZED / READY TO CONSTRUCT
Predecessor: Construction D / TASK-619..622

## Objective
Specialize the integrated domain-neutral EditorShell + CompositionEditorEngine into a Station Component Editor while preserving the M2 composition boundary. The specialization edits reusable component definitions/contracts and composition graphs; it does not acquire Core/business authority.

## DAG

```text
TASK-623  Component Editor specialization model + adapter
   ↓
TASK-624  Component Editor Station surface
   ↓
TASK-625  Component contract/slot/variant editing proof
   ↓
TASK-626  Component Editor cumulative integration + closure
```

## Invariants
- `ComponentRegistry != AppManifest`.
- `WindowGeometry != composition grid`.
- Station remains presentation/composition-only.
- Reuse EditorShell and CompositionEditorEngine; do not fork a second editor engine.
- Named slots and discrete row/column spans remain authoritative.
- Theme/typography use canonical Station tokens.
- No arbitrary HTML/CSS or arbitrary pixel geometry.
- No remote persistence/publish/deploy/provider runtime in this package.
- No Window/View Editor, Template Manager, File Manager, Workflow Studio or Core/business authority.
- Launcher/AppManifest exposure is deferred unless a later explicitly materialized M2 application slice authorizes it.

## Gate policy
Each TASK must be dependency-safe, bounded by its own allowed/forbidden/max_files contract and qualified on its exact head. Do not mutate a head while its applicable gates are running. Construction E closes only after the cumulative Component Editor proof is green and fresh-main reconciliation is recorded.
