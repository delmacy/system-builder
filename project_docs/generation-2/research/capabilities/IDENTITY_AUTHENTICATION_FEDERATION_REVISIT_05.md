# Identity / Authentication / Federation — revisit 5 / cycle 6

## Research question
How should Generation 2 model identity continuity, authentication/session state, revocation propagation, delegation/impersonation provenance, federation trust and offline closure when each can advance on independent clocks, without turning transport/session success, propagated identity context or provider identifiers into canonical identity or authorization?

## Representatives and evidence/source ledger
1. **OpenID Shared Signals Framework / CAEP 1.0 Final (2025)** — standardized continuous security events including session revoked, token-claims change, credential change and assurance-level change. This is direct evidence that identity/security posture is not frozen at login and that event receipt, receiver processing and effective attenuation are distinct facts.
2. **OpenID Connect Back-Channel Logout 1.0** — logout tokens identify issuer+subject and/or issuer-scoped `sid`; the RP is responsible for locating and terminating applicable local sessions. Back-channel reachability and per-RP application therefore matter to effective revocation.
3. **NIST SP 800-63B-4 / SP 800-63C-4 (2025)** — sessions have overall/inactivity timeouts and explicit reauthentication; federation separates independently administered IdPs/CSPs and RPs. Authentication continuity and federation assertions are qualified evidence, not perpetual authority.
4. **OpenID Federation 1.0 Final (2026-02-17)** — multilateral trust is a resolved Trust Chain to a Trust Anchor with ordered metadata-policy application. Federation metadata/trust changes independently from subject/session state.
5. **SPIFFE Federation / Trust Domain and Bundle** — trust bundles are bound to trust domains, rotate over time and use monotonically increasing sequence numbers for update ordering/propagation. Foreign trust-domain acceptance depends on current bundle association, not merely a syntactically valid SVID.
6. **OAuth 2.0 Token Exchange RFC 8693** — delegation and impersonation are semantically distinct; composite tokens can preserve subject and actor (`act`) chains. Propagated actor/subject claims are provenance inputs and do not erase canonical actor/subject separation.
7. **Keycloak latest identity brokering/account linking** — external-provider identity linking is explicit and configurable; automatic linking without verification can be unsafe, while organization/provider context can influence the authentication flow without itself proving canonical identity.

Primary sources:
- https://openid.net/three-shared-signals-final-specifications-approved/
- https://openid.net/specs/openid-caep-1_0.html
- https://openid.net/specs/openid-connect-backchannel-1_0.html
- https://pages.nist.gov/800-63-4/sp800-63b/session/
- https://www.nist.gov/publications/nist-sp-800-63c-4digital-identity-guidelines-federation-and-assertions
- https://openid.net/specs/openid-federation-1_0.html
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/
- https://www.rfc-editor.org/rfc/rfc8693.html
- https://www.keycloak.org/docs/latest/server_admin/

## Primitives and source of truth
The canonical semantic source of truth remains typed identity owned by the relevant semantic owner: canonical subject/workload identity, verified external-subject mapping, actor/delegation relationship, authentication context, session, credential/assertion, federation trust and provider realization are separate identities. Provider `sub`, `sid`, credential IDs, SVIDs, tokens and directory records are scoped realization/evidence identities unless their own identity kind explicitly owns them.

A minimum effective identity/authentication revision vector is:
`<CanonicalSubjectRevision, ExternalMappingRevision, ActorDelegationRevision, AuthenticationContextRevision, SessionRevision, CredentialAssertionRevision, RevocationSignalPosition, FederationTrustRevision, ProviderRevision, StationPolicyRevision>`.
No scalar `identityVersion` or `loggedIn=true` can safely substitute for this vector.

## Lifecycle and versioning
Subject/mapping admission → authentication attempt → assertion/credential validation → session establishment → downstream session derivation → security-posture change → revocation/logout signal emission → delivery/receipt → local session/credential invalidation → postcondition verification → reauthentication/step-up/relink → provider/trust rotation or coexistence → retirement.

Independent lifecycle axes matter:
- login success can precede a later credential/session/assurance change;
- revocation can be emitted before all dependent sessions are effectively invalidated;
- trust-bundle/key generations can overlap during rotation;
- provider/account mappings can change while canonical subject remains stable;
- actor/delegation chain can differ per operation without rewriting the subject.

## Failure semantics
Distinguish: authentication rejected; assertion invalid; subject unmapped; mapping collision; actor/delegation chain invalid; session stale/expired; revocation event emitted but undelivered; event delivered but not applied; local session unknown; partial downstream logout; stale CAEP/RISC stream position; trust bundle stale/missing; federation chain/policy unresolved; provider coexistence mismatch; account link ambiguous; local/offline evidence beyond freshness horizon. Required uncertain evidence yields `PARTIAL`/`INCONCLUSIVE` or fail-closed behavior according to profile.

A remote logout/revocation acknowledgement is not proof that every derived RP session, offline credential or downstream federation session is no longer effective. Generation 2 needs explicit propagation/closure evidence.

## Extensibility and provider boundaries
OIDC, SAML, WebAuthn, LDAP/AD, SPIFFE/SPIRE, Shared Signals/CAEP/RISC, token exchange and commercial IdPs are provider/protocol realizations. Portable primitives are typed identity mapping, authentication context, session lineage, actor/delegation provenance, trust qualification, revocation propagation, evidence freshness, provider coexistence and qualified local closure.

Providers may authenticate, issue assertions, host sessions, emit revocation/security events or resolve federation metadata. They do not own canonical SB subject identity, organization/Station authority or semantic operation authorization.

## Governance
- Authentication never implies authorization.
- External account linking/relinking is a governed semantic mutation with verification, provenance and collision handling.
- Delegation and impersonation must remain distinguishable in lineage; acting-on-behalf-of must not erase the actor.
- Revocation/security signals can only attenuate or invalidate already-eligible identity/authentication state; they do not grant new capability authority.
- `Enterprise → Station → Role → Person` may narrow acceptable identity/trust/assurance profiles but lower layers cannot weaken superior identity/trust requirements.
- AGWS/AI may request step-up, surface reauthentication needs or propose mapping changes, but cannot self-grant IdP administration, canonical identity mutation or authorization.

## Observability
Record: canonical subject ref/revision; external mapping revision; actor/delegation chain; issuer/trust domain; authentication context and assurance; `auth_time`; session revision and issuer-scoped `sid` where applicable; credential/assertion class; federation trust/bundle sequence; provider revision; revocation/security-event stream ID/position; event occurrence, receipt and application timestamps; affected-session scope; postcondition evidence; downstream propagation gaps; `PARTIAL/INCONCLUSIVE` reason; local-closure profile and evidence horizon.

## Portability and lock-in
Portability must preserve canonical identity/mapping/delegation semantics while provider-specific identifiers and event/session mechanisms remain replaceable. Provider replacement requires mapping continuity, trust compatibility, revocation/session semantics and residual-session disposition. A provider supporting OIDC but not equivalent revocation/assurance/federation semantics is not automatically substitutable.

Offline/local operation requires a declared closure over subject mappings, validators/authenticators, trust anchors/bundles, revocation/security-event position, session/reauthentication policy and recovery material. Reconnection requires requalification against newer trust, revocation and policy epochs.

## Product-specific mechanisms vs universal primitives
Product/standard mechanisms: CAEP event types; OIDC logout tokens and `sid`; SPIFFE bundle endpoint/sequence; OpenID Federation Entity Statements/Trust Chains; RFC 8693 `act`; Keycloak First Broker Login flows. Universal primitives: typed subject/actor/mapping/session/credential/trust identities; security-state propagation lineage; operation-qualified authentication evidence; verified delegation provenance; trust-generation compatibility; provider coexistence; qualified local identity closure.

## Convergent patterns
- Identity/security posture changes after login and must be continuously re-evaluable.
- Session identifiers and external subjects are issuer/provider scoped.
- Revocation is a distributed transition with propagation lag and potentially partial closure.
- Subject and actor are distinct under delegation.
- Trust material rotates independently from subject/session identity.
- Account linking is a security-sensitive mapping mutation, not a string-equality convenience.

## Divergent patterns
- CAEP/RISC security-event propagation and OIDC logout have different event taxonomies and delivery/closure models.
- Human sessions, refresh/offline credentials and workload identities differ in revocation and continuity semantics.
- Token exchange expresses delegation/impersonation at token issuance, while canonical SB authority remains policy-owned elsewhere.
- SPIFFE trust-domain federation is workload-oriented and bundle-based; OpenID Federation is metadata-policy/trust-chain based.

## Subcapabilities
Canonical subject/workload mapping; actor/delegation provenance; authentication/assurance; session lineage; continuous security-state evaluation; revocation/logout propagation and closure; federation trust/key/bundle rotation; provider coexistence/migration; account linking/relinking; qualified local identity closure; recovery/break-glass authentication; AGWS identity-context revalidation.

## Reconciliation hypotheses
- **KEEP** canonical identity separate from provider/session/token identities and authorization.
- **HARDEN** session/revocation handling with emitted→delivered→applied→effective lineage and postcondition evidence.
- **GENERALIZE** security-state propagation as revision/freshness-qualified identity evidence while preserving Identity ownership of its semantics.
- **PROVIDERIZE** OIDC logout, CAEP/RISC transports, IdPs, federation mechanisms and credential/session realizations.
- **INTEGRATE** actor/delegation provenance with authorization/audit without importing token claims as authority.
- **REPLACE** booleans such as `revoked`, `loggedIn` or `trusted` where they hide propagation, freshness or scope.
- **DEFER** provider-specific admin UX and session dashboards until portable contracts are reconciled.
- **DO_NOT_BUILD** proprietary federation/logout/security-event protocols where standards satisfy provider realization needs.

## Stable findings
### G2-FINDING-IAF-37 — Identity security state is continuously revisioned after login
CAEP standardizes session-revoked, token-claims-change, credential-change and assurance-level-change events. Generation 2 must treat authentication/security posture as a revisioned evidence stream rather than a login-time immutable fact.

### G2-FINDING-IAF-38 — Revocation is a distributed propagation lineage, not a boolean
OIDC Back-Channel Logout requires the OP to signal RPs and each RP to terminate its own applicable sessions. Model `RevocationIntent/Event → Delivered → Accepted → Applied → Effective/Postcondition`, retaining partial propagation and downstream gaps instead of setting one global `revoked=true`.

### G2-FINDING-IAF-39 — Security-event position and freshness are identity evidence dependencies
A receiver can be healthy while behind the current CAEP/RISC event stream or missing a relevant event. Event-stream position, occurrence time, receipt/application time and required freshness horizon must qualify sensitive authentication/session decisions; unknown lag yields bounded degradation or `INCONCLUSIVE`.

### G2-FINDING-IAF-40 — Subject and actor identity must remain distinct under delegation and impersonation
RFC 8693 distinguishes delegation from impersonation and supports explicit actor chains. Generation 2 must preserve canonical subject, current actor, delegation provenance, scope/time constraints and issuing provider separately; propagated `act`/subject claims are evidence, not self-authorizing authority.

### G2-FINDING-IAF-41 — Session identity is issuer-scoped and cannot define canonical subject continuity
OIDC `sid` is opaque and unique only in an issuer context; logout may address `iss+sub`, `sid`, or both. Session identity belongs to session/provider lineage and must not become canonical person/workload identity or cross-provider continuity key.

### G2-FINDING-IAF-42 — Revocation closure must distinguish interactive sessions from offline/long-lived credentials
OIDC Back-Channel Logout treats ordinary session-linked refresh tokens differently from `offline_access` refresh tokens. A successful interactive logout therefore cannot prove all credential classes are unusable; closure must state which sessions/credential classes were invalidated and which remain separately governed.

### G2-FINDING-IAF-43 — Trust-domain key rotation has ordered propagation semantics
SPIFFE bundles change over time, bind cryptographic material to an explicit trust domain and may carry monotonically increasing sequence numbers; federation guidance requires publishing new material early enough for foreign domains to retrieve it. Trust qualification must therefore include trust-domain binding, generation/sequence and propagation freshness, not merely key validity.

### G2-FINDING-IAF-44 — Identity composite proof requires compatible joins across mapping, trust, credential, session and revocation evidence
A sensitive operation is conclusive only when required subject mapping, issuer/trust generation, credential/assertion validation, authentication freshness, session realization and revocation-stream evidence refer to mutually compatible scope/revisions. Any required stale/incompatible component propagates `PARTIAL/INCONCLUSIVE`; a valid token alone is insufficient.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-IAF-CONTINUOUS-IDENTITY-SECURITY-STATE-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile CAEP/RISC-style posture changes with UCA evidence qualification; Identity retains event semantics and affected-subject/session ownership.
- `G2-CAPABILITY-CANDIDATE-IAF-REVOCATION-PROPAGATION-CLOSURE-LINEAGE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with shared governed transition/effective-postcondition lineage while keeping identity/session revocation semantics local to Identity.
- `G2-CAPABILITY-CANDIDATE-IAF-SUBJECT-ACTOR-DELEGATION-PROVENANCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Authorization/Audit actor attribution; token-exchange claims never become semantic authority by themselves.
- `G2-CAPABILITY-CANDIDATE-IAF-REVOCATION-STREAM-FRESHNESS-POSITION-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Integration checkpoint/freshness evidence while preserving Identity ownership of security-event applicability and closure.

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains promoted and distinct.

## Repo-validation questions
1. Does fresh main distinguish canonical subject, current actor/delegation, provider subject and issuer-scoped session identity?
2. Is revocation represented as emitted/delivered/applied/effective evidence or collapsed into a single boolean/timestamp?
3. Can stale/missing continuous-security-event position invalidate or make a sensitive session decision `INCONCLUSIVE`?
4. Are offline/long-lived credentials separately dispositioned from interactive session logout?
5. Can provider coexistence preserve canonical identity while session/revocation semantics differ and require explicit cutover proof?
6. Are trust-domain/bundle generations and their propagation freshness visible independently from credential validity?
7. Does AGWS request step-up/revalidation without gaining IdP administration or semantic authorization?
8. Can local identity closure state exactly which revocation/trust/freshness dependencies are retained and requalify after reconnection?

## Architecture proof-backfill obligations
1. **Continuous-posture proof:** authenticate successfully, then emit an assurance/credential/session change; a sensitive operation must re-evaluate against the newer security-state revision rather than reuse login-time evidence.
2. **Partial-revocation proof:** deliver logout to only a subset of dependent RPs; evidence must show partial propagation and must not claim global revocation closure.
3. **Revocation-lag adversarial proof:** keep the receiver healthy but behind the required security-event position; privileged continuation becomes degraded/`INCONCLUSIVE` according to profile.
4. **Subject/actor proof:** execute delegated work with canonical subject B and actor A; audit/provenance preserve both while authorization is evaluated independently from token claims.
5. **Issuer-scoped-session proof:** create equal-looking `sid` values under two issuers; session resolution must remain issuer-qualified and cannot cross-link canonical subjects.
6. **Offline-credential proof:** log out interactive sessions while an explicitly governed offline credential remains; closure must report the distinction and not claim total credential revocation.
7. **Trust-bundle propagation proof:** rotate a SPIFFE-style bundle, keep one foreign domain on the old sequence and require trust freshness/transition evidence before new-generation assumptions are accepted.
8. **Composite-proof negative proof:** combine a valid credential with stale revocation-stream or trust-generation evidence; overall sensitive-operation identity proof becomes `INCONCLUSIVE`/denied, not valid.
9. **Provider-substitution proof:** run old/new IdPs concurrently and prove canonical subject continuity while separate mapping, session, revocation and trust evidence qualify cutover.
10. **Qualified-local/reconnection proof:** authenticate from declared local closure, advance remote trust/revocation state while disconnected, then require reconnection requalification before privileged continuation.
11. **AGWS/AI non-amplification proof:** request account linking, IdP mutation or stronger authentication through AGWS/AI; AI may propose/escalate, but no provider-admin, canonical mapping or authorization mutation occurs without independent authority.

## Symbiotic Proof
A person has one canonical SB subject and a verified external mapping to IdP P1. They authenticate and receive an RP session. A background CAEP-compatible stream later signals an assurance change; the receiver records event position and invalidates only decisions whose required evidence is now stale. An administrator delegates one bounded action to an automation actor; subject and actor remain separately visible and authorization is resolved outside the token. A back-channel logout is then emitted: two RPs apply it, a third is unreachable, and an offline credential is explicitly outside interactive-session closure. System state is `PARTIAL`, not falsely `REVOKED`. During provider migration P1/P2 coexist with independent session/revocation/trust evidence while canonical subject remains stable. In an offline Station, only actions covered by retained trust/revocation/freshness closure continue; reconnection requalifies against newer epochs. AGWS can surface step-up or identity-linking workflows but cannot amplify identity-provider or semantic authority.

## Saturation assessment
Representative coverage is deep and broader than revisit 4, but eight material architectural findings were produced. `consecutive_no_material_finding` resets/remains `0`; **NOT SATURATED**.
