# Artifact / Release / SBOM / Provenance — Revisit 01

## Research question
Which identities, lifecycle boundaries, verification evidence and provider-neutral primitives let Generation 2 distinguish produced artifacts, releases, SBOMs and provenance without giving this capability authority over build execution or deployment?

## Representatives and evidence/source ledger
1. **SLSA / in-toto attestation model** — provenance binds `subject` artifacts by digest; downstream verification separately checks envelope/schema/platform/subject and policy. Source of truth for a provenance statement is the signed attestation, not a release label.
2. **Sigstore / Cosign / Rekor** — verification bundles carry signature/certificate/timestamp/transparency evidence; Rekor provides append-only inclusion evidence; trust roots and log keys rotate independently of artifact identity.
3. **CycloneDX** — BOM identity is `serialNumber + version`; BOM-Link can reference a BOM revision or contained component. Integrity hashes and signatures are separate evidence.
4. **SPDX** — package/artifact content identifiers and independently reproducible verification codes bind inventory evidence to concrete content; SBOM document identity is not artifact identity.
5. **OCI content-addressed artifact model** — digest-addressed manifests/indexes separate immutable content identity from mutable distribution references/tags and support multi-artifact composition.

## Source of truth, identity and lifecycle
The semantic artifact is identified by immutable content identity (normally cryptographic digest plus media/type context). A build output is a realization that may become an artifact; a **release** is a governed composition/promotion decision over one or more immutable artifacts; an **SBOM** is revisioned evidence describing a subject; and **provenance** is an attestation whose subject binds to artifact digest(s). These identities must not collapse.

Lifecycle: build realization -> artifact admission -> evidence generation/attachment -> release composition/approval -> publication/promotion -> verification/consumption -> retention/deprecation. Publication and deployment are downstream operations, not release identity.

## Versioning and failure semantics
Artifact bytes are content-versioned; release identity/revision can change composition or policy metadata without changing constituent bytes. CycloneDX explicitly revisions a BOM independently through serial number/version. Verification failure must identify which layer failed: subject digest, signature, trust root, transparency inclusion, SBOM subject/completeness, release composition, or policy. A registry upload succeeding does not prove release approval, provenance validity or deployability.

## Extensibility and provider boundaries
Provider-specific mechanisms include registry tags/referrers, transparency services, signing KMS/HSM, SBOM generators and release registries. Universal primitives are immutable subject identity, evidence envelope, evidence revision, verification result, trust context revision, release composition, promotion decision and retention reference. Provider replacement must preserve semantic artifact/release identity while generating new distribution and verification lineage where trust/storage boundaries change.

## Governance, observability, portability and lock-in
Release authority is a governed decision distinct from artifact publication. Observability should expose evidence subject, verifier/policy revision, trust-root revision, verification time, release composition and publication/promotion outcomes. Portability requires digest-addressable artifacts plus exportable evidence sufficient for offline/later verification. Mutable tags, registry-native release objects, hosted-only transparency lookups or inaccessible signing history are lock-in risks.

## Product-specific mechanisms vs universal primitives
Product-specific: OCI registry APIs, Cosign/Rekor wire formats, CycloneDX/SPDX serialization, GitHub release/attestation APIs. Universal: ArtifactIdentity, ReleaseComposition, EvidenceSubject, AttestationRevision, VerificationResult, TrustContextRevision, SBOMRevision, PromotionDecision, EvidenceRetentionBundle.

## Convergent/divergent patterns
Convergent: cryptographic subject binding; evidence has its own lifecycle; verification is policy/trust-context dependent; release/promotion is governance above immutable artifacts. Divergent: SBOM document identity models, transparency requirements, registry attachment mechanisms, signature identity schemes and completeness guarantees.

## Subcapabilities
Artifact admission/identity; release composition; SBOM inventory evidence; provenance/attestation; signing/trust; transparency; verification/policy; evidence retention/offline verification; publication/promotion linkage; provider replacement lineage.

## Comparison with System Builder
Deferred to repository-validation phase unless fresh-main evidence is required. This revisit makes no claim from the research branch about product implementation.

## Reconciliation hypotheses
- **KEEP** immutable artifact/content identity where already present.
- **HARDEN** release authority and verification-result evidence as separate identities.
- **GENERALIZE** subject-bound evidence envelopes and trust-context revision.
- **PROVIDERIZE** registry, signer, transparency and SBOM generator mechanisms.
- **INTEGRATE** build realization evidence by reference rather than transferring build authority.
- **DEFER** concrete registry/signing-provider selection.
- **DO_NOT_BUILD** a proprietary SBOM/provenance standard when interoperable standards suffice.

## Repo-validation questions
Does fresh main distinguish artifact digest, build realization, release/promotion and publication? Are attestations subject-bound and verifier/trust-context revisioned? Can evidence survive registry/provider replacement and offline verification? Are multi-artifact releases represented atomically? Is SBOM completeness/freshness explicit rather than implied by existence?

## Symbiotic Proof
A native and an external artifact/signing/registry path should admit the same immutable artifact identity, attach independently revisioned SBOM/provenance, verify under explicit trust/policy revisions, compose the artifact into a release, replace the provider without changing semantic artifact identity, and prove the new publication/verification lineage without requiring the System Builder at generated-runtime execution time.

## Stable findings
- **G2-FINDING-ARSP-11 — Artifact, Build Realization and Release Are Distinct Identities.** Digest-identical artifact content can arise from different build realizations and participate in different governed releases.
- **G2-FINDING-ARSP-12 — Attestation Existence and Verification Result Are Distinct Evidence.** A signed/stored attestation is not accepted evidence until subject, signature, schema, trust context and policy are verified.
- **G2-FINDING-ARSP-13 — SBOM Identity, Subject Identity and Completeness/Freshness Are Independent Claims.** A revisioned BOM may describe the same artifact while inventory quality or observation time changes.
- **G2-FINDING-ARSP-14 — Release Authority Is Separate from Publication and Promotion Transport.** Registry publication or environment promotion cannot itself prove approval of release composition.
- **G2-FINDING-ARSP-15 — Long-lived Verification Requires Retained Trust-context Evidence, Not Only a Signature.** Short-lived certificates, transparency timestamps and rotating trust roots require verification material sufficient to reconstruct validity later/offline.
- **G2-FINDING-ARSP-16 — Provider Replacement Preserves Semantic Artifact/Release Identity but Creates New Distribution/Trust Lineage.** Moving registry, signer or transparency provider requires re-proving availability and trust without redefining immutable content.

## Candidates
- `G2-CAPABILITY-CANDIDATE-ATTESTATION-VERIFICATION-RESULT-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-EVIDENCE-TRUST-CONTEXT-REVISION` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-RELEASE-COMPOSITION-PROMOTION-EVIDENCE` — CROSS_CUTTING.

## Value / risk / priority / next question
Value: high; these boundaries prevent provenance theater and registry lock-in. Risk: high if release, publication and deployment identities collapse. Priority: high for synthesis and acceptance. Next question: Deployment / Environment / Runtime must test whether promotion/deployment consumes release evidence by reference while maintaining its own attempt/result lineage.

Revisit result: **MATERIAL_NEW_FINDINGS**. `consecutive_no_material_finding = 0`; **NOT SATURATED**.