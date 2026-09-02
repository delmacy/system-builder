# Adaptive Governed Work Surfaces — Revisit 02 / Cycle 4

## Research question
How should Generation 2 version, resolve, migrate and promote `Enterprise → Station → Role → Person` work surfaces when superior policies, Station capability exposure, role authority, canonical models, projection contracts and component registries evolve independently, while keeping AI as the sole materializer and preventing authority amplification?

This pass deliberately reuses generic projection-migration/evidence primitives from UI research only where valid. AGWS remains a distinct capability because it owns governed layered resolution, Station exposure, mandatory inheritance, bounded personalization/automation and promotion semantics rather than generic rendering.

## Representatives and evidence/source ledger

### 1. Microsoft Power Apps / Dataverse model-driven apps — DEEP
Primary official evidence reviewed in September 2026:
- Power Apps distinguishes **personal**, **system** and **public** views. A personal view can be created from a system/public view, but a system/public view cannot be created directly from a personal view. Creation/sharing of personal views is separately permissioned.
- Public/system views can be filtered by security roles while record access remains controlled by Dataverse privileges; access to a view does not imply access to the underlying data.
- Main forms can be assigned to security roles and have fallback behavior; form ordering is presentation selection, not authorization.
- App visibility itself requires app privileges plus assigned security roles/team membership; maker roles have broader capabilities than ordinary users.

Sources:
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-edit-views
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/manage-view-access
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/control-access-forms
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/share-model-driven-app

Architectural use: Power Apps gives strong evidence that personalization identity, organizational publication, surface visibility and data authorization are distinct. Its explicit inability to turn a personal view directly into a system/public view is especially useful evidence for a governed promotion boundary rather than source mutation.

### 2. ServiceNow UI Builder — DEEP
Primary official 2026 documentation:
- Page variants can share a route while conditions and audiences determine the effective variant.
- Variants have explicit order/priority when conditions overlap.
- Audience and condition configuration is an administrative action; current Australia-release docs require privileged roles to edit variant settings.

Sources:
- https://www.servicenow.com/docs/r/application-development/ui-builder/learn-by-example-define-conditions.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/edit-variant-settings.html

Architectural use: effective surface selection is a contextual resolution operation, not a static page identity. Ordered variant evaluation also demonstrates why the SB resolver must emit explanation evidence identifying the winning layer/rule and why a different candidate did not win.

### 3. SAP Build Work Zone — DEEP
Primary official documentation:
- Spaces/pages are assigned through business roles.
- Local pages may coexist with federated read-only pages from remote providers.
- Transport has explicit dependency rules: federated roles/apps require compatible content channels and target-side role availability; unresolved dependencies produce warnings/non-import rather than silently becoming valid.
- Some source-side assignments are not transported and must be re-established in the target environment.

Sources:
- https://help.sap.com/docs/WZ_STD/24284cbd872f45a4bfa2f51c37cc7063/7883d4782b4e4c43b077f5df50632085.html
- https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/before-transporting-content-important-rules-and-guidelines

Architectural use: a portable surface revision is not proof of target validity. Station migration/import therefore needs target-side capability/role/provider resolution and postcondition evidence.

### 4. Salesforce Lightning App Builder — DEEP
Official Trailhead evidence:
- Lightning record pages can be activated as org default, app default, or assigned to combinations of app, record type and profile, and can vary by form factor.
- Component placement is constrained by the page/component model; some nested layout changes are made through component properties rather than arbitrary DOM manipulation.

Source:
- https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/lightning_app_builder_recordpage

Architectural use: Salesforce provides a practical layered-resolution analogue (`Org → App → Profile/Record Type → Form Factor`) and reinforces that contextual surface specialization is separate from canonical object/data ownership.

## Source of truth and identity
AGWS portable truth remains a revisioned semantic surface plus bounded overlays. Cycle 4 sharpens identity so a resolved surface is never mistaken for a mutable source document:

- `WorkSurfaceDefinitionId` / `SurfaceRevision`
- `StationExposureRevision`
- `RoleOverlayRevision`
- `PersonOverlayRevision`
- `EffectiveSurfaceResolutionId`
- `ResolutionInputSet` (exact participating revisions)
- `SurfaceMigrationPlanId`
- `SurfaceMigrationAttemptId`
- `SurfaceValidationEvidenceId`
- `PromotionPlanId` / `PromotionAttemptId` / `PromotionDecisionId`
- `MaterializationCandidateId` / `MaterializationAttemptId`

A resolved surface is an evidence-bearing result of exact revision inputs. It is not itself authority to mutate any input layer.

## Effective-surface resolution across revisions
Canonical resolution remains:

`Enterprise ⊕ Station ⊕ Role ⊕ Person → EffectiveSurfaceResolution`

Cycle 4 adds revision qualification:

`resolve(E@rE, S@rS, R@rR, P@rP, Model@rM, Projection@rU, Registry@rC, Policy@rA) → EffectiveSurface@rX + ResolutionEvidence`

A saved Person overlay is therefore a candidate against a dependency set, not an eternally valid customization. Any material revision change can yield:
- `VALID_UNCHANGED`
- `VALID_REBASED`
- `REPAIR_REQUIRED`
- `QUARANTINED`
- `REJECTED_AUTHORITY_REMOVED`
- `INCONCLUSIVE_DEPENDENCY_EVIDENCE`

Lower layers may specialize only extension points delegated by superior layers. They cannot weaken mandatory presence, expand capability exposure, grant broader action authority or transform a projection request into canonical domain/process mutation.

## Station as a versioned capability-exposure boundary
`Station` is not merely an organizational label. A `StationExposureRevision` declares which capabilities, semantic actions, providers/bindings and delegated administrative functions are exposed in that operating environment.

A Station revision can therefore invalidate a Person/Role surface even when the surface document did not change. Examples:
- an external capability is withdrawn;
- a provider is replaced with an incompatible profile;
- delegated admin authority is reduced;
- a module is no longer exposed locally;
- an inherited capability from a superior SB changes revision/profile.

A subordinate Station may consume an inherited/federated capability without owning its canonical truth. Exposure and binding are re-resolved at the Station boundary.

## Mandatory inherited components and migration
Mandatory organizational components need stable semantic identity plus a superior placement policy. Compatibility must be assessed semantically, not by matching coordinates or renderer output.

If a mandatory component changes revision, lower overlays are revalidated. A Person overlay may survive if its placement remains within allowed classes; otherwise the system can rebase/repair it. A lower overlay cannot delete the component, replace it with an unapproved semantic substitute or preserve an obsolete version merely because old renderer bytes still work.

If superior policy permits reduced prominence, that is represented as an allowed placement class (`PRIMARY`, `SECONDARY`, `ISOLATED_ALLOWED`, etc.), not as hidden CSS or removal.

## Promotion as plan → attempt → evidence → decision
Personalization promotion is not `copy Person overlay into Role`. It is a governed semantic transition:

`PromotionProposal(source=P@rP, target=Team|Role|System, evidence) → Validation → Approval → PromotionAttempt → TargetRevision → PostconditionEvidence`

Usage evidence can justify review but never grants promotion authority. Promotion creates a new target-layer revision with lineage to the personal source. It does not mutate the source's identity or implicitly broaden authority.

Power Apps' separation between personal and public/system views is useful evidence for this boundary: personalization and organizational publication are distinct lifecycles even when their visible structure is similar.

## Canonical/model/projection changes and revalidation
When canonical model or generic UI projection revisions change, AGWS must distinguish:
- syntactic renderability;
- semantic projection compatibility;
- authority compatibility;
- Station exposure compatibility;
- mandatory-component compatibility.

Technical rendering success is insufficient. A stale field binding, changed action contract or withdrawn permission can render visually while being semantically invalid. Validation evidence therefore binds to exact subject revision, profile, Station/Role context, freshness and coverage.

## AI materialization and authority separation
AI remains the sole materializer of employee surface intent, but AI materialization authority is intentionally narrow.

`IntentAnalysisAuthority ≠ CandidateMaterializationAuthority ≠ SuperiorPolicyMutationAuthority ≠ CanonicalDomainProcessMutationAuthority ≠ PromotionAuthority`

The AI may:
- interpret a user's requested arrangement;
- select registered semantic components;
- generate a candidate within allowed grid/slots/templates;
- propose repair/rebase after dependency changes;
- explain why an operation requires escalation.

The AI may not:
- invent an entity/column/query/provider credential;
- remove a superior mandatory component;
- expose a Station-hidden capability;
- promote a personal overlay to organizational truth;
- change a canonical workflow/domain rule merely to satisfy a page request.

If requested intent crosses those boundaries, the result is an escalation artifact, not silent materialization.

## Qualified local/offline interpretation closure
AGWS can be validated offline/self-hosted when the required closure for the validation operation is local: surface/overlay revisions, layout grammar, semantic component schemas, referenced projection contracts, Station exposure snapshot, applicable policy/role evidence, validator versions and trust material.

This closure does **not** grant ownership of external providers or prove that external actions are currently reachable. Provider-bound actions may validate structurally while runtime availability remains separately `UNKNOWN` or unresolved.

Offline closure must therefore be operation-qualified: `can interpret/validate surface` is different from `can execute every bound action`.

## Failure semantics
AGWS must not collapse uncertainty into acceptance. Important states include:
- `INVALID_SUPERIOR_INVARIANT`
- `STALE_STATION_EXPOSURE`
- `STALE_ROLE_AUTHORITY`
- `MISSING_COMPONENT_REVISION`
- `INCOMPATIBLE_PROJECTION`
- `BINDING_UNRESOLVED`
- `AUTHORITY_ESCALATION_REQUIRED`
- `PROMOTION_REJECTED`
- `VALIDATION_INCONCLUSIVE`

A partial failure should quarantine the affected component/overlay fragment where policy allows rather than silently dropping a mandatory item or widening permissions to make the page work.

## Governance, observability and provenance
Every effective surface should be explainable by lineage:

`EnterpriseRevision → StationExposureRevision → RoleOverlayRevision → PersonOverlayRevision → EffectiveSurfaceResolution → MaterializationCandidate/Attempt → RuntimeSurface`

Resolution evidence records which rule supplied, constrained, overrode or rejected each semantic component. Migration/promotion attempts carry actor/agent identity, authority reference, source/target revisions, validation profile and postcondition result.

## Portability and lock-in
Portable AGWS truth excludes DOM/CSS/JS, provider credentials and proprietary editor ASTs. It includes semantic component types, constrained layout grammar, overlay intent, superior dependency references, semantic capability/action requirements, lineage and revision-qualified validation evidence.

Target import does not imply activation. A target Station must re-resolve exposure, policy, provider compatibility and mandatory-component requirements before activation.

## Product-specific mechanism vs universal primitive
Product-specific mechanisms include Power Apps personal/public/system views and security-role-managed forms/views; ServiceNow page variants/audiences/order; SAP role/space/page/federated transport; Salesforce org/app/profile/record-type activation.

Reusable AGWS primitives are:
- revision-qualified layered surface resolver;
- versioned Station capability-exposure contract;
- mandatory inherited component compatibility policy;
- governed overlay migration plan/attempt/evidence;
- governed promotion plan/attempt/evidence/decision;
- revision/profile/context-qualified surface validation evidence;
- bounded AI materialization and explicit escalation;
- operation-qualified local interpretation closure.

These primitives may reuse universal Generation-2 evidence/migration contracts, but AGWS owns their work-surface semantics.

## Convergent and divergent patterns
Convergence: mature platforms separate user/context-targeted presentation from underlying data permissions; use explicit role/audience/app/profile assignment; employ publish/activation/transport lifecycles; and require target-side dependencies to exist.

Divergence: products differ materially in whether users may create personal views, whether maker tools permit model/query changes, how inheritance is expressed, and whether personal artifacts can be promoted. Generation 2 should not clone a vendor hierarchy. It should preserve the stronger SB rule that lower layers cannot weaken superior invariants or acquire authority through composition.

## Subcapabilities
Semantic Component Registry; Constrained Layout Grammar; Revisioned Surface/Overlay Identity; Effective Surface Resolver; Station Capability Exposure; Delegated Administration; Mandatory Component Policy; Overlay Migration/Rebase; Surface Validation Evidence; AI Intent Classification; AI Candidate Materialization; Canonical-Change Escalation; Safe Projection Binding; Provider-Neutral Action Binding; Personal Action; Supervised Automation; Reset/Rollback; Evidence-Governed Promotion; Hierarchical/Federated Station Management; Offline Interpretation Closure; Accessibility/Responsive Conformance; Provenance/Resolution Explanation.

## SB comparison — evidence only
A bounded fresh-main GitHub code search for `Station WorkSurface page surface projection role permission` returned no result in this run. This is **negative evidence for that exact search only** and must not be interpreted as repository-wide absence. Full repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP:** provider-neutral/runtime-autonomy and authority-separation contracts if fresh-main archaeology later confirms them.
- **HARDEN:** revision-qualified effective-surface resolution, mandatory inheritance, stale/inconclusive semantics and promotion authority.
- **GENERALIZE:** common migration/evidence primitives without moving AGWS ownership into generic UI.
- **PROVIDERIZE:** renderer/editor/runtime realizations and external capability bindings.
- **INTEGRATE:** Station exposure with authorization, provider/binding and lifecycle planes.
- **REPLACE:** any future path that treats user customization as arbitrary executable frontend/query mutation.
- **DEFER:** automatic organizational promotion from usage without governed review.
- **DO_NOT_BUILD:** implicit authority elevation or canonical domain/process mutation from employee surface intent.

## Repository-validation questions
1. Does fresh main already expose stable revision identity for generated projections/components that AGWS could reference without owning UI rendering?
2. Is there a provider-neutral capability-exposure primitive suitable for `StationExposureRevision`?
3. Can current role/authorization contracts express delegated administration and monotonic non-weakening constraints?
4. Where could current UI metadata accidentally be treated as authorization rather than presentation?
5. Are projection/action bindings revision-qualified enough to detect stale personal overlays?
6. Is there a reusable migration plan/attempt/evidence contract already emerging in current lifecycle/data/runtime work?
7. Can runtime remain autonomous with an already-materialized surface when Builder/AI is unavailable?
8. Which existing evidence/provenance envelopes can carry layered resolution and promotion lineage?

## Symbiotic Proof obligations — cycle-4 refinement
1. **Useful list/form/grid without canonical creation.** Candidate materialization references existing semantic fields/actions only; missing canonical semantics emit `AUTHORITY_ESCALATION_REQUIRED`.
2. **Constrained layout only.** Person/Role overlays accept registered components and allowed slots/grid/templates; arbitrary HTML/CSS/JS/query payloads are invalid.
3. **Mandatory superior component survives migration.** Rebase preserves semantic mandatory identity and only changes placement within superior policy.
4. **Station/Role change triggers revalidation.** Exact dependency revisions become stale; resolution fails closed for removed authority/exposure.
5. **AI domain change is escalated.** AI can produce a proposal but cannot mutate canonical model/process under surface-materialization authority.
6. **External capability binding remains provider-neutral.** Surface references a semantic capability/action; provider replacement is resolved at Station binding without page coupling.
7. **Personal automation cannot exceed effective authority.** Runtime evaluates actor + Station + Role + delegated grant + action contract + approval policy.
8. **Lineage/version/diff/reset/rollback survive evolution.** Rollback/restoration requires revalidation against current superior revisions and never rewrites history.
9. **Personal pattern promotion is governed.** Promotion creates a new Team/Role/System revision through proposal/validation/approval/attempt/evidence and preserves source lineage.

All nine remain target proof obligations, not claims about current implementation.

## Stable findings
- **G2-FINDING-AGWS-16 — Effective Work Surfaces Are Revision-Qualified Resolution Results, Not Mutable Source Pages.** Enterprise, Station, Role, Person and semantic dependency revisions must remain identifiable in the effective result so revalidation and provenance are possible.
- **G2-FINDING-AGWS-17 — Station Capability Exposure Is Independently Versioned and Can Invalidate Otherwise-Unchanged Personalization.** Withdrawal/replacement of an exposed capability, delegated authority or inherited binding must stale dependent overlays even if their bytes do not change.
- **G2-FINDING-AGWS-18 — Mandatory Inherited Components Require Semantic Migration Compatibility, Not Coordinate Preservation.** A lower overlay may be repaired/rebased across superior revisions but cannot retain an obsolete mandatory semantic component or remove it because renderer output still succeeds.
- **G2-FINDING-AGWS-19 — Personal-to-Organizational Promotion Is a Governed Plan/Attempt/Evidence Transition.** Usage evidence can motivate promotion, but organizational publication creates a new target-layer revision under separate authority and preserves source lineage.
- **G2-FINDING-AGWS-20 — Surface Validation Is Revision/Profile/Context-Qualified and May Be Inconclusive.** Render success alone does not prove projection, authorization, Station exposure or provider compatibility; missing/stale evidence must not become implicit validity.
- **G2-FINDING-AGWS-21 — AI Surface Materialization Authority Cannot Amplify Superior Policy, Domain, Provider or Promotion Authority.** AI may materialize bounded candidates and repairs, but requests requiring broader authority must produce explicit escalation artifacts.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-REVISION-QUALIFIED-EFFECTIVE-SURFACE-RESOLUTION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE-MERGE-TARGET**. Likely AGWS specialization of unified revision-bound realization/evidence lineage; preserve AGWS ownership of layered resolution semantics.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-WORK-SURFACE-PROMOTION-MIGRATION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE-MERGE-TARGET**. Test whether migration/promotion can share the Generation-2 plan→validation→approval→attempt→postcondition evidence contract while retaining different authorities.
- `G2-CAPABILITY-CANDIDATE-STATION-EXPOSURE-REVISION-DEPENDENCY-FRESHNESS` — **CROSS_CUTTING / CANDIDATE**. Test across provider/authorization/deployment whether Station exposure revision should be a reusable dependency-freshness subject rather than AGWS-only metadata.

No candidate is promoted in this pass.

## Value / risk / priority / next question
**Value:** makes personalized employee workspaces evolvable without confusing convenience with ownership or authority. **Risk:** layered resolution can become opaque unless every effective result carries deterministic explanation/provenance and clear stale/inconclusive states. **Priority:** HIGH because AGWS is a mandatory distinct Generation-2 capability and depends on most constitutional primitives. **Next question:** whether the same revision-qualified migration/evidence vocabulary survives Workflow & Durable Execution without over-generalizing AGWS-specific hierarchy.