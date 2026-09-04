# Generation 2 — Planning B — Enterprise Trust / PKI / Certificate Lifecycle — SB Current State

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Enterprise Trust / PKI / Certificate Lifecycle
Fresh main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This is repository archaeology only. It authorizes no implementation, Work Package, executive TASK, Construction, PR, or worker handoff.

## Current implementation truth

The current product contains a bounded transport-trust implementation for PostgreSQL, not a general enterprise PKI owner.

`packages/postgres/index.ts` supports `sslmode=verify-ca|verify-full`. Positive modes require an `sslrootcert` CA source. `verify-ca` validates the chain while deliberately omitting hostname binding; `verify-full` validates both chain and target hostname. Positive modes use `rejectUnauthorized: true`, fail when CA material is unavailable, and classify hostname mismatch separately from untrusted certificate failure. Existing `disable|prefer|require` modes remain available and are not represented as positive identity verification.

The same positive-verification semantics are rendered into the autonomous Runtime PostgreSQL path in `packages/runtime-core/postgres-state.ts`, so the generated Runtime can perform the bounded transport check without depending on the Builder at runtime.

ADR-0015 is the authoritative constitutional decision for this slice. It explicitly distinguishes encrypted TLS from positively verified server identity, requires fail-closed positive modes, keeps CA/credential material out of durable Release/Deployment evidence and rendered artifacts, and chose additive opt-in compatibility rather than silently changing existing transport defaults.

The product tests include negative trust/identity cases such as hostname mismatch and untrusted certificate diagnostics. This is meaningful trust evidence, but only for the PostgreSQL transport slice.

The SecretResolver boundary is adjacent and intentionally distinct: runtime values are resolved from symbolic references and protected from durable-evidence leakage. Secret possession/storage is therefore not evidence of current certificate/path trust.

## Maturity assessment

### Evidenced / implemented

- bounded CA-backed PostgreSQL server trust verification;
- explicit distinction between chain-only and chain-plus-hostname verification;
- deterministic fail-closed diagnostics for unavailable CA, hostname mismatch and untrusted certificate in positive modes;
- parity of the bounded PostgreSQL trust behavior between Builder-side transport and rendered autonomous Runtime;
- compatibility-preserving opt-in introduction of positive verification;
- CA and credential material kept outside durable Release/Deployment evidence and generated artifacts;
- product tests for positive/negative transport identity behavior.

### Not evidenced as a general Enterprise Trust / PKI capability

Fresh main does not evidence first-class portable contracts for trust-domain identity, trust relationships, anchor/bundle revision, issuer generations, certificate/workload credential identity or profiles, enrollment/issuance facts, revocation/status evidence, renewal/rotation lifecycle, overlapping trust generations, consumer-effective adoption, residual trust-cohort drainage, provider-neutral trust-service substitution, bounded offline trust horizons, or reconnect requalification.

No repository evidence found in this archaeology establishes OCSP/CRL-style currentness as canonical product truth, revocation generation/versioning, certificate-expiry lifecycle orchestration, issuer/CA rotation, workload/service credential issuance, trust-provider binding qualification, or hierarchical trust delegation across `Enterprise → Station → Role → Person`.

The current PostgreSQL CA path is configuration-specific: a CA file location is supplied by connection configuration and read at connection time. That is useful realization behavior, but it is not a portable trust-anchor identity/revision model and does not establish consumer-effective convergence across a fleet.

## Planning A validation questions resolved

1. **Portable trust identity/policy vs provider-native identifiers:** no general portable trust-domain/certificate/issuer identity contract is evidenced. The PostgreSQL slice uses connection host, sslmode and CA source as transport configuration.
2. **Path/currentness/revocation and stale/unknown outcomes:** chain/hostname validation is evidenced; generalized currentness/revocation evidence and explicit stale/unknown trust semantics are not.
3. **Material availability vs consumer-effective trust:** the positive TLS handshake proves connection-time transport acceptance for that consumer, but no general desired/materialized/effective trust convergence model is evidenced.
4. **Provider substitution with qualification/overlap/drainage:** not evidenced for trust providers.
5. **Transport/runtime trust provenance and autonomous closure:** bounded PostgreSQL parity is evidenced through the transport and rendered Runtime; generalized provenance/currentness closure is not.
6. **Independent trust authorities:** issuance, revocation, anchor admission, provider administration and rotation are not evidenced as first-class independently governed product authorities.
7. **Generated-runtime parity:** PostgreSQL positive TLS verification is rendered into the autonomous Runtime and tested; evidence remains transport-specific.
8. **Disconnected evidence horizons:** not evidenced as explicit trust semantics.

## Dispositions

- **KEEP** the proven PostgreSQL positive-verification behavior, fail-closed positive modes, deterministic diagnostics, autonomous-Runtime parity, no-secret/no-CA durable-artifact boundary, and compatibility-before-replacement precedent.
- **HARDEN** later around trust currentness qualification, explicit stale/expired/revoked/path-invalid semantics, provenance and evidence horizons rather than treating possession of CA/certificate material as sufficient trust.
- **GENERALIZE** only from the proven transport slice toward portable trust-domain/anchor/issuer/credential identities, revisions, issuance/status/rotation/adoption/drainage semantics when later architecture phases justify the contracts.
- **INTEGRATE** with Identity/Auth, Authorization, Security/Resilience, Secrets/Configuration, Provider/Binding, Deployment/Runtime, Standards/API Contracts, Governance and Developer/Operator Experience without transferring their semantic ownership.
- **PROVIDERIZE** trust-service realization only behind qualified portable semantics; current PostgreSQL TLS configuration is not evidence that a general provider contract already exists.
- **REPLACE:** no evidence justifies replacing the bounded PostgreSQL trust implementation.
- **DEFER:** concrete trust-service/provider choices, lifecycle mechanisms and migration architecture belong to later phases.
- **DO_NOT_BUILD:** no basis exists for making PKI a semantic god-object, equating certificate/key possession with current trust, or making provider-native certificate IDs canonical by default.

## Gap statement carried forward

Generation 2 needs a semantic owner broader than today's transport-specific TLS check while preserving that proven slice. Later phases must decide portable trust identity/revision/evidence contracts; issuance/enrollment/status/revocation; renewal/rotation overlap; relying-party effective adoption; residual drainage; provider qualification/substitution; disconnected trust horizons; and monotonic delegated trust authority. These are gaps, not current-product claims.

`Enterprise → Station → Role → Person` remains non-amplifying: nothing in current main evidences lower-scope authority to admit anchors, issue/revoke credentials, extend trust horizons or weaken superior trust requirements. AI/AGWS likewise has no evidenced authority to manufacture trust evidence or reinterpret failed/unknown trust as trusted.

## Result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB has a real, product-tested, autonomous-Runtime-compatible PostgreSQL positive TLS server-identity slice and strong no-secret durable-evidence boundaries. It does not yet evidence a general Enterprise Trust / PKI / Certificate Lifecycle semantic owner. The correct current-state disposition is primarily `KEEP + HARDEN + GENERALIZE + INTEGRATE`, with providerization conditional on later qualified contracts and no evidence for replacement.
