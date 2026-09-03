# Generation 2 — Planning A: Adaptive Governed Work Surfaces Boundaries

Status: COMPLETE_FOR_CAPABILITY — PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Adaptive Governed Work Surfaces (AGWS)
Authority inputs: `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md` and the authoritative Generation 2 research corpus.

This document defines taxonomy ownership and boundaries only. It does not assert current System Builder implementation, choose providers, define target modules, materialize WBS/TASKs, or execute product work.

## 1. Canonical ownership

**Adaptive Governed Work Surfaces (AGWS)** owns the semantics of governed, role/person-adaptable work surfaces whose effective composition is resolved through the hierarchy:

`Enterprise → Station → Role → Person`.

AGWS is a **CORE capability distinct from `UI / Generated Experience / Low-code Builder`**. Its source of truth is the revisioned governed-surface definition plus inherited authority/policy context, not rendered DOM, provider-specific page metadata, an AI conversation, or a user's local layout state.

AGWS owns:

1. surface identity and revision lineage;
2. layer identity and overlay relation across Enterprise, Station, Role and Person;
3. effective-surface resolution under monotonic inherited constraints;
4. component placement intent within approved layout contracts/slots/grids/templates;
5. mandatory/non-removable component inheritance and allowed repositioning semantics;
6. surface-level capability exposure references;
7. Station-scoped delegated administration of surfaces and exposure, bounded by superior authority;
8. personalization eligibility, reset, rollback, diff and promotion intent;
9. revalidation when effective Station/Role/authority/context changes;
10. surface-local distinction between view personalization, personal action, supervised automation, team workflow and canonical domain/process change;
11. lineage from human intent / AI materialization proposal to admitted governed-surface revision;
12. evidence references used to support promotion of personal/team patterns without converting usage into authority.

AGWS does **not** own the canonical domain entities, schemas, policies, workflow semantics, provider credentials, runtime topology, or rendered component implementation it composes.

## 2. Source-of-truth boundary

Canonical AGWS truth is a revisioned semantic surface definition composed of typed references to components, capabilities, bindings/actions and layout constraints. The effective surface is derived from that definition plus inherited layer revisions and applicable policy/authority.

The following are explicitly **non-canonical observations or realizations** unless an authorized adoption transition occurs:

- rendered HTML/CSS/DOM;
- client-local drag/drop coordinates outside the allowed layout contract;
- provider/app IDs;
- AI-generated code or prose;
- usage analytics;
- screenshots;
- cached resolved surfaces;
- external automation IDs;
- temporary runtime/session state.

An observed realization may provide evidence for reconciliation but cannot silently overwrite AGWS canonical truth.

## 3. Canonical identity vs realization identity

AGWS surface and layer identities are canonical SB identities. External IDs are typed realization/binding identities only.

A provider-backed component/action therefore uses an explicit relation equivalent to:

`CanonicalSurfaceComponentRef -> Capability/Action Contract -> Provider Binding -> External Realization Identity`.

Provider substitution must preserve the canonical component/action intent when semantics remain qualified. Matching external IDs or labels never establishes canonical identity equivalence by itself.

## 4. Hierarchical authority boundary

The hierarchy is monotonic:

`Enterprise → Station → Role → Person`.

A lower layer may specialize only dimensions delegated by all applicable superior layers. It cannot weaken or remove a superior invariant.

### Enterprise
Owns organization-wide mandatory constraints, globally required components/contracts, admissible capability families, upper-bound policies and delegation envelopes.

### Station
Is the principal AGWS **capability-exposure and delegated-administration boundary**. A Station may expose only a subset of the enterprise capability universe, omit modules, consume qualified capabilities from another/higher SB, and delegate a bounded subset of surface administration downward. Station does not gain authority merely because a provider/capability is discoverable.

### Role
May specialize a Station surface only within the Station's delegated envelope and inherited Enterprise constraints.

### Person
May personalize only dimensions explicitly exposed to that person. Personalization is never implicit schema/domain/process authority.

The effective authority for an AGWS act is the intersection of inherited constraints, explicit delegation, actor authority, current capability exposure and any operation-specific policy. No AI or UI mechanism can widen this set.

## 5. Mandatory component boundary

A component inherited as mandatory by a superior layer cannot be removed by a lower layer. Policy may allow bounded alternate placement, such as a secondary area or less prominent slot, but this is a permitted layout transformation, not removal of the obligation.

The effective-surface resolver must preserve the distinction between:

- **presence required**;
- **position fixed**;
- **position selectable from an allowed set**;
- **visibility/context conditional under superior policy**.

A lower layer cannot reinterpret a mandatory component as optional.

## 6. Layout boundary

AGWS owns constrained composition intent; generic UI owns rendering/realization mechanics.

AGWS accepts layouts only through revisioned allowed contracts such as grids, slots, templates, regions and responsive constraints. Arbitrary frontend code, raw HTML/CSS, unrestricted DOM mutation and unconstrained query/script injection are outside AGWS authority.

A user's request such as “move this panel beside my queue” may materialize only if the target slot relation is allowed by the active layout contract and inherited policy.

## 7. AI materialization boundary

AI is the only materializer of AGWS changes under the Generation 2 hypothesis, but **AI is not an authority source**.

AI may translate intent into a proposed governed-surface revision using known semantic components/contracts. It must not silently:

- create a canonical entity/column/schema;
- change canonical domain invariants;
- weaken authorization/governance;
- invent provider credentials/bindings;
- expand Station capability exposure;
- convert a personal customization into a Role/Station/Enterprise revision;
- issue a canonical workflow/process mutation under surface-edit authority.

If satisfying intent requires authority outside AGWS, the result is an explicit escalation/proposal to the owning capability, not silent materialization.

## 8. Boundary with UI / Generated Experience / Low-code Builder

**UI / Generated Experience** owns component rendering, semantic projection into interaction controls, accessibility realization, responsive rendering behavior, component implementation and generic generated-experience mechanics.

**AGWS** owns who may compose which semantic components, at which hierarchy layer, under what inherited constraints, with what capability exposure, lineage, reversibility and promotion semantics.

Therefore:

- `UI` answers **how a permitted semantic component is rendered/interacted with**;
- `AGWS` answers **whether/how that component may participate in this governed work surface for this hierarchy context**.

Neither owns canonical business entities/processes merely because they display them.

## 9. Boundary with Process & Application Modeling

Process & Application Modeling owns canonical application/domain/process semantics and their evolution. AGWS may project or invoke those semantics through typed contracts but cannot modify them under surface-personalization authority.

A request that requires adding a canonical field/entity, changing process meaning or altering domain invariants leaves AGWS scope and requires an explicit owner-level change proposal.

## 10. Boundary with Authorization / Policy / Organization / Multitenancy

Authorization/Policy is the source of truth for actor authority, delegation policy, organizational/tenant boundaries and permission evaluation.

AGWS owns references to those decisions and the semantics of applying them to surface composition. It does not define authorization truth independently.

Station isolation and delegated administration are therefore jointly expressed:

- Authorization/Policy owns **who has authority and its scope**;
- AGWS owns **which surface/exposure specialization that authority may produce**.

## 11. Boundary with Identity / Authentication / Federation

Identity owns actor/subject identity and authentication/federation assurance. AGWS consumes stable subject/Role/Station context but does not infer identity from browser/session/provider page IDs.

A change of Station/Role/identity context triggers AGWS revalidation; it does not automatically migrate a previously valid personalization into the new authority envelope.

## 12. Boundary with Provider / Binding / Capability Negotiation

Provider/Binding owns provider discovery, support qualification, admission, binding, fallback, coexistence and cutover.

AGWS owns provider-neutral references to capabilities/actions exposed on the surface. It must not bind directly to provider-specific identifiers as canonical page semantics.

A surface component may therefore consume an external capability only through a qualified binding. Provider substitution preserves the surface's canonical intent only when the replacement support vector satisfies the required contract.

## 13. Boundary with Integration & Automation

Integration & Automation owns adapters, triggers, automation execution, external interaction, receipts and ambiguous-effect reconciliation.

AGWS may expose or compose actions/automations but owns only their placement, hierarchy eligibility and surface-local invocation intent.

The authority ladder is explicit:

1. **view personalization** — changes presentation/composition only;
2. **personal action** — invokes an already-authorized action as the actor;
3. **supervised automation** — automation within an explicitly delegated envelope, retaining approval/review where required;
4. **team workflow** — durable shared process owned by Workflow/Integration semantics;
5. **canonical domain/process change** — change owned by Process/Data/Workflow or another canonical owner.

Moving upward never occurs implicitly. Each transition requires the authority and owning-capability contract appropriate to the target level.

## 14. Boundary with Workflow & Durable Execution

Workflow owns durable execution, human tasks, timers, retries, redrive and in-flight process evolution. AGWS may render a task inbox, approval panel or workflow action surface, but page composition does not become workflow definition/execution truth.

A personal surface cannot change a team workflow's canonical semantics merely because it displays or invokes it.

## 15. Boundary with Governance / Compliance / Audit

Governance owns obligation/control applicability, exceptions, remediation and audit semantics. AGWS owns auditable lineage for surface revisions and references applicable governance decisions.

Usage evidence can support a promotion proposal but cannot itself authorize promotion. Promotion from Person → Role/Team/Station/Enterprise is an explicit governed transition with a new authority/application context and revalidation.

## 16. Boundary with Observability / Operations / Incident

Observability owns telemetry/evidence freshness and operational evidence semantics. AGWS may consume usage, failure and adoption evidence for qualification or promotion decisions, but does not redefine telemetry truth.

Stale/partial evidence yields a qualified or `INCONCLUSIVE` decision where required; it is never silently converted into “safe to promote”.

## 17. Boundary with Lifecycle / Versioning / Evolution / Migration

Lifecycle supplies revision/coexistence/currentness/withdrawal primitives. AGWS owns domain-specific surface lineage and postconditions.

AGWS requires independently addressable revisions for at least:

- Enterprise surface/base policy relation;
- Station surface/exposure;
- Role overlay;
- Person overlay;
- layout contract;
- component registry references;
- capability/action contracts/bindings as applicable.

`diff`, `reset` and `rollback` operate against explicit lineage and current eligibility. Historical availability of a revision does not prove rollback eligibility after capability/policy/provider/schema/trust changes.

## 18. Station and hierarchical SB boundary

A Station may be realized by a local SB, a subordinate SB, a subset of a larger SB, or a surface consuming capabilities from another SB. AGWS does not equate these topology choices with semantic Station identity.

Hierarchical management requires explicit contracts for:

- upstream capability exposure;
- delegated administration envelope;
- policy/trust/config revision applicability;
- external/provider binding qualification;
- local/offline closure where applicable;
- evidence/reconciliation after reconnection;
- withdrawal/drainage when upstream exposure changes.

A subordinate Station/SB cannot claim a capability merely because the superior system implements it; exposure must be explicit and qualified.

## 19. Failure semantics

AGWS decisions use explicit outcomes where evidence or applicability matters:

- `VALID` — proposed/effective surface satisfies current hierarchy, policy, layout and referenced capability contracts;
- `DENIED` — requested specialization exceeds authority or violates an invariant;
- `PARTIAL` — only a subset of a proposal can be admitted without crossing boundaries;
- `INCONCLUSIVE` — required policy/binding/evidence/currentness is missing, stale or ambiguous;
- `RECONCILE_REQUIRED` — observed/effective realization cannot safely be assumed equal to desired canonical surface state.

`INCONCLUSIVE` and `RECONCILE_REQUIRED` never imply permission to materialize a broader change.

## 20. Required cross-cutting contracts

Planning A retains the following architecture contracts for later target-architecture design:

1. `GovernedSurfaceIdentity`
2. `SurfaceLayerRevision`
3. `EffectiveSurfaceResolution`
4. `StationCapabilityExposure`
5. `DelegatedSurfaceAdministrationEnvelope`
6. `MandatoryComponentConstraint`
7. `ConstrainedLayoutContract`
8. `SemanticComponentReference`
9. `SurfaceActionCapabilityReference`
10. `SurfaceMaterializationProposal`
11. `SurfaceValidationDecision`
12. `SurfaceLineageAndDiff`
13. `SurfaceResetRollbackEligibility`
14. `SurfacePromotionProposal`
15. `SurfaceUsageEvidenceReference`

These are semantic contracts, not implementation/module declarations.

## 21. Non-goals

AGWS is explicitly **not**:

- an unrestricted website/page builder;
- an HTML/CSS/code editor;
- a schema/entity/domain editor;
- a query-console authority mechanism;
- a workflow engine;
- an authorization engine;
- a provider integration engine;
- an AI-agent authority source;
- a canonical analytics/telemetry store;
- a replacement for generic UI/component rendering;
- a mechanism for lower layers to bypass Enterprise/Station invariants.

## 22. Mandatory proof obligations preserved for later phases

Planning A preserves, without claiming implementation, the nine minimum AGWS proofs:

1. employee composes a useful list/form/grid without creating canonical entity/column state;
2. layout admits only allowed slots/grid/templates, not arbitrary frontend mutation;
3. mandatory superior component cannot be removed and can only move where policy permits;
4. personalization is revalidated on Station/Role change;
5. AI intent requiring domain change is detected and escalated rather than silently materialized;
6. component/action consumes an external capability through binding without provider coupling;
7. personal automation cannot exceed Station/Role authority;
8. personalization has lineage, version, diff, reset and rollback;
9. personal pattern can be promoted by governed evidence to broader scope without losing authority/provenance.

These obligations belong to later SB reconciliation, target architecture and Product Proof/Acceptance phases.

## 23. Planning A disposition

**PASS_FOR_CAPABILITY.** AGWS has an explicit semantic owner, source of truth, non-goals, provider boundary, hierarchy boundary, neighboring-owner relations and preserved proof obligations. No top-level capability split or merge is required by this Planning A pass.

This pass does not close global `PLANNING_A_TAXONOMY_BOUNDARIES`; the remaining canonical capabilities still require their own boundary reconciliation.