# Generation 2 — Planning C C3.4: Adaptive Governed Work Surfaces (AGWS) Target

Status: **DECIDED / PASS FOR CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: **Adaptive Governed Work Surfaces (AGWS)**  
Decision scope: canonical target architecture for capability 4/28 only.  
Entry branch head revalidated before persistence: `6f68b76f821ab57d61f77b1f6928935213954100`.

This record decides only C3.4. It does not implement product code, choose package/storage topology, materialize WBS/TASKs, execute Construction, decide C3.5+, or enter Planning D/E.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — C3.4 is the sole authorized next action;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_C_C3_01_UNIVERSAL_CAPABILITY_ARCHITECTURE_TARGET.md`;
- `PLANNING_C_C3_02_PROCESS_APPLICATION_MODELING_TARGET.md`;
- `PLANNING_C_C3_03_UI_GENERATED_EXPERIENCE_LOW_CODE_TARGET.md`;
- `PLANNING_A_ADAPTIVE_GOVERNED_WORK_SURFACES_BOUNDARIES.md`;
- `PLANNING_B_ADAPTIVE_GOVERNED_WORK_SURFACES_SB_CURRENT_STATE.md`;
- inherited adversarial closure: 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 findings.

Constitutional invariants:

- `governed surface != authorization truth`;
- `visibility != authority`;
- `personalization != delegation`;
- `capability discoverability != Station exposure`;
- `Fleet observation != local truth/control authority`;
- `rendered realization != canonical AGWS truth`;
- `AI proposal = candidate`, never promotion or authority;
- `provider identity != canonical surface/component identity`;
- `answered != understood != evidence sufficient != implementation-ready != production-ready`.

## 2. Decision summary

**C3.4-DEC-001 — AGWS owns revisioned governed-surface composition and effective exposure under inherited hierarchy; it does not own generic rendering or permission truth.**

Generation 2 adopts AGWS as a canonical semantic capability positioned between owner-issued authority/context and generic UI realization. Its canonical source of truth is a revisioned governed-surface graph plus explicit layer lineage and foreign authority/context references.

The governing hierarchy is:

`Enterprise -> Station -> Role -> Person`

with monotonic inheritance: a lower layer may specialize only dimensions delegated by all applicable superior layers and can never weaken a superior invariant.

AGWS owns:

1. governed surface identity and revisions;
2. hierarchy-layer overlays and precedence;
3. Station capability exposure semantics;
4. delegated surface-administration envelopes as references to Authorization-owned authority;
5. mandatory inherited component/control constraints;
6. effective-surface computation;
7. bounded personalization, diff/reset/rollback and promotion semantics;
8. surface-local capability/action exposure references;
9. revalidation and reconciliation when context/revisions change;
10. lineage/evidence for human-, Wizard- and AI-proposed surface changes.

AGWS does not own rendered UI implementation, canonical domain/data/workflow truth, actor identity, authorization decisions, provider admission, external-effect truth, deployment/runtime convergence, telemetry truth or physical actuation.

## 3. Canonical responsibilities and explicit non-responsibilities

### 3.1 Canonical responsibilities

AGWS is responsible for:

- defining reusable governed work-surface semantics independent of web/native renderer or provider page metadata;
- representing Enterprise, Station, Role and Person layers as independently revisioned semantic overlays;
- resolving the effective surface from applicable layers, current hierarchy context, admitted Station exposure and referenced authority decisions;
- preserving mandatory inherited components and superior constraints;
- expressing which dimensions a lower layer may specialize;
- exposing capabilities/actions only through typed canonical references and qualified bindings;
- distinguishing view personalization, personal action, supervised automation, team workflow and canonical domain/process change;
- validating surface proposals without absorbing the semantic ownership of referenced capabilities;
- preserving proposal, promotion, supersession, rollback and reconciliation lineage;
- expressing `PARTIAL`, `INCONCLUSIVE` and `RECONCILE_REQUIRED` rather than false-completing ambiguous resolution;
- emitting realization requirements to UI and Provider/Binding;
- carrying capability-specific elicitation/readiness obligations.

### 3.2 Non-responsibilities

AGWS must never become:

- an authorization/policy decision engine;
- a generic page/DOM/CSS/code editor;
- a schema/domain/process editor;
- a workflow runtime or scheduler;
- an integration/external-effect engine;
- a provider/catalog admission engine;
- a Fleet omniscient state owner;
- a deployment/runtime adoption owner;
- a telemetry/audit truth owner;
- a physical/peripheral actuation plane;
- an AI authority source.

## 4. Owned semantic types and foreign references

**C3.4-DEC-002 — AGWS owns governed-surface and overlay semantics through typed definitions; all neighboring truths remain foreign refs.**

Target owned type families include:

### Surface identity and hierarchy

- `GovernedSurfaceDefinition`
- `GovernedSurfaceRevision`
- `SurfaceLayerDefinition`
- `SurfaceLayerRevision`
- `SurfaceLayerKind` = `ENTERPRISE | STATION | ROLE | PERSON`
- `SurfaceApplicabilityContext`
- `EffectiveSurfaceResolution`
- `EffectiveSurfaceRevisionVector`

### Station exposure and delegation

- `StationCapabilityExposure`
- `StationCapabilityExposureRevision`
- `DelegatedSurfaceAdministrationEnvelopeRef`
- `SurfaceSpecializationAllowance`
- `SurfaceExposureConstraint`

### Component/control composition

- `GovernedComponentOccurrence`
- `MandatoryComponentConstraint`
- `ComponentPlacementAllowance`
- `SurfaceCapabilityReference`
- `SurfaceActionReference`
- `ConstrainedLayoutReference`
- `InheritedControlReference`

### Personalization and evolution

- `SurfacePersonalizationProposal`
- `SurfaceMaterializationProposal`
- `SurfaceValidationDecision`
- `SurfaceSemanticDiff`
- `SurfaceResetEligibility`
- `SurfaceRollbackEligibility`
- `SurfacePromotionProposal`
- `SurfacePromotionDecision`
- `SurfaceUsageEvidenceReference`
- `SurfaceReconciliationState`

Foreign references include Identity subject/context refs; Authorization policy/decision/delegation refs; UI `ExperienceDefinition` and `ComponentSemanticContract` refs; Process/Application/Data semantic refs; Workflow task/action refs; Integration operation refs; Provider/Binding refs; Governance obligations; Observability evidence; Lifecycle coexistence/migration refs; Deployment/runtime adoption refs; C1 Elicitation/Coverage refs; and bounded Physical/Peripheral integration refs.

Embedding a foreign ref never transfers semantic ownership.

## 5. Enterprise -> Station -> Role -> Person resolution

**C3.4-DEC-003 — Effective surface resolution is deterministic, monotonic and revision-qualified.**

Resolution conceptually evaluates:

`Enterprise base + Station admitted specialization/exposure + Role specialization + Person personalization + current foreign constraints -> EffectiveSurfaceResolution`

The resolver must preserve, where applicable:

- each contributing layer identity and immutable revision;
- hierarchy/context identity (enterprise, station, role, person);
- authority/delegation decision refs and producing revisions;
- Station capability exposure revision;
- referenced UI/component/layout contract revisions;
- referenced capability/action/provider-binding revisions;
- tenant/site applicability;
- unresolved/stale/unsupported obligations;
- semantic diff against prior effective resolution;
- proof/currentness horizon.

Lower-layer composition is subtractive/constraining by default: it may choose among allowed options or add explicitly delegated elements, but cannot delete mandatory superior obligations or manufacture an unavailable capability.

A Role/Person context change invalidates prior effective resolution unless the new context explicitly requalifies it. A cached surface is a realization, not authority to reuse the previous envelope.

## 6. Station as capability-exposure and delegated-administration boundary

**C3.4-DEC-004 — Station exposure is explicit semantic admission, never inferred from catalog/provider availability.**

`StationCapabilityExposure` must state which canonical capability/action contracts are available to a Station and under which qualifications. It may reference provider support/bindings, site locality, lifecycle and operational constraints, but provider discoverability is never sufficient.

A Station may:

- expose a qualified subset of an Enterprise capability universe;
- omit capabilities entirely;
- consume capabilities supplied by another/higher SB through federated contracts;
- delegate bounded surface administration downward;
- retain local/offline-qualified exposure where C0 `QualifiedLocalClosure` permits it.

It cannot:

- broaden Authorization-owned permission;
- infer exposure from installed/provider-visible functionality;
- convert upstream implementation presence into local authority;
- expand physical/peripheral operation classes beyond C2 bounds.

`DelegatedSurfaceAdministrationEnvelopeRef` points to owner-issued Authorization semantics and adds AGWS-specific specialization dimensions; it does not reissue canonical permission truth.

## 7. Mandatory inherited components and controls

**C3.4-DEC-005 — Mandatory inheritance is semantic and cannot be erased by visual transformation.**

AGWS distinguishes at least:

- `PRESENCE_REQUIRED`;
- `POSITION_FIXED`;
- `POSITION_ALLOWED_SET`;
- `VISIBILITY_CONDITIONAL_UNDER_SUPERIOR_POLICY`;
- `INTERACTION_REQUIRED` where a required control must remain operable.

A lower layer cannot reinterpret `PRESENCE_REQUIRED` as optional. UI may realize alternate responsive placements only if the governing placement allowance permits it and accessibility remains satisfied.

Hiding, collapsing, moving off-screen, provider omission or personalization cannot count as satisfying/removing an obligation unless the superior semantic rule explicitly allows that realization.

## 8. Boundary with UI / Generated Experience / Low-code Builder

**C3.4-DEC-006 — AGWS consumes UI portable experience/component contracts; it does not absorb generic UI ownership.**

C3.3 UI owns how semantic components and experiences are projected/rendered. AGWS owns whether a UI semantic component may participate in a governed surface for the current hierarchy/context.

The directional contract is:

`UI component/experience contract -> AGWS governed occurrence/exposure -> EffectiveSurfaceResolution -> UI realization`

AGWS may constrain placement, presence, eligibility and exposure but cannot redefine component accessibility/render semantics. UI may render the result but cannot widen Station exposure, remove mandatory inherited controls, reinterpret personalization as delegation or fabricate authorization.

## 9. Authority, Identity, Governance, Workflow, Integration and Observability boundaries

**C3.4-DEC-007 — AGWS composes foreign decisions; it never strengthens them.**

- **Identity** owns subject/person/session/federation assurance. AGWS consumes identity context and revalidates on change.
- **Authorization** owns permission/delegation truth. AGWS applies qualified refs to composition/exposure.
- **Governance** owns obligation/control applicability, exception/waiver and compliance disposition. AGWS carries mandatory/control refs and audit lineage.
- **Workflow** owns durable task/process state. AGWS may expose task surfaces but cannot complete work by visual state alone.
- **Integration** owns external interaction/effect/reconciliation. AGWS exposes invocation intent, not external-effect truth.
- **Observability** owns telemetry/evidence semantics. AGWS consumes qualified evidence for readiness/promotion/currentness without turning telemetry into authority.

The explicit ladder remains:

`view personalization < personal action < supervised automation < team workflow < canonical domain/process change`.

Crossing a level requires the target owner's contract and authority; surface editing cannot implicitly promote an act upward.

## 10. Personalization, promotion, diff, reset and rollback

**C3.4-DEC-008 — Personalization is bounded local specialization; promotion is a new governed decision.**

Person-level changes may only affect dimensions exposed by the active superior constraints. They retain explicit base-revision lineage and do not mutate Role/Station/Enterprise definitions.

`SurfaceSemanticDiff` must distinguish at least:

- component added/removed where allowed;
- component moved/resized within allowed placement;
- variant/preference changes;
- action/capability exposure change requests;
- changes that actually require foreign-owner mutation.

`reset` restores against an explicit eligible base, not an assumed current default.

`rollback` requires current compatibility with all materially referenced revisions, including superior surface layers, UI/component contracts, authorization/policy, capability exposure, provider binding, lifecycle and governance constraints. Historical existence alone does not prove rollback eligibility.

Promotion Person -> Role -> Station -> Enterprise is always a proposal followed by owner-authorized validation and a new revision. Usage/adoption evidence can support the decision but cannot authorize it.

## 11. Provider/binding, portability and federated realization

**C3.4-DEC-009 — AGWS canonical semantics remain provider-neutral and topology-neutral.**

Surface capability/action refs use canonical semantic identities and `CapabilityRequirement`; Provider/Binding resolves realizations through support vectors. External page/workspace/app IDs remain `RealizationIdentityRef`s.

Provider substitution is allowed only when the replacement support vector preserves the required semantic contract. Unsupported dimensions remain explicit and may yield `PARTIAL` or `INCONCLUSIVE`.

A Station may be local, subordinate, federated or supplied from another SB. Topology never defines Station semantic identity. Federated exposure must preserve bilateral contract revision, authority/locality, currentness, failure responsibility and reconciliation boundaries.

Fleet/global views are qualified observations. A Fleet observation or command does not prove every Station locally adopted, applied or converged a surface/exposure revision.

## 12. Lifecycle, revision, coexistence and currentness

**C3.4-DEC-010 — Surface history is immutable; effective resolutions are revision-vector qualified and coexistence is explicit.**

The architecture must support independent revision dimensions for Enterprise surface, Station surface/exposure, Role overlay, Person overlay, UI/component contracts, authorization/policy, provider binding, governance constraints and deployment/runtime realization where material.

Open sessions, offline Stations and residual runtimes may remain on older allowed revisions. Such cohorts are explicit and may require drain, migration, reconciliation or withdrawal.

A previously valid surface does not remain valid after relevant context/policy/exposure/provider revisions unless its currentness profile still qualifies it.

## 13. `VALID`, `DENIED`, `PARTIAL`, `INCONCLUSIVE`, `RECONCILE_REQUIRED`

**C3.4-DEC-011 — AGWS validation is non-binary.**

`SurfaceValidationDecision` supports at least:

- `VALID` — current hierarchy, exposure, authority and referenced contracts qualify the proposed/effective surface;
- `DENIED` — a requested specialization violates authority or a superior invariant;
- `PARTIAL` — only a bounded subset can be admitted;
- `INCONCLUSIVE` — required authority/evidence/binding/currentness is missing, stale or ambiguous;
- `RECONCILE_REQUIRED` — observed/runtime realization cannot safely be assumed equal to desired canonical surface state.

`INCONCLUSIVE`, stale evidence or `UNKNOWN` downstream effect never means “allow by default”.

## 14. Provenance, evidence and audit

**C3.4-DEC-012 — AGWS retains decision lineage without treating provenance as truth.**

Every material surface proposal/promotion/resolution should be able to reference:

- actor/source and proposal kind (human/Wizard/AI/import/Brownfield);
- question/elicitation evidence that motivated it;
- base layer/revision vector;
- authority/delegation refs;
- semantic diff;
- validation result and unresolved obligations;
- evidence used for promotion/readiness;
- admitted revision and supersession lineage;
- realization/adoption/reconciliation evidence where applicable.

AI-generated or Brownfield-observed patterns remain candidates. Usage frequency, screenshots, DOM state or telemetry cannot independently promote them into canonical broader-scope truth.

## 15. Security, privacy, trust and accessibility

**C3.4-DEC-013 — Governed composition must remain least-authority, scope-safe and accessible.**

AGWS must preserve tenant/enterprise/site/person isolation across caches, overlays, provider IDs and generated materializations. Surface content and evidence obey Data/Privacy owner minimization/retention rules.

Cryptographic/provider trust does not imply permission; permission does not imply Station exposure; exposure does not imply physical actuation.

Mandatory inherited components and alternate placement must remain compatible with C3.3 accessibility requirements. A personalization that makes an obligatory control inaccessible is invalid even if visually renderable.

## 16. Operability, performance, capacity and readiness

**C3.4-DEC-014 — Effective-surface resolution and realization have independent operability obligations.**

AGWS-specific Production Readiness Coverage must consider, where applicable:

- resolution latency and cache strategy;
- expected/peak concurrent surface resolution/materialization;
- invalidation fan-out after Enterprise/Station/Role changes;
- queue/backlog for asynchronous recomputation or promotion workflows;
- stale-cache/currentness horizons;
- offline Station behavior and local closure;
- provider/component dependency health;
- degraded and `INCONCLUSIVE` modes;
- rollback/reconciliation procedures;
- owner/escalation/on-call responsibility;
- telemetry coverage and alertability;
- capacity headroom and tenant/site isolation.

`feature works in one browser` is not Production Readiness proof. Neither a cached green surface nor Fleet aggregate health establishes local effective-surface correctness.

## 17. AGWS Elicitation Lens

**C3.4-DEC-015 — AGWS receives a capability-specific Elicitation Lens under C1, not a standalone questionnaire.**

The lens must adaptively ask and gather evidence for at least:

- purpose and users of each governed work surface;
- Enterprise/Station/Role/Person hierarchy and exceptional contexts;
- semantic owner of every exposed capability/action;
- which components/controls are mandatory and at what layer;
- which dimensions lower layers may personalize;
- Station capability exposure and locality/provider constraints;
- delegated administration limits and escalation path;
- tenant/site/device/offline applicability;
- workflows/actions/external effects invoked from the surface;
- evidence/currentness needed to consider a surface valid;
- promotion/reset/rollback expectations;
- accessibility/security/privacy constraints;
- SLO/SLA, expected/peak load, stale tolerance, failure/recovery and operational ownership;
- unresolved questions whose absence blocks abstraction, candidate architecture, implementation or publish/operation.

Follow-ups must trigger on contradictions such as “role can customize everything” versus mandatory Enterprise controls, provider availability claimed as exposure, or Person personalization claimed to alter workflow/domain semantics.

Coverage remains multidimensional and cannot collapse critical authority/exposure/currentness gaps into one average score.

## 18. Inherited adversarial proof obligations

Planning E must later establish, at minimum:

1. useful Person personalization without canonical schema/domain mutation;
2. lower layer cannot remove mandatory superior component/control;
3. layout changes remain inside C3.3/AGWS allowed contracts;
4. Station/Role/Person context change invalidates or requalifies prior effective surface;
5. catalog/provider discoverability does not become Station exposure;
6. UI visibility never grants protected action authority;
7. personal automation cannot exceed Station/Role/Authorization envelope;
8. provider substitution preserves portable semantic intent or fails explicitly;
9. stale/partial authority, binding or Fleet evidence yields `INCONCLUSIVE`/reconciliation, not false `VALID`;
10. diff/reset/rollback preserve revision lineage and compatibility checks;
11. usage evidence supports but cannot authorize promotion;
12. AI/Wizard proposal requiring domain/workflow/policy change routes to the semantic owner;
13. offline/local Station behavior does not broaden authority and reconciles after reconnect;
14. Physical/Peripheral integration remains C2-bounded and does not inherit actuation authority from surface exposure;
15. critical elicitation/Production Readiness gaps prevent false-complete status.

These are proof obligations, not implementation claims.

## 19. Planning D migration constraints

Planning D must preserve an incremental path from current flat `SystemDefinition.views` and generated-view bindings:

- keep existing flat views as generic UI/generated-experience predecessor semantics;
- do not reinterpret legacy `views[].id` as fully governed AGWS identity;
- introduce AGWS as an additive semantic layer that may reference existing experience/view definitions;
- preserve renderer-agnostic bindings and deterministic reference validation;
- introduce Station identity/exposure explicitly rather than infer it from existing role/organization/catalog fields;
- allow free-form/personalization notes and AI proposals to coexist with structured governed surface revisions during migration;
- backfill provenance only where evidence supports it; unknown historical authority/currentness remains unknown;
- support mixed cohorts where some runtimes consume flat views and others consume resolved governed-surface artifacts;
- keep generated runtimes Builder-independent by materializing qualified effective-surface artifacts/contracts rather than creating Runtime -> Builder coupling;
- preserve provider IDs as realization identities only.

## 20. Planning E proof candidates

Planning E should produce product proofs for:

- deterministic effective-surface resolution from explicit layer revisions;
- monotonic inheritance and mandatory-component preservation;
- bounded Station exposure and delegated administration;
- authority non-amplification across visibility/personalization/automation;
- cross-context revalidation and stale-state detection;
- UI/AGWS separation and portable component consumption;
- provider substitution and unsupported-dimension handling;
- lifecycle coexistence, diff/reset/rollback and reconciliation;
- evidence-qualified promotion;
- AI/Wizard proposal routing without implicit owner mutation;
- tenant/site/offline/Fleet currentness boundaries;
- operability/readiness and no false complete state;
- C2 Physical/Peripheral bounded integration behavior.

## 21. Decision disposition

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

AGWS is retained as a distinct canonical capability. Its architecture is a revisioned governed-surface composition and effective-resolution layer over `Enterprise -> Station -> Role -> Person`, consuming Authorization/Identity/Governance and canonical capability refs while delegating rendering to C3.3 UI and provider realization to Provider/Binding.

The decision preserves the critical boundaries:

`governed surface != authorization truth`  
`visibility != authority`  
`personalization != delegation`  
`Station exposure != provider/catalog availability`  
`Fleet observation != local truth/control authority`  
`AI proposal != promotion authority`.

No product code changed. No C3.5+ or later phase was executed.
