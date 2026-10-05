# Contract Addendum 002 — Station Visual Factory Foundation

Date: 2026-10-04
Status: ACCEPTED / MATERIALIZING
Admission source: explicit user authorization to begin the next Work Package after Station S3 closure.
Predecessor: Station S3 Component Grammar & Catalog — CLOSED / PROVEN / INTEGRATED.

## Scope admission

Admit the next bounded Station phase: use the proven C0→C9 grammar as the foundation for the first usable visual factory/editor workbench. The phase composes shared editor surfaces before specialized Studios proliferate.

The first Work Package is limited to the shared editor foundation: Explorer/Layers projection, Inspector/Properties projection, grid/span composition editing, synchronized preview, explicit save/discard of Station-owned composition edits, and proof that all surfaces remain projections of one composition model.

## Durable boundaries

- Station remains presentation/composition-side; it does not acquire Core/business/command authority.
- `identity != placement != presentation != action` and `ComponentRegistry != AppManifest` remain invariant.
- C0→C9 contracts are reused; this addendum does not promote C10/Studio.
- Explorer/Layers, Inspector/Properties and Preview are synchronized projections, not competing canonical stores.
- Editing is constrained by admitted grammar, typed slots, discrete grid/span rules and compatibility validation; arbitrary HTML/CSS authoring is out of scope.
- Save/discard concerns Station-owned composition state only. It must not be represented as business rollback/compensation.
- stale/unknown/partial/reconcile-required state must never be strengthened by a projection.
- provider/runtime/deploy/secrets/persistence authority is not admitted by this increment.

## WP1 objective

Deliver the smallest dependency-safe shared editor slice that can load a valid composition, expose its hierarchy and selected-node properties, perform one constrained placement/span edit, show the same change in preview, validate it fail-closed, and explicitly save or discard the Station-owned draft without creating a specialized Studio.

## Proof obligations

WP1 must prove at minimum:
1. one canonical Station composition projection drives Layers, Inspector and Preview;
2. selection/focus/active-context remain orthogonal unless an admitted contract explicitly couples them;
3. valid edits converge deterministically across projections;
4. malformed, stale, incompatible, duplicate or unknown references fail closed with zero partial canonical mutation;
5. grid/span edits obey discrete structural rules and cannot become arbitrary pixel authoring;
6. discard restores the prior Station-owned composition state deterministically;
7. save produces an explicit Station-owned accepted composition result without claiming Core/business persistence authority;
8. keyboard/focus/accessibility behavior is proven for every UI surface introduced;
9. negative/adversarial/recovery evidence is executable and current at closure.

## Explicitly deferred

Specialized Studios; broad Tool families; provider managers; server/user/git/risk managers; CAD/CAE specialization; arbitrary drag-free canvas; arbitrary HTML/CSS; remote publish/deploy; secrets; durable provider/runtime persistence; AI/MCP authoring; Core/business authority; C10 promotion.

## Execution rule

Materialize only the first dependency-safe Work Package from fresh main. Construction requires its own bounded TASKs, allowed/forbidden paths and exact-head evidence. A forecast is not authority for later Work Packages.
