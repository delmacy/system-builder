# Planning B — Artifact / Release / SBOM / Provenance — SB Current State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Artifact / Release / SBOM / Provenance
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact is repository archaeology only. It records current System Builder truth against the Planning A semantic boundary. It does not design Generation 2 target architecture, execute product code, create Work Packages/TASKs, enter Construction, open a PR, or touch worker handoff state.

## 1. Current-state verdict

The current SB has a strong bounded Artifact/Release foundation: content-addressed artifact payloads with integrity verification, canonical release identity, explicit publication, lifecycle state, durable Postgres-backed release/artifact storage and typed provenance extension. It does not yet implement the complete portable owner defined by Planning A for SBOM, signatures/attestations, promotion/distribution/admission qualification, current rollback eligibility, ambiguous remote publication reconciliation or registry/provider substitution with residual-cohort drainage.

The strongest implemented primitives are:

- `ReleaseRegistry` with canonical logical release identity `releaseId@version`, immutable artifact linkage, validation evidence reference and explicit `published -> deprecated -> archived` lifecycle;
- content-addressed artifact payload identity using `sha256:` digests, per-file hashes, canonical aggregate-hash verification and manifest/path reconciliation;
- idempotent artifact publication under the same digest and explicit conflict rejection if different payload content is attempted under an existing artifact hash;
- typed release evidence provenance with evidence identity, sources, capture/author/correlation metadata, transformation descriptor/version, tool/provider observations and predecessor-evidence lineage;
- durable Postgres-backed `ReleaseRecordStorage` and `ArtifactPayloadRepository` implementations in addition to in-memory implementations;
- process-system lineage admission linking a concrete SystemDefinition identity to the exact `releaseId@version` identity;
- downstream deployment/runtime paths that consume the published release plus matching artifact hash rather than treating compiler/build success alone as runtime proof.

These are substantial KEEP foundations. They do not justify inferring SBOM completeness, supply-chain attestation qualification, registry interoperability, promotion semantics or distributed release convergence that the repository does not evidence.

## 2. Evidence from fresh main

### 2.1 Canonical release identity and lifecycle

`packages/release/index.ts` defines `PublishedRelease` with `releaseId`, `version`, `artifactRef`, `artifactHash`, `validationEvidenceRef`, `publishedAt`, status and optional evidence provenance. The registry's identity function is exactly `releaseId@version`; duplicate publication of the same logical release identity is rejected with `RELEASE_DUPLICATE_IDENTITY`.

The current release lifecycle is explicit and monotonic: `published -> deprecated -> archived`. Invalid transitions are rejected. Historical records therefore survive lifecycle advancement rather than being deleted as part of deprecation/archive.

The release identity is distinct from the artifact digest: the logical release is keyed by `releaseId@version`, while `artifactRef` is currently constrained to equal the SHA-256 `artifactHash`. This is a useful canonical-vs-content distinction inside SB and is not a provider registry coordinate.

### 2.2 Artifact immutability and integrity

`packages/artifact-store/index.ts` models payloads as `{ artifactHash, files[] }` where files carry path/content/contentHash. Publication normalizes/sorts files and stores an immutable snapshot. Re-publication under an existing digest is idempotent only if the normalized payload is identical; otherwise it fails with `ARTIFACT_PAYLOAD_CONFLICT`.

`getVerified` checks:

- requested artifact hash is a valid `sha256:` identifier;
- payload hash equals release-artifact hash;
- duplicate file paths are rejected;
- every file content rehashes to its declared `contentHash`;
- payload path set exactly equals the artifact manifest path set;
- aggregate canonical hash over release-artifact metadata plus ordered file hashes equals the expected artifact hash.

This is strong current evidence for bounded artifact immutability/integrity. It is not a generalized SBOM/material inventory: the manifest currently lists generated file paths plus compiler/runtime metadata, not a complete component/material graph with SBOM coverage semantics.

### 2.3 Publication/adoption truth separation

The compiler produces an object named `ReleaseArtifact`, but publication remains a separate explicit `ReleaseRegistry.publish(...)` operation that binds that immutable artifact to `releaseId@version`, validation evidence and publication time. Downstream deploy code consumes `PublishedRelease` plus matching release artifact and hash.

Therefore current package behavior materially preserves `build/compiler result != published release != deployed/effective runtime`, even though the compiler's output type naming compresses the pre-release build-output/adoption distinction noted in Planning A.

Provider acknowledgement is not part of current local release publication semantics. Postgres persistence records SB's canonical release state; it should not be interpreted as an external registry/provider acknowledgement.

### 2.4 Evidence provenance

`packages/release/evidence-provenance.ts` provides a versioned `ReleaseEvidenceProvenance` extension with:

- URI-like `evidenceId`;
- typed sources with source identity/type and optional capture/author/correlation/location metadata;
- optional label/confidence classification;
- transformation descriptors with descriptor version and optional tool/provider observations;
- predecessor-evidence lineage;
- deterministic normalization, exact-field validation, duplicate rejection and stable source/predecessor ordering.

This is real provenance structure and should be KEPT/HARDENED. However it is generic evidence provenance, not a complete in-toto/SLSA-style artifact provenance statement, and it does not itself assert artifact subject digest, builder identity, material closure, predicate profile, attestor trust qualification or completeness/applicability.

### 2.5 Durable storage and provider boundary

`PostgresReleaseRecordStorage` persists release records by canonical `releaseId@version`; `PostgresArtifactPayloadRepository` persists artifact payloads by canonical SHA-256 artifact hash. Both hydrate deterministic in-memory caches from Postgres and reject malformed persisted records.

These implementations prove persistence-provider substitution at a narrow storage interface level: in-memory and Postgres implementations can back the same SB interfaces. They do not establish a generic external artifact registry/provider contract, publication-effect disposition, registry mirroring, signing service, promotion channel, distribution replica model or provider capability negotiation.

The Postgres implementation therefore counts as a current provider-backed persistence realization, not proof of portable registry semantics.

## 3. Planning A validation questions — current answers

1. **Canonical artifact/release identity separate from build-output paths, registry/tag/provider identities?** YES/PARTIAL. `artifactHash` and `releaseId@version` are canonical inside current SB and do not use registry tags/provider IDs. General external registry alias/binding semantics are not evidenced.
2. **Artifact immutability digest-bound with correction as new identity/supersession rather than overwrite?** YES for artifact payload conflict prevention; PARTIAL for release correction/supersession because duplicate `releaseId@version` is rejected but explicit supersession lineage is absent.
3. **Explicit build-output -> release-adoption transition?** PARTIAL. `ReleaseRegistry.publish` is a separate publication/adoption step downstream of compiler output, but compiler output is already named `ReleaseArtifact` and there is no first-class pre-release `BuildResult` identity.
4. **SBOM/provenance subject-bound, revisioned and coverage/applicability-qualified?** PARTIAL/NO. Versioned generic release evidence provenance exists; complete SBOM semantics and subject/coverage/applicability qualification are not evidenced.
5. **Signatures/attestations verified against current trust/verifier/release-policy revisions?** NO evidence found.
6. **Promotion request, authorization, provider acceptance, effective publication and validation separate?** NO generic promotion/distribution lifecycle evidenced.
7. **Distribution across registries/mirrors/stations preserves canonical identity with independent realization evidence?** NO evidence found.
8. **Publication/promotion/revocation UNKNOWN reconciled before unsafe retry?** NO generic remote release-effect model evidenced. Current examined publication is local/in-process or Postgres persistence.
9. **Release withdrawal stops new authoritative admission without erasing history?** PARTIAL. `deprecated` and `archived` preserve history, but no explicit consumer admission/revocation policy semantics are evidenced.
10. **Rollback eligibility recomputed from current artifact/trust/schema/config/provider evidence?** NO release-specific current qualification record evidenced.
11. **Registry/provider substitution exposes support gaps and drains obsolete authoritative cohorts?** NO generic registry substitution/drainage implementation evidenced.
12. **Enterprise -> Station -> Role -> Person and AI/AGWS non-amplification for signing/promotion/revocation/rollback?** NO release-specific hierarchical authority implementation evidenced.

## 4. Maturity assessment

### Implemented / strong bounded baseline

- canonical logical release identity `releaseId@version`;
- SHA-256 content-addressed artifact identity;
- per-file and aggregate artifact integrity verification;
- exact manifest/payload path reconciliation;
- immutable/idempotent same-content artifact publication and conflicting overwrite rejection;
- explicit release publication step;
- release lifecycle `published -> deprecated -> archived`;
- typed versioned evidence provenance with source/transformation/predecessor lineage;
- SystemDefinition-to-release lineage admission;
- Postgres-backed release and artifact persistence behind narrow interfaces;
- downstream artifact-hash continuity into deployment/runtime checks.

### Partial

- build-to-release separation exists operationally, but compiler output is already typed as `ReleaseArtifact`;
- generic evidence provenance exists, but artifact-subject provenance/SBOM completeness and applicability are incomplete;
- release lifecycle preserves history, but correction/supersession/withdrawal semantics are not first-class;
- persistence provider interfaces exist, but external artifact registry/provider negotiation is absent;
- publication is canonical inside SB, but distributed realization/promotion convergence is not represented.

### Not evidenced as current implementation

- canonical SBOM statement/component/material graph with coverage/completeness evidence;
- artifact-subject provenance predicate/profile and builder/material closure semantics;
- signature or attestation production/verification;
- trust-root/verifier/release-policy revision qualification;
- release admission profile/currentness decisions;
- promotion stages/channels and promotion request/authorization/effect lineage;
- external registry publication/mirroring/distribution identities;
- provider acknowledgement vs effective publication/convergence distinction;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` release-effect disposition;
- reconcile-before-retry for ambiguous remote publication/revocation;
- explicit release correction/supersession lineage;
- current rollback eligibility qualification;
- registry/provider semantic support vectors;
- residual registry/mirror/tag/cache/station cohort drainage;
- release-domain Enterprise -> Station -> Role -> Person administration;
- explicit AI/AGWS release-authority non-amplification.

## 5. Portability and providerability

Current artifact/release identities are encouragingly provider-neutral: SHA-256 artifact hashes and SB-owned `releaseId@version` are not Postgres row IDs or external registry coordinates. In-memory and Postgres persistence implementations preserve the same logical contracts.

That supports KEEP/GENERALIZE of current identity and storage-interface decisions. It does not prove OCI/package-registry portability, registry promotion equivalence, signing-service substitution or distributed-replication semantics. No external provider ID should be promoted to canonical identity by inference.

Disposition: KEEP the provider-neutral canonical identities and interface-backed persistence; PROVIDERIZE only the external realization mechanics later if target architecture authorizes them. Provider substitution must be semantic, not merely API-shape compatible.

## 6. Failure and ambiguity semantics

Current local release/artifact paths have explicit deterministic failures for malformed hashes, duplicate release identity, missing release, invalid lifecycle transition, artifact conflict, missing payload, file-hash mismatch, manifest mismatch and aggregate-hash mismatch.

This is strong fail-closed behavior for local current-state operations.

No generic remote publication/promotion/revocation effect path is evidenced, so `UNKNOWN -> reconcile-before-retry` is not currently implemented as an Artifact/Release domain primitive. Planning B records that as a gap rather than inventing a remote registry. If later provider-backed mutating release operations are introduced, current Postgres success alone cannot be treated as proof of provider/global effect.

Likewise, absence of current SBOM/signature/admission evidence must not be converted into PASS. Under Planning A semantics, a request needing such evidence would remain `PARTIAL` or `INCONCLUSIVE` until the required applicable evidence exists.

## 7. Boundary preservation

- **Build / Dependency Graph / Reproducibility** owns materials, dependency closure, recipe/toolchain execution and reproducibility evidence. Current artifact hash and publication records do not retroactively prove generalized build reproducibility.
- **Deployment / Environment / Runtime** owns desired/effective workload realization. Published release existence does not prove runtime deployment or convergence.
- **Storage / Documents / Media** owns general object/document/media lifecycle. `artifact-store` is a release-artifact-specific storage realization, not evidence that Artifact/Release absorbs general storage ownership.
- **Provider / Binding / Capability Negotiation** owns generic provider discovery/admission/support/binding; Artifact/Release owns release-domain semantic requirements.
- **Enterprise Trust / PKI** owns trust-root/path/revocation semantics. No signature/attestation trust claim is inferred from provenance metadata.
- **Governance / Compliance / Audit** owns policy/approval/obligation authority. Release provenance and lifecycle records are evidence inputs, not policy authority.
- **Lifecycle / Versioning / Evolution / Migration** owns generic revision/coexistence/supersession primitives; Artifact/Release owns release-domain application.
- **Security / Resilience / Failure Recovery** owns security posture/recovery qualification. Integrity-qualified artifact bytes do not imply current recovery eligibility.
- **UCA** supplies cross-cutting identity/revision/evidence/effect/support primitives without absorbing Artifact/Release ownership.
- **AGWS/AI** remain non-amplifying: current repository evidence does not grant them signing, publication, deprecation/archive, rollback or provider-admin authority.

## 8. Evidenced dispositions

### KEEP

- SHA-256 content-addressed artifact identity and verification;
- immutable/idempotent artifact publication with conflict rejection;
- canonical `releaseId@version` logical release identity;
- explicit ReleaseRegistry publication and lifecycle;
- evidence provenance normalization and lineage;
- SystemDefinition-to-release lineage validation;
- interface-backed in-memory/Postgres persistence;
- downstream release/artifact hash continuity checks.

### HARDEN

- preserve explicit canonical publication/adoption semantics despite compiler `ReleaseArtifact` naming;
- make provenance claims subject/applicability/coverage explicit rather than treating generic provenance presence as release qualification;
- preserve fail-closed distinction between stored/published record and effective external/consumer state;
- add explicit correction/supersession semantics only when later architecture authorizes them.

### GENERALIZE

- evidence provenance toward qualified artifact-subject provenance/SBOM semantics;
- release lifecycle toward governed withdrawal/supersession/admission semantics;
- artifact/release provider interfaces toward semantic external realization boundaries without replacing working repositories.

### PROVIDERIZE

- current Postgres storage is already a provider-backed persistence implementation behind SB-owned interfaces;
- future external registry/signing/distribution realizations may be providerized only after support/currentness/effect semantics are defined. Planning B does not invent them.

### INTEGRATE

- later integrate release evidence with Build provenance/material truth, Trust verification, Governance approvals, Provider support qualification, Lifecycle revisions and Deployment admission while preserving semantic owners.

### REPLACE

No evidence supports replacing the current release registry, artifact-integrity or persistence foundations.

### DEFER

- complete SBOM model;
- signature/attestation verification;
- promotion/distribution/admission architecture;
- external registry substitution and residual-cohort drainage;
- current rollback-eligibility model;
- remote effect reconciliation.

These belong to later authorized target-architecture work, not Planning B invention.

### DO_NOT_BUILD

- do not build a proprietary package/container registry ecosystem merely to satisfy this capability;
- do not canonize registry tags, provider publication IDs or storage row IDs as portable release identity;
- do not equate provenance metadata presence with trust/admission qualification.

## 9. Reconciliation conclusion

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main contains a strong bounded Artifact/Release implementation: provider-neutral logical release identity, content-addressed immutable artifacts, exact integrity checks, explicit publication/lifecycle, durable persistence and typed evidence provenance. The main gaps are SBOM completeness/applicability, signing/attestation/admission, promotion/distribution effect semantics, correction/supersession, current rollback eligibility, remote ambiguity reconciliation and registry/provider substitution/drainage.

The evidenced path is predominantly **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with narrow existing providerization for persistence, no evidence for replacement and no target architecture invented in this phase.
