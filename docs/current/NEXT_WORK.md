# Next Work — STATION Shared Composition Editor Engine

Date: 2026-09-25
Execution base: `main@5253f8f3516f121ff457a32dd97f30ff9d12936a`
Status: MATERIALIZED / READY TO CONSTRUCT

## Authority
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-EDITOR-ENGINE-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth
Construction A / TASK-606..610 was integrated by PR #912. Construction B / TASK-611..614 closed by PR #917. Construction C / TASK-615..618 is closed: TASK-615 #920, TASK-616 #921, TASK-617 #922 and TASK-618 cumulative validated draft graph proof #923. Fresh main after #923 is `5253f8f3516f121ff457a32dd97f30ff9d12936a`.

## Active chain

```text
TASK-619  Generic EditorShell surface — READY
   ↓
TASK-620  Shared CompositionEditorEngine controller
   ↓
TASK-621  Accessibility/adversarial hardening
   ↓
TASK-622  Component Lab shared editor engine proof
```

TASK-619 is the next eligible task.

## Construction target
Build the reusable domain-neutral Composition Editor Engine over the already-integrated Composition Graph, validator, local draft/preview semantics, Layers and Inspector. Keep each increment bounded and visibly provable in Component Lab before specializing the engine as a Component Editor.

## Constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-only;
- named slots and discrete grid/span rules remain authoritative;
- invalid references/mutations fail deterministically without silent repair;
- no arbitrary pixel geometry or XS/S/M/L sizing contract;
- no Component Editor application/Launcher entry yet;
- no Window/View Editor;
- no remote persistence/publish/deploy/provider runtime;
- no File Manager, Workflow Studio, semantic Artifact Repository or Core/business authority.

## Succession after this package
If Construction D closes green, materialize the Component Editor specialization dependency-safely. A visible Launcher/AppManifest entry belongs only to the explicitly materialized application slice, not to the shared engine.
