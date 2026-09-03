# Artifact / Release / SBOM / Provenance — Revisit 5 / Cycle 6

## Research question
How should Generation 2 preserve typed identity, completeness, trust, release authority and historical verifiability across build outputs, artifacts, SBOM/provenance/attestation evidence, signing, release promotion, mutable channels, registry replication and downstream consumer uptake without collapsing Build execution into Artifact/Release ownership?

## Representatives and evidence/source ledger
1. **SLSA v1.2 Provenance + Verification Summary Attestation (VSA)** — provenance describes where/how artifacts were produced; VSA separately binds subject, verifier, policy identity/digest, input attestations and verification result. A VSA is delegated verification evidence, not universal release truth. Sources: https://slsa.dev/spec/v1.2/provenance and https://slsa.dev/spec/v1.2/verification_summary
2. **Sigstore/Cosign + Rekor + TUF-distributed trust** — signature verification binds artifact digest plus signer identity/issuer; bundles can retain signature/certificate/timestamp/transparency material for offline verification; verification trust roots and transparency/CA material have independent lifecycle and validity intervals. Sources: https://docs.sigstore.dev/cosign/verifying/verify/ and https://docs.sigstore.dev/cosign/system_config/custom_components/
3. **OCI artifact/distribution model** — digest-addressed manifests/descriptors provide immutable content identity while tags/channels remain mutable aliases; registry publication/discovery and referrer availability are provider realization concerns rather than semantic release identity. Source family: https://github.com/opencontainers/distribution-spec and https://github.com/opencontainers/image-spec
4. **CycloneDX 1.7** — BOMs have independent document identity/version and explicitly model composition completeness as complete/incomplete/unknown; omission from a dependency graph does not safely mean dependency-free. Sources: https://cyclonedx.org/specification/overview/ , https://cyclonedx.org/use-cases/compositions-components/ , https://cyclonedx.org/use-cases/service-dependencies/
5. **Build / Dependency Graph / Reproducibility cycle-6 evidence** — Build owns definition/dependency/toolchain/environment/attempt/cache/output identities and reproducibility evidence. Artifact/Release consumes exact output/material evidence but owns artifact admission, release qualification, promotion, distribution and historical verification semantics.

## Source of truth and typed identities
The universal lineage is refined to:

`BuildOutputIdentity -> ArtifactIdentity -> ArtifactRealization(digest, media/platform/profile, provider) -> EvidenceDocumentIdentity(SBOM|Provenance|Attestation|SignatureBundle) -> EvidenceSetRevision -> VerificationDecisionRevision -> ReleaseIdentity/ReleaseRevision -> ChannelBindingRevision -> DistributionRealization -> ConsumerUptakeObservation`.

These identities must not be collapsed. A digest identifies immutable bytes/manifest content under an algorithm; an SBOM or provenance statement is independently versioned evidence about a subject; release identity is semantic/governance identity; a channel/tag is a mutable binding; a registry copy is a provider realization; consumer uptake is downstream observation.

## Multi-axis effective release qualification
Current qualification is a vector, not a scalar release version:

`Q = {artifact_digest/profile, build_output/material revision, SBOM revision+completeness, provenance/attestation revision, signer identity, trust-root/log/CA revision+validity horizon, verification policy revision, release-policy revision, channel-binding revision, registry/provider realization revision, distribution/consumer-observation revision}`.

A prior PASS is reusable only when the required axes remain compatible and fresh for the intended operation.

## Lifecycle and failure semantics
- Build success creates a candidate output; it does not admit an artifact or authorize release.
- Artifact publication may be `ATTEMPTED`, `ACKNOWLEDGED`, `OBSERVED`, `PARTIAL`, `OUTCOME_UNKNOWN` or reconciled.
- Evidence creation and evidence verification are independent transitions.
- SBOM completeness is explicit evidence. `UNKNOWN` or incomplete inventory/dependency coverage propagates uncertainty into policies that require complete coverage; absence is not proof of nonexistence.
- Authentic provenance/signature proves authenticity/integrity properties under a trust model; it does not prove semantic compatibility, policy satisfaction, deployability or business acceptance.
- Release admission, promotion to a channel, registry replication and consumer uptake remain distinct transitions.
- Mutable aliases require expected-base/ownership fencing. A stale actor must not overwrite a channel solely because it still has promotion authority.
- Timeout or acknowledgement loss during publication/promotion is `OUTCOME_UNKNOWN`; reconcile immutable subject plus alias/referrer state before retry.
- Registry/provider migration can temporarily produce multiple valid realizations. Cutover requires explicit source/target coverage and residual-distribution disposition; byte equality alone does not prove equivalent evidence discovery or consumer uptake.
- Historical verifiability has a retention/trust horizon. Losing old roots, policy, timestamp/transparency material, evidence documents or digest algorithm support can make current re-verification `INCONCLUSIVE/UNAVAILABLE` without rewriting historical truth.

## Extensibility and provider boundaries
Registries, artifact stores, signing/KMS/HSM, transparency logs, attestation stores, SBOM formats and verification engines are providers. Canonical release semantics should express typed subject/evidence/release identities, completeness, trust-policy requirements, channel transitions and distribution postconditions while adapters translate OCI tags/referrers, Sigstore bundles, CycloneDX/SPDX documents and provider APIs.

Provider discovery/capability does not confer publication, signing, promotion or distribution authority.

## Governance and authority
`BuildAuthority != ArtifactAdmissionAuthority != PublicationAuthority != EvidenceGenerationAuthority != SigningAuthority != VerificationAuthority != ReleaseAuthority != PromotionAuthority != DistributionAuthority != DeploymentAuthority`.

Expected-base ownership applies to mutable release/channel state. Station/tenant delegated administration may authorize bounded release scopes, but cannot weaken enterprise signing/trust/release invariants. AI and Adaptive Governed Work Surfaces may propose/materialize permitted metadata/evidence work but cannot acquire signing, promotion, provider-admin or distribution authority from successful generation, model confidence or available credentials.

## Observability
Expose artifact/release semantic IDs; immutable digest/profile; publication/promotion attempt IDs; expected-base and observed channel binding; evidence document IDs/revisions; SBOM composition completeness; provenance subject/material/builder identity; signer/issuer; trust-root/log/CA revision and validity interval; verification policy/digest/time/result; release decision; provider replication coverage; residual source disposition; distribution observations; consumer uptake; and historical-verification horizon.

`PARTIAL` and `INCONCLUSIVE` must be first-class. A fresh registry query does not refresh stale SBOM, policy, trust or consumer evidence.

## Portability / lock-in / offline closure
Portable release closure includes immutable artifact graph, evidence graph, completeness metadata, verification policy, trusted-root/history metadata, timestamps/transparency evidence where required, channel/release mapping, compatibility profile and authority needed for the allowed local action. Offline verification may succeed from a retained Sigstore bundle/trusted-root set; offline promotion must additionally possess explicit local promotion authority and expected-base state. Air-gapped availability must never silently broaden authority.

## Product-specific mechanisms vs universal primitives
**Product-specific:** OCI manifests/indexes/referrers/tags, Cosign bundle encoding, Rekor/Fulcio, TUF metadata, CycloneDX/SPDX schemas, provider replication APIs.

**Universal:** typed artifact/evidence/release/channel/distribution identities; evidence completeness; multi-axis qualification vector; authenticity-vs-conformance separation; trust horizon; expected-base mutable-binding fencing; ambiguity disposition; residual-distribution disposition; qualified offline closure; faceted authority.

## Convergent / divergent patterns
**Convergent:** immutable subject binding, independently revisioned evidence, trust/policy-qualified verification, explicit uncertainty, mutable aliases distinct from immutable content, provider-independent semantic release identity, and fail-closed behavior when required proof is missing.

**Divergent:** SBOM schema, transparency requirements, signing model, registry referrer behavior, tag/channel semantics, replication mechanics, revocation/yank rules and retention/GC remain provider or policy specific.

## Subcapabilities
Artifact admission; typed artifact/evidence identity; SBOM/provenance completeness; signature/trust verification; release qualification vector; publication/promotion reconciliation; mutable-channel ownership fencing; registry replication/cutover; residual distribution disposition; consumer uptake observation; historical verification; air-gapped closure; delegated release administration.

## SB comparison
No fresh-main implementation claim is made in Research Elicitation. Repository validation remains for Planning B unless a bounded question becomes necessary.

## Reconciliation hypotheses
- **GENERALIZE** typed identity across build output, artifact, evidence, release, channel and distribution realization.
- **HARDEN** release qualification as a compatible multi-axis evidence vector.
- **HARDEN** SBOM completeness/unknown semantics and dependency-material lineage.
- **GENERALIZE** authenticity/integrity evidence separately from semantic conformance and release acceptance.
- **HARDEN** mutable channel promotion with expected-base/ownership fencing.
- **HARDEN** reconcile-before-retry for publication and promotion ambiguity.
- **PROVIDERIZE** registry/signing/transparency/SBOM/attestation realization while preserving semantic release identity.
- **GENERALIZE** historical verification horizon and qualified local/offline closure.
- **DO_NOT_BUILD** proprietary SBOM/provenance/signature formats where standards suffice.

## Repo-validation questions
1. Are BuildOutput, Artifact, EvidenceDocument, Release, ChannelBinding and DistributionRealization separate typed identities?
2. Does release readiness depend on a revision vector rather than one version/tag?
3. Can incomplete/unknown SBOM composition propagate `PARTIAL/INCONCLUSIVE` instead of being treated as complete?
4. Can authentic provenance/signature pass while semantic/release policy still fails?
5. Are tag/channel mutations fenced by expected-base/ownership evidence?
6. Can publication or promotion remain `OUTCOME_UNKNOWN` and reconcile before retry?
7. Does provider migration track target equivalence plus residual source/distribution disposition?
8. Can historical verification explain an old PASS after trust/policy changes while refusing to silently reuse it as current truth?
9. Can an air-gapped Station verify a retained release without live services while promotion remains separately authorized?
10. Can AI/AGWS generate candidate evidence without gaining signing/release/promotion/distribution authority?

## Symbiotic Proof
Build one semantic artifact with two platform realizations and exact material lineage. Generate a CycloneDX BOM whose composition is initially `unknown`; require release policy needing complete inventory to report `INCONCLUSIVE`, then replace it with complete evidence and requalify. Attach provenance and a valid signature whose subject is authentic but violates a semantic release policy; cryptographic verification must pass while release qualification fails. Publish to registry A, lose acknowledgement and reconcile before retry. Promote channel `stable` from expected base X, concurrently move it to Y, and prove the stale X promotion conflicts rather than overwrites Y. Replicate artifact+evidence to registry B, retain A temporarily, prove target equivalence, then disposition residual A distribution. Rotate trust/policy and preserve explanation of the historical PASS while requiring current requalification. Finally verify fully offline from retained closure; remove one required trust/evidence/completeness dependency and require explicit `INCONCLUSIVE`. Repeat a promotion request from a Person-level AGWS and prove AI can propose/materialize but cannot sign/promote/distribute without independent authority.

## Stable findings
- **G2-FINDING-ARSP-38 — Artifact Supply-chain Identity Is Typed Across Build Output, Artifact Realization, Evidence Document, Release, Channel Binding, Distribution Realization and Consumer Uptake.** Digest, tag, SBOM ID, attestation subject and release version are not interchangeable canonical identities.
- **G2-FINDING-ARSP-39 — Effective Release Qualification Is a Multi-axis Evidence Vector Rather Than a Scalar Version or Historical PASS.** Artifact/material, evidence, trust, policy, channel, provider and distribution axes must be compatible and fresh for the intended operation.
- **G2-FINDING-ARSP-40 — SBOM Completeness Is Explicit Evidence; Missing or Unknown Inventory/Dependency Coverage Must Propagate Uncertainty.** CycloneDX composition semantics show that omission cannot safely mean absence.
- **G2-FINDING-ARSP-41 — Provenance/Signature Authenticity Does Not Establish Semantic Conformance, Deployability or Release Acceptance.** Cryptographic authenticity and policy/business qualification are distinct proofs and authorities.
- **G2-FINDING-ARSP-42 — Historical Verifiability Has an Evidence-and-trust Retention Horizon.** Loss or expiry of retained roots, policy, timestamp/transparency or evidence material can make present re-verification `INCONCLUSIVE/UNAVAILABLE` without falsifying historical decisions.
- **G2-FINDING-ARSP-43 — Mutable Release Channels Require Expected-base/Ownership Fencing in Addition to Promotion Authority.** Authorization alone cannot prevent stale actors from overwriting a newer channel binding.
- **G2-FINDING-ARSP-44 — Publication and Promotion Have Ambiguous External Outcomes and Require Reconcile-before-retry.** Lost acknowledgements cannot be resolved by blind retry against mutable aliases or provider side effects.
- **G2-FINDING-ARSP-45 — Registry Replication/Cutover Requires Target Equivalence, Residual-distribution Disposition and Consumer-uptake Evidence.** Byte-copy success does not prove evidence discoverability, alias equivalence or that consumers have left the source realization.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-ARSP-TYPED-ARTIFACT-EVIDENCE-RELEASE-DISTRIBUTION-IDENTITY-MAPPING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Specialize UCA typed identity while retaining Artifact/Release semantic ownership.
- `G2-CAPABILITY-CANDIDATE-ARSP-MULTI-AXIS-EFFECTIVE-RELEASE-QUALIFICATION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA/Lifecycle evidence vectors while retaining artifact/evidence/trust/channel axes.
- `G2-CAPABILITY-CANDIDATE-ARSP-SBOM-COMPLETENESS-UNCERTAINTY-EVIDENCE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Preserve explicit BOM completeness/unknown semantics under Artifact/Release qualification.
- `G2-CAPABILITY-CANDIDATE-ARSP-RESIDUAL-DISTRIBUTION-CONSUMER-UPTAKE-DISPOSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile provider cutover/residual-source patterns while retaining release distribution/consumer semantics.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. Typed identity separation across build output/artifact/evidence/release/channel/distribution.
2. Multi-axis qualification invalidation after one material axis changes.
3. CycloneDX incomplete/unknown composition propagating `PARTIAL/INCONCLUSIVE`.
4. Valid signature/provenance with failed semantic release policy.
5. Trust/policy rotation preserving historical explanation but requiring current requalification.
6. Stale mutable-channel promotion rejected by expected-base fencing.
7. Ambiguous publication/promotion reconciled before retry.
8. Registry A→B replication proving artifact+evidence+alias equivalence and residual-source disposition.
9. Consumer uptake remaining distinct from provider publication success.
10. Offline verification from declared closure; missing trust/evidence/completeness dependency fails closed.
11. Station/tenant scoped release administration cannot weaken enterprise release/signing policy.
12. AI/AGWS candidate generation cannot amplify signing/release/promotion/distribution authority.

## Value / risk / priority / next question
**Value:** very high — closes the semantic gap between reproducible Build output and trustworthy, portable distribution.
**Risk:** very high when mutable aliases, incomplete SBOMs, authentic-but-nonconformant attestations, stale trust or replication success are mistaken for current release truth.
**Priority:** high.
**Saturation:** NOT SATURATED; material findings reset the no-material streak to 0.
**Next question:** Deployment / Environment / Runtime should consume a qualified release while preserving release/deployment identity and authority, stress-testing desired/effective runtime realization, readiness freshness, rollout/rollback, provider substitution and local autonomy.
