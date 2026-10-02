# Station S3 — R7B CAD/CAE Falsification Matrix 02

Date: 2026-09-30
Status: RESEARCH EVIDENCE — IN PROGRESS
Truth base: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Branch: `station-s3-r7b-engineering-benchmark`
Predecessor: R7B Matrix 01 at `d64b2b3499d0535e0d27a3d3deb004adf5765615`.
Authority: research only; no Construction, Core/business authority, or taxonomy promotion.

## Purpose

Falsify the accumulated C0→C10 grammar against CAD/CAE workbenches, concentrating only on evidence not already captured by Matrix 01: dependency/consequence propagation, semantic order, constraints, regeneration, working-versus-materialized revision, and generated-artifact provenance.

Preserved constraints: identity != placement != presentation != action; semantic patterns above primitives; discrete/span composition; one authority/many projections; missing evidence = `unproven-gap`.

## Census delta

| Family | Evidence pressure | Classification | S3 implication |
|---|---|---|---|
| FreeCAD | Parametric objects can depend on properties/other objects and require recomputation; assembly constraints add dependency-bearing relationships. | adopt-pattern / defer | Adopt dependency→impact→recompute as a semantic lifecycle pattern. Defer solver, geometry kernel and CAD-specific object machinery. |
| Onshape | Part Studio is a design environment rather than the model; feature order and rollback are semantically meaningful; mutable workspaces are distinct from immutable versions. | adopt-pattern / adapt | Strongly separates Studio/environment from canonical matter, semantic order from visual placement, and working revision from materialized/stable revision. |
| Siemens NX | Assembly restructure/reparent operations can interact with associative constraints and external references. | adapt / reference-only | A visually simple move may be a structural mutation with dependency consequences; tree drag cannot silently acquire semantic authority. |

## Deductions — research only

### D1 — Structural mutation requires consequence closure

Candidate lifecycle:

`accepted structural mutation → dependency impact set → stale/invalidation → deterministic recompute/regeneration → projection convergence/currentness`.

This is a semantic pattern above primitives, not a new C-level and not Core/business authority.

### D2 — Semantic order is not placement

CAD feature history provides counter-evidence to treating visual tree position as semantic order. Station Layers/tree UX may project ordering, but reorder/reparent requires an admitted structural mutation owned by the canonical composition boundary.

This preserves:
- identity != placement;
- placement != semantic order;
- presentation gesture != action authority.

### D3 — Working revision is not materialized revision

Mutable authoring context and stable/materialized revision must remain distinct concepts. Generated artifacts should be traceable to the canonical revision/context from which they were produced. This strengthens currentness/restoration requirements without importing a CAD document model.

### D4 — C10 hypothesis survives CAD/CAE falsification

No evidence here justifies `C11`, `Studio = many Tools`, or a CAD-specific taxonomy import.

Provisional C10 discriminator remains:
`shared working artifact/context + coordinated multi-Tool structural authoring + dependency/consequence convergence + version/currentness lifecycle + materialization/reopen`.

Status: `unproven-gap`; external precedent is not promotion authority.

## Proof debt delta

Add, without duplicating Matrix 01:
1. Dependency Impact Proof;
2. Regeneration Convergence Proof;
3. Constraint Preservation/Failure Proof;
4. Semantic Order Proof;
5. Working-vs-Materialized Revision Proof;
6. Generated Artifact Provenance Proof.

None is PASS.

## Classification summary

- `own`: existing Station/Core contracts already carrying canonical identity, composition, projection or admitted-action semantics where proven.
- `adopt-pattern`: dependency-impact/recompute lifecycle; semantic-order separation.
- `adapt`: working-versus-stable revision and constraint-aware structural mutation.
- `defer/reference-only`: CAD geometry kernels, solvers, feature taxonomies, proprietary assembly/document machinery.

## Next dependency-safe tranche

Materialize the already-researched Foundry ontology/application boundary as Matrix 03, focusing on identity/action/authority separation, admitted mutation, consequences/currentness, and Application/workspace richness versus C10. Deduplicate against Matrix 01/02. Provider/tenant portability follows only where it adds new falsification evidence. Synthesis/Decision Graph and Construction remain ineligible.
