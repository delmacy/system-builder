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

Presentation variants such as `compact`, `iconOnly`, `comfortable` or density choices MAY exist where semantically useful, but they MUST NOT become an alternative structural sizing language. Geometry remains span/constraint-driven; variants govern bounded presentation or component-internal behavior.

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

Grid profiles SHOULD be versionable or otherwise explicitly identifiable so a profile refinement cannot silently reinterpret an existing composition revision.

## 3. Authoring resize versus runtime resize

Two different resize operations exist and MUST NOT be conflated.

### Authoring/component resize

Inside Component Editor or future Window/View Editor, resize changes canonical composition intent. A visual handle MAY be continuous while dragged, but a committed authoring mutation MUST resolve to valid discrete span/constraint changes such as `columnSpan: 3 -> 4`. It MUST NOT persist arbitrary pixel width/height as canonical composition geometry.

### Runtime/window resize

A running Station window remains freely resizable within `station-windowing` constraints. Runtime resize changes physical `WindowGeometry`; it does not rewrite canonical composition spans merely because the physical window changed.

Conceptually:

```text
AUTHORING
visual gesture
    -> snap/resolve
    -> validated span mutation
    -> canonical composition

RUNTIME
canonical composition
    -> projection
    -> current WindowGeometry
    -> physical rendering
```

Therefore:

- `WindowGeometry != composition grid` remains authoritative;
- runtime physical resize MUST NOT silently mutate the canonical composition revision;
- authoring resize MUST NOT smuggle arbitrary pixel geometry into the composition model;
- a deliberate editor command that changes spans is a composition mutation and follows draft/validate/apply semantics.

Typography is not required to scale linearly with window geometry. Typography remains governed by legibility/tokens and bounded adaptations.

## 4. Constrained adaptation

When a composition can no longer preserve usable structure at a smaller geometry, adaptation SHOULD occur through declared discrete composition states/constraints rather than arbitrary one-off pixel behavior where practical.

Examples include:

- sidebar expanded -> compact -> collapsed;
- toolbar group wrap/overflow according to its contract;
- content region consumes remaining spans;
- minimum viable window/composition size;
- fixed semantic rails where later evidence shows they are preferable to consuming ordinary grid rows.

Adaptation is a renderer/presentation decision constrained by declared component/composition contracts. It MUST NOT silently rewrite canonical authoring intent.

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

A compact/icon-only ButtonGroup variant describes presentation/internal arrangement; it does not replace the outer `columnSpan`/`rowSpan` contract.

## 6. Structure, order, composition depth and window z-order are separate

Do not conflate:

- **structure** — parent / child / named slot;
- **order** — sequence among siblings/container children;
- **composition depth** — front/back semantic layer inside a composition;
- **window z-order** — runtime stacking between Station windows, owned by `station-windowing`.

The human Layers view SHOULD present front-most/highest composition depth first because it answers "what is in front of what?". The Structure view SHOULD present parent-to-child containment.

Prefer semantic composition layers over arbitrary user-authored z-index values. Exact layer families are to be materialized separately.

A composition layer MUST NOT acquire authority over `WindowInstance.zOrder`, focus, activation or other runtime window-stacking semantics. Conversely, window z-order MUST NOT be serialized as component composition depth.

Where a component legitimately renders an overlay, dialog-like surface, popover or floating child, its layer relationship MUST be expressed through a declared semantic layer/slot contract rather than arbitrary z-index escape hatches.

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

No projection is privileged as a second source of truth. YAML/JSON is a human/machine-friendly representation of the same canonical model, not an independent configuration store.

Projection updates SHOULD carry revision identity/version information sufficient to detect stale edits and prevent one surface from overwriting a newer canonical revision without explicit reconciliation.

## 8. Structural verification invariants

Future verification SHOULD make structural correctness the primary oracle rather than relying on screenshots alone.

For every applicable region/component, automatically verify properties such as:

- coordinates and spans remain inside the logical parent/grid;
- parent and named slot exist;
- slot/component compatibility holds;
- sibling ordering is deterministic;
- prohibited overlaps do not occur;
- allowed overlays use compatible semantic layers;
- composition depth does not mutate runtime window z-order;
- references are resolvable;
- technical identity remains stable across moves/resizes when identity should be preserved;
- canonical state is not mutated by invalid/rejected drafts;
- runtime physical resize does not rewrite canonical span intent;
- every projection reports the same canonical revision or explicitly marked preview revision;
- stale projection edits cannot silently overwrite a newer canonical revision.

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

Tests SHOULD also prove stale-edit rejection/reconciliation when two projections begin from different revision identities.

## 10. Resize verification

Future browser/integration verification SHOULD include resize sweeps, not only fixed screenshots.

For representative windows/patterns, progressively resize across supported physical geometries and declared logical adaptation states while checking:

- toolbar/menu/header attachment remains correct;
- sidebar/content/footer topology remains correct;
- no prohibited overlap;
- no unexpected disappearance;
- no content escapes its container without a declared overflow behavior;
- compact groups remain internally valid;
- composition layers do not change accidentally;
- window z-order/focus does not change except through explicit window interaction;
- constraints/adaptation transitions occur only at declared states;
- runtime resize does not mutate canonical spans;
- typography remains usable according to its separate contract.

Authoring-resize tests are separate: they MUST verify snapping/resolution to legal spans, validation, draft semantics and rejection of illegal span changes.

The target defect class is structural distortion during interaction/resize, not minor aesthetic preference.

## 11. Property-based composition verification

Once contracts are sufficiently formal, verification SHOULD generate many valid and invalid composition graphs and mutations automatically.

Useful properties include:

```text
serialize(canonical) -> deserialize -> equivalent canonical
valid mutation -> valid canonical
invalid mutation -> rejection + previous canonical preserved
runtime resize projection -> topology/invariants preserved + canonical unchanged
authoring resize -> discrete valid span mutation or deterministic rejection
move/reorder -> identity/reference invariants preserved
projection A mutation -> canonical draft -> projection B/C/D equivalence
stale revision mutation -> rejection/reconciliation, never silent overwrite
```

Generated cases may cover add/remove/move/reorder/resize/layer/variant/undo/redo and legal/illegal slot combinations.

Property generation MUST remain bounded enough for CI. Larger combinatorial/fuzz suites may run in scheduled/heavy verification rather than every fast gate.

## 12. Test hierarchy and delta responsibility

Verification should remain layered:

- Grid Profile contracts test projection mathematics/constraints deeply;
- component contracts test component behavior deeply;
- composition/pattern tests prove the delta introduced by composition;
- boundary/integration tests prove communication between bounded subsystems, including Station/front-end adapters and Core-facing boundaries where authorized;
- contract tests verify payload/schema/version/error semantics without requiring every UI journey;
- E2E browser journeys prove selected real user flows;
- visual regression catches unintended appearance changes;
- human acceptance governs subjective aesthetics/intent.

Do not retest every primitive behavior on every instance. Instances primarily need composition/reference/configuration validation; critical actions and journeys receive their own behavioral verification.

Front/Core communication verification MUST respect authority boundaries: Station tests may prove that presentation-side requests/adapters emit and consume the authorized contract correctly, but Station composition tests MUST NOT invent Core/business truth or bypass the established StationApplication/station-sdk boundary.

## 13. Constrained personalization

Initial Station authoring SHOULD favor constrained composition over arbitrary design freedom. Visual customization should primarily occur through approved tokens, variants, patterns, span allocation and bounded options. Structural invariants remain locked.

This reduces invalid state space, improves harmony across generated systems, and makes verification reusable.

Aesthetic freedom MAY expand later through additional approved tokens/variants/profiles without weakening structural contracts. New freedom should enlarge the declarative grammar deliberately rather than introduce arbitrary escape hatches.

## 14. Compatibility and authority rules

These directives refine, rather than replace, the existing Station composition architecture.

The following earlier invariants remain authoritative unless a later explicit ADR changes them:

- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-only unless a separately authorized boundary says otherwise;
- shared `EditorShell` / `CompositionEditorEngine` mechanisms are reused rather than forked;
- named slots and discrete span rules remain authoritative;
- invalid references/mutations fail deterministically without silent repair;
- no arbitrary HTML/CSS or arbitrary canonical pixel geometry;
- runtime window lifecycle/focus/z-order remains owned by `station-windowing`;
- Core/business authority remains outside Station composition.

If an implementation appears to require violating one of these invariants, it MUST be treated as an architecture/materialization question rather than silently implemented as a local exception.

## 15. Materialization obligations

Before implementation, planning must elaborate at least:

1. candidate Grid Profile(s), profile identity/versioning and empirical rationale;
2. canonical span/grid schema;
3. explicit authoring-resize contract;
4. runtime projection/resize rules and constraints;
5. semantic composition-layer contract and its hard boundary from window z-order;
6. compact internal composition contract (`ButtonGroup` or equivalent), including presentation variant versus geometry semantics;
7. canonical <-> declarative serialization contract;
8. canonical revision identity/stale-edit behavior across projections;
9. draft/preview/apply/discard behavior for declarative editing;
10. universal structural validator invariants;
11. resize-sweep verification strategy for runtime and authoring resize;
12. projection-equivalence tests;
13. property-based generation strategy and bounded CI cadence;
14. boundary/contract verification strategy for future Station <-> Core communication without authority leakage;
15. evidence/reporting integration with existing Station test infrastructure.

These items should be decomposed dependency-safely into future materialized work rather than smuggled into an unrelated active TASK.
