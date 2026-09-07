# Generation 2 — Planning C C3.8: Authorization / Policy / Organization / Multitenancy Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Authorization / Policy / Organization / Multitenancy`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated immediately before persistence: `d652449e4fd6b9a85f234cfc7b3af4989822a446`.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `RESEARCH_PIPELINE_STATE.json` — C3.8 is the only authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_C_C3_07_IDENTITY_AUTHENTICATION_FEDERATION_TARGET.md`;
- `PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`;
- `PLANNING_B_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_SB_CURRENT_STATE.md`;
- inherited adversarial inventory: 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings, with zero HIGH/CRITICAL lacking owner/proof/detection route.

Standing constitutional invariants:

- `authentication != authorization`;
- `visibility != authority`;
- `provider credential/group/role/grant != canonical authority`;
- `stale policy decision != current authorization`;
- `delegation != ownership transfer`;
- `external group/role != canonical permission`;
- `Fleet observation/control intent != local applied authority`;
- `AI recommendation != policy/permission mutation authority`;
- `policy decision != external effect proof`;
- `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## 2. Decision summary

Planning C adopts a **revision-qualified, provider-neutral Canonical Authorization & Organizational Authority Plane** specialized over C0 authority, identity, evidence, currentness, revision and residual-cohort primitives.

The capability owns the semantics required to answer:

1. whether a canonical subject may perform a canonical action on a canonical resource;
2. under which Enterprise/organization/tenant/Station/Role scope that authority exists;
3. which revisioned policy, assignment, delegation, approval or emergency grant produced the decision;
4. whether that decision is current, complete, locally applicable or `INCONCLUSIVE`;
5. which authority-bearing consumers or external realizations still retain older grants after supersession/revocation;
6. how cross-tenant, cross-Station, provider-backed and offline/local authority remains bounded and auditable.

The architecture preserves the useful current SB foundation — explicit role bindings, role/resource/action permissions, structured policies, compiler validation, default deny and deterministic evidence — and **hardens/generalizes** it rather than replacing it.

Authorization does not own canonical subject identity/authentication, UI/AGWS composition, provider discovery/admission, generic workflow execution, generic compliance truth, privacy purpose legality, secret storage, physical truth, or Fleet truth.

## 3. C3.8-DEC-001 — Authorization uses canonical subject facts from C3.7 but owns authority truth

Every authorization request references a C3.7 `CanonicalSubjectRef` or an explicitly supported non-human principal identity plus qualified authentication/session evidence where policy requires it.

Authentication may establish that a subject is currently authenticated with particular assurance/currentness. It never produces permission by itself.

Authorization owns:

- canonical action identity;
- canonical resource/capability target;
- organization/tenant/Station/Role scope;
- policy applicability;
- delegation and assignment applicability;
- approval/SoD/break-glass conditions;
- authorization decision and rationale;
- authorization currentness and residual authority state.

`AUTHENTICATED -> ALLOW` is never an implicit transition.

## 4. C3.8-DEC-002 — Canonical organizational and authority identities are first-class and revisioned

The target architecture requires distinct logical identities for at least:

- `EnterpriseScopeRef`;
- `OrganizationRef`;
- `TenantRef`;
- `StationRef`;
- `RoleRef`;
- `AuthorityAssignmentRef`;
- `PolicyRef` and `PolicyRevisionRef`;
- `DelegationEnvelopeRef`;
- `TemporaryAuthorityGrantRef`;
- `BreakGlassGrantRef`;
- `ApprovalRequirementRef` / `ApprovalOccurrenceRef`;
- `SeparationOfDutiesConstraintRef`;
- `StationCapabilityExposureAuthorityRef`;
- `AuthorizationDecisionRef`;
- `AuthorizationEvaluationOccurrenceRef`;
- `ResidualAuthorityCohortRef`;
- external/provider policy/group/grant realization references.

Provider tenant IDs, directory group IDs, role names, token scopes and policy-engine IDs remain realization identities/evidence unless an explicit governed mapping/adoption transition says otherwise.

## 5. C3.8-DEC-003 — Enterprise → Station → Role → Person is monotonic and non-amplifying

The canonical delegation hierarchy is:

`Enterprise → Station → Role → Person/Principal`.

It is not a simple inheritance chain. Effective authority is the intersection of:

- superior mandatory constraints;
- explicitly delegated authority envelope;
- current Station capability exposure authority;
- current role/person/principal assignments;
- action/resource-specific policy;
- tenant/organization/site scope;
- required authentication/assurance/currentness facts;
- applicable approval/SoD/emergency rules.

Lower scopes may narrow authority. They may broaden only where the superior envelope explicitly delegates that dimension. No local policy, UI customization, provider grant, AI suggestion, offline cache or Fleet command can exceed the superior envelope.

Delegation never transfers semantic ownership of the capability or policy domain.

## 6. C3.8-DEC-004 — Policy is definition + immutable revision + applicability, not mutable text

A canonical policy has stable identity and immutable revisions. A material policy revision preserves:

- policy identity and revision;
- effective interval/activation state;
- scope and applicability predicate;
- subject/action/resource selectors;
- organization/tenant/Station applicability;
- inherited constraints and override eligibility;
- approval/SoD/delegation requirements;
- effect semantics;
- referenced semantic expressions/decision predicates;
- provenance/authority of change;
- supersession lineage;
- evidence/currentness dependencies.

Free-text governance statements may be linked evidence/documentation but are not executable authority unless represented by an executable canonical policy form.

A policy language/provider DSL is a realization, not canonical semantics.

## 7. C3.8-DEC-005 — Authorization decisions are revision-qualified evidence objects

An `AuthorizationDecision` carries at least:

- decision identity and evaluation occurrence;
- subject/principal ref;
- action and resource refs;
- organization/tenant/Station/Role context;
- policy revisions used;
- assignment/delegation/grant revisions used;
- relevant authentication assertion/session facts;
- required provider/external evidence refs;
- evaluation time and effective/currentness horizon;
- decision disposition;
- rationale/reason/evidence lineage;
- evaluator/provider/binding identity where applicable;
- local/offline/degraded qualification;
- unresolved/partial-input details.

Required dispositions are at least:

- `ALLOW`;
- `DENY`;
- `INCONCLUSIVE`.

`INCONCLUSIVE` means authority cannot be safely established from current qualified evidence. It is not a soft allow. High-risk/authority-expanding operations default fail-closed unless an explicit superior policy defines a bounded alternative.

## 8. C3.8-DEC-006 — Decision currentness is independent from historic correctness

A decision can remain historically correct under revision `R` while no longer being valid for the present request.

Applicability-bearing changes include at least:

- policy revision;
- subject lifecycle/assurance/session state;
- role or membership assignment;
- delegation/grant state;
- organization/tenant/Station relationship;
- Station capability exposure;
- provider/binding/profile revision;
- approval/SoD state;
- resource classification;
- relevant contextual facts.

Therefore:

`historic ALLOW under R != current ALLOW under R+1`.

Long-running or queued work must carry the authorization revision/context it was admitted under and must re-evaluate at later effect boundaries whenever the applicable policy requires current authority.

## 9. C3.8-DEC-007 — Temporary delegation, emergency/break-glass and subdelegation are explicit authority objects

Temporary and emergency authority is never represented as informal metadata or a permanent role mutation.

Each grant carries at least:

- issuing authority;
- beneficiary/principal;
- allowed actions/resources/capabilities;
- organization/tenant/Station scope;
- start/expiry/revocation condition;
- superior delegation envelope;
- subdelegation eligibility;
- required approvals/SoD exceptions;
- reason/purpose;
- evidence/provenance;
- policy/revision context;
- residual-cohort/reconciliation state after termination.

Break-glass is a specialized governed grant. It can increase effective authority only inside a superior-policy-defined emergency envelope and must remain separately observable/reviewable.

Expiry/revocation does not prove caches, sessions, tokens, workers, provider grants or subordinate evaluators have stopped honoring the grant.

## 10. C3.8-DEC-008 — Separation of duties and approval semantics are first-class

SoD cannot be reduced to role names alone. A constraint may prohibit combinations across:

- role assignments;
- request/approval/execution actors;
- resource ownership and approval;
- policy authoring and policy activation;
- deployment/change authoring and release approval;
- commercial rating/billing and settlement approval;
- security exception creation and approval.

An approval is an occurrence with actor, authority, scope, decision, revision, time/currentness and evidence. `approval recorded != operation authorized forever`.

Where an operation requires N-of-M, multi-stage, independent or sequential approvals, those semantics are explicit and revision-qualified. AI may prepare recommendations/evidence but cannot satisfy a human/authority approval requirement unless the policy explicitly defines an authorized machine principal for that approval class.

## 11. C3.8-DEC-009 — Station capability exposure is authorization truth distinct from AGWS presentation

Authorization owns whether a Station may expose/administer/consume a canonical capability or operation. AGWS owns how already-permitted exposure is materialized in a governed work surface.

Hence:

`provider/capability discovered != Station exposure authorized`;

`Station exposure authorized != Person authorized for every action`;

`action visible != action authorized`.

Station exposure changes are revisioned authority transitions and can participate in inherited Enterprise constraints.

## 12. C3.8-DEC-010 — Tenant/organization isolation is semantic, not merely physical partitioning

A tenant boundary is a canonical authority scope, not a database partition key or provider account label.

The architecture requires explicit rules for:

- same-tenant access;
- cross-tenant access;
- cross-Station access;
- shared-service principals;
- Enterprise-level delegated administration;
- provider accounts hosting multiple tenants/sites;
- federated/local autonomous sites;
- temporary support/incident access.

A shared provider namespace or infrastructure topology cannot collapse tenant identities or grants. Cross-tenant access is explicit, bounded, attributable and reviewable.

## 13. C3.8-DEC-011 — External provider groups/roles/grants are evidence and realizations, not canonical authority

External directory memberships, IdP groups, SaaS roles, cloud IAM grants, device/VMS/access-control roles and provider-native policy decisions enter the graph as qualified evidence/realization state.

Governed mapping can produce a candidate or adopted canonical assignment only when:

- external namespace and provider/binding revision are known;
- mapping policy revision is known;
- tenant/site/resource/action semantics are compatible;
- evidence is current enough;
- collision/ambiguity is absent or dispositioned;
- adoption authority exists.

A matching string such as `admin`, `owner`, `manager` or `operator` has no canonical authority meaning by itself.

Provider-side authorization can realize a canonical decision or downstream grant but never silently replace the canonical authority model.

## 14. C3.8-DEC-012 — Revoke/deprovision is a convergence process with residual authority cohorts

Authority withdrawal has separable stages:

`canonical revoke/supersede -> propagation requested -> provider/evaluator/cache/session update -> effective enforcement observed -> residual cohort drained/reconciled`.

Residual authority cohorts may include:

- cached authorization decisions;
- sessions/tokens carrying older claims;
- long-running workers/jobs;
- offline/local policy snapshots;
- provider IAM/group/role grants;
- subordinate Station caches;
- queued work already admitted;
- edge gateways/connectors;
- emergency grants not yet drained.

`revoke accepted != authority eliminated everywhere`.

Where remote revoke/deprovision outcome is ambiguous, state becomes `UNKNOWN`/`PARTIAL` and follows reconcile-before-retry where duplicate/repeated mutation is unsafe.

## 15. C3.8-DEC-013 — In-flight work crosses policy revisions explicitly

Workflow, Integration, durable jobs and queues must preserve the authorization context under which an occurrence was admitted.

Policy evolution may choose, by explicit policy class:

- grandfather under producing revision;
- re-evaluate before next protected step;
- suspend until reauthorized;
- cancel/compensate;
- continue only inside a bounded local closure.

The choice is not universal and must be declared by the owning operation/policy. A queued authorization result cannot silently be upgraded to `latest` or remain valid indefinitely.

Historical replay can explain why an action was permitted at the time without claiming it remains permitted now.

## 16. C3.8-DEC-014 — Local/offline authorization is bounded QualifiedLocalClosure

A generated system may evaluate authorization while disconnected only through an explicit `OfflineAuthorizationClosure`/C0 `QualifiedLocalClosure` that defines:

- eligible subjects/principals/actions/resources;
- retained policy and assignment revisions;
- retained authentication/currentness evidence;
- maximum disconnected/currentness horizon;
- clock/time assumptions;
- excluded authority-expanding/high-risk operations;
- provider/site dependencies that must remain healthy;
- residual revocation uncertainty;
- local audit evidence requirements;
- reconnect requalification/reconciliation.

Loss of upstream/Fleet connectivity cannot increase authority. Once required evidence exceeds its horizon, evaluation is `INCONCLUSIVE` or fail-closed according to policy.

## 17. C3.8-DEC-015 — Fleet is an observation and governed orchestration plane, not authority source by aggregation

Fleet may aggregate:

- policy/revision adoption state;
- deny/inconclusive rates;
- stale evaluators/caches;
- residual authority cohorts;
- provider propagation state;
- cross-tenant anomalies;
- authorization queue/backlog;
- evaluation latency/capacity;
- offline closure age;
- unresolved revoke/deprovision effects.

Global aggregation cannot manufacture a stronger local fact. Fleet control intent must itself be authorized and the target site must report actual application/effect/currentness.

`Fleet desired policy != local applied policy != local current decision`.

## 18. C3.8-DEC-016 — Policy evaluation/admission is a capacity-bearing service

Authorization is not modeled as a zero-cost pure boolean. Production semantics include:

- expected/peak evaluation rate;
- decision latency budget;
- cache/currentness trade-offs;
- policy/admission queue depth and age;
- provider/evaluator quotas;
- timeout and `INCONCLUSIVE` behavior;
- dependency health;
- overload/fairness/isolation between tenants/sites;
- reconciliation throughput for revoke/policy change;
- capacity headroom and degradation rules.

Overload cannot be resolved by implicitly widening cached decision lifetime or fail-opening privileged requests. Queue priority does not manufacture authority.

## 19. C3.8-DEC-017 — Brownfield authority assimilation preserves observed-vs-canonical distinction

Mirroring-first Brownfield discovery may ingest:

- directory groups and memberships;
- application-local roles;
- ACLs;
- provider/cloud IAM grants;
- spreadsheet/manual approval rules;
- support/admin bypasses;
- database grants;
- device/VMS/access-control operator roles;
- undocumented emergency practices.

These enter as `Fact`, `Claim`, `InferredCandidate`, `Unknown`, `Conflict` or another C1 epistemic state with provenance/currentness. Observed grants do not automatically become desired canonical policy.

Conflicting sources remain explicit. Tacit/manual authority must be surfaced as unresolved or mapped evidence rather than silently discarded.

## 20. C3.8-DEC-018 — Authorization Elicitation Lens

The capability-specific Elicitation Lens extends C1 and must adaptively cover at least:

- protected actions/resources/capabilities and why they are protected;
- canonical subjects/principal classes;
- Enterprise/organization/tenant/Station hierarchy;
- Role meaning and assignment authority;
- mandatory inherited denies/constraints;
- delegable dimensions and subdelegation;
- temporary/break-glass paths;
- SoD and approval requirements;
- external provider groups/roles/grants and mapping evidence;
- cross-tenant/cross-Station/support access;
- policy revision/currentness expectations;
- in-flight work after policy changes;
- revoke/deprovision convergence;
- offline/degraded authority;
- decision latency/SLO/peak load/queue/backlog;
- evidence/audit/retention/privacy requirements;
- provider substitution/coexistence;
- ownership/escalation/on-call;
- recovery/reconciliation validation;
- Production Readiness Coverage.

High-risk unknowns/contradictions cannot be hidden by average coverage. `N/A` on privileged access, revoke propagation, tenant isolation, emergency access, decision currentness or production readiness requires evidence-backed applicability disposition.

## 21. C3.8-DEC-019 — Operability and Production Readiness Coverage are separate from policy completeness

A policy model may be semantically complete while authorization is not ready for operation.

Production Readiness Coverage must independently establish, where applicable:

- SLO/SLA and decision latency;
- expected/peak load;
- queue/backlog and headroom;
- policy/evaluator/provider dependency health;
- timeout/`INCONCLUSIVE` behavior;
- cache/currentness bounds;
- revoke propagation targets;
- residual-cohort observability;
- tenant isolation under overload;
- degraded/offline rules;
- recovery/reconciliation procedures;
- ownership/escalation/on-call;
- alertability and evidence retention;
- post-change/deploy authorization validation.

`feature complete != authorization production ready`.

## 22. C3.8-DEC-020 — Privacy, Governance, Workflow, Provider and Physical boundaries remain explicit

- **Privacy/Data Governance** may independently prohibit or qualify a use even if Authorization says `ALLOW`; authorization does not prove lawful/purpose-compatible processing.
- **Governance/Compliance/Audit** owns control/obligation/waiver/assessment truth; a waiver does not create operational permission unless an explicit authorization transition is authorized.
- **Workflow/Durable Execution** owns execution lifecycle; task assignment/visibility does not grant permission.
- **Integration & Automation** owns external effect execution; possessing credentials or receiving an event does not grant authority.
- **Provider/Binding** owns provider admission/qualification/cutover; authorization owns provider-neutral decision semantics.
- **Physical/Peripheral Integration** remains bounded to integration/governance. A provider/device role or access-control grant is evidence/realization; no generic physical actuation authority is inferred.
- **AGWS/UI** consumes decisions for visibility/interaction but cannot create authority.

## 23. C3.8-DEC-021 — AI and low-code are candidate-producing, never authority-amplifying

AI/low-code may:

- suggest roles/policies;
- detect likely conflicts;
- propose mappings from Brownfield groups;
- draft SoD rules;
- identify missing questions;
- simulate/evaluate candidate policies;
- propose approval flows;
- explain decisions.

AI/low-code may not, merely by inference or composition:

- create canonical grants;
- weaken inherited denies;
- increase Station exposure;
- promote external group membership to permission;
- authorize cross-tenant access;
- declare unresolved evidence `RESOLVED`;
- turn `INCONCLUSIVE` into `ALLOW`;
- bypass required human/authority approval.

All policy/permission mutations follow canonical authority and provenance rules.

## 24. Target semantic contracts

Planning C requires the following conceptual contracts, without prescribing package/module implementation:

1. `AuthorizationRequestContext`
2. `AuthorizationDecision`
3. `AuthorizationEvaluationOccurrence`
4. `PolicyDefinition`
5. `PolicyRevision`
6. `OrganizationTenantStationScope`
7. `RoleAuthorityRelation`
8. `AuthorityAssignment`
9. `DelegationEnvelope`
10. `TemporaryAuthorityGrant`
11. `BreakGlassGrant`
12. `SeparationOfDutiesConstraint`
13. `ApprovalRequirement`
14. `ApprovalOccurrence`
15. `StationCapabilityExposureAuthority`
16. `AuthorizationCurrentnessHorizon`
17. `ExternalAuthorityEvidenceMapping`
18. `ResidualAuthorityCohort`
19. `OfflineAuthorizationClosure`
20. `AuthorizationReconciliationState`
21. `AuthorizationOperabilityState`
22. `AuthorizationCoverageState`

All references remain typed, revision-qualified and provenance-preserving through C0.

## 25. Planning D migration constraints

Planning D must preserve incremental coexistence with the current role/permission/policy slice. Migration must not require a flag-day replacement.

Required migration constraints:

- retain existing deterministic role/resource/action semantics as a bounded legacy-compatible subset;
- introduce stable identities/revisions without rewriting historical decisions as if they were produced by new semantics;
- allow existing boolean decisions/reason codes to coexist while introducing `INCONCLUSIVE` and richer evidence at explicit boundaries;
- migrate organization/membership string refs toward canonical Organization/Tenant/Station relations with explicit mapping/backfill limits;
- migrate external/free-form authority notes as evidence/claims, not automatic canonical policy;
- introduce delegation/temporary/break-glass/SoD semantics incrementally;
- preserve provider-neutral canonical policy while providerizing realization/evaluation mechanics only where qualified;
- identify residual caches/sessions/workers/provider grants before cutover;
- preserve historical policy/evidence provenance when exact revision reconstruction is impossible by marking limits/unknowns;
- coexist with Brownfield/free-form elicitation and C1 structured evidence.

No migration step may broaden authority merely to preserve legacy behavior.

## 26. Planning E proof candidates

Planning E must derive product proofs for at least:

- authentication without assignment never grants authority;
- Enterprise mandatory constraint cannot be weakened by Station/Role/Person policy;
- delegation cannot exceed issuer envelope or silently transfer ownership;
- subdelegation requires explicit eligibility;
- temporary/break-glass authority expires/revokes and residual cohorts remain visible until drained;
- external IdP/provider group/role/grant does not become canonical permission without governed mapping/adoption;
- stale policy decision is rejected/requalified after applicability-bearing revision change;
- queued/in-flight work obeys declared revision-crossing policy;
- `INCONCLUSIVE` cannot become privileged `ALLOW` by evaluator/provider outage;
- cross-tenant/cross-Station authority requires explicit qualified policy;
- shared provider infrastructure does not collapse tenant scope;
- revoke/deprovision ACK does not prove effective convergence;
- offline closure cannot exceed its currentness horizon;
- Fleet desired/observed state does not become local applied authority;
- evaluation overload/queueing does not fail-open or broaden cache authority;
- AGWS visibility/surface edit does not create grant;
- AI/low-code proposal does not mutate canonical policy without authority;
- Brownfield observed role does not automatically become desired canonical policy;
- Production Readiness Coverage can block publish/operation despite feature/policy completeness.

## 27. Symbiotic target proof

The target architecture is coherent if a C3.7 canonical subject can authenticate successfully yet still receive `DENY` or `INCONCLUSIVE`; Enterprise constraints bound Station delegation; Role and Person assignments cannot amplify authority beyond superior envelopes; external groups remain evidence; provider substitution preserves canonical policy identity; revocation exposes residual cohorts until enforcement convergence; queued work crossing policy revisions is explicitly requalified/grandfathered/suspended according to policy; disconnected sites fail boundedly without authority expansion; cross-tenant access remains explicit; and AI/AGWS/Fleet can propose, present or orchestrate only inside separately authorized envelopes.

## 28. Decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Authorization / Policy / Organization / Multitenancy is a canonical, provider-neutral authority plane with revisioned policy and organization scope, monotonic `Enterprise → Station → Role → Person` delegation, explicit temporary/break-glass/SoD/approval semantics, `ALLOW/DENY/INCONCLUSIVE`, decision currentness, residual-authority convergence, bounded offline closure, tenant/Station isolation, provider-evidence mappings, operability/readiness coverage and non-amplifying AI/AGWS/Fleet boundaries.

The current System Builder role/permission/structured-policy mechanism is retained as a useful bounded foundation to **KEEP + HARDEN + GENERALIZE + INTEGRATE**. No provider-specific policy DSL becomes canonical. No generic authority is inferred from authentication, visibility, external roles, credentials, Fleet state or Physical/Peripheral integrations.

C3.9 and all later phases remain untouched in this action.
