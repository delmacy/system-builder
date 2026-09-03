# Identity / Authentication / Federation — revisit 6 / cycle 7

## Research question
How should Generation 2 qualify identity, authentication, sessions and federation when subject identity, authenticator state, session state, assurance, trust material, provider realization and revocation evidence evolve independently, while preserving the constitutional boundary that authentication is evidence about identity and never authorization?

## Representatives and evidence/source ledger
1. **NIST SP 800-63B-4** — session binding, AAL-qualified reauthentication, overall/inactivity timeouts, and independent IdP/RP session lifecycles in federation.
2. **SPIFFE Trust Domain / Bundle + Federation** — trust-domain-qualified workload identity, rotating trust bundles, federation endpoints and periodic foreign-bundle refresh.
3. **SPIFFE Workload API** — bundle removal/update semantics and trust-domain-qualified validation.
4. **WebAuthn / NIST syncable-authenticator guidance** — authenticator backup eligibility/state is distinct from credential identity and can affect verifier policy.
5. **Keycloak offline-session/offline-token semantics** — offline continuity has separate lifetime/revocation behavior and cannot be collapsed into an interactive session.
6. **Prior Generation-2 Identity research** — CAEP, OIDC logout/federation, token exchange and provider-substitution findings remain authoritative.

Primary evidence: NIST SP 800-63B-4 session and AAL guidance; SPIFFE trust-domain/bundle, federation and Workload API specifications; NIST syncable-authenticator guidance; Keycloak server administration documentation.

## Source of truth, identity and primitives
Portable semantic identities are distinct: `CanonicalSubject`, `Actor`, `Authenticator/Credential`, `AuthenticationEvent`, `Assertion`, `Session`, `FederationRelationship`, `TrustDomain`, `TrustBundleGeneration`, `ProviderRealization`, and `Revocation/SecurityStatePosition`. Provider identifiers are scoped realization/evidence identities unless explicitly promoted through governed canonical mapping.

Every high-assurance identity claim needs explicit applicability, minimally `<subject-kind, relying-party/Station, authentication-purpose, assurance-profile, authenticator-class, session-class, federation/trust-domain, provider, policy revision, evidence horizon>`.

## Lifecycle and versioning
Enrollment/linking → authenticator admission → authentication attempt → authentication event → assertion validation → local session establishment → reauthentication/step-up → authenticator/security-state change → revocation/logout propagation → effective local attenuation → provider/trust rotation → residual-session/credential drainage → retirement.

Federated sessions are not one distributed session: NIST explicitly separates IdP and RP session management. SPIFFE likewise separates stable trust-domain identity from rotating bundle material. Authenticator properties such as sync/backup state may change independently from credential identity.

## Failure semantics
Distinguish invalid credential, unmapped subject, stale authentication event, expired local session, stale assurance, unavailable revocation/security-state evidence, stale trust bundle, federation refresh failure, provider mismatch, offline-token residual use, ambiguous account relink, and local authentication whose remote trust/currentness cannot yet be requalified. Required unavailable evidence yields bounded degradation, `PARTIAL/INCONCLUSIVE`, or fail-closed behavior according to profile.

## Extensibility and provider boundaries
OIDC/SAML/WebAuthn/LDAP/AD/SPIFFE, commercial IdPs and local authenticators are provider/protocol realizations. Provider support must be expressed as a vector: identity mapping, authenticator classes, assurance semantics, session semantics, logout/revocation, federation/trust rotation, offline behavior, observability and evidence retention can differ independently.

## Governance
Authentication never implies authorization. `Enterprise → Station → Role → Person` may attenuate acceptable authenticators, providers, assurance and session duration, but lower layers cannot weaken superior requirements. Station may expose an admitted identity provider without receiving provider-admin or canonical identity authority. AGWS/AI may request authentication, reauthentication or step-up and carry identity context as provenance, but cannot infer permission, mutate canonical identity, link accounts, administer providers or widen authority.

## Observability
Record canonical subject/actor references; authentication event and `auth_time`; authenticator class/state; assurance profile; session host/issuer and lifecycle; trust-domain/bundle revision; federation/provider revision; revocation/security-state position; evidence occurrence/receipt/application times; offline closure profile; cohort/residual-session disposition; and explicit `PARTIAL/INCONCLUSIVE` causes.

## Portability and lock-in
Canonical identity and semantic authentication claims must survive provider replacement. A provider supporting the same protocol is not equivalent unless its assurance, session, revocation, trust, offline and evidence semantics satisfy the required profile. Offline Stations need qualified local identity closure; reconnection must requalify trust, security-state position, policy and residual sessions before privileged continuation.

## Product-specific mechanism vs universal primitive
NIST timeout numbers, SPIFFE bundle endpoints, WebAuthn flags and Keycloak offline tokens are mechanisms. Universal primitives are applicability-scoped authentication claims, typed identity/session/trust identities, revision-qualified assurance, evidence horizons, mixed support vectors, cohort drainage, local closure and non-amplifying identity context.

## Convergent / divergent patterns
Convergent: identity continuity is distinct from credentials/sessions; authentication evidence ages; federation creates multiple administrative/session boundaries; trust material rotates; revocation/currentness is distributed; provider substitution requires semantic—not protocol-only—compatibility. Divergent: human sessions, workload SVIDs, syncable authenticators and offline tokens have different lifecycle and revocation mechanisms and must remain typed.

## Subcapabilities
Canonical subject/workload identity; external mapping; authenticator/credential lifecycle; authentication/assurance; session lineage; federation/trust-domain management; continuous security-state/revocation; provider coexistence/substitution; offline/local authentication closure; account linking/relinking; identity evidence replay; AGWS identity-context revalidation.

## Comparison with fresh main
Bounded fresh-main search found the P13 runtime identity/session planning and proof chain. It explicitly proves authentication/session behavior while declaring roles/policies/authorization and production federation/SSO as non-goals; the dependency graph also states `Subject/User identity → credential/session/authentication → authorization`. This is positive evidence that current product planning preserves authentication/authorization separation, but it is not repository-wide proof of Generation-2 federation, continuous-security-state, mixed-provider or offline-closure semantics.

## Reconciliation hypotheses
- **KEEP** canonical subject identity separate from provider subject, authenticator, assertion and session identities.
- **HARDEN** authentication claims with applicability, freshness, trust and revocation-currentness evidence.
- **GENERALIZE** assurance/conformance as revision-qualified relations and provider support as typed vectors.
- **PROVIDERIZE** concrete IdPs, authenticators, federation transports, trust-distribution mechanisms and logout/revocation transports.
- **INTEGRATE** identity evidence with Authorization/Audit while forbidding identity evidence from self-granting authority.
- **REPLACE** scalar `authenticated/loggedIn/trusted/providerCompatible` claims where they hide scope or freshness.
- **DEFER** provider-specific administrative UX.
- **DO_NOT_BUILD** proprietary federation/authenticator protocols where standards/providers satisfy the realization need.

## Stable findings
### G2-FINDING-IAF-45 — Authentication claims require explicit applicability
`Authenticated` is not a global subject property. A valid claim is scoped by relying party/Station, purpose, assurance profile, authenticator/session class, federation/trust revision, provider, policy and evidence horizon.

### G2-FINDING-IAF-46 — Authentication assurance is a revision-qualified relation
A credential or prior authentication event does not carry timeless assurance. Effective assurance depends on the current authenticator state, verifier/profile, authentication age, session binding, trust and security-state evidence.

### G2-FINDING-IAF-47 — Federated IdP and RP sessions are independent lifecycle identities
NIST explicitly treats IdP and RP sessions as separately established and terminated. Federation success therefore cannot justify one global session identity or assume upstream logout/expiry has already terminated downstream sessions.

### G2-FINDING-IAF-48 — Trust-bundle possession is necessary evidence, not perpetual trust
SPIFFE federation requires the bundle corresponding to the presented trust domain and periodic updates as keys rotate. A previously valid bundle can become stale; validation must qualify trust-domain association and currentness.

### G2-FINDING-IAF-49 — Identity support and stability are mixed vectors
Provider/protocol compatibility must independently describe mapping, authenticator classes, assurance, session, revocation/logout, federation/trust, offline behavior and evidence semantics. A shared OIDC/SAML/WebAuthn label is insufficient for substitution.

### G2-FINDING-IAF-50 — Provider or authenticator substitution requires residual cohort drainage
New-provider authentication success does not close migration while old sessions, offline credentials, account links, trust bundles or authenticator cohorts remain effective. Cutover requires explicit residual disposition.

### G2-FINDING-IAF-51 — Offline authentication continuity does not imply current privileged authority
A Station may validate identity from qualified retained local closure while disconnected, but stale revocation, trust, policy or assurance evidence can prevent privileged continuation. Reconnection requires requalification before authority-sensitive actuation.

### G2-FINDING-IAF-52 — Identity context is provenance and cannot amplify AGWS/AI authority
Authenticated subject, actor, session or assurance context can qualify who made a request, but cannot itself create authorization, provider-admin, account-linking or canonical-domain authority. AI materialization remains bounded by independently resolved current authority.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-IAF-APPLICABILITY-SCOPED-AUTHENTICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability graph while Identity owns authentication dimensions.
- `G2-CAPABILITY-CANDIDATE-IAF-IDENTITY-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile UCA/Governance evidence horizons while retaining revocation/trust/session semantics.
- `G2-CAPABILITY-CANDIDATE-IAF-MIXED-IDENTITY-PROVIDER-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve mapping/assurance/session/revocation/federation/offline dimensions.
- `G2-CAPABILITY-CANDIDATE-IAF-SESSION-CREDENTIAL-TRUST-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Identity owns residual session/credential/trust closure during provider/authenticator migration.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Repo-validation questions
1. Can current Runtime represent applicability/freshness of authentication separately from session validity?
2. Are IdP/provider subject, canonical subject, authenticator, assertion and local session typed separately?
3. Can trust/revocation evidence become stale without rewriting historical authentication evidence?
4. Does provider replacement expose residual old-provider sessions/credentials/mappings?
5. Can a Station authenticate locally while authority-sensitive actions fail requalification?
6. Is provider compatibility modeled beyond protocol-name equality?
7. Can AGWS request step-up without gaining authorization/provider administration?
8. Are historical authentication proofs replayable only while evaluator/trust/revocation material remains available?

## Symbiotic Proof / architecture proof-backfill
1. Authenticate the same canonical subject through two provider realizations; prove mappings are distinct while canonical identity is stable.
2. Establish an RP session from a federated IdP, terminate only the IdP session, and prove RP session closure is not falsely inferred.
3. Rotate a SPIFFE-style trust bundle and keep one Station stale; new-trust claims there become `PARTIAL/INCONCLUSIVE` until refreshed.
4. Change authenticator backup/sync state without changing credential identity; re-evaluate policy/assurance rather than rewriting identity.
5. Migrate providers with old sessions/offline credentials still present; migration remains open until cohorts are dispositioned.
6. Authenticate offline from declared local closure, advance remote revocation/trust state, reconnect, and require requalification before privileged action.
7. Present a valid historical authentication event after its required revocation/trust evidence horizon is unavailable; replayability degrades without retroactively falsifying history.
8. Ask AGWS/AI to perform an operation using authenticated identity context but without authorization; request is escalated/denied and identity context remains provenance only.

## Value / risk / priority / next question
Value: constitutional separation of identity proof from authority while enabling portable human/workload federation. Risk: stale sessions/trust or provider migration can create false continuity and privilege if collapsed into booleans. Priority: high and cross-cutting. Next question belongs to Authorization / Policy / Organization / Multitenancy: how current authority claims consume identity evidence without inheriting its provider/session semantics or amplifying delegated Station/AGWS authority.