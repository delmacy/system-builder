# Planning B — Identity / Authentication / Federation — SB Current State

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Identity / Authentication / Federation
Fresh main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact is repository archaeology only. It does not design target architecture, execute product code, materialize TASKs or Work Packages, start Construction, or perform worker handoff.

## Current implementation evidence

Fresh main contains an explicit generated-runtime identity/session slice. `CompilerRuntimeAuthenticationProvider` has logical `id` plus a required secret-reference `bindingRef`; `CompilerRuntimeIdentity` has logical `id`, `kind: user|service`, `subjectRef`, `active`, and `authenticationProviderRef`; `CompilerRuntimeSessionPolicy` currently contains only `lifetimeSeconds`. Runtime projection normalization validates unique provider/identity IDs, provider references, required secret-reference bindings, and session lifetime, and requires a session policy when identity/provider declarations exist.

The public SystemDefinition identity/session schema mirrors that bounded model: authentication providers are `{id,bindingRef}`, identities are `{id,kind,subjectRef,active,authenticationProviderRef}`, and session policy is bounded to 1..86400 seconds.

Generated runtime product tests evidence opaque locally issued session tokens, explicit expiry, in-memory session storage, `/auth/session`, fail-closed handling for missing/unknown/expired/disabled identity sessions, and absence of issued session token material from compiled artifacts. Representative action routes resolve a bearer session and expose authenticated actor context. Tests explicitly prove that this authentication actor context does not contain role grants, permission grants or policy decisions.

## Evidenced strengths and dispositions

- **KEEP** the explicit separation between logical runtime identity (`id`/`subjectRef`) and authentication-provider reference.
- **KEEP** authentication structurally separate from authorization; current tests deliberately prove no implicit role/permission/policy grant.
- **KEEP** provider secret material outside the canonical identity declaration through a secret-reference binding.
- **KEEP** fail-closed local session resolution for missing, unknown, expired or disabled identities.
- **KEEP** opaque runtime-local session tokens and the rule that issued token values are not compiled artifacts.
- **HARDEN** identity/provider semantics because current provider declaration is only logical ID + secret binding and does not evidence provider/external subject mapping semantics.
- **GENERALIZE** the current minimal identity/session slice only where later reconciled Generation 2 requirements demand qualified identity/authentication/federation semantics; do not infer a replacement architecture here.
- **INTEGRATE** with separate Authorization, Provider/Binding, Secrets/Configuration, Enterprise Trust/PKI, Standards/API Contracts and Privacy owners rather than absorbing their semantics.

No fresh-main evidence justifies `REPLACE`.

## Gaps against Planning A boundaries

Current main does **not evidence**:

1. a first-class canonical subject/principal record with revisioned identifiers/aliases and governed link/merge/split lineage beyond `id` + `subjectRef`;
2. explicit provider/external identity identifiers or revisioned external-to-canonical mapping/binding, collision/ambiguity handling, or explicit adoption semantics;
3. authentication ceremony evidence carrying method, assurance level/context, producing policy/profile revision, provenance, issued/observed time and a currentness horizon;
4. `AUTHENTICATED / NOT_AUTHENTICATED / INCONCLUSIVE` as qualified identity-assurance dispositions; the runtime currently has fail-closed session error codes but no general stale/insufficient/ambiguous evidence qualification;
5. authenticator/credential lifecycle semantics (registration, proofing, rotation, revocation, step-up/re-authentication) beyond identity `active` and session expiry;
6. federation relationships, issuer/relying-party/trust-domain identity, assertion provenance, issuer/audience/namespace qualification, federation metadata currentness or mapping requalification;
7. coexistence/provider migration semantics for identities or federation, including drainage/disposition of old sessions, credentials, assertions, caches and provider bindings;
8. offline/local authentication closure with an explicit retained evidence/currentness horizon and reconnect requalification;
9. generic provider-side identity mutation effect dispositions `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` or reconcile-before-retry for ambiguous remote account/link operations;
10. explicit proof that provider account IDs, token subjects, directory IDs, email aliases, certificate subjects or IdP group/role claims cannot silently become canonical SB identity. The current model is compatible with this boundary but does not itself model those external identifiers;
11. identity-specific versioning/correction/supersession and historical authentication replay against producing revisions;
12. federation/provider support qualification sufficient to prove semantic portability rather than protocol-name compatibility.

## Boundary preservation

Authorization remains the owner of permissions, delegated authority, organization/tenant/Station isolation and Role semantics. Current authentication-only actor tests are positive evidence for this separation.

Enterprise Trust/PKI remains owner of certificate/trust-anchor/path/revocation lifecycle. Secrets/Configuration remains owner of backing secret realization. Provider/Binding remains owner of provider admission/support/binding/cutover. Standards/API Contracts remains owner of protocol conformance. Privacy remains owner of retention/residency/legal-use obligations. AGWS consumes authenticated identity plus independently resolved authority; `Enterprise → Station → Role → Person` must not collapse Role into identity. AI/AGWS cannot fabricate identity mappings, assurance or currentness evidence.

## Maturity / portability / providerability assessment

The current slice is **implemented and product-tested as a minimal autonomous runtime identity/session mechanism**, but is not yet a full federation/assurance/lifecycle capability. Providerability is partial: authentication provider declarations are replaceable logical references bound through secret-reference environment requirements, but no support-vector or semantic mapping qualification is evidenced. Portability is therefore stronger at configuration/compilation boundaries than at identity/federation semantics.

The local in-memory session implementation is a concrete runtime realization, not evidence that session storage/continuity, federation, assurance or provider migration are universally solved.

## Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main provides a useful minimal foundation: provider-neutral logical identity references, explicit authentication-provider references, secret-reference separation, opaque expiring local sessions, fail-closed invalid-session behavior and authentication/authorization separation. The principal Generation 2 gaps are qualified canonical/external identity mapping, assurance/currentness/provenance, authenticator lifecycle, federation/trust relationships, ambiguity/INCONCLUSIVE semantics, provider migration and residual-session drainage, offline/reconnect requalification, and remote-effect reconciliation. The evidenced direction is predominantly **KEEP + HARDEN + GENERALIZE + INTEGRATE**; no replacement decision is supported in Planning B.
