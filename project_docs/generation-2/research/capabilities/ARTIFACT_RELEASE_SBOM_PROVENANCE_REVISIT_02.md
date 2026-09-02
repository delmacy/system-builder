# Artifact / Release / SBOM / Provenance — Revisit 2 / Cycle 3

## Research question
What universal primitives let System Builder carry verified build closure into immutable artifact identity, SBOM/provenance, governed release/promotion and offline verification without coupling portable definitions to a registry or allowing build/AGWS authority to become publication authority?

## Representatives and evidence ledger
1. **SLSA Build Provenance v1.2-rc2** — provenance distinguishes subject/output from build definition and run details; builder identity and execution metadata are evidence about a particular build invocation. Source of truth: SLSA specification.
2. **in-toto / DSSE attestation model as surfaced by SLSA/GitHub attestations** — attestations bind predicates to artifact subjects identified by digest; predicate type is semantically meaningful and independently verifiable.
3. **Sigstore/Cosign** — signatures bind artifact digests; verification also validates signer identity/trust material. Bundles can carry signature, certificate/timestamps and transparency-log evidence and support offline verification. Source of truth: Sigstore docs.
4. **GitHub Artifact Attestations** — provenance and SBOM attestations are distinct predicates attached to artifact subjects; container attestation uses subject digest and explicitly excludes mutable tag from subject name. Verification is required for security value; deletion of an attestation can make a verification policy reject an otherwise retained artifact. Source of truth: GitHub Docs.
5. **OCI image/distribution model** — digest-addressed manifests/artifacts coexist with mutable names/tags and multi-platform indexes; useful as realization evidence, not universal semantic release identity.
6. **CycloneDX/SPDX ecosystem** — SBOM is a revisioned evidence document describing a subject/closure, not the artifact itself and not proof that the artifact is secure.

## Source of truth / identity
Universal identity chain should distinguish:
`SemanticArtifact -> ArtifactRealization(digest, media/profile/platform) -> EvidenceSet(SBOM, provenance, signatures/attestations) -> ReleaseDecision -> Promotion/ChannelBinding`.
A registry tag, package version label or release channel is an alias/binding, not immutable artifact identity. Digest is realization identity evidence; semantic artifact identity remains portable across registries and equivalent realizations.

## Lifecycle and versioning
Build completion may create an artifact realization but does not authorize release. Evidence generation can occur after build and can be revised/re-attested without changing artifact bytes. Release is a separately authorized decision over a qualified artifact/evidence set. Promotion binds an already qualified artifact/release to an environment/channel; rollback normally means a new promotion/release decision pointing to a prior qualified artifact, not erasing history.

## Failure semantics
- Artifact bytes may exist while required SBOM/provenance/signature evidence is absent or unverifiable: artifact is present but not qualified.
- Attestation verification failure, signer/trust-root mismatch, missing offline verification material, incomplete SBOM closure or digest mismatch must fail qualification rather than silently downgrade.
- Registry publication success does not prove release approval, deployment, or consumer verification.
- Revocation/yank/deletion are separate states: deleting an alias or attestation does not prove artifact destruction.

## Extensibility and provider boundaries
Registry/package-store/signing/attestation providers implement realization and evidence transport. Portable definitions reference semantic artifact/release requirements, not registry URLs or provider-specific tags. Provider replacement must preserve digest/equivalence identity, evidence verification semantics, release lineage and policy outcomes.

## Governance
`BuildAuthority != AttestationAuthority != ReleaseAuthority != PromotionAuthority != DeploymentAuthority`. These may be held by the same actor under policy but are distinct semantic authorities. Signing keys and trust roots are consumed here as trust references; secret/key custody remains owned by Secrets/Configuration. Revocation and approval evidence must be append-only/auditable enough to explain why an artifact was or was not releasable at a given revision.

## Observability
Evidence should expose artifact digest/equivalence profile, build/provenance revision, SBOM revision/completeness status, signer/trust-root revision, release decision, promotion/channel binding, verification outcome and failure reason. Observability records do not become the authority source for release state.

## Portability / lock-in
A release remains portable when its semantic identity and qualification policy survive registry/provider replacement. Offline/air-gapped verification requires transporting the artifact plus sufficient provenance/SBOM/signature/trust evidence; a verification design that requires live access to one SaaS registry is not fully portable.

## Product-specific mechanism vs universal primitive
Product-specific: OCI tags/indexes, GitHub attestation storage, Sigstore Rekor/Fulcio, registry promotion conventions, package-manager yanks.
Universal: immutable realization identity; semantic artifact identity; typed evidence/attestation; verified dependency-closure handoff; qualification policy; distinct release/promotion decision; trust-reference revision; channel binding; revocation/yank state; offline verification bundle; equivalence profile.

## Convergent/divergent patterns
Convergence: content digests anchor artifact evidence; provenance and SBOM are typed claims about a subject; verification matters more than mere attestation generation; mutable aliases must not substitute for digest identity; signing/trust is policy-bound.
Divergence: registry tag mutability, SBOM format/completeness, transparency-log dependence, keyless versus key-based signing, multi-platform representation and revocation/yank semantics vary by provider.

## Subcapabilities
Artifact identity/realization; SBOM evidence; provenance/attestation; signing/trust verification; release qualification/approval; promotion/channel binding; multi-platform/equivalent realization; revocation/yank/retention; offline verification; provider/registry migration.

## SB comparison
No repository-wide absence claim is made in this pass. Fresh-main archaeology is deferred unless a targeted comparison becomes necessary; research branch is not product truth.

## Reconciliation hypotheses
- **GENERALIZE** semantic artifact identity above registry/package realization.
- **HARDEN** build-to-artifact handoff with verified closure/content-integrity evidence.
- **GENERALIZE** typed evidence set with explicit subject/predicate/revision.
- **HARDEN** release/promotion as separately authorized decisions.
- **PROVIDERIZE** registries, signing/attestation stores and publication channels.
- **INTEGRATE** SBOM/provenance/signature verification into qualification without making any one provider constitutional.
- **DO_NOT_BUILD** a proprietary SBOM/signature format when standards suffice.

## Repo-validation questions
1. Does main distinguish build output identity from release identity and publication aliases?
2. Can a release policy consume SBOM/provenance/signature evidence without provider-specific fields in portable definitions?
3. Are build, release, promotion and deployment authorities separable?
4. Is provider replacement testable while retaining digest/equivalence and evidence semantics?
5. Can generated-runtime artifacts be verified offline with all required trust material?
6. Can AGWS/UI changes ever trigger publication merely because they are allowed to change generated dependencies?

## Symbiotic Proof
Given the same semantic artifact requirement, build two qualified realizations under an explicit equivalence profile; produce typed provenance + SBOM evidence; publish one through provider A; verify it offline; mirror/promote through provider B without changing portable definition; demonstrate that mutable tag movement does not alter immutable realization identity; revoke/yank one release binding without pretending artifact bytes were destroyed; and prove an AGWS-generated change with build authority cannot publish/release until a separate release decision succeeds.

## Stable findings
- **G2-FINDING-ARSP-17 — Semantic Artifact Identity, Immutable Realization Digest and Mutable Release Alias Are Distinct.** Tags/versions/channels are bindings; digest identifies concrete bytes/manifest; semantic artifact identity survives provider migration.
- **G2-FINDING-ARSP-18 — Verified Build Closure Must Become Explicit Artifact Qualification Evidence, Not Be Reconstructed from an SBOM After the Fact.** SBOM is evidence about a subject; dependency closure/content-integrity evidence from Build must be handed forward with lineage.
- **G2-FINDING-ARSP-19 — Attestation Security Depends on Typed Subject/Predicate Verification and Trust Context, Not on Attestation Presence.** Provenance, SBOM and release predicates are distinct claims; signer/trust-root and verification outcome are part of qualification evidence.
- **G2-FINDING-ARSP-20 — Build, Attestation, Release, Promotion and Deployment Authorities Are Semantically Distinct and Must Not Amplify One Another.** Successful build or publication cannot silently imply release approval; AGWS/build authority cannot become publish authority.
- **G2-FINDING-ARSP-21 — Offline/Air-gapped Artifact Verification Requires a Portable Verification Evidence Closure.** Artifact bytes alone are insufficient; required attestations, signatures/certificates/timestamps and trust material/revisions must be transportable and policy-verifiable without provider availability.
- **G2-FINDING-ARSP-22 — Rollback, Yank, Revocation and Artifact Destruction Are Different Lifecycle Operations.** Rollback/promotion to a prior artifact is a new governed decision; removing aliases/attestations or revoking trust does not prove deletion of immutable bytes.

## Value / risk / priority / next question
Value: critical supply-chain portability and governed release boundary. Risk: high if mutable aliases/provider attestations become canonical identity or if build authority leaks into release. Priority: high. Next question belongs to Deployment / Environment / Runtime: how a qualified release is realized into an environment while preserving runtime autonomy, revision/evidence lineage, rollback and provider replacement.
