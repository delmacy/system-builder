# Contract Addendum 001 — Station Component Grammar & Catalog

Date: 2026-09-26
Status: ACCEPTED SCOPE — MATERIALIZATION
Provenance: explicit post-M2 continuation authorized after M2 Component Editor closure.

## WHAT

Admit the next Station-local phase after M2 to research, normalize and materialize the reusable component grammar that scales from primitives to specialized tools/studios without turning Station into Core authority.

The phase identifier is **Station S3** (not repository/global `M3`) to avoid collision with the historical System Builder milestone named M3.

The target hierarchy to investigate and converge is:

`Token -> Primitive -> Compound -> Collection -> Capability -> Pane/Region -> Pattern -> Template/View -> Tool -> Application -> Studio`.

The exact taxonomy may be refined by evidence, but changes must preserve a small stable primitive base and explicit composition boundaries.

## WHY

M2 proved the shared composition/editor mechanics and Component Editor specialization. The next risk is uncontrolled component proliferation, semantic duplication, incompatible compositions and premature specialized studios. A catalog/grammar phase establishes reuse, compatibility, bounded customization and testability before broader application construction.

## DIRECTIVES

1. Research micro-to-macro componentization before broad product construction.
2. Census primitives already owned by System Builder and complementary primitives available from established UI libraries; prefer source-owned/provider-independent contracts.
3. Separate identity, placement, presentation and action semantics. A semantic action such as `cancel` is not itself a primitive Button visual variant.
4. Prefer constrained variants/patterns over arbitrary HTML/CSS or infinite customization.
5. Composition remains discrete/span-based and responsive at execution; WindowGeometry remains distinct from composition grid.
6. Establish semantic patterns such as action groups above generic primitives rather than multiplying domain-specific primitive components.
7. Treat Layers/Structure, Inspector, declarative YAML/JSON and rendered preview as projections/editors of the same canonical composition truth, not competing authorities.
8. Extend tests across primitive contracts, composition invariants, semantic patterns, browser journeys, visual/structural regression and Station/Core integration boundaries where applicable.
9. Before any deeper Station/Core coupling, perform a Core Contract Reuse & Station Projection Census. Reuse existing Core contracts where suitable and create Station projections/adapters rather than duplicating authority.
10. Research and classify complexity from reusable controls through tool families, applications and specialized studios. Do not jump directly to Studio construction.

## BOUNDARIES

- `ComponentRegistry != AppManifest`.
- `WindowGeometry != composition grid`.
- Station remains presentation/composition-oriented and does not acquire business/Core authority.
- No silent Core contract changes.
- No arbitrary remote persistence/publish/deploy/provider runtime admission through this addendum.
- Research is evidence, not authority, until promoted through normal contract/ADR/plan/task materialization.

## TRACEABILITY

Predecessor: M2 Station Component Composition/Editor, closed in `docs/current/NEXT_WORK.md` at main closure merge #952.

Execution pointer after materialization: `docs/current/NEXT_WORK.md`.

Planning artifact: `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`.
