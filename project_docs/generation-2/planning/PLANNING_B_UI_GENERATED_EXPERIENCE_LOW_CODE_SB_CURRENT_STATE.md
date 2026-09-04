# Generation 2 — Planning B: UI / Generated Experience / Low-code Builder — SB Current State Reconciliation

Status: COMPLETE_FOR_CAPABILITY — CURRENT_STATE_RECONCILED / PASS_FOR_CAPABILITY
Capability: UI / Generated Experience / Low-code Builder
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Authority inputs: fresh `main`, `PLANNING_A_UI_GENERATED_EXPERIENCE_LOW_CODE_BOUNDARIES.md`, accepted repository architecture/contracts.

This document is repository archaeology only. It does not alter product code, invent target architecture, materialize WBS/TASKs, execute Construction, or enter Planning C.

## 1. Current experience-definition baseline

Current SB already exposes declarative view semantics through the compiler/runtime projection. `CompilerRuntimeViewDeclaration` has an explicit view identity, one of the bounded kinds `list | detail | form | dashboard | timeline | kanban | calendar | custom`, and an optional binding to a canonical entity reference plus explicit field/action references. Compiler normalization validates duplicate/unknown view, entity, field and action references and sorts normalized output deterministically.

Disposition: **KEEP + HARDEN**.

This is a useful provider-neutral predecessor for experience definitions, but the inspected contract is intentionally flat. It does not evidence revisioned component composition, layout constraints, component semantic contracts, responsive variants, accessibility obligations, template/generator lineage or experience-specific compatibility predicates.

## 2. Generated view bindings

`packages/runtime-core/generated-view-bindings.ts` materializes deterministic runtime view bindings from explicit entity, field and action references. It rejects ambiguous entities/actions/views/field references, rejects unknown semantic references, sorts explicit refs and emits immutable `RuntimeGeneratedViewBindings`.

Disposition: **KEEP + HARDEN**.

This strongly supports semantic bindings rather than opaque renderer/provider IDs. However, field identity is currently represented by entity-local field names and action identity by model action IDs; no inspected evidence establishes independent revision-aware binding contracts, compatibility qualification, external-provider mapping qualification, or `PARTIAL/INCONCLUSIVE` binding status.

## 3. Renderer-neutral generated document

`packages/runtime-core/generated-view-document.ts` materializes a `RuntimeGeneratedViewDocument` containing `viewRef`, `viewKind`, `entityRef`, immutable field render records and action references. The output is a renderer-agnostic document rather than DOM, React component tree, CSS artifact or provider-native page object. Unsupported/unknown/unbound views fail explicitly.

Disposition: **KEEP + HARDEN**.

This is a strong current predecessor for provider-neutral experience realization. It does not yet evidence a revisioned component registry, composition tree, semantic component purpose, accepted inputs/emitted intents, accessibility metadata, responsive semantics, framework support qualification or renderer substitution evidence.

## 4. Data binding boundary

Generated bindings resolve only declared entity fields and preserve field type/required metadata into render records. Unknown or duplicate fields are rejected; missing runtime record values become `null` rather than mutating schema or inventing fields.

Disposition: **KEEP**.

The inspected UI path therefore does not evidence visual composition silently creating canonical schema meaning. The remaining Planning-A gap is richer revision/compatibility metadata for data bindings and explicit qualification when realization maps through an external/provider schema or partial support boundary.

## 5. Action binding and authorization boundary

`authorizeRuntimeGeneratedInteraction` first requires the requested action to be explicitly bound to the generated view, then routes the interaction through the shared fail-closed runtime authority gate. Authority resolution and permission evaluation are separate from visual rendering; denied/unresolved authority produces an explicit non-success result with evidence.

Disposition: **KEEP**.

This is strong evidence that current generated UI does not treat button visibility or a rendered action as canonical authorization. It also preserves a clean boundary between interaction intent and authoritative permission evaluation.

Gap: the current path proves admission to a representative action interaction, not a generic UI-owned effect lifecycle. Planning A's `attempted -> accepted -> applied/effective -> converged -> validated` and `UNKNOWN -> reconcile-before-retry` semantics remain cross-owner obligations and are not evidenced as generic experience contracts here.

## 6. Component registry and constrained low-code composition

No inspected current-main evidence establishes a revisioned semantic component registry with component purpose, accepted inputs, emitted intents, accessibility obligations, composition constraints, supported variants and realization requirements. The current view model exposes view kind plus entity/field/action binding, not a low-code component graph.

Disposition: **GENERALIZE later only if Planning C preserves a reusable semantic contract; do not infer implementation now**.

Current-state gap: component composition constraints and validation beyond the flat view binding are **NOT EVIDENCED**.

## 7. Accessibility and responsive behavior

Repository search and inspected current-main UI/runtime contracts did not evidence first-class accessibility or responsive semantics. The generated view types and documents contain no inspected fields for semantic labels, focus/navigation order, alternative interaction modes, breakpoints/form-factor profiles, responsive information hierarchy or realization qualification.

Disposition: **HARDEN / INTEGRATE later**, subject to target-architecture decisions.

This is a direct Planning-A gap. Absence of evidence here must not be reinterpreted as proof that downstream application code could never implement accessibility; it means the canonical/current SB contracts inspected in Planning B do not represent or qualify those semantics.

## 8. Generated-experience lineage and versioning

Current generated binding/document outputs preserve immediate semantic references (`viewRef`, `entityRef`, field/action refs) but do not carry an inspected experience revision, source semantic revision vector, generator/template revision, component-contract revision, provider/render profile revision, correction/supersession lineage or effective-client convergence status.

Disposition: **HARDEN + INTEGRATE** with Lifecycle/UCA/Artifact/Deployment in later phases without transferring UI ownership.

Current-state gap: regeneration/version coexistence, stale client/cache/session qualification and experience rollback eligibility are **NOT EVIDENCED AS GENERIC CONTRACTS**.

## 9. Provider/runtime coupling and portability

The generated document/binding contracts are renderer-agnostic and do not encode React/Next.js/DOM/provider page identities. This is a strong portability predecessor. View kinds and semantic refs survive independently of any concrete rendering framework in the inspected contracts.

Disposition: **KEEP + PROVIDERIZE only at realization boundaries**.

Gap: no inspected UI contract exposes an explicit `CapabilitySupportVector` or qualification for a renderer/provider's support of component semantics, accessibility, responsive behavior, offline/local behavior or extension points. Provider substitution therefore has a good neutral base but incomplete explicit qualification.

## 10. Relationship to AGWS

Current flat views and generated bindings are generic UI primitives. They do not evidence `Enterprise -> Station -> Role -> Person` effective-surface overlays, Station capability exposure/delegated surface administration, mandatory inherited components, governed personalization, promotion, diff/reset/rollback or AGWS-specific AI escalation.

Disposition: **KEEP generic UI separate from AGWS**.

No current-main evidence inspected in this pass justifies absorbing AGWS into generic UI. Generic UI may remain a rendering/projection substrate; governed effective-surface ownership remains outside this capability.

## 11. AI / low-code authority boundary

No inspected current-main evidence establishes a generic AI/low-code proposal contract for experience revisions carrying base revision, authority envelope, immutable provenance, promotion state or escalation semantics.

Disposition: **DEFER target mechanism to Planning C; preserve non-amplification now**.

The existing authorization-gated generated interaction is a useful safety predecessor but is not evidence that AI-generated layouts/components can safely mutate canonical UI/process/schema semantics.

## 12. Planning-A validation answers

1. **Current experience definitions:** explicit compiler/runtime view declarations with bounded view kinds and entity/field/action bindings are evidenced.
2. **Canonical identity vs framework/provider IDs:** inspected contracts use logical `viewRef`/entity/action/field refs and do not encode DOM/framework/provider page IDs.
3. **UI mutating process/schema truth:** no inspected generated-view path does so; bindings validate against supplied model semantics.
4. **Accessibility/responsive contracts:** not evidenced in the inspected canonical/runtime UI contracts.
5. **Data/action bindings:** explicit and deterministic, but not yet revision/support-vector qualified.
6. **Visual state as authorization:** current generated action path is separately authority-gated; visual rendering alone is not enforcement in the inspected implementation.
7. **AGWS separation:** AGWS hierarchy/effective overlays are not implemented by these generic view contracts.
8. **AI/low-code governance:** generic proposal/promotion authority contracts are not evidenced.
9. **Provider support differences:** renderer-neutral base exists, but explicit provider support qualification is not evidenced here.
10. **Generated revision/convergence/rollback:** not evidenced as first-class generic experience lifecycle contracts.

## 13. Maturity assessment

- Declarative provider-neutral view identity/kinds: **IMPLEMENTED BASELINE**.
- Deterministic entity/field/action binding: **STRONG IMPLEMENTED PREDECESSOR**.
- Renderer-agnostic generated document: **STRONG IMPLEMENTED PREDECESSOR**.
- Authorization separated from presentation: **STRONG IMPLEMENTED PREDECESSOR**.
- Semantic component registry/constrained composition: **NOT EVIDENCED**.
- Accessibility/responsive semantics: **NOT EVIDENCED IN CANONICAL CONTRACTS**.
- Experience revision/generator/component lineage: **NOT EVIDENCED**.
- Provider support qualification/portability vector: **PARTIAL — NEUTRAL BASE, QUALIFICATION ABSENT**.
- Client/cache/session convergence and rollback eligibility: **NOT EVIDENCED**.
- AI/low-code governed proposal/promotion: **NOT EVIDENCED**.
- AGWS governed effective surfaces: **OUTSIDE GENERIC UI; NOT EVIDENCED HERE**.

## 14. Reconciliation disposition

**KEEP** the declarative view model, bounded view kinds, explicit semantic entity/field/action references, deterministic normalization/materialization, renderer-neutral generated documents and separate fail-closed authorization path.

**HARDEN** experience identity/revision semantics, binding compatibility/currentness, component contracts, accessibility/responsive obligations, generated lineage and effective-realization qualification.

**GENERALIZE** component/composition and experience-lineage primitives only if Planning C proves reusable semantics without turning UCA or UI into a god-object.

**PROVIDERIZE** concrete renderer/framework/design-system realizations while keeping canonical experience identity provider-neutral.

**INTEGRATE** later with UCA qualified claims/revisions, Provider/Binding support qualification, Lifecycle coexistence/rollback and Deployment effective-convergence evidence.

No evidence supports `REPLACE` of the current generated-view baseline.

## 15. Result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB has a solid provider-neutral generated-view baseline: bounded declarative view kinds, deterministic semantic bindings, renderer-agnostic documents and authority-gated generated interactions. Generation 2 gaps are chiefly semantic component/composition contracts, accessibility/responsive qualification, revision/lineage/currentness, provider support vectors, effective-client convergence/rollback and governed AI/low-code proposal semantics. AGWS remains a distinct capability and is not absorbed into generic UI.

No product code, Work Package, executive TASK, Construction, PR or worker handoff was executed.
