# Next Work — STATION Component Editor Specialization

Date: 2026-09-26
Execution base: `main@8fb4907e24bf3e3d92d2930d01fc04df36a359e2`
Status: MATERIALIZED / READY TO CONSTRUCT

## Authority
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-EDITOR-ENGINE-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth
Construction A / TASK-606..610, Construction B / TASK-611..614, Construction C / TASK-615..618 and Construction D / TASK-619..622 are integrated. Construction D closed by PR #929 from exact head `de8d86bd6d24fb53695f8ada04f10f967a2c6e35`; fresh main is `8fb4907e24bf3e3d92d2930d01fc04df36a359e2`. Its Component Lab proof integrates EditorShell + shared CompositionEditorEngine + selection + validated local draft mutations + discard/reset + preview while preserving Station presentation/composition-only authority.

## Active chain

```text
TASK-623  Component Editor specialization adapter — READY
   ↓
TASK-624  Constrained component property/variant editing
   ↓
TASK-625  Internal slot/sub-grid specialization hardening
   ↓
TASK-626  Component Lab cumulative specialization proof
```

TASK-623 is the next eligible task.

## Construction target
Specialize the already-integrated domain-neutral Composition Editor Engine for reusable component definitions without duplicating the engine or crossing into application/runtime authority. The specialization may interpret component descriptors, named internal slots, discrete sub-grid/span constraints and explicitly declared presentation properties/variants. It remains local/draft-first and visibly provable in Component Lab.

## Constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-only;
- reuse the shared CompositionEditorEngine; do not fork/reimplement it;
- named slots and discrete grid/span rules remain authoritative;
- invalid references/mutations fail deterministically without silent repair;
- no arbitrary pixel geometry or XS/S/M/L sizing contract;
- no Launcher/AppManifest entry in this Construction;
- no Window/View Editor;
- no remote persistence/publish/deploy/provider runtime;
- no File Manager, Workflow Studio, semantic Artifact Repository or Core/business authority.

## Succession after this package
After TASK-623..626 close green, revalidate fresh main and materialize the next dependency-safe M2 slice. A visible Component Editor Launcher/AppManifest entry is a separate explicitly materialized application slice and must not be smuggled into the specialization.
