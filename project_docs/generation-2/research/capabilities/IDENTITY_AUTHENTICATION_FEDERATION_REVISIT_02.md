# Identity / Authentication / Federation — revisit 2 / cycle 3

## Research question
How should Generation 2 represent human, delegated, connector and workload identity so authentication/federation evidence can establish *who/what presented which credential under which issuer/session/trust context* without silently becoming authorization, Station capability exposure, or semantic-operation authority?

## Representatives and evidence/source ledger
1. **OpenID Connect / OAuth family** — identity claims (`iss`,`sub`,`aud`), audience-bound validation and separation of authentication evidence from application authorization. Current OpenID Foundation security guidance also reinforces strict audience/issuer binding for client assertions.
2. **RFC 8693 OAuth 2.0 Token Exchange** — explicitly distinguishes subject token from actor token and supports delegation/impersonation semantics without collapsing subject and acting principal.
3. **Microsoft identity platform / MSAL On-Behalf-Of** — propagates delegated user identity/permissions across an API chain by acquiring a downstream token on behalf of the user; useful evidence for delegated chains but not a reason to widen the upstream semantic grant.
4. **SPIFFE/SPIRE** — workload identity is a URI scoped to a trust domain; SVIDs are verifiable identity documents; federation exchanges trust bundles between independently rooted trust domains; JWT-SVID validation is audience-aware.
5. **Keycloak** — user/client sessions, token/session timeout and revocation are distinct operational facts; sign-out/session invalidation and outstanding access-token invalidation are not universally simultaneous.

Primary-source ledger used this pass: RFC 8693; OpenID Foundation security guidance; Microsoft identity platform/MSAL documentation; SPIFFE/SPIRE specifications/documentation; Keycloak Server Administration Guide.

## Source of truth
Authentication source of truth is not a Person/Role/Station record. It is a revisioned trust relationship plus credential/session evidence issued or validated by an identity authority. Canonical organizational identity and authorization remain separate semantic owners. Federation adds trusted foreign issuer/trust-domain evidence; it does not merge identity namespaces or authorities.

## Identity
Required distinct identities:
- `CanonicalSubject` — stable semantic subject known to SB.
- `AuthenticatedPrincipal` — principal asserted by a credential/issuer at a point in time.
- `ActingPrincipal` — actor actually wielding/delegating a token when distinct from subject.
- `WorkloadPrincipal` — service/workload identity, distinct from human subject.
- `Issuer / TrustDomain` — authority namespace/root for credential validation.
- `Session` — continuity container with its own lifecycle.
- `CredentialEvidence` — token/SVID/assertion evidence with audience, expiry, issuer and validation context.
- `FederationTrustRelationship` — explicit relationship between trust domains/issuers.

## Lifecycle
Enrollment/linking -> issuance/authentication -> session establishment -> delegated/token-exchange derivation where allowed -> refresh/revalidation -> revocation/expiry -> unlink/decommission. Long-running execution must not treat an old authentication snapshot as eternally fresh.

## Versioning and freshness
Issuer metadata, signing keys/trust bundles, federation relationships, client registration, assurance policy and session/token state all evolve independently. Evidence must identify the revision/freshness window actually used. Key rotation or federation-bundle change can invalidate future validation without rewriting historical evidence.

## Failure semantics
Distinguish: unknown issuer; invalid signature; audience mismatch; expired credential; revoked/expired session; missing foreign trust bundle; token exchange denied; downstream consent/conditional-access challenge; subject mapping ambiguity; stale identity evidence; workload attestation failure. Authentication failure must fail closed for privileged effects, while historical audit remains attributable to the evidence valid at execution time.

## Extensibility
Identity providers, federation protocols and workload attestors are provider-specific realizations behind provider-neutral semantic identity requirements. Extension must not allow a provider plugin to mint SB authorization merely because it authenticated a principal.

## Provider boundaries
Provider returns authentication/federation evidence and claims. SB maps that evidence to canonical subject/workload identity under explicit mapping policy. Authorization, capability exposure, workflow authority and connector action policy remain downstream intersections. Provider/issuer replacement requires revalidation of subject mapping, assurance and trust semantics.

## Governance
Impersonation, delegation and OBO/token exchange require explicit policy and provenance. `subject != actor` must be preserved where the protocol exposes it. Administrative impersonation must never erase the administrator/actor lineage. Federation is an explicit trust decision, not automatic acceptance of foreign namespaces.

## Observability
Record issuer/trust domain, subject, actor when present, client/workload principal, audience, authentication method/assurance where available, session/evidence identifier, validation time, freshness/revision references and revocation/revalidation outcomes. Avoid logging bearer secrets.

## Portability and lock-in
Portable semantics are subject/actor/workload/issuer/session/evidence/federation relationships and assurance requirements. OIDC/OAuth, SPIFFE, SAML and vendor session models are realizations. Do not encode Microsoft tenant IDs, Keycloak realm structures or SPIFFE paths as universal SB organizational hierarchy.

## Product-specific mechanism vs universal primitive
Product mechanisms: MSAL OBO APIs, Keycloak realm/session controls, SPIRE registration entries/SVID delivery, vendor token caches. Universal primitives: canonical subject mapping; actor-versus-subject lineage; audience-bound credential evidence; workload principal; federation trust relationship; assurance/freshness; revocation/revalidation result.

## Convergent patterns
- Identity evidence is scoped to an issuer/trust root and audience/context.
- Human subject and acting/delegated principal can differ.
- Workload identity is first-class and should not masquerade as a user.
- Sessions/credentials expire or revoke independently from canonical subject identity.
- Federation exchanges/establishes trust; it does not imply application authorization.

## Divergent patterns
- Human federation commonly uses OIDC/OAuth/SAML and session semantics; workload federation uses attestation/trust-domain semantics.
- Revocation propagation differs substantially by token/session/provider.
- Delegation may be explicit token exchange/OBO, impersonation, or service credentials; these are not semantically equivalent.

## Subcapabilities
Subject mapping; issuer/trust-domain registry; session/assurance evidence; token/credential validation; delegated/OBO identity; impersonation lineage; workload identity; federation trust; key/bundle rotation; revocation/revalidation; provider replacement conformance.

## Comparison with SB
No repository-wide implementation claim is made in this research pass. Fresh `main` should later be inspected during the mandated repository-reconciliation phase for identity/session/provider contracts and tests. Research-branch artifacts are not product truth.

## Reconciliation hypotheses
- **KEEP** authentication separate from authorization wherever current SB already does so.
- **HARDEN** actor/subject/workload/session evidence and freshness if current contracts collapse them.
- **GENERALIZE** issuer/trust/federation semantics without embedding one IdP hierarchy.
- **PROVIDERIZE** OIDC/SAML/SPIFFE/vendor-specific validation and exchange mechanisms.
- **INTEGRATE** authentication evidence with authorization only through explicit mapping/intersection contracts.
- **REPLACE** any design where possession of a connector/workload credential directly grants semantic operation authority.
- **DEFER** product-specific advanced federation UX until core trust/evidence semantics are reconciled.
- **DO_NOT_BUILD** a bespoke universal identity protocol when standards/providers can realize the semantic contract.

## Stable findings
### G2-FINDING-IAF-17 — Canonical Subject, Authenticated Principal, Acting Principal and Workload Principal Require Distinct Identities
Authentication chains can represent a user, an acting/delegated principal and a service workload simultaneously. Collapsing these loses provenance and enables confused-deputy authority errors.

### G2-FINDING-IAF-18 — Authentication Evidence Is Audience-, Issuer-, Time- and Trust-Context Bound
A valid credential is not globally valid evidence. Audience, issuer/trust domain, expiry and validation/trust revision are part of its meaning.

### G2-FINDING-IAF-19 — Delegation and On-Behalf-Of Must Preserve Subject/Actor Lineage and Cannot Widen Semantic Authority
RFC 8693 explicitly distinguishes subject and actor; OBO propagates delegated identity. Generation 2 must intersect downstream credentials with the originating semantic authority rather than treating a newly issued token as a wider grant.

### G2-FINDING-IAF-20 — Session and Credential Revocation/Freshness Are Distinct From Canonical Identity Lifecycle
Keycloak demonstrates that session invalidation and outstanding token validity can differ. Long-lived SB executions therefore need explicit authentication-evidence freshness/revalidation policy rather than assuming subject existence implies current authentication.

### G2-FINDING-IAF-21 — Federation Establishes Cross-Domain Authentication Trust, Not Organization, Station or Capability Authority
SPIFFE federation shares foreign trust bundles so identities can be validated across trust domains. This establishes authentication trust only; organizational membership, Station exposure and action authority require separate policy.

### G2-FINDING-IAF-22 — Identity-Provider Replacement Requires Subject-Mapping and Assurance Conformance, Not Merely Protocol Compatibility
Two OIDC/SAML/workload identity providers may speak compatible protocols yet differ in subject identifiers, assurance, revocation, session and delegation semantics. Replacement requires explicit conformance evidence before preserving bindings/authority decisions.

## Repo-validation questions
1. Does fresh main distinguish canonical subject, authenticated principal, actor/delegator and workload/service identity?
2. Are issuer, audience, expiry, session and assurance represented as evidence rather than authorization?
3. Can provider/connector credentials be broader than semantic operation authority without widening it?
4. How are revocation and long-running workflow continuation reconciled?
5. Is identity-provider replacement tested for subject mapping and assurance equivalence?
6. Are tenant/org/Station identifiers embedded in authentication contracts or mapped separately?

## Symbiotic Proof
A human in Station A authenticates through external IdP P1; a supervised surface action invokes workflow W, which calls connector C using workload credential S. Evidence must retain human subject, acting principal, Station/Role authority snapshot, workload principal and provider credential separately. Replacing P1 with P2 must preserve canonical subject only after mapping/assurance conformance. Replacing C must not change semantic authority. If the human session/assurance becomes stale before a later privileged workflow step, the run pauses/revalidates/escalates according to policy. No authentication or federation event can enlarge Station/Role capability exposure.

## Adaptive Governed Work Surfaces composition
`Enterprise → Station → Role → Person` is authorization/exposure context, not an authentication hierarchy. A surface can consume authenticated subject/actor/session evidence, but effective action authority remains an explicit intersection. AI materialization cannot infer canonical domain authority from login strength, tenant membership or connector credential. Personal/supervised automation must preserve subject/actor/workload lineage across every hop.

## Value / risk / priority / next question
Value: very high; prevents confused-deputy and federation/connector privilege amplification across generated runtimes. Risk if omitted: critical. Priority: foundational cross-cutting research. Next question: Authorization / Policy / Organization / Multitenancy must test these principal/evidence distinctions against effective authority, hierarchy, delegation and Station exposure.
