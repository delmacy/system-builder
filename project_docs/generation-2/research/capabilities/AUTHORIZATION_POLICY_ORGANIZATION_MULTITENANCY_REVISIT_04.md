# Authorization / Policy / Organization / Multitenancy — Revisit 4 (cycle 5)

Status: MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
How should Generation 2 preserve non-amplifying effective authority across Enterprise → Station → Role → Person while canonical authority, policy/model revision, authentication freshness, contextual evidence, provider consistency, temporary/delegated authority, tenant boundaries and enforcement realization evolve independently?

## Representatives and evidence ledger

| Representative | Coverage | Source of truth | Contribution |
|---|---|---|---|
| Google Zanzibar | DEEP | Google Research / USENIX ATC 2019 paper | Relationship-based authorization at global scale; external consistency and causal ordering show that authorization freshness/consistency is a semantic property, not merely cache age. |
| OpenFGA | DEEP | Official model/version, consistency, contextual tuple and migration docs | Immutable model IDs support pinning and shadow/gradual rollout; consistency is query-profiled; contextual tuples are ephemeral and token-derived context can remain stale until token expiry. |
| Cedar Policy Language | DEEP | Official validation/schema docs | Validation and evaluation are separate; schema changes can invalidate previously valid policies; default no-permit is DENY. |
| Kubernetes RBAC | DEEP | Official RBAC and security guidance | Delegation is subset-bounded by default; `escalate`, `bind`, and `impersonate` are explicit distinct authorities whose possession can widen effective rights. |
| Microsoft Entra PIM | DEEP | Official role activation/settings docs | Eligibility and active privilege are distinct; activation can require MFA/approval and has bounded duration; deactivation can be followed by application cache lag. |
| Amazon Verified Permissions | DEEP | Official policy-store/schema/Cedar migration docs | Eventual consistency creates a decision-freshness window; schema updates do not revalidate existing policies; incompatible Cedar upgrades can require a new policy store. |
| NIST SP 800-207 | DEEP | NIST Zero Trust Architecture | Policy decision and policy enforcement are logically distinct; dynamic inputs inform authorization and enforcement can monitor/terminate access. |

Primary sources:
- https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/
- https://openfga.dev/docs/getting-started/immutable-models
- https://openfga.dev/docs/interacting/consistency
- https://openfga.dev/docs/interacting/contextual-tuples
- https://openfga.dev/docs/modeling/migrating/migrating-models
- https://docs.cedarpolicy.com/policies/validation.html
- https://kubernetes.io/docs/reference/access-authn-authz/rbac/
- https://kubernetes.io/docs/concepts/security/rbac-good-practices/
- https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-how-to-activate-role
- https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-resource-roles-configure-role-settings
- https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_CreatePolicyStore.html
- https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_PutSchema.html
- https://docs.aws.amazon.com/verifiedpermissions/latest/userguide/cedar4-faq.html
- https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf

## Evidence synthesis
Authorization cannot be represented by one current permission snapshot. Zanzibar shows that causal ordering between relationship changes and decisions matters; OpenFGA makes the tradeoff explicit by exposing consistency modes and immutable model IDs. Therefore `PolicyModelRevisionRef` alone is insufficient: each decision also needs a qualified authority-state/freshness basis.

OpenFGA further demonstrates that request-only context and stored relationships have different lifecycle. Contextual tuples can represent selected organization context or token claims, but token-derived claims can remain accepted until token expiry even after underlying membership changes. Identity evidence and authorization state must therefore remain separate inputs with independently evaluated freshness.

Kubernetes sharpens the administrative-authority boundary. Ordinary role creation/binding is constrained to what the administrator already possesses; bypass requires separately named `escalate` or `bind`, while `impersonate` creates another distinct authority. Generation 2 should not model "authorization admin" as a single boolean. Delegation, grant, bind, impersonate, policy-edit and break-glass powers require explicit facets and scope.

NIST SP 800-207 reinforces a second separation: a policy decision point decides, while enforcement is performed by a logically distinct enforcement point. An ALLOW decision does not prove the target accepted or continues to enforce it; conversely successful provider execution is not evidence that the semantic decision was valid.

Entra PIM establishes that temporary elevation is a lifecycle, not a role rewrite. It also documents that application caches may lag role removal, so expiry/revocation of authority and observed enforcement convergence are separate facts. A break-glass or temporary lease therefore needs both authority-expiry evidence and enforcement/postcondition evidence.

Cedar and Amazon Verified Permissions demonstrate that policy/schema evolution can leave historical validity ambiguous: Cedar validation is separate from evaluation; AVP schema changes do not revalidate existing policies, while service propagation is eventually consistent. Policy publication, provider acceptance, effective decision semantics and postcondition validation must remain separate lineage stages.

## Primitives, source of truth, identity and lifecycle
Canonical source of truth should preserve semantic authority independently from provider realization. Relevant identities are `CanonicalAuthoritySubjectRef`, `AuthorityStateRevisionRef`, `OrganizationContextRef`, `StationExposureRevisionRef`, `PolicyModelRevisionRef`, `PolicySchemaRevisionRef`, `DelegationGrantRef`, `TemporaryAuthorityLeaseRef`, `BreakGlassLeaseRef`, `AuthenticationEvidenceRef`, `AuthorizationRequestRef`, `AuthorizationDecisionRef`, `EnforcementAttemptRef`, `EnforcementEvidenceRef` and `AuthorizationFreshnessProfileRef`.

Lifecycle must permit coexistence and revocation without identity collapse:

`eligible/delegable basis → request → policy/auth/freshness validation → approval/activation if required → bounded authority lease → decision → enforcement attempt → observed postcondition → expiry/revocation → enforcement convergence evidence`.

A historical decision or lease remains immutable evidence after later revocation; it simply stops being valid authority for new privileged effects.

## Versioning and freshness
An authorization decision should bind the exact model/schema revision, authority-state or relationship revision/freshness basis, Station/organization context, authentication evidence revision, delegated/elevation lease revision, provider/binding revision, decision time and requested consistency/freshness profile.

Freshness is operation-qualified. Read-only low-risk operations may tolerate a bounded stale profile where policy permits it; security-sensitive mutation, delegation, secret access, provider administration, writer promotion or canonical model mutation should require stronger freshness. Lack of required freshness yields `INCONCLUSIVE` or DENY/fail-closed rather than implicit ALLOW.

## Failure semantics
Typed outcomes should distinguish at least `DENY`, `NO_MATCH_DEFAULT_DENY`, `INVALID_REQUEST`, `POLICY_SCHEMA_INCOMPATIBLE`, `POLICY_EVALUATION_ERROR`, `STALE_AUTHENTICATION_EVIDENCE`, `STALE_AUTHORITY_STATE`, `STALE_POLICY_PROPAGATION`, `CONSISTENCY_PROFILE_UNSATISFIED`, `CAPABILITY_NOT_EXPOSED`, `TENANT_OR_STATION_BOUNDARY_VIOLATION`, `DELEGATION_SUBSET_VIOLATION`, `ADMIN_AUTHORITY_FACET_MISSING`, `LEASE_NOT_ACTIVE`, `LEASE_EXPIRED`, `LEASE_REVOKED`, `APPROVAL_REQUIRED`, `BREAK_GLASS_NOT_ADMITTED`, `PROVIDER_SEMANTIC_MISMATCH`, `ENFORCEMENT_NOT_CONFIRMED`, `ENFORCEMENT_STILL_STALE_AFTER_REVOCATION` and `INCONCLUSIVE`.

PARTIAL/INCONCLUSIVE must propagate when required Identity, organization, policy, entitlement, provider or enforcement evidence is unavailable or stale. Missing evidence must never be converted to authority merely because a provider credential technically permits the action.

## Extensibility, provider boundaries and portability
The portable contract should define semantic requests, authority/freshness requirements and evidence, not require every provider to implement the same RBAC/ABAC/ReBAC ontology. Provider adapters may expose model IDs, consistency tokens/modes, policy-store IDs, native JIT/PIM leases, impersonation or delegation primitives, but these remain realization evidence.

Provider migration should support dual evaluation/shadow checks when possible, explicit model pinning, semantic diffing and cutover readiness. A provider can be technically healthy yet not conform because deny/default/error, consistency, organization-context, escalation or temporary-authority semantics diverge.

## Governance and effective authority
A conservative target relation remains:

`EffectiveAuthority = SuperiorInvariant ∩ StationExposure ∩ CanonicalGrant/Membership ∩ ActiveDelegationOrLease ∩ PolicyDecision ∩ ContextConstraints ∩ FreshnessSatisfied`.

Authentication contributes identity/assurance evidence but cannot add permission. Provider credentials constrain technical execution but cannot widen semantic authority. Administrative authority itself is faceted: `Read/Observe`, `Grant/Bind`, `Delegate`, `Impersonate`, `EditPolicy`, `ActivateTemporaryPrivilege`, `AdmitBreakGlass`, `Revoke`, and provider-specific actuation must be separately scoped.

Break-glass must be modeled as a governed exceptional lease with explicit trigger/justification, scope, bounded lifetime, approving/admitting authority where available, enhanced evidence, revocation and post-use review. It must not silently mutate canonical Role or Station exposure.

## Observability and qualified local closure
Decision evidence and enforcement evidence remain distinct and correlated. Revocation/expiry should expose convergence lag: semantic authority may already be revoked while a downstream application/provider cache still accepts prior state. Observability must represent that window rather than claiming immediate enforcement.

Qualified local/offline authorization closure is operation/profile scoped. It may require a pinned evaluator/model/schema, local authority-state snapshot, Station exposure, trust/authentication validation inputs, declared freshness/consistency policy, enforcement adapter and evidence sink. Offline mode may preserve bounded existing authority under explicit policy; it cannot synthesize new delegation, break-glass, provider-admin or canonical mutation authority just because central dependencies are unavailable.

## Product-specific mechanism versus universal primitive
Universal: revision-bound authority state; operation-qualified freshness/consistency profile; non-amplifying effective-authority intersection; faceted administrative authority; bounded temporary/break-glass lease; decision/enforcement lineage; provider migration conformance; qualified local closure.

Product-specific: Zanzibar tuple/config internals and zookies; OpenFGA tuples/model IDs/consistency modes; Cedar schemas/permit-forbid; Kubernetes `escalate`/`bind`/`impersonate`; Entra PIM eligible/active assignments; AVP policy stores and propagation behavior.

## Convergent and divergent patterns
Convergent: explicit model/policy identity; deny/fail-closed defaults; non-amplifying delegation; temporary authority lifecycle; decision/enforcement separation; freshness/consistency matters; migration requires semantic validation.

Divergent: consistency guarantees, policy language/conflict semantics, relationship storage, temporary-elevation mechanics, tenant/organization representation, enforcement topology and offline behavior. These divergences belong in profiles and provider evidence, not hidden behind a false universal implementation.

## Subcapabilities
1. Canonical authority and organization/Station context identity.
2. Non-amplifying effective-authority resolution.
3. Policy/model/schema lifecycle and semantic compatibility.
4. Operation-qualified consistency/freshness.
5. Delegated administration with subset and authority-facet proof.
6. Temporary/JIT and break-glass authority leases.
7. Tenant/Station isolation and cross-boundary administration.
8. Decision versus enforcement lineage and revocation convergence.
9. Durable/asynchronous privileged-effect reauthorization.
10. Provider coexistence/migration conformance.
11. Qualified local/offline authorization closure.

## SB comparison — evidence-bounded
Fresh `main` `packages/compiler/authority-projection.ts` still defines deterministic role bindings, permission contexts with organization/membership references, structured allow/deny policy declarations, policy references, and validation for resource/action/policy identity. It rejects duplicate/unknown/ambiguous references and preserves normalized policy structure. This remains concrete evidence to **KEEP/HARDEN**.

The inspected file itself does not express policy/model revision identity, explicit authorization-decision lifecycle, consistency/freshness profiles, temporary/break-glass leases, Station exposure, delegated subset/faceted admin proofs, provider migration, or decision-to-enforcement postconditions. This statement is file-scoped; broader repository absence is not inferred before Planning B.

## Reconciliation hypotheses
- **KEEP/HARDEN** deterministic compiler authority projection and reference validation.
- **GENERALIZE** canonical authority/organization/Station identity independently from provider subject/model IDs.
- **GENERALIZE** operation-qualified authorization freshness and consistency profiles.
- **GENERALIZE** administrative authority as explicit non-amplifying facets rather than one broad admin permission.
- **GENERALIZE** temporary and break-glass privilege as bounded governed leases.
- **GENERALIZE** decision-to-enforcement/revocation-convergence evidence lineage.
- **GENERALIZE** durable privileged-effect reauthorization and explicit INCONCLUSIVE propagation.
- **PROVIDERIZE** RBAC/ABAC/ReBAC/PIM engines behind semantic conformance contracts.
- **INTEGRATE** provider-native model IDs, consistency tokens/modes and activation/approval evidence as realization evidence.
- **GENERALIZE** provider coexistence/migration through shared governed transition plus shadow/dual-decision evidence where supported.
- **GENERALIZE** qualified local authorization closure as a specialization of the shared closure primitive.
- **DO_NOT_BUILD** a proprietary universal policy language or universal authorization datastore when provider-neutral semantic contracts suffice.

## Repository-validation questions
1. Where is `CompilerRuntimeAuthorityProjection` evaluated into an authorization decision at runtime?
2. Does runtime evidence bind policy/model/authority-state revisions and requested freshness?
3. Are grant/bind/delegate/impersonate/policy-edit/break-glass authorities distinct anywhere?
4. Is Station capability exposure represented separately from ordinary permission?
5. Can a durable workflow reauthorize before a later privileged effect after membership/policy/Station/authentication changes?
6. Can the system distinguish ALLOW decision from enforcement success and later revocation convergence?
7. Are provider consistency semantics or dual/shadow authorization checks represented for migration?
8. Is there a bounded temporary/elevation or emergency-authority lease with expiry/revocation evidence?
9. How is tenant/Station cross-boundary administration prevented from widening authority?
10. Can offline mode distinguish retained bounded authority from unavailable new grants/delegation/provider-admin operations?

## Symbiotic Proof
A future proof should establish an Enterprise invariant and Station exposure, delegate only an attenuated subset to a Role, and show Person specialization cannot widen it. A stale identity/group claim must not satisfy a high-freshness privileged operation. A policy-model rollout should permit old/new shadow decisions while canonical subject/authority identity stays stable. Grant/bind/impersonate/policy-edit powers must be independently denied when absent. A temporary lease should expire without deleting historical evidence, and an application/provider cache that still permits access must be reported as enforcement-convergence failure. Break-glass must require explicit exceptional admission and must not rewrite canonical Role semantics. Provider migration must fail readiness if deny/default/error/freshness semantics diverge. Offline closure may preserve explicitly allowed bounded operations but cannot invent new authority.

For Adaptive Governed Work Surfaces, mandatory inherited components and Station-denied actions remain non-removable even if renderer/provider features allow customization. Personal automation is attenuated by current effective authority and revalidated on governing revision changes. AI may propose authorization changes, but widening Station exposure, delegation, policy or emergency authority requires the corresponding explicit administrative facet and governed transition.

## Explicit architecture proof-backfill obligations
1. **Non-amplification proof:** attempt Person/Role/Station grant beyond superior effective authority; require subset denial unless a separately authorized escalation facet is present and itself in scope.
2. **Freshness negative proof:** revoke membership/role while presenting stale token/context/cache evidence; a privileged operation requiring fresh authority must DENY/INCONCLUSIVE rather than inherit stale ALLOW.
3. **Decision/enforcement proof:** produce semantic ALLOW then force enforcement failure; record distinct decision and enforcement outcomes. Separately revoke authority while enforcement cache remains stale and expose convergence failure.
4. **Administrative-facet adversarial proof:** permit policy read/observe but deny grant/bind/impersonate/policy-edit; provider capability or broad technical credential must not bypass the missing semantic facet.
5. **Temporary/break-glass lifecycle proof:** eligible privilege is inactive until admitted; activation creates bounded lease; expiry/revocation blocks the next privileged effect while preserving immutable historical evidence.
6. **Tenant/Station isolation proof:** attempt cross-tenant/Station administration using a valid subject/provider credential but without cross-boundary semantic authority; require denial and no side effect.
7. **Provider migration proof:** run shadow/dual decisions over old/new providers/models; introduce a deny/default/freshness semantic mismatch and require cutover readiness to fail.
8. **Dependency-INCONCLUSIVE proof:** remove/stale Identity, policy, organization or provider evidence required by the operation; dependent authorization becomes INCONCLUSIVE/fail-closed while independent evidence remains inspectable.
9. **AGWS authority proof:** personal surface/automation attempts to restore withdrawn Station exposure or expired elevation; mandatory constraints remain effective and mutation is denied/escalated.
10. **Qualified-local-closure proof:** operate from declared offline closure, then remove one required trust/model/authority/freshness dependency; privileged operation degrades/denies/INCONCLUSIVE without silent online fallback or authority widening.

## Stable findings
- **G2-FINDING-AUTH-29 — Authorization Consistency and Freshness Are Operation-qualified Semantic Inputs, Not Provider Cache Details.** Causal/relationship freshness, policy revision and authentication freshness must be explicitly qualified for the requested operation; inability to meet the profile yields DENY/INCONCLUSIVE.
- **G2-FINDING-AUTH-30 — Administrative Authorization Authority Must Be Faceted and Non-amplifying.** Observe/read, grant/bind, delegate, impersonate, policy-edit, temporary activation, break-glass admission and revoke are distinct powers; broad provider capability cannot silently collapse them.
- **G2-FINDING-AUTH-31 — Authorization Decision and Enforcement/Postcondition Are Separate Revision-bound Evidence.** ALLOW does not prove effect, and provider success does not prove semantic authorization; revocation also requires observable enforcement-convergence evidence.
- **G2-FINDING-AUTH-32 — Revocation and Lease Expiry Can Precede Effective Enforcement Convergence.** Cached/provider application state may continue to permit access after semantic authority ends; this lag must be explicit and risk-qualified rather than hidden.
- **G2-FINDING-AUTH-33 — Break-glass Is a Governed Exceptional Authority Lease, Not an Implicit Administrator Bypass.** Emergency authority requires explicit scope, bounded lifetime, evidence, revocation and review, without mutating canonical Role/Station semantics.
- **G2-FINDING-AUTH-34 — Policy/Authorization Provider Migration Requires Dual-model Semantic Qualification, Not Deployment Success.** Model pinning, shadow/dual decisions and explicit deny/default/freshness comparison should qualify cutover where supported.
- **G2-FINDING-AUTH-35 — PARTIAL/INCONCLUSIVE Authorization Must Propagate Missing Identity, Organization, Policy, Entitlement or Provider Evidence Without Permission Inflation.** Missing or stale dependencies cannot be treated as implicit allow.
- **G2-FINDING-AUTH-36 — Qualified Local Authorization Closure Preserves Only Explicitly Bounded Existing Authority.** Offline/degraded operation cannot synthesize new delegation, break-glass, provider-admin or canonical mutation authority when central dependencies are unavailable.

## Capability candidates
- **G2-CAPABILITY-CANDIDATE-AUTH-OPERATION-QUALIFIED-CONSISTENCY-FRESHNESS-EVIDENCE** — CROSS_CUTTING / CONSOLIDATION_CANDIDATE. Reconcile with unified freshness/evidence qualification; Authorization owns the operation-specific authority freshness profile.
- **G2-CAPABILITY-CANDIDATE-AUTH-FACETED-ADMINISTRATIVE-AUTHORITY** — CROSS_CUTTING / CANDIDATE. Test reuse in Governance, Secrets, Provider, Recovery and AI actuation without erasing semantic owners.
- **G2-CAPABILITY-CANDIDATE-AUTH-REVOCATION-ENFORCEMENT-CONVERGENCE-EVIDENCE** — CROSS_CUTTING / CANDIDATE. Reconcile with Observability and unified revision-bound evidence lineage.
- **G2-CAPABILITY-CANDIDATE-AUTH-BREAK-GLASS-EXCEPTIONAL-AUTHORITY-LEASE** — CROSS_CUTTING / CANDIDATE. Validate against Security/Recovery, Governance and AI approvals before promotion/merge with temporary-authority lease.

Existing candidates strengthened: `G2-CAPABILITY-CANDIDATE-MONOTONIC-EFFECTIVE-AUTHORITY-RESOLUTION`, `G2-CAPABILITY-CANDIDATE-DELEGATED-AUTHORITY-SUBSET-PROOF`, `G2-CAPABILITY-CANDIDATE-TEMPORARY-AUTHORITY-ELEVATION-LEASE`, `G2-CAPABILITY-CANDIDATE-UNIFIED-REVISION-BOUND-REALIZATION-EVIDENCE-LINEAGE`, `G2-CAPABILITY-CANDIDATE-UNIFIED-EVIDENCE-QUALIFICATION-CONTRACT`, `G2-CAPABILITY-CANDIDATE-SHARED-GOVERNED-MIGRATION-TRANSITION` and `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-CLOSURE-PROFILE`.

## Value / risk / priority / next question
Value: critical. Risk: critical if stale/partial evidence, provider credentials, emergency paths or administrative operations can widen authority. Priority: critical. Eight material findings reset `consecutive_no_material_finding=0`; capability remains NOT SATURATED.

Next rotation question: how should Data / Schema / Migrations preserve canonical data/schema identity and compatibility while migration/backfill/CDC attempts, authorization/data-governance dependencies, provider storage realization, cutover readiness and recovery evolve independently?
