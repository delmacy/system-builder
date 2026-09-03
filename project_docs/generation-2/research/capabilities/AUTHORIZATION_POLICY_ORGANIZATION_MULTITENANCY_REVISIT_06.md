# Authorization / Policy / Organization / Multitenancy — Revisit 06

## Research question
Under cycle-7 research-by-exception, what must be added beyond typed authorization identity and decision→enforcement lineage so that authority claims remain correct across policy/model change, distributed evaluator uptake, contextual/token-derived relationships, temporary grants, provider migration, offline/local operation and the non-amplifying `Enterprise → Station → Role → Person` hierarchy?

## Representatives and evidence/source ledger
1. **OpenFGA** — immutable authorization models, explicit model pinning, contextual tuples, organization-context authorization and model migrations. Strong evidence that model identity, request-only relationship context, persisted tuples and application rollout are distinct axes. OpenFGA explicitly warns that token-derived contextual relationships can remain effective until token expiry after the underlying claim changes.
2. **OPA** — bundles, discovery, status and decision logs. Bundles are eventually distributed; an evaluator reports its own active revision and activation state. Decision logs identify evaluator/bundle revision and decision, but do not prove downstream enforcement.
3. **Kubernetes RBAC** — additive RBAC plus explicit `bind`, `escalate` and `impersonate`. Strong evidence that administrative ability and authority-to-grant/act-as are separate facets and that indirect administrative surfaces can create privilege escalation if not attenuated.
4. **Cedar** — permit/forbid/default-deny, separate schema validation and runtime evaluation. A policy validated against one schema can become invalid or error-producing after schema evolution; validation state therefore has an applicability/revision boundary.
5. **SpiceDB/Authzed** — consistency modes, ZedTokens, exact-snapshot expiry and expiring relationships. Strong evidence that authorization freshness is request-qualified and that temporal grants depend on datastore time plus retention/GC horizons.

Primary sources are current official documentation reviewed in this pass. Prior Generation-2 authorization research remains authoritative and is not repeated here.

## Primitives, source of truth and identity
Authorization requires distinct semantic identities for `Subject`, `Actor`, `Principal`, `Role/Relationship`, `PolicySemantic`, `PolicyModelRevision`, `Organization`, `Tenant`, `Station`, `Delegation`, `TemporaryGrant/BreakGlassLease`, `Decision`, `EvaluatorRealization`, `EnforcementPoint` and `ConsumerCohort`.

Source-of-truth separation is mandatory:
- authentication owns evidence about subject/session/authenticator/security state;
- authorization owns policy, organization/tenant/Station topology, role/relationship, delegation and grant semantics;
- provider/evaluator state proves a realization and loaded revision, not canonical semantic ownership;
- enforcement/application state proves whether the governed action was actually admitted;
- contextual/token-derived facts are request-scoped evidence unless separately admitted into canonical authorization state.

## Lifecycle, versioning and applicability
Authorization lifecycle is not merely policy publication:
`Proposed → Validated → Admitted → Distributed → Loaded → DecisionProduced → Enforced → Effective → Retired/Drained`.

An effective authority claim is applicable only when its evidence is compatible across:
`subject/actor mapping × policy/model revision × schema/entity interpretation × relationship/membership revision × organization/tenant/Station topology × delegation/lease revision × authentication/revocation freshness × evaluator/provider revision × enforcement revision × consistency position × evidence horizon × consumer cohort`.

OpenFGA model pinning and migration guidance show that model rollout may also require tuple and application changes. OPA shows that different evaluators can temporarily hold different active revisions. Cedar shows that a previously validated policy may no longer be valid under a changed schema. SpiceDB shows that a decision can intentionally trade freshness for latency and that exact historical snapshots can expire.

## Failure semantics
- a valid policy/model that is no longer applicable to the current schema, topology or cohort => `INCONCLUSIVE/NOT_APPLICABLE`, never silently reusable;
- `ALLOW` from an evaluator whose required policy/security evidence is stale => non-conclusive privileged authority;
- decision produced but enforcement outcome unknown => `PARTIAL/INCONCLUSIVE`;
- temporary relationship/lease expiry that has not drained cached/session/contextual consumers => expiry intent exists but global closure is unproven;
- ambiguous grant/revoke/bind/escalate/impersonate actuation => reconcile-before-retry;
- exact-snapshot/evidence retention expiry => historical re-evaluation may become unavailable without invalidating the existence of the original event; replayability and historical validity are separate claims;
- local/offline operation beyond qualified policy/revocation/trust horizon => privileged actuation must stop or degrade according to explicit policy.

## Extensibility and provider boundaries
A provider can own evaluation, consistency knobs, policy language/runtime, storage, distribution and caches. It cannot redefine SB semantic authority, tenant/Station boundaries, delegation attenuation, break-glass approval, or what evidence constitutes effective authority.

A provider substitution is not closed when the destination answers checks. Closure requires compatibility/admission plus drainage or explicit disposition of old evaluator instances, role/relationship replicas, active sessions/contextual claims, temporary grants and downstream enforcement cohorts.

## Governance and delegated administration
`Enterprise → Station → Role → Person` is an attenuation chain, not a UI hierarchy. Lower scopes can only exercise explicitly delegated facets and cannot weaken higher invariants. At minimum, `observe`, `manage membership`, `bind role`, `define policy`, `delegate`, `impersonate`, `approve exception`, `administer provider` and `recover/override` are independent authority facets.

Kubernetes' explicit escalation controls and its documented privilege-escalation risks through powerful administrative objects are adversarial evidence that control over a management surface must not imply authority over every effect reachable through that surface.

AGWS and AI remain proposal/materialization surfaces. They may present, explain or materialize already-authorized changes, but cannot mint authority, broaden delegation, convert identity context into entitlement, or self-approve canonical policy changes.

## Observability, evidence and replay
A decision/effective-authority proof must carry the evaluator identity, policy/model revision, authorization input digest, subject/actor mapping, relevant relationship/topology/delegation/lease revisions, authentication/revocation freshness, consistency position, enforcement identity/outcome and applicability horizon.

OPA's `active_revision` and decision-log bundle revisions are evidence of evaluator state. SpiceDB ZedTokens are evidence of a consistency position. Neither alone proves current enterprise-wide authority. Evidence replayability also has a retention horizon: exact historical state may be garbage-collected or depend on retained policy/schema/trust material.

## Portability and lock-in
Portability remains layered: `preserve → interpret → validate → realize → actuate → prove uptake/drainage`.

Policy text or relationship export is insufficient when target engines differ in deny/permit precedence, error handling, schema validation, consistency controls, temporal grants, contextual facts or enforcement topology. A mixed-provider period must expose a support vector rather than claiming binary compatibility.

## Universal primitive versus authorization-owned mechanism
**Cross-cutting primitives:** applicability-scoped claim, revision/evidence compatibility join, evidence replay horizon, mixed support vector, consumer-cohort drainage and qualified local closure.

**Authorization-owned:** role/relationship semantics, organization/tenant/Station topology, permit/deny/default/error behavior, delegation/impersonation, temporary grants/break-glass, authority attenuation and decision→enforcement semantics.

**Provider-specific:** OpenFGA tuple/model mechanics, OPA Rego/bundles, Kubernetes RBAC objects/verbs, Cedar syntax/schema APIs and SpiceDB consistency/ZedToken implementation.

## Convergent and divergent patterns
**Convergent:** explicit revision identity; separate semantic state from evaluator realization; freshness/consistency qualification; temporary or contextual authority; auditability; risk of stale distributed enforcement.

**Divergent:** additive RBAC vs forbid-overrides-permit; relationship graphs vs policy languages; persisted vs contextual facts; consistency controls; schema-validation behavior; expiry clocks; distribution/caching mechanics. These divergences must remain provider- or capability-qualified.

## Subcapabilities
- policy/model lifecycle and applicability
- organization/tenant/Station topology and membership
- role/relationship binding
- delegated administration and impersonation
- temporary grant/break-glass lease governance
- consistency/freshness-qualified evaluation
- enforcement convergence and effective-authority proof
- provider/evaluator migration and cohort drainage
- offline/local authority closure and reconnect requalification
- decision/evidence retention and replay

## SB comparison — evidence boundary
No product code, Work Package, TASK or Construction was executed or modified. This elicitation pass makes no fresh-main implementation claim. Repository validation remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; the current research branch only establishes architectural questions and proof obligations.

## Reconciliation hypotheses
- **KEEP:** hard separation of authentication evidence from authorization authority.
- **HARDEN:** authority claims with applicability scope, policy/security currentness, consistency and enforcement evidence.
- **GENERALIZE:** applicability-scoped claims, evidence horizons, mixed support vectors and cohort drainage as reusable primitives.
- **PROVIDERIZE:** policy-language/evaluator/distribution/cache/consistency mechanics.
- **INTEGRATE:** Identity evidence as qualified input; AGWS/AI as non-authoritative proposal/materialization surfaces.
- **REPLACE:** `current policy + valid session = current authority` shortcuts with compatibility-joined effective-authority proofs.
- **DEFER:** provider-specific performance/consistency tuning until provider design.
- **DO_NOT_BUILD:** a universal authorization DSL or a generic admin capability that erases delegation/escalation semantics.

## Repo-validation questions
1. Can SB represent an applicability-scoped effective-authority claim distinct from a raw `ALLOW`?
2. Are policy/model, authorization schema/entity interpretation, membership/topology, delegation/lease and enforcement revisions independently referenceable?
3. Can evaluator policy-currentness be observed per realization rather than inferred from publication?
4. Can active contextual/token-derived claims be drained or explicitly dispositioned after source membership/revocation changes?
5. Are temporary grants/break-glass tied to an authoritative clock, expiry and post-expiry cohort closure?
6. Can evidence distinguish historical validity from present replayability after retention/GC?
7. Is provider migration represented as mixed support plus residual cohort drainage?
8. Does offline/local authorization fail closed or explicitly degrade after policy/revocation/trust horizons, then requalify on reconnect?
9. Can Station administration bind only delegated facets without `bind/escalate/impersonate/provider-admin` amplification?
10. Can AGWS/AI propose/materialize policy changes without acquiring approval or canonical-change authority?

## Symbiotic Proof obligations
1. A policy/model revision published but not loaded by a required evaluator cannot prove enterprise-wide current authority.
2. A Cedar-like policy validated under schema A cannot be reused as conformance proof under schema B without revalidation.
3. An OpenFGA contextual relationship derived from a still-valid but stale identity token cannot silently outrank fresher revocation/membership evidence required by policy.
4. A SpiceDB decision at a weaker/stale consistency point cannot satisfy a proof requiring read-after-change freshness.
5. Temporary grant expiry is not globally closed until relevant evaluator/session/contextual/enforcement cohorts are drained or dispositioned.
6. An OPA decision log proves evaluation under an identified bundle revision, not downstream enforcement success.
7. Provider cutover fails if target decision semantics are supported but residual source cohorts can still authorize privileged actions.
8. Station delegated administration cannot grant a permission it does not itself possess unless an explicit higher-level delegation authorizes that facet.
9. Offline/local authority cannot outlive its policy/revocation/trust/evidence horizon; reconnect requires requalification before privileged continuation.
10. AGWS/AI cannot convert identity, presentation context or model output into new authorization authority.
11. Historical audit evidence can remain valid even when exact policy-state replay becomes unavailable; the proof must disclose replay horizon/limitations.
12. Mixed evaluator/provider support is represented dimensionally rather than as a single portable/not-portable flag.

## Stable findings
- **G2-FINDING-APOM-45** — Effective authority is an applicability-scoped claim over subject/actor, semantic scope, policy/model/schema, relationship/topology, delegation/lease, identity-security, evaluator, consistency, enforcement and evidence horizon; possession of a valid decision or policy revision alone is insufficient.
- **G2-FINDING-APOM-46** — Policy-currentness is realization-specific: publication/admission of a policy does not prove every evaluator or enforcement cohort has loaded or applied it; distributed uptake must be evidenced.
- **G2-FINDING-APOM-47** — Authorization conformance is revision-qualified across both policy and the interpretation schema/entity model; prior validation cannot automatically survive schema/semantic evolution.
- **G2-FINDING-APOM-48** — Contextual or token-derived authorization facts are provenance-bearing, applicability-bounded evidence, not canonical relationships; source-token lifetime can exceed underlying membership validity and therefore requires explicit freshness/revocation policy.
- **G2-FINDING-APOM-49** — Authorization evidence has a replay horizon distinct from historical event validity; retention/GC of exact snapshots, policies, schemas or trust material can make later exact re-evaluation unavailable and must propagate proof qualification.
- **G2-FINDING-APOM-50** — Authorization portability/support is a mixed vector across policy semantics, schema/entity interpretation, relationship model, consistency/freshness, temporal/contextual grants, delegation, distribution, enforcement and evidence; binary provider compatibility is unsafe.
- **G2-FINDING-APOM-51** — Role/policy/provider migration closes only after residual evaluator, active-session/contextual-claim, temporary-grant and enforcement consumer cohorts are drained or explicitly dispositioned; destination decision success is not cutover closure.
- **G2-FINDING-APOM-52** — Qualified local/offline authorization and delegated administration are non-amplifying: authority is bounded by explicit facet attenuation and policy/revocation/trust/evidence horizons, with mandatory reconnect requalification before privileged continuation.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-APOM-APPLICABILITY-SCOPED-EFFECTIVE-AUTHORITY-CLAIM` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-APOM-AUTHORIZATION-EVIDENCE-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-APOM-MIXED-AUTHORIZATION-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-APOM-AUTHORITY-CONSUMER-COHORT-DRAINAGE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains CORE/promoted and distinct from generic UI, with its existing constitutional boundary preserved.

## Value / risk / priority / next question
**Value:** constitutional: every privileged generated-system action depends on this capability. **Risk:** critical if stale evaluator state, contextual claims, temporary grants or migration residue are mistaken for current effective authority. **Priority:** highest structural. **Next question:** Data / Schema / Migrations should test applicability-scoped schema/data claims, migration ownership/fencing, effective-data convergence, transaction/consistency semantics, mixed provider support, residual source/CDC cohorts, offline closure and tenant/Station data authority without absorbing Authorization ownership.