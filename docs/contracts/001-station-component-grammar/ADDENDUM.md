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

A second risk is treating testing as a post-construction declaration that an element is "good". S3 instead couples the component grammar to a **proof grammar**: before an element is considered promoted/complete, its expected behavior, invariants, state transitions, compatibility obligations and appropriate evidence must be identifiable and, where executable, proven. Construction and proof evolve together.

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
11. **Component grammar and proof grammar are paired.** Every promoted grammar level must declare its proof obligations; a component/pattern/view/tool is not complete merely because it renders or because its implementation task is finished.
12. **Test analysis precedes closure, not follows it.** During planning/materialization identify what must be proven; during Construction add/revise the smallest appropriate tests alongside the behavior; use intermediate Test Review/Hardening to search for missing journeys, adversarial states and false positives; closure reviews coverage/evidence rather than inventing the first tests.
13. Prefer semantic/risk coverage over raw test-count or code-coverage targets. The QA analysis must be able to represent `proven`, `failed`, `not applicable`, and **`unproven/gap`** rather than turning absence of evidence into PASS.
14. Reuse inherited proofs. Primitive behavior proven at its owning layer should not be redundantly re-proven in every generated system; higher levels prove their additional composition, semantics, integration and journeys.
15. Human acceptance remains distinct from machine proof. Automated evidence proves conformance to specified expectations; human review may approve whether the expectation itself represents the intended product behavior.

## PROOF GRAMMAR

The S3 research/synthesis must define a proof profile for each promoted level of the component grammar. At minimum, consider:

- contract/unit proof for local invariants and deterministic state;
- schema/composition proof for parent/slot/variant/reference compatibility;
- component interaction proof for local user-visible state transitions;
- structural/layout proof for span/responsive invariants and non-deformation;
- accessibility/keyboard proof where interactive;
- integration/contract proof when a boundary is crossed;
- Playwright acceptance journeys for representative end-user behavior;
- visual evidence/regression when semantic assertions alone can miss structural breakage.

Not every element requires every test type. Test Analysis chooses the lowest-cost proof that actually establishes the obligation and records intentional omissions/gaps explicitly.

## QA LIFECYCLE

`contract/intent -> proof obligations -> Construction + executable proofs -> intermediate Test Review/Hardening -> adversarial/gap analysis -> evidence -> closure coverage review -> human acceptance where required`

The long-term QA capability may derive candidate proof obligations from System Definition, component graph, actions/states and inherited contracts, but generated tests never become product authority by themselves.

## BOUNDARIES

- `ComponentRegistry != AppManifest`.
- `WindowGeometry != composition grid`.
- Station remains presentation/composition-oriented and does not acquire business/Core authority.
- No silent Core contract changes.
- No arbitrary remote persistence/publish/deploy/provider runtime admission through this addendum.
- Research is evidence, not authority, until promoted through normal contract/ADR/plan/task materialization.
- QA/test definitions do not create product semantics that are absent from accepted contracts; they prove or expose gaps against those semantics.

## TRACEABILITY

Predecessor: M2 Station Component Composition/Editor, closed in `docs/current/NEXT_WORK.md` at main closure merge #952.

Execution pointer after materialization: `docs/current/NEXT_WORK.md`.

Planning artifact: `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`.
