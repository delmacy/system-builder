# Identity / Authentication / Federation — Revisit 1 (cycle 2)

Status: MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
Can the portable identity boundary distinguish semantic identity, credential/session/token artifacts, federation trust state, assurance context and provider replacement without becoming an identity platform or weakening generated-runtime autonomy?

## Representatives and evidence ledger

| Representative | Coverage | Evidence / source of truth | Revisit contribution |
|---|---|---|---|
| OAuth 2.0 Authorization Server Metadata — RFC 8414 | DEEP | RFC Editor / IETF | Issuer identity, metadata discovery, endpoint/capability advertisement, signed metadata and issuer-validation boundary. |
| OAuth 2.0 Token Revocation — RFC 7009 + OAuth Security BCP RFC 9700 | DEEP | RFC Editor / IETF | Token/grant revocation, cascading policy, propagation/freshness limits and unexpected invalidation. |
| SPIFFE / SPIRE | DEEP | SPIFFE specifications/docs | Workload identity distinct from short-lived SVID credentials; trust-domain identity; rotating bundles; federation across independent authorities. |
| OpenID Connect Core | DEEP | OpenID Foundation specification | Authentication time/context (`auth_time`, `acr`, `amr`, `max_age`) is evidence about a ceremony, not subject identity itself. |
| Keycloak / Entra / Auth0 / Clerk / ZITADEL | DEEP (retained) | First-pass dossier | Cross-check for local identity, issuer/tenant, provider binding, sessions and delegated administration. |

## Evidence synthesis
RFC 8414 makes the authorization-server issuer an identity and validation anchor: discovered metadata must return the exact issuer used to derive the discovery location, while endpoints and capabilities are metadata associated with that issuer rather than its identity. Signed metadata can additionally carry attestation. This separates **provider/issuer identity**, **metadata revision**, **metadata retrieval observation** and **trust decision**.

RFC 7009 shows that token revocation is not equivalent to session or identity revocation. Revoking one token may cascade to related tokens/grants according to server policy, and distributed propagation can leave a bounded stale-validity window. A 503 means the client must assume the token still exists. RFC 9700 further treats refresh-token rotation/revocation as security-state machinery. Therefore a portable model cannot truthfully collapse `revoked=true` across token, grant, session and local identity.

SPIFFE provides a strong machine-identity counterexample to user-centric identity models. A stable SPIFFE ID identifies a workload, while an SVID is a short-lived verifiable credential for that identity. Trust bundles rotate independently; federation requires continuously obtaining foreign trust-domain bundles. Thus `identity != credential != trust material`, and freshness of trust material is part of verification evidence.

OpenID Connect authentication-context claims reinforce that assurance is event/session evidence: authentication time and methods/context describe how/when authentication occurred. They must not become permanent properties of the subject.

## Universal primitives versus product-specific mechanisms
Portable candidates: local semantic identity; qualified external identity `(authority/issuer/trust-domain, subject)`; authentication relationship; provider binding; credential/assertion reference; authentication event; assurance context; session; token/grant lineage; trust-material revision; trust observation/freshness; revocation event/scope; verification evidence; provider-replacement reconciliation evidence.

Provider-specific: OAuth/OIDC endpoints and grant mechanics, JWT/JWK representation, SAML metadata, SPIFFE SVID formats/Workload API, Keycloak realms, Entra tenant claims, Auth0 Connections, Clerk session handshakes. These remain bindings/realizations rather than universal ontology.

## Identity, lifecycle and versioning
Identity layers must be explicit: local identity; external subject identity qualified by authority; provider/binding identity; credential identity; session identity; token/grant identity; trust-domain/issuer identity. Lifecycles are independent but linked. Metadata/key/bundle revision can change without changing issuer or subject. Credentials rotate without changing workload identity. Provider replacement is a migration of authentication relationships and trust evidence, not a rewrite of business identity.

## Failure semantics
Typed failures include issuer mismatch, metadata unavailable/stale/untrusted, trust bundle stale, unknown signing key, credential expired/revoked, revocation indeterminate, session revoked/expired, assurance insufficient, subject-link ambiguous, provider unavailable and local identity disabled. `authentication failed` is too coarse for governance and recovery.

## Extensibility, provider boundaries and governance
Protocol and credential mechanisms are provider-specific. Universal authority is limited to declaring requirements and accepting/rejecting evidence. A provider must not gain business authorization merely because it authenticated a subject. Revocation authority must state scope (credential/token/grant/session/relationship/local identity) and actor. Provider replacement requires explicit reconciliation and cannot infer equivalence from email/display attributes.

## Observability, portability and lock-in
Evidence should record issuer/trust-domain, binding revision, authentication event, assurance context, trust-material revision/freshness, verification result and revocation scope without persisting reusable secrets/tokens. Portability requires local identities and business references to survive provider replacement. Lock-in occurs when provider-native subject IDs, session SDK behavior, assurance labels or tenant constructs become business-semantic truth.

## Convergent and divergent patterns
Convergent: semantic identity is longer-lived than credentials; trust material rotates; verification is contextual and time-bound; revocation has scope; federation crosses explicit authority boundaries. Divergent: user identity federation and workload identity use different ceremonies/credentials; immediate revocation semantics vary by token form/provider; assurance vocabularies are profile/provider-specific. The universal layer should model claims/evidence and scope, not normalize every mechanism.

## Subcapabilities
1. Qualified identity and authentication relationship.
2. Authentication event and assurance evidence.
3. Session/token/grant lineage.
4. Federation trust-material lifecycle and freshness.
5. Revocation scope and propagation evidence.
6. Provider replacement/reconciliation.
7. Human/workload identity specialization behind shared primitives.

## SB comparison
No fresh-main comparison was required in this revisit because the unresolved questions were external architectural questions and the first-pass repository comparison already bounded known schema evidence. Repository archaeology remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; this revisit does not infer new implementation truth.

## Reconciliation hypotheses
- **KEEP/HARDEN** local identity and provider-reference separation if repository archaeology confirms semantics.
- **GENERALIZE** authentication-event/assurance evidence as time-bound evidence rather than identity attributes.
- **GENERALIZE/PROVIDERIZE** trust-material lifecycle: portable freshness/identity contract, provider-specific retrieval/rotation.
- **HARDEN** revocation semantics around explicit target/scope and observation freshness.
- **INTEGRATE** workload identity only through common identity/trust primitives; do not force human session semantics onto workloads.
- **DO_NOT_BUILD** a universal IdP, universal credential format or universal assurance vocabulary.

## Repository-validation questions
1. Can one local identity retain multiple authentication relationships without changing business references?
2. Are token/grant/session identities and revocation scopes distinct in runtime state/evidence?
3. Can verification evidence bind to issuer/provider-binding and trust-material revision/freshness?
4. Does runtime distinguish authentication-event assurance from durable identity attributes?
5. Can service identities use workload-oriented credentials without inheriting human session assumptions?
6. Can provider replacement preserve local identity while recording reconciliation evidence?
7. Can generated runtime refresh trust metadata/keys autonomously without Builder callbacks?
8. Is indeterminate revocation/provider outage fail-closed or policy-qualified, and is that decision evidenced?

## Symbiotic Proof
A future proof should demonstrate: stable local identity across two providers; provider A authentication with explicit assurance evidence; provider replacement to B without rewriting business ownership; a workload identity path using rotating short-lived credentials; trust-material rotation without identity change; scoped revocation proving token/session effects separately; stale/unknown trust material failing deterministically; and generated-runtime verification continuing without System Builder control-plane availability.

## Stable findings
- **G2-FINDING-IAF-11 — Identity and Credential Are Separate Identities.** A stable human/service/workload identity must not be equated with the token, certificate, assertion or other credential currently proving it.
- **G2-FINDING-IAF-12 — Federation Trust Is Revisioned Verification Context.** Issuer/trust-domain identity is stable while metadata, keys and trust bundles evolve; verification evidence must identify the trust context/revision or freshness used.
- **G2-FINDING-IAF-13 — Revocation Requires Explicit Target and Scope.** Token, grant, session, authentication relationship and local identity revocation are different operations and may cascade only under declared policy.
- **G2-FINDING-IAF-14 — Revocation Freshness Is an Evidence Claim.** Distributed propagation and offline/self-contained credentials mean a revocation decision has observation/freshness semantics; a successful revocation request is not proof that every verifier has converged.
- **G2-FINDING-IAF-15 — Authentication Assurance Belongs to the Authentication Event.** Authentication time, methods and assurance context are evidence about a ceremony/session and must not silently become permanent subject attributes.
- **G2-FINDING-IAF-16 — Human and Workload Identity Share Trust Primitives, Not Credential Lifecycles.** Stable qualified identity, authority and verification evidence can be common, while login sessions and workload SVID rotation remain specialized mechanisms.

## Capability candidates
- **G2-CAPABILITY-CANDIDATE-REVOCATION-SCOPE-FRESHNESS-EVIDENCE** — CROSS_CUTTING. Evidence: RFC 7009 propagation/cascade + self-contained token limits + prior session lifecycle evidence. Promotion requires recurrence in Authorization/Security/Provider synthesis.
- **G2-CAPABILITY-CANDIDATE-AUTHENTICATION-ASSURANCE-EVIDENCE** — CROSS_CUTTING. Evidence: OIDC authentication context + provider MFA/session evidence. Promotion requires Authorization/Governance use beyond identity.
- **G2-CAPABILITY-CANDIDATE-WORKLOAD-IDENTITY-TRUST-BINDING** — CROSS_CUTTING. Evidence: SPIFFE trust domains/SVIDs + existing service-identity requirement. Promotion requires Security/Deployment/Secrets convergence.

Existing `G2-CAPABILITY-CANDIDATE-FEDERATION-TRUST-LIFECYCLE` gains stronger multi-representative evidence from RFC 8414 metadata and SPIFFE bundle rotation/federation, but remains a candidate pending synthesis.

## Value / risk / priority / next question
Value: critical. Risk: high if identity, credential, session, assurance and authorization are collapsed. Priority: critical. This revisit produced material architectural findings, so `consecutive_no_material_finding=0` and the capability remains NOT SATURATED. Next research question is deferred until its next rotation: can revocation/trust freshness and workload identity be expressed with shared evidence primitives without imposing online control-plane dependence?
