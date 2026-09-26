# Next Work — STATION Component Editor Specialization

Date: 2026-09-26
Repository truth base: `main@2124073a41e46cc42f22f8b782a81a675c5a1669`
Status: CONSTRUCTION E / TASK-626 RUNNING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Historical status text elsewhere does not override this file plus fresh repository/PR truth.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/CONTRACT_INDEX.md` for scope provenance when applicable
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-EDITOR-ENGINE-01.md`
- `project_docs/execution_planning/STATION-COMPONENT-EDITOR-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Integrated truth
Construction A / TASK-606..610, Construction B / TASK-611..614, Construction C / TASK-615..618 and Construction D / TASK-619..622 are integrated.

Construction E materialization integrated through PR #932. TASK-623 integrated through PR #933. TASK-624 integrated through PR #934. TASK-625 integrated through PR #936. TASK-626 authority transition integrated through PR #943; fresh `main` after that transition is `2124073a41e46cc42f22f8b782a81a675c5a1669`.

## Active chain

```text
TASK-623  Component Editor specialization model + adapter — INTEGRATED
TASK-624  Component Editor Station surface                 — INTEGRATED
TASK-625  Component contract/slot/variant editing proof    — INTEGRATED
TASK-626  Component Editor cumulative integration + closure — RUNNING
```

TASK-626 is the current product task in this materialized chain. Revalidate fresh main and exact task authority before each mutation/review transition.

## Parallel non-product work
Documentation/research/CI PRs may exist in parallel. They do not become product execution authority merely by being open, and must not silently expand TASK-626 scope. Their merge/rebase qualification remains independent. Documentation work should avoid advancing `main` while a product merge-candidate is queued/in-progress or ready for integration when doing so would create avoidable candidate churn.

## Construction target
Close the Component Editor specialization cumulatively over the shared Composition Editor Engine while keeping Station presentation/composition-only. Reuse EditorShell, CompositionEditorEngine, Composition Graph, validator, draft/preview transaction, Layers and Inspector. Do not fork those mechanisms locally.

## Preserved constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-only;
- canonical theme/typography and named-slot/discrete-grid rules remain authoritative;
- invalid references/mutations fail deterministically without silent repair;
- no arbitrary pixel geometry or arbitrary HTML/CSS;
- no implicit Launcher/AppManifest authority;
- no Window/View Editor unless separately materialized;
- no remote persistence/publish/deploy/provider runtime;
- no Template Manager, File Manager, Workflow Studio, semantic Artifact Repository or Core/business authority.

## Succession
After TASK-626 closes green and is integrated, reconcile this file from fresh main before materializing another slice. Research findings and forecast work remain non-authoritative until explicitly promoted through the normal materialization/architecture/scope process.
