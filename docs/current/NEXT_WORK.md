# Next Work — STATION Component Editor Specialization

Date: 2026-09-26
Execution base: `main@8fb4907e24bf3e3d92d2930d01fc04df36a359e2`
Status: MATERIALIZED / READY TO CONSTRUCT

## Authority
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-EDITOR-ENGINE-01.md`
- `project_docs/execution_planning/STATION-COMPONENT-EDITOR-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth
Construction A / TASK-606..610, Construction B / TASK-611..614, Construction C / TASK-615..618 and Construction D / TASK-619..622 are integrated. Construction D closed through PR #929; exact implementation head `de8d86bd6d24fb53695f8ada04f10f967a2c6e35` passed Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Next.js CI and Automation Handoff before merge. Fresh main after #929 is `8fb4907e24bf3e3d92d2930d01fc04df36a359e2`.

## Active chain

```text
TASK-623  Component Editor specialization model + adapter — READY
   ↓
TASK-624  Component Editor Station surface
   ↓
TASK-625  Component contract/slot/variant editing proof
   ↓
TASK-626  Component Editor cumulative integration + closure
```

TASK-623 is the next eligible task.

## Construction target
Specialize the shared Composition Editor Engine for reusable component authoring while keeping the Station presentation/composition-only. Reuse EditorShell, CompositionEditorEngine, Composition Graph, validator, draft/preview transaction, Layers and Inspector. Do not fork those mechanisms locally.

## Constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-only;
- canonical theme/typography and named-slot/discrete-grid rules remain authoritative;
- invalid references/mutations fail deterministically without silent repair;
- no arbitrary pixel geometry or arbitrary HTML/CSS;
- no Launcher/AppManifest entry in Construction E;
- no Window/View Editor yet;
- no remote persistence/publish/deploy/provider runtime;
- no Template Manager, File Manager, Workflow Studio, semantic Artifact Repository or Core/business authority.

## Succession after this package
If Construction E closes green, reconcile fresh main and materialize only the next dependency-safe M2 slice from the composition roadmap. Application exposure/Launcher registration and Window/View Editor remain separate explicitly materialized slices.
