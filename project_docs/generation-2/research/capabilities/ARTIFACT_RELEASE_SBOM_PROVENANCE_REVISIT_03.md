# Artifact / Release / SBOM / Provenance — Revisit 3 / Cycle 4

## Research question
How should Generation 2 distinguish semantic artifact/release identity, concrete platform realizations, mutable distribution bindings and time-qualified evidence so that release qualification remains portable across registries, multi-platform outputs, attestation/SBOM revisions, trust-root changes and offline installation without allowing build or AI/AGWS authority to become release authority?

## Representatives and evidence ledger
1. **SLSA v1.2 provenance** — provenance is verifiable information about where/how an artifact was produced; build provenance separates build definition/run details from artifact subjects. Current approved spec: https://slsa.dev/spec/v1.2/provenance
2. **OCI Image Specification** — descriptors are content-addressed by digest and verified by digest/size; image indexes aggregate multiple platform-specific manifests and may weakly associate subject/referrer artifacts. Sources: https://github.com/opencontainers/image-spec/blob/main/descriptor.md and https://github.com/opencontainers/image-spec/blob/main/image-index.md
3. **GitHub Artifact Attestations** — build provenance and SBOM are distinct predicates bound to an artifact subject digest; container attestations deliberately exclude mutable tags from the attested subject name; deletion of an attestation can make current verification fail while artifact bytes remain. Sources: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations and https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/manage-attestations
4. **Sigstore/Cosign** — signature verification is trust-context dependent; bundle format carries material needed for offline verification, including signed timestamps/attestations. Source: https://docs.sigstore.dev/cosign/verifying/verify/
5. **CycloneDX 1.7 / BOM-Link** — BOM has its own serialNumber/version identity and lifecycle; linked BOMs can refer across domains/lifecycle stages. A BOM revision is therefore distinct from the artifact revision it describes. Sources: https://cyclonedx.org/docs/1.7/xml/ and https://cyclonedx.org/capabilities/bomlink/
6. **Prior Build / Dependency Graph evidence** — qualified resolved closure, toolchain/platform and cache evidence is an input to release qualification, but Build does not own release/promotion authority.

## Source of truth and identity
The stronger universal chain is:
`SemanticArtifactRevision -> ArtifactRealization(digest, mediaType, platform/profile) -> EvidenceSetRevision(provenance, SBOM, signatures, trust context, qualification) -> ReleaseDecisionRevision -> Promotion/ChannelBindingRevision`.

A content digest identifies a concrete realization, not the business/product meaning of a release. An OCI index digest identifies an aggregate manifest graph, while each selected platform manifest has its own digest. Tags/channels are mutable bindings. SBOM/provenance documents have their own identities and revisions and must be explicitly bound to the realization(s) they describe.

## Lifecycle and versioning
- Build output creation precedes release qualification.
- Evidence can be generated, supplemented, superseded, deleted, revoked or become unverifiable without changing artifact bytes.
- A release decision is time-qualified against a specific artifact/evidence/policy/trust revision.
- Promotion changes a channel/environment binding; it does not mutate immutable artifact identity.
- Rollback is a new governed promotion/release transition to a prior qualified realization.
- Multi-platform releases require qualification coverage for the declared platform profile, not a blanket assumption that one aggregate index digest proves all child realizations equivalent.

## Failure semantics
1. Digest verification failure means concrete realization integrity failure.
2. Artifact present + missing/expired/deleted/unverifiable attestation means current qualification failure, not artifact disappearance.
3. SBOM latest-version selection alone does not prove that its subject/closure matches the artifact being released.
4. Registry copy/tag success does not prove referrer/evidence completeness, platform coverage, trust continuity or release equivalence.
5. A platform index may resolve to a child manifest not covered by required evidence; selection must fail qualification for that profile rather than inherit unrelated sibling evidence.
6. Offline installation must fail closed when required artifact graph, evidence, trust roots, verification policy or platform-resolution metadata is absent.

## Extensibility and provider boundaries
Registry, package-store, signing, attestation and SBOM stores are provider realizations. Portable definitions should express semantic artifact/release requirements and evidence predicates, not registry URLs/tags. Provider replacement is a governed transition preserving subject digests/equivalence claims, evidence/referrer graph, trust policy semantics, channel bindings and postcondition verification.

## Governance and authority
`BuildAuthority != EvidenceGenerationAuthority != EvidenceVerificationAuthority != ReleaseAuthority != PromotionAuthority != DeploymentAuthority`.

AI/AGWS may request or materialize build inputs within granted authority, but a successful build, generated attestation or available registry object cannot authorize release/promotion. Release policy may consume evidence from Build, SBOM/provenance/signing and trust providers without delegating its decision authority to them.

## Observability
Expose semantic artifact/release revision, selected realization digest, aggregate/index digest where applicable, platform/profile, evidence-set revision, SBOM serial/version + subject binding, provenance predicate/builder/materials, signature/trust-root revision, verification time/result, release decision, channel binding and provider migration checkpoint/postcondition. Observability records are evidence, not release authority.

## Portability / lock-in
Portability requires the same semantic release decision and evidence policy to be evaluable after moving bytes/evidence to another registry/store. Provider-specific referrer storage, transparency infrastructure or alias semantics may be used as realizations but cannot become constitutional identity. Offline/air-gapped operation requires transportable verification closure.

## Product-specific mechanism vs universal primitive
Product-specific: OCI descriptor/index/referrer mechanics; GitHub attestation storage; Sigstore Fulcio/Rekor/bundle implementation; CycloneDX serial/version/BOM-Link; registry tag conventions.

Universal: semantic artifact revision; concrete realization digest; platform-profile realization set; typed evidence-set revision; subject-binding/freshness/coverage qualification; release decision; promotion/channel binding; trust-context revision; governed provider migration; qualified local verification/install closure; authority attenuation.

## Convergent and divergent patterns
**Convergence:** content addressability anchors byte-level integrity; evidence is typed and subject-bound; verification/trust context matters; mutable names are not immutable identity; evidence lifecycle is independent of artifact bytes; offline verification requires a portable trust/evidence closure.

**Divergence:** multi-platform representation, attestation/referrer storage, transparency dependence, BOM format/version semantics, tag mutability, yank/revocation behavior and registry garbage collection vary by provider.

## Subcapabilities
Artifact semantic identity; realization/digest integrity; platform-profile realization set; SBOM identity/freshness/coverage; provenance/material lineage; signature/trust verification; evidence lifecycle; release qualification; promotion/channel binding; registry/provider migration; rollback/yank/revocation; offline verification/install closure; release authority attenuation.

## SB comparison
No repository-wide implementation claim is made in this research pass. Fresh-main archaeology remains deferred to Planning B unless a targeted repository-validation question becomes necessary sooner.

## Reconciliation hypotheses
- **GENERALIZE** semantic artifact/release identity above digest/registry realization.
- **HARDEN** Build→Artifact handoff with explicit resolved-closure/toolchain/platform evidence lineage.
- **GENERALIZE** evidence qualification around subject, revision, profile, freshness, coverage, trust and verification result.
- **HARDEN** multi-platform release qualification per declared platform/profile.
- **PROVIDERIZE** registry, attestation, signing and SBOM stores.
- **GENERALIZE** provider migration as shared governed transition with validation/checkpoint/postcondition evidence.
- **GENERALIZE** qualified local verification/install closure for air-gapped autonomy.
- **DO_NOT_BUILD** proprietary SBOM/provenance/signature formats where standards suffice.

## Repo-validation questions
1. Does fresh main distinguish semantic artifact/release revision from digest, tag/channel and platform realization?
2. Can evidence-set qualification express subject/profile/freshness/coverage/trust without provider-specific fields?
3. Are SBOM document revision and the artifact/build closure it describes separately identifiable?
4. Can multi-platform output prove qualification per selected platform and aggregate release profile?
5. Are Build, evidence generation/verification, release, promotion and deployment authorities separable?
6. Can registry/provider replacement preserve referrers/evidence and prove postconditions rather than only copy bytes/tags?
7. Is an offline generated runtime installable/verifiable with artifact graph, trust and policy closure independent of Builder/SaaS availability?
8. Can AI/AGWS-generated changes ever cause release merely because build/evidence generation succeeded?

## Symbiotic Proof
Build one semantic release with at least two platform realizations; preserve Build closure evidence; generate distinct provenance and SBOM evidence revisions bound to exact subjects; qualify the declared platform profile; publish through registry A; move/mirror artifact graph + evidence to registry B under a governed transition; verify equivalent qualification and channel semantics; delete or revoke one evidence source and demonstrate current verification failure without pretending artifact bytes disappeared; roll back by a new promotion decision to a prior qualified release; verify/install the selected platform fully offline; and prove an AI/AGWS-generated change cannot cross the release boundary without independent release authority.

## Stable findings
- **G2-FINDING-ARSP-23 — Semantic Release Revision, Concrete Artifact Realization, Platform Selection and Mutable Channel Binding Are Distinct Identities.** Digest proves concrete content identity; aggregate index digest and child platform digests are separate realization levels; tags/channels remain mutable bindings.
- **G2-FINDING-ARSP-24 — SBOM Identity/Version/Freshness Is Independent of Artifact Identity and Must Be Qualified Against the Exact Subject and Resolved Closure.** A newer BOM document is not automatically better evidence for an older/different artifact; serial/version and subject/closure binding must remain explicit.
- **G2-FINDING-ARSP-25 — Multi-platform Release Qualification Is Profile-Coverage Evidence, Not a Blanket Property Inherited from One Index Digest.** Every platform realization selected by the declared release profile requires appropriate subject-bound qualification or an explicit equivalence rule.
- **G2-FINDING-ARSP-26 — Artifact Bytes, Evidence Availability, Evidence Trust/Revocation and Historical Release Qualification Have Independent Lifecycles.** Deleting an attestation or changing trust can invalidate current verification while immutable bytes and historical decisions remain explainable.
- **G2-FINDING-ARSP-27 — Registry/Artifact Provider Replacement Is a Governed Migration Over Artifact Graph + Evidence Graph + Bindings, Not a Successful Copy/Tag Operation.** Validation, checkpoint, trust continuity and per-profile postconditions are required.
- **G2-FINDING-ARSP-28 — Qualified Local/Offline Artifact Verification and Installation Require Closure of Artifact Graph, Evidence Predicates, Trust Roots, Verification Policy and Platform-resolution Metadata.** Live dependence on a single registry/attestation SaaS violates autonomous-runtime portability for profiles that claim offline operation.
- **G2-FINDING-ARSP-29 — AI/AGWS Build or Evidence Materialization Is Authority-Attenuating Across the Release Boundary.** Successful build, generated SBOM/provenance/signature or registry publication cannot imply release/promotion authority; escalation remains explicit.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-ARTIFACT-RELEASE-EVIDENCE-SET` — **CROSS_CUTTING / MERGE_TARGET** into unified realization/evidence qualification if Observability/Governance confirm subject/profile/freshness/trust semantics.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-REGISTRY-RELEASE-PROMOTION-MIGRATION-TRANSITION` — **CROSS_CUTTING / MERGE_TARGET** into shared governed migration transition if Deployment/Lifecycle confirm.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-ARTIFACT-VERIFICATION-INSTALL-CLOSURE` — **CROSS_CUTTING / MERGE_TARGET** into qualified local closure profile if Security/Self-hosting confirm trust/install semantics.

No candidate is promoted in this pass.

## Value / risk / priority / next question
**Value:** high — this boundary is central to portable releases, supply-chain assurance, multi-platform correctness and runtime autonomy.
**Risk:** high if tags/indexes, latest SBOMs or provider-hosted attestations become canonical truth, or if build/AI authority leaks into release.
**Priority:** high.
**Next question:** Deployment / Environment / Runtime should test how a qualified multi-platform release becomes environment/runtime realization with rollout/rollback, observed-state evidence, provider replacement and offline autonomy without collapsing release authority into deployment authority.
