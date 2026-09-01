# Generation 2 — Identity / Authentication / Federation

Status: FIRST DEEP PASS — NOT SATURATED

## Research question

What identity, authentication, session and federation primitives must remain portable and provider-independent in System Builder, and which mechanisms should stay provider-specific bindings? This pass tests issuer/tenant/provider identity, subject identity, authentication vs session vs token lifecycle, federation metadata, live connection health, secret boundaries, delegated organization administration and generated-runtime autonomy.

## Representatives

1. **Keycloak 26.x** — self-hostable reference with realms, identity brokering, sessions, protocol-level OIDC/SAML federation and delegated realm administration.
2. **Auth0 Organizations + Enterprise Connections** — B2B organization-scoped connection model, enterprise federation, organization-admin delegation and connection lifecycle/usage semantics.
3. **Microsoft Entra ID / External ID** — strong tenant/issuer semantics, external federation, claim scoping and metadata/certificate lifecycle.
4. **Clerk** — application-oriented session lifecycle, organization context and explicit post-authentication pending session tasks.
5. **ZITADEL** — self-hostable/cloud identity platform with instance- vs organization-scoped IdPs and delegated self-service configuration.

These representatives intentionally span self-hostable, managed enterprise, application-centric and multi-organization identity systems.

## Evidence / source ledger

| Source | Current evidence used | Main claim |
|---|---|---|
| Keycloak Server Administration Guide | https://www.keycloak.org/docs/latest/server_admin/ | Realm-scoped providers, brokered identities, session lifecycle, token revocation/timeouts, identity-provider aliases and delegated realm administration are distinct concerns. |
| Keycloak 26.7 release, 2026-07-09 | https://www.keycloak.org/2026/07/keycloak-2670-released | External-token retrieval moved toward client-level authorization/allow-listing; SCIM preview reinforces provisioning as a separate lifecycle from sign-in. |
| Auth0 Organization Connections | https://auth0.com/docs/manage-users/organizations/configure-organizations/enable-connections | Connections are tenant resources that can be enabled per organization with separate membership and delegated-admin properties. |
| Auth0 Enterprise Connections | https://auth0.com/docs/authenticate/enterprise-connections | Enterprise federation is represented as explicit connections using provider/protocol-specific configuration, while applications consume a stable authentication surface. |
| Auth0 M2M Organizations | https://auth0.com/docs/manage-users/organizations/organizations-for-m2m-applications | Machine identity can be scoped to organization context independently of end-user interactive authentication. |
| Microsoft Entra access-token validation | https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens | `iss` and tenant context form trust boundaries; the same `sub` value under different issuers/tenants denotes different identities. |
| Microsoft Entra ID-token claims | https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference | `iss`, `tid`, `idp`, `oid` and `sub` encode different identity dimensions; cross-tenant correlation must not be inferred from display/user attributes. |
| Microsoft Entra SAML/WS-Fed federation, updated 2026-05-18 | https://learn.microsoft.com/en-us/entra/external-id/direct-federation | Federation configuration has issuer, endpoint, certificate and optional metadata URL lifecycle; metadata enables signing-certificate renewal. |
| Clerk session tasks | https://clerk.com/docs/guides/configure/session-tasks | Authentication can be complete while a session remains pending because organization choice, MFA or password-reset requirements are incomplete. |
| Clerk auth/session overview | https://clerk.com/docs/guides/how-clerk-works/overview | Session validity and token refresh/handshake are runtime concerns distinct from the original authentication ceremony. |
| ZITADEL generic OIDC IdP | https://zitadel.com/docs/guides/integrate/identity-providers/generic-oidc | IdPs can be instance-wide or organization-scoped, with delegated organization self-service possible without making the external provider the platform owner. |
| ZITADEL self service | https://zitadel.com/docs/concepts/features/selfservice | Human and machine identities have distinct authentication mechanisms and session behavior. |

## Conceptual extraction

### Source of truth

A portable system should not use an external IdP's user record, tenant name, email address or display label as its business-semantic authority. Mature systems maintain a local identity/account relationship while recording the external provider relationship used to authenticate it. Keycloak's broker flow explicitly links/imports external identity into a realm-local account model; Entra treats the same human in different tenants as distinct accounts; Auth0 separates Organization membership from Connection identity.

Candidate primitive boundary:

`LocalIdentity -> AuthenticationRelationship -> AuthenticationProviderBinding -> ExternalIssuer/Subject`

The local identity can be authoritative for application identity while the external issuer is authoritative only for the authentication assertion it emitted.

### Identity

Identity is qualified, not global. A robust external subject key is conceptually `(issuer, subject)` and often also includes tenant/realm/provider-binding context. Entra explicitly warns that the same `sub` under different issuers/tenants represents different users. Keycloak similarly distinguishes its realm-local user from `identity_provider` and `identity_provider_identity` session notes.

Organization/tenant identity is also distinct from provider identity: an Auth0 Organization enables one or more tenant-level Connections; ZITADEL can expose the same IdP at instance scope or only for one organization.

### Lifecycle

At least five lifecycles recur and should not be collapsed:

1. provider configuration lifecycle — configured/enabled/disabled/rotated;
2. federation trust lifecycle — metadata, signing keys/certificates, endpoints, protocol compatibility;
3. authentication ceremony lifecycle — attempted/challenged/succeeded/failed;
4. session lifecycle — pending/active/expired/revoked/terminated;
5. token/assertion lifecycle — issued/refreshed/expired/revoked/rotated.

Clerk provides especially useful evidence that `authenticated` and `session usable` can differ: a session can be pending while post-authentication requirements remain incomplete.

### Versioning

Provider product version, protocol version, metadata/key version, connection configuration version, session-policy version and token format/profile version are independent dimensions. Key rotation or metadata refresh must not require changing local identity semantics. A provider replacement should preserve local identity where reconciliation rules can prove equivalence.

### Failure semantics

Failures should be typed above raw protocol errors. Distinct classes include:

- provider unavailable/unhealthy;
- federation metadata stale or signing key unknown;
- issuer/tenant mismatch;
- assertion invalid/expired/replayed;
- subject not linked or ambiguous;
- local identity disabled;
- authentication incomplete/pending;
- session expired/revoked;
- token refresh failure;
- secret/credential unavailable;
- organization/provider binding disabled.

Treating every failure as `unauthenticated` would erase operator-relevant and security-relevant evidence.

### Extensibility

Protocols (OIDC, SAML, OAuth, LDAP, social provider adapters) are provider-specific mechanisms behind a stable provider/binding surface. Keycloak and ZITADEL both demonstrate protocol/provider plugins/templates without requiring applications to adopt each provider's configuration model as their own domain model.

### Provider boundaries

A provider declaration should describe capability and identity, while sensitive connection material remains externally referenced. Auth0's connection profile model and organization connection delegation show that non-sensitive/admin-visible settings can be delegated separately from secret-bearing configuration. This supports a split between public provider/binding metadata and `SecretRef`/external credential custody.

### Governance

Delegated administration can be bounded without transferring business authority. Keycloak allows master-realm administrators to manage selected realms; Auth0 exposes organization-admin access levels (`none`, `read-only`, `limited`, `full`) for connection management; ZITADEL can permit organization members to configure organization-specific IdPs. The universal primitive is delegated management authority over an identity-provider binding, not automatic delegation of application business roles.

### Observability

Useful evidence includes provider/binding identity, issuer, authentication result, local identity, organization/realm context, session identifier/state, failure class and credential/key generation reference — but not raw secrets or reusable external tokens. Keycloak's strengthened external-token retrieval controls are a warning against making upstream tokens broadly readable.

### Portability

Portability requires local semantic identities and role/business authority to survive provider replacement. External `(issuer, subject)` relationships may be re-bound or migrated; business objects should not require provider-native user IDs unless explicitly part of an external contract.

### Lock-in

Lock-in rises when:

- business identity equals provider user ID;
- organization model is taken verbatim from identity SaaS;
- session semantics depend on provider SDK behavior with no portable contract;
- policies are encoded only in provider-specific rules/actions;
- upstream tokens are required by generated runtime for ordinary application identity;
- runtime must call System Builder itself to validate every session.

## Product-specific mechanisms not to copy automatically

- Keycloak `master` realm and realm-role layout.
- Auth0 Organizations, Universal Login, Connection Profiles and plan-specific M2M Organization mechanics.
- Entra `tid`/`oid` claim conventions, guest-object representation and Microsoft Graph-dependent group overage handling.
- Clerk handshake cookies, Frontend API and session-task component conventions.
- ZITADEL instance/organization console structure and provider templates.

These are valuable evidence for universal boundaries, not templates for SB's internal ontology.

## Recurring patterns

1. **Issuer-qualified subject identity** beats globally assuming an external user ID is unique.
2. **Local identity and authentication relationship are separate.** Federation proves authentication; it does not own business identity.
3. **Authentication, session and token lifecycles are separate state machines.**
4. **Tenant/organization context is part of the trust boundary**, not just UI metadata.
5. **Provider configuration and organization-specific binding are different objects.**
6. **Federation metadata/key lifecycle is operational evidence.**
7. **Delegated IdP administration can be narrower than business authorization.**
8. **Human and machine identities share some primitives but need different authentication ceremonies.**
9. **Secrets/tokens must remain outside portable semantic definitions.**
10. **Runtime autonomy requires local verification/session behavior sufficient for generated systems to operate without calling the Builder control plane.**

## System Builder comparison — bounded by repository evidence

Fresh `main` contains an additive identity/session contract with:

- `authenticationProviders[]` requiring only `id` and `bindingRef`;
- `identities[]` requiring `id`, `kind` (`user|service`), `subjectRef`, `active`, and `authenticationProviderRef`;
- `sessionPolicy` requiring `lifetimeSeconds` only.

The compiler/runtime projection and product tests preserve these descriptors into generated runtime models. This is meaningful positive evidence for provider-reference orientation, explicit local identity, human/service distinction and runtime projection.

However, this pass found no contract-level evidence in the inspected schema for issuer, tenant/realm, protocol, federation metadata, trust/key lifecycle, session revocation/refresh semantics, pending authentication/session states or provider health. This is a **research gap**, not authorization to add fields. Later repository archaeology must inspect implementation/evidence before reconciliation.

### Reconciliation hypotheses only

- `authenticationProviders + bindingRef`: **KEEP / HARDEN** as a promising provider-reference boundary.
- local `identities` with `authenticationProviderRef`: **KEEP / GENERALIZE** if runtime implementation proves provider-independent identity semantics.
- `sessionPolicy.lifetimeSeconds`: **HARDEN** candidate if later evidence shows runtime needs richer portable session semantics.
- issuer/tenant/federation trust metadata: **GENERALIZE or PROVIDERIZE** candidate depending on whether it belongs in portable requirement metadata versus provider binding metadata.
- delegated identity-provider administration for SB stations: **DEFER pending Governance/Security/Developer-Operator research**.

## Repository-validation questions before any decision

1. Does runtime authentication validate a qualified provider/issuer identity or only resolve `bindingRef`?
2. Is `subjectRef` a local stable identity reference or an opaque upstream subject identifier?
3. Can the same local identity link to more than one authentication provider safely?
4. Are provider credentials and signing keys represented by secret references without leaking into generated artifacts/evidence?
5. Is session state persisted/revocable independently of the provider token?
6. Does generated runtime validate sessions autonomously after publication, including provider outages?
7. Is provider replacement supported without rewriting business ownership/role bindings?
8. Are authentication failure classes preserved as evidence or flattened to generic failure?
9. Is tenant/organization/realm context modeled anywhere outside this identity schema, and which layer owns it?
10. Are machine/service identities authenticated through a provider-specific contract distinct from human login?
11. Is federation metadata/key rotation represented, observed or tested anywhere?
12. Can an SB management station delegate IdP administration without inheriting business authorization over managed systems?

## Symbiotic Proof candidate

A future proof should demonstrate all of the following without prescribing implementation now:

1. **Native path:** a generated runtime authenticates with one native/reference provider and establishes a local session without Builder availability.
2. **External provider path:** the same portable local identity/session contract works through an external OIDC/SAML provider binding.
3. **Replaceability:** provider A can be replaced by provider B while preserving local identity references, business ownership and authorization bindings according to explicit reconciliation rules.
4. **Portability:** no reusable secret, raw upstream token or provider-private configuration is embedded in portable `SystemDefinition` or durable evidence.
5. **Governance:** provider/issuer/binding identity, configuration generation, delegated administrator and key/metadata lifecycle are auditable.
6. **Runtime autonomy:** existing sessions and new authentication continue according to the declared runtime/provider contract without control-plane callbacks to System Builder.
7. **Adversarial proof:** issuer/tenant mismatch, stale key, disabled local identity, revoked session, ambiguous subject link and unavailable provider fail deterministically without granting authority.

## Normalized findings

- **G2-FINDING-IAF-01 — External Subject Identity Must Be Issuer-Qualified.** External subject IDs are meaningful only within issuer/tenant/provider context.
- **G2-FINDING-IAF-02 — Local Identity Must Outlive Authentication Provider Choice.** Federation proves an authentication relationship; it should not automatically become business identity authority.
- **G2-FINDING-IAF-03 — Authentication, Session and Token Are Separate Lifecycles.** Success in one does not imply the state of the others.
- **G2-FINDING-IAF-04 — Organization/Tenant Context Is a Trust Boundary.** It must be explicit wherever identity or claims can cross tenant boundaries.
- **G2-FINDING-IAF-05 — Provider Configuration and Provider Binding Are Distinct.** A provider may exist globally while only selected organizations/apps bind to it.
- **G2-FINDING-IAF-06 — Federation Metadata and Key State Are Operational Evidence.** Trust material has lifecycle, freshness and failure semantics independent of user identity.
- **G2-FINDING-IAF-07 — Pending Authentication Requirements Need Explicit State.** Authenticated-but-not-usable sessions are a real state, not generic failure.
- **G2-FINDING-IAF-08 — Delegated Identity Administration Must Not Imply Business Authority.** Administration of a connection/provider can be delegated within bounded scope.
- **G2-FINDING-IAF-09 — Secret and Upstream Token Custody Must Be Outside Portable Semantics.** Portable definitions should carry references and non-sensitive metadata, not reusable credentials.
- **G2-FINDING-IAF-10 — Runtime Autonomy Includes Identity Validation and Session Continuity.** Generated systems must not require the Builder control plane for ordinary authentication/session operation.

## Capability candidates

- **G2-CAPABILITY-CANDIDATE-FEDERATION-TRUST-LIFECYCLE** — CROSS_CUTTING. Evidence: Entra metadata/certificate lifecycle + Keycloak/ZITADEL external IdPs. Promotion requires recurrence in Secrets, Lifecycle, Provider/Binding and Security.
- **G2-CAPABILITY-CANDIDATE-QUALIFIED-EXTERNAL-IDENTITY** — CROSS_CUTTING. Evidence: Entra issuer/tenant-subject semantics + Keycloak broker identity notes. Promotion requires recurrence in Authorization/Multitenancy and Data/Provenance; may remain an identity subcapability.
- **G2-CAPABILITY-CANDIDATE-DELEGATED-IDENTITY-ADMINISTRATION** — CROSS_CUTTING. Evidence: Keycloak realm administration + Auth0 organization connection access levels + ZITADEL organization-specific IdP self-service. Promotion requires recurrence in Governance, Security and SB station composition research.

Existing `G2-CAPABILITY-CANDIDATE-CONNECTION-VALIDATION-HEALTH` receives reinforcing evidence from identity-provider connection/trust lifecycle, but is not promoted in this pass.

## Synthesis

**Value for SB:** very high. Identity is a foundational provider boundary and a direct test of whether generated runtimes can remain autonomous without inheriting provider-specific semantics.

**Adoption risk:** high if business identity, organization or authorization semantics are copied from one identity vendor; moderate if standards/provider bindings remain outside local semantic authority.

**Investigation priority:** critical.

**Next research question on revisit:** can a minimal portable identity contract express qualified issuer/subject relationships, session-state semantics and provider replacement without becoming a second identity platform or leaking authorization concerns?
