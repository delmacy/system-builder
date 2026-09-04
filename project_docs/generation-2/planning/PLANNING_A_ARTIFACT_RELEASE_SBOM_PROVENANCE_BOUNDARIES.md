# Planning A — Artifact / Release / SBOM / Provenance Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Canonical capability: Artifact / Release / SBOM / Provenance

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product code, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic ownership

Artifact / Release / SBOM / Provenance owns the portable semantics by which validated build outputs are adopted as immutable distributable artifacts, grouped into revisioned logical releases, described by SBOM/provenance evidence, signed or attested under qualified trust, promoted through governed release stages/channels, distributed to consumers, admitted or rejected for intended use, withdrawn/revoked, and retained or drained across rollback and provider/registry substitution.

Its source of truth includes:

- canonical `ArtifactIdentity`, distinct from build-output paths, registry coordinates, tags and provider IDs;
- immutable artifact revision/content digest and media/type/profile identity;
- canonical `ReleaseIdentity` and release revision, distinct from artifact bytes and provider promotion records;
- explicit adoption lineage from validated build result to release artifact;
- SBOM statement identity, subject relation, producer/profile revision and coverage/completeness evidence;
- provenance statement identity, producing materials/build evidence references, predicate/profile revision and verification evidence;
- signature/attestation identity and verification result bound to verifier, policy and trust-root revision;
- release-stage/channel identity, promotion request/attempt/result and governing approval/policy revisions;
- distribution publication/replication identities and residual distributed cohorts;
- release qualification/admission evidence for an intended consumer/profile;
- release withdrawal, deprecation, revocation and supersession lineage;
- current rollback eligibility over retained artifact, compatibility, trust, schema/configuration and distribution evidence;
- registry/provider substitution qualification and cutover/drainage evidence.

A build output becomes a release artifact only through an explicit adoption/release transition. A released artifact is not proof of deployment or consumer/runtime effectiveness.

## 2. Canonical identity and immutability

Canonical artifact identity is content/revision bound and remains distinct from provider realization identities such as repository name, registry URL, tag, object key, package coordinate or provider-generated version ID. Those values may be aliases/bindings but are non-canonical unless explicitly adopted by governed policy.

A logical release may reference one or more immutable artifacts for different targets or profiles. Release revision therefore must not be reduced to a mutable tag such as `latest`, `stable` or an environment label. Mutable aliases resolve to immutable release/artifact revisions under current qualified bindings.

Artifact immutability means that changing bytes under the same canonical artifact revision is forbidden. Correction creates a new artifact/release revision or an explicit supersession/withdrawal record; history is preserved.

## 3. Build-to-release adoption and lineage

The portable lineage distinguishes:

`build result validated → release adoption proposed → release authority evaluated → artifacts adopted → SBOM/provenance attached → signatures/attestations produced/verified → release qualified → promoted/published → distributed → consumer admission evaluated → effective consumer/runtime use observed`

Each step is separate. Build success does not imply release qualification. Signature presence does not imply verification success. Registry publication does not imply every intended consumer can retrieve or admit the artifact. Admission does not prove deployment or runtime convergence.

The constitutional truth separation remains:

`build result ≠ released artifact ≠ deployed state ≠ consumer/runtime-effective state`.

## 4. SBOM and provenance ownership

SBOM and provenance are typed evidence statements bound to explicit subjects and producing profiles; they are not unscoped metadata blobs.

SBOM semantics include at minimum statement identity, artifact/release subject, component/material references, relationship scope, generator/profile revision, completeness/coverage assertion and evidence currentness. A syntactically valid SBOM can still be incomplete or inapplicable to a requested qualification.

Provenance semantics include statement identity, artifact subject/digest, producing build/material evidence references, builder/build-profile identity, predicate/profile revision, issuer/attestor identity and verification status. Artifact/Release owns packaging and qualification of this release evidence; Build retains ownership of the underlying build/material/reproducibility truth.

SBOM/provenance formats are interoperable realizations. No single format, predicate schema or vendor registry becomes canonical semantic truth by default.

## 5. Signing, attestation and verification

A signature or attestation is evidence, not authority by mere presence. Qualification requires a current evaluation against intended subject, verifier policy, trust root/path/revocation state, statement/predicate expectations and applicable release policy.

Required separations include:

- signature/attestation produced;
- verifier accepted cryptographic validity;
- signer/attestor currently trusted for the applicable statement type;
- statement subject matches the immutable artifact/release identity;
- required policy predicates are satisfied;
- release/admission authority permits the transition.

Historical verification remains replayable against its producing revisions but does not silently qualify a changed trust root, verifier policy, release policy or artifact subject. Missing, stale, contradictory or unverifiable evidence yields `INCONCLUSIVE` or `DENY` according to superior policy, never implicit allow.

Enterprise Trust / PKI owns trust anchors, certificate/path/revocation and trust-provider lifecycle. Artifact/Release consumes qualified trust evidence and owns the release-specific verification decision.

## 6. Promotion, channels and distribution

Promotion is a governed transition of a canonical release revision into a named stage/channel/profile; it is not a byte mutation. A channel such as candidate/stable/production is an applicability-scoped pointer/eligibility relation to immutable release revisions.

Promotion lineage distinguishes request, authorization, provider acceptance, publication/effect, observation, convergence across required distribution targets and validation. Provider acknowledgement alone is not proof of globally effective promotion.

Distribution may create replicas/copies across registries, mirrors, package repositories, stations or disconnected media. Canonical release identity remains stable while each realization has independent publication, integrity, availability and withdrawal evidence.

Where a registry/promotion/publication mutation times out or returns an ambiguous result, use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`. `UNKNOWN` requires reconciliation before unsafe retry unless operation-specific idempotency is explicitly qualified.

## 7. Admission and consumer qualification

Release qualification and consumer/runtime admission are distinct. Artifact/Release owns evidence that an immutable artifact/release satisfies release/admission predicates for a declared consumer/profile. Deployment/Runtime owns actual realization and effective runtime state.

Admission may depend on artifact digest, SBOM/provenance requirements, signature/attestation verification, trust-root/verifier policy revision, vulnerability/security posture, target compatibility, provider support and superior governance constraints. A previously admitted release may become no longer admissible when controlling revisions change.

The centralized Artifact-to-Runtime Admission proof remains authoritative: intended runtime effectiveness requires the downstream realization plan, bindings, config, trust, schema/contracts, desired/observed generation and runtime evidence in addition to release qualification.

## 8. Withdrawal, revocation, supersession and rollback eligibility

Release withdrawal/revocation is a governed current-state transition, not deletion of historical evidence. Revocation may prevent new admission while already distributed or running cohorts remain present. Those cohorts require explicit observation, containment/drainage or disposition by the appropriate owners.

Rollback eligibility is a current qualified capability, not a historical property of a release. It depends on retained immutable artifacts, current trust/admission status, compatible schema/data/configuration, provider/distribution availability and downstream runtime/recovery constraints.

A withdrawn release can remain historically auditable without remaining eligible for new deployment. A rollback target that was once valid may become `INCONCLUSIVE`, `DENIED` or `UNSUPPORTED` under changed trust, schema, security or provider conditions.

## 9. Provider/registry substitution and residual cohorts

Registry/provider substitution follows `discover → qualify/admit → bind → replicate/publish → verify → cut over → observe → drain/withdraw`.

Equivalent API shape, OCI/package compatibility or tag naming does not prove equivalent immutability, retention, signature/attestation support, replication consistency, deletion/revocation semantics, offline behavior or evidence quality. Provider support differences surface explicitly through qualified support vectors.

Cutover is incomplete while obsolete registries/mirrors/tags/caches/stations can still distribute an artifact as authoritative contrary to current release policy. Residual cohorts must be drained, requalified or explicitly dispositioned. Physical deletion is not required in every case, but authoritative eligibility must be unambiguous.

Provider IDs, registry digests computed under provider-specific envelopes, object versions and publication IDs remain realization identities unless governed adoption explicitly establishes otherwise.

## 10. Failure semantics

Required distinguishable outcomes include:

- validated build output not adopted as a release artifact;
- artifact digest/integrity mismatch;
- SBOM/provenance missing, incomplete, stale or subject-mismatched;
- signature present but verifier/trust/policy qualification fails;
- release authority denied despite technically valid evidence;
- promotion accepted but only partially realized across targets;
- registry publication/revocation outcome ambiguous;
- distribution replica available but integrity/currentness not qualified;
- release withdrawn while residual consumers still retain authoritative eligibility;
- rollback artifact retained but currently incompatible/untrusted/unavailable;
- provider substitution exposes semantic support gaps.

`INCONCLUSIVE` is first-class for insufficient current evidence. Ambiguous mutating effects are `UNKNOWN` and require reconcile-before-retry where duplicate/conflicting publication or revocation is unsafe.

## 11. Capability boundaries

### Build / Dependency Graph / Reproducibility
Build owns material/dependency closure, recipe/toolchain/runner execution, build outputs, caches and reproducibility evidence. Artifact/Release owns adoption of validated outputs into immutable artifact/release identity plus release evidence, promotion and distribution lifecycle. Build provenance facts may be referenced but are not redefined.

### Deployment / Environment / Runtime
Artifact/Release owns release qualification and distributable/admissible artifact truth. Deployment/Runtime owns desired/effective/observed workload placement, rollout, readiness, traffic, scaling and actual rollback realization. Admission is not runtime effectiveness.

### Enterprise Trust / PKI / Certificate Lifecycle
Enterprise Trust owns trust roots/domains, issuance, path/revocation/currentness and trust rotation/substitution. Artifact/Release owns how qualified trust evidence participates in signature/attestation verification and release admission.

### Security / Resilience / Failure Recovery
Security/Resilience owns security posture, compromise containment and recovery qualification. Artifact/Release exposes integrity/provenance/admission/withdrawal facts and consumes current security eligibility. A reproducible signed artifact may still be currently disallowed.

### Provider / Binding / Capability Negotiation
Provider/Binding owns discovery, support qualification, admission, binding, fallback, coexistence and withdrawal of registries/distribution/signing services. Artifact/Release owns required semantic support: immutability, publication, evidence, promotion, replication, revocation and ambiguous-effect behavior.

### Standards / Interoperability / API Contracts
Standards/API Contracts owns format/protocol/schema conformance such as SBOM, provenance, package or registry interoperability. Artifact/Release owns semantic subject identity, evidence applicability and release lifecycle independent of one encoding.

### Lifecycle / Versioning / Evolution / Migration
Lifecycle supplies general revision, coexistence, migration, withdrawal and rollback primitives. Artifact/Release owns release-domain revisions, promotion/supersession, historical retention and current artifact rollback eligibility.

### Governance / Compliance / Audit
Governance owns control/obligation applicability, approvals, exceptions and audit lineage. Artifact/Release consumes those decisions for release/promotion/admission and supplies immutable release evidence; it does not invent policy authority.

### Privacy / Data Governance
Privacy/Data Governance may constrain SBOM/provenance content, distribution locations, retention and deletion/disposition. Artifact/Release cannot leak protected material into public metadata merely for supply-chain convenience.

### Universal Capability Architecture
UCA supplies typed identity, revision vectors, qualified claims/evidence, effect disposition, support vectors, provider bindings, currentness and residual-cohort primitives. It does not absorb Artifact/Release semantic ownership.

## 12. Enterprise → Station → Role → Person and AGWS

Authority remains monotonic. Enterprise may constrain allowed release evidence, trust/verifier policy, promotion channels, registries, distribution locations, rollback eligibility and revocation behavior. Station may specialize only within delegated capability exposure and inherited policy. Role/Person may propose or execute release actions only within explicit authority.

Adaptive Governed Work Surfaces and AI may explain evidence, draft release notes, propose promotion, surface drift or gather qualification inputs. They cannot:

- turn a build output into a canonical release without the owning transition;
- manufacture SBOM/provenance/signature/verification evidence;
- extend stale trust/evidence horizons;
- convert `INCONCLUSIVE` or `DENY` into release approval;
- silently adopt provider tags/IDs as canonical identities;
- grant signing, promotion, revocation, rollback or provider-admin authority;
- bypass Enterprise/Station policy or residual-cohort drainage.

## 13. Non-goals

This capability does not own dependency resolution/build execution, runtime topology/readiness, generic trust-root lifecycle, provider discovery/admission, universal lifecycle mechanics, security posture, governance policy definition, API-standard ownership, data migration or business/domain modeling. It does not mandate OCI, one registry, one SBOM format, one provenance standard, one signer, one CA or one release-channel topology.

## 14. Planning B repository-validation questions

Defer all answers to fresh-main archaeology in Planning B:

1. Does SB represent canonical artifact/release identity separately from build-output paths, registry/tag/provider identities?
2. Is artifact immutability digest-bound, with correction represented as new revision/supersession rather than overwrite?
3. Is there an explicit build-output → release-adoption transition?
4. Are SBOM/provenance statements subject-bound, revisioned and coverage/applicability-qualified?
5. Are signatures/attestations verified against current trust/verifier/release-policy revisions rather than trusted by presence?
6. Are promotion request, authorization, provider acceptance, effective publication and validation observable separately?
7. Can distribution across registries/mirrors/stations preserve canonical identity while tracking independent realization evidence?
8. Are publication/promotion/revocation `UNKNOWN` outcomes reconciled before unsafe retry?
9. Can release withdrawal stop new authoritative admission without erasing historical evidence?
10. Is rollback eligibility recomputed from current artifact/trust/schema/config/provider evidence rather than stored as a permanent flag?
11. Can registry/provider substitution expose semantic support gaps and drain obsolete authoritative cohorts?
12. Are Enterprise → Station → Role → Person and AI/AGWS non-amplification enforced for signing, promotion, revocation and rollback?

No answer is inferred in Planning A.

## 15. Planning A disposition

**PASS_FOR_CAPABILITY.** Artifact / Release / SBOM / Provenance has a distinct semantic owner and bounded relations to adjacent capabilities. Research and synthesis inputs are sufficient for Planning A; no new finding or capability candidate is required. Planning B remains blocked until every canonical capability completes Planning A reconciliation.
