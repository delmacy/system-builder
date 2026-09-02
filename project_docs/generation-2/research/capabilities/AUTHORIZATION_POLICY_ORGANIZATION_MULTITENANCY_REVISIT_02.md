# Authorization / Policy / Organization / Multitenancy — Revisit 2 (cycle 3)

Status: MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
How should Generation 2 resolve effective authority after the new Identity, Integration, Workflow and Adaptive Governed Work Surfaces findings, while keeping authentication evidence, organization context, capability exposure, delegated administration, provider credentials and authorization policy semantically distinct and provably non-amplifying?

## Representatives and evidence ledger

| Representative | Coverage | Source of truth | Contribution |
|---|---|---|---|
| Cedar Policy Language | DEEP | Policy examples, schema and validation documentation | Explicit default deny, `forbid` precedence over `permit`, PARC request contract, schema/policy compatibility and typed request context. |
| OpenFGA | DEEP | Contextual tuples, organization-context authorization, conditions, immutable models | Ephemeral organization/session context versus stored relationships; model pinning; conditional relationships; warning that token-derived relationships remain usable until token expiry. |
| SpiceDB / Authzed | DEEP | Relationship/caveat/consistency model from prior pass | Relationship-based authority, request-dependent caveats and causal freshness as separate concerns. |
| Open Policy Agent | DEEP | Discovery/bundle/status/decision-log management model from prior pass | Local decision autonomy and revisioned policy distribution/evidence without forcing runtime dependence on control plane. |
| Kubernetes RBAC | DEEP | RBAC authorization and privilege-escalation prevention docs | Concrete subset/non-escalation rule for role creation/binding; `escalate`, `bind` and `impersonate` are separate privileged authorities. |
| Amazon Verified Permissions | DEEP | OIDC/Cognito identity-source documentation | Token-to-principal/context mapping is explicit and schema-bound; token revocation/resource deletion do not automatically invalidate already issued tokens before expiry. |

Primary sources:
- https://docs.cedarpolicy.com/policies/policy-examples.html
- https://docs.cedarpolicy.com/policies/validation.html
- https://openfga.dev/docs/interacting/contextual-tuples
- https://openfga.dev/docs/modeling/organization-context-authorization
- https://openfga.dev/docs/modeling/conditions
- https://openfga.dev/docs/getting-started/immutable-models
- https://kubernetes.io/docs/reference/access-authn-authz/rbac/
- https://kubernetes.io/docs/concepts/security/rbac-good-practices/
- https://docs.aws.amazon.com/verifiedpermissions/latest/userguide/oidc-create.html
- https://docs.aws.amazon.com/cli/latest/reference/verifiedpermissions/create-identity-source.html
- https://www.openpolicyagent.org/docs/management-discovery

## Evidence synthesis
Kubernetes provides a particularly strong anti-escalation primitive: creating or updating a role is allowed only when the caller already possesses the permissions being granted at the relevant scope, unless the caller separately possesses the exceptional `escalate` authority. Binding and impersonation similarly have explicit privileged verbs. This is stronger than merely checking that an administrator has a generic “manage roles” permission. It suggests a portable `DelegationSubsetProof`: ordinary delegation must be a subset of effective delegator authority, while exceptional widening is a separately named, separately governed authority.

OpenFGA makes organization context an ephemeral request fact rather than a durable organization membership. Contextual tuples exist only for one authorization query and can select which organization context applies when a user belongs to several organizations. Crucially, token-derived contextual relationships can remain accepted until the token expires even if underlying membership changed. Therefore `selected Station/organization context`, `canonical membership`, `authentication token claims` and `authorization relationship state` require independent identities and freshness evidence.

Cedar makes conflict semantics explicit: absence of a permitting policy yields deny, and an applicable `forbid` overrides `permit`. Its schema is also a contract over principal/action/resource/context shapes and must be revalidated when the schema changes. Provider replacement therefore cannot be judged by “both return allow/deny”; it must preserve or explicitly reconcile default behavior, deny precedence, missing-attribute/error behavior, request shape and policy/model compatibility.

AWS Verified Permissions reinforces the authentication/authorization boundary. Identity sources map OIDC/Cognito token claims into principal attributes or request context, but issued tokens can remain usable until expiry even after revocation events elsewhere. Authentication evidence is therefore an input to an authorization decision and may itself be stale. It cannot become durable authorization state or silently widen `Station`/Role authority.

OPA remains useful for runtime autonomy: centrally distributed policy can be evaluated locally and revision evidence can be surfaced independently. The portable model should therefore specify semantic decision/evidence requirements while permitting local/native or external/provider realization.

## Source of truth, identity and lifecycle
Generation 2 should keep separate sources of truth for: canonical subject; authenticated/acting/workload principal evidence; Enterprise/Station/Role/Person organizational context; canonical membership/relationship/grant state; capability exposure; policy/model revision; delegated-administration grant; provider/binding; authorization decision; and enforcement application.

Lifecycle separation is mandatory. Selecting an active Station does not mutate membership. Refreshing a token does not create permission. Updating a policy does not update relationships. Revoking membership does not prove all decision points have observed revocation. Replacing a provider does not prove equivalent policy semantics.

## Versioning and freshness
An authorization decision should be attributable to: semantic request identity; policy/model revision; mutable relationship/grant freshness; authentication-assurance/token freshness used as input; selected organizational/Station context; provider/binding revision; and decision timestamp. Long-lived execution may preserve earlier evidence for audit, but future privileged effects require revalidation under a declared freshness policy when relevant authority inputs have changed or expired.

## Failure semantics
Typed failures include explicit deny; default/no-match deny; policy conflict; invalid request shape; incompatible policy/schema/model revision; stale authentication evidence; stale relationship/grant state; unknown or invalid Station/organization context; capability not exposed; delegated-authority subset violation; prohibited privilege escalation; tenant/resource-boundary mismatch; provider unavailable; provider semantic-conformance mismatch; and decision-enforcement correlation failure.

A denial caused by stale or invalid evidence should remain distinguishable from a semantic policy denial. Likewise, inability to prove non-escalating delegation should fail closed rather than infer authority.

## Extensibility and provider boundaries
The portable contract should expose a provider-neutral `AuthorizationRequest`, `AuthorityContext`, `PolicyRequirement`, `AuthorizationDecision` and `DecisionEvidence`. Providers may realize RBAC, ABAC, ReBAC or combinations, but must declare conflict/default semantics, supported context/relationship models, consistency/freshness controls, local/offline behavior and migration/replacement constraints.

`CapabilityExposure` remains upstream of authorization: a Station may expose a capability without granting a person permission to every operation, and permission cannot resurrect a capability not exposed by superior scope. Provider credentials remain downstream implementation capability: a connector account technically capable of an action cannot widen the semantic authorization decision.

## Governance
Effective authority is monotonically bounded by superior invariants. A useful target relation is:

`EffectiveAuthority = SuperiorInvariant ∩ StationExposure ∩ OrganizationalMembership ∩ Role/PersonGrant ∩ PolicyDecision ∩ CurrentContextConstraints`

with authentication/actor/workload evidence proving who/what is acting, not contributing extra authority. Technical provider/connector capability is an additional execution bound, never an authority source.

Delegated administration requires explicit scope, delegator, grantee, actions, resource/tenant/Station boundary, revision and expiry. Ordinary delegation must include a subset proof relative to the delegator's effective authority. Exceptional escalation is a separate governed authority analogous to Kubernetes `escalate`/`bind`, not an implicit consequence of being an administrator.

## Observability, portability and lock-in
Decision evidence should explain which superior scope, Station exposure, memberships/relationships, policies, contextual facts and delegation grants contributed to the result. This is required for AGWS explainability and for audits of personal/supervised automation.

Portability requires organization/Station/Role relationships and semantic actions/resources to survive provider replacement. Provider-specific tuple syntax, Rego/Cedar syntax, consistency tokens and identity-source mappings remain realization detail. Lock-in exists when business authority is recoverable only from provider-native identifiers or implicit precedence rules.

## Product-specific mechanism versus universal primitive
Universal primitives: `AuthoritySubjectRef`, `ActorRef`, `WorkloadPrincipalRef`, `ScopeRef`, `CapabilityExposureRef`, `MembershipRef`, `RoleGrantRef`, `DelegatedAuthorityGrant`, `DelegationSubsetProof`, `AuthorizationRequest`, `PolicyRevisionRef`, `RelationshipStateRef`, `ContextEvidence`, `AuthorizationDecision`, `DecisionEvidence`, `EnforcementEvidence`, `ProviderBindingRef`, `FreshnessRequirement`.

Product-specific mechanisms: Kubernetes `escalate`/`bind`/`impersonate`; Cedar `permit`/`forbid`; OpenFGA contextual tuples/conditions/model IDs; SpiceDB caveats/ZedTokens; Rego/OPA bundles; Verified Permissions identity sources/policy stores.

## Convergent and divergent patterns
Convergent: authentication is input, not authorization; policy/model revision matters; mutable relationships can become stale; delegated administration needs bounded scope; request context is not canonical organization state; deny/conflict behavior must be explicit; provider replacement is semantic migration; authorization and enforcement evidence differ.

Divergent: deny precedence differs by engine; RBAC/ReBAC/ABAC composition differs; consistency controls range from causal tokens to provider cache behavior; organization context may be native, contextual or application-supplied; local/offline decision support varies. Generation 2 should preserve requirements/evidence instead of normalizing every provider into one implementation model.

## Subcapabilities
1. Effective-authority resolution and monotonic non-weakening.
2. Policy/model lifecycle, conflict/default semantics and compatibility.
3. Organizational/tenant/Station context and canonical membership separation.
4. Scoped capability exposure versus permission grant.
5. Delegated administration and subset/non-escalation proof.
6. Impersonation/OBO/actor authority re-resolution.
7. Relationship/grant/token freshness and long-run revalidation.
8. Provider-neutral decision/enforcement evidence and replacement conformance.
9. Tenant/resource isolation proof.

## SB comparison — fresh main only
Fresh `main` evidence in `packages/compiler/authority-projection.ts` still defines `CompilerRuntimeRoleBinding`, permission role/resource/actions, optional `organizationRef`/`membershipRef`, structured allow/deny policies, role/membership references and deterministic rejection of unknown or ambiguous references. It also validates view action references against known actions. These are concrete implementation facts worth KEEP/HARDEN.

The inspected file does not define a first-class authorization request/decision/evidence lifecycle, explicit allow/deny conflict algorithm, Enterprise/Station/Role/Person effective-resolution contract, capability exposure, delegation subset proof, impersonation semantics, freshness requirements, provider binding, or enforcement correlation. This is file-scoped evidence only; absence repository-wide is not inferred and broader archaeology remains reserved for Planning B.

## Reconciliation hypotheses
- **KEEP/HARDEN** deterministic role/permission/policy reference validation and organization/membership references already projected by the compiler.
- **GENERALIZE** effective authority as a monotonic intersection over superior scope, Station exposure, membership, role/person grants, policy and context.
- **GENERALIZE** delegated administration with explicit subset/non-escalation proof and exceptional escalation as separately authorized governance.
- **GENERALIZE** selected organization/Station context as ephemeral context evidence distinct from canonical membership.
- **HARDEN** conflict/default semantics so deny precedence and evaluation-error behavior are explicit and testable.
- **GENERALIZE** long-running authority revalidation using revision/freshness evidence rather than relying on start-time authorization forever.
- **PROVIDERIZE** RBAC/ABAC/ReBAC engines behind semantic requirements and conformance evidence.
- **INTEGRATE** provider-native causal tokens/model IDs/identity mappings as opaque evidence when required.
- **DO_NOT_BUILD** a universal global Zanzibar-scale authorization datastore when a bounded native runtime policy path suffices.

## Repository-validation questions
1. What currently computes an allow/deny result from `CompilerRuntimeAuthorityProjection`, and what is the exact conflict/default algorithm?
2. Does any product concept equivalent to `Station` already exist under another name, and can it suppress capability exposure independently of permissions?
3. Are organization and membership references bound to canonical organization records or merely strings in the projection?
4. Can role/policy administrators grant permissions they themselves do not possess?
5. Is there any explicit impersonation/delegation model preserving subject versus actor lineage?
6. Can a long-running workflow revalidate authority after role, membership, Station or policy changes?
7. Are provider/workload credentials intersected with semantic authority or simply trusted after authentication?
8. Are deny precedence, policy errors and default-deny semantics deterministic and covered by tests?
9. Can a tenant/resource ownership mismatch be detected independently of principal-side organization context?
10. Is there decision-to-enforcement evidence anywhere outside the inspected compiler projection?

## Symbiotic Proof
A future integrated proof should demonstrate: Enterprise grants a Station only a subset of capabilities; Station grants a Role bounded operations; Person specialization cannot widen them; authentication as one human plus an acting workload credential preserves subject/actor lineage; selecting a different organization context does not mutate canonical membership; a delegated administrator can create only grants that are subsets of its own effective authority; an attempted privilege-widening grant is rejected unless a separately governed escalation authority exists; a `forbid`/deny invariant cannot be neutralized by a lower permit; membership/Role/Station change invalidates or revalidates a pending privileged workflow step; a connector credential with broader technical rights cannot widen the semantic action; provider replacement is blocked if deny/default/context semantics cannot be proven equivalent; and decision evidence is correlated with the enforced operation.

For Adaptive Governed Work Surfaces specifically, the same proof must show that mandatory superior components and capability exposure cannot be weakened by Person overlays, personal automation remains within Station/Role authority, and AI materialization requesting a canonical domain/policy widening is escalated rather than silently applied.

## Stable findings
- **G2-FINDING-AUTH-17 — Effective Authority Is a Monotonic Resolution, Not a Union of Credentials, Roles and Context.** Authentication, actor/workload credentials and request context identify or constrain execution; they do not contribute additive authority. Effective authority must remain bounded by superior invariants, Station exposure, canonical membership/grants, policy and contextual constraints.
- **G2-FINDING-AUTH-18 — Delegated Administration Requires a Subset/Non-Escalation Proof.** Ordinary administrators must not create or bind authority exceeding what they themselves effectively possess at the delegated scope; any exceptional widening capability must be separately named, governed and evidenced.
- **G2-FINDING-AUTH-19 — Impersonation and On-Behalf-Of Require Authority Re-Resolution Under Preserved Subject/Actor Lineage.** Acting as another principal is not permission inheritance by convenience; the system must preserve both identities and compute authority for the acting context without silently widening it.
- **G2-FINDING-AUTH-20 — Selected Organization/Station Context Is Ephemeral Authorization Input, Not Canonical Membership State.** Session/window/token context may select among valid organizational scopes, but it must not create durable membership, and stale token claims must be distinguishable from current canonical relationships.
- **G2-FINDING-AUTH-21 — Permit/Deny/Conflict/Error Semantics Are Part of Provider Conformance.** An allow/deny API is not a sufficient portability contract; default deny, explicit-deny precedence, missing-data/error behavior and policy/schema compatibility must be declared and checked during provider replacement.
- **G2-FINDING-AUTH-22 — Long-Running Privileged Effects Require Authority Revalidation Against Mutable Inputs.** Start-time authorization may remain historical evidence, but later privileged effects need declared revalidation when membership, Role, Station exposure, policy, delegation, identity assurance or provider-binding freshness can materially change.

## Capability candidates
- **G2-CAPABILITY-CANDIDATE-MONOTONIC-EFFECTIVE-AUTHORITY-RESOLUTION** — CROSS_CUTTING / CANDIDATE. Promotion condition: AGWS, Workflow, Integration, AI and Governance synthesis confirm one reusable non-widening resolution primitive across human, agent and provider execution.
- **G2-CAPABILITY-CANDIDATE-DELEGATED-AUTHORITY-SUBSET-PROOF** — CROSS_CUTTING / CANDIDATE. Promotion condition: Governance, Extension/Marketplace and AI delegated-action findings converge on reusable delegation-without-escalation evidence.
- **G2-CAPABILITY-CANDIDATE-AUTHORIZATION-CONTEXT-PROVENANCE** — CROSS_CUTTING / CANDIDATE. Promotion condition: Identity, Observability and AGWS synthesis confirm one reusable evidence model for selected scope/context versus canonical membership and mutable authorization state.

Existing candidates strengthened: `G2-CAPABILITY-CANDIDATE-MONOTONIC-AUTHORITY-ATTENUATION-ACROSS-AUTOMATION-HOPS`, `G2-CAPABILITY-CANDIDATE-AUTHORITY-REVALIDATED-DURABLE-CONTINUATION`, `G2-CAPABILITY-CANDIDATE-ACTOR-SUBJECT-WORKLOAD-IDENTITY-LINEAGE`, `G2-CAPABILITY-CANDIDATE-SCOPED-CAPABILITY-EXPOSURE` and `G2-CAPABILITY-CANDIDATE-CONNECTOR-CREDENTIAL-SEMANTIC-AUTHORITY-INTERSECTION` all gain direct authorization evidence.

## Value / risk / priority / next question
Value: critical. Risk: critical if identity, context, exposure, permission, provider credential and delegation are unioned into one authority concept. Priority: critical. Six material findings reset `consecutive_no_material_finding=0`; capability remains NOT SATURATED. Next rotation question: can the same effective-authority proof remain portable across role, relationship and attribute policy providers without forcing provider-specific ontology into the portable definition?
