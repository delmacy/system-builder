# STATION Composition Editor Engine — M2 Construction D

Date: 2026-09-25
Base: `main@5253f8f3516f121ff457a32dd97f30ff9d12936a`
Status: MATERIALIZED

## Goal
Build the reusable, domain-neutral Composition Editor Engine over the integrated Composition Graph, validator, local draft transaction/preview semantics, Layers Tree and Property Inspector. Station remains presentation/composition-only.

## TASK chain
`TASK-619 -> TASK-620 -> TASK-621 -> TASK-622`

- `TASK-619`: generic EditorShell contract/surface with explicit palette, work-area, layers, inspector, toolbar/commands and status slots.
- `TASK-620`: shared CompositionEditorEngine state/controller connecting selection, validated local draft mutations, discard/reset and preview without persistence authority.
- `TASK-621`: accessibility/adversarial hardening for editor focus/selection, invalid references and rejected mutations; preserve graph/grid/registry invariants.
- `TASK-622`: Component Lab cumulative visual proof of the shared engine, including editor shell, Layers, Inspector, draft/validation state, bounded mutation, discard and preview.

## Invariants
- `ComponentRegistry != AppManifest`.
- `WindowGeometry != composition grid`.
- Named slots and discrete grid/span rules remain authoritative.
- Invalid/dangling/duplicate references are rejected deterministically; never silently repaired.
- Local editor draft/preview state does not imply remote persistence, publication or Core authority.
- No arbitrary pixel geometry or XS/S/M/L canonical sizing contract.
- Shared engine is domain-neutral and cannot contain Component Editor-specific business rules.

## Forbidden scope
No Component Editor application/Launcher entry yet; no Window/View Editor; no Template Library/Manager; no File Manager, Workflow Studio, Canvas/3D, semantic Artifact Repository, provider/deploy runtime, remote save/publish, or Core/business authority.

## Closure proof
Construction D closes only when TASK-619..622 are integrated from exact-head green candidates and the Component Lab visibly proves the shared engine without violating registry/grid boundaries. Then materialize the Component Editor specialization dependency-safely.
