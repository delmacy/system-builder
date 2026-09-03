# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Post-Promotion Saturation Revisit 01

Status: ELIGIBLE_NO_MATERIAL_FINDING_REVISIT_1_OF_2
Phase: RESEARCH_ELICITATION
Capability: `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE`
Classification: CROSS_CUTTING / PROMOTED / NOT_SATURATED
Method: research-by-exception against the promoted capability dossier and centralized trust proof; only a genuinely new architectural primitive/boundary/failure mode would reset the streak.

## Research question

After promotion and centralized proof closure, does current external evidence reveal any material architectural requirement not already represented by the capability's trust relationship, trust-anchor/bundle revision, issuer/certificate lifecycle, revocation/currentness, provider substitution, consumer-effective qualification, residual drainage, disconnected trust horizon, governance/observability and non-amplifying authority model?

## Representatives and evidence ledger

| Representative | Targeted exception tested | Evidence | Result |
|---|---|---|---|
| RFC 5280 | Whether path validity can be treated as certificate-local or timeless | https://www.rfc-editor.org/rfc/rfc5280 | No exception. Trust anchor is an input selected by policy/application; validation is time-qualified and path/policy dependent. Already owned by applicability-scoped effective trust and evidence currentness. |
| RFC 8555 / ACME | Whether issuance can collapse request/authorization/finalization/issuance/revocation into one certificate state | https://www.rfc-editor.org/rfc/rfc8555 | No exception. Orders and authorizations have explicit state machines and current status. Already owned by typed issuance lifecycle and reconcile-before-retry semantics. |
| SPIFFE trust-domain/bundle specifications | Whether workload identity removes trust-bundle lifecycle/currentness | https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/ | No exception. Bundles are authoritative per trust domain, change as keys rotate, and must be redistributed. Already owned by TrustBundleRevision, workload-effective trust and consumer requalification. |
| cert-manager CA issuer | Whether issuer replacement automatically converges issued material | https://cert-manager.io/docs/configuration/ca/ | No exception. CA rotation is explicitly operator-planned; changing the CA secret does not automatically reissue leaf certificates. Already owned by rollover overlap, consumer drainage and observed convergence. |
| cert-manager trust-manager | Whether distributing the newest root is intrinsically safe | https://cert-manager.io/docs/trust/ and https://cert-manager.io/v1.14-docs/trust/trust-manager/ | No exception. Safe root rotation requires coexistence or coordinated certificate rotation; immediate old-root removal can break residual consumers. Already owned by overlap/fencing/drainage. |
| HashiCorp Vault PKI | Whether provider-side CRL/issuer success proves relying-party currentness | https://developer.hashicorp.com/vault/api-docs/secret/pki | No exception. Multi-issuer and CRL rotation are provider facts; CRL rebuild/distribution freshness remains separate. Already owned by provider/evidence/consumer-effective separation. |

## Source of truth

No source-of-truth change is required. The existing split remains sufficient:

- portable trust intent and trust-policy revision;
- provider issuer realization and issuer revision;
- trust-anchor/bundle revision and provenance;
- immutable certificate identity/validity/profile;
- revocation/currentness evidence with explicit horizon;
- consumer-effective trust generation for Station/workload/application;
- residual consumer cohort and drainage state.

A provider control-plane `READY`, certificate bytes on disk, successful TLS handshake, or once-valid CRL/bundle remains insufficient on its own to prove current effective trust.

## Identity

The existing typed identities remain adequate: `TrustDomainId`, `TrustRelationshipId`, `TrustPolicyRevision`, `TrustAnchorSetId/Revision`, `IssuerId/Revision`, `IssuerBindingId`, `CertificateRequestId/OrderId`, `CertificateId`, `CertificateProfileRevision`, `RevocationEvidenceId`, `TrustBundleRevision`, `RotationAttemptId`, `RolloverWindowId`, `ConsumerEffectiveTrustGeneration` and `StationTrustClosureId`.

No reviewed representative requires a provider-native resource identifier to become canonical identity.

## Lifecycle and versioning

The existing lifecycle remains sufficient:

`request/authorize → issue → distribute/materialize → consumer-observe → qualify → renew/rotate with overlap → requalify → drain residual consumers → retire old issuance/anchor → retain evidence`.

ACME's authorization/order transitions, cert-manager's non-automatic CA/leaf convergence, SPIFFE bundle rotation and Vault multi-issuer/CRL behavior all fit this model without introducing another lifecycle owner.

Versioning remains independently revisioned across policy, issuer, bundle/anchor set, provider binding, certificate artifact, revocation evidence and consumer-effective generation. Equality of certificate bytes never implies equality of effective trust context.

## Failure semantics

No new material failure class was found. Current evidence is representable by the existing set including `PATH_INVALID`, `POLICY_INAPPLICABLE`, `REVOKED`, `REVOCATION_STATUS_UNDETERMINED`, `TRUST_BUNDLE_STALE`, `ISSUER_UNAVAILABLE`, `ISSUANCE_OUTCOME_UNKNOWN`, `REVOCATION_OUTCOME_UNKNOWN`, `ROTATION_PARTIALLY_CONVERGED`, `CONSUMER_GENERATION_UNKNOWN` and `OFFLINE_TRUST_HORIZON_EXCEEDED`.

External actuation with unknown acknowledgement still requires `OUTCOME_UNKNOWN → reconcile-before-retry`; retrying issuance/revocation/rotation blindly can create duplicate credentials or false convergence assumptions.

## Extensibility and provider boundaries

No boundary correction is required. System Builder owns portable trust intent, qualification, lineage and proof obligations; providers own CA cryptography, signing, protocol mechanics, CRL/OCSP serving, HSM internals and native IDs. Enrollment protocol, issuer provider, bundle distributor, revocation/status service and workload-identity realization remain provider/extensibility points rather than canonical semantics.

## Governance

The existing authority split remains sufficient: trust-policy, trust-anchor, issuer, issuance, revocation, rotation, provider-binding and Station-delegation authorities are distinct. `Enterprise → Station → Role → Person` is monotonic: a lower layer may narrow an explicitly delegated trust scope but cannot add roots/issuers, weaken currentness, extend an offline horizon or bypass revocation/path policy.

Adaptive Governed Work Surfaces remains a separate capability. AGWS/AI may request or materialize only authorized surface-level composition over qualified bindings; it cannot manufacture trust, modify canonical trust policy, acquire issuer/provider administration or convert stale/unknown evidence into PASS.

## Observability

Existing evidence dimensions remain sufficient: desired/observed issuer revision, bundle/anchor revision, certificate identity/validity, renewal/rotation attempt, revocation publication/currentness, consumer-effective generation, residual old-generation consumers, disconnected freshness horizon and provider health separated from semantic qualification.

The reviewed material reinforces, but does not extend, the rule that evidence currentness is consumer- and policy-relative.

## Portability and lock-in

No new portability dimension was found beyond the current mixed support vector: profile/path-policy support, enrollment protocols, hierarchy/multi-issuer rotation, revocation/status freshness, bundle distribution/federation, key custody/HSM, workload identity, delegated authority, offline behavior, evidence export/replay and rollover/drainage semantics.

Provider substitution therefore remains a fresh qualification event rather than label-equivalence such as "both support X.509" or "both support ACME".

## Product-specific mechanism vs universal primitive

Reviewed mechanisms — ACME resources, cert-manager `Issuer`/`ClusterIssuer`/`Certificate`, trust-manager bundles, Vault PKI mounts/issuers/CRLs and SPIFFE bundle distribution — remain provider/product-specific realizations.

Existing universal primitives — trust relationship/domain, anchor/bundle revision, issuer identity/revision, certificate profile/usage, issuance authority/lifecycle, revocation/currentness evidence, overlap/drainage, consumer-effective trust, disconnected horizon, provider binding and provenance — remain sufficient.

## Convergent / divergent patterns

Convergence is unchanged: trust is relationship/policy qualified; issuance and revocation have distinct lifecycle/authority; rotation requires coexistence plus observed convergence; short-lived workload credentials still require bundle/currentness semantics; provider abstraction is viable only with qualified support vectors.

Divergence remains implementation-level rather than owner-changing: SPIFFE optimizes workload identities and rotating bundles; Vault exposes richer multi-issuer/revocation operations; cert-manager orchestrates desired certificate state without proving every consumer adopted it; ACME standardizes enrollment rather than the entire relying-party trust graph.

## Current System Builder comparison — bounded fresh `main`

Fresh `main` ADR-0015 continues to prove only PostgreSQL transport-level positive server identity verification: `verify-ca` and `verify-full`, fail-closed behavior for explicitly requested positive modes, external CA material and equivalent rendered autonomous Runtime behavior. It explicitly does not establish canonical trust-domain, issuer lifecycle, revocation/currentness, bundle rotation, provider-neutral CA binding, consumer-drainage or disconnected-trust semantics.

Therefore the reconciliation hypothesis remains `KEEP + HARDEN + GENERALIZE`; there is no evidence for `REPLACE` and no basis to claim current SB already implements the promoted capability.

## Hypotheses

- **KEEP** ADR-0015's proven transport/server-identity behavior.
- **HARDEN** effective-trust evidence so provider/control-plane health cannot substitute for consumer-observed qualification.
- **GENERALIZE** trust intent, identity, lifecycle and evidence above transport/provider specifics.
- **PROVIDERIZE** CA/enrollment/status/bundle/key-custody mechanics.
- **INTEGRATE** with Identity, Secrets, Security, Provider Binding, Lifecycle, Deployment and Observability while preserving semantic ownership.
- **REPLACE**: not supported by this revisit.
- **DEFER / DO_NOT_BUILD** native bespoke CA cryptographic implementation unless later product evidence creates a distinct requirement.

## Remaining repository-validation questions

These remain repository archaeology questions rather than external research gaps:

1. Which current contracts can carry trust-policy, issuer-binding and consumer-effective-generation identities without violating existing portability boundaries?
2. Where can trust evidence be attached without leaking certificate/private-key material into durable artifact/release evidence?
3. Which existing deployment/runtime observations can prove consumer generation rather than merely process readiness?
4. Which current provider abstractions can express mixed trust support vectors without provider-specific schema leakage?

They are intentionally deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; they do not justify another external architectural primitive now.

## Symbiotic Proof

A portable SystemDefinition may require a trust relationship without naming Vault, cert-manager, SPIFFE or another CA implementation. A Station binds that requirement to an allowed provider realization, consumes a revisioned anchor/bundle and certificate profile, and is qualified only after the intended consumer generation observes current trust material. During root/provider rotation, old and new trust may coexist under policy while residual consumers are measured and drained. An offline Station continues only inside its declared trust/currentness horizon. Reconnection or provider substitution triggers refresh and requalification. AGWS/AI can consume the resulting qualified binding but cannot widen trust authority. This proof composes the capability with providers without lock-in or authority amplification.

## Stable findings disposition

**No new material architectural finding in this revisit.** Existing `G2-FINDING-ETPKI-*` and `G2-FINDING-ETQP-01..08` remain authoritative and sufficient for the tested exception set. No stable finding ID is minted merely to satisfy a count.

Saturation consequence: this is an **eligible no-material-finding revisit 1/2**. The capability remains **NOT_SATURATED** until a second consecutive eligible revisit also yields no material architectural finding, or all remaining questions become repository-only under the authoritative saturation rule.

## Value / risk / priority / next question

Value: confirms the promoted semantic owner is not expanding opportunistically after promotion.
Risk: premature saturation would waive the normal gate; therefore no phase transition occurs.
Priority: rotate to the least-covered promoted capability rather than immediately repeat the same capability.
Next question for this capability on its next eligible revisit: attempt to falsify the current model using alternate enterprise PKI/trust representatives and operational edge cases, especially delegated issuance, cross-domain federation, historical validation/evidence replay and provider/region substitution; record only genuinely new architecture.
