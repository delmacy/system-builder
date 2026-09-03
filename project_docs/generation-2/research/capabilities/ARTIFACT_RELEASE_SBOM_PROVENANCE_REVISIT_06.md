# Artifact / Release / SBOM / Provenance — Revisit 6 / Cycle 7

## Research question
How should Generation 2 qualify artifacts and releases across immutable subjects, independently revisioned SBOM/provenance/signature evidence, mutable channels, registry-specific discovery, delegated verification, anti-rollback/freshness state, air-gapped verification and downstream consumer uptake without collapsing Build or Deployment ownership into Artifact/Release?

## Representatives and evidence/source ledger
1. **SLSA v1.2 Provenance + Verification Summary Attestation (VSA)** — provenance is verifiable information about where/how an artifact was produced. VSA is a separately signed delegated verification decision that binds subject, verifier, policy and optional input-attestation descriptors; consumers must trust an allowed signer/verifier pair. Sources: https://slsa.dev/spec/v1.2/provenance and https://slsa.dev/spec/v1.2/verification_summary
2. **Sigstore/Cosign bundles + signed timestamps** — signatures bind the artifact digest; bundles retain certificate/signature/transparency evidence and can support offline verification. Signed timestamps establish an independently verifiable signing-time claim and are verified against a TSA certificate chain. Sources: https://docs.sigstore.dev/cosign/verifying/verify/ and https://docs.sigstore.dev/cosign/verifying/timestamps/
3. **OCI Distribution Specification** — digest-addressed content is distinct from human-readable mutable tags. Referrers discovery may be native or fall back to a digest-derived mutable tag; fallback updates can race, and conditional requests may be required to avoid lost updates. Source: https://specs.opencontainers.org/distribution-spec/
4. **CycloneDX** — compositions explicitly represent completeness as complete, incomplete variants, or unknown, including nested/partial assemblies. Sources: https://cyclonedx.org/specification/overview/ and https://cyclonedx.org/use-cases/compositions-component-assembly/
5. **The Update Framework (TUF)** — repository metadata is signed by scoped roles, versioned and expiring; clients reject metadata older than already observed state, providing rollback/freeze resistance. Source: https://theupdateframework.io/docs/metadata/
6. **in-toto** — signed layouts define authorized supply-chain steps/functionaries; signed link metadata records command/material/product evidence and is checked against layout policy. Source: https://in-toto.io/docs/getting-started/

## Source of truth and typed identities
Artifact/Release has no single global source of truth. Canonical semantics require typed claims with explicit applicability:

`BuildOutput -> ArtifactSubject -> ArtifactRealization -> EvidenceDocument(SBOM|Provenance|Attestation|SignatureBundle) -> EvidenceSetRevision -> VerificationDecision -> ReleaseRevision -> ChannelBindingRevision -> DistributionRealization -> ConsumerObservedReleaseState`.

Additional evidence identities are first-class: `TrustMetadataRevision`, `TimestampEvidence`, `DiscoveryIndex/ReferrersState`, `ConsumerAntiRollbackState` and `ReleaseQualificationClaim`.

A digest proves content identity under a digest algorithm; it is not release identity. A VSA is a verifier-authored claim, not raw transitive evidence. A tag/channel is mutable routing state. A consumer's last-seen trusted metadata/version is a distinct state from provider-side publication.

## Applicability-scoped release qualification
A release claim is valid only for an explicit scope such as:

`{artifact subject/profile, evidence-set revision, SBOM composition scope+completeness, provenance/build profile, signer/verifier identities, trust-root/TSA/log metadata revision, verification+release policy revision, channel/repository namespace, registry discovery profile, consumer/platform cohort, anti-rollback state, time/freshness requirements, evidence-retention horizon}`.

A release can therefore be admissible for one Station/platform/consumer cohort and not another without contradiction.

## Lifecycle, versioning and failure semantics
- Build success produces an output candidate; Artifact/Release owns admission, evidence qualification, release revision, channel promotion and distribution closure.
- Evidence is independently revisioned. Replacing an SBOM, VSA or signature bundle does not mutate immutable artifact bytes.
- `SIGNATURE_VALID`, `PROVENANCE_AUTHENTIC`, `SBOM_PRESENT`, `VSA_PASSED`, `RELEASE_QUALIFIED`, `CHANNEL_CURRENT`, `DISTRIBUTED` and `CONSUMER_UPTAKE_OBSERVED` are separate claims.
- A signed timestamp can preserve a verifiable signing-time fact after a short-lived signing certificate expires, but it does not make current release policy or trust policy permanently valid.
- TUF-style version/expiration state makes freshness consumer-relative: provider-side `latest` or a mutable tag cannot override a client's stronger already-observed anti-rollback state.
- OCI referrers discovery is realization-specific. A registry with native Referrers API and one using fallback tags can store equal subject bytes yet expose different evidence-discovery concurrency/failure semantics.
- A successful manifest/artifact PUT followed by acknowledgement loss is `OUTCOME_UNKNOWN`; reconcile digest, tag/channel and referrers/evidence state before retry.
- Promotion/cutover closes only after source and target subject/evidence/channel discovery equivalence is proven and residual provider replicas, mutable aliases, caches and consumer cohorts are drained or explicitly dispositioned.
- Evidence deletion/GC, trust-root loss, policy loss, transparency/timestamp material loss or digest-algorithm retirement can make later re-verification `INCONCLUSIVE/UNAVAILABLE` without rewriting a historical PASS.

## Extensibility and provider boundaries
Registry, SBOM generator/format, signing/KMS/HSM, transparency log, timestamp authority, attestation store, verifier and update metadata service are providers. Provider negotiation must expose a support vector rather than boolean compatibility: immutable digest behavior, tag semantics, referrers/discovery, conditional mutation/fencing, SBOM representation/completeness, attestation format, signer identity model, transparency/timestamp support, trust metadata, retention/GC, replication, offline verification and evidence export.

Provider capability discovery never confers signing, release, channel-mutation, retention-deletion or provider-admin authority.

## Governance and authority
`BuildAuthority != ArtifactAdmissionAuthority != EvidenceGenerationAuthority != SigningAuthority != VerificationAuthority != ReleaseAuthority != PromotionAuthority != DistributionAuthority != DeploymentAuthority`.

Mutable aliases/referrers fallback require expected-base/ownership fencing in addition to authorization. Enterprise policy can require signer/verifier pairs, minimum evidence completeness, anti-rollback/freshness and retention. `Enterprise -> Station -> Role -> Person` may only attenuate those requirements.

## Observability and evidence horizons
Observe semantic artifact/release IDs; digest/profile; evidence IDs/revisions; SBOM composition scope/completeness; provenance subject/material/builder; signer/verifier identity; timestamp/TSA/log evidence; trust metadata version/expiry; verification policy digest; channel expected/observed base; registry discovery method; native-vs-fallback referrers state; replication coverage; consumer observed/anti-rollback state; retention deadlines and current re-verification result.

Evidence availability and historical validity are independent. The system must say `INCONCLUSIVE` when required historical inputs have expired rather than infer PASS or FAIL.

## Portability, lock-in and qualified offline closure
Portable release closure includes immutable subject graph, evidence graph, completeness metadata, signer/verifier identifiers, trust metadata/history needed by policy, timestamp/transparency evidence, release/channel mapping, consumer/platform profile and explicit authority for allowed local operations. Offline cryptographic verification may remain possible from a self-contained Sigstore bundle; current release freshness may still be unavailable when policy requires fresh expiring metadata or trusted time.

An air-gapped Station may consume a release only within delegated closure. Reconnect requalifies trust/policy/channel/consumer state before privileged promotion or distribution continues.

## Product-specific mechanism vs universal primitive
**Product-specific:** OCI manifests/tags/referrers/fallback schema, Cosign bundle encoding, Rekor/Fulcio/TSA, TUF role files, CycloneDX/SPDX syntax, in-toto layouts/link metadata.

**Universal:** applicability-scoped release claims; typed artifact/evidence/release/channel/distribution/consumer identities; explicit evidence completeness; authenticity-vs-policy separation; verifier delegation; evidence replay horizon; anti-rollback/freshness state; expected-base fencing; ambiguous publication reconciliation; mixed provider support vector; residual cohort drainage; qualified offline closure.

## Convergent and divergent patterns
**Convergent:** immutable subject binding, independently revisioned evidence, scoped signing/verification authority, policy-qualified verification, explicit uncertainty, mutable channel aliases distinct from content identity, anti-rollback/freshness state, and fail-closed treatment of missing required proof.

**Divergent:** SBOM schema, signing identity model, transparency/TSA requirements, registry referrers behavior, channel semantics, metadata expiry policy, retention/GC and replication remain provider/policy specific.

## Subcapabilities
Artifact admission; artifact/evidence identity; evidence composition completeness; provenance and delegated verification; signing/timestamp/trust verification; release qualification; anti-rollback/freshness; mutable channel fencing; evidence discovery; registry replication/cutover; consumer uptake/drainage; historical re-verification; air-gapped release closure; delegated Station distribution administration.

## SB comparison with evidence only
A bounded fresh-main code search for `Artifact provenance SBOM release promotion digest attestation` returned no matches. This is not repository-wide absence proof and no implementation conclusion is made during Research Elicitation. Planning B remains responsible for archaeology.

## Reconciliation hypotheses
- **GENERALIZE** release qualification into applicability-scoped claims rather than global release readiness.
- **HARDEN** typed separation between artifact subject, evidence document, verification decision, release, channel, distribution and consumer-observed state.
- **HARDEN** historical signing-time evidence separately from current trust/release-policy validity.
- **HARDEN** SBOM completeness at composition/subgraph scope; unknown subcomposition propagates uncertainty.
- **GENERALIZE** verifier delegation as explicit signer/verifier/policy applicability rather than inherited trust.
- **HARDEN** anti-rollback/freshness state as consumer-relative evidence.
- **PROVIDERIZE** registry evidence discovery while requiring native/fallback semantics in provider capability negotiation.
- **HARDEN** reconcile-before-retry and expected-base fencing for publish/promotion/referrers mutation.
- **GENERALIZE** release cutover closure with residual alias/replica/cache/consumer drainage.
- **DO_NOT_BUILD** proprietary SBOM, provenance, signature or update-metadata formats where standards suffice.

## Repo-validation questions
1. Are artifact subject, evidence, release, channel and consumer-observed release state separate identities?
2. Can qualification vary by Station/platform/consumer cohort without cloning canonical release identity?
3. Can a signed timestamp preserve signing-time validity while current policy/trust still requires requalification?
4. Does incomplete/unknown nested SBOM composition propagate uncertainty?
5. Is delegated VSA verification bound to allowed signer/verifier/policy identities rather than accepted globally?
6. Is consumer anti-rollback/freshness state represented independently of mutable provider tags/channels?
7. Does registry capability negotiation model native Referrers API versus fallback-tag semantics and conditional mutation support?
8. Are ambiguous publish/promotion/referrer updates reconciled before retry?
9. Does provider cutover prove evidence discovery equivalence and residual consumer/cache/alias drainage?
10. Can offline verification distinguish cryptographic historical validity from current freshness unavailable due to expired metadata/time requirements?
11. Can Station distribution authority be delegated without signing/release/provider-admin authority?
12. Can AGWS/AI request a release operation without gaining signing/channel/canonical authority?

## Symbiotic Proof
Create one immutable artifact subject and two registry realizations: A with native OCI Referrers API and B using fallback referrers tags. Attach a CycloneDX BOM with one nested composition `unknown`, SLSA provenance, a VSA, and a Sigstore bundle with signed timestamp. Require release policy to return `INCONCLUSIVE` while the nested BOM remains unknown; replace only the evidence and prove artifact digest identity is unchanged. Rotate signing certificate/trust policy and show that signing-time validity remains explainable from timestamp evidence while current release qualification requires the new policy. Publish/promote with an intentionally lost acknowledgement and prove reconcile-before-retry. Concurrently mutate a fallback referrers tag and prove expected-base conflict instead of lost update. Replicate to B and prove equal artifact bytes are insufficient until evidence discovery, channel state and consumer cohort equivalence are established. Give a consumer newer trusted anti-rollback metadata, then present an older mutable `latest` tag and prove rejection. Finally move the complete closure offline: historical cryptographic verification succeeds; remove fresh update metadata/trusted-time prerequisite and require current release freshness to become `INCONCLUSIVE`, not implicitly trusted. Repeat through Person-level AGWS and prove the AI may prepare evidence/request promotion but cannot sign, mutate channels or broaden Station distribution authority.

## Stable findings
- **G2-FINDING-ARSP-46 — Effective Release Qualification Is Applicability-scoped Rather Than Globally Current.** Artifact profile, evidence/completeness, signer/verifier/trust, policy, channel/registry, consumer cohort, anti-rollback state, freshness and evidence horizon qualify the claim.
- **G2-FINDING-ARSP-47 — Artifact Subject, Evidence, Verification Decision, Release, Channel, Distribution and Consumer-observed State Are Distinct Typed Identities.** Success or currentness at one boundary cannot stand in for another.
- **G2-FINDING-ARSP-48 — Signing-time Validity and Current Release Trust Are Separate Temporal Claims.** Signed timestamps can preserve verifiable signing-time evidence while current trust/release policy may still require requalification.
- **G2-FINDING-ARSP-49 — SBOM Completeness Is Composition-scoped and Uncertainty Propagates.** A document can contain complete and unknown subgraphs; global presence of an SBOM cannot imply complete inventory.
- **G2-FINDING-ARSP-50 — Delegated Verification Is Trust- and Policy-qualified Evidence, Not Universal Release Authority.** VSA-style summaries require explicit accepted signer/verifier/policy applicability and may abstract unavailable raw evidence.
- **G2-FINDING-ARSP-51 — Evidence Discovery Is a Registry Capability with Distinct Concurrency and Failure Semantics.** Native OCI referrers and mutable fallback-tag discovery are not semantically identical despite equal subject bytes.
- **G2-FINDING-ARSP-52 — Release Freshness and Anti-rollback Are Consumer-relative State.** A mutable provider tag or channel cannot override stronger previously observed trusted metadata/version state.
- **G2-FINDING-ARSP-53 — Registry/Release Cutover Requires Evidence-discovery Equivalence and Residual Cohort Drainage.** Destination publication closes only after alias/referrer/replica/cache and consumer uptake/disposition obligations are resolved; offline closure must separately qualify historical verification and current freshness.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-ARSP-APPLICABILITY-SCOPED-RELEASE-QUALIFICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA applicability graph while Artifact/Release retains artifact/evidence/trust/channel/consumer dimensions.
- `G2-CAPABILITY-CANDIDATE-ARSP-ARTIFACT-TRUST-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Preserve certificate/timestamp/transparency/trust/policy/SBOM/attestation retention semantics under the shared evidence-horizon primitive.
- `G2-CAPABILITY-CANDIDATE-ARSP-MIXED-REGISTRY-SIGNING-SBOM-DISTRIBUTION-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Preserve referrers/fallback, mutation fencing, completeness, signing/trust, retention, replication, offline and consumer-state axes.
- `G2-CAPABILITY-CANDIDATE-ARSP-RELEASE-DISCOVERY-CONSUMER-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Artifact/Release owns residual alias/referrer/replica/cache/consumer closure during registry/release cutover.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct from generic low-code UI.

## Architecture proof-backfill obligations
1. Applicability-scoped release claim changes result when consumer/trust/policy scope changes without changing artifact bytes.
2. Typed artifact/evidence/release/channel/consumer identity separation.
3. Signed timestamp preserves signing-time verification while current policy changes.
4. Nested CycloneDX unknown composition produces `INCONCLUSIVE` under complete-inventory policy.
5. VSA accepted only for configured signer/verifier/policy pairing.
6. Native referrers versus fallback-tag provider semantics tested, including concurrent fallback update conflict.
7. Consumer anti-rollback state rejects older trusted metadata/channel state.
8. Ambiguous publish/promotion reconciled before retry.
9. Registry cutover proves artifact+evidence discovery equivalence and residual alias/cache/consumer drainage.
10. Offline closure distinguishes historical cryptographic verification from current freshness requirements.
11. Station distribution delegation cannot weaken enterprise signing/trust/release invariants.
12. AGWS/AI cannot self-acquire signing, promotion, release or provider-admin authority.

## Value / risk / priority / next question
**Value:** very high — makes portable release truth explicit across evidence, registry realization and consumers.
**Risk:** very high if immutable digest equality, a valid signature/VSA, mutable channel state or provider publication is mistaken for universal current release truth.
**Priority:** high.
**Saturation:** NOT SATURATED; eight material findings reset consecutive-no-material to 0.
**Next question:** Deployment / Environment / Runtime should consume a release-qualified subject without collapsing release qualification into deployment readiness, while testing runtime realization currentness, rollout/cohort drainage, rollback, provider substitution and offline autonomy.
