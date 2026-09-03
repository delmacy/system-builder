# Authorization / Policy / Organization / Multitenancy — Revisit 05

## Research question
Under late-cycle research-by-exception, which authorization invariants survive across relationship-, policy-, RBAC-, tenant- and distributed-enforcement systems, and which semantics must remain capability-owned rather than be absorbed into Identity/Authentication/Federation or a universal provider abstraction?

## Representatives and evidence ledger
1. **OpenFGA** — immutable authorization models, explicit model pinning, conditional/contextual tuples, multi-tenant modeling and model tests. Source of truth: authorization model + relationship tuples + request context; a token claim/contextual tuple can participate in a check without becoming a persisted relationship or semantic authority by itself.
2. **Open Policy Agent (OPA)** — distributed policy evaluation, bundles/discovery, decision logs carrying bundle revisions, and centralized/hierarchical policy distribution patterns. Source of truth is external policy/data management plus the policy revision actually loaded by each evaluator; decision production is distinct from enforcement.
3. **Kubernetes RBAC / impersonation** — namespaced vs cluster-scoped roles/bindings, additive grants, explicit `impersonate`, `bind`, `escalate` and specialized verbs. Strong adversarial evidence that delegated administration and actor substitution require separate authority facets.
4. **Cedar** — policy/entity/request-oriented authorization model with explicit permit/forbid semantics and schema/entity validation. Used as a cross-check for conflict/default semantics and typed authorization inputs.
5. **SpiceDB/Authzed** — relationship authorization with consistency tokens/revision-aware checks and caveat/context support. Used as cross-check for distributed decision freshness and revision-qualified evidence.

Primary evidence consulted this pass: OpenFGA immutable-model, conditions, contextual-tuples, multi-tenant and testing documentation; OPA management/discovery/decision-log documentation; Kubernetes RBAC, authorization and impersonation documentation. Cedar/SpiceDB remain deep historical representatives and adversarial cross-checks; no unsupported product-specific claim is promoted from them in this pass.

## Identity and source-of-truth model
Authorization needs typed identities rather than a generic `policyId`:
- `PolicySemanticId` — canonical rule/policy intent.
- `AuthorizationModelId` — immutable/evaluable model revision.
- `RelationshipFactId` / membership or role-binding fact.
- `OrganizationId`, `TenantId`, `StationId`, `RoleId` — semantic scope identities.
- `DelegationId` / `ImpersonationGrantId` — authority-to-act-as/for lineage.
- `ExceptionOrBreakGlassLeaseId` — bounded exceptional authority.
- `DecisionId` — one evaluation result under a concrete evidence vector.
- `EnforcementPointId` and `EnforcementRealizationId` — where/how a decision is actually applied.
- provider-local identifiers remain canonical only for their own provider identity kind.

Authentication supplies subject/session/security-state evidence. It does **not** own organization membership, role semantics, policy applicability, delegation, tenant/Station authority or enforcement. Propagated subject/actor claims are provenance inputs that must join authorization-owned facts and policy.

## Lifecycle and versioning
Effective authorization is a multi-axis vector, not one policy version:
`policy/model revision × relationship/membership revision × organization/tenant topology × delegation/exception revision × identity-security/revocation position × provider/binding revision × enforcement revision × Station exposure × trust/config epoch`.

OpenFGA's immutable model IDs and recommendation to pin a model during checks demonstrate that 'latest policy' is not a sufficient evaluation identity. OPA decision logs carrying bundle revision show that a decision can be traced to a loaded policy revision while distributed evaluators may still differ in uptake.

Authorization lifecycle therefore separates:
`Proposed → Validated/Tested → Admitted → Distributed → Loaded → DecisionProduced → Enforced → Effective/Postcondition`.
Revocation follows its own closure lineage; changing canonical policy or membership does not prove every enforcement point has stopped honoring stale authority.

## Failure semantics
- `ALLOW` produced but enforcement not reached/applied => `PARTIAL/INCONCLUSIVE`, not effective authorization success.
- evaluator healthy but stale policy/membership/revocation stream => decision freshness is insufficient.
- policy conflict or missing required input must have explicit semantics (`DENY`, `ERROR`, `UNKNOWN/INCONCLUSIVE`, or provider-specific result); the SB must not silently normalize every engine to the same conflict/default behavior.
- distributed policy update with incomplete enforcement uptake prevents global convergence claims.
- ambiguous grant/revoke/admin actuation requires observation/reconciliation before retry.
- cross-tenant/Station evidence gaps propagate upward; one covered Station cannot prove enterprise-wide isolation.

## Extensibility and provider boundaries
Provider replacement is admissible only when semantic policy, organization/tenant relationships, delegation/exception semantics, decision inputs, conflict/default behavior, consistency/freshness profile, audit evidence and enforcement obligations are representable. Shadow evaluation can compare decisions, but matching outputs over sampled requests does not by itself transfer authority or prove full semantic equivalence.

A provider may own evaluation mechanics; the SB retains semantic ownership of capability-level policy intent, scope, authority facets, portability claims and evidence requirements. Provider-specific retry/cache/consistency behavior remains qualified rather than universalized.

## Governance and non-amplifying delegated administration
`Enterprise → Station → Role → Person` remains an authorization hierarchy with explicit attenuation. Lower layers may specialize only delegated facets. Administration must distinguish at least: observe, grant/revoke relationships, bind roles, define policy, delegate, impersonate/act-as, approve exception/break-glass, administer provider, and recover/override enforcement.

Kubernetes is adversarial evidence: `impersonate`, `bind` and `escalate` are explicit powers because ordinary resource administration must not silently imply them. Station administration therefore cannot become enterprise-policy administration merely because the same UI/provider exposes both.

Break-glass is modeled as a lease-like exceptional grant with issuer/approver, bounded subject/actor, scope, purpose, start/expiry, policy/trust revision, revocation state and post-use evidence. It is not a permanent role mutation.

## Observability and evidence
A decision proof should carry a compatibility join over subject/actor mapping, identity-security freshness, policy/model revision, relationship/membership revision, organization/tenant/Station scope, delegation/exception revision, provider/evaluator realization, enforcement revision, input/context digest, decision ID, outcome and freshness/position evidence.

OPA decision logs provide a concrete mechanism for decision IDs and bundle revisions, but a decision log is evidence of evaluation, not proof that the downstream resource/action enforcement occurred. Required evidence that cannot be joined to the same effective revision/scope propagates `INCONCLUSIVE`.

## Portability and lock-in
Authorization portability is layered:
1. **Preserve** policy/relationship/delegation material.
2. **Interpret** equivalent semantics.
3. **Validate** conflicts, defaults, schema/types and scope.
4. **Realize** the target provider/evaluator/enforcement topology.
5. **Actuate** grants/revocations/decisions under admitted authority.

Exportable policy text alone is not portability. Relationship consistency, deny/permit precedence, contextual conditions, tenant isolation, delegation and enforcement semantics can block semantic replacement.

## Product-specific mechanism vs universal primitive
**Universal/cross-cutting candidates:** typed semantic/provider identity; multi-axis revision vectors; decision→enforcement convergence lineage; composite evidence joins; qualified-local closure/reconnection; ambiguous-actuation reconciliation.

**Authorization-owned:** organization/tenant/Station relationship semantics; policy conflict/default semantics; role/delegation/impersonation; break-glass/exception authority; authorization decision inputs; enforcement obligations and cross-scope attenuation.

**Provider-specific:** OpenFGA tuples/model DSL, OPA Rego/bundles, Kubernetes RBAC objects/verbs, Cedar policy syntax, SpiceDB relationship/caveat mechanics.

## Convergent and divergent patterns
Convergent: explicit policy/model revision, typed subject/resource/scope inputs, separate relationship/policy facts, testability/audit evidence, delegated-administration risk, distributed freshness concerns.

Divergent: additive-only RBAC versus permit/forbid engines; relationship graph versus policy language; centralized relationship store versus distributed policy evaluators; request-context semantics; consistency/freshness controls; conflict/default/error semantics. These divergences prohibit a false universal 'allow/deny provider' abstraction.

## Subcapabilities
- semantic policy/model management
- organization/tenant/Station topology and membership
- role/relationship binding
- delegation and impersonation
- exception/break-glass lease governance
- decision evaluation and explanation
- enforcement realization/convergence
- revocation propagation and freshness
- cross-tenant/Station isolation
- shadow evaluation/provider migration
- qualified-local/offline authority closure

## SB comparison — bounded evidence only
No product-code mutation was performed. This revisit does not infer repository-wide SB support/absence from research-branch documents. Fresh-main archaeology remains reserved for the later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` phase; any bounded keyword observation in an elicitation pass is non-authoritative for implementation maturity.

## Reconciliation hypotheses
- **KEEP:** authentication and authorization remain constitutionally separate.
- **HARDEN:** every authorization decision/effective-authority claim with revision/scope/freshness evidence.
- **GENERALIZE:** typed identities, revision vectors, composite-proof joins and decision→enforcement lineage as cross-cutting primitives.
- **PROVIDERIZE:** evaluator/storage/distribution mechanics without provider leakage into semantic policy identity.
- **INTEGRATE:** Identity revocation/security-state evidence as an input dependency, not authorization ownership.
- **REPLACE:** any single `role/session/policyVersion => authority` shortcut with revision-qualified effective authority.
- **DEFER:** provider-specific consistency tuning and advanced policy-language features until provider selection/migration design.
- **DO_NOT_BUILD:** a universal policy DSL that erases relationship, deny/permit, delegation or consistency differences.

## Repo-validation questions
1. Does fresh main have a canonical authorization decision/effective-authority contract distinct from authentication/session?
2. Are organization/tenant/Station/role/delegation identities modeled semantically or only through provider/session fields?
3. Can policy/model and relationship revisions be pinned and evidenced independently?
4. Is enforcement convergence represented separately from decision production?
5. Are impersonation/delegation and break-glass explicit authority facets with lineage?
6. Can revocation/security-stream freshness make authorization `INCONCLUSIVE`?
7. Is cross-Station delegated administration attenuating and non-amplifying?
8. Are provider replacement/shadow evaluation and local/offline authority closure representable without weakening invariants?

## Symbiotic Proof obligations
1. A valid authenticated session with stale required revocation/security-state evidence cannot yield conclusive privileged authorization.
2. An OpenFGA-like check pinned to model revision A cannot be reported as proof for model revision B without re-evaluation.
3. A policy decision `ALLOW` with missing enforcement evidence is not `EffectiveAllowed`.
4. Subject and actor remain separately attributable under delegation/impersonation; actor provenance does not self-authorize subject rights.
5. Station admin can manage delegated surface/role bindings but cannot escalate to enterprise policy/provider-admin powers.
6. Break-glass expires/revokes independently of ordinary role membership and leaves auditable post-use evidence.
7. Cross-tenant/Station isolation failure or missing evidence prevents an enterprise-wide isolation PASS.
8. Provider shadow evaluation mismatch or unsupported conflict/default semantics blocks cutover.
9. Offline/local authority remains valid only inside a qualified policy/relationship/trust/revocation horizon; reconnection requalifies before privileged continuation.
10. AGWS/AI can request or materialize only already-admitted actions; neither UI composition nor model output can mint policy/admin authority.

## Stable findings
- **G2-FINDING-APOM-37** — Authorization identity is typed across semantic policy/model, relationship/membership, organization/tenant/Station, delegation/exception, decision and enforcement-realization kinds; authentication/session identity cannot define authorization identity.
- **G2-FINDING-APOM-38** — Effective authority is a multi-axis revision vector; policy/model revision alone is insufficient without relationship, delegation/exception, identity-security freshness, provider/enforcement and Station-scope evidence.
- **G2-FINDING-APOM-39** — Authorization decision and enforcement are separate convergence stages; a produced `ALLOW` is evidence of evaluation, not proof that the governed action was effectively admitted/enforced.
- **G2-FINDING-APOM-40** — Subject/actor delegation and impersonation require explicit provenance plus independent authority facets; propagated identity claims are inputs/evidence and cannot self-authorize delegated power.
- **G2-FINDING-APOM-41** — Delegated administration is non-amplifying and action-faceted; role binding, policy definition, impersonation, escalation, exception approval, provider administration and recovery must not be implicitly interchangeable across Enterprise→Station→Role→Person.
- **G2-FINDING-APOM-42** — Break-glass/exception authority is a bounded revocable lease with its own lifecycle and evidence, not a permanent role mutation or generic authentication override.
- **G2-FINDING-APOM-43** — Composite authorization proof requires compatible joins across identity-security freshness, policy/model, relationship, scope, delegation/exception, evaluator and enforcement evidence; stale/missing required inputs propagate `PARTIAL/INCONCLUSIVE`.
- **G2-FINDING-APOM-44** — Qualified local/offline authorization has a policy/relationship/trust/revocation horizon; reconnection or superior-epoch change requires requalification before privileged actuation continues.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-APOM-TYPED-AUTHORITY-DECISION-ENFORCEMENT-IDENTITY-MAPPING` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-APOM-MULTI-AXIS-EFFECTIVE-AUTHORITY-REVISION-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-APOM-DECISION-ENFORCEMENT-CONVERGENCE-LINEAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-APOM-BREAK-GLASS-EXCEPTION-LEASE-LIFECYCLE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.

## Value / risk / priority / next question
**Value:** critical constitutional boundary for all generated systems, AGWS and hierarchical Stations. **Risk:** highest if authentication, UI visibility or provider-local roles are mistaken for effective authority. **Priority:** structural/high. **Next question:** Data / Schema / Migrations should test whether schema/data ownership, migration authority, transaction/concurrency semantics and tenant/Station data boundaries can consume the same typed identity/evidence primitives without collapsing authorization ownership into database/provider mechanics.
