# Generation 2 — Enterprise Trust Qualification / Rotation / Substitution / Offline Proof

Status: CENTRALIZED PROOF RESOLVED BY MULTI-REPRESENTATIVE RESEARCH
Phase: RESEARCH_ELICITATION
Owners: Enterprise Trust + Secrets + Identity + Security + Lifecycle + Deployment + Architecture Reconciliation

## Research question
Can Generation 2 prove workload-effective trust without collapsing certificate/key presence into trust qualification, and can it preserve safety across root/intermediate rotation, provider substitution, residual consumers and disconnected Stations?

## Representatives and evidence ledger
1. RFC 5280 — path validation is evaluated at a point in time and trust anchors are external inputs; different paths may use different anchors.
2. SPIFFE Trust Domain/Bundle + Federation + Workload API — bundles are trust-domain-qualified, change over time, are distributed to workloads, and the latest available bundle is required for subsequent federation connections.
3. cert-manager + trust-manager — issuance and trust distribution are separate; CA rotation requires planning; directly following the issuer CA can immediately distrust the old root, so safe rollover needs deliberate overlap.
4. HashiCorp Vault PKI — multi-issuer rotation and CRL/OCSP lifecycle are explicit; revoking an issuer does not guarantee every external relying party observes that revocation.
5. Existing Enterprise Trust dossier — establishes typed trust identities, consumer-effective generation, offline horizon and provider support vectors.

## Source of truth and primitives
Trust is a qualified relationship, not material possession. The proof contract is `EnterpriseTrustQualification(subject/purpose, certificate/profile, issuer/path, trust-anchor-set revision, trust-policy revision, revocation/currentness evidence, provider realization, consumer-effective generation, Station, observation time, offline horizon)`.

Required typed facts include `TrustDomainId`, `TrustPolicyRevision`, `TrustAnchorSetRevision`, `IssuerRevision`, `CertificateId`, `RevocationEvidenceId`, `TrustBundleRevision`, `RolloverWindowId`, `ConsumerEffectiveTrustGeneration`, `StationTrustClosureId` and `TrustQualificationEvidenceId`.

## Lifecycle and failure semantics
Qualification: `material-present → path/policy/currentness evaluated → consumer-observed → QUALIFIED|DENIED|DEGRADED|INCONCLUSIVE`.

Rotation/substitution: `replacement admitted → overlapping trust established or explicit fenced cutover → replacement material distributed → consumers requalified → old issuer/anchor issuance disabled → residual cohorts drained/dispositioned → old trust retired`.

Disconnected operation: `connected-qualified → disconnected-within-horizon → horizon-warning → horizon-exceeded(DEGRADE|DENY|INCONCLUSIVE by higher policy) → reconnect → refresh status/bundles/policy → requalify → resume`.

Required failures include expired/not-yet-valid, path-invalid, revoked, revocation-undetermined/stale, anchor/bundle stale or unknown, policy/usage inapplicable, partially converged rotation, unknown consumer generation and offline-horizon exceeded. Unknown never normalizes to allow.

## Convergent evidence
RFC 5280 proves that certificate bytes alone are insufficient because validation depends on time, path and trust-anchor inputs. SPIFFE proves that trust bundles are mutable runtime inputs and that workloads must receive the bundle associated with the relevant trust domain. cert-manager documents that changing issuer CA material does not automatically reissue leaves and that production CA rotation/trust-store distribution require explicit planning. trust-manager documents the dangerous case where directly tracking the issuer CA can immediately remove the old root. Vault proves that issuer revocation is not equivalent to universal relying-party observation and that rotation/CRL state is provider-realized and distributed.

## Provider substitution and portability
Substitution is a new qualification event. Equivalent X.509 or ACME labels do not prove equivalent trust semantics. Compare issuer hierarchy, path/profile support, revocation mechanism/freshness, bundle distribution, key custody, federation, delegated authority, offline support, evidence export and rollover semantics. Cutover closes only after destination qualification and residual consumer/session/cache/mount/trust-store cohorts are requalified, drained or explicitly dispositioned.

## Offline / disconnected proof
A disconnected Station may continue only against a revisioned `StationTrustClosure` naming accepted anchors/bundles, issuer capability, certificate validity constraints, revocation/status evidence and a policy-defined freshness horizon. Crossing the horizon cannot silently retain the previous green state. Higher policy chooses DENY, DEGRADE or INCONCLUSIVE by operation class. Reconnect forces refresh and requalification before privileged authority resumes.

## Authority and AGWS boundary
`Enterprise → Station → Role → Person` is monotonic. Lower layers may narrow delegated issuers/usages/trust domains but cannot add unapproved roots, waive stale/revoked/path-invalid trust or extend offline horizons beyond higher policy. Adaptive Governed Work Surfaces and AI may present evidence, request renewal/rotation or propose remediation; they do not gain TrustAnchorAdmin, IssuerAdmin, ProviderAdmin, policy-waiver or canonical-domain authority.

## Product-specific vs universal
Provider-specific: cert-manager Issuer/ClusterIssuer, Vault PKI mounts/issuer APIs, SPIFFE bundle endpoints, ACME endpoints. Universal: trust relationship, anchor/bundle revision, issuer identity, certificate profile, currentness evidence, overlap/cutover, consumer-effective generation, offline horizon and residual-cohort drainage.

## Reconciliation hypotheses
KEEP existing fail-closed transport verification; HARDEN trust evidence/currentness; GENERALIZE trust qualification above transport/provider details; PROVIDERIZE issuance/revocation/distribution mechanics; INTEGRATE with Lifecycle/Deployment/Secrets/Identity/Security; DO_NOT_BUILD bespoke CA cryptography.

## Repo-validation questions
Does fresh main expose canonical trust-policy/anchor/issuer/bundle identities beyond transport TLS? Can any current runtime prove consumer-effective trust generation? Are revocation freshness, rollover overlap/drainage and offline trust horizons represented? These remain repository archaeology questions and do not reopen this semantic proof.

## Symbiotic Proof
A certificate/key pair remains present while its issuing path becomes revoked, expired, stale or policy-inapplicable: effective trust becomes DENIED/INCONCLUSIVE despite unchanged bytes. During root/provider rotation, old and new trust may coexist only within an explicit rollover window; closure requires observed consumer convergence and residual drainage. A disconnected Station beyond its trust horizon degrades/denies/becomes inconclusive and reconnect triggers requalification. No lower Station/Role/Person or AI context can weaken those invariants.

## Stable findings
- G2-FINDING-ETQP-01 — Certificate/key presence is not effective trust; qualification is applicability-scoped over path, anchor, policy, revocation/currentness, consumer generation and observation horizon.
- G2-FINDING-ETQP-02 — Trust anchors and bundles are revisioned runtime inputs; unchanged certificate bytes can become untrusted without contradiction.
- G2-FINDING-ETQP-03 — Revocation acceptance/publication and relying-party observation are distinct; stale/undetermined revocation evidence cannot silently inherit prior green state.
- G2-FINDING-ETQP-04 — Root/intermediate/issuer rotation requires deliberate overlap or explicit fenced cutover; replacing one trust-store value is not a safe rollover proof.
- G2-FINDING-ETQP-05 — Rotation/provider substitution closes only after consumer-effective requalification and residual trust cohort drainage/disposition.
- G2-FINDING-ETQP-06 — Trust-provider portability is a mixed support vector; protocol-label equivalence does not prove path/revocation/distribution/offline equivalence.
- G2-FINDING-ETQP-07 — Disconnected trust is bounded by a policy-defined evidence horizon; horizon exceedance yields DENY/DEGRADE/INCONCLUSIVE and reconnect forces requalification.
- G2-FINDING-ETQP-08 — Enterprise→Station→Role→Person and AGWS/AI remain non-amplifying for trust roots, issuers, policy waivers and provider administration.

## Disposition
The Enterprise Trust lifecycle, rotation/residual-drainage and disconnected-trust-horizon centralized proof junctions are RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH. No new top-level capability is created: the already-promoted Enterprise Trust capability owns the semantics; Lifecycle, Deployment, Secrets, Identity, Security and Architecture Reconciliation consume/coordinate them. Remaining Enterprise Completeness proof debt must still close before CAPABILITY_SYNTHESIS.
