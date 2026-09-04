# Generation 2 — Planning B: Adaptive Governed Work Surfaces — SB Current-State Reconciliation

Status: COMPLETE_FOR_CAPABILITY — PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Adaptive Governed Work Surfaces (AGWS)
Fresh-main evidence anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Planning A authority: `project_docs/generation-2/planning/PLANNING_A_ADAPTIVE_GOVERNED_WORK_SURFACES_BOUNDARIES.md`

This document performs repository archaeology only. It does not change product code, choose target modules, materialize WBS/TASKs, execute Construction, or enter Planning C.

## 1. Reconciliation question

What does the current authoritative System Builder actually implement that can serve as a predecessor to AGWS, and where does current product truth stop relative to the Planning A owner/boundary contract?

## 2. Fresh-main evidence inspected

Authoritative `main` was inspected at commit `d8760c7f08757bb164a758ae0c3f0a4a1752464b`.

Primary implementation/contracts/evidence:

- `packages/contracts/system-definition/system-definition.schema.json`
- `packages/compiler/authority-projection.ts`
- `packages/runtime-core/generated-view-bindings.ts`
- `packages/catalog/index.ts`
- `tests/product/system-definition-authority-generated-interaction.test.ts`
- product evidence around runtime generated-view bindings / authority-gated rendered interaction
- current architecture/WBS documentation identifying views/forms, permissions/policies and autonomous runtime generated experience.

## 3. Current SB truth

### 3.1 SystemDefinition already carries explicit generated-view intent — KEEP / HARDEN

`SystemDefinition` v1.0.0 contains a required `views` collection. Each view has canonical SB-local `id`, a bounded `kind`, traceability via `requirementRefs`, and optional explicit binding to `entityRef`, `fieldRefs` and `actionRefs`.

This is useful predecessor structure for semantic surface composition because view intent is declarative and references canonical model elements rather than embedding HTML/CSS or arbitrary code.

However, current `views` are flat declarations. They do not model governed-surface identity/revision lineage, hierarchy layers, overlays, layout contracts, mandatory inherited components, Station capability exposure, delegation envelopes, promotion, reset/rollback eligibility, or revalidation context.

Disposition: **KEEP** explicit typed references and traceability; **HARDEN/GENERALIZE** rather than reinterpret flat views as AGWS.

### 3.2 Compiler authority projection validates view/domain/action references — KEEP / GENERALIZE

`packages/compiler/authority-projection.ts` normalizes views, rejects unknown entity/field/action references, validates permission resources, validates structured policy references, and keeps policy data bounded rather than executable scripts.

This is directly aligned with AGWS non-amplification: a rendered/generated view cannot silently reference an unknown field/action and structured policy is data, not arbitrary code.

The current compiler has no Enterprise/Station/Role/Person surface-resolution algorithm, no delegated surface-administration envelope, no mandatory-component inheritance, and no Station capability-exposure semantics.

Disposition: **KEEP** reference validation and bounded policy representation; **GENERALIZE** the validation spine later so AGWS proposals are validated against hierarchy, layout and capability-exposure contracts as well as domain references.

### 3.3 Runtime generated-view bindings are renderer-agnostic and deterministic — KEEP / HARDEN

`packages/runtime-core/generated-view-bindings.ts` materializes deterministic bindings from explicit view/entity/field/action references, rejects ambiguous identities and unknown references, sorts references deterministically, and emits renderer-agnostic runtime binding data.

This is a strong realization predecessor for AGWS because the generated runtime already separates semantic binding from framework-specific DOM rendering.

But it materializes a single flat view definition. It does not resolve layered surfaces, inherited mandatory components, constrained slots/grids/templates, delegated personalization, Station/Role changes, or promotion lineage.

Disposition: **KEEP** the renderer-agnostic realization boundary; **HARDEN** it to consume an eventual resolved effective-surface contract rather than granting AGWS semantics to the current flat binding model.

### 3.4 Runtime generated experience and authority are neighboring capabilities, not AGWS itself — KEEP BOUNDARY

Current product evidence demonstrates generated list/detail/form interaction and authority-gated actions in autonomous runtime paths. That satisfies meaningful parts of generic generated experience and authorization integration.

It does not prove AGWS's semantic owner. A generated view that is permission-checked is not equivalent to a revisioned governed work surface with hierarchical overlay authority.

Disposition: **KEEP** the current generated-experience/authorization separation and preserve the Planning A boundary: UI/runtime rendering owns realization; Authorization owns actor authority; AGWS would own governed participation/composition under inherited constraints.

### 3.5 Catalog capability resolution is provider-aware but not Station exposure — INTEGRATE LATER

`packages/catalog/index.ts` provides capability/provider/version records, compatibility constraints, deterministic candidate resolution, and SystemDefinition capability resolution with lineage checks. It explicitly creates no new identity or execution authority.

This is useful predecessor evidence for provider/capability qualification, but it does not model `StationCapabilityExposure`, delegated administration, hierarchical SB exposure, or a Station-scoped admitted subset.

Disposition: **INTEGRATE** later through Provider/Binding and Authorization boundaries; **DO_NOT** equate catalog discoverability/resolution with Station exposure or AGWS authority.

## 4. Planning A contract-by-contract current-state matrix

| Planning A semantic contract | Current SB evidence | Maturity / disposition |
| --- | --- | --- |
| `GovernedSurfaceIdentity` | flat `views[].id` exists | PARTIAL — GENERALIZE; no independent governed-surface identity/revision |
| `SurfaceLayerRevision` | none evidenced | GAP — DEFER target design to Planning C |
| `EffectiveSurfaceResolution` | none evidenced | GAP — DEFER target design |
| `StationCapabilityExposure` | catalog capability resolution exists, but no Station exposure semantics | PARTIAL ADJACENT — INTEGRATE, do not conflate |
| `DelegatedSurfaceAdministrationEnvelope` | permissions/policies/role bindings exist; no surface-delegation envelope | PARTIAL ADJACENT — GENERALIZE/INTEGRATE |
| `MandatoryComponentConstraint` | none evidenced | GAP |
| `ConstrainedLayoutContract` | bounded view kinds exist; no slots/grid/template contract | PARTIAL — GENERALIZE |
| `SemanticComponentReference` | view → entity/fields/actions explicit refs | PARTIAL STRONG PREDECESSOR — KEEP/HARDEN |
| `SurfaceActionCapabilityReference` | action refs and catalog capabilities exist separately | PARTIAL — INTEGRATE through qualified binding |
| `SurfaceMaterializationProposal` | none evidenced | GAP |
| `SurfaceValidationDecision` | deterministic reference validation exists; no AGWS outcomes `VALID/DENIED/PARTIAL/INCONCLUSIVE/RECONCILE_REQUIRED` | PARTIAL — GENERALIZE |
| `SurfaceLineageAndDiff` | requirement traceability exists; no surface revision/diff lineage | GAP |
| `SurfaceResetRollbackEligibility` | none evidenced | GAP |
| `SurfacePromotionProposal` | none evidenced | GAP |
| `SurfaceUsageEvidenceReference` | none evidenced in AGWS semantics | GAP |

## 5. Nine mandatory AGWS proofs vs current SB

1. **Useful list/form/grid without schema mutation:** PARTIAL PASS predecessor. Current explicit generated views bind existing entity fields/actions and do not themselves create fields. No governed editor/materialization proof exists.
2. **Only permitted slots/grid/templates; no arbitrary frontend:** NOT PROVEN. Current model is renderer-agnostic and structured, but there is no constrained-layout contract.
3. **Mandatory superior component cannot be removed:** NOT IMPLEMENTED / NOT PROVEN.
4. **Revalidate personalization on Station/Role change:** NOT IMPLEMENTED / NOT PROVEN.
5. **AI domain-changing request escalates:** NOT IMPLEMENTED / NOT PROVEN; no AGWS AI materialization contract exists.
6. **External capability through binding without provider coupling:** PARTIAL architectural predecessor via catalog/integration abstractions; not proven at AGWS component/action level.
7. **Personal automation bounded by Station/Role authority:** NOT IMPLEMENTED / NOT PROVEN as AGWS semantics.
8. **Lineage/version/diff/reset/rollback:** NOT IMPLEMENTED / NOT PROVEN for personalization.
9. **Usage-evidence-driven governed promotion:** NOT IMPLEMENTED / NOT PROVEN.

No missing proof is treated as a failure of the current product: AGWS is Generation 2 scope and Planning B records the truthful predecessor/gap boundary.

## 6. Repository contradictions / non-contradictions

No repository evidence contradicts the Planning A requirement that AGWS remain distinct from generic UI/generated experience. Current code actually supports this separation: generated views are renderer-agnostic bindings and authority resolution is separate.

No evidence supports interpreting existing `role`, `organizationRef` or `membershipRef` constructs as the canonical `Enterprise → Station → Role → Person` AGWS hierarchy. Station is absent from the inspected semantic contracts. Therefore such a mapping would be invented and is prohibited.

No evidence supports treating catalog capability presence as delegated Station exposure. Catalog resolution explicitly resolves capability/provider candidates and creates no execution authority.

## 7. Evidenced architectural dispositions

- **KEEP**: declarative view IDs/kinds; explicit entity/field/action refs; requirement traceability; renderer-agnostic runtime binding; deterministic validation; bounded structured policy; separate authority gate; catalog capability resolution with explicit provider/version compatibility.
- **HARDEN**: current view/reference validation and generated-binding paths so later AGWS effective surfaces cannot bypass canonical refs or authority.
- **GENERALIZE**: flat views into a separate governed-surface semantic layer; validation into hierarchy/layout/exposure/currentness-aware decisions; role/organization adjacency into explicit delegated-surface contracts without changing Authorization ownership.
- **INTEGRATE**: AGWS with Authorization, Provider/Binding, Lifecycle, Observability and generated UI through explicit typed contracts.
- **PROVIDERIZE**: no AGWS providerization decision is justified yet; provider-specific page/workspace identity must remain non-canonical.
- **REPLACE**: no current subsystem is evidenced as requiring replacement.
- **DEFER**: concrete target contract/module topology, migrations, storage format and rollout belong to Planning C/D after all Planning B capabilities are reconciled.
- **DO_NOT_BUILD**: unrestricted HTML/CSS/DOM/script editor, implicit schema/domain mutation, catalog-discovery-as-authority, or direct provider IDs as canonical surface semantics.

## 8. Migration questions carried forward

1. Can `SystemDefinition.views` remain the generic generated-experience declaration while AGWS references or overlays it, avoiding a breaking reinterpretation?
2. Which existing identity/organization structures can safely supply Enterprise/Role/Person context, and where must Station be introduced as a distinct semantic identity?
3. Where should effective-surface resolution happen so published runtimes remain Builder-independent?
4. How can current generated-view bindings consume a resolved effective-surface artifact without creating Runtime → Builder coupling?
5. How should old flat views coexist with revisioned governed surfaces during migration?
6. How should provider-qualified capability/action references be represented without embedding provider identity into surface truth?
7. Which existing provenance/artifact/lifecycle mechanisms can be reused for surface revision lineage and rollback qualification?

These are Planning C/D inputs, not implementation decisions.

## 9. Capability reconciliation result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB has strong predecessors in declarative generated views, deterministic semantic bindings, authority-gated interaction and provider-aware capability resolution, but it does **not** currently implement AGWS as defined by Generation 2.

The correct Generation 2 direction is additive and boundary-preserving: keep/harden the existing generated experience and authority/provider foundations, introduce AGWS as a distinct governed semantic layer, and avoid retroactively labeling flat `views` as hierarchical governed surfaces.

No product code changed. No Planning C work was performed.
