# STATION Component Editor Specialization — Construction E

Date: 2026-09-26
Base: `main@8fb4907e24bf3e3d92d2930d01fc04df36a359e2`
Milestone: M2 Station Component Composition/Editor

## Goal
Specialize the shared Composition Editor Engine for reusable component definitions while retaining domain-neutral engine ownership and Station presentation/composition-only authority.

## Dependency chain
TASK-623 → TASK-624 → TASK-625 → TASK-626.

## Required semantics
1. Component Editor specialization adapts component descriptors/registry semantics into the shared engine; it does not duplicate engine state or validation.
2. Property/variant editing is constrained to explicitly declared presentation fields and deterministic bounded mutations.
3. Internal component structure uses named slots and discrete sub-grid/span constraints; WindowGeometry remains unrelated.
4. Invalid/stale references, incompatible slots and invalid variants fail closed without corrupting base/draft/selection.
5. Component Lab visibly proves the cumulative specialization before any application/Launcher exposure.

## Forbidden scope
No AppManifest/Launcher entry; no Window/View Editor; no arbitrary pixel geometry; no remote persistence/save/publish/deploy/provider runtime; no File Manager, Workflow Studio, semantic Artifact Repository or Core/business authority. `ComponentRegistry != AppManifest` and `WindowGeometry != composition grid` remain invariants.

## Closure proof
Construction E closes only when TASK-623..626 are integrated from exact-head green candidates and Component Lab visibly proves the specialization over the shared engine with accessibility/adversarial evidence. Then reconstruct fresh main and materialize only the next dependency-safe M2 slice.
