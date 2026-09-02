# Identity / Authentication / Federation — revisit 4 / cycle 5

## Research question
How should Generation 2 preserve canonical subject identity while authentication sessions, credentials, assurance, external subject identifiers, federation metadata/trust and provider realizations evolve independently, including provider coexistence, stale or incomplete trust evidence, account-link changes and qualified local/offline operation, without authentication becoming authorization?

## Representatives and evidence/source ledger
1. **OpenID Connect Core 1.0** — `iss` + `sub` identify a subject inside one issuer, while pairwise subject identifiers deliberately vary per client/sector. This is direct evidence that a federated subject identifier is a mapping input, not a globally canonical person identity.
2. **OpenID Federation 1.0 Final (2026-02-17)** — trust is established through signed Entity Statements, Trust Chains, Trust Anchors and deterministic metadata-policy resolution. Subordinate policy cannot weaken superior policy; invalid/conflicting chain policy invalidates the chain.
3. **NIST SP 800-63B-4** — authentication assurance and session continuation have explicit reauthentication/freshness semantics. RP and CSP sessions are independent; an RP requiring reauthentication should constrain maximum acceptable authentication age rather than assuming a fresh CSP login.
4. **WebAuthn Level 3** — credential backup eligibility and current backup state are separate properties; signature-counter regression is a signal, not proof, of credential cloning. Credential-risk evidence therefore cannot be collapsed into a boolean identity-valid flag.
5. **SPIFFE Federation / Trust Domain & Bundle** — trust-domain identity is associated with independently rotating trust bundles; clients must bind bundle material to the intended trust domain and use current bundle material during federation refresh.
6. **Microsoft Entra federation metadata** — token validators can observe multiple signing certificates during rollover and are expected to support all published signing certificates, demonstrating overlapping trust realizations during transition.
7. **Keycloak identity brokering/account linking** — external identity linking is an explicit flow. Keycloak warns that automatic linking of an external identity to a local account can be a security hole and offers verified/re-authenticated linking and override flows.

Primary sources for this pass: OpenID Connect Core; OpenID Federation 1.0 Final; NIST SP 800-63B-4; W3C WebAuthn Level 3; SPIFFE federation/trust-bundle specifications; Microsoft Entra federation metadata documentation; Keycloak latest Server Administration Guide.

## Source of truth
The SB semantic source of truth is a canonical subject/workload identity and its governed mapping relationships. External `iss/sub`, SAML NameID, directory identifiers, passkey credential IDs, SPIFFE IDs, sessions and provider account records are evidence or realization identities scoped to their issuer/trust domain/provider/profile. Authorization, organizational membership and Station exposure consume qualified authentication evidence under separate policy.

## Identity
Keep separate, revisioned identities:
- `CanonicalSubjectRevision` — semantic subject/workload identity known to SB.
- `ExternalSubjectMappingRevision` — mapping from issuer/trust-domain/provider-scoped identifier to canonical subject, including provenance and verification method.
- `AuthenticationContextRevision` — assurance, method, risk, authentication time and relevant authenticator evidence.
- `SessionRevision` — RP/provider/session continuity state.
- `CredentialRevision` — token/passkey/SVID/assertion realization with expiry, backup/clone-risk and revocation semantics.
- `FederationTrustRevision` — trust anchor, trust-chain derivation, metadata policy and trust-bundle/key set revision.
- `IdentityProviderRealizationRevision` — concrete provider/configuration realization.

No one revision is a safe proxy for the others.

## Lifecycle
Provider/federation admission → external-subject discovery → verified linking/mapping → authentication attempt → assurance/freshness evaluation → session establishment → credential issuance/rotation → reauthentication/step-up → trust metadata/key/bundle refresh → mapping revision or provider coexistence → revocation/expiry → unlink/decommission. Provider replacement may require a dual-trust/dual-mapping period before old realization retirement.

## Versioning and freshness
- Pairwise OIDC `sub` means mapping identity can change with issuer/client/sector while canonical identity remains stable.
- RP session freshness cannot be inferred from CSP session continuity; `auth_time`/maximum-age-style evidence must be evaluated against the operation/profile.
- Federation trust is generation-sensitive: Trust Chain, Trust Anchor, Entity Statements, metadata policy and signing/bundle material have independent freshness/validity windows.
- Key rollover can legitimately expose multiple accepted validation keys. A single-key `currentKey` abstraction loses transition semantics.
- Credential backup state, rotation and risk signals can change without canonical subject revision.

## Failure semantics
Distinguish at least: external subject unmapped; mapping collision; stale mapping verification; unsafe auto-link candidate; issuer/audience mismatch; insufficient assurance; stale authentication time; reauthentication required; session expired/terminated; credential expired/revoked; possible-clone signal; federation chain unresolved; trust-anchor mismatch; metadata policy conflict; stale/unavailable metadata; key/bundle rollover incomplete; old/new provider mapping mismatch; revocation status unavailable; local closure incomplete. Missing material trust/freshness evidence yields `PARTIAL`/`INCONCLUSIVE` or fail-closed behavior according to profile, never optimistic widening of authority.

## Extensibility
OIDC, SAML, WebAuthn/passkeys, LDAP/AD bridges, SPIFFE/SPIRE, workload certificates, commercial IdPs and future authenticators are realizations. Portable primitives are canonical subject identity, external-subject mapping, assurance requirement/evidence, session/credential lineage, federation trust qualification, reauthentication/freshness, governed mapping/provider migration and local closure.

## Provider boundaries
A provider may authenticate, issue evidence, host directories or expose federation metadata. It does not own the SB canonical subject or semantic authorization. Provider discovery/technical support is insufficient for admission. Provider migration/coexistence requires mapping equivalence, trust qualification, assurance compatibility, revocation/session semantics and explicit cutover evidence.

## Governance
- External identity linking is a governed semantic mutation, not a convenience side effect of successful login.
- Mapping creation/override should carry expected-base or semantic ownership/precondition evidence where concurrent administration is possible.
- Trust policy may become more restrictive down an accepted hierarchy but must not be silently weakened by subordinate Station/Role/Person layers.
- Break-glass and recovery authentication remain explicit exception profiles with independent evidence and expiry.
- Authentication never grants a role, entitlement, Station capability or provider-admin authority by itself.

## Observability
Record canonical subject ref, external mapping revision, issuer/trust domain, authentication context/assurance, `auth_time`/freshness qualification, session revision, credential class/revision without bearer secret, credential-risk/backup/clone signals where applicable, federation trust revision, chain/anchor/policy result, validation key/bundle generation, provider realization revision, revocation result, mapping-link/override transition and `PARTIAL`/`INCONCLUSIVE` reason.

## Portability and lock-in
Portable identity contracts must not embed tenant-specific Microsoft IDs, Keycloak realm internals, provider account IDs or one authenticator's state model as canonical semantics. A provider-specific identifier is retained behind `ExternalSubjectMappingRevision`. Local/self-hosted/air-gapped profiles need declared closure over identity mapping, trust anchors/bundles/metadata, authenticators/validators, assurance policy, session/reauthentication rules, revocation/freshness inputs and recovery material.

## Product-specific mechanism vs universal primitive
Product mechanisms: OIDC pairwise `sub`; OpenID Federation Entity Statements/Trust Chains; Entra rollover metadata; Keycloak First Broker Login/link flows; WebAuthn backup/sign-counter fields; SPIFFE bundle endpoints. Universal primitives: canonical subject + verified external mapping; revision-qualified authentication context; session/credential lineage; federation trust-chain/policy qualification; trust/key overlap transition; freshness/reauthentication evidence; governed mapping/provider transition; qualified local identity closure.

## Convergent patterns
- Canonical subject identity and external/federated subject identifiers are distinct.
- Authentication freshness is operation/profile-qualified, not equivalent to session existence.
- Trust material and federation metadata rotate independently from subjects and sessions.
- Federation trust is derived/qualified, not proved by endpoint reachability or syntactically valid metadata.
- Account linking/mapping is a security-sensitive mutation needing verification and lineage.
- Credential anomaly evidence can be uncertain and must not be converted into false certainty.

## Divergent patterns
- Human RP/CSP sessions, browser tokens, passkeys and workload SVIDs have different continuation and revocation models.
- Pairwise/public subject semantics differ by OIDC configuration; other protocols expose different external identity keys.
- Federation rollover differs between simple metadata key overlap, SPIFFE bundle refresh and multilateral OpenID Federation trust-chain resolution.
- Providers differ in account-link automation, revocation propagation and recovery UX.

## Subcapabilities
Canonical subject mapping; federated account linking; assurance/step-up; session and reauthentication freshness; credential lifecycle/risk; trust-chain and metadata-policy qualification; signing-key/trust-bundle rollover; provider coexistence/migration; local/offline identity closure; break-glass/recovery authentication; AGWS identity-context revalidation.

## Comparison with SB using evidence only
A bounded fresh-`main` GitHub code search for `AuthenticationContext session identity provider issuer subjectId authTime stepUp` returned no result in this execution. This is not evidence of repository-wide absence and is not used to infer implementation state. Full repository archaeology remains reserved for PLANNING_B.

## Reconciliation hypotheses
- **KEEP** authentication separate from authorization, Station exposure and semantic operation authority.
- **HARDEN** any identity model that uses email/username/provider `sub` directly as canonical subject without governed mapping lineage.
- **GENERALIZE** subject mapping, assurance/freshness and federation-trust qualification across human/workload providers.
- **PROVIDERIZE** authentication protocols, IdPs, authenticators, federation transports and credential/session realizations.
- **INTEGRATE** reauthentication/step-up with workflows/AGWS through explicit non-amplifying gates.
- **REPLACE** single booleans such as `loggedIn`, `trustedFederation` or `revoked` when they hide independent freshness/propagation/evidence states.
- **DEFER** provider-specific account-management UX until portable semantics are reconciled.
- **DO_NOT_BUILD** a proprietary federation protocol where OpenID/OIDC/SAML/SPIFFE-compatible providers satisfy realization needs.

## Stable findings
### G2-FINDING-IAF-29 — External Federated Subject Identifiers Are Scoped Mapping Evidence, Not Canonical Subject Identity
OIDC pairwise subject identifiers deliberately vary by client/sector. Generation 2 must treat issuer/provider-scoped identifiers as inputs to a verified `ExternalSubjectMappingRevision`, preserving canonical subject identity independently.

### G2-FINDING-IAF-30 — Authentication Freshness Is an Explicit Operation-qualified Dependency, Not Session Existence
NIST session guidance shows RP and CSP sessions are independent and reauthentication depends on assurance/time/activity. Sensitive action acceptance must carry a freshness qualification against the required profile; an extant session alone is insufficient.

### G2-FINDING-IAF-31 — Federation Trust Is a Qualified Trust-chain/Anchor/Policy Result, Not Metadata Reachability
OpenID Federation establishes trust through signed chains to a Trust Anchor plus deterministic metadata-policy application. Endpoint discovery or syntactically valid metadata is only input evidence; unresolved/conflicting policy must invalidate or make the federation unusable.

### G2-FINDING-IAF-32 — Key and Trust-bundle Rollover Requires Overlapping Realization Evidence Without Collapsing Trust Revision
Entra metadata can publish multiple signing certificates during rollover, while SPIFFE bundles rotate independently. Generation 2 must represent accepted overlapping validation material and its generation/freshness instead of one mutable `currentKey` pointer.

### G2-FINDING-IAF-33 — Federated Account Linking and Mapping Override Are Governed Identity Mutations With Ownership Preconditions
Keycloak explicitly warns that automatic account linking can be a security hole. Creating/replacing an external-to-canonical mapping requires verification, provenance, expected-base/ownership where concurrent change is possible, and explicit postcondition evidence.

### G2-FINDING-IAF-34 — Authenticator Anomaly Signals Can Be Inconclusive and Must Not Rewrite Identity or Authority
WebAuthn signature-counter regression is a signal, not proof, of cloning. Backup/risk state belongs to credential/authentication evidence; uncertain anomaly detection must produce qualified risk/`INCONCLUSIVE` handling rather than silently changing canonical subject or authority.

### G2-FINDING-IAF-35 — Identity-provider Coexistence and Migration Require Dual Mapping/Trust Qualification Before Cutover
Old and new providers may coexist while subject mappings, trust material, assurance and revocation/session semantics are validated. Cutover is safe only after semantic subject equivalence and required trust/freshness postconditions are proven; protocol compatibility alone is insufficient.

### G2-FINDING-IAF-36 — Qualified Local Identity Closure Includes Freshness and Trust-generation Evidence, Not Merely Local Credential Validation
Air-gapped/local identity requires declared trust anchors/bundles/metadata, subject mappings, validators/authenticators, assurance policy, reauthentication/session rules, revocation/freshness inputs and recovery material. Missing a required dependency yields bounded degradation or `INCONCLUSIVE`, never automatic authority broadening.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-IAF-FEDERATED-SUBJECT-MAPPING-REVISION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Identity specialization of semantic mapping + revision lineage; reconcile with authorization/org identity references without making provider IDs canonical.
- `G2-CAPABILITY-CANDIDATE-IAF-FEDERATION-TRUST-CHAIN-POLICY-QUALIFICATION` — **CROSS_CUTTING / CANDIDATE**. Reconcile with Governance/Standards evidence qualification; Identity retains trust-establishment semantics.
- `G2-CAPABILITY-CANDIDATE-IAF-IDENTITY-LINKING-OWNERSHIP-PRECONDITIONS` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Confirms UCA/PAM/UI expected-base/semantic ownership pattern for identity mapping mutations.
- `G2-CAPABILITY-CANDIDATE-IAF-AUTHENTICATION-FRESHNESS-DEPENDENCY-EVIDENCE` — **CROSS_CUTTING / CANDIDATE**. Reconcile with unified evidence freshness while preserving Identity ownership of reauthentication/assurance facts.

No candidate is promoted in this pass.

## Repo-validation questions
1. Does fresh main distinguish canonical subject from provider/issuer-scoped subject mappings?
2. Are authentication freshness and assurance evaluated at sensitive operation continuation rather than once at login?
3. Are federation metadata, trust anchors, signing keys/bundles and their generations represented independently?
4. Is external account linking a governed mutation with provenance and collision/override validation?
5. Can old/new IdPs coexist while mapping/trust equivalence is proven without changing canonical subject identity?
6. Can missing revocation/trust/freshness evidence propagate `PARTIAL`/`INCONCLUSIVE` instead of optimistic validity?
7. Can an air-gapped profile declare exactly what identity/trust/freshness material is locally closed?
8. Do Station/Role/Person changes force revalidation of authentication context without authentication granting authorization?

## Architecture proof-backfill obligations
1. **Pairwise-subject proof:** authenticate the same human through OIDC pairwise identifiers in two sectors and prove both can map to one canonical subject only through explicit verified mappings; raw `sub` values remain non-canonical.
2. **Mapping-collision adversarial proof:** present an external identity whose email/username matches an existing subject but lacks verified link evidence. Automatic canonical linking must be denied/held for explicit verification.
3. **Freshness proof:** keep an RP session alive past the permitted authentication-age/assurance window and require reauthentication/step-up before a sensitive operation while preserving canonical subject identity.
4. **Federation-policy negative proof:** resolve a trust chain whose subordinate metadata/policy conflicts with superior constraints. Federation qualification must fail rather than accept a reachable/signed endpoint.
5. **Rollover proof:** validate during a period with old+new signing/bundle material, then retire the old generation and prove stale validation evidence cannot continue to qualify new actions.
6. **Credential-risk inconclusive proof:** inject a WebAuthn-style clone-risk/sign-counter anomaly that is signal but not proof. Produce risk/`INCONCLUSIVE` disposition without mutating identity or granting/removing semantic authority automatically.
7. **Provider-coexistence proof:** run old/new IdPs concurrently, verify subject mapping/assurance/trust equivalence, cut over new sessions, then retire old trust only after postconditions; canonical subject remains stable.
8. **Qualified-local-closure proof:** authenticate offline from a declared closure, then remove one required trust/freshness/revocation dependency and require explicit bounded degradation/`INCONCLUSIVE` rather than silent online fallback or authority amplification.
9. **AGWS revalidation proof:** change Station/Role or required assurance while a personalized surface remains open. The surface/action revalidates identity context; stronger authentication does not add capabilities.

## Symbiotic Proof
A person has one canonical SB subject. IdP P1 emits pairwise identifiers for two relying-party sectors; each external identifier is separately verified and linked to the canonical subject. A routine Station action accepts the current AAL/profile, while a privileged AGWS approval later requires fresher phishing-resistant authentication and triggers step-up without changing role/capability authority. During federation rollover, old and new signing/trust material coexist and evidence records the accepted trust generation. P1 and P2 then run concurrently while mapping, assurance, revocation and trust equivalence are validated; only new sessions cut over after postconditions pass, and the canonical subject remains stable. If trust metadata becomes unavailable in an air-gapped profile, only actions whose declared local closure still has sufficient trust/freshness evidence proceed; others become degraded/`INCONCLUSIVE`. At no point does authentication strength, valid session, provider membership or successful account linking widen semantic authorization.

## Adaptive Governed Work Surfaces composition
AGWS remains a separate active capability. Effective surfaces resolve under `Enterprise → Station → Role → Person`, then bind actions to canonical subject plus revision-qualified authentication evidence. A Station/Role change, assurance-policy revision, provider cutover, trust-generation change or stale authentication window can require action/surface revalidation. Mandatory higher-layer components and capability exposure remain authorization/governance concerns; Identity only supplies qualified principal/authentication evidence. AI may coordinate step-up or propose mapping remediation but cannot grant authorization, override unsafe identity linking or weaken federation trust policy.

## Value / risk / priority / next question
Value: critical foundational cross-cutting. Risk if omitted: subject takeover through unsafe linking, stale-session privilege, trust-rollover outages or false trust, provider-migration identity collapse and offline authority drift. Priority: very high. Next capability must follow the state-authoritative cycle rotation: Authorization / Policy / Organization / Multitenancy, revisit 4 / cycle 5, consuming these identity findings without conflating authentication with authorization.