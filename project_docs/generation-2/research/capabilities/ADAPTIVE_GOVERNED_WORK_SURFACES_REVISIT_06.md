# Adaptive Governed Work Surfaces — Revisit 06 / Cycle 7

## Research question
How should Generation 2 make `Enterprise → Station → Role → Person` work surfaces provably adaptive without allowing lower-level personalization, generic low-code extensibility, provider-specific realization, stale evidence or disconnected operation to weaken superior obligations or amplify semantic/admin authority?

This revisit is research-by-exception. Revisit 05 already established typed surface/overlay/obligation/delegation identity, multi-axis effective revisions, post-resolution obligation validation, non-authoritative selection context and qualified-local closure. Cycle 7 therefore stress-tests the remaining hard edges introduced by UCA/PAM/UIGX: applicability-scoped claims, evidence replay horizons, mixed stability vectors, dual-representation drainage, append/supersede lineage and executable revision-qualified conformance.

The result remains architectural, not product construction: **AGWS stays a distinct promoted CORE capability**. Generic UI may own components/layout/rendering; Authorization owns grants; Provider/Binding owns external realization qualification; Process/Application Modeling owns canonical model/process truth. AGWS owns hierarchical capability exposure, inherited obligations, bounded delegated administration, effective-surface resolution, personal/team overlays and governed promotion semantics.

## Representatives and evidence/source ledger

### Microsoft Power Platform Managed Environments / environment groups — DEEP
Official 2026 documentation describes environment groups whose published rules are enforced across member environments. Environment-level settings can be locked by a group rule. Environment routing can automatically place personal developer environments under a selected group so that they begin governed by centrally defined rules. Microsoft also documents that changing routing affects newly created developer environments while existing ones remain in their current group unless manually moved, and that rule publication can take minutes to propagate.

Sources:
- https://learn.microsoft.com/en-us/power-platform/admin/environment-groups
- https://learn.microsoft.com/en-us/power-platform/admin/environment-group-rules-gallery
- https://learn.microsoft.com/en-us/power-platform/admin/default-environment-routing

Architectural challenge: superior governance and lower-level maker space are distinct identities. A lower surface may be automatically born inside a governed boundary, but effective conformance depends on rule publication/propagation and membership revision. Routing policy change does not retroactively migrate existing consumers; therefore generation/cohort drainage must be explicit.

### SAP Build Work Zone spaces/pages/federation/transport — DEEP
SAP documents spaces/pages assigned through business roles. Federated spaces/pages can remain read-only and provider-owned while local and federated content coexist. Transport guidance shows that site/content export is not closed under all dependencies: apps assigned to pages may not be exported; `Everyone` assignments may need reconstruction; federated apps/roles require matching content-channel identity and target-side role availability.

Sources:
- https://help.sap.com/docs/build-work-zone-advanced-edition/sap-build-work-zone-advanced-edition/manual-configuration-of-spaces-and-pages
- https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/before-transporting-content-important-rules-and-guidelines

Architectural challenge: preserving layout/content representation is insufficient to prove an effective work surface after migration. Role assignment, provider channel identity and dependent app availability form part of applicability and realization closure. Mixed local/federated surfaces also demonstrate that component/provider stability is vector-valued rather than one page-wide scalar.

### ServiceNow UI Builder page variants — DEEP
ServiceNow Australia documentation describes variants at one shared path selected by audiences, conditions and explicit order, with administrative roles required to edit them. Conditions evaluate declared parameters and variant precedence decides which eligible variant is shown.

Sources:
- https://www.servicenow.com/docs/r/application-development/ui-builder/edit-variant-settings.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/work-pages.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/create-variant.html

Architectural challenge: applicability is a relation over audience/context/order, not a property of page bytes. A successful page save or render cannot prove that the selected variant is authorized, semantically current or compliant with superior obligations. Ordering changes can alter the effective surface without modifying individual variant representations.

### Atlassian Forge UI Kit / app-context security / display conditions — DEEP
Atlassian explicitly distinguishes trusted resolver context from browser-obtained context that must not be used for authorization. Forge display conditions control visibility but are client-side and are explicitly not a security mechanism. UI Kit constrains authors to an admitted component set rather than arbitrary HTML, while app permissions/scopes separately bound remote/API access.

Sources:
- https://developer.atlassian.com/platform/forge/app-context-security/
- https://developer.atlassian.com/platform/forge/manifest-reference/display-conditions/
- https://developer.atlassian.com/platform/forge/ui-kit/
- https://developer.atlassian.com/platform/forge/manifest-reference/permissions/

Architectural challenge: constrained authoring is useful only when presentation context, action authority and provider/API scopes stay separate. A context value may be acceptable for rendering yet unacceptable for authorization. AGWS must preserve this split at every hierarchy level and across AI materialization.

### Microsoft Power Platform default pipeline governance — DEEP
Power Platform can associate a default deployment pipeline with an environment group and share it to development environments under group governance. Managed-environment prerequisites and target-environment constraints are explicit.

Source:
- https://learn.microsoft.com/en-us/power-platform/alm/default-deployment-pipeline-rule-for-environment-groups

Architectural challenge: capability exposure and governed route-to-change can be inherited together without granting unrestricted deployment authority. AGWS should therefore express an admitted path/escalation to canonical or deployment change, not silently broaden a user's authoring grant because a surface exposes a deployment-capable tool.

## Source of truth and typed identities
Canonical AGWS truth remains the hierarchical semantic intent plus applicability/obligation/delegation lineage. DOM, provider page IDs, UI ordering, browser context, environment-group membership, transport artifacts and provider-native roles are evidence/realization inputs, not AGWS semantic truth.

Cycle-7 identity set:
- `SurfaceDefinitionId` — canonical semantic surface intent;
- `SurfaceClaimId` — applicability-scoped claim that a surface/overlay is intended for a bounded Enterprise/Station/Role/Person context;
- `OverlayId` — bounded specialization intent;
- `ObligationId` — inherited semantic duty;
- `DelegationId` — bounded authority to expose/specialize/administer facets;
- `StationExposureId` — Station-level capability exposure decision;
- `ComponentContractId` — admitted semantic component/action contract;
- `BindingId` — provider-neutral external capability binding;
- `RealizationId` — renderer/provider/runtime realization;
- `ConsumerCohortId` — device/session/Station cohort consuming a representation generation;
- `EffectiveSurfaceResolutionId` — revision-qualified effective-surface proof;
- `EvidenceBundleId` — replayable evidence package with evaluator/profile/trust retention metadata.

Identity continuity is per kind. A renderer migration may replace `RealizationId` while preserving `SurfaceDefinitionId` and `ObligationId`; a Station move may require a new `StationExposureId`; a role/session change may invalidate an effective resolution without changing the surface representation.

## Applicability-scoped effective-surface claims
A surface is not globally valid because it was published. Each effective claim is scoped at least by:

`Enterprise × Station × Role/Person × CanonicalModel × Surface/Overlay × ComponentSet × BindingSet × RendererTarget × AccessibilityProfile × Policy/Trust Epoch × ContextPredicate`.

ServiceNow variant precedence and Power Platform environment-group membership show two different applicability mechanisms: one selects among alternative representations, the other constrains a governed administrative boundary. AGWS must preserve both as explicit inputs and never infer cross-scope validity.

A claim can therefore be:
- `APPLICABLE_AND_QUALIFIED`
- `NOT_APPLICABLE`
- `STALE`
- `PARTIAL`
- `INCONCLUSIVE`
- `REJECTED`

`INCONCLUSIVE` is required when mandatory evidence exists but cannot be replayed, dependencies are missing after transport, or revision compatibility cannot be established.

## Mandatory inherited obligations and non-removability
Mandatory Enterprise/Station obligations are semantic, not positional. They survive reordering, responsive collapse and renderer/provider replacement through `ObligationId` plus an allowed realization profile.

A lower layer may alter only facets explicitly delegated by policy. Reposition, compact, annotate or visually adapt can be permitted; removal, semantic substitution, action broadening, bypass through a different variant or hiding through client-side conditions are rejected unless superior policy explicitly revokes/replaces the obligation.

Atlassian's explicit warning that client-side display conditions are not authorization is adversarial confirmation: a lower layer cannot make an obligation or authority disappear by controlling visibility. Final effective-surface validation is performed after all applicable overlay/variant/layout/provider resolution.

## Station capability exposure and delegated administration
Station is a first-class semantic boundary, not a synonym for environment or tenant. A Station may receive capabilities/content from Enterprise or an external/superior SB while controlling only delegated facets such as local placement, audience assignment, bounded binding selection or approved workflow invocation.

`EffectiveDelegation = SuperiorGrant ∩ StationPolicy ∩ RoleGrant ∩ PersonGrant ∩ CurrentTrust/BindingQualification`.

No union-based amplification is allowed. Provider-native admin roles, environment maker status, UI editor access or presence of deployment tooling do not imply canonical model, provider-admin, secret, deployment, recovery or superior-policy authority.

Power Platform demonstrates a useful pattern: centrally governed environments can give makers local working space while retaining group-level rules and deployment pathways. Generation 2 should keep this pattern but represent the authority intersections explicitly rather than inheriting provider role semantics.

## Constrained authoring and AI-only materialization
Ordinary AGWS users express intent through admitted grids, slots, templates, semantic components, filters, views and bounded personal actions. AI is the sole materializer of those intents into AGWS semantic candidates, but AI has no independent authority.

Materialization pipeline:
`UserIntent → TypedCandidate → Hierarchy/Delegation Check → Semantic/Canonical Reference Check → Accessibility Check → Binding/Provider Check → Accepted Overlay Revision → Realization → Effective Resolution Proof`.

If the requested outcome requires a new canonical entity/field/process rule, broader provider scope, secret, environment policy, deployment mutation or organizational automation, AI emits a typed proposal/escalation to the semantic owner. It does not smuggle the change into surface metadata, JavaScript, connector configuration or generated schema.

Atlassian UI Kit is useful evidence that constrained component authoring is technically feasible while permissions remain independently governed; Generation 2 applies a stricter semantic-authority boundary.

## Mixed stability/support vector
A work surface can combine stable and unstable elements. Its support state therefore cannot be one scalar. At minimum:

`SurfaceSemanticStability × OverlaySchemaStability × ComponentContractStability × LayoutProfileStability × BindingStability × ProviderRealizationStability × RendererTargetStability × AccessibilityProfileStability × AuthorityModelStability`.

SAP local/federated coexistence makes this visible: a locally stable page can embed provider-controlled federated content whose channel identity/availability changes independently. A surface remains qualified only for the vector actually proven.

## Revision-qualified conformance
Effective-surface conformance is a relation, not a permanent badge:

`Conformance(subjectRevision, applicabilityScope, normativeProfileRevision, evaluatorRevision, trustEpoch, evidenceBundle)`.

Evidence must identify the exact subject and evaluator inputs. If a superior obligation, component contract, environment-group rule, Station exposure, provider binding, accessibility profile or authority epoch advances, prior evidence becomes stale according to declared dependency edges.

Rule publication propagation in Power Platform is a concrete negative case: `configured == new` does not necessarily mean every governed environment is already `effective == new`.

## Evidence-retention and replay horizon
A historical claim may remain historically true even after the system can no longer replay its validation. Therefore claim validity and replayability are separate dimensions.

An `EvidenceBundle` records:
- subject/applicability revisions;
- evaluator/profile revisions;
- selected/rejected overlays and variant precedence;
- inherited obligation satisfaction;
- authority/session epoch evidence;
- binding/provider qualification;
- accessibility result;
- trust material references;
- dependency manifests;
- retention horizon.

If required evaluator, trust material, component schema or dependent provider evidence expires, the claim becomes `NON_REPLAYABLE` for new high-assurance decisions without rewriting historical lineage. New privileged use requires fresh qualification.

## Lineage, diff, reset and rollback
AGWS history is append/supersede lineage. `diff` compares semantic intent and effective applicability, not only representation bytes. `reset` removes a lower-level overlay to reveal the currently valid superior resolution; it does not resurrect an obsolete superior snapshot. `rollback` creates/selects a new accepted lineage edge to a prior compatible overlay revision and requires current superior obligations/authority/bindings to remain satisfied.

A prior visually valid overlay can be rollback-ineligible if a mandatory obligation, provider binding, accessibility profile or Station exposure changed after it was created.

## Personal → Team/Role/System promotion by evidence
Usage is evidence, not authority. Promotion is:

`PersonalPattern@p + QualifiedUsageEvidence@u → PromotionProposal@q → TargetSemanticOwner/AuthorityValidation@a → NewTargetRevision@r → ConsumerUptakeEvidence@e`.

No threshold of usage, AI confidence, absence of conflicts or local popularity self-promotes a personal surface. Evidence should include applicability/cohort diversity, success/failure signals, accessibility and authorization outcomes, not raw click counts alone.

Promotion copies/derives intent with immutable source lineage; it never mutates the personal revision into the organizational revision.

## External capability bindings without provider coupling
AGWS references provider-neutral `BindingId`/capability contracts. Provider realization may change while semantic action identity remains stable only if compatibility, authority and postcondition semantics are requalified.

A surface may remain renderable when an external provider is unavailable; affected components/actions become `PARTIAL` or `INCONCLUSIVE` rather than globally pretending success. SAP transport gaps and Atlassian permission scopes both support treating representation, provider availability and action authority separately.

## Automation boundary ladder
AGWS recognizes a strict escalation ladder:
1. **View personalization** — layout/filter/presentation only;
2. **Personal action** — user-authorized bounded action with current binding/authority proof;
3. **Supervised automation** — bounded repeated action under explicit scope, approval/lease and revocation semantics;
4. **Team workflow** — organizational workflow owned by Workflow/Process capabilities and target authority;
5. **Canonical domain/process change** — owned by Process/Application Modeling or another semantic owner.

AI or personalization may propose movement upward but cannot cross a rung by inference. An automation that was valid as a personal action does not become Team workflow because usage grows.

## Dual-representation migration and consumer drainage
A new renderer/layout/component generation is not migration closure. Closure requires evidence that all required consumer cohorts have moved or received explicit residual disposition.

`MigrationClosed = NewGenerationQualified ∧ RequiredCohortsDrained ∧ ResidualCohortsDisposed ∧ Binding/Authority/ObligationParityProven`.

Power Platform routing demonstrates cohort asymmetry: changed routing affects newly created personal developer environments while existing ones stay put unless moved. SAP transport demonstrates dependency asymmetry: content can arrive while dependent app/channel/role assignments do not. Both falsify a simplistic `new published == migrated` rule.

## Qualified offline/local closure and reconnect requalification
Local operation is allowed only against an explicit closure set containing current surface/overlay revisions, mandatory obligations, Station exposure snapshot, Role/Person authority snapshot, admitted component contracts, canonical projection schemas, validators, accessibility profile, trust material and local-capable bindings.

Closure has time/revision horizons. Disconnected operation cannot discover superior revocation or provider-policy changes beyond those horizons. On reconnect, newly observed superior/policy/trust/binding revisions invalidate affected privileged evidence and require requalification before privileged actuation resumes.

Generic renderability is weaker than operational closure. Read-only degradation may remain safe where action authority/binding proof is unavailable.

## Failure semantics
- `APPLICABILITY_SCOPE_MISMATCH`
- `VARIANT_PRECEDENCE_STALE`
- `SUPERIOR_OBLIGATION_UNSATISFIED`
- `MANDATORY_COMPONENT_REMOVAL_ATTEMPT`
- `DELEGATION_SCOPE_EXCEEDED`
- `STATION_EXPOSURE_STALE`
- `EFFECTIVE_RULE_PROPAGATION_UNKNOWN`
- `MIXED_SURFACE_SUPPORT_INCOMPATIBLE`
- `EVIDENCE_NON_REPLAYABLE`
- `CONFORMANCE_REVISION_STALE`
- `BINDING_PARTIAL`
- `PROVIDER_DEPENDENCY_MISSING`
- `PROMOTION_AUTHORITY_MISSING`
- `RESIDUAL_COHORT_NOT_DRAINED`
- `LOCAL_CLOSURE_EXPIRED`
- `AI_CANONICAL_ESCALATION_REQUIRED`

## Universal primitive versus AGWS-owned mechanism
### Cross-cutting/universal
Typed identity continuity; applicability-scoped claims; revision-qualified relational conformance; evidence replay horizons; mixed stability vectors; append/supersede lineage; provider-neutral binding qualification; dual-representation drainage; qualified-local trust/evidence horizons.

### AGWS-owned
Enterprise → Station → Role → Person specialization; `StationExposureId`; mandatory `ObligationId` semantics; bounded delegated administration; effective-surface resolution; personal overlay/reset/promotion semantics; automation escalation ladder; AI-only constrained materialization boundary.

### Product-specific/providerized
ServiceNow variant/audience/order mechanics; Power Platform environment groups/routing/pipeline rules; SAP spaces/pages/content channels/transport; Atlassian Forge UI Kit/display conditions/scopes.

## Convergent and divergent patterns
**Convergent:** superior governance and local authoring can coexist; visibility/presentation is not authorization; provider-owned content can remain externally owned; configured state may lag effective state; migration/transport can leave residual consumers/dependencies; constrained component systems can coexist with separate permission models.

**Divergent:** products differ in whether hierarchy is environment-, role-, page- or provider-centric; whether local authoring is direct or constrained; how transport handles dependencies; how offline/local behavior works; and whether promotion from personal to organizational surfaces exists at all. Generation 2 must therefore preserve the universal proof obligations while providerizing each mechanism.

## Comparison with SB — evidence-bounded only
No fresh-main repository archaeology is performed in this revisit because the pipeline reserves implementation reconciliation for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. The existing repository-validation questions remain open. No claim is made that current SB already implements or lacks these primitives.

## Reconciliation hypotheses
- **KEEP:** provider-neutral semantic components/actions and autonomous runtime rendering if later repository evidence confirms them.
- **HARDEN:** applicability-scoped effective-surface claims, post-resolution mandatory obligation checks, revision-qualified conformance, evidence replay metadata, lineage and residual-cohort closure.
- **GENERALIZE:** replay horizons, mixed stability vectors, append/supersede lineage, dual-representation drainage and qualified-local closure with UCA/UIGX/Lifecycle/Governance.
- **PROVIDERIZE:** environment groups, page variants, spaces/pages, external content channels, renderer targets and provider-native admin/editor mechanisms.
- **INTEGRATE:** Station exposure with Authorization, Identity/session epochs, Provider/Binding, Workflow, PAM, Lifecycle, Observability and Governance.
- **REPLACE:** any scheme where page/variant visibility, provider-native editor role or environment membership is treated as sufficient semantic/admin authority.
- **DEFER:** automatic organizational promotion from usage/AI recommendation.
- **DO_NOT_BUILD:** arbitrary schema/query/domain mutation from ordinary personalization; silent authority amplification; irreversible cross-layer overwrite; unqualified offline privileged actuation.

## Repository-validation questions
1. Can fresh main represent Station as a semantic exposure/delegation boundary distinct from tenant/environment/workspace?
2. Is there a reusable applicability-claim envelope able to bind surface, Station, Role/Person, component, provider, accessibility and trust revisions?
3. Can mandatory semantic obligations survive component/renderer/provider replacement independently of placement/name?
4. Does any existing evidence envelope preserve evaluator/profile/trust revisions strongly enough for replayability decisions?
5. Can current versioning express append/supersede overlay lineage plus reset-to-current-superior semantics?
6. Can provider-neutral action bindings remain distinct from provider scopes/consent and user action authorization?
7. Is there a representation of configured versus effective governance/role/binding propagation?
8. Can migration evidence enumerate active consumer cohorts and residual disposition rather than only target publication?
9. Can local runtime prove a bounded closure without retaining Builder/AI/provider-admin authority?
10. Are personal usage events attributable strongly enough to support a promotion proposal without becoming authority themselves?

## Symbiotic Proof — cycle-7 mandatory proof stress-test
1. **Hierarchical non-amplification:** grant a Person layout overlay and Station placement delegation; attempts to alter Enterprise obligation, canonical schema, provider-admin scope or deployment policy are denied independently.
2. **Mandatory obligation after final resolution:** select the effective variant/layout/provider realization and prove every mandatory `ObligationId` remains semantically satisfied; client-side hiding or alternate variant cannot bypass it.
3. **Applicability-scoped claim:** reuse identical surface bytes under two Stations with different exposure/policy revisions; evidence is valid only for the proven scope.
4. **Revision-qualified conformance:** change an environment/Station rule or accessibility profile without editing surface bytes; old conformance evidence becomes stale until effective uptake is re-proven.
5. **Evidence replay horizon:** expire evaluator/trust/component evidence while preserving historical lineage; old claim remains historically attributable but becomes non-replayable for fresh privileged use.
6. **Mixed-surface stability:** combine stable local components with a provider-controlled/federated component; provider instability degrades only dependent facets while aggregate status becomes explicitly `PARTIAL/INCONCLUSIVE` where required.
7. **Lineage/diff/reset/rollback:** reset Person overlay to the *current* superior resolution, and reject rollback to an old overlay that violates a newer superior obligation/binding/accessibility rule.
8. **Promotion by evidence without authority creation:** high-usage Personal pattern yields only a promotion proposal; Team/Role/System revision appears only after target-owner validation and retains source lineage.
9. **External binding portability:** substitute provider realization while preserving semantic action identity; require fresh scope/consent/postcondition evidence and reject provider-native admin authority leakage.
10. **Automation ladder:** prove that view personalization, personal action, supervised automation, Team workflow and canonical change use distinct authority contracts and cannot auto-escalate by usage or AI inference.
11. **Dual-representation cohort drainage:** publish a new layout/renderer generation while one Station/device cohort remains on the old generation; migration stays open until drainage or explicit residual disposition.
12. **Qualified local closure/reconnect:** execute only closure-qualified local actions while disconnected; discover newer superior policy/trust/binding revisions on reconnect and require requalification before privileged continuation.

## Stable findings
- **G2-FINDING-AGWS-38 — Effective Work-Surface Claims Are Applicability-Scoped Relations, Not Properties of Published Surface Bytes.** Enterprise/Station/Role/Person context, variant/order, canonical model, component/binding set, renderer target, accessibility profile and trust/policy revisions delimit every valid claim.
- **G2-FINDING-AGWS-39 — Superior Governance Requires Effective-Uptake Evidence, Not Merely Configured or Published Rule State.** Published environment/Station rules may propagate asynchronously; current configuration cannot self-prove that all governed surfaces are already effective under it.
- **G2-FINDING-AGWS-40 — Mandatory AGWS Obligations Are Post-Resolution Semantic Invariants and Cannot Be Implemented as Visibility or Placement Metadata.** Alternate variants, client-side conditions and responsive layout may change presentation but cannot remove or weaken an inherited `ObligationId`.
- **G2-FINDING-AGWS-41 — AGWS Evidence Replayability Is Independent of Historical Claim Lineage.** Expired evaluator, trust, component or dependency material makes old evidence non-replayable for new high-assurance decisions without erasing its historical attribution.
- **G2-FINDING-AGWS-42 — Mixed Work Surfaces Require Typed Stability and Support Vectors.** Local/federated components, bindings, renderer targets, accessibility and authority models can evolve independently; one page-wide stability flag is unsound.
- **G2-FINDING-AGWS-43 — AGWS Reset and Rollback Are Hierarchy-Relative Operations Against Current Superior Truth.** Reset reveals the current valid superior resolution; rollback to an old overlay requires compatibility with present obligations, authority, bindings and accessibility rules.
- **G2-FINDING-AGWS-44 — Personal-to-Organizational Promotion Is a New Target-Owned Revision, Never Authority Derived from Usage.** Usage and AI recommendation may justify a proposal but cannot create Team/Role/System authority; source Personal lineage remains immutable.
- **G2-FINDING-AGWS-45 — Representation Migration Closes Only After Consumer/Station Cohort Drainage and Dependency Disposition.** New renderer/layout publication is insufficient while old cohorts or missing transported provider/role dependencies remain effective.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-AGWS-APPLICABILITY-SCOPED-EFFECTIVE-SURFACE-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile UCA/UIGX applicability claims while retaining Station/Role/Person hierarchy and obligation dimensions.
- `G2-CAPABILITY-CANDIDATE-AGWS-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile UCA/UIGX/Governance evidence-retention concepts while preserving hierarchy-resolution inputs.
- `G2-CAPABILITY-CANDIDATE-AGWS-MIXED-SURFACE-STABILITY-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Generalize mixed stability with UIGX/Provider/Lifecycle but retain Station exposure and authority axes.
- `G2-CAPABILITY-CANDIDATE-AGWS-CONSUMER-COHORT-DRAINAGE-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile Lifecycle/UIGX migration closure while requiring Station/device/session cohort and residual-dependency disposition.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces itself remains **CORE / PROMOTED_TO_ACTIVE_RESEARCH_TAXONOMY / NOT_SATURATED**.

## Saturation disposition
`NOT_SATURATED`.

This revisit produced eight material architectural findings, so `consecutive_no_material_finding = 0`. External evidence still materially refines the capability, and cycle 7 has not completed the remaining active taxonomy. Enterprise Completeness / Negative-Space Review is not yet eligible.

## Value / risk / priority / next question
**Value:** very high. AGWS is the mechanism that lets Generation 2 remain adaptable to individual/team work without turning personalization into uncontrolled application development.

**Risk:** very high if collapsed into generic UI. The main failure modes are authority amplification, hidden removal of mandatory controls, stale effective-state assumptions, provider coupling, irreplayable evidence and false migration closure.

**Priority:** CORE, retained as a distinct active capability.

**Next question:** after AGWS, continue the exact cycle-7 capability order from state. Workflow & Durable Execution should stress-test whether scoped effect guarantees, durable checkpoints, provider substitution and replay can consume AGWS-originated actions/automations without inheriting AGWS presentation context as execution authority.
