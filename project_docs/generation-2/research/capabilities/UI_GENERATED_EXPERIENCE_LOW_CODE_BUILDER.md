# Generation 2 — UI / Generated Experience / Low-code Builder

Status: FIRST_DEEP_PASS / NOT_SATURATED

## Research question

Which UI-builder primitives are reusable for System Builder without making the visual editor, a proprietary widget framework, or generated implementation the semantic source of truth? The focus is the boundary between semantic intent, presentation metadata, component/design-system governance, state/actions, extensibility, generated code and runtime portability.

## Representatives

1. **Mendix / Atlas UI** — mature model-driven page structure plus reusable design system and module-level theme governance.
2. **OutSystems UI / Style Guides** — mature responsive pattern library, theme/template reuse and company-level style-guide composition.
3. **Retool** — developer-oriented internal-app builder; useful contrast where UI composition, resources, queries and governance live primarily inside a hosted application platform.
4. **Appsmith** — open-source internal-app builder combining drag/drop widgets, datasource bindings, queries, JavaScript and Git-backed collaboration/self-hosting.
5. **FlutterFlow** — especially valuable because visual pages/components produce inspectable Flutter/Dart code, while custom widgets/actions and external packages provide an escape hatch.

## Evidence ledger

| Representative | Evidence | Main claim |
|---|---|---|
| Mendix | https://docs.mendix.com/howto/front-end/atlas-ui/ | Atlas is a customizable/extendable design system; module-level theme settings can govern which elements developers may use. |
| Mendix | https://docs.mendix.com/refguide/page-explorer/ | A page has an inspectable structural tree independent from the visual design view. |
| OutSystems | https://www.outsystems.com/forge/component-overview/1385/outsystems-ui-o11 | OutSystems UI provides a reusable responsive pattern/design-system layer. |
| OutSystems | https://www.outsystems.com/forge/component-documentation/16952/odc-live-style-guide-odc/0 | Theme library, custom pattern library, preview and app template are separable/reusable assets. |
| Retool | https://docs.retool.com/ | App builder is one capability among apps, workflows, resources, permissions and self-hosting/governance. |
| Appsmith | https://docs.appsmith.com/ | UI widgets bind to datasources/APIs; business logic is expressed through queries and JavaScript; Git and self-hosting are supported. |
| FlutterFlow | https://docs.flutterflow.io/flutterflow-ui/canvas/ | Visual canvas operates over an explicit widget composition. |
| FlutterFlow | https://docs.flutterflow.io/generated-code/page-model/ | Pages generate separate Widget and Model classes. |
| FlutterFlow | https://docs.flutterflow.io/generated-code/component-model/ | Components generate reusable widget/model pairs with isolated state/lifecycle. |
| FlutterFlow | https://docs.flutterflow.io/concepts/custom-code/custom-widgets/ | Custom widgets support explicit inputs/callbacks and third-party packages. |
| FlutterFlow | https://docs.flutterflow.io/generated-code/project-structure/ | Exported project separates generated utilities, app state, custom code and application entry point. |

## Extracted primitives

### Source of truth
A visual canvas should be a projection/editor over explicit page/component/presentation artifacts, not the only source of semantic truth. Mendix exposes both structure and design views. FlutterFlow retains a widget tree and generates code. OutSystems separates reusable themes/patterns/templates. Appsmith and Retool demonstrate that builder state can become platform-coupled when the hosted builder is the dominant authority.

### Identity
Pages, components, widgets, themes, reusable patterns and actions need stable identities independent of canvas position, label or generated class/file names. References should survive layout changes and regeneration.

### Lifecycle
A useful lifecycle is `definition -> validate/preview -> publish/generate -> deploy/runtime -> observe -> evolve`. Design-system assets and reusable components have their own version/update lifecycle and should not be silently conflated with application publication.

### Versioning
At least four independent dimensions recur: semantic/page definition version, presentation/design-system version, component/plugin version and generated/runtime implementation version.

### Failure semantics
Builder failures should distinguish invalid semantic binding, invalid presentation/layout, unavailable component/provider, custom-code compile error, generated-code failure and runtime interaction failure. A visual preview succeeding is not proof that the semantic contract or generated runtime is valid.

### Extensibility
The strongest pattern is a bounded escape hatch: standard components first; reusable components/patterns second; custom code/widget third; third-party package/provider last. Custom extensions need typed inputs/outputs/callbacks and dependency/version metadata.

### Provider boundaries
UI rendering technology should be replaceable where feasible. Semantic intent and data/action bindings should not be owned by React/Flutter/a vendor widget runtime. Renderer-specific metadata belongs behind a renderer/binding boundary.

### Governance
Design systems are governance artifacts, not only styling. Mendix module-level theme settings and OutSystems style-guide/pattern libraries show that an organization can constrain approved UI primitives while preserving extension points.

### Observability
Preview/design mode is authoring evidence, not runtime evidence. Generated experiences need traceability from semantic element -> page/component -> renderer/generated artifact -> runtime interaction/error.

### Portability and lock-in
FlutterFlow provides the strongest portability contrast because generated Flutter/Dart is inspectable/exportable, though generated framework utilities remain a coupling. Appsmith improves operational portability via open source/self-hosting, but application semantics still depend on Appsmith widgets/queries/runtime. Retool is intentionally more platform-centric. Mendix and OutSystems provide rich reusable UI governance but stronger proprietary runtime/model coupling.

## Product-specific mechanisms not to copy automatically

- Mendix Atlas class/design-property mechanics.
- OutSystems UI pattern catalog, proprietary theme/library/template packaging.
- Retool component/resource/query object model as SB ontology.
- Appsmith widget and JavaScript-expression runtime as canonical business semantics.
- FlutterFlow `FlutterFlowModel`, generated utility classes or Flutter widget tree as SB semantic IR.

Their reusable value is the separation of layers and explicit extension/governance contracts, not their concrete object models.

## Recurring patterns

1. **Structure view and visual view are distinct projections of one composition.**
2. **Design system is separately reusable/versioned from page instances.**
3. **Component reuse needs explicit interfaces, not copy/paste.**
4. **State/actions/data bindings are separate from visual styling.**
5. **Custom-code escape hatches are bounded extension points.**
6. **Preview is not publication and publication is not runtime proof.**
7. **Generated implementation should be traceable back to model identity.**
8. **Portability improves when generated output is inspectable and runtime assumptions are explicit.**

## System Builder comparison

Fresh `main` already states that Canvas / Visual Builder must provide visual authoring without making UI the source of truth. Its WBS explicitly requires mapping formal concepts to visual elements, separating semantic model from layout/presentation metadata, deterministic rendering, schema-aware editing, validation before persistence/publication and lossless round-trip to the canonical contract. This is strongly aligned with the external evidence and should be preserved rather than replaced by a vendor-style canvas ontology.

Current evidence is insufficient to claim that the full generated end-user experience layer already has renderer/provider abstractions, a design-system contract, stable UI artifact identity or runtime traceability. Those remain repository-validation questions for Planning B.

## Reconciliation hypotheses

- **KEEP/HARDEN** — Canvas rule that UI is not source of truth.
- **KEEP/HARDEN** — semantic model vs layout/presentation metadata separation and lossless round-trip.
- **GENERALIZE** — stable Page/Component/Presentation artifact identity and lineage.
- **GENERALIZE** — Design System / Theme / Component interfaces as governed reusable contracts.
- **PROVIDERIZE** — renderer/runtime-specific implementation where multiple renderers are justified.
- **INTEGRATE** — bounded external component/package ecosystem rather than cloning large widget ecosystems.
- **DEFER** — multi-renderer abstraction until repository truth and product proof show replacement value.
- **DO_NOT_BUILD** — proprietary clone of a full vendor widget marketplace solely for feature parity.

## Repository-validation questions

1. What is the canonical contract for generated end-user pages/forms/views today?
2. Is UI identity stable across regeneration or inferred from filenames/layout positions?
3. Are presentation metadata and semantic bindings separately versioned?
4. Is there an explicit design-system/theme contract or only implementation styling?
5. Are component inputs/outputs/actions typed and referenceable independently of renderer implementation?
6. Can a generated page be traced back to the SystemDefinition/Recipe/semantic element that caused it?
7. Can a renderer/provider be replaced without rewriting domain/process semantics?
8. Which UI behaviors currently require Builder presence at runtime, if any?
9. Are accessibility, responsive behavior and localization represented as governed requirements or ad-hoc implementation concerns?
10. Does round-trip currently cover only the authoring Canvas or also generated end-user experience artifacts?

## Symbiotic Proof candidate

A strong future proof would define one semantic slice (entity + action + authorization-aware interaction), render it through the native generated-experience path, then through one external/alternative renderer or component provider without altering the semantic source. Prove: stable semantic identity; equivalent required behavior; design-system policy enforcement; typed component/action binding; regeneration determinism; renderer replacement; artifact/runtime provenance; accessibility/responsive requirements where declared; and autonomous runtime without consulting Builder authoring state.

## Findings

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

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-DESIGN-SYSTEM-GOVERNANCE` — CROSS_CUTTING. Evidence: Mendix + OutSystems + FlutterFlow. Promotion condition: recur in Governance and Developer/Operator Experience and show structural SB need.
- `G2-CAPABILITY-CANDIDATE-GENERATED-EXPERIENCE-LINEAGE` — CROSS_CUTTING. Evidence: FlutterFlow generated structure + SB deterministic/round-trip intent. Promotion condition: recur materially in Artifact/Provenance, Observability and Lifecycle.

`G2-CAPABILITY-CANDIDATE-MODEL-PUBLICATION-LIFECYCLE` receives additional supporting evidence from UI preview/template/publish/generate separation, but remains CANDIDATE pending Lifecycle/Deployment research.

## Value / risk / next question

**Value for SB:** very high. Generated experience is where semantic portability can easily be lost through renderer-specific assumptions.

**Adoption risk:** high if a visual/widget object model becomes canonical; medium if UI is maintained as projection + governed component/rendering contracts.

**Investigation priority:** critical.

**Next question on revisit:** Which mechanisms best preserve semantic identity and behavior through responsive/layout evolution, design-system upgrades and renderer replacement, especially OutSystems/Mendix upgrade semantics versus code-export approaches such as FlutterFlow?