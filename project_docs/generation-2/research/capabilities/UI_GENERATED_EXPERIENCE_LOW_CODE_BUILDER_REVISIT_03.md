# UI / Generated Experience / Low-code Builder — Revisit 3 (Cycle 4)

## Research question
How should Generation 2 preserve semantic UI projection identity, compatibility and migration across canonical-model revisions, component-registry evolution and renderer/runtime replacement, while proving that technical render success is not equivalent to semantic validity and without absorbing Adaptive Governed Work Surfaces authority?

## Representatives and evidence ledger
1. **Microsoft Power Apps / Dataverse model-driven apps — DEEP.** Solution components expose dependencies; missing dependencies block import; solution layers preserve ordered changes and can merge model-driven app/form/site-map components while other component types use top-layer behavior. This demonstrates that a visually usable surface is realized from a dependency/layer graph rather than being a self-sufficient semantic artifact. Sources: Microsoft Learn component dependencies, missing solution dependencies, solution layers and merge behavior (reviewed 2026-09-02).
2. **Mendix pages + pluggable widgets + Software Composition — DEEP.** Pages compose standard/pluggable widgets; pluggable widgets expose configurable properties and execute against Mendix APIs. Software Composition tracks model/runtime/widget/npm/Java dependencies per deployment package through SBOM-oriented inventory. This makes renderer/component closure a first-class realization concern distinct from page/model semantics. Sources: Mendix Pluggable Widgets API and Software Composition (reviewed 2026-09-02).
3. **ServiceNow UI Builder — DEEP.** Pages consume local/inherited data resources sourcing Glide/GraphQL/REST and can have audience-targeted page variants at the same path. The page is therefore a semantic composition over explicit data-resource bindings and targeting context rather than a rendered DOM snapshot. Sources: ServiceNow UI Builder data resources and page variants (reviewed 2026-09-02).
4. **Salesforce Lightning App Builder / LWC metadata — DEEP.** Component metadata declares builder targets, supported objects and configurable properties; Dynamic Interactions expose event schemas through metadata. Dynamic Forms can migrate existing record-page details into field sections, but support depends on object/platform capabilities. Sources: Salesforce LWC App Builder configuration, Dynamic Interactions and Dynamic Forms migration guidance (reviewed 2026-09-02).
5. **Prior cycle evidence — DEEP.** Mendix constrained layouts/Page Explorer, Power Apps forms/views, ServiceNow variants and Salesforce Dynamic Forms established projection-only authority, component contracts, explicit action/data binding and projection-to-realization lineage. Revisit 3 stress-tests evolution/migration rather than repeating those findings.

## Source of truth, identity and lifecycle
The canonical domain/process model remains upstream authority. UI semantics are represented by a stable `ProjectionDefinition` with revisioned `ProjectionRevision`s. A renderer/build/runtime creates a `GeneratedRealization` from a particular projection revision plus component-registry/toolchain closure. These identities can coexist independently: an old projection revision can remain active while a new projection revision is validated, and multiple realizations of the same projection revision can exist for different renderer/toolchain profiles.

A projected page that still renders after an upstream model change is not automatically current. Compatibility is a relation between projection revision, canonical dependency revisions, component contracts, binding profile and target runtime/profile.

## Versioning, coexistence and migration
UI evolution requires at least three independently versioned dimensions: semantic projection revision; component-contract/registry revision; renderer/build/runtime realization revision. Updating any one dimension may require revalidation without necessarily changing the others.

When canonical model/process revisions invalidate references, projection evolution should be an explicit governed migration: `MigrationPlan -> Validation -> Approval when required -> MigrationAttempt -> Postcondition/CompatibilityEvidence`. A migration may remap renamed fields/actions, replace unsupported component contracts or declare a projection incompatible. Pointer reassignment or successful render alone is insufficient.

Power Apps solution dependencies/layers show why dependency-aware updates matter; Salesforce Dynamic Forms' migration/support constraints show that technical migration is conditional on target capability. Mendix Software Composition shows that realization closure itself has a versioned dependency surface.

## Failure semantics
Separate failure classes: canonical-reference incompatibility; component-contract incompatibility; unresolved dependency; data/action binding incompatibility; renderer/runtime unsupported capability; accessibility/responsive validation failure; authorization/policy denial; migration-plan rejection; migration attempt failure; post-migration semantic incompatibility; stale evidence.

A runtime can render a page while silently dropping, hiding or misbinding meaning. Therefore `RENDER_SUCCEEDED` is not `SEMANTICALLY_COMPATIBLE`.

## Extensibility and provider boundaries
Component registries should expose versioned semantic contracts and compatibility ranges/profiles. Proprietary widgets/LWCs/web resources remain realizations/extensions; portable projection semantics reference required capabilities and contracts. Renderer/provider replacement is valid only when the replacement satisfies the projection's semantic/component/binding profile and produces qualified validation evidence.

## Governance and observability
Every build/publish/migration should retain projection revision, canonical dependency revisions, component-contract versions, binding profile, renderer/toolchain/runtime revision, migration plan/attempt identity and validation evidence. Runtime telemetry should identify both projection and realization revisions so failures can be attributed to semantic migration, component evolution or renderer regression.

## Portability and local/offline interpretation closure
A portable UI definition can be interpreted locally only if the required semantic component contracts, schemas/references, layout vocabulary, validation rules and renderer/materializer dependencies are available under a qualified closure profile. This does not require owning external data/action providers; those remain bindings that may be unavailable or replaced. Local interpretation closure and runtime-provider closure are distinct.

## Product-specific mechanism vs universal primitive
Universal: `ProjectionDefinition`, `ProjectionRevision`, `SemanticComponentContract`, `ProjectionCompatibilityProfile`, `ProjectionMigrationPlan`, `ProjectionMigrationAttempt`, `GeneratedRealization`, `ValidationEvidence`, `QualifiedLocalClosure`.
Product-specific: Power Apps solution-layer mechanics, Mendix widget/runtime packaging, ServiceNow data-resource implementation, Salesforce LWC metadata syntax and renderer-specific styling/event APIs.

## Convergent patterns
- UI artifacts depend on explicit model/component/runtime resources rather than existing as autonomous rendered documents.
- Builder-visible component contracts/metadata constrain where/how components are valid.
- Update/migration behavior is conditional on dependency and target capability.
- Realization/deployment dependency inventories are separate from semantic page identity.
- Targeting/variants are context-dependent interpretations of a page, not proof of new canonical domain authority.

## Divergent patterns
- Power Apps solution layering is a platform-specific merge model, not a universal projection merge algorithm.
- Salesforce component metadata and Mendix widget APIs expose framework-specific extension capabilities; Generation 2 should preserve semantic contracts rather than standardize proprietary implementation APIs.
- ServiceNow page variants target audiences but do not establish AGWS's monotonic Enterprise → Station → Role → Person authority model.

## Subcapabilities
Projection revision coexistence; component-registry compatibility; renderer/profile realization; projection migration; semantic compatibility evidence; generated UI conformance; local interpretation closure; projection/runtime telemetry; renderer replacement proof.

## Comparison with System Builder
No new repository-absence claim is made in this revisit. Prior targeted search produced no positive evidence for equivalent contracts, but full current-state archaeology remains reserved for PLANNING_B. The findings here are external architectural evidence and reconciliation hypotheses only.

## Reconciliation hypotheses
- **GENERALIZE:** revision-bound projection/realization coexistence using the same identity discipline emerging from UCA and Process/Application Modeling.
- **HARDEN:** compatibility as projection + canonical revisions + component-contract versions + binding/runtime profile, with qualified evidence.
- **GENERALIZE:** explicit projection migration plan/attempt/evidence rather than silent regeneration after canonical changes.
- **PROVIDERIZE:** renderer/runtime and external action/data realizations behind semantic requirements/bindings.
- **INTEGRATE:** UI validation and lineage with Build/Artifact/Evidence planes and model migration evidence.
- **DO_NOT_BUILD:** treat successful rendering, hidden UI or generated code compilation as proof of semantic compatibility/authorization.
- **DEFER:** exact portable renderer vocabulary until target-architecture synthesis.

## Adaptive Governed Work Surfaces boundary
AGWS remains a distinct active capability. Generic UI owns projection/component/materialization/migration semantics. AGWS owns Enterprise → Station → Role → Person authority, constrained personalization, mandatory inherited components, Station capability exposure, promotion of personal patterns and AI-only materialization under authority escalation. UI migration must revalidate AGWS-effective context but cannot weaken superior-layer invariants.

## Repo-validation questions
- Does main already distinguish semantic UI projection revision from generated frontend artifact identity?
- Is there any reusable compatibility relation that can include canonical revision, component contract, binding and renderer profile?
- Are generated UI migrations/rebindings explicit artifacts or implicit regeneration?
- Can validation evidence be inconclusive when a provider/binding is unavailable?
- Can multiple realizations of one projection revision coexist for renderer/provider replacement proof?
- Can offline/local generation validate projection semantics without possessing external providers?

## Symbiotic Proof
Given a projection revision referencing `Customer.name` and semantic `approveCredit`, evolve the canonical model and component registry while keeping the old projection active. Produce a migration plan that remaps/validates references, generate a new realization with a replacement renderer, and prove: old/new projection coexistence; renderer replacement without semantic identity change; explicit incompatibility when a referenced semantic contract no longer exists; qualified validation tied to revisions/profile; no authorization inference from visibility; local interpretation with external provider bindings unresolved but preserved; and AGWS policy revalidation when effective Station/Role context changes.

## Stable findings
- **G2-FINDING-UIGX-23 — Projection Revision and Rendered Realization Must Coexist Without Identity Collapse.** One semantic projection revision may have multiple renderer/runtime realizations; old/new projection revisions may coexist during migration.
- **G2-FINDING-UIGX-24 — Projection Migration Is a Governed Plan/Attempt/Evidence Transition.** Canonical model/process evolution must not silently rewrite or repoint UI projections.
- **G2-FINDING-UIGX-25 — Technical Render Success Does Not Prove Semantic Compatibility.** Compatibility requires revision/profile-qualified evidence over canonical references, component contracts, bindings and target runtime capabilities.
- **G2-FINDING-UIGX-26 — Generated UI Validation Evidence Must Be Revision/Profile-Bound and May Be Inconclusive.** Missing external providers or target capabilities can leave validation unresolved rather than falsely pass/fail.
- **G2-FINDING-UIGX-27 — Qualified Local Closure Can Cover UI Interpretation Without Owning External Runtime Providers.** Semantic/component/layout validation may be autonomous while external action/data bindings remain replaceable/unavailable.
- **G2-FINDING-UIGX-28 — UI/AI Analysis and Candidate Generation Authority Is Distinct From Canonical Mutation or Migration Authority.** Generated experience tooling may propose remaps/components but cannot silently mutate canonical model/process semantics.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-PROJECTION-MIGRATION-PLAN-ATTEMPT-EVIDENCE` — CROSS_CUTTING / MERGE_TARGET; merge with semantic migration contract if workflow/data/runtime confirm shared lifecycle.
- `G2-CAPABILITY-CANDIDATE-SEMANTIC-RENDER-VALIDATION-QUALIFICATION` — CROSS_CUTTING / MERGE_TARGET; likely specialization of unified evidence qualification contract.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-UI-INTERPRETATION-CLOSURE` — CROSS_CUTTING / MERGE_TARGET; likely specialization of qualified local closure profile.

## Value / risk / priority / next question
Value: very high for Generation 2 because UI generation is a major realization surface and a likely portability boundary. Risk: severe if visual/render/build success is mistaken for semantic compatibility or if renderer migration becomes a backdoor for canonical mutation. Priority: high. Next question: test these shared migration/evidence/closure primitives against Adaptive Governed Work Surfaces and Workflow so synthesis can decide whether they are universal contracts or domain specializations.

## Saturation
Material new findings: 6. `consecutive_no_material_finding = 0`. **NOT SATURATED**.