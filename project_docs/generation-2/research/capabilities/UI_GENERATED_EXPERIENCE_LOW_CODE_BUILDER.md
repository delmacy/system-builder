# Generation 2 — UI / Generated Experience / Low-code Builder

Status: REVISIT_CYCLE_2_PASS_1 / NOT_SATURATED

## Research question

Which UI-builder primitives are reusable for System Builder without making the visual editor, a proprietary widget framework, or generated implementation the semantic source of truth? The focus is the boundary between semantic intent, presentation metadata, component/design-system governance, state/actions, extensibility, generated code and runtime portability.

## First-pass representatives

Mendix / Atlas UI, OutSystems UI / Style Guides, Retool, Appsmith and FlutterFlow remain authoritative from the first deep pass.

## First-pass stable findings

- **G2-FINDING-UI-01 — Canvas Must Be a Projection, Not Authority.** Visual editing should round-trip to canonical semantics rather than own them.
- **G2-FINDING-UI-02 — Presentation Metadata Is a Separate Versioned Concern.** Layout/theme/responsiveness must not mutate domain/process meaning.
- **G2-FINDING-UI-03 — Design System Is Governance Infrastructure.** Approved tokens/components/patterns and extension policy are organizational controls, not merely CSS.
- **G2-FINDING-UI-04 — Component Contracts Need Stable Typed Interfaces.** Reusable components require identity, inputs, outputs/callbacks, dependencies and lifecycle.
- **G2-FINDING-UI-05 — State and Actions Are Not Styling.** Interaction state/action/data binding should remain separately modelable from presentation.
- **G2-FINDING-UI-06 — Custom Code Is a Bounded Escape Hatch.** Extensions should be explicit, typed, dependency-aware and observable rather than a hidden bypass.
- **G2-FINDING-UI-07 — Preview, Publication and Runtime Evidence Are Distinct.** Visual correctness in the builder does not establish executable/product correctness.
- **G2-FINDING-UI-08 — Generated Experience Needs Model-to-Runtime Lineage.** Every generated page/component should retain provenance to semantic source and generator/renderer version.
- **G2-FINDING-UI-09 — Inspectable Output Improves Exit Portability but Does Not Eliminate Coupling.** Generated code may still depend on generator utilities/framework conventions.
- **G2-FINDING-UI-10 — Renderer Choice Should Be Orthogonal to Business Semantics Where Economically Justified.** Renderer/provider abstraction is valuable only when replacement can be proven without contaminating the core model.

## Revisit cycle 2 — pass 1

### Revisit question

Which mechanisms best preserve semantic identity and behavior through design-system evolution, layout/responsive change and renderer replacement, and what evidence should prove that a generated experience still satisfies its semantic contract after those transitions?

### Representatives and evidence ledger

| Representative | Coverage | Evidence | Architectural contribution |
|---|---|---|---|
| Design Tokens Community Group 2025.10 | DEEP | https://www.designtokens.org/ | Standard exchange format treats design decisions as portable data shared across tools/codebases/platforms, supporting token identity/reference semantics independent of a concrete renderer. |
| Web Components / Custom Elements / Shadow DOM / Slots | DEEP | https://developer.mozilla.org/en-US/docs/Web/API/Web_components | Stable custom-element registration plus encapsulated implementation and explicit slots show interface/implementation separation at the UI component boundary. |
| JSON Forms | DEEP | https://jsonforms.io/docs/uischema/ ; https://jsonforms.io/docs/tutorial/custom-renderers/ | UI Schema is distinct from renderer implementation; renderer registry/testers select a renderer for a semantic UI element, demonstrating renderer binding/selection as a separate concern. |
| Storybook Portable Stories and component testing | DEEP | https://storybook.js.org/docs/9/api/portable-stories/portable-stories-vitest ; https://storybook.js.org/docs/writing-tests | A named component state can be rendered in external test environments and checked through render, interaction, accessibility, visual and snapshot evidence; proof dimensions are distinct. |
| Storybook visual testing | DEEP | https://storybook.js.org/docs/9/writing-tests/visual-testing | Visual baselines detect appearance drift but are only one proof class; they do not replace semantic/interaction/accessibility evidence. |

### Source of truth

The revisit strengthens the first-pass conclusion: semantic interaction intent must remain upstream of UI-schema/presentation choices and concrete renderer implementations. JSON Forms is especially useful because the UI schema and JSON schema are inputs to a renderer-selection mechanism; renderer-specific options exist but do not have to become the domain schema. Design Tokens similarly externalize reusable design decisions rather than requiring a specific framework component tree.

### Identity

At least six identities must not be collapsed: semantic interaction requirement, presentation/UI projection, design token, component contract, renderer offer/registration, and generated/runtime realization. A custom-element name or React/Vue class is an implementation-facing identity, not sufficient as the System Builder semantic identity.

### Lifecycle and versioning

A generated-experience evolution can independently change semantic requirement revision, UI projection revision, design-token/design-system revision, component-contract revision, renderer revision and generated artifact revision. The compatibility question is therefore multidimensional. A token/theme update can be semantically neutral yet visually breaking; a renderer upgrade can preserve appearance while changing accessibility or interaction semantics.

### Failure semantics

Distinct failures include unresolved token/reference, renderer-not-applicable/no eligible renderer, renderer ambiguity/priority conflict, component-interface incompatibility, visual regression, accessibility regression, interaction regression, generation failure and runtime interaction failure. A screenshot match cannot prove successful interaction or accessibility, and a successful render cannot prove semantic binding correctness.

### Extensibility and provider boundaries

Web Components demonstrate a useful bounded contract: the consumer interacts with an externally named element/interface while internals may be encapsulated. JSON Forms shows another pattern: a registry evaluates candidate renderers against semantic/UI input and selects an implementation. The universal primitive is not Web Components or JSON Forms themselves; it is an explicit renderer/component offer + compatibility/selection + binding + realization boundary.

### Governance

Design-system governance needs explicit ownership of token vocabulary, aliases/references, approved component contracts, allowed renderer/provider sets and exception policy. Renderer registration or custom code must not silently grant authority to reinterpret semantic actions or authorization constraints.

### Observability and proof

Storybook contributes an important proof pattern: named component states can become reusable test fixtures, but evidence dimensions remain separate. Generated-experience conformance should record which semantic requirement/projection/component/renderer revisions were exercised and which proof dimensions passed (render, interaction, accessibility, visual, possibly localization/responsive constraints).

### Portability and lock-in

DTCG token exchange and Web Components reduce particular forms of tool/framework coupling, while JSON Forms demonstrates multiple renderer sets across React/Angular/Vue. None automatically provides semantic portability. SB portability requires the semantic interaction contract, projection and renderer-binding decision to remain explicit and exportable, with implementation-specific options isolated behind a provider/rendering boundary.

### Product-specific vs universal

Do not copy DTCG as the entire SB presentation ontology, Web Components as the mandatory runtime component model, Storybook stories as canonical semantic definitions, or JSON Forms tester/ranking APIs as the universal negotiation protocol. Generalize only the recurring primitives: stable semantic/projection identity, design-decision references, component interface, renderer offer/selection/binding, state-scenario proof and revision-bound evidence.

### Convergent patterns

1. Design decisions can be portable data separate from final rendered code.
2. Component interface and internal implementation can evolve independently when the boundary is explicit.
3. Renderer selection can be a registry/binding decision over semantic/presentation inputs.
4. Renderer-specific configuration belongs behind the renderer boundary.
5. Named UI states are reusable proof fixtures, not semantic authority.
6. Visual, interaction and accessibility evidence are complementary, not interchangeable.
7. Compatibility after design-system/renderer change must be proven against the specific revision set exercised.

### Divergences

- Web Components standardize a browser component boundary, while JSON Forms is schema-driven renderer selection and Storybook is a development/proof harness; none should be mistaken for a universal SB runtime.
- Design tokens govern design decisions but do not define behavior, authorization or data/action semantics.
- Snapshot/visual baselines favor implementation fidelity; SB requires semantic-behavior equivalence when renderer replacement intentionally changes markup or appearance.

### Subcapabilities refined

- Semantic interaction projection.
- Presentation/layout metadata lifecycle.
- Design token and design-system reference lifecycle.
- Typed component contract lifecycle.
- Renderer offer/selection/binding lifecycle.
- Generated realization lineage.
- UI-state scenario catalog.
- Multi-dimensional generated-experience conformance evidence.
- Accessibility/localization/responsive requirements as governed constraints.

## System Builder comparison — fresh main evidence

Fresh `main` WBS for System Design explicitly places `views/forms e interação necessária` beside, but distinct from, roles/permissions, integrations and the versioned `SystemDefinition`. It also requires consistency/completeness before publication. This supports preserving UI as a projection of broader system semantics rather than elevating a renderer/widget tree to system truth (`project_docs/04-system-design/WBS.md`, WBS 4.2.1 and 4.3.2–4.3.3).

This revisit did not find repository evidence sufficient to claim that current `main` already has a universal renderer registry/negotiation contract, design-token reference lineage, renderer-binding evidence or state-scenario conformance model. Those remain Planning-B repository-validation questions; absence is not asserted as architectural truth beyond the files inspected.

## Reconciliation hypotheses

- **KEEP/HARDEN** — UI remains a projection and `SystemDefinition` remains the publication-level semantic authority.
- **GENERALIZE** — explicit identities/revisions for UI projection, component contract and generated realization.
- **GENERALIZE** — governed design token/design-system references with lineage rather than renderer-owned styling truth.
- **PROVIDERIZE** — renderer offers and renderer binding/selection where replacement has product value.
- **HARDEN** — renderer-specific options cannot reinterpret semantic action/authorization requirements.
- **INTEGRATE** — external component/design-system ecosystems through bounded contracts rather than cloning them.
- **DEFER** — universal multi-renderer support until product proof requires more than one concrete renderer family.
- **DO_NOT_BUILD** — a proprietary visual-test platform or browser component standard solely for feature parity.

## Repository-validation questions

1. What concrete objects currently represent generated views/forms and their stable IDs?
2. Are design tokens/themes explicit data/contracts or implicit CSS/framework configuration?
3. Is component selection deterministic and recorded as evidence, or embedded directly in generation templates?
4. Are renderer-specific options structurally separated from semantic requirements?
5. Can a component/renderer revision be upgraded independently and traced to affected generated artifacts?
6. Is there existing UI scenario/test metadata that can be tied back to semantic requirements?
7. Are accessibility, localization and responsive requirements represented before code generation?
8. Can generated UI conformance evidence distinguish render, visual, interaction and accessibility outcomes?
9. Can renderer replacement preserve semantic/action/authorization identity without modifying domain/process definitions?
10. What generated-experience state can operate autonomously after Builder removal?

## Symbiotic Proof

Use one semantic slice containing entity data, an authorized action, validation and declared accessibility/responsive requirements. Produce a canonical UI projection, bind it first to the native renderer and then to one alternate renderer/component provider without modifying semantic identity. Record design-system revision, renderer offer/selection, generated artifact lineage and named state scenarios. Prove independently: render success, interaction behavior, authorization preservation, accessibility constraints, declared responsive behavior and autonomous runtime. Renderer replacement succeeds only if semantic proof obligations remain satisfied; visual identity need only remain within explicitly governed design-system constraints rather than byte/screenshot equivalence.

## New stable findings

- **G2-FINDING-UI-11 — Renderer Selection Is a Governed Binding Decision.** A semantic/UI projection may admit multiple renderer offers; eligibility/priority/selection and the selected renderer revision must be explicit evidence rather than hidden generator logic.
- **G2-FINDING-UI-12 — Design Token Identity and Reference Lineage Are Independent of Renderer Output.** Portable design decisions need stable references/aliases and revision lineage without becoming business semantics.
- **G2-FINDING-UI-13 — Component Interface and Internal Rendering Implementation Are Distinct Evolution Boundaries.** A stable external component contract can permit implementation replacement, but only if interaction/accessibility obligations are re-proven.
- **G2-FINDING-UI-14 — UI State Scenarios Are Proof Fixtures, Not Semantic Authority.** Named rendered states can be reused across test environments, while their authority remains limited to evidence about a referenced semantic/projection revision.
- **G2-FINDING-UI-15 — Generated-Experience Conformance Is Multi-dimensional.** Render, visual, interaction, accessibility and declared responsive/localization outcomes are separate evidence classes and cannot substitute for one another.
- **G2-FINDING-UI-16 — Design-System or Renderer Upgrade Requires Compatibility Evidence Across the Exercised Revision Set.** A single package/version bump cannot establish compatibility across tokens, component contracts, projection semantics and runtime behavior.

## Capability candidates

Existing candidates remain active:
- `G2-CAPABILITY-CANDIDATE-DESIGN-SYSTEM-GOVERNANCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-GENERATED-EXPERIENCE-LINEAGE` — CROSS_CUTTING.

New this revisit:
- `G2-CAPABILITY-CANDIDATE-RENDERER-BINDING-DECISION-EVIDENCE` — CROSS_CUTTING. Promote if Provider/Binding and generated-experience planning need a reusable selection/binding evidence envelope.
- `G2-CAPABILITY-CANDIDATE-DESIGN-TOKEN-REFERENCE-LINEAGE` — DOMAIN. Promote only if repository archaeology shows design decisions need portable token/reference lifecycle beyond ordinary presentation metadata.
- `G2-CAPABILITY-CANDIDATE-GENERATED-EXPERIENCE-CONFORMANCE-CASE` — CROSS_CUTTING. Promote if named state/proof cases recur as a reusable acceptance primitive across UI, accessibility, release and observability.

No candidate is promoted by this revisit.

## Value / risk / priority / next question

**Value:** very high: renderer replacement and design-system evolution are likely portability boundaries.

**Risk:** high if renderer selection or token/component identities are hidden inside generator templates; moderate if isolated as explicit binding/evidence concerns.

**Priority:** critical for synthesis and Planning B.

**Revisit result:** MATERIAL_NEW_FINDINGS. Six new architectural findings were produced. `consecutive_no_material_finding = 0`; capability remains NOT_SATURATED.

**Next research question on a later revisit:** determine whether accessibility/localization/responsive semantics need a shared cross-cutting requirement vocabulary or remain capability-specific proof obligations; prefer representatives that expose versioned compatibility and migration behavior rather than additional visual-builder feature catalogs.