# Artifact / Release / SBOM / Provenance — Revisit 4 / Cycle 5

## Research question
How should Generation 2 qualify an artifact for release, promotion, distribution, rollback and offline use when immutable content, multi-platform realization, SBOM/provenance/signature evidence, trust roots, policy, mutable channels and provider publication all evolve independently — while consuming Build evidence without allowing Build, AI or AGWS authority to become release/signing/promotion authority?

## Representatives and evidence/source ledger
1. **SLSA v1.2 Build + Verification Summary Attestation (VSA)** — provenance is produced by the build platform and binds subjects; VSA separately records verifier, exact policy identity/digest, input attestations and PASSED/FAILED result. Sources: https://slsa.dev/spec/v1.2/build-requirements and https://slsa.dev/spec/v1.2/verification_summary
2. **Sigstore/Cosign + Rekor + TUF trust distribution** — signature verification binds artifact digest, signer identity/issuer and trust material; bundles can carry certificate/signature/timestamp/transparency evidence for offline verification; trust roots themselves are distributed/updated through TUF. Sources: https://docs.sigstore.dev/cosign/verifying/verify/ , https://docs.sigstore.dev/about/bundle/ , https://docs.sigstore.dev/cosign/system_config/custom_components/
3. **in-toto attestations via Sigstore** — signed attestation existence is distinct from predicate-policy validation; verification can validate attestation predicates against policy and systems should fail closed when required evidence is absent. Source: https://docs.sigstore.dev/cosign/verifying/attestation/
4. **OCI image/registry model** — prior cycle evidence remains authoritative: descriptors/indexes are digest-addressed while tags/channels are mutable bindings; aggregate indexes and selected platform manifests have distinct identities. Source: https://github.com/opencontainers/image-spec
5. **CycloneDX / SPDX SBOM standards** — prior evidence remains authoritative that BOM documents have their own identity/version and describe artifact/component sets rather than becoming artifact identity. Sources: https://cyclonedx.org/docs/1.7/xml/ and https://spdx.dev/
6. **The Update Framework (TUF)** — consumed through Sigstore trust bootstrap/update evidence: release verification depends on a revisioned trust-distribution closure rather than a timeless signing key.
7. **Build / Dependency Graph / Reproducibility cycle-5 evidence** — Build owns definition/closure/graph/environment/toolchain/runner/cache/attempt/output identities and reproducibility profile; Artifact/Release consumes these as qualification inputs but owns release/promotion/distribution semantics.

## Source of truth, identity and universal lineage
The stronger lineage is:

`SemanticArtifactRevision -> BuildOutputRealization(digest, platform/profile) -> PublicationAttempt -> PublishedArtifactRealization -> EvidenceSetRevision(SBOM, provenance, signatures, transparency, trust) -> VerificationDecisionRevision(policy, trust, time) -> ReleaseDecisionRevision -> Promotion/ChannelBindingRevision -> DistributionObservation -> DeploymentConsumptionEvidence`.

No single `release version` safely substitutes for these identities. Content digest anchors concrete bytes; an OCI index anchors an aggregate graph; release identity is semantic; evidence documents have independent revisions; verification is a decision under explicit policy/trust/time; channel/tag is a mutable binding; deployment is downstream consumption, not release truth.

## Lifecycle and versioning
- Build completion creates candidate output, not a release.
- Publication can be attempted, acknowledged, observed, reconciled or remain ambiguous.
- SBOM/provenance/signature/transparency evidence may be added, superseded, revoked, deleted or become unverifiable without changing artifact bytes.
- Verification decisions are revision/time/policy/trust qualified; an old PASS is not timeless.
- Release qualification is distinct from promotion; promotion is distinct from distribution; distribution is distinct from deployment.
- Rollback eligibility is a current predicate over retained artifact/evidence/trust/compatibility closure, not a historical fact implied by an old release.
- Multi-platform/index release qualification is coverage over the declared platform profile and child realization set.

## Failure semantics
1. **Ambiguous publication:** timeout/lost acknowledgement after registry publication yields `OUTCOME_UNKNOWN`; retry must reconcile digest/referrer/channel state before duplicate publication or mutable-tag mutation.
2. **Partial publication:** artifact bytes may exist while SBOM/provenance/signature/referrer graph is missing or incomplete. Result is `PARTIAL`, not release-ready.
3. **Evidence exists but is not verified:** a signed attestation can exist while subject, signer, predicate, trust or policy verification fails.
4. **Verification was once valid but is now stale/inapplicable:** trust-root/key/policy/evidence revision changes invalidate reuse of an old qualification unless its historical verification context remains explicitly acceptable.
5. **Mutable alias drift:** tag/channel may move after qualification. Consumers must resolve and compare digest/release binding, not infer identity from alias.
6. **Multi-platform gap:** aggregate index can be present while one selected child lacks required evidence. Qualification is `PARTIAL`/failed for that profile.
7. **Rollback closure missing:** prior bytes without compatible evidence/trust/config/schema/runtime prerequisites do not prove rollback eligibility.
8. **Offline closure incomplete:** artifact bytes alone are insufficient when verification requires absent trust roots, policy, attestations, platform-resolution metadata or retained compatibility evidence.

## Extensibility and provider boundaries
Registries, artifact stores, SBOM stores, attestation stores, transparency logs, signing services and KMS/HSM implementations are providers. Portable release semantics must express subject digests, platform/profile coverage, evidence predicates, trust-policy requirements, promotion constraints and rollback prerequisites without making provider URL/tag/referrer mechanics canonical.

Provider replacement must preserve or explicitly re-issue/re-verify the artifact graph, evidence graph, trust context and channel semantics. Byte-copy success is insufficient.

## Governance and authority
`BuildAuthority != ArtifactPublicationAuthority != EvidenceGenerationAuthority != SigningAuthority != EvidenceVerificationAuthority != ReleaseAuthority != PromotionAuthority != DistributionAuthority != DeploymentAuthority`.

Signing is not approval. Verification is not release authority. Release approval is not promotion authority. Provider capability is not authority. AI may propose/materialize permitted metadata or evidence generation, but cannot acquire signing/release/promotion authority from model confidence, successful build, available credentials or registry reachability. AGWS remains attenuated by `Enterprise -> Station -> Role -> Person`; a work surface may request/observe a release action only within delegated authority and cannot remove institutional approval/signing requirements.

## Observability and evidence qualification
Expose semantic artifact/release revision, build-output digest/profile, publication attempt ID/status, registry/provider realization, evidence-set revision and completeness, SBOM identity/subject coverage, provenance predicate/builder/materials, signature identity, trust-root revision, transparency inclusion evidence, verification policy revision/digest, verification time/result, release decision, channel binding, distribution observation and rollback-eligibility assessment.

Observation freshness is dependency-qualified: a recent registry lookup does not refresh stale trust/policy/SBOM/provenance evidence.

## Portability / lock-in / local closure
A portable release remains semantically identifiable and independently verifiable after moving providers. Sigstore bundles demonstrate that signature/certificate/timestamp/transparency evidence can be packaged for offline verification, while its TUF integration demonstrates that trust material has its own lifecycle. Local/air-gapped closure must therefore retain artifact graph + evidence graph + verification policy + trust roots/history + platform-resolution metadata + compatibility/rollback prerequisites declared by the profile.

## Product-specific mechanisms vs universal primitives
**Product-specific:** OCI descriptors/indexes/referrers/tags; Rekor/Fulcio; Cosign bundle layout; TUF metadata roles; CycloneDX/SPDX schemas; registry-specific copy/GC APIs.

**Universal:** semantic artifact/release identity; immutable realization digest; publication attempt/outcome; evidence-set revision/completeness; subject/profile binding; trust-context revision; policy-qualified verification decision; release decision; promotion/channel binding; distribution observation; rollback-eligibility evidence; provider migration; qualified local release closure; faceted authority.

## Convergent / divergent patterns
**Convergent:** digest-bound subjects; evidence and artifact lifecycles are distinct; trust/policy context is material to verification; mutable names are not immutable identity; verification is separable from evidence existence; offline assurance requires portable evidence/trust closure.

**Divergent:** transparency-log dependence, signature/key models, SBOM schemas, referrer storage, multi-platform aggregation, tag semantics, revocation/yank behavior and garbage collection remain provider-specific.

## Subcapabilities
Artifact semantic identity; output/publication realization; multi-platform release set; publication reconciliation; SBOM/provenance identity and coverage; signature/trust/transparency; evidence verification; release qualification; promotion/channel binding; distribution observation; rollback eligibility; provider migration; local/offline verification closure; authority attenuation.

## SB comparison
No repository-wide implementation claim is made. Fresh-main archaeology remains reserved for Planning B unless a bounded validation question becomes necessary. Research-branch documents are not treated as product truth.

## Reconciliation hypotheses
- **GENERALIZE** release lineage into distinct candidate/publication/evidence/verification/release/promotion/distribution states.
- **HARDEN** Build→Artifact handoff with revision-bound Build output/reproducibility evidence.
- **GENERALIZE** verification decisions as policy/trust/time-qualified evidence, not a boolean property on artifact.
- **HARDEN** partial/ambiguous publication reconciliation before mutable alias mutation or release.
- **HARDEN** multi-platform evidence coverage and rollback eligibility.
- **PROVIDERIZE** registry, signing, transparency, SBOM and attestation storage/services.
- **GENERALIZE** qualified local/offline release closure while preserving Artifact-specific trust/evidence requirements.
- **DO_NOT_BUILD** proprietary SBOM/provenance/signature standards where established formats satisfy requirements.

## Repo-validation questions
1. Does fresh main distinguish build output, artifact publication, release, promotion, distribution and deployment identities?
2. Can a publication attempt remain OUTCOME_UNKNOWN/PARTIAL without fabricating release success?
3. Is verification revision-bound to exact subject, policy, trust roots, evidence set and time?
4. Can one release express multi-platform child coverage and refuse qualification for an uncovered selected child?
5. Are signing, verification, release, promotion and deployment authorities independently enforceable?
6. Can mutable tags/channels be reconciled against immutable digest/release bindings?
7. Can provider replacement preserve artifact/evidence graph and prove equivalence after migration?
8. Is rollback eligibility recomputed from retained artifact/evidence/trust/compatibility closure?
9. Can an autonomous air-gapped runtime verify/install a release without live Builder/registry/transparency dependencies when its declared profile promises that capability?
10. Can AI/AGWS propose a release change without acquiring signing/release/promotion authority?

## Symbiotic Proof
Produce one semantic release from a qualified Build output with two platform realizations. Publish to registry A while injecting an acknowledgement-loss case and require reconciliation before retry. Generate separate SBOM, provenance and signature/transparency evidence bound to exact subjects; verify under policy/trust revision P1; rotate trust/policy to P2 and prove the historical P1 decision remains explainable but is not silently reused as a current P2 PASS. Move artifact + evidence graph to registry B and re-prove equivalence. Move a mutable channel and detect alias drift. Remove one platform child evidence set and require PARTIAL/failed profile qualification. Recompute rollback eligibility after deleting one retained prerequisite. Verify/install fully offline from declared closure. Finally, issue the same release request from a Person AGWS surface and prove AI can propose/materialize allowed evidence work but cannot sign, approve, promote or deploy without independent authority.

## Stable findings
- **G2-FINDING-ARSP-30 — Artifact Publication Attempt, Published Realization, Evidence Verification, Release Decision, Promotion, Distribution and Deployment Are Distinct Revision-bound States.** Existence of bytes or registry acknowledgement cannot collapse downstream governance states.
- **G2-FINDING-ARSP-31 — Evidence Existence Is Not Verification; Verification Is a Policy-, Trust-, Subject- and Time-qualified Decision.** SLSA VSA and Sigstore verification make verifier/policy/trust/subject context explicit; an attestation or signature alone is insufficient.
- **G2-FINDING-ARSP-32 — Artifact Publication Can Be PARTIAL or OUTCOME_UNKNOWN and Must Be Reconciled Before Retry, Alias Mutation or Release Qualification.** Artifact bytes, evidence/referrers and mutable channel bindings can diverge under partial failure or lost acknowledgement.
- **G2-FINDING-ARSP-33 — Release Qualification Freshness Is Dependency-qualified Across Evidence, Policy and Trust Revisions.** A fresh artifact observation does not refresh stale/revoked signing trust, SBOM/provenance coverage or verification policy.
- **G2-FINDING-ARSP-34 — Multi-platform Release Identity Requires Explicit Child-realization and Evidence Coverage; Aggregate Index Presence Does Not Prove Profile Completeness.** Qualification must cover every realization selected by the declared profile or explicitly report PARTIAL.
- **G2-FINDING-ARSP-35 — Rollback Eligibility Is a Current Evidence Predicate Over Retained Artifact, Trust, Policy and Compatibility Closure, Not a Historical Property of a Prior Release.** Old release success cannot guarantee present rollback safety.
- **G2-FINDING-ARSP-36 — Registry/Signing/Attestation Provider Replacement Must Preserve or Re-establish Artifact + Evidence + Trust Semantics, Not Merely Copy Bytes.** Migration postconditions include subject binding, verification equivalence and channel semantics.
- **G2-FINDING-ARSP-37 — Build, Publication, Signing, Verification, Release, Promotion, Distribution, Deployment and AGWS/AI Authorities Are Non-amplifying Facets.** Successful build/evidence/signature creation or provider support never grants the next authority facet.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-ARSP-POLICY-TRUST-QUALIFIED-VERIFICATION-DECISION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with shared evidence qualification while retaining Artifact ownership of release subject/profile semantics.
- `G2-CAPABILITY-CANDIDATE-ARSP-PARTIAL-AMBIGUOUS-PUBLICATION-RECONCILIATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with universal ambiguous-outcome disposition while retaining registry publication identity.
- `G2-CAPABILITY-CANDIDATE-ARSP-ROLLBACK-ELIGIBILITY-CLOSURE-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Lifecycle/Security retained-material and recovery semantics; release rollback remains a promotion transition, not state restore.
- `G2-CAPABILITY-CANDIDATE-ARSP-QUALIFIED-LOCAL-RELEASE-VERIFICATION-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge into qualified-local closure profile while retaining artifact/evidence/trust graph requirements.

No candidate is promoted in this pass.

## Architecture proof-backfill obligations
1. **State-separation proof:** bytes exist but evidence verification/release/promotion do not; each state remains independently observable.
2. **Evidence-vs-verification adversarial proof:** provide a correctly signed attestation whose predicate/subject/policy is unacceptable; signature verification may pass while release verification fails.
3. **Ambiguous-publication proof:** lose registry acknowledgement after successful publish; system reconciles digest/referrers before retry or alias mutation.
4. **Trust/policy freshness proof:** qualify under P1, rotate/revoke trust or policy to P2 and require current requalification while preserving historical P1 evidence.
5. **Multi-platform partial proof:** remove required evidence for one selected child; aggregate release becomes PARTIAL/failed for that profile.
6. **Provider-replacement proof:** migrate bytes + evidence graph + channel binding from provider A to B and independently re-prove subject/trust/policy equivalence.
7. **Rollback-eligibility proof:** retain a prior release, remove one required compatibility/trust/evidence prerequisite and prove rollback is no longer READY.
8. **Offline-closure proof:** verify/install air-gapped from declared closure; remove one trust/policy/evidence/platform-resolution dependency and require explicit INCONCLUSIVE/fail-closed.
9. **Authority proof:** grant Build/evidence-generation authority but deny signing/release/promotion; successful candidate generation must not cross denied facets.
10. **AGWS/AI proof:** Person-level surface requests release/promotion; AI may propose/materialize allowed candidate evidence but independent signing/release/promotion controls deny escalation.

## Value / risk / priority / next question
**Value:** very high — this is the constitutional handoff from reproducible construction into trustworthy, portable product release.
**Risk:** very high if artifact existence, signature existence, old verification, mutable tags or provider publication are mistaken for current release truth.
**Priority:** high.
**Next question:** Deployment / Environment / Runtime should consume a qualified release while preserving release/deployment authority separation and test desired/effective/observed runtime realization, rollout, rollback, provider replacement and offline autonomy.
