# Adaptive Governed Work Surfaces — Revisit 05 / Cycle 6

## Research question
How should Generation 2 preserve `Enterprise → Station → Role → Person` adaptive work-surface governance when generic UI primitives now require typed identity continuity, multi-axis revision vectors, post-merge semantic/accessibility validation, compatible composite evidence, layered portability and qualified-local trust/evidence horizons?

This revisit is research-by-exception. It attempts to falsify whether the refined UCA/PAM/UI primitives are sufficient for AGWS without collapsing AGWS into generic UI. The answer remains **no**: generic UI owns semantic projection/component/layout/renderer behavior; AGWS owns hierarchical capability exposure, inherited non-weakenable obligations, delegated administration, bounded personal/team overlays, attenuated personal automation, promotion governance and Station-scoped effective-surface resolution.

## Representatives and evidence/source ledger

### ServiceNow UI Builder page variants — DEEP
Australia-release documentation updated March 12, 2026 describes page variants at a shared path selected by audiences, conditions and explicit order. Audience configuration requires administrative roles; user criteria can depend on role, department, group, location or company. Conditions evaluate only declared page parameters. This is strong evidence that contextual selection is a separate realization decision rather than a change to canonical page identity.

Sources:
- https://www.servicenow.com/docs/r/application-development/ui-builder/configure-audiences.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/edit-variant-settings.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/control-conditions-for-your-variant.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/work-pages.html

Architectural challenge: audience/condition/order can select effective presentation, but selection itself must not grant underlying data/action authority. A variant that visually exposes an action remains subject to independent semantic action authorization and provider-binding qualification.

### SAP Build Work Zone spaces/pages/federation — DEEP
SAP Build Work Zone documents spaces as containers for pages, pages assigned to spaces, and spaces exposed through business roles. Federated spaces/pages can be read-only; newer documentation also describes content providers whose provider retains control of federated content and role-level federation into the consumer account.

Sources:
- https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/manual-configuration-of-spaces-and-pages
- https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition-on-china-shanghai-region/integration-with-sap-build

Architectural challenge: provider ownership, consumer role assignment, local composition and effective availability are distinct identities/authorities. This closely matches Station consuming capability/content from a superior or external SB/provider without owning the upstream semantic source.

### Salesforce Lightning App Builder / Dynamic Forms — DEEP
Salesforce Lightning App Builder supports component and field visibility rules over record/user/device context. Official documentation warns that visibility rules can leave a region empty and that a field marked required in the page builder can still be hidden by a visibility rule at runtime while the record remains saveable. This is adversarial evidence that visual requiredness/visibility is not a sufficient invariant mechanism.

Sources:
- https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/extend_click.pdf
- https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/add-visibility-rules-for-dynamic-pages-lab

Architectural challenge: AGWS mandatory organizational components cannot be implemented as ordinary visibility metadata. Mandatory obligation semantics must be independently validated after contextual resolution.

### Mendix security, page access and role propagation — DEEP
Mendix distinguishes page visibility/access from entity and microflow access. Documentation explicitly warns that page access alone does not secure data/logic and that users may reach pages by other means. User-role changes may not take effect until session revalidation/sign-in, so effective role/authority can lag configuration revision.

Sources:
- https://docs.mendix.com/refguide10/module-security/
- https://docs.mendix.com/refguide/user-roles/
- https://docs.mendix.com/howto/security/set-up-anonymous-user-security/
- https://docs.mendix.com/refguide/security-overview/

Architectural challenge: surface revision and authority/session-effective revision are separate axes. AGWS must never infer action/data authority from component/page visibility or from the latest configured Role before effective uptake is proven.

### Microsoft Power Apps custom pages — DEEP
Power Apps custom pages use responsive layout containers and solution-managed page components. Custom pages can integrate connectors, but known-issue documentation states that connector consent denial can leave the page rendered without data and that offline support is not currently available for custom pages. Security-role assignment can determine form availability, while form/page presentation remains separate from underlying Dataverse permissions.

Sources:
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/design-page-for-model-app
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/model-app-page-overview
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/model-app-page-issues
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/control-access-forms

Architectural challenge: a rendered surface can be only partially effective because binding/consent/provider availability differs. Local/offline claims must therefore be qualified by exact dependency/trust/binding closure and cannot be inferred from successful rendering.

## Source of truth, identity and lifecycle
Canonical AGWS truth is the hierarchical semantic surface intent and obligation/delegation lineage, not rendered DOM, page-path, provider-native page ID, audience ID or session-local visibility state.

Typed identities are required for at least:
- `SurfaceDefinitionId` — semantic work-surface definition;
- `OverlayId` — Enterprise/Station/Role/Person specialization intent;
- `ObligationId` — mandatory inherited semantic duty independent of placement/renderer;
- `DelegationId` — authority to specialize/expose/administer a bounded facet;
- `ComponentContractId` — semantic component/action contract supplied by generic UI/capability planes;
- `BindingId` — provider-neutral semantic binding decision;
- `RealizationId` — renderer/provider/runtime-specific materialization;
- `EffectiveSurfaceResolutionId` — evidence-qualified resolution for a concrete Station/Role/Person context.

Lifecycle remains layered:
`intent/proposal → validate hierarchy/authority/semantics/accessibility → accepted overlay revision → materialization attempt → realized surface → contextual effective resolution → action/provider qualification → observed use → optional promotion proposal`.

No step collapses into the next merely because a product mechanism saved or rendered successfully.

## Multi-axis effective revision vector
An effective AGWS surface is qualified by a vector rather than one version:

`SurfaceRevision × EnterprisePolicyRevision × StationExposureRevision × RoleAuthorityRevision × PersonOverlayRevision × ComponentRegistryRevision × CanonicalModelRevision × BindingRevision × RendererProfileRevision × AccessibilityProfileRevision × Trust/ValidatorEpoch × SessionAuthorityEpoch`.

The Mendix role-propagation case is important: a configured Role revision may be newer than the authority actually effective in a current session. Therefore `configuredRoleRevision == current` is not proof that a currently rendered or executable surface has absorbed it.

## Failure semantics
Cycle-6 failure semantics include:
- `TYPED_IDENTITY_MISMATCH`
- `STALE_SUPERIOR_REVISION`
- `STALE_SESSION_AUTHORITY`
- `SUPERIOR_OBLIGATION_UNSATISFIED`
- `MANDATORY_COMPONENT_REALIZATION_MISMATCH`
- `STATION_EXPOSURE_WITHDRAWN`
- `DELEGATION_SCOPE_EXCEEDED`
- `BINDING_OR_CONSENT_UNRESOLVED`
- `ACCESSIBILITY_NONCONFORMANT`
- `COMPOSITE_EVIDENCE_INCOMPATIBLE`
- `DEPENDENCY_INCONCLUSIVE`
- `AI_CANONICAL_ESCALATION_REQUIRED`
- `PROMOTION_NOT_AUTHORIZED`
- `LOCAL_CLOSURE_EXPIRED`

A conflict-free overlay merge may still fail hierarchy, semantic, accessibility, binding or authority validation. A visually successful render may still be `PARTIAL` or `INCONCLUSIVE` when provider consent/binding, role uptake or mandatory-obligation evidence is missing.

## Extensibility and provider boundaries
AGWS admits extensibility only through semantic component/action contracts that have already been admitted by the generic UI/extension/provider planes. A custom renderer or provider component cannot redefine AGWS obligation identity or bypass Station exposure. Provider substitution is allowed only when the replacement preserves required semantic component/action capability and reissues compatible realization/binding/accessibility evidence.

SAP federated read-only content supports the distinction between consuming upstream capability/content and gaining ownership of it. Station may consume a superior SB/provider surface capability while retaining only delegated local placement/exposure authority.

## Governance and non-amplifying hierarchy
`Enterprise → Station → Role → Person` is not inheritance by textual precedence. Each lower layer may specialize only explicitly delegated facets. Effective authority is computed independently from effective presentation and must remain a subset/intersection of superior grants.

Mandatory inherited components use stable `ObligationId` and an allowed realization profile. Lower layers may reposition or de-emphasize them only when policy explicitly permits, but cannot remove them, replace them with semantically inequivalent content or hide them through contextual visibility rules.

Salesforce's required-field/visibility interaction is a direct adversarial example: presentation-layer requiredness can be defeated by runtime visibility. AGWS therefore requires obligation validation after the final contextual surface has been resolved.

## Observability, lineage, diff/reset/rollback and promotion
Resolution evidence records all input revision axes, selected/rejected overlays, obligation satisfaction, delegated-facet checks, action authority, binding qualification, accessibility result and evidence freshness.

`diff/reset/rollback` operate on semantic overlay lineage. A prior overlay revision is rollback-eligible only if current superior obligations, Station exposure, Role authority, component contracts, bindings, accessibility rules and trust/validator epochs remain compatible.

Promotion from Personal to Team/Role/System preserves immutable source lineage:
`PersonalPattern@p + UsageEvidence@u → PromotionProposal@q → TargetAuthorityValidation@a → TargetRevision@r → Effective/PostconditionEvidence@e`.

Usage volume, AI recommendation or conflict-free merge never creates the target organizational revision by itself.

## Cumulative context and composite proof
Context propagated into a surface — current record, selected Station, role hints, user preferences, navigation parameters, provider metadata — is provenance/selection input, not authority. ServiceNow conditions being limited to declared parameters reinforces that selection context is a bounded evaluation input.

Composite proof requires compatibility across hierarchical layers. Evidence for a Person overlay under `StationExposure@s1` cannot be joined with obligation or authority evidence from `s2` unless an explicit compatibility relation proves the join. Incompatible required evidence yields `INCONCLUSIVE`, not optimistic inheritance.

## Portability and qualified local/offline closure
AGWS portability is layered:
1. **PRESERVE** semantic surface/overlay/obligation/delegation/binding intent;
2. **INTERPRET** against component/capability registries;
3. **VALIDATE** hierarchy, authority, canonical-model references, accessibility and binding requirements;
4. **REALIZE** through a renderer/runtime/provider profile;
5. **ACTUATE** actions/automations only where current authority and provider reachability are proven.

A Station may retain a qualified local surface while disconnected when the complete local closure is available: exact surface/overlay revisions, component contracts, Station exposure snapshot, applicable Role/Person authority snapshot, canonical model/projection schemas, validators, accessibility rules, trust material and allowed local bindings. Local closure has a horizon. Reconnection or discovery of newer superior/policy/trust/provider revisions triggers requalification before privileged actions resume.

Power Apps custom-page online-only behavior and connector-consent partial rendering are useful negative cases: successful local rendering is not equivalent to complete operational closure.

## AI-only materialization boundary
AI remains the sole AGWS materializer under the Generation-2 hypothesis, but it is not an authority source. Employee intent is translated into a deterministic semantic candidate and validated against admitted component contracts, canonical model references, inherited obligations, delegated specialization facets, accessibility and bindings.

If an employee request requires a new entity/field/schema, canonical process rule, provider-admin permission, secret, deployment mutation or superior policy change, the materializer must emit a typed escalation/proposal to the owning capability. It must not silently materialize the requested domain change as page configuration.

## Product-specific mechanisms vs universal/AGWS primitives
Product mechanisms: ServiceNow audiences/variant order; SAP spaces/pages/business-role federation; Salesforce component visibility filters; Mendix page/module/entity access matrices; Power Apps custom-page containers/connectors.

Cross-cutting primitives: typed identity continuity, multi-axis revision qualification, compatible evidence joins, expected-base/ownership semantics, layered portability, qualified-local trust/evidence horizon and INCONCLUSIVE propagation.

AGWS-owned primitives: Station capability exposure; hierarchical non-amplifying specialization; superior obligation identity; bounded delegated administration; effective-surface resolution evidence; attenuated personal automation; evidence-governed Personal→Team/Role/System promotion.

## Convergent/divergent patterns
**Convergent:** contextual audiences/roles/scopes select effective experiences; page visibility is separate from deeper data/action permissions; provider/federation ownership can remain external; target/session/provider state can lag authored configuration.

**Divergent:** products vary widely in how much users/makers can freely edit, whether page-level requiredness is enforceable, whether personalization is end-user or admin-driven, and whether offline/local realization is supported. Generation 2 intentionally adopts the stricter governance model rather than inheriting the most permissive maker model.

## Comparison with SB — evidence-bounded only
A bounded fresh-`main` code search for `Station capability exposure adaptive governed work surface page variant personalization` returned no matches in this run. This is **not** repository-wide evidence of absence and is not used to infer current SB capability maturity. Repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; until then, all implementation hypotheses remain questions rather than claims.

## Reconciliation hypotheses
- **KEEP:** provider-neutral semantic components/actions and runtime-autonomous rendering if fresh-main evidence later confirms them.
- **HARDEN:** typed overlay/obligation/delegation identities; revision vectors; effective-session authority; post-resolution obligation/accessibility validation; evidence compatibility joins.
- **GENERALIZE:** typed identity, revision-qualified evidence, layered portability and qualified-local closure with UCA/UI/Lifecycle.
- **PROVIDERIZE:** renderer/editor-specific realizations, federated content sources and external action providers.
- **INTEGRATE:** Station exposure with Authorization, Provider/Binding, Lifecycle, Identity/session authority, Observability and Process/Application canonical-change escalation.
- **REPLACE:** any model where visibility/page selection is treated as security or where mandatory organizational components are ordinary removable UI elements.
- **DEFER:** automatic organization-wide promotion from usage evidence or model recommendation.
- **DO_NOT_BUILD:** arbitrary HTML/CSS/schema/query/domain mutation by employee personalization; implicit authority amplification; silent domain/process mutation by AI; unqualified offline privileged actuation.

## Repository-validation questions
1. Does fresh main have a first-class Station semantic identity distinct from tenant/environment/workspace labels?
2. Can present authorization contracts represent configured versus session-effective Role/Person authority epochs?
3. Can a semantic UI component carry stable obligation identity independent of renderer/provider realization?
4. Is there an existing revision/evidence envelope that can qualify a vector of surface, policy, role, binding, renderer and trust revisions?
5. Can action bindings be provider-neutral while preserving independent authorization and provider-consent evidence?
6. Is local runtime able to retain read/view surfaces without retaining Builder/AI or provider-admin authority?
7. Can current provenance represent Personal source lineage when promoted into a separate Team/Role/System revision?
8. Are rollback eligibility and stale-evidence semantics reusable from Lifecycle/Architecture Reconciliation rather than AGWS-specific implementations?
9. Can current contracts distinguish configured Role revision from effective session authority uptake?
10. Which current renderer/component abstractions, if any, can prove mandatory obligation satisfaction after final contextual resolution?

## Symbiotic Proof — cycle-6 backfill
1. **Typed-identity continuity proof:** preserve one `SurfaceDefinitionId` and `ObligationId` across renderer/provider replacement while `RealizationId` changes; identity mapping must be explicit and lossless.
2. **Identity-mismatch negative proof:** substitute a visually equivalent component that lacks the required `ObligationId`/semantic contract; final validation rejects it despite successful rendering.
3. **Multi-axis stale proof:** change Station exposure or Role/session authority without changing Person overlay bytes; previous effective-surface evidence becomes stale and re-resolution is mandatory.
4. **Conflict-free-but-invalid proof:** merge a Person overlay cleanly while it hides/reorders a mandatory component outside permitted policy or creates an accessibility violation; merge succeeds but governed validation fails.
5. **Composite-evidence incompatibility proof:** combine Person overlay evidence from Station revision `s1` with Role/obligation evidence from incompatible `s2`; required aggregate result is `INCONCLUSIVE`.
6. **Context non-authority proof:** inject role/provider/action hints into navigation/context metadata; selection may change permitted view variant but no action/data/provider authority is created.
7. **Delegated-admin attenuation proof:** grant a Station admin page/exposure-management authority but deny canonical domain, secret and provider-admin facets; attempts outside delegated facets are independently denied.
8. **Mandatory-component substitution proof:** replace renderer/provider and prove the mandatory organizational component remains present through semantic obligation identity even if placement/rendering differs.
9. **Promotion-lineage proof:** promote a frequently used Personal pattern only after target validation/approval; source Personal revision remains immutable and traceable, and rollback/reset remains layer-specific.
10. **Qualified-local/reconnection proof:** operate a locally closed read/allowed-action surface while disconnected; then advance superior policy/trust/binding revision before reconnection and require requalification before privileged actuation.
11. **AI canonical-escalation proof:** ask AI to create a useful grid requiring a nonexistent canonical field; AI emits a domain-model proposal/escalation and does not synthesize the field into page state.
12. **Provider-consent partial proof:** surface renders but external connector consent/binding is denied; page remains partially usable where safe, external action is disabled/qualified, and overall evidence records `PARTIAL` rather than success.

## Stable findings
- **G2-FINDING-AGWS-30 — AGWS Identity Is Typed Across Surface, Overlay, Obligation, Delegation, Binding and Realization Kinds.** Stable semantic work-surface identity can survive renderer/provider change only through explicit per-kind identity continuity; provider/page IDs cannot become canonical AGWS identity.
- **G2-FINDING-AGWS-31 — Effective AGWS State Is a Multi-Axis Revision Vector Including Session-Effective Authority.** Surface bytes alone are insufficient; policy, Station exposure, Role/Person authority uptake, component registry, canonical model, bindings, renderer, accessibility and trust epochs jointly qualify the effective surface.
- **G2-FINDING-AGWS-32 — Conflict-Free Personalization Does Not Prove Hierarchical, Semantic or Accessibility Validity.** Overlay merge/conflict success and governed effective-surface conformance are independent evidence classes.
- **G2-FINDING-AGWS-33 — Hierarchical Composite Proof Requires Revision-Compatible Evidence Joins.** Person/Role/Station/Enterprise evidence from incompatible revisions, scopes or trust epochs must propagate `INCONCLUSIVE` rather than be optimistically composed.
- **G2-FINDING-AGWS-34 — Surface Selection Context Is Provenance, Never an Authority Source.** Audience matches, URL/context parameters, role hints and provider metadata may influence selection but cannot grant data, action, provider or canonical-mutation authority.
- **G2-FINDING-AGWS-35 — Mandatory Organizational Components Require Obligation Continuity Across Renderer/Provider Substitution.** Presence is satisfied by semantic obligation identity plus allowed realization constraints, not by page position, component name or visual similarity.
- **G2-FINDING-AGWS-36 — Delegated Station Administration Is Faceted and Non-Amplifying.** Authority to compose/expose a bounded Station surface does not confer canonical-domain, secret, provider-admin, deployment, recovery or superior-policy authority.
- **G2-FINDING-AGWS-37 — Qualified Local Work-Surface Closure Has a Revalidation Horizon.** Offline/local rendering and bounded action can remain valid only against an explicit closure; superior policy/trust/role/binding changes discovered later require requalification before privileged actuation.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-AGWS-TYPED-SURFACE-OVERLAY-OBLIGATION-REALIZATION-IDENTITY-MAPPING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Specialize UCA typed identity continuity while keeping `ObligationId` and hierarchy semantics AGWS-owned.
- `G2-CAPABILITY-CANDIDATE-AGWS-MULTI-AXIS-EFFECTIVE-SURFACE-REVISION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Lifecycle/UIGX revision vectors; retain session-effective authority and Station exposure axes.
- `G2-CAPABILITY-CANDIDATE-AGWS-HIERARCHICAL-COMPOSITE-PROOF-COMPATIBILITY-JOIN` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with UCA evidence compatibility while preserving Enterprise/Station/Role/Person layer semantics.
- `G2-CAPABILITY-CANDIDATE-AGWS-MANDATORY-OBLIGATION-REALIZATION-CONTINUITY` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Keep under AGWS unless negative-space research proves a broader semantic owner for mandatory inherited work-surface obligations.

No candidate is promoted. `Adaptive Governed Work Surfaces` remains the already-promoted mandatory active capability and remains distinct from `UI / Generated Experience / Low-code Builder`.

## Value / risk / priority / next question
**Value:** permits high-value employee personalization and external automation while preserving organizational invariants, delegated administration and portable semantic intent. **Risk:** treating page selection/visibility or maker context as authority creates silent privilege amplification; treating mandatory components as ordinary UI makes organizational obligations bypassable. **Priority:** HIGH. **Next question:** whether Workflow & Durable Execution confirms the same typed identity/revision/evidence compatibility and non-amplifying authority model for long-lived executions, human tasks and retries without moving workflow ownership into AGWS.
