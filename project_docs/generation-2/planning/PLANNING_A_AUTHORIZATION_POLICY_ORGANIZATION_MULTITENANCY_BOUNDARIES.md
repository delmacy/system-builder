# Planning A — Authorization / Policy / Organization / Multitenancy Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Authorization / Policy / Organization / Multitenancy

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product work, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic owner

Authorization / Policy / Organization / Multitenancy owns the canonical semantics required to answer **whether a subject may perform an action on a resource, under which organizational/tenant/Station scope, according to which revisioned policy and delegated authority, with what decision evidence and currentness**.

It owns:

- policy identity, revision, applicability and evaluation semantics;
- authorization decision identity and evidence lineage;
- subject/action/resource/environment context required for decision evaluation;
- organizational and tenant membership/containment semantics when those relations affect authority;
- `Enterprise → Station → Role → Person` delegated-authority relations;
- Station isolation and Station-scoped capability-exposure authority constraints;
- role/permission/policy-assignment semantics without collapsing Role into Person identity;
- temporary, delegated, emergency and time-bounded authority grants as explicit authority facts;
- mandatory inherited constraints, override eligibility and delegation envelopes;
- deny/allow/inconclusive dispositions and policy-defined fail-closed behavior;
- policy currentness, supersession and residual-policy-consumer drainage;
- authorization effects of policy/provider substitution and offline/degraded evaluation closure.

Authorization does not own authentication, canonical Person identity, generic audit/compliance obligations, provider discovery, secret storage, workflow execution or governed-surface composition.

## 2. Source of truth and canonical identity

Canonical authorization truth is the revisioned set of SB policy, organization/tenant relations, delegation envelopes and explicit authority assignments applicable to a decision. A provider decision ID, IdP group, external tenant ID, policy-engine object ID, UI role label, token claim or cached allow result is not canonical authorization truth by default.

Canonical identities relevant to this capability include at least:

- `PolicyIdentity` and `PolicyRevision`;
- `AuthorizationDecisionIdentity`;
- `Organization/Tenant/StationScopeIdentity`;
- `RoleIdentity` as an organizational/authority construct distinct from Person identity;
- `DelegationEnvelopeIdentity`;
- `TemporaryAuthorityGrantIdentity`;
- `CapabilityExposureAuthorityIdentity` where Station exposure is governed;
- explicit mappings to external/provider policy or organization realization identities.

External/provider identifiers remain realization identities unless an authorized adoption transition explicitly makes them canonical. Matching names, groups or tenant labels do not establish semantic equivalence.

## 3. Authorization decision contract

An authorization decision is an applicability-scoped qualified claim. It must be reproducible from explicit inputs sufficient to explain why the decision was valid for that request.

The decision context should carry at least:

- canonical subject/principal reference supplied by Identity/Auth/Federation;
- requested action/operation identity;
- canonical resource/capability target and scope;
- organization/tenant/Station/Role context where applicable;
- effective delegation and temporary-authority facts;
- policy/relation revisions used;
- relevant authentication assurance/currentness facts where policy requires them;
- relevant external/provider evidence revisions when a provider participates;
- evaluation time and evidence/currentness horizon;
- explicit decision disposition and rationale/provenance.

A previous `ALLOW` does not remain current after a material change to policy, delegation, membership, Station, tenant, subject assurance, provider binding, capability exposure or another applicability-bearing revision unless equivalence is explicitly qualified.

## 4. Decision dispositions and failure semantics

Authorization must distinguish at minimum:

- `ALLOW` — the requested act is positively authorized under the applicable current policy and authority context;
- `DENY` — an applicable policy or inherited constraint forbids the act, or the requested authority exceeds the delegation envelope;
- `INCONCLUSIVE` — required policy, identity, membership, assurance, provider or applicability evidence is missing, stale, ambiguous, partially covered or unverifiable.

`INCONCLUSIVE` is not `ALLOW`. Governing policy determines whether an inconclusive request must fail closed, escalate, require re-authentication/revalidation or enter a bounded degraded path. Privileged or authority-expanding operations must not gain permission merely because an evaluator/provider is unavailable.

A cached decision is valid only within its explicit applicability/currentness horizon. Offline/degraded operation may use a qualified local authorization closure only for retained policies/scopes whose evidence remains valid; reconnect requires requalification before broader authority resumes.

## 5. Enterprise → Station → Role → Person authority hierarchy

The hierarchy is monotonic and non-amplifying:

`Enterprise → Station → Role → Person`.

### Enterprise
Owns superior invariants, maximum authority envelopes, globally mandatory prohibitions/requirements, admissible capability families and the bounds within which authority may be delegated.

### Station
Is the principal capability-exposure and delegated-administration boundary. A Station may receive only authority explicitly delegated from its superior context and may expose/administer only capabilities inside that envelope. Discovery or technical availability of a provider/capability does not create Station authority.

### Role
Represents an organizational/authority construct within an applicable Station/tenant context. Role grants cannot exceed inherited Enterprise/Station constraints and do not become Person identity.

### Person
Receives effective authority through explicit assignments, relations and temporary/delegated grants within all superior constraints. Person-level authority may be narrower than Role authority and cannot weaken mandatory inherited restrictions.

Effective authority is the intersection of applicable superior constraints, explicit delegation, current role/person assignments, Station capability exposure and operation-specific policy. No AI, AGWS, provider, degraded mode or local customization can enlarge that intersection.

## 6. Policy inheritance, override and delegation

Policy inheritance must preserve the distinction between:

- mandatory inherited constraints that lower scopes cannot weaken;
- delegable dimensions that lower scopes may specialize;
- explicit local policy additions that further restrict authority;
- explicitly authorized override paths, when the superior policy permits them;
- temporary/break-glass authority that is separately governed and time/evidence bounded.

A lower layer cannot reinterpret a superior mandatory `DENY` as `ALLOW` merely by defining a local policy. If an override mechanism exists, its eligibility is itself a superior-policy fact and must preserve explicit lineage, scope, actor, reason, expiry and review obligations.

Delegation is never transitive by assumption. A delegate may subdelegate only when the current delegation envelope explicitly permits it and only within its remaining authority.

## 7. Temporary, delegated and break-glass authority

Temporary/delegated authority is first-class authorization state rather than an informal annotation. Such grants require explicit scope, subject/delegate, allowed actions/resources, issuing authority, policy/delegation revision, start/expiry or revocation condition and provenance.

Emergency/break-glass paths do not bypass canonical authority semantics. They are specialized governed grants whose creation/use can be independently restricted and audited. Their existence must not silently convert into durable Role/Person authority after expiry.

Residual caches, sessions, tokens, policy-engine replicas or subordinate evaluators that can continue honoring an expired/revoked grant form residual authority cohorts and must be drained or requalified.

## 8. Organization and multitenancy boundary

Organization/tenant semantics owned here are those required to bound authority, isolation and delegation. A tenant boundary is not merely a database partition key or provider account identifier.

Authorization owns:

- canonical tenant/organizational scope references used in policy evaluation;
- membership/relationship facts insofar as they affect authority;
- cross-tenant access policy and explicit federation/delegation boundaries;
- tenant/Station isolation requirements at the authorization semantic layer;
- constraints preventing authority leakage across organizations, tenants or Stations.

Data placement, schema partitioning, storage encryption and provider topology are realized by their respective owners. Authorization defines the access/isolation contract those realizations must satisfy.

## 9. Boundary with Identity / Authentication / Federation

Identity/Auth/Federation owns **who/what the subject is and how it was authenticated**. Authorization owns **what that subject may do in the requested context**.

Therefore:

- successful authentication never implies authorization;
- `Role`, `Station`, tenant membership and policy assignment do not become canonical Person identity;
- group/role/tenant claims from an IdP remain evidence until accepted under canonical SB organization/policy semantics;
- authentication assurance/currentness may be an input to policy, but policy owns the decision threshold/requirement;
- changing authentication provider does not grant equivalent authority until mappings and policy applicability are requalified.

## 10. Boundary with Adaptive Governed Work Surfaces

AGWS owns governed surface composition and applies authorization results to determine which surface/exposure specialization may be materialized. Authorization owns the actual actor/delegation/capability-exposure authority.

Station isolation and capability exposure therefore divide cleanly:

- Authorization owns **who may expose/administer/consume which capability under which scope**;
- AGWS owns **how a permitted exposure participates in a governed surface**.

A Person cannot acquire new permission by placing an action on a surface. AI cannot transform a surface-edit request into a policy grant, broaden Station exposure, weaken inherited constraints or create provider-admin authority.

## 11. Boundary with Governance / Compliance / Audit

Governance/Compliance/Audit owns obligation/control applicability, exceptions/waivers as governance objects, remediation, assessment and audit-evidence semantics. Authorization owns access/actuation policy and authority decisions.

A compliance obligation may require a particular authorization rule; the obligation remains Governance-owned while the executable permission constraint is Authorization-owned. An audit record may evidence an authorization decision but does not itself redefine authorization truth.

A governance waiver or exception does not implicitly grant operational authority unless an explicit Authorization transition is part of its authorized effect.

## 12. Boundary with Provider / Binding / Capability Negotiation

Provider/Binding owns provider discovery, qualification/admission, binding, fallback, coexistence and cutover. Authorization owns provider-neutral authorization semantics and the decision contract.

A provider policy engine may realize evaluation, but provider policy IDs, groups, tenants and decision formats remain realization identities unless explicitly adopted. Provider substitution must requalify semantic support for:

- decision outcomes including uncertainty/indeterminate behavior;
- policy features and precedence;
- relationship/delegation semantics;
- revision/currentness propagation;
- caching and revocation behavior;
- tenant/Station isolation guarantees;
- offline behavior and failure modes;
- decision evidence/provenance.

Matching labels such as RBAC, ABAC or policy-as-code do not prove equivalent semantics.

## 13. Boundary with Secrets / Configuration / Environment Portability

Secrets/Configuration owns policy-engine credentials, secret material, endpoint/configuration realization and portable configuration binding. Authorization owns the semantic policy and authority consequences.

A configuration value may select a policy bundle/provider, but changing configuration cannot silently change canonical authority without an authorized, revisioned policy/binding transition. Secret rotation may invalidate evaluator/provider access; it does not itself redefine who is authorized.

## 14. Boundary with Privacy / Data Governance

Privacy/Data Governance owns purpose/use limitation, retention/disposition, legal hold, residency and privacy obligations. Authorization owns permission to access/act.

An `ALLOW` does not prove a use is privacy-permissible when an independent privacy obligation denies or qualifies it. Conversely, a privacy disposition requirement does not itself authorize an actor to perform deletion or migration; the operation also requires Authorization and relevant owner-specific eligibility.

## 15. Boundary with Workflow & Durable Execution and Integration & Automation

Workflow owns durable execution, human tasks, timers, retries, redrive and in-flight evolution. Integration owns adapters, triggers, automation execution and external effects. Authorization decides whether a principal/automation identity is allowed to invoke the requested operation.

Workflow assignment, automation possession of a credential or receipt of an event does not manufacture authority. Long-running executions must re-evaluate authority where policy requires current authorization at the effect boundary; historic authorization evidence remains replayable but cannot automatically qualify a changed current policy.

Delegated automation authority must be explicit, scoped and non-amplifying. Unknown external mutation outcome remains subject to universal reconcile-before-retry semantics; retryability never substitutes for authorization.

## 16. Boundary with Universal Capability Architecture

UCA supplies reusable structures such as qualified claims/evidence, semantic-vs-realization identity, revision vectors, `INCONCLUSIVE`, currentness horizons, residual cohort drainage and non-amplifying authority. Authorization specializes those primitives for policy, delegation, organization and tenant semantics.

UCA cannot become a universal policy owner, global permission table or normalization layer that silently overrides domain-owned authorization meaning.

## 17. Lifecycle and versioning

Material authorization transitions include policy creation/revision/activation/withdrawal, role definition/revision, membership/assignment change, delegation issue/revoke/expire, temporary grant activation/expiry, Station exposure change, tenant/organization relation change, provider-binding migration and policy-engine cutover.

Historical decisions remain replayable against their producing revisions. They do not automatically qualify present authority after any applicability-bearing revision changes.

Cutover is incomplete while residual evaluators, caches, sessions, tokens, workers, subordinate Stations or provider replicas can still produce authoritative effects under withdrawn policy/grants. These populations require explicit drainage, expiry, reconciliation or bounded coexistence.

## 18. Governance and observability

Authorization transitions and decisions require lineage sufficient to answer:

- who/what requested and evaluated the decision;
- which subject/action/resource/organization/tenant/Station context applied;
- which policy/delegation/membership revisions were used;
- what evidence/currentness qualified the inputs;
- which provider/binding participated, if any;
- what result and reason were produced;
- whether cached/offline/degraded evaluation was used;
- what residual authority cohorts remain after change or revocation.

Observability can report denies, inconclusive evaluations, stale policy, propagation lag, cross-tenant anomalies or residual caches, but telemetry cannot silently rewrite policy/authority truth.

## 19. Portability and lock-in

The portable contract is provider-neutral policy/decision/delegation/organization semantics plus explicit bindings and evidence lineage. Portability must be evaluated as a support vector, not by matching policy-language names.

Provider replacement must qualify policy expressiveness, precedence/inheritance, relationship/delegation support, indeterminate behavior, revision propagation, cache/revocation semantics, evidence/provenance, tenant isolation, local/offline closure, performance constraints relevant to correctness and residual-cohort drainage.

## 20. Required cross-cutting contracts

Planning A preserves the following semantic contracts for later target-architecture work:

1. `PolicyIdentityAndRevision`
2. `AuthorizationRequestContext`
3. `AuthorizationDecision`
4. `OrganizationTenantScope`
5. `RoleAuthorityRelation`
6. `DelegationEnvelope`
7. `TemporaryAuthorityGrant`
8. `StationCapabilityExposureAuthority`
9. `InheritedPolicyConstraint`
10. `PolicyOverrideEligibility`
11. `AuthorizationEvidenceEnvelope`
12. `AuthorizationCurrentnessHorizon`
13. `AuthorizationProviderBinding`
14. `ResidualAuthorityCohort`
15. `OfflineAuthorizationClosure`

These are contracts, not implementation/module declarations.

## 21. Non-goals

This capability does not own:

- canonical Person identity or authentication ceremonies;
- generic UI/AGWS rendering/composition;
- generic compliance/audit obligation truth;
- secret/configuration storage;
- provider discovery/admission mechanics;
- data retention/legal-hold/residency policy ownership;
- workflow execution or integration side-effect semantics;
- PKI/trust-anchor/certificate lifecycle;
- universal domain/process modeling;
- a provider-specific policy DSL as canonical SB policy model.

## 22. Planning B repository-validation questions

Later Planning B must inspect fresh `main` and answer, without assuming from research/planning artifacts:

1. What current SB contracts represent authorization requests, decisions, policies, roles, permissions, organizations, tenants and Station scopes?
2. Is authentication structurally separate from authorization in current contracts and runtime decisions?
3. Are canonical Person identity, Role and Station represented as distinct semantic identities?
4. Is `Enterprise → Station → Role → Person` delegated authority explicit, monotonic and non-amplifying?
5. Are mandatory inherited constraints and override eligibility structurally representable?
6. Are temporary/delegated/break-glass grants revisioned, scoped and expiring rather than informal metadata?
7. Does Station capability exposure have an explicit authority boundary distinct from provider discovery and AGWS surface composition?
8. Can authorization decisions represent `INCONCLUSIVE`, policy/evidence revisions, provenance and currentness?
9. How are policy caches, sessions, tokens, workers and subordinate evaluators drained after policy/grant withdrawal?
10. Are provider IDs/groups/tenant IDs kept distinct from canonical authorization/organization identities?
11. Are cross-tenant/cross-Station accesses explicit and auditable rather than implied by shared provider topology?
12. Do tests prevent AI/AGWS/provider/degraded mode from amplifying authority?

These questions are deferred; this Planning A execution does not inspect `main` or infer answers.

## 23. Symbiotic boundary proof

The boundary is coherent if an authenticated canonical Person can act under a Station and Role whose authority is derived from revisioned Enterprise/Station policy; a lower layer cannot remove a superior deny; a temporary delegated grant expires without leaving cached authority behind; a provider policy engine can be replaced while canonical policy/organization identities remain stable; stale or partial policy evidence yields `INCONCLUSIVE`/fail-closed as required; and AGWS/AI can expose or materialize only actions already inside the effective authority envelope.

## 24. Planning A decision

**PASS_FOR_CAPABILITY.** Authorization / Policy / Organization / Multitenancy has an explicit semantic owner, canonical source of truth, decision/failure semantics, hierarchical authority model, organization/tenant isolation boundary, lifecycle/versioning, provider boundary, governance/observability requirements, portability contract, neighboring-owner relations and deferred repository-validation questions. No top-level split or merge is required by this Planning A pass.

This pass does not close global `PLANNING_A_TAXONOMY_BOUNDARIES`; the remaining canonical capabilities still require explicit reconciliation before Planning B.