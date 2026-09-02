# Authorization / Policy / Organization / Multitenancy — Revisit 3 (cycle 4)

Status: MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
How should Generation 2 preserve monotonic effective authority while policy/model revisions, authentication context, temporary elevation, delegated administration, asynchronous work, provider replacement and Enterprise → Station → Role → Person projections evolve independently?

## Representatives and evidence ledger

| Representative | Coverage | Source of truth | Contribution |
|---|---|---|---|
| Cedar Policy Language | DEEP | Policy/schema validation documentation | Schema is a contract for PARC request shapes; validation is separate from evaluation; schema changes can invalidate previously valid policy and default no-permit is DENY. |
| OpenFGA | DEEP | Contextual tuples, conditions, immutable authorization models | Request-only context is ephemeral; token-derived context may remain accepted until token expiry; model IDs are immutable/pinnable; temporal conditions model bounded grants. |
| Kubernetes RBAC | DEEP | RBAC authorization and good-practices documentation | Delegation is subset-bounded unless explicit `escalate`; `bind` and `impersonate` are separately privileged authorities. |
| Microsoft Entra PIM | DEEP | Role activation/settings documentation | Eligible assignment is distinct from active elevation; activation may require justification, MFA/approval and has bounded lifetime. |
| Amazon Verified Permissions | DEEP | Policy-store/Cedar migration documentation | Policy stores are eventually consistent; Cedar major-version migration can be incompatible and can require a new policy store. |
| Open Policy Agent | DEEP | Prior bundle/decision-log evidence | Local policy evaluation can preserve runtime autonomy while decision evidence remains revision-attributable. |

Primary sources:
- https://docs.cedarpolicy.com/policies/validation.html
- https://docs.cedarpolicy.com/schema/schema.html
- https://openfga.dev/docs/interacting/contextual-tuples
- https://openfga.dev/docs/getting-started/immutable-models
- https://openfga.dev/docs/modeling/conditions
- https://kubernetes.io/docs/reference/access-authn-authz/rbac/
- https://kubernetes.io/docs/concepts/security/rbac-good-practices/
- https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-how-to-change-default-settings
- https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-resource-roles-activate-your-roles
- https://docs.aws.amazon.com/verifiedpermissions/latest/userguide/cedar4-faq.html
- https://docs.aws.amazon.com/cli/latest/reference/verifiedpermissions/create-policy-store.html

## Evidence synthesis
Authorization has at least four independently revisioned facts: canonical authority state, policy/model interpretation, decision evidence, and enforcement/actuation. A previously valid decision can become stale without changing the canonical subject: policy revision, role/membership change, Station exposure change, authentication assurance change or provider consistency lag can invalidate future privileged effects.

Cedar shows that policy validation and policy evaluation are separate operations and that schema evolution may invalidate policies previously considered valid. Therefore a policy migration that parses or loads successfully is not enough; compatibility must be validated against the target schema/profile and then confirmed by postcondition evidence.

OpenFGA reinforces request-context freshness: contextual tuples are request-scoped, and token-derived relationships can outlive the underlying membership until token expiry. Immutable authorization-model IDs support explicit pinning, so durable work should preserve which model was used rather than silently drifting to latest.

Kubernetes remains strong evidence for monotonic delegation. Ordinary role creation/binding cannot grant what the delegator lacks unless a separately named escalation authority exists. This pattern should generalize to Station delegated administration and to AI-generated authorization changes.

Microsoft Entra PIM adds a missing lifecycle primitive: eligibility is not active authority. Temporary privilege is an activation/lease with bounded scope/lifetime and optional approval/justification/MFA. Generation 2 should model temporary elevation as a governed authority lease rather than mutating the underlying canonical Role definition.

Amazon Verified Permissions exposes two failure modes relevant to provider portability: policy-store updates are eventually consistent, and a Cedar major-version upgrade can be semantically incompatible enough to require a new store. Therefore provider replacement/migration needs explicit cutover and stale-window semantics, not merely successful deployment.

## Source of truth, identity and lifecycle
Keep distinct identities for `AuthoritySubjectRef`, canonical membership/grant state, Station capability exposure, `PolicyModelRevisionRef`, authentication-context evidence, `TemporaryAuthorityLease`, `AuthorizationRequest`, `AuthorizationDecision`, `DecisionEvidence`, `EnforcementAttempt` and `EnforcementEvidence`.

Lifecycle must permit coexistence: an old decision remains historical evidence after a policy update; an eligible assignment can exist without active elevation; a temporary lease can expire without deleting the underlying role; a durable run can retain start-time evidence while requiring fresh authorization before a later privileged effect.

## Versioning and failure semantics
Decision evidence should bind at least request identity, policy/model revision, relationship/grant revision or freshness token, Station/organization context, authentication assurance revision, provider/binding revision, decision time and freshness profile.

Typed failure states include `DENY`, `NO_MATCH_DEFAULT_DENY`, `INVALID_REQUEST`, `POLICY_SCHEMA_INCOMPATIBLE`, `POLICY_EVALUATION_ERROR`, `STALE_AUTHENTICATION_CONTEXT`, `STALE_RELATIONSHIP_STATE`, `STALE_POLICY_PROPAGATION`, `CAPABILITY_NOT_EXPOSED`, `DELEGATION_SUBSET_VIOLATION`, `ELEVATION_NOT_ACTIVE`, `ELEVATION_EXPIRED`, `ELEVATION_APPROVAL_REQUIRED`, `PROVIDER_SEMANTIC_MISMATCH`, `DECISION_ENFORCEMENT_UNCORRELATED` and `INCONCLUSIVE` when required freshness/coverage cannot be established.

## Extensibility, provider boundaries and portability
Generation 2 should define semantic requirements and evidence, not force RBAC/ABAC/ReBAC into one provider ontology. Provider adapters may expose policy language/model IDs, consistency tokens and native elevation mechanics, but replacement conformance must compare deny/default/error semantics, context interpretation, freshness/consistency profile and temporary-elevation behavior.

Qualified local/offline authorization closure is operation/profile scoped. It may require evaluator, pinned policy/model/schema, relationship/grant snapshot or local datastore, trust/authentication validation inputs, Station exposure, freshness rules, enforcement adapter and evidence sink. It does not imply central Builder availability.

## Governance and authority
A target relation remains monotonic:

`EffectiveAuthority = SuperiorInvariant ∩ StationExposure ∩ CanonicalMembership/Grant ∩ ActiveDelegationOrElevationLease ∩ PolicyDecision ∩ ContextConstraints`

Authentication proves identity/assurance and constrains the request; it does not add permission. Technical provider credentials constrain execution capability but cannot widen semantic authority.

Temporary elevation should be represented as `Eligibility → ActivationRequest → Validation/Approval → AuthorityLease → Expiry/Revocation → PostconditionEvidence`. The lease must reference scope, eligible basis, activation requirements, start/end, approver evidence when applicable and the policy/model revisions under which activation was admitted.

## Observability and evidence
For durable or asynchronous work, an authorization snapshot is historical evidence, not a perpetual capability token. Before a later privileged effect, the runtime applies a declared revalidation profile. If revalidation cannot establish freshness because the provider is unavailable or state propagation is uncertain, the result is `INCONCLUSIVE`/fail-closed for privileged effects unless policy explicitly defines a bounded offline allowance.

Decision evidence and enforcement evidence remain distinct. An allow decision does not prove the intended operation occurred, and a provider credential successfully executing an operation does not prove semantic authorization was valid.

## Product-specific mechanism vs universal primitive
Universal primitives: `PolicyModelRevisionRef`, `AuthorityStateRef`, `TemporaryAuthorityLease`, `AuthorizationRequest`, `AuthorizationDecision`, `DecisionEvidence`, `EnforcementAttempt`, `EnforcementEvidence`, `FreshnessProfile`, `DelegationSubsetProof`, `StationExposureRef`, `GovernedMigrationTransition`, `QualifiedLocalClosureProfile`.

Product-specific mechanisms: Cedar schemas/permit-forbid, OpenFGA tuples/model IDs/conditions, Kubernetes RBAC verbs, Entra PIM eligible/active assignments, AVP policy stores/Cedar versions, OPA bundles/Rego.

## Convergent and divergent patterns
Convergent: policy/model revision matters; authorization context can be ephemeral; delegation must be non-amplifying; temporary elevation has lifecycle separate from role definition; decision and enforcement are distinct; provider migration requires semantic compatibility; stale evidence must not silently become allow.

Divergent: policy conflict semantics, consistency models, temporary-elevation mechanics, policy language, relationship storage and offline behavior. The portable contract should preserve these as declared profiles/evidence instead of hiding them.

## Subcapabilities
1. Monotonic effective-authority resolution.
2. Policy/model/schema lifecycle and compatibility.
3. Enterprise/Station/Role/Person organizational and capability-exposure resolution.
4. Delegated administration and subset proof.
5. Temporary elevation / just-in-time authority leases.
6. Authentication-context and relationship freshness.
7. Durable/asynchronous authorization revalidation.
8. Decision/enforcement evidence correlation.
9. Provider migration/replacement conformance.
10. Qualified local/offline authorization closure.

## SB comparison — fresh main only
Fresh `main` `packages/compiler/authority-projection.ts` defines deterministic role bindings, permissions, optional organization/membership context, structured allow/deny policies and view/action reference validation. It rejects duplicate/unknown/ambiguous references and preserves structured policy effects. This is concrete evidence to KEEP/HARDEN.

The inspected file does not itself model policy/model revision identity, decision/evidence lifecycle, temporary elevation, Station capability exposure, delegated subset proof, freshness/consistency, provider binding, durable revalidation or decision-to-enforcement correlation. This statement is file-scoped only; broader repository absence is not inferred before Planning B.

## Reconciliation hypotheses
- **KEEP/HARDEN** deterministic role/permission/policy/reference validation already present in the compiler projection.
- **GENERALIZE** policy/model and authority-state revision identity so decisions are attributable to exact governing inputs.
- **GENERALIZE** temporary elevation as bounded `AuthorityLease`, never mutation of canonical Role semantics.
- **GENERALIZE** durable/asynchronous revalidation profiles with explicit stale/inconclusive states.
- **GENERALIZE** Station delegated administration using subset/non-escalation proof.
- **PROVIDERIZE** RBAC/ABAC/ReBAC and JIT-elevation engines behind semantic conformance/evidence contracts.
- **INTEGRATE** provider-native model IDs, consistency tokens and approval evidence as opaque realization evidence.
- **GENERALIZE** authorization provider migration using the shared governed migration transition.
- **GENERALIZE** qualified local authorization closure as a specialization of the cross-cutting local-closure primitive.
- **DO_NOT_BUILD** a universal global authorization datastore or proprietary policy language when bounded native/provider realizations suffice.

## Repository-validation questions
1. Where is `CompilerRuntimeAuthorityProjection` evaluated into an allow/deny decision today?
2. Is policy/model revision identity carried into runtime evidence anywhere?
3. Can role/policy administration grant permissions beyond the administrator's effective authority?
4. Does any existing concept correspond to temporary/eligible/active elevation or delegated lease?
5. Can durable workflow/integration work revalidate after Role, membership, Station, policy or auth-context change?
6. Are authorization-provider consistency/freshness semantics represented anywhere?
7. Can an enforcement attempt be correlated to the exact decision that admitted it?
8. Does any runtime path support local/offline authorization with pinned policy/model/trust dependencies?
9. Is Station-equivalent capability exposure modeled separately from permission?
10. Can policy/provider migration prove semantic equivalence rather than only successful deployment?

## Symbiotic Proof
A future proof should show Enterprise restricts a Station to a capability subset; Station delegates only an attenuated subset to a Role; Person specialization cannot widen it; authentication assurance satisfies the operation profile but adds no permission; an eligible elevated role yields no authority until an activation is approved and produces a bounded lease; lease expiry invalidates the next privileged effect without rewriting historical evidence; a durable workflow admitted under an earlier decision revalidates after policy/Role/Station change; stale provider propagation yields fail-closed/inconclusive instead of implicit allow; a connector credential with broader technical rights cannot widen the semantic decision; provider migration is blocked when deny/default/context/freshness semantics cannot be reconciled; and the resulting enforcement evidence references the exact decision and authority revisions.

For Adaptive Governed Work Surfaces, changing Station, Role, policy or authentication context must re-resolve the effective surface and its actions. Mandatory superior components remain non-removable; personal automation is bounded by current Station/Role authority; AI may materialize an authorized candidate surface but any policy/domain/provider/capability-exposure widening becomes an escalation artifact, not a silent mutation.

## Stable findings
- **G2-FINDING-AUTH-23 — Canonical Authority, Policy/Model, Decision and Enforcement Revisions Must Coexist Without Identity Collapse.** Historical decisions remain attributable to their governing inputs while later policy, relationship, Station or authentication changes produce new effective authority for future effects.
- **G2-FINDING-AUTH-24 — Temporary Privilege Is a Governed Authority Lease, Not a Canonical Role Mutation.** Eligibility, activation, approval/assurance requirements, bounded lifetime, expiry/revocation and active authority are distinct lifecycle states.
- **G2-FINDING-AUTH-25 — Durable and Asynchronous Privileged Effects Require Freshness-Profiled Reauthorization.** Start-time allow is historical evidence; later privileged effects must revalidate mutable authority inputs according to an explicit profile and fail closed/inconclusive when required freshness cannot be established.
- **G2-FINDING-AUTH-26 — Authorization Policy/Provider Migration Is a Governed Plan/Validation/Approval/Attempt/Postcondition Transition.** Successful load/deploy is insufficient; schema/model compatibility, deny/default/error semantics, consistency/freshness behavior and cutover state require evidence.
- **G2-FINDING-AUTH-27 — Qualified Local Authorization Closure Must Include Policy Interpretation, Authority State, Trust, Freshness and Enforcement Dependencies.** Air-gapped/self-hosted autonomy is operation/profile scoped and cannot be inferred from merely having a local policy evaluator.
- **G2-FINDING-AUTH-28 — AGWS Revalidation Consumes Current Station/Role/Policy/Auth Evidence Without Authority Amplification.** Surface/action validity is re-resolved when governing revisions change; AI/personal overlays cannot restore withdrawn exposure, expired elevation or superior permissions.

## Capability candidates
- **G2-CAPABILITY-CANDIDATE-TEMPORARY-AUTHORITY-ELEVATION-LEASE** — CROSS_CUTTING / CANDIDATE. Promotion/merge condition: Governance, AI approvals and Security confirm a reusable bounded-elevation primitive beyond Authorization specialization.
- **G2-CAPABILITY-CANDIDATE-AUTHORIZATION-DECISION-ENFORCEMENT-REVISION-EVIDENCE** — CROSS_CUTTING / CANDIDATE / MERGE_TARGET. Likely specialization of unified revision-bound realization/evidence lineage; test in Governance/Observability.
- **G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-AUTHORIZATION-CLOSURE** — CROSS_CUTTING / CANDIDATE / MERGE_TARGET. Likely specialization of `QUALIFIED-LOCAL-CLOSURE-PROFILE`; confirm with Secrets/Configuration and Deployment.

Existing consolidation candidates strengthened: `G2-CAPABILITY-CANDIDATE-UNIFIED-REVISION-BOUND-REALIZATION-EVIDENCE-LINEAGE`, `G2-CAPABILITY-CANDIDATE-UNIFIED-EVIDENCE-QUALIFICATION-CONTRACT`, `G2-CAPABILITY-CANDIDATE-NON-ACTUATING-RECONCILIATION-AUTHORITY-SEPARATION`, `G2-CAPABILITY-CANDIDATE-SHARED-GOVERNED-MIGRATION-TRANSITION`, `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-CLOSURE-PROFILE`, `G2-CAPABILITY-CANDIDATE-MONOTONIC-EFFECTIVE-AUTHORITY-RESOLUTION` and `G2-CAPABILITY-CANDIDATE-DELEGATED-AUTHORITY-SUBSET-PROOF`.

## Value / risk / priority / next question
Value: critical. Risk: critical if temporary elevation, policy revision, authentication evidence, provider consistency and execution credentials are collapsed into one permission state. Priority: critical. Six material findings reset `consecutive_no_material_finding=0`; capability remains NOT SATURATED. Complexity evidence for later commercial metering may count policy-model breadth, hierarchy depth, number/type of providers, delegated scopes, JIT-elevation requirements, consistency/freshness profiles and regulated evidence obligations, but Authorization does not own rating/billing.

Next rotation question: how should Data / Schema / Migrations preserve canonical data/schema identity while migration attempts, compatibility windows, provider-specific storage realizations and authorization/data-governance dependencies evolve independently?
