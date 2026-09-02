# UI / Generated Experience / Low-code Builder — Revisit 2 (Cycle 3)

## Research question
How should Generation 2 represent and generate views/pages/forms/lists/grids as revisioned semantic projections over canonical models, while preserving safe action binding, responsive/accessibility semantics, provider portability and regeneration lineage — without absorbing the separate Adaptive Governed Work Surfaces authority model?

## Representatives and evidence ledger
1. **Mendix Pages / Layout Grid / Page Explorer / Maia for Pages — DEEP.** Pages are widget compositions; layouts deliberately constrain structure; Layout Grid uses rows/columns; Page Explorer exposes a semantic tree; Maia can add/configure supported widgets and is aware of the module domain model. Sources: docs.mendix.com/refguide/pages, /layout-grid, /page-explorer, /maia-for-pages (reviewed 2026-09-02).
2. **Microsoft Power Apps model-driven forms/views/components — DEEP.** Forms expose columns/components/tree structure and responsive preview; views project selected table columns/sort/filter; app composition selects existing forms/views/charts. Microsoft explicitly warns that hiding form elements is not security. Sources: learn.microsoft.com Power Apps form designer, model-driven app components, app designer, visibility guidance (reviewed 2026-09-02).
3. **ServiceNow UI Builder — DEEP.** Components bind through data resources; data resources can be inherited/local and source Glide/GraphQL/REST; page variants target audiences. Sources: servicenow.com UI Builder data resources and page variants (reviewed 2026-09-02).
4. **Salesforce Lightning App Builder / Dynamic Forms — DEEP.** Dynamic Forms composes field sections and existing fields into Lightning pages; support is constrained by object/platform capability. Source: Salesforce Trailhead Dynamic Forms (reviewed 2026-09-02).
5. **Mendix pluggable widget/marketplace model — PARTIAL for extensibility/security.** Widgets are installable UI elements and extension security includes CSP concerns. Source: Mendix Widgets documentation.

## Source of truth, identity and lifecycle
Canonical entity/schema/process definitions remain upstream sources of truth. A generated experience is a distinct projection artifact with its own stable identity and revision. Its semantic references point to canonical model revisions/capabilities rather than copying ownership. Materialized frontend/runtime output is a realization of that projection, not the projection identity itself.

Lifecycle should distinguish `ProjectionDefinition -> ProjectionRevision -> MaterializationAttempt -> GeneratedRealization -> ValidationEvidence -> Promotion/Activation`. Regeneration after upstream model/component-contract change creates a new realization/revision relationship; it must not silently overwrite lineage.

## Versioning and freshness
A page may remain syntactically renderable while semantically stale because referenced fields/actions/component contracts changed. Therefore generated experience validity requires revision-bound dependency/freshness evidence. Version/diff must distinguish semantic projection changes from renderer/build changes. Reset/rollback targets an identified prior projection revision plus compatible realization, not an unversioned visual snapshot.

## Failure semantics
Failures are classified separately: invalid semantic reference; unavailable/unsupported component; binding resolution failure; authorization denial; provider/action failure; responsive/accessibility validation failure; renderer/materialization failure; stale dependency revision. Hiding or omitting a component is never authorization evidence. A failed action must not be represented as a rendering failure.

## Extensibility and provider boundaries
Component registries need semantic contracts: accepted data shape, emitted events/intents, required capabilities, accessibility/responsive metadata and renderer compatibility. External data/actions are referenced through semantic capability/action bindings; concrete provider selection remains Provider/Binding authority. Renderer/framework choice is a realization concern where possible, not part of domain semantics.

## Governance and observability
Generation/publish must retain actor/AI/materializer, source projection revision, canonical dependency revisions, component-contract revisions, binding references, renderer/toolchain revision and validation results. Runtime telemetry should identify projection + realization revisions so regressions can be attributed without conflating canonical model changes.

## Portability and lock-in
Portable core: semantic projection graph, component contract identity, canonical references, layout intent/constraints, action requirements, accessibility intent, dependency lineage. Product-specific: proprietary widget implementations, expression languages, custom HTML/web resources, renderer-specific styling and platform event APIs. Portability decreases sharply when arbitrary code becomes the semantic source of truth.

## Product-specific mechanism vs universal primitive
Universal primitives: `ProjectionDefinition`, `ProjectionRevision`, `SemanticComponentContract`, `CanonicalReference`, `ActionRequirement`, `LayoutConstraint`, `GeneratedRealization`, `ValidationEvidence`, `DependencyFreshnessEvidence`.
Product-specific mechanisms remain renderer/widget catalogs, proprietary layout engines, formulas/scripts and deployment formats.

## Convergent patterns
- Forms/lists/views are projections over existing model assets, not inherently new model authority.
- Component catalogs plus structural trees/grids make composition inspectable.
- Data/action binding is explicit and separable from visual placement.
- Generated/AI-assisted pages operate over known model/component context.
- Publish/activation is distinct from editing.

## Divergent patterns
- Power Apps permits HTML web resources and flexible custom pages; Mendix supports pluggable JavaScript widgets. These are extension escape hatches, not evidence that arbitrary frontend should be a Generation 2 primitive.
- ServiceNow audience variants overlap presentation targeting but do not establish the full Enterprise→Station→Role→Person monotonic authority model; that remains AGWS ownership.

## Subcapabilities
Semantic projection model; component contract registry; constrained layout intent; form/list/grid derivation; safe data/action binding; responsive semantics; accessibility semantics; renderer/materializer boundary; projection validation; revision/diff/regeneration; generated-realization provenance.

## Comparison with fresh main
A targeted default-branch search for `GeneratedExperience component view form grid UI` and `uiContract viewContract formContract generated experience` returned no matching code results in this run. This is only **no positive evidence from the targeted search**, not repository-wide evidence of absence. Detailed repository archaeology remains reserved for PLANNING_B.

## Reconciliation hypotheses
- **GENERALIZE:** generated experience as revisioned semantic projection distinct from canonical model and generated realization.
- **HARDEN:** component contracts with semantic data/action/accessibility/responsive metadata and dependency freshness evidence.
- **PROVIDERIZE:** external actions/data through provider-neutral requirements/bindings rather than page-to-provider coupling.
- **INTEGRATE:** projection compatibility with Process & Application Modeling revision evidence and Build/Artifact provenance.
- **DO_NOT_BUILD:** arbitrary HTML/CSS/frontend editing as the canonical authoring model for governed generated experience.
- **DEFER:** exact renderer/framework portability mechanism until repository archaeology and target architecture.

## Explicit boundary with Adaptive Governed Work Surfaces
Generic UI owns projection/component/materialization semantics. AGWS owns `Enterprise → Station → Role → Person`, Station capability exposure, mandatory/non-removable organizational components, monotonic overlays, personal/team/role promotion, bounded personal automation and AI authority escalation. UI can supply the projection substrate but must not redefine these governance semantics.

The nine AGWS proofs remain unchanged. This revisit strengthens proofs (1), (2), (5), (6), and (8) by requiring projection-only authority, semantic component/layout contracts, escalation before canonical change, provider-neutral action requirements and revisioned realization lineage.

## Repo-validation questions
- Which main contracts already distinguish canonical model, UI projection and generated artifact?
- Are form/list/grid definitions derivable without mutating schema?
- Do action-bearing UI elements reference semantic actions or concrete adapters?
- Is renderer/toolchain identity preserved in artifact provenance?
- Are accessibility/responsive checks represented as evidence or only implementation tests?
- Can regeneration preserve prior projection/realization lineage and diff?

## Symbiotic Proof
A portable definition with an existing `Customer` entity and `approveCredit` semantic action can generate a responsive list + form + action page without adding fields/tables. The projection records canonical references and layout constraints; the action resolves through a binding; changing renderer produces a new realization without changing projection identity; changing the canonical model invalidates/revalidates dependency freshness; hiding the action does not alter authorization; and an AI request for a new canonical field is escalated to domain authority rather than silently materialized.

## Stable findings
- **G2-FINDING-UIGX-17 — Generated Experience Is a Revisioned Projection, Not Canonical Model or Rendered Realization.** Identity and lifecycle must distinguish all three.
- **G2-FINDING-UIGX-18 — Form/List/Grid Derivation Must Be Possible Under Projection-Only Authority.** UI composition over existing fields/entities cannot imply schema mutation authority.
- **G2-FINDING-UIGX-19 — Semantic Component Contracts Must Declare Data, Intent, Accessibility and Responsive Expectations.** A visual widget name alone is insufficient for portable validation/materialization.
- **G2-FINDING-UIGX-20 — Generated Experience Validity Requires Revision-Bound Dependency Freshness Evidence.** Renderability does not prove semantic compatibility with current model/action/component revisions.
- **G2-FINDING-UIGX-21 — Action-Bearing UI Must Reference Semantic Requirements; Concrete Provider Selection Remains Outside UI.** This preserves provider replacement and prevents page/provider coupling.
- **G2-FINDING-UIGX-22 — Regeneration Must Preserve Projection-to-Realization Lineage and Distinguish Semantic Diff from Renderer Diff.** Regeneration is not destructive overwrite.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-SEMANTIC-COMPONENT-CONTRACT` — CROSS_CUTTING; promote if AGWS, notifications/documents and extension synthesis reuse the same contract shape.
- `G2-CAPABILITY-CANDIDATE-GENERATED-EXPERIENCE-DEPENDENCY-FRESHNESS-EVIDENCE` — CROSS_CUTTING; promote if lifecycle/build/conformance synthesis confirms shared revision-freshness semantics.
- `G2-CAPABILITY-CANDIDATE-PROJECTION-REALIZATION-REGENERATION-LINEAGE` — CROSS_CUTTING; promote if artifact/build/deployment evidence converges on the same lineage primitive.

## Value / risk / priority / next question
Value: high — generated experience is central to portable application generation. Risk: high if UI becomes a backdoor for schema/provider/authorization coupling. Priority: high. Next question for this capability: after later revisits, determine whether semantic component contracts can be renderer-neutral enough to support multiple generated runtimes without collapsing into a lowest-common-denominator widget vocabulary.

## Saturation
Material new findings: 6. `consecutive_no_material_finding = 0`. **NOT SATURATED**.