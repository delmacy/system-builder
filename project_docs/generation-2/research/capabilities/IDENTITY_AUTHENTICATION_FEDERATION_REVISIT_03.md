# Identity / Authentication / Federation — revisit 3 / cycle 4

## Research question
How should Generation 2 represent identity and authentication so canonical subject identity, authentication-context revision, session/credential realization, federation trust and provider realization can evolve independently without authentication becoming authorization, Station capability exposure or semantic-operation authority?

## Representatives and evidence/source ledger
1. **OpenID Connect** — `sub`/`iss`, `sid`, `auth_time`, requested/default authentication context (`acr`) and back-channel logout show that subject identity, authentication context and session identity are distinct protocol facts.
2. **Microsoft Entra ID Conditional Access authentication strengths** — authentication strength is resource/scenario-specific, can require different method combinations and can force reauthentication or step-up based on risk/context; external-user trust further demonstrates foreign authentication evidence must satisfy resource-tenant policy.
3. **Keycloak** — user/client/offline/transient sessions, token lifetimes and revocation policies differ; signing out active sessions does not universally revoke outstanding access tokens; offline sessions have separate lifecycles.
4. **Auth0** — refresh-token revocation can revoke a token family/grant or only a token depending on tenant semantics; session termination and refresh-token validity can be distinct; rotating tokens create lineage and stale-token detection.
5. **SPIFFE Federation** — workload identity is scoped to a trust domain and federation relies on explicit bundle exchange/rotation, reinforcing that identity, trust-root revision and credential realization evolve independently.

Primary evidence used in this pass: OpenID Connect Back-Channel Logout and Dynamic Client Registration specifications; Microsoft Entra authentication-strength and risk-policy documentation; Keycloak latest Server Administration Guide; Auth0 refresh-token/session documentation; SPIFFE Federation specification.

## Source of truth
Canonical subject/workload identity is a semantic mapping owned by SB, not an IdP session or token. Authentication evidence is a revision-qualified assertion produced or validated by an identity provider/trust domain. Authorization, organizational hierarchy and Station exposure consume that evidence under separate policy.

## Identity
Required distinct identities/revisions:
- `CanonicalSubjectRevision` — semantic subject identity known to SB.
- `AuthenticatedPrincipal` — principal asserted for one authentication event/context.
- `AuthenticationContextRevision` — assurance/method/risk/context facts applicable to a resource/action.
- `SessionRevision` — provider/session continuity state.
- `CredentialRevision` — access/refresh/offline/SVID/assertion realization with expiry and revocation semantics.
- `IssuerTrustRevision` — issuer metadata, signing keys, trust bundle and federation relationship revision.
- `IdentityProviderRealizationRevision` — provider/configuration realization used to authenticate or federate.

These identities can coexist and change independently.

## Lifecycle
Subject enrollment/linking -> provider/federation registration -> authentication attempt -> context/assurance evaluation -> session establishment or transient authentication -> credential issuance/rotation -> step-up/revalidation -> revocation/expiry -> provider/federation migration -> post-migration subject/trust validation -> unlink/decommission.

## Versioning and freshness
`CanonicalSubjectRevision`, `AuthenticationContextRevision`, `SessionRevision`, `CredentialRevision`, `IssuerTrustRevision` and provider realization revision must not collapse into one version pointer. A session can remain open while a stronger resource requires step-up. A subject can remain stable while refresh tokens rotate. Trust bundles/keys can rotate without rewriting historical authentication evidence.

## Failure semantics
Distinguish at least: unknown/mismatched subject mapping; issuer or audience mismatch; insufficient authentication strength; stale `auth_time`; step-up required; expired/revoked session; expired/revoked/rotated credential; logout propagation pending/unsupported; refresh-token family invalidated; missing/offline trust material; foreign-MFA evidence not trusted; federation bundle stale; provider migration mapping mismatch; provider unavailable; recovery/break-glass path outside accepted profile. Privileged operations fail closed when current evidence is insufficient, while historical attribution remains tied to evidence valid at execution time.

## Extensibility
OIDC, SAML, passkeys/FIDO2, passwordless mechanisms, MFA providers, SPIFFE/SPIRE and vendor-specific session/token models are provider realizations. The portable semantic contract is subject mapping + assurance requirement + authentication evidence + session/credential/trust lineage + validation/revocation result.

## Provider boundaries
Providers authenticate and issue/validate evidence; they do not own canonical authorization. Provider replacement requires mapping and assurance conformance, not protocol compatibility alone. A new provider may preserve canonical subject only after explicit validation of subject mapping, assurance capabilities, revocation/session behavior, federation trust and recovery semantics.

## Governance
Authentication policies can require resource-specific assurance and step-up, but stronger authentication never widens semantic authority. Administrative impersonation/delegation must preserve actor lineage. Break-glass/recovery credentials require explicit policy, qualification and evidence. Migration of an IdP/trust domain must be governed rather than treated as endpoint substitution.

## Observability
Record subject/actor/workload, issuer/trust domain, provider realization revision, authentication context/strength, methods where safe, `auth_time`, session ID/revision, credential class/revision (never bearer secret), audience, validation time, trust revision, revocation/step-up outcome, migration attempt/postcondition and any inconclusive validation state.

## Portability and lock-in
Portable semantics are independent of Microsoft tenant IDs, Keycloak realms, Auth0 grants or SPIFFE path conventions. Local/self-hosted/air-gapped operation requires a qualified closure containing issuer metadata/trust roots, subject mappings, authenticators/validators, policy/assurance profiles, revocation/freshness rules and recovery material required for the declared profile.

## Product-specific mechanism vs universal primitive
Product mechanisms: Entra authentication-strength objects and Conditional Access evaluation; Keycloak realm/session/offline-token controls; Auth0 refresh-token family/grant handling; OIDC `sid`/logout token fields; SPIFFE bundle endpoints. Universal primitives: revisioned authentication context; session/credential lineage; assurance requirement/evidence; issuer/trust revision; governed provider migration; qualified local identity closure.

## Convergent patterns
- Subject identity, authentication event/context and active session are distinct facts.
- Assurance is contextual and may require step-up for a sensitive resource/action.
- Session logout, access-token validity, refresh-token validity and offline credentials can have different revocation/freshness semantics.
- Trust roots/metadata rotate independently from canonical identities.
- Provider/federation replacement requires semantic mapping and assurance validation.

## Divergent patterns
- Providers differ in token-family/grant revocation, session propagation and eventual consistency.
- Authentication-strength vocabularies and method combinations are provider-specific.
- Browser sessions, offline refresh credentials and workload SVIDs have materially different continuation/revocation models.
- Air-gapped/local closure differs for human interactive identity versus workload identity.

## Subcapabilities
Authentication-context/assurance profiles; step-up/re-authentication; session/credential lineage; token-family rotation/revocation; issuer/trust rotation; foreign-authentication trust; subject mapping; provider migration; local/offline identity closure; recovery/break-glass qualification; AGWS identity-context revalidation.

## Comparison with SB
No repository implementation claim is made in this research pass. Fresh `main` must be inspected later during PLANNING_B for identity/session contracts, provider bindings, runtime autonomy and tests. Research artifacts are not product truth.

## Reconciliation hypotheses
- **KEEP** authentication separate from authorization and Station exposure.
- **HARDEN** identity/session contracts with explicit authentication-context, session, credential and trust revisions if collapsed today.
- **GENERALIZE** assurance requirement/evidence and subject mapping across providers.
- **PROVIDERIZE** authenticators, federation protocols, MFA/passwordless mechanisms and session/token realization.
- **INTEGRATE** step-up/revalidation with privileged workflow/AGWS actions through explicit authority-preserving gates.
- **REPLACE** any design where login strength, tenant membership or active session directly implies wider semantic authority.
- **DEFER** provider-specific UX until portable identity/assurance semantics are reconciled.
- **DO_NOT_BUILD** a proprietary authentication protocol when standards/providers satisfy realization needs.

## Stable findings
### G2-FINDING-IAF-23 — Canonical Subject, Authentication-context, Session, Credential and Provider-realization Revisions Must Coexist Without Identity Collapse
A stable subject can continue across provider, session, credential and assurance changes. Treating them as one revision makes migration, audit, step-up and revocation ambiguous.

### G2-FINDING-IAF-24 — Authentication Assurance Is Resource/Operation/Context-qualified Evidence, Not a Scalar Property of a User
Entra authentication strengths and OIDC authentication-context semantics show that evidence sufficient for one resource/action may be insufficient for another. Generation 2 must evaluate assurance at the operation boundary and support explicit step-up/re-authentication without changing canonical subject identity.

### G2-FINDING-IAF-25 — Session Logout, Credential Revocation and Authentication Freshness Are Distinct Evidence States With Explicit Stale Windows
Keycloak and Auth0 demonstrate that terminating a session does not universally and synchronously invalidate every outstanding credential. Generation 2 must model revocation scope, propagation/freshness and current access-token windows rather than using a single boolean `loggedOut` fact.

### G2-FINDING-IAF-26 — Identity-provider / Federation Migration Is a Governed Plan/Validation/Approval/Attempt/Postcondition Transition
Protocol compatibility cannot prove subject mapping, assurance, session/revocation or trust equivalence. Provider migration must preserve old/new realization lineage, validate mappings and trust, require approval where authority changes, record the attempt and emit postcondition evidence before bindings are considered migrated.

### G2-FINDING-IAF-27 — Qualified Local Identity Closure Is Profile-scoped and Includes Trust, Mapping, Validation, Freshness and Recovery Dependencies
Self-hosted/air-gapped identity is not proved merely by hosting an IdP locally. The declared profile must have local closure over required issuer/trust material, subject mappings, authenticators/validators, assurance policy, revocation/freshness semantics and recovery/break-glass dependencies. Workload and human profiles may require different closure sets.

### G2-FINDING-IAF-28 — Enterprise → Station → Role → Person Identity Projection and AGWS Revalidation Consume Authentication Evidence but Cannot Amplify Authority
Identity evidence can change while a work surface remains open. AGWS and privileged actions must revalidate when session/authentication context/trust revisions become stale or insufficient. Station/Role/Person projection is an authorization/exposure context; authentication proves principal/assurance only and cannot add capabilities.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-AUTHENTICATION-CONTEXT-REVISION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE**. Likely specialization of the unified evidence qualification/realization lineage; test against Authorization, Governance and AI approvals before synthesis.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-IDENTITY-PROVIDER-MIGRATION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**. Strongly aligns with shared governed migration transition; confirm through Data/Lifecycle/Deployment.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-IDENTITY-CLOSURE` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**. Identity specialization of qualified local closure; confirm in Secrets/Configuration and Deployment.

No candidate is promoted in this pass.

## Repo-validation questions
1. Does fresh main separate canonical subject from authentication-context/session/credential/provider realization revisions?
2. Can privileged actions require assurance/step-up without mutating roles or canonical authority?
3. How are session revocation, token expiration and long-running execution freshness represented?
4. Can IdP replacement preserve subject identity only after explicit mapping/assurance/trust conformance evidence?
5. Is local runtime identity closure explicit enough for offline/self-hosted profiles?
6. Do AGWS/workflow actions revalidate authentication context on sensitive continuation?
7. Are break-glass/recovery credentials distinguished from ordinary authority and audited as qualified exceptions?

## Symbiotic Proof
A Person in Station A authenticates through IdP P1 using an assurance profile sufficient for routine work. A later privileged AGWS action requires stronger phishing-resistant assurance and triggers step-up while preserving the same canonical subject. During a long-running workflow the original browser session is revoked; the access token may remain technically usable until its own expiry, but the privileged continuation rejects stale authentication evidence according to policy. P1 is later replaced by P2 through a migration plan that validates canonical subject mapping, assurance, trust and revocation semantics before promotion. In an air-gapped profile, the generated runtime can authenticate/validate using declared local trust/mapping/freshness/recovery closure without Builder availability. At no point does stronger authentication, IdP membership or a valid connector/workload credential widen Station/Role semantic authority.

## Adaptive Governed Work Surfaces composition
Every effective surface/action should bind to the canonical subject plus a revision-qualified authentication context, not merely a user ID and boolean session. Changing Station/Role, identity provider, assurance policy, session state or trust revision can require surface/action revalidation. AI can request/coordinate step-up but cannot convert authentication evidence into canonical domain authority.

## Operational-complexity metering note
Identity may expose measurable operational factors for later cross-cutting relative-complexity analysis — number/types of IdPs, federation relationships, assurance profiles, authentication methods, migration/revocation complexity and offline-closure profile. Identity does not own rating, pricing, entitlements, billing or payment.

## Value / risk / priority / next question
Value: very high. Risk if omitted: critical, especially for stale-session privilege, provider migration and offline autonomy. Priority: foundational cross-cutting. Next capability per cycle ordering: Authorization / Policy / Organization / Multitenancy should consume these findings and stress-test effective authority, delegation, hierarchy and Station exposure without conflating authentication with authorization.
