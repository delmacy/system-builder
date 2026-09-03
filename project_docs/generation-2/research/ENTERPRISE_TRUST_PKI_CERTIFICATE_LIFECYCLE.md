# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle

Status: STRUCTURAL GAP RESEARCH COMPLETE / PROMOTION RECOMMENDED
Phase: RESEARCH_ELICITATION
Candidate: `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE`
Classification under test: `CROSS_CUTTING`
Enterprise Completeness origin: `G2-FINDING-ENSR-01`

## Research question

Does enterprise trust, PKI and certificate lifecycle require a distinct cross-cutting Generation 2 semantic owner, or can it be cleanly merged into `Secrets / Configuration / Environment Portability`, `Identity / Authentication / Federation` and `Security / Resilience / Failure Recovery` without losing identity, lifecycle, failure, provider and effective-trust semantics?

The research tests a deliberately narrow claim: System Builder should not become a bespoke CA or cryptographic implementation. The question is whether portable system definitions and runtime qualification nevertheless require first-class trust relationships, issuer/trust-anchor identity, certificate lifecycle intent, revocation/currentness evidence, rotation/rollover state and consumer-effective trust independent of where private key bytes are stored or which CA provider performs issuance.

## Representatives

1. **RFC 5280 — Internet X.509 PKI Certificate and CRL Profile**: certification-path validation, trust anchors, policies, validity, CRL-based revocation and `UNDETERMINED` revocation outcomes.
2. **RFC 8555 — ACME**: automated account/order/authorization/challenge/finalization/certificate/revocation lifecycle.
3. **SPIFFE / SPIRE specifications**: workload identity, short-lived X.509-SVIDs, trust bundles, automatic rotation and federation across explicit trust domains.
4. **cert-manager**: provider-neutral Kubernetes certificate orchestration with namespaced/cluster issuers, built-in and external issuers, issuer references and automatic renewal.
5. **HashiCorp Vault PKI secrets engine**: dynamic issuance, roles, multiple issuers, rotation, CRL/OCSP, revocation authority and cross-cluster revocation semantics.
6. **Smallstep step-ca**: independently implemented private PKI/ACME CA with offline-root design and explicit limitations around multi-issuer, revocation and legacy protocols; useful as divergence evidence.

## Evidence / source ledger

| Representative | Evidence used | Architectural implication |
|---|---|---|
| RFC 5280 | https://www.rfc-editor.org/rfc/rfc5280 | Path validation takes trust anchors as inputs; different applications may use different anchors; policies and validity qualify a path; revocation may be `UNDETERMINED`; trust-anchor distribution is security-critical and outside certificate-byte storage. |
| RFC 8555 | https://www.rfc-editor.org/rfc/rfc8555 | Issuance is a typed state machine (`account → order → authorization/challenge → finalize → certificate`) with separate revocation requests; successful certificate possession does not collapse issuance authority or lifecycle. |
| SPIFFE concepts | https://spiffe.io/docs/latest/spiffe/concepts/ | X.509-SVIDs and trust bundles are short-lived/rotated; workloads retrieve current trust bundles; identity and trust material have explicit runtime-consumer semantics. |
| SPIFFE federation | https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/ | Federation binds trust-domain identity to bundle endpoints and requires latest bundles for subsequent connections; trust is scoped, refreshable and revision-sensitive. |
| cert-manager issuer configuration | https://cert-manager.io/docs/configuration/ | Built-in and external issuers share an orchestration surface; `Issuer`/`ClusterIssuer` model scope and delegated issuance boundaries. |
| cert-manager Certificate resource | https://cert-manager.io/docs/usage/certificate/ | Certificate desired state references an issuer; renewal is calculated from actual issued validity; deleting orchestration state need not delete the materialized secret. |
| Vault PKI API / considerations | https://developer.hashicorp.com/vault/api-docs/secret/pki and https://developer.hashicorp.com/vault/docs/secrets/pki/considerations | Multi-issuer rotation, CRL/OCSP, role-bounded issuance and privileged revocation show lifecycle/authority beyond secret storage; cross-cluster revocation may be pending and unified/local evidence differ. |
| Smallstep step-ca | https://smallstep.com/docs/step-ca/ | Provider support vectors differ materially: offline root, single configured intermediate, authority-wide policy and limited active revocation demonstrate that “supports X.509/ACME” is not semantic equivalence. |
| SB fresh `main` | `docs/adr/ADR-0015-tls-server-identity-verification.md` | SB already has transport-specific `verify-ca` / `verify-full` and external CA material with fail-closed verification, but intentionally does not define enterprise issuer, renewal, revocation, trust-bundle or rotation ownership. |

## Source of truth

Enterprise trust has multiple authoritative facts rather than one global source:

- **portable trust intent** — canonical G2 definition: trust-domain relationship, required assurance/trust policy, acceptable issuer/trust-anchor class, intended certificate/workload usages, freshness/offline requirements and delegated scope;
- **issuer authority truth** — provider realization: issuer configuration/revision, policy/role, issuance authority, serial/order identity and revocation capability;
- **trust-anchor / bundle truth** — revisioned trust-anchor set or bundle and its provenance/distribution state;
- **certificate truth** — immutable issued certificate identity and validity/policy extensions;
- **revocation/currentness truth** — CRL/OCSP/provider status evidence with explicit scope and freshness;
- **consumer-effective trust truth** — observed application/Station/workload realization proving which anchor/bundle/policy generation is actually in force.

No one of these can substitute for all others. In particular, `SecretPresent=true` and `TLSConnected=true` do not prove `EffectiveTrustQualified=true`.

## Typed identity

Minimum portable identities/primitives:

- `TrustDomainId`
- `TrustRelationshipId`
- `TrustPolicyRevision`
- `TrustAnchorSetId` + `TrustAnchorSetRevision`
- `IssuerId` + `IssuerRevision`
- `IssuerBindingId` (provider-neutral requirement → provider realization)
- `CertificateRequestId` / `CertificateOrderId`
- `CertificateId` (issuer identity + serial/fingerprint; never only a secret path)
- `CertificateProfileRevision` / intended usages
- `KeyMaterialReference` or `KeyHandleReference` (reference only; private key bytes remain outside canonical durable evidence)
- `RevocationEvidenceId` + evidence timestamp/scope
- `TrustBundleRevision`
- `RotationAttemptId` / `RolloverWindowId`
- `ConsumerEffectiveTrustGeneration`
- `StationTrustClosureId`

Provider-native resource IDs remain realization identity and must not become canonical business identity.

## Lifecycle

A certificate/trust lifecycle is not `secret created → secret deleted`.

### Issuance

`requested → authorized → ordered/challenged → issued → distributed/materialized → consumer-observed → qualified`

ACME makes the middle states explicit; provider implementations may collapse some mechanics but not the semantic distinction between request, authorization, issuance and effective consumption.

### Renewal / rotation

`replacement requested → replacement issued → trust overlap established → consumers requalified → old issuance disabled → residual consumers drained → old certificate/issuer retired → evidence retained`

Issuer/root rotation can require coexistence and cross-signing/alternate-chain behavior. A new certificate existing does not prove old consumers have switched.

### Revocation

`revocation requested → accepted/pending → issuer-effective → status evidence published → relying-party observed → consumer trust denied/requalified`

A successful revocation API response is not sufficient proof that every relying party has current revocation evidence.

### Trust-anchor change

`proposed → admitted → distributed → consumer-observed → cutover/overlap → drained → old-anchor disposition`

Trust-anchor removal is higher risk than ordinary secret rotation because it changes which issuers/paths can establish authority.

## Versioning and applicability

Trust qualification is applicability-scoped rather than scalar:

`subject/workload + purpose + certificate/profile + issuer/path + trust-anchor-set revision + trust-policy revision + revocation evidence/freshness + consumer/Station + provider realization + observation time/horizon`.

RFC 5280 explicitly allows different applications to rely on different trust anchors. Therefore a certificate can be valid for one relying application/purpose and invalid or inapplicable for another without contradiction.

Certificate bytes are immutable issued artifacts. Trust policies, trust-anchor sets, bundles, issuer configuration and revocation evidence are separately versioned and may change while the certificate bytes remain unchanged.

## Failure / revocation semantics

Required non-success states include:

- `PATH_INVALID`
- `EXPIRED_OR_NOT_YET_VALID`
- `POLICY_INAPPLICABLE`
- `USAGE_INAPPLICABLE`
- `REVOKED`
- `REVOCATION_STATUS_UNDETERMINED`
- `TRUST_ANCHOR_STALE_OR_UNKNOWN`
- `TRUST_BUNDLE_STALE`
- `ISSUER_UNAVAILABLE`
- `ISSUANCE_OUTCOME_UNKNOWN`
- `REVOCATION_OUTCOME_UNKNOWN`
- `ROTATION_PARTIALLY_CONVERGED`
- `CONSUMER_GENERATION_UNKNOWN`
- `OFFLINE_TRUST_HORIZON_EXCEEDED`

Where the external provider may already have performed issuance/revocation/rotation but acknowledgement is lost, use `OUTCOME_UNKNOWN → reconcile-before-retry`; blind replay can issue extra credentials or produce incorrect revocation/rotation assumptions.

For privileged operations, stale or undetermined trust evidence must fail closed or become explicit `INCONCLUSIVE` according to policy; it must never silently inherit a previous green state.

## Extensibility

The portable capability should expose semantic contracts, not provider protocols. Extension points belong at:

- issuer provider / CA binding;
- certificate enrollment protocol (ACME, EST, CMPv2, SCEP, provider API) as realization;
- trust-bundle distributor;
- revocation/status provider;
- key-generation/signing/HSM provider;
- workload identity realization;
- conformance/evidence collector.

Adding a provider must not add new canonical trust semantics merely because the provider exposes additional knobs.

## Provider boundaries

**System Builder owns:** portable trust intent, relationship identity, required trust/usage/freshness semantics, provider requirements, lineage, policy linkage, effective qualification and evidence obligations.

**Provider owns:** CA cryptography, signing operations, key custody implementation, enrollment protocol mechanics, CRL/OCSP serving, HSM internals, native resource IDs and operational scaling.

**Secrets owns:** protected storage/reference/materialization of sensitive key/certificate material. It does not own issuer/trust graph, revocation semantics or effective relying-party qualification.

**Identity owns:** subject/workload identity and authentication/federation semantics. It may consume X.509/SVID evidence but does not own generic CA lifecycle.

**Security owns:** requirements, risk posture, allowed cryptography/assurance and response policy. It does not become the operational source of truth for issuer/certificate/bundle lifecycle.

## Governance and authority

Authority must be typed and non-amplifying:

- `TrustPolicyAdmin`
- `TrustAnchorAdmin`
- `IssuerAdmin`
- `IssueCertificate`
- `RevokeCertificate`
- `RotateIssuer`
- `BindTrustProvider`
- `DelegateStationTrustScope`
- `ObserveTrustEvidence`

Issuance and revocation authority are distinct; Vault documents revocation as privileged because arbitrary serial revocation can deny service. Provider-admin authority must never be inferred from possession of a certificate, private key, AGWS editor access or AI execution context.

`Enterprise → Station → Role → Person` applies monotonically: lower layers may restrict allowed issuers, profiles, usages or trust domains when delegated, but cannot add trust anchors/issuers outside higher authority or weaken mandatory enterprise trust invariants.

## Observability and evidence horizons

Trust evidence must expose at least:

- desired/observed issuer revision;
- trust-bundle/anchor-set revision;
- certificate identity and validity horizon without leaking private keys;
- renewal/rotation attempt and result;
- revocation publication/status freshness;
- consumer-effective trust generation;
- residual consumers still observing old certificate/anchor/issuer;
- disconnected/offline freshness horizon;
- provider health separately from semantic trust qualification.

A CRL/OCSP/bundle being once valid does not make it perpetually current. Conversely, expiry of retained evidence does not retroactively negate a historically valid qualification; it may make later re-evaluation `HISTORICALLY_UNVERIFIABLE` or `INCONCLUSIVE`.

## Offline / disconnected behavior

A Station may operate with a declared local trust closure only while its policy-defined trust/evidence horizon remains valid. The closure must name which trust-anchor/bundle revisions, local issuer capabilities, revocation evidence and certificate validity windows are accepted offline.

When revocation/bundle freshness cannot be refreshed beyond the allowed horizon, privileged operations must degrade, deny or become `INCONCLUSIVE`. Reconnect requires trust-bundle/status refresh and consumer requalification before higher authority resumes. Offline operation never creates authority to add an unapproved root or issuer.

## Portability and lock-in

Portable trust intent must survive provider substitution. Portability proof compares a mixed support vector rather than protocol labels:

- X.509/profile/path-policy support;
- enrollment protocols;
- issuer hierarchy and multi-issuer rotation;
- revocation/status mechanisms and freshness;
- trust-bundle distribution/federation;
- key custody/HSM capabilities;
- workload identity integration;
- delegated issuance/revocation authority;
- offline/disconnected support;
- evidence export/replay;
- rollover/coexistence/drainage semantics.

Smallstep and Vault demonstrate meaningful divergence despite both being private-PKI implementations; cert-manager demonstrates that provider-neutral orchestration can bind multiple built-in/external issuers without making the issuer implementation canonical.

## Product-specific mechanism vs universal primitive

### Product/provider-specific mechanisms

- Kubernetes `Issuer` / `ClusterIssuer` / `Certificate` CRDs;
- Vault PKI mount, role and issuer API paths;
- SPIFFE bundle endpoint protocol and SVID representation;
- Smallstep provisioners;
- ACME HTTP resource paths;
- PostgreSQL `sslmode=verify-ca|verify-full`.

### Universal/cross-cutting primitives

- trust domain / relationship;
- trust-anchor set and revision;
- issuer identity/revision;
- certificate profile/usage intent;
- issuance authorization and lifecycle;
- revocation/currentness evidence;
- rollover overlap and consumer drainage;
- consumer-effective trust generation;
- offline trust/evidence horizon;
- provider binding and support vector;
- authority and provenance.

## Convergent patterns

1. **Trust is a relationship and policy-qualified validation result, not certificate possession.** RFC 5280 makes trust anchors external inputs and application-dependent.
2. **Issuance has a lifecycle and authority boundary.** ACME, cert-manager and Vault all model more than opaque secret creation.
3. **Short-lived credentials reduce but do not eliminate lifecycle semantics.** SPIFFE and Vault favor short lifetimes while still requiring rotation, trust-bundle distribution and revocation/currentness boundaries.
4. **Provider abstraction is viable but semantically lossy if support vectors are collapsed.** cert-manager external issuers prove pluggability; Vault/Smallstep differences prove that capability claims need qualified support axes.
5. **Rotation is coexistence plus drainage, not replacement-by-write.** Multi-issuer/alternate-chain/bundle rotation requires overlap and observed consumer convergence.
6. **Currentness has an evidence horizon.** CRLs, OCSP, trust bundles and disconnected Stations can become stale independently of certificate bytes.

## Divergent patterns

- Vault supports multiple issuers within one PKI mount and richer revocation/CRL operations; Smallstep intentionally uses a single configured intermediate and has limited active revocation.
- SPIFFE optimizes automated short-lived workload credentials and trust bundles; enterprise/browser PKIX often has broader certificate-policy/path/revocation concerns.
- cert-manager orchestrates certificate desired state and issuer bindings but does not itself make all relying consumers prove that they have adopted the newest material.
- ACME standardizes enrollment lifecycle, not the entire relying-party trust graph or enterprise policy model.

These divergences reinforce a provider-neutral semantic owner instead of arguing for a single native implementation.

## Subcapabilities

- Trust Domain & Relationship Modeling
- Trust Anchor / Bundle Lifecycle
- Issuer / CA Lifecycle & Rotation
- Certificate Profile / Usage Policy
- Issuance Authorization & Enrollment
- Certificate Renewal / Rollover
- Revocation / Status / Freshness
- Workload-effective Trust Qualification
- Trust Provider Binding & Negotiation
- Offline / Disconnected Trust Closure
- Trust Evidence / Provenance / Audit
- Consumer Cohort Drainage & Requalification

## Comparison with current System Builder — bounded fresh `main`

Evidence: `docs/adr/ADR-0015-tls-server-identity-verification.md` on fresh `main`.

Current SB truth supported by that ADR:

- PostgreSQL transport and rendered autonomous Runtime support positive TLS server-identity verification via `verify-ca` and `verify-full`;
- positive modes are fail-closed;
- CA material remains external to durable release/deployment evidence and rendered artifacts;
- existing lenient modes remain backward compatible;
- the ADR is explicitly bounded to PostgreSQL transport/runtime and does not change canonical schemas or SecretResolver.

What this evidence does **not** prove repository-wide:

- canonical trust-domain/relationship models;
- issuer/certificate lifecycle identity;
- automated renewal/rotation ownership;
- CRL/OCSP/revocation currentness;
- trust-bundle/federation lifecycle;
- provider-neutral CA binding;
- consumer-effective trust generation/drainage;
- offline trust horizon.

Therefore the reconciliation hypothesis is not `REPLACE ADR-0015`; it is to preserve that proven transport behavior and generalize the portable semantic layer above transport/provider realizations.

## Reconciliation hypotheses

- **KEEP** — ADR-0015 positive TLS identity verification, fail-closed positive modes and no-leakage of CA/key material into durable artifacts.
- **HARDEN** — qualify trust with revision, policy, purpose, revocation/currentness, Station and evidence horizon; add consumer-effective observation.
- **GENERALIZE** — move from transport-specific “CA available” assumptions to portable trust-domain/anchor/issuer/usage/rotation semantics.
- **PROVIDERIZE** — CA issuance, key custody, enrollment protocol, status serving, HSM and provider-native resource identity.
- **INTEGRATE** — Identity consumes trust evidence for authentication/workload identity; Security governs allowed assurance/crypto; Secrets materializes protected references; Deployment/Runtime consumes effective trust for admission/connectivity.
- **REPLACE** — none justified by this research.
- **DEFER** — browser-public-Web-PKI-specific CT/browser-root-program policy unless a generated client requires it; treat as profile/provider concern until broader need appears.
- **DO_NOT_BUILD** — bespoke System Builder cryptographic primitives, root program or monolithic CA merely to satisfy the capability. Native implementation is optional; provider portability is mandatory.

## Repo-validation questions for later PLANNING_B

1. Beyond ADR-0015, where do CA/certificate/trust references enter Runtime, Deployment, SecretResolver, integration or identity contracts?
2. Is there any existing durable identity for trust anchors, certificate generations, issuer revisions or effective runtime trust?
3. Can current no-leakage evidence retain certificate metadata/fingerprint/issuer revision without leaking PEM/private material?
4. Do deployment/runtime records distinguish desired trust policy from consumer-observed trust generation?
5. Are there existing retry paths where ambiguous issuance/rotation/revocation side effects could be replayed blindly?
6. What current boundaries would host provider-neutral issuer/trust bindings without creating a new canonical provider ID?
7. Which constitutional ADR(s) are required if G2 makes enterprise trust a first-class portable capability?

No answer is inferred during this research phase; these are archaeology questions for fresh `main` in the authorized later phase.

## Symbiotic Proof

A generated System Builder system declares one logical service-to-database trust requirement independent of provider. In realization A, cert-manager binds to an ACME/private issuer; in realization B, Vault PKI performs issuance; a disconnected Station uses an approved local trust closure.

Proof sequence:

1. issue/materialize certificate generation `C1` and trust-anchor set `T1`; prove consumer-effective generation observes `C1/T1`;
2. rotate issuer/root to `I2/T2`, establishing only policy-approved overlap;
3. prove some consumers may temporarily remain on `C1/T1` without falsely reporting global convergence;
4. requalify all consumers against `T2`, then drain/dispose the residual `T1` cohort before declaring rotation closed;
5. revoke `C1` while its secret bytes still exist; any consumer subject to current revocation evidence must reject it independently of secret availability;
6. make a Station exceed its declared offline revocation/bundle freshness horizon; privileged use degrades/denies/becomes `INCONCLUSIVE` until reconnect requalification;
7. replace issuance provider while preserving the logical trust requirement and evidence lineage; provider-native issuer/resource IDs do not become canonical identity;
8. show an AGWS/AI request can request a certificate-backed action only within delegated Station/Role authority and cannot add a root, create an issuer or widen trust policy.

Pass condition: portable trust intent, provider realization, sensitive material, certificate identity, revocation evidence and consumer-effective trust remain separate and traceable through rotation/provider substitution/offline operation.

## Stable findings

### G2-FINDING-ETPKI-01 — Effective trust is applicability-scoped, not certificate-presence state
A usable certificate claim requires the relying subject/workload, purpose, certificate/profile, issuer/path, trust-anchor-set revision, trust-policy revision, revocation/currentness evidence, Station/consumer, provider realization and observation horizon. RFC 5280 explicitly permits different applications to use different trust anchors. **Value:** HIGH. **Risk:** certificate bytes or a successful TLS handshake are mistaken for enterprise trust. **Priority:** P0. **Next question:** encode the minimum portable trust-qualification envelope without leaking secret material.

### G2-FINDING-ETPKI-02 — Enterprise trust lifecycle is structurally distinct from Secrets, Identity and Security ownership
Secrets protects key/certificate material; Identity owns subjects/authentication; Security owns assurance/risk policy. None cleanly owns issuer/trust-anchor relationships, issuance/revocation/rotation state and consumer-effective trust. Multi-representative evidence therefore supports promotion of Enterprise Trust / PKI / Certificate Lifecycle as a distinct `CROSS_CUTTING` capability. **Value:** HIGH. **Risk:** lifecycle semantics scattered into provider adapters or secret storage. **Priority:** P0. **Next question:** define constitutional boundary/ADR requirements during synthesis/planning.

### G2-FINDING-ETPKI-03 — Issuance, distribution and effective consumption are separate typed facts
ACME separates order/authorization/challenge/finalization from certificate retrieval; cert-manager separates desired Certificate/Issuer state from the Secret that receives material. Issued does not imply distributed, observed or trusted by every consumer. **Value:** HIGH. **Risk:** false readiness after issuance. **Priority:** P0. **Next question:** standardize consumer-effective trust observation.

### G2-FINDING-ETPKI-04 — Revocation is a freshness- and scope-qualified distributed state
RFC 5280 can return revocation status `UNDETERMINED`; Vault distinguishes local/unified revocation data and may have pending cross-cluster revocation. Successful revocation intent or provider acceptance does not prove every relying consumer has current denial evidence. **Value:** HIGH. **Risk:** revoked credentials remain effectively accepted. **Priority:** P0. **Next question:** establish revocation evidence horizons and policy for stale/offline consumers.

### G2-FINDING-ETPKI-05 — Rotation requires overlap, fencing and residual consumer drainage
Issuer/root/certificate rotation may require coexistence; Vault multi-issuer, SPIFFE bundle rotation and ACME alternate-chain realities show that replacement is not one atomic write. Closure requires destination trust qualification plus residual certificate/anchor/bundle/session consumer drainage or explicit disposition. **Value:** HIGH. **Risk:** old trust remains silently active or cutover causes outage. **Priority:** P0. **Next question:** define rotation cohort/fencing proof shared with Lifecycle and Architecture Reconciliation.

### G2-FINDING-ETPKI-06 — PKI/provider portability is a mixed support vector
X.509/ACME protocol compatibility does not prove equivalent multi-issuer, revocation, workload, offline, HSM, evidence or rotation semantics. Vault and Smallstep diverge materially; cert-manager proves issuer pluggability without semantic equivalence. **Value:** HIGH. **Risk:** provider substitution silently weakens trust guarantees. **Priority:** P1. **Next question:** define admission/negotiation axes for issuer providers.

### G2-FINDING-ETPKI-07 — Trust evidence has an independent replay/currentness horizon
CRLs, OCSP results, trust bundles and consumer observations expire or become stale independently of immutable certificate bytes. Offline closure must declare acceptable horizons, and reconnect must requalify before privileged trust resumes. **Value:** HIGH. **Risk:** stale trust is treated as perpetually valid or historical evidence is misinterpreted. **Priority:** P0. **Next question:** align trust evidence horizon with disconnected Station and Governance evidence semantics.

### G2-FINDING-ETPKI-08 — Delegated Station trust and AI/AGWS authority are monotonic and non-amplifying
`Enterprise → Station → Role → Person` may constrain allowed issuers/profiles/usages within delegated scope but cannot add superior trust anchors, weaken mandatory trust policy or infer issuer/revocation/provider-admin authority. AI may materialize approved bindings/requests but must escalate root/issuer/policy changes. **Value:** HIGH. **Risk:** a personalized work surface or automation becomes a trust-administration bypass. **Priority:** P0. **Next question:** make trust authority an explicit proof junction with Authorization and AGWS.

## Capability Discovery Register additions

- `G2-CAPABILITY-CANDIDATE-ETPKI-APPLICABILITY-SCOPED-EFFECTIVE-TRUST-QUALIFICATION` — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`.
- `G2-CAPABILITY-CANDIDATE-ETPKI-TRUST-EVIDENCE-REPLAY-HORIZON` — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`.
- `G2-CAPABILITY-CANDIDATE-ETPKI-MIXED-TRUST-PROVIDER-SUPPORT-VECTOR` — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`.
- `G2-CAPABILITY-CANDIDATE-ETPKI-RESIDUAL-TRUST-CONSUMER-COHORT-DRAINAGE` — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`.

These are not promoted as separate top-level capabilities; they are candidate reusable primitives/subcapabilities for synthesis.

## Promotion disposition

**PROMOTE** `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE` to the active Generation 2 research taxonomy as **CROSS_CUTTING / NOT_SATURATED**.

Evidence threshold is met across RFC 5280, RFC 8555, SPIFFE, cert-manager, Vault and Smallstep: convergent trust-domain/anchor/issuer/certificate/revocation/rotation/effective-consumer semantics are structurally necessary and cannot be assigned wholly to Secrets, Identity or Security without ownership collapse. Promotion does **not** authorize a native CA implementation and does not close saturation.

## Enterprise Completeness disposition

`G2-FINDING-ENSR-01` is **STRUCTURALLY RESOLVED BY PROMOTION**, while its executable proofs remain open/backfill-required. Enterprise Completeness itself remains open because Privacy/Data Governance, AI lifecycle/evaluation, Economic Governance disposition and cross-capability proof junctions are still unresolved.

Next structural gap after this disposition: `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY`.
