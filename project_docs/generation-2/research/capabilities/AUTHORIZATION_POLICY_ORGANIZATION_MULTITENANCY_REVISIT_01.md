# Authorization / Policy / Organization / Multitenancy — Revisit 1 (cycle 2)

Status: MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
Can Generation 2 make authorization freshness, revocation propagation, tenant boundaries, delegated administration, decision/enforcement evidence and provider replacement explicit without collapsing authentication into authorization or making the generated runtime depend on the System Builder control plane?

## Representatives and evidence ledger

| Representative | Coverage | Evidence / source of truth | Revisit contribution |
|---|---|---|---|
| Open Policy Agent (OPA) | DEEP | OPA Management APIs, Status, Decision Logs, Discovery | Local decision autonomy, active bundle revision, policy distribution freshness, decision identity/evidence and recovery from persisted discovery state. |
| Cedar Policy Language | DEEP | Cedar validation/schema/context documentation | PARC request contract, default deny, schema/policy compatibility, request-scoped context and independent policy validation. |
| OpenFGA | DEEP | Immutable authorization models, tuple/API best practices, query consistency | Immutable model identity, explicit model pinning, cache/freshness trade-offs and relationship-state evolution. |
| SpiceDB / Authzed | DEEP | Consistency, relationships and ZedToken documentation | Per-request consistency, causal freshness tokens, stale-cache/new-enemy semantics and coupling protected-resource changes to authorization freshness. |
| Keycloak Organizations / FGAP | DEEP | Keycloak 26.7 release and Server Administration Guide | Organization as protected admin resource, bounded delegated administration and resource-type versus per-organization scope. |
| AWS multi-tenant SaaS authorization guidance / Verified Permissions | DEEP | AWS Prescriptive Guidance | Tenant binding of principal/resource, external data responsibility, policy lifecycle ownership and isolation as more than a token/context claim. |

Primary sources:
- https://www.openpolicyagent.org/docs/management-introduction
- https://www.openpolicyagent.org/docs/management-status
- https://www.openpolicyagent.org/docs/management-decision-logs
- https://www.openpolicyagent.org/docs/management-discovery
- https://docs.cedarpolicy.com/policies/validation.html
- https://docs.cedarpolicy.com/bestpractices/bp-using-the-context.html
- https://openfga.dev/docs/getting-started/immutable-models
- https://openfga.dev/docs/getting-started/tuples-api-best-practices
- https://authzed.com/docs/spicedb/concepts/consistency
- https://www.keycloak.org/2026/07/keycloak-2670-released
- https://www.keycloak.org/docs/latest/server_admin/
- https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-api-access-authorization/avp.html

## Evidence synthesis
SpiceDB makes authorization freshness an explicit per-request semantic choice. Cached checks can expose a stale-permission window, while ZedTokens let a caller require data at least as fresh as a causal point tied to protected-resource changes. OpenFGA likewise allows stronger consistency that bypasses cache and recommends pinning authorization model identity. Therefore `policy/model revision`, `relationship/grant snapshot` and `decision freshness/consistency` are separate evidence dimensions.

OPA reinforces a second boundary. An OPA instance can make low-latency local decisions while bundles and management telemetry remain remote. Status reports identify the last successfully activated bundle revision and timestamps; decision logs identify the decision and bundle revision. Persisted discovery bundles can permit best-effort startup while the management endpoint is unavailable. This supports generated-runtime autonomy, but also proves that `runtime available` does not imply `policy state current`.

Cedar separates policy validation from request evaluation and defaults to deny when no policy grants access. Schema changes can invalidate previously validated policies, while request context is intended for per-request facts rather than durable principal/resource truth. This reinforces distinct lifecycle identities for policy/schema, durable authorization data and transient context.

Keycloak 26.7 treats organizations as protected resources in fine-grained admin permissions. A delegated administrator can be bounded to specific organizations without realm-wide authority, while some operations such as creating organizations can require resource-type-level authority. Delegated administration is therefore authorization over administrative resources, not a side effect of application roles.

AWS multi-tenant authorization guidance gives a concrete cross-tenant counterexample: policy may require both principal and resource membership in the same tenant. Merely carrying `tenantId` in context or a token does not prove isolation; the resource-side tenant relation and the data/runtime boundary must agree.

## Universal primitives versus product-specific mechanisms
Portable primitives: `AuthorizationRequest`, qualified subject/principal, action, resource, request context, `AuthorizationModelRef`, `PolicyRevisionRef`, durable relationship/grant state reference, consistency/freshness requirement, `AuthorizationDecision`, `DecisionEvidence`, `EnforcementPointRef`, `EnforcementApplicationEvidence`, organization/tenant identity, delegated-authority grant and provider/binding revision.

Provider-specific mechanisms: Rego and OPA bundle/discovery formats; Cedar syntax/schema encoding; OpenFGA tuple/model APIs; SpiceDB ZedToken wire semantics; Keycloak realm/admin-role names; Verified Permissions policy-store topology. These are realizations/bindings, not the universal ontology.

## Identity, lifecycle and versioning
Authorization identity must distinguish subject identity from credential/session identity, policy/model identity, durable grant/relationship state, tenant/organization identity, provider/binding identity, decision identity and enforcement event identity. A decision may be reproducible only if the evidence identifies the relevant policy/model revision and the freshness/consistency of mutable authorization data.

At least these lifecycles remain separate: policy/schema; grants/relationships/memberships; tenant/organization administration; provider/binding; decision; enforcement application; cache/distribution freshness. Revocation mutates authorization state, while propagation controls when individual decision points can observe that mutation.

## Failure semantics
Typed failures include explicit deny, no-match/default deny, invalid request, invalid/incompatible policy, stale authorization data, consistency requirement unsatisfied, policy bundle unavailable/stale, external entity data unavailable, provider unavailable, enforcement point unavailable/bypassed, delegated-authority scope violation and tenant-boundary mismatch. A successful revocation write followed by a stale allow is a freshness failure, not evidence that revocation did not occur.

## Extensibility, provider boundaries and governance
The portable contract may declare semantic requirements; providers advertise whether they can satisfy relationship, attribute, consistency, policy-version and offline/local-decision requirements. Provider replacement is a migration because default-deny behavior, consistency controls, data-fetching responsibility and conflict semantics may differ even when both expose an allow/deny API.

Administrative authority is separately governed. A subject allowed to use an application resource is not therefore allowed to author policy, assign roles, alter tenant membership, manage provider bindings or delegate administration. Delegation must carry bounded subject/resource/action/tenant scope and must not permit privilege amplification beyond the delegator's authority.

## Observability, portability and lock-in
Decision evidence should identify request, policy/model revision, provider/binding, mutable authorization-data freshness/consistency, decision and timestamp. Enforcement evidence should independently identify the protected operation and the decision it applied. OPA decision logs are strong decision evidence but do not themselves prove the application actually enforced the result.

Portability requires business-semantic roles/relationships/tenant identities and policy intent to survive provider replacement. Lock-in occurs when freshness, tenant, role or policy semantics are encoded only through provider-native tokens, tuples, cache knobs or administrative object names.

## Convergent and divergent patterns
Convergent: policy/model revision matters; mutable grant state can be stale; decision and enforcement differ; tenant administration is itself authorization; identity/authentication evidence is input rather than authority; revocation has propagation semantics. Divergent: consistency controls range from explicit causal tokens to cache bypass or implicit provider behavior; external entity-data retrieval responsibility varies; offline/local policy decision support varies. Generation 2 should model the requirement/evidence, not normalize all provider mechanisms.

## Subcapabilities
1. Portable authorization request and typed decision.
2. Policy/model lifecycle and compatibility.
3. Durable grant/relationship state and consistency/freshness.
4. Revocation propagation evidence.
5. Decision-to-enforcement correlation.
6. Organization/tenant boundary and delegated administration.
7. Provider capability/binding and replacement migration.
8. Generated-runtime local/offline authorization semantics.

## SB comparison — fresh main only
Fresh `main` still contains `packages/compiler/authority-projection.ts` with `CompilerRuntimeRoleBinding`, permissions over role/resource/actions, `organizationRef`/`membershipRef` context, structured allow/deny policies and explicit rejection of ambiguous/unknown references. This is implementation evidence worth KEEP/HARDEN.

The file does not expose a first-class authorization request/decision API, consistency/freshness requirement, authorization-data revision, decision ID, enforcement evidence, delegated-admin contract or provider binding. `organizationRef` exists as permission context, but this file alone does not prove cross-tenant data isolation. No new product truth beyond this bounded evidence is inferred; comprehensive archaeology remains reserved for Planning B.

## Reconciliation hypotheses
- **KEEP/HARDEN** the existing role-binding, permission, structured-policy and organization/membership references.
- **GENERALIZE** request/decision/evidence contracts and explicit consistency/freshness claims.
- **GENERALIZE** revocation propagation as state-change plus observation/freshness evidence, shared with identity without collapsing authentication into authorization.
- **HARDEN** tenant semantics so principal-side context cannot masquerade as isolation proof.
- **GENERALIZE** delegated administration as bounded authority over administrative resources.
- **PROVIDERIZE** external policy engines only behind capability/binding negotiation, including consistency and autonomy requirements.
- **INTEGRATE** provider-specific causal/freshness tokens only as opaque evidence/binding detail where needed.
- **DO_NOT_BUILD** a universal Zanzibar-scale datastore or force one consistency mechanism onto all providers.

## Repository-validation questions
1. Does any current runtime path evaluate `CompilerRuntimeAuthorityProjection`, or is it currently only projected metadata?
2. What owns decision identity and how is a decision correlated with the operation actually enforced?
3. Is there an explicit default-deny/conflict algorithm and is it revision-bound/tested?
4. Can authorization checks declare a minimum freshness/consistency requirement after membership or grant revocation?
5. Can mutable membership/grant state be tied to a revision/causal point independent of policy revision?
6. Does `organizationRef` bind both actor/membership and protected resource/data ownership, or only permission context?
7. Can delegated administrators manage exactly one organization without gaining global policy/provider authority?
8. Can an external provider replacement preserve semantic policy while surfacing consistency/default/failure differences before activation?
9. Can generated runtime continue with last-known-good local policy when control plane is unavailable, while exposing policy staleness distinctly from runtime health?
10. Is authentication assurance consumed as request evidence without becoming durable authorization state?

## Symbiotic Proof
A future proof should demonstrate: a native generated-runtime authorization path with explicit default deny; one external provider path; provider replacement rejected when semantic/consistency requirements cannot be preserved; policy revision and mutable grant freshness captured independently; membership revocation followed by a causally fresh deny; stale-check behavior surfaced as evidence rather than hidden; decision evidence correlated to enforcement evidence; delegated organization administration without global escalation; cross-tenant request denied because principal/resource tenant bindings disagree; and generated runtime continuing safely without Builder availability under a declared last-known-good policy mode.

## Stable findings
- **G2-FINDING-AUTH-11 — Authorization Freshness Is a Decision Requirement, Not a Generic Cache Setting.** A caller/domain may require authorization data at least as fresh as a causal point; provider cache behavior must be surfaced through an explicit consistency/freshness requirement and evidence.
- **G2-FINDING-AUTH-12 — Revocation State Change and Revocation Propagation Are Separate Evidence.** Removing a token, grant, relationship or membership changes authority state, but distributed decision points may observe it later; successful mutation is not proof of globally fresh enforcement.
- **G2-FINDING-AUTH-13 — Policy Revision Does Not Identify Mutable Authorization Data State.** Pinning an authorization model or policy revision is necessary but insufficient when memberships, tuples, attributes or grants evolve independently; decision evidence needs both semantic revision and mutable-state freshness/consistency.
- **G2-FINDING-AUTH-14 — Tenant Context Is Not Tenant Isolation Proof.** A tenant claim/context value is only an authorization input; isolation requires agreement with resource/data ownership and separate data/runtime/control-plane boundaries.
- **G2-FINDING-AUTH-15 — Delegated Administration Is Scoped Authorization Over Administrative Resources.** Organization/policy administration requires explicit resource/action scope and anti-escalation semantics rather than broad realm/global roles or ordinary application permissions.
- **G2-FINDING-AUTH-16 — Decision Evidence and Enforcement Application Evidence Are Distinct.** A decision ID with policy/model revision proves what the PDP decided, not that every protected path applied that decision; enforcement correlation is an independent proof obligation.

## Capability candidates
- **G2-CAPABILITY-CANDIDATE-AUTHORIZATION-CONSISTENCY-FRESHNESS-EVIDENCE** — CROSS_CUTTING. Evidence: SpiceDB causal consistency/ZedTokens + OpenFGA stronger-consistency option + revocation freshness findings. Promotion requires recurrence in Data/Provider/Security synthesis.
- **G2-CAPABILITY-CANDIDATE-ENFORCEMENT-APPLICATION-EVIDENCE** — CROSS_CUTTING. Evidence: OPA decision evidence versus application enforcement boundary + prior architecture proof findings. Promotion requires reusable effect-application proof beyond authorization.
- **G2-CAPABILITY-CANDIDATE-TENANT-ISOLATION-PROOF** — CROSS_CUTTING. Evidence: AWS tenant-bound principal/resource policies + Keycloak scoped organization administration + prior authorization/data boundary finding. Promotion requires Data/Secrets/Deployment convergence.

Existing `G2-CAPABILITY-CANDIDATE-REVOCATION-SCOPE-FRESHNESS-EVIDENCE` gains direct authorization evidence from SpiceDB/OpenFGA consistency semantics. Existing `G2-CAPABILITY-CANDIDATE-AUTHENTICATION-ASSURANCE-EVIDENCE` remains an input-evidence candidate: assurance may affect authorization context but never grants authority by itself.

## Value / risk / priority / next question
Value: critical. Risk: critical if authorization revision, mutable-state freshness, tenant context and actual enforcement are collapsed. Priority: critical. This revisit produced material architectural findings, so `consecutive_no_material_finding=0` and the capability remains NOT SATURATED. Next research question is deferred until its next rotation: can provider-neutral freshness/enforcement evidence remain portable without forcing distributed-consistency machinery into generated runtimes that do not need it?
