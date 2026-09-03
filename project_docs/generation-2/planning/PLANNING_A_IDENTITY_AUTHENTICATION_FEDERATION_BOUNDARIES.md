# Planning A — Identity / Authentication / Federation Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Identity / Authentication / Federation

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product work, Work Package, TASK, Construction, or worker handoff.

## 1. Semantic owner

Identity / Authentication / Federation owns the canonical semantics required to answer **who/what is the subject or principal, how was that identity authenticated, with what assurance/currentness, and through which federation/trust relationship was the assertion obtained**.

It owns:

- canonical subject/principal identity and stable identity references;
- identifiers, aliases and explicitly governed identity-link relations;
- lifecycle of identities, authenticators, credentials and authentication sessions as identity/authentication facts;
- authentication ceremonies and resulting assurance evidence;
- authentication method/context, freshness/currentness and step-up/re-authentication facts;
- federation relationships, issuer/relying-party/trust-domain relationships and assertion provenance;
- external identity mapping/binding to canonical identity, including ambiguity and requalification;
- identity proofing/registration evidence where needed to establish or change canonical identity;
- revocation/expiry/disablement facts relevant to authentication validity;
- offline/local authentication closure and reconnect requalification requirements.

It does **not** own what the authenticated principal is authorized to do.

## 2. Source of truth and identity

Canonical identity is a System Builder semantic identity, not a provider account ID, email address, certificate subject, token `sub`, directory object ID, SCIM `id`/`externalId`, session ID or organizational role by default.

External/provider identifiers are realization identities represented through explicit, revisioned mappings/bindings. Adoption, merge, split or replacement of a canonical identity requires an authorized identity transition with lineage; provider discovery or first-match correlation cannot silently rewrite canonical identity.

A canonical identity may have multiple identifiers/aliases and multiple provider bindings. Conversely, evidence that two external identities refer to the same canonical subject must be explicit and qualified; ambiguity yields `INCONCLUSIVE`, not automatic unification.

Organizational `Role`, `Station`, tenant membership and policy assignment are contextual authority/organization relations, not identity itself. `Enterprise → Station → Role → Person` therefore does not collapse Role into Person identity.

## 3. Authentication and assurance

Authentication produces a qualified claim, not authority. A useful authentication result carries at least:

- canonical or candidate subject identity;
- authentication/federation source and binding revision;
- authenticator/credential/session context as applicable;
- method/assurance facts and producing policy/profile revision;
- issued/observed time and freshness/currentness horizon;
- evidence/provenance sufficient to replay why the claim was accepted;
- explicit uncertainty/disposition when evidence is incomplete.

Authentication success does not imply authorization. Authorization consumes identity/authentication facts and independently evaluates policy, resource/action context and delegated authority.

Stale, expired, unverifiable, insufficiently scoped or ambiguously mapped identity/authentication evidence is `INCONCLUSIVE` for claims requiring that evidence. It must never be silently upgraded to authenticated/current/authorized.

## 4. Federation and external identity mapping

Federation owns semantic relationships among identity authorities, issuers, relying parties and assertion consumers, including:

- trust/federation relationship identity and revision;
- accepted issuer/audience/subject namespace and mapping rules;
- assertion provenance and assurance/currentness facts;
- external-to-canonical identity mapping and collision/ambiguity handling;
- coexistence during provider/issuer migration;
- requalification when issuer, metadata, keys, policy, mapping or provider binding changes.

Federation does not make provider identity canonical merely because an assertion is cryptographically valid. Trust qualification, identity mapping and authorization remain separate decisions.

## 5. Lifecycle and versioning

Identity/authentication state evolves through explicit revisions and lineage. Material lifecycle transitions include create/register, prove/link, activate, authenticate, renew/rotate, step-up/re-authenticate, suspend/disable, revoke/unlink, merge/split where explicitly supported, migrate provider and retire.

Historical authentication evidence remains replayable against its producing revisions but does not automatically qualify current identity/authentication state after credential rotation, provider substitution, mapping change, federation-policy change or revocation.

Provider substitution preserves canonical identity where the explicit mapping can be requalified. Old sessions, credentials, assertions, caches and provider bindings are residual cohorts that must be drained, expired, revoked or otherwise dispositioned before a cutover can be considered complete.

## 6. Boundary with Authorization / Policy / Organization / Multitenancy

Identity/Auth/Federation owns **subject and authentication facts**. Authorization/Policy/Organization/Multitenancy owns **whether that subject may perform an action on a resource under organization/tenant/Station policy**.

Therefore:

- authentication never grants permission by itself;
- group/role/tenant/Station attributes received from an IdP are claims/evidence until accepted under local organizational/policy semantics;
- delegated or temporary authority is Authorization ownership;
- tenant and Station isolation are Authorization/Organization ownership;
- identity may supply principal/membership facts but cannot amplify authority.

## 7. Boundary with Enterprise Trust / PKI

Enterprise Trust/PKI owns trust anchors, certificate path/revocation qualification, issuance/renewal/rotation and workload/service certificate lifecycle. Identity/Auth/Federation consumes qualified PKI evidence when certificates authenticate subjects or federation endpoints.

A valid certificate path does not by itself establish canonical subject identity, federation mapping or authorization. Conversely Identity does not own CA hierarchy, certificate rotation or trust-bundle lifecycle.

## 8. Boundary with Secrets / Configuration / Environment Portability

Secrets/Configuration owns secret-value/reference realization, secret rotation/revocation mechanisms and portable configuration binding. Identity owns credential/authenticator semantics and the authentication consequence of their lifecycle.

A secret store may realize credential material; it does not become the canonical identity owner. Rotation of backing secret material requires requalification of affected authentication/session facts according to Identity policy.

## 9. Boundary with Provider / Binding / Capability Negotiation

Provider/Binding owns provider discovery, support qualification, admission, binding, fallback, coexistence and cutover. Identity owns the semantic identity/authentication/federation contract realized through such providers.

Provider IDs remain external realization identities unless explicitly adopted through an authorized identity transition. Provider substitution must preserve/requalify canonical mappings, assurance semantics and residual-session/credential drainage; matching feature names such as `OIDC`, `SAML`, `LDAP` or `SCIM` do not prove semantic equivalence.

## 10. Boundary with Standards / Interoperability / API Contracts

Standards/API Contracts owns protocol and conformance semantics for mechanisms such as federation/provisioning/token exchange. Identity owns what those protocol messages mean for canonical subject identity and authentication assurance inside SB.

Protocol-valid does not imply identity-mapping-valid, current, sufficiently assured or authorized.

## 11. Boundary with Privacy / Data Governance

Privacy/Data Governance owns purpose/use limitation, retention/disposition, legal hold, residency and applicable privacy obligations for identity-related data. Identity owns the semantic identity and authentication facts themselves.

Deletion, export, migration or provider substitution of identity data must respect Privacy obligations without allowing privacy/storage mechanisms to rewrite canonical identity semantics silently.

## 12. Boundary with AGWS

Adaptive Governed Work Surfaces consumes canonical principal/authentication and Authorization results to resolve effective surfaces. AGWS remains distinct from Identity and generic UI.

`Enterprise → Station → Role → Person` is a governed delegation hierarchy. Lower layers may specialize only within inherited authority. A Person identity is not equivalent to Role or Station. Switching Station/Role requires revalidation of the effective surface and relevant authority; it does not mutate canonical identity.

AI/AGWS cannot create identities, silently merge external accounts, lower assurance requirements, accept stale assertions, bypass re-authentication, grant provider-admin authority or convert authentication into authorization.

## 13. Boundary with Universal Capability Architecture

UCA supplies shared primitives such as typed semantic-vs-realization identity, qualified evidence envelopes, revision vectors, `INCONCLUSIVE`, currentness horizons, residual cohort drainage and non-amplifying authority. Identity specializes those primitives for subject/authentication/federation semantics.

UCA never becomes the identity source of truth and cannot normalize identity mappings on behalf of this capability.

## 14. Failure semantics

Identity/Auth/Federation must distinguish at minimum:

- `AUTHENTICATED` — required identity/authentication evidence is qualified for the requested context;
- `NOT_AUTHENTICATED` — authentication failed or required proof was not established;
- `INCONCLUSIVE` — evidence is stale, unavailable, ambiguous, insufficiently scoped, unverifiable or mapping cannot be safely resolved.

Remote/provider mutation outcomes additionally preserve the universal `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` effect disposition. An `UNKNOWN` mutating effect such as remote account/link creation requires reconciliation before unsafe retry unless idempotency is explicitly qualified.

Provider outage, disconnected operation or federation-metadata unavailability cannot silently extend evidence beyond its declared horizon. Degraded/offline authentication is allowed only within an explicitly retained local closure and inherited policy; when required evidence/currentness expires, privileged claims fail closed or become `INCONCLUSIVE` as policy requires.

## 15. Governance and observability

Identity transitions and authentication/federation decisions require lineage sufficient to answer who/what changed identity state, under which revision/policy/provider binding, what evidence supported it, and what residual cohorts remain.

Observability may report authentication failures, stale federation metadata, mapping ambiguity, residual sessions or provider health, but observations do not overwrite canonical identity state without an authorized transition.

## 16. Portability and lock-in

Portability is a support vector, not a protocol-name comparison. Provider replacement must qualify at least identity mapping semantics, identifier stability, assurance/authenticator support, session/revocation behavior, federation metadata/currentness, provisioning/link lifecycle, offline behavior, audit evidence and residual-cohort drainage.

The portable contract is the canonical identity/authentication/federation semantics plus explicit provider bindings and evidence—not one provider's account schema, token shape, directory object or session implementation.

## 17. Non-goals

This capability does not own:

- authorization decisions, policy evaluation, delegated authority or tenant/Station isolation;
- organizational Role semantics as identity;
- CA/trust-anchor/certificate lifecycle;
- generic secret/configuration storage;
- provider admission/cutover mechanics;
- protocol conformance as such;
- privacy obligation resolution;
- UI/AGWS composition;
- canonical domain/process modeling.

## 18. Planning B repository-validation questions

Later Planning B must inspect fresh `main` and answer, without assuming from research artifacts:

1. What current SB contracts represent users, subjects, principals, sessions, credentials/authenticators and external identity mappings?
2. Are canonical identity and provider/external IDs explicitly separated?
3. Does authentication evidence carry method/assurance, revision, provenance and currentness?
4. Is authentication structurally separated from authorization?
5. How are federation/provider mappings versioned, migrated and reconciled on ambiguity?
6. What happens to sessions/credentials during provider, key, mapping or policy rotation?
7. Is `INCONCLUSIVE` representable for stale/partial identity evidence?
8. Are offline/reconnect authentication horizons explicit?
9. Can provider-side `UNKNOWN` mutations be reconciled before retry?
10. Do tests prove that Role/Station context and provider identity cannot silently become canonical identity or amplify authority?

These questions are deferred; this Planning A execution does not inspect `main` or infer answers.

## 19. Symbiotic boundary proof

The boundary is coherent if a generated SB system can authenticate a canonical Person through one provider, replace that provider while preserving/requalifying the Person mapping, reject stale or ambiguous assurance as `INCONCLUSIVE`, drain old sessions/credentials, and then let Authorization independently decide access for the current Station/Role—without making the provider ID, Role, certificate, token or AI-generated correlation the canonical identity.

## 20. Planning A decision

**PASS_FOR_CAPABILITY.** Identity / Authentication / Federation has an explicit semantic owner, source of truth, lifecycle, failure semantics, provider boundary, governance/observability requirements, portability contract and non-goals. Its boundaries with Authorization, Enterprise Trust/PKI, Secrets/Configuration, Provider/Binding, Standards/API Contracts, Privacy/Data Governance, AGWS and UCA are sufficiently explicit for Planning A.
