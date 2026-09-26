# Station Span-Grid Composition and Verification Directives

Status: DESIGN DIRECTIVE — requires normal materialization before product implementation
Date captured: 2026-09-26
Scope: Station Component Composition / Editor authoring model and future verification design

## Intent

The Station authoring experience is a constrained system composer, not a free-form pixel design canvas. Authors express spatial intent using proportional spans and semantic composition. Runtime rendering projects that intent into the physical dimensions available to a resizable window.

This document records design/test requirements for later elaboration. It does not itself authorize an implementation outside the currently materialized TASK.

## 1. Span is the authoring unit

Authoring MUST prefer span/proportion vocabulary over pixel sizing and over generic `xs/s/m/l/xl` structural size labels.

A composition describes at minimum:

- logical column/row position;
- `columnSpan`;
- `rowSpan`;
- parent/slot;
- semantic layer/depth where applicable;
- constraints/adaptation rules where applicable.

Pixels/rem/vw/etc. are renderer implementation details, not the primary Builder composition language.

## 2. Grid profiles

The exact grid density MUST NOT be hard-coded into the conceptual contract prematurely. Use named Grid Profiles so empirical UX work can select suitable densities without changing the composition language.

Example candidate only:

```yaml
gridProfile: workstation

profiles:
  workstation:
    columns: 16
    rows: 24
```

More vertical rows than horizontal columns are expected to be useful for desktop anatomy such as menu bars, toolbars, tabs, headers, content, pagination/actions and status bars.

A profile defines logical proportions. It does not require physically square cells.

## 3. Runtime projection and resize

Runtime windows remain freely resizable within their constraints. The renderer projects the canonical span composition into available physical geometry.

Conceptually:

```text
authoring span model
        -> canonical composition
        -> runtime projection
        -> physical window geometry
```

Changing physical window size MUST NOT silently rewrite canonical span intent.

Typography is not required to scale linearly with window geometry. Typography should remain governed by legibility/tokens and bounded adaptations.

## 4. Constrained adaptation

When a composition can no longer preserve usable structure at a smaller geometry, adaptation SHOULD occur through declared discrete composition states/constraints rather than arbitrary pixel breakpoints where practical.

Examples include:

- sidebar expanded -> compact -> collapsed;
- toolbar group wrap/overflow according to its contract;
- content region consumes remaining spans;
- minimum viable window/composition size;
- fixed semantic rails where later evidence shows they are preferable to consuming ordinary grid rows.

Exact adaptation rules require later component/pattern materialization.

## 5. Macro grid versus compact internal composition

A primitive child does not automatically consume one macro span.

Compact compositions such as `ButtonGroup` MAY occupy one or more macro spans while managing several internal buttons/icons according to their own contract. Avoid fractional pseudo-spans such as `0.17 span` merely to pack primitive controls.

Example:

```text
one macro span
└─ ButtonGroup
   ├─ Button
   ├─ Button
   ├─ Button
   └─ Button
```

This preserves a coarse, understandable page/window grammar while allowing dense toolbars and action groups.

## 6. Structure, order and depth are separate

Do not conflate:

- **structure** — parent / child / named slot;
- **order** — sequence among siblings/container children;
- **depth** — front/back semantic layer.

The human Layers view SHOULD present front-most/highest semantic depth first because it answers "what is in front of what?". The Structure view SHOULD present parent-to-child containment.

Prefer semantic layers over arbitrary user-authored z-index values. Exact layer families are to be materialized separately.

## 7. One canonical model, multiple projections

Canvas, Structure, Layers, Inspector and declarative YAML/JSON views MUST NOT become independent truths.

They are projections/editing surfaces over one canonical composition revision.

Expected relationship:

```text
                 Canonical Composition
                 /    |    |    |    \
             Canvas YAML Layers Tree Inspector
```

Technical instance identity, human label, semantic reference and placement context remain separate concerns per the Station composition identity guidance.

Text/declarative editing SHOULD use draft -> validate -> preview/apply/discard semantics so an incomplete YAML edit cannot corrupt committed canonical state.

## 8. Structural verification invariants

Future verification SHOULD make structural correctness the primary oracle rather than relying on screenshots alone.

For every applicable region/component, automatically verify properties such as:

- coordinates and spans remain inside the logical parent/grid;
- parent and named slot exist;
- slot/component compatibility holds;
- sibling ordering is deterministic;
- prohibited overlaps do not occur;
- allowed overlays use compatible semantic layers;
- references are resolvable;
- technical identity remains stable across moves/resizes when identity should be preserved;
- canonical state is not mutated by invalid/rejected drafts;
- every projection reports the same canonical revision or explicitly marked preview revision.

## 9. Projection equivalence tests

Tests SHOULD exercise both directions:

```text
canonical -> Canvas/YAML/Layers/Structure/Inspector
UI/YAML mutation -> validated canonical draft -> all other projections
```

Representative journey:

1. select a component in Canvas;
2. mutate a span/layer/property in Inspector;
3. verify canonical draft;
4. verify YAML, Structure, Layers and Canvas projection;
5. discard and verify exact restoration;
6. repeat, apply, and verify new committed revision;
7. edit the declarative representation;
8. validate/preview/apply;
9. verify all projections converge on the same revision.

A disagreement such as `Canvas=modal` while committed `YAML=floating` for the same property/revision is a test failure.

## 10. Resize verification

Future browser/integration verification SHOULD include resize sweeps, not only fixed screenshots.

For representative windows/patterns, progressively resize across supported physical geometries and declared logical adaptation states while checking:

- toolbar/menu/header attachment remains correct;
- sidebar/content/footer topology remains correct;
- no prohibited overlap;
- no unexpected disappearance;
- no content escapes its container without a declared overflow behavior;
- compact groups remain internally valid;
- layers do not change accidentally;
- constraints/adaptation transitions occur only at declared states;
- typography remains usable according to its separate contract.

The target defect class is structural distortion during interaction/resize, not minor aesthetic preference.

## 11. Property-based composition verification

Once contracts are sufficiently formal, verification SHOULD generate many valid and invalid composition graphs and mutations automatically.

Useful properties include:

```text
serialize(canonical) -> deserialize -> equivalent canonical
valid mutation -> valid canonical
invalid mutation -> rejection + previous canonical preserved
resize projection -> topology/invariants preserved
move/reorder -> identity/reference invariants preserved
```

Generated cases may cover add/remove/move/reorder/resize/layer/variant/undo/redo and legal/illegal slot combinations.

## 12. Test hierarchy and delta responsibility

Verification should remain layered:

- Grid Profile contracts test projection mathematics/constraints deeply;
- component contracts test component behavior deeply;
- composition/pattern tests prove the delta introduced by composition;
- boundary/integration tests prove communication between bounded subsystems;
- E2E browser journeys prove selected real user flows;
- visual regression catches unintended appearance changes;
- human acceptance governs subjective aesthetics/intent.

Do not retest every primitive behavior on every instance. Instances primarily need composition/reference/configuration validation; critical actions and journeys receive their own behavioral verification.

## 13. Constrained personalization

Initial Station authoring SHOULD favor constrained composition over arbitrary design freedom. Visual customization should primarily occur through approved tokens, variants, patterns, span allocation and bounded options. Structural invariants remain locked.

This reduces invalid state space, improves harmony across generated systems, and makes verification reusable.

## 14. Materialization obligations

Before implementation, planning must elaborate at least:

1. candidate Grid Profile(s) and empirical rationale;
2. canonical span/grid schema;
3. runtime projection rules and constraints;
4. semantic layer contract;
5. compact internal composition contract (`ButtonGroup` or equivalent);
6. canonical <-> declarative serialization contract;
7. draft/preview/apply/discard behavior for declarative editing;
8. universal structural validator invariants;
9. resize-sweep verification strategy;
10. projection-equivalence tests;
11. property-based generation strategy and bounded CI cadence;
12. evidence/reporting integration with existing Station test infrastructure.

These items should be decomposed dependency-safely into future materialized work rather than smuggled into an unrelated active TASK.
